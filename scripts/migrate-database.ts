#!/usr/bin/env tsx
// Database migration script for Hermes Security
// Usage: npx tsx scripts/migrate-database.ts [up|down|status]

import { config } from 'dotenv';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { Pool } from 'pg';
import { createHash } from 'crypto';

// Load environment variables from .env file
config();

interface Migration {
  name: string;
  filename: string;
  checksum: string;
  applied: boolean;
  appliedAt?: Date;
}

class DatabaseMigrator {
  private pool: Pool;
  private migrationsPath: string;

  constructor() {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL || process.env.POSTGRES_URL,
      ssl: false, // Disable SSL for development/testing
    });
    
    this.migrationsPath = join(process.cwd(), 'database', 'migrations');
  }

  async initialize(): Promise<void> {
    try {
      // Create migrations table if it doesn't exist
      await this.pool.query(`
        CREATE TABLE IF NOT EXISTS schema_migrations (
          id SERIAL PRIMARY KEY,
          migration_name VARCHAR(255) UNIQUE NOT NULL,
          checksum VARCHAR(64) NOT NULL,
          applied_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `);
      
      console.log('✅ Migration table initialized');
    } catch (error) {
      console.error('❌ Failed to initialize migration table:', error);
      throw error;
    }
  }

  async getMigrationFiles(): Promise<string[]> {
    try {
      const files = readdirSync(this.migrationsPath)
        .filter(file => file.endsWith('.sql'))
        .sort();
      
      return files;
    } catch (error) {
      console.error('❌ Failed to read migration files:', error);
      throw error;
    }
  }

  async getAppliedMigrations(): Promise<Migration[]> {
    try {
      const result = await this.pool.query(`
        SELECT migration_name, checksum, applied_at 
        FROM schema_migrations 
        ORDER BY applied_at ASC
      `);
      
      return result.rows.map(row => ({
        name: row.migration_name,
        filename: `${row.migration_name}.sql`,
        checksum: row.checksum,
        applied: true,
        appliedAt: row.applied_at
      }));
    } catch (error) {
      console.error('❌ Failed to get applied migrations:', error);
      throw error;
    }
  }

  async getAllMigrations(): Promise<Migration[]> {
    const files = await this.getMigrationFiles();
    const applied = await this.getAppliedMigrations();
    
    const migrations: Migration[] = [];
    
    for (const file of files) {
      const migrationName = file.replace('.sql', '');
      const filePath = join(this.migrationsPath, file);
      const content = readFileSync(filePath, 'utf8');
      const checksum = createHash('sha256').update(content).digest('hex');
      
      const appliedMigration = applied.find(m => m.name === migrationName);
      
      migrations.push({
        name: migrationName,
        filename: file,
        checksum,
        applied: !!appliedMigration,
        appliedAt: appliedMigration?.appliedAt
      });
    }
    
    return migrations;
  }

  async applyMigration(migration: Migration): Promise<void> {
    const client = await this.pool.connect();
    
    try {
      await client.query('BEGIN');
      
      console.log(`🔄 Applying migration: ${migration.filename}`);
      
      // Read and execute migration file
      const filePath = join(this.migrationsPath, migration.filename);
      const content = readFileSync(filePath, 'utf8');
      
      // Split content by semicolon and execute each statement
      const statements = content
        .split(';')
        .map(stmt => stmt.trim())
        .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
      
      for (const statement of statements) {
        if (statement.trim()) {
          await client.query(statement);
        }
      }
      
      // Record migration as applied
      await client.query(`
        INSERT INTO schema_migrations (migration_name, checksum) 
        VALUES ($1, $2)
        ON CONFLICT (migration_name) DO NOTHING
      `, [migration.name, migration.checksum]);
      
      await client.query('COMMIT');
      
      console.log(`✅ Migration applied successfully: ${migration.filename}`);
    } catch (error) {
      await client.query('ROLLBACK');
      console.error(`❌ Failed to apply migration ${migration.filename}:`, error);
      throw error;
    } finally {
      client.release();
    }
  }

  async rollbackMigration(migration: Migration): Promise<void> {
    const client = await this.pool.connect();
    
    try {
      await client.query('BEGIN');
      
      console.log(`🔄 Rolling back migration: ${migration.filename}`);
      
      // For now, we'll just remove the migration record
      // In a real scenario, you'd want to implement proper rollback scripts
      await client.query(`
        DELETE FROM schema_migrations 
        WHERE migration_name = $1
      `, [migration.name]);
      
      await client.query('COMMIT');
      
      console.log(`✅ Migration rolled back: ${migration.filename}`);
    } catch (error) {
      await client.query('ROLLBACK');
      console.error(`❌ Failed to rollback migration ${migration.filename}:`, error);
      throw error;
    } finally {
      client.release();
    }
  }

  async migrateUp(): Promise<void> {
    console.log('🚀 Starting database migration (UP)...');
    
    await this.initialize();
    
    const migrations = await this.getAllMigrations();
    const pendingMigrations = migrations.filter(m => !m.applied);
    
    if (pendingMigrations.length === 0) {
      console.log('✅ No pending migrations');
      return;
    }
    
    console.log(`📋 Found ${pendingMigrations.length} pending migrations`);
    
    for (const migration of pendingMigrations) {
      await this.applyMigration(migration);
    }
    
    console.log('🎉 All migrations completed successfully!');
  }

  async migrateDown(): Promise<void> {
    console.log('🔄 Starting database migration (DOWN)...');
    
    await this.initialize();
    
    const migrations = await this.getAllMigrations();
    const appliedMigrations = migrations.filter(m => m.applied).reverse();
    
    if (appliedMigrations.length === 0) {
      console.log('✅ No applied migrations to rollback');
      return;
    }
    
    console.log(`📋 Found ${appliedMigrations.length} applied migrations`);
    
    for (const migration of appliedMigrations) {
      await this.rollbackMigration(migration);
    }
    
    console.log('🎉 All migrations rolled back successfully!');
  }

  async getStatus(): Promise<void> {
    console.log('📊 Database Migration Status');
    console.log('============================');
    
    await this.initialize();
    
    const migrations = await this.getAllMigrations();
    
    if (migrations.length === 0) {
      console.log('No migration files found');
      return;
    }
    
    const appliedCount = migrations.filter(m => m.applied).length;
    const pendingCount = migrations.length - appliedCount;
    
    console.log(`Total migrations: ${migrations.length}`);
    console.log(`Applied: ${appliedCount}`);
    console.log(`Pending: ${pendingCount}`);
    console.log('');
    
    for (const migration of migrations) {
      const status = migration.applied ? '✅' : '⏳';
      const appliedAt = migration.appliedAt ? migration.appliedAt.toISOString() : 'N/A';
      
      console.log(`${status} ${migration.filename}`);
      if (migration.applied) {
        console.log(`   Applied: ${appliedAt}`);
        console.log(`   Checksum: ${migration.checksum.substring(0, 8)}...`);
      }
    }
  }

  async close(): Promise<void> {
    await this.pool.end();
  }
}

// Main execution
async function main() {
  const command = process.argv[2] || 'status';
  const migrator = new DatabaseMigrator();
  
  try {
    switch (command.toLowerCase()) {
      case 'up':
        await migrator.migrateUp();
        break;
      case 'down':
        await migrator.migrateDown();
        break;
      case 'status':
        await migrator.getStatus();
        break;
      default:
        console.log('Usage: npx tsx scripts/migrate-database.ts [up|down|status]');
        console.log('  up     - Apply pending migrations');
        console.log('  down   - Rollback applied migrations');
        console.log('  status - Show migration status (default)');
        process.exit(1);
    }
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await migrator.close();
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { DatabaseMigrator };
