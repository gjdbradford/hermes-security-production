#!/usr/bin/env tsx
// Database health check script for Hermes Security
// Usage: npx tsx scripts/database-health-check.ts

import { config } from 'dotenv';
import { Pool } from 'pg';

// Load environment variables from .env file
config();

interface HealthCheckResult {
  status: 'healthy' | 'unhealthy';
  responseTime: number;
  database: {
    connected: boolean;
    version: string;
    uptime: string;
  };
  tables: {
    hermes_leads: boolean;
    schema_migrations: boolean;
    audit_log: boolean;
  };
  indexes: {
    count: number;
    status: string;
  };
  connections: {
    active: number;
    idle: number;
    total: number;
  };
  errors?: string[];
}

class DatabaseHealthChecker {
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL || process.env.POSTGRES_URL,
      ssl: false, // Disable SSL for development/testing
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    });
  }

  async performHealthCheck(): Promise<HealthCheckResult> {
    const startTime = Date.now();
    const errors: string[] = [];
    const result: HealthCheckResult = {
      status: 'healthy',
      responseTime: 0,
      database: {
        connected: false,
        version: 'unknown',
        uptime: 'unknown',
      },
      tables: {
        hermes_leads: false,
        schema_migrations: false,
        audit_log: false,
      },
      indexes: {
        count: 0,
        status: 'unknown',
      },
      connections: {
        active: 0,
        idle: 0,
        total: 0,
      },
    };

    try {
      // Test basic connection
      const client = await this.pool.connect();

      try {
        // Get database version and uptime
        const versionResult = await client.query('SELECT version()');
        result.database.version = versionResult.rows[0].version.split(' ')[1]; // Extract version number

        const uptimeResult = await client.query('SELECT pg_postmaster_start_time()');
        const startTime = uptimeResult.rows[0].pg_postmaster_start_time;
        const uptime = Date.now() - startTime.getTime();
        result.database.uptime = this.formatUptime(uptime);

        result.database.connected = true;

        // Check if required tables exist
        const tablesResult = await client.query(`
          SELECT table_name 
          FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name IN ('hermes_leads', 'schema_migrations', 'audit_log')
        `);

        const existingTables = tablesResult.rows.map(row => row.table_name);
        result.tables.hermes_leads = existingTables.includes('hermes_leads');
        result.tables.schema_migrations = existingTables.includes('schema_migrations');
        result.tables.audit_log = existingTables.includes('audit_log');

        // Check indexes
        const indexesResult = await client.query(`
          SELECT COUNT(*) as index_count
          FROM pg_indexes 
          WHERE schemaname = 'public' 
          AND tablename = 'hermes_leads'
        `);

        result.indexes.count = parseInt(indexesResult.rows[0].index_count);
        result.indexes.status = result.indexes.count >= 10 ? 'optimal' : 'needs_attention';

        // Check connection pool status
        result.connections.active = this.pool.totalCount - this.pool.idleCount;
        result.connections.idle = this.pool.idleCount;
        result.connections.total = this.pool.totalCount;

        // Check for any critical issues
        if (!result.tables.hermes_leads) {
          errors.push('hermes_leads table missing');
        }

        if (!result.tables.schema_migrations) {
          errors.push('schema_migrations table missing');
        }

        if (result.indexes.count < 8) {
          errors.push('Insufficient indexes on hermes_leads table');
        }

        if (result.connections.total >= 18) {
          errors.push('Connection pool near capacity');
        }

        // Test a simple query on hermes_leads if table exists
        if (result.tables.hermes_leads) {
          try {
            await client.query('SELECT COUNT(*) FROM hermes_leads LIMIT 1');
          } catch (error) {
            errors.push(
              `hermes_leads table query failed: ${error instanceof Error ? error.message : 'Unknown error'}`
            );
          }
        }
      } finally {
        client.release();
      }
    } catch (error) {
      errors.push(
        `Database connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
      result.database.connected = false;
    }

    result.responseTime = Date.now() - startTime;
    result.errors = errors.length > 0 ? errors : undefined;

    if (errors.length > 0) {
      result.status = 'unhealthy';
    }

    return result;
  }

  private formatUptime(ms: number): string {
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));
    const hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  }

  async close(): Promise<void> {
    await this.pool.end();
  }
}

// Main execution
async function main() {
  const checker = new DatabaseHealthChecker();

  try {
    console.log('🏥 Hermes Security Database Health Check');
    console.log('========================================');

    const health = await checker.performHealthCheck();

    // Display results
    console.log(
      `\n📊 Overall Status: ${health.status === 'healthy' ? '✅ HEALTHY' : '❌ UNHEALTHY'}`
    );
    console.log(`⏱️  Response Time: ${health.responseTime}ms`);

    console.log('\n🗄️  Database Info:');
    console.log(`   Connected: ${health.database.connected ? '✅' : '❌'}`);
    console.log(`   Version: ${health.database.version}`);
    console.log(`   Uptime: ${health.database.uptime}`);

    console.log('\n📋 Tables:');
    console.log(`   hermes_leads: ${health.tables.hermes_leads ? '✅' : '❌'}`);
    console.log(`   schema_migrations: ${health.tables.schema_migrations ? '✅' : '❌'}`);
    console.log(`   audit_log: ${health.tables.audit_log ? '✅' : '❌'}`);

    console.log('\n🔍 Indexes:');
    console.log(`   Count: ${health.indexes.count}`);
    console.log(
      `   Status: ${health.indexes.status === 'optimal' ? '✅' : '⚠️'} ${health.indexes.status}`
    );

    console.log('\n🔗 Connections:');
    console.log(`   Active: ${health.connections.active}`);
    console.log(`   Idle: ${health.connections.idle}`);
    console.log(`   Total: ${health.connections.total}`);

    if (health.errors && health.errors.length > 0) {
      console.log('\n❌ Issues Found:');
      health.errors.forEach(error => {
        console.log(`   • ${error}`);
      });
    }

    console.log('\n' + '='.repeat(40));

    // Exit with appropriate code
    process.exit(health.status === 'healthy' ? 0 : 1);
  } catch (error) {
    console.error('❌ Health check failed:', error);
    process.exit(1);
  } finally {
    await checker.close();
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { DatabaseHealthChecker };
