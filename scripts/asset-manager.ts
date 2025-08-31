#!/usr/bin/env node
/**
 * Asset Manager Script
 * 
 * This script provides various asset management utilities:
 * - Upload assets to CDN
 * - Check asset status
 * - Sync assets
 * - Watch for new assets
 * 
 * Usage: 
 *   npm run assets:upload
 *   npm run assets:status
 *   npm run assets:sync
 *   npm run assets:watch
 */

import { config } from 'dotenv';
import { uploadAssetsToCDN, updateAssetConfigWithCDN } from './upload-assets';

// Load environment variables
config({ path: '.env.local' });
import { ASSET_CONFIG, getAssetStats } from '../src/config/assets';
import { watch } from 'fs';
import { join } from 'path';

/**
 * Display asset status
 */
function displayAssetStatus() {
  console.log('📊 Asset Status Report');
  console.log('='.repeat(50));
  
  const stats = getAssetStats();
  console.log(`Total Assets: ${stats.total}`);
  console.log(`With CDN URLs: ${stats.withCdn}`);
  console.log(`Without CDN URLs: ${stats.withoutCdn}`);
  console.log(`CDN Coverage: ${stats.cdnPercentage}%`);
  
  console.log('\n📋 Asset Details:');
  console.log('-'.repeat(50));
  
  ASSET_CONFIG.forEach(asset => {
    const status = asset.cdnUrl ? '✅' : '❌';
    const cdnStatus = asset.cdnUrl ? 'CDN' : 'Local';
    console.log(`${status} ${asset.name} (${asset.category}) - ${cdnStatus}`);
    if (asset.cdnUrl) {
      console.log(`   URL: ${asset.cdnUrl}`);
    }
  });
}

/**
 * Sync assets (upload + update config)
 */
async function syncAssets() {
  console.log('🔄 Syncing assets...');
  
  try {
    const uploadResults = await uploadAssetsToCDN();
    await updateAssetConfigWithCDN(uploadResults);
    
    console.log('✅ Asset sync complete!');
    displayAssetStatus();
    
  } catch (error) {
    console.error('❌ Sync failed:', error);
    process.exit(1);
  }
}

/**
 * Watch for new assets
 */
function watchAssets() {
  console.log('👀 Watching for new assets...');
  console.log('Press Ctrl+C to stop watching');
  
  const assetDirs = [
    'public/images/logos',
    'public/images/backgrounds',
    'public/images/icons',
    'public/images/social',
    'public/images/case-studies'
  ];
  
  assetDirs.forEach(dir => {
    const fullPath = join(process.cwd(), dir);
    
    try {
      watch(fullPath, { recursive: true }, async (eventType, filename) => {
        if (eventType === 'rename' && filename) {
          console.log(`\n🆕 New asset detected: ${filename}`);
          console.log('⏳ Waiting for file to be fully written...');
          
          // Wait for file to be fully written
          setTimeout(async () => {
            try {
              console.log('🔄 Auto-syncing assets...');
              await syncAssets();
            } catch (error) {
              console.error('❌ Auto-sync failed:', error);
            }
          }, 2000);
        }
      });
      
      console.log(`👁️  Watching: ${dir}`);
    } catch (error) {
      console.warn(`⚠️  Could not watch ${dir}:`, error);
    }
  });
}

/**
 * Upload assets only
 */
async function uploadOnly() {
  console.log('📤 Uploading assets to CDN...');
  
  try {
    const uploadResults = await uploadAssetsToCDN();
    console.log('✅ Upload complete!');
    
    // Show summary
    const successCount = uploadResults.filter(r => r.success).length;
    const errorCount = uploadResults.filter(r => !r.success).length;
    
    console.log(`\n📊 Upload Summary:`);
    console.log(`✅ Successful: ${successCount}`);
    console.log(`❌ Failed: ${errorCount}`);
    
  } catch (error) {
    console.error('❌ Upload failed:', error);
    process.exit(1);
  }
}

/**
 * Main function
 */
async function main() {
  const command = process.argv[2];
  
  switch (command) {
    case 'upload':
      await uploadOnly();
      break;
      
    case 'status':
      displayAssetStatus();
      break;
      
    case 'sync':
      await syncAssets();
      break;
      
    case 'watch':
      watchAssets();
      break;
      
    default:
      console.log('🛠️  Asset Manager');
      console.log('='.repeat(30));
      console.log('Usage: bun run scripts/asset-manager.ts <command>');
      console.log('');
      console.log('Commands:');
      console.log('  upload  - Upload assets to CDN');
      console.log('  status  - Show asset status');
      console.log('  sync    - Upload and update config');
      console.log('  watch   - Watch for new assets');
      console.log('');
      console.log('Examples:');
      console.log('  bun run scripts/asset-manager.ts upload');
      console.log('  bun run scripts/asset-manager.ts status');
      console.log('  bun run scripts/asset-manager.ts sync');
      console.log('  bun run scripts/asset-manager.ts watch');
      break;
  }
}

// Run the script if called directly
if (import.meta.main) {
  main();
}
