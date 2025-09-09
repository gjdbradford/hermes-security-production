#!/usr/bin/env node
/**
 * Favicon Update Script
 * 
 * This script specifically updates the favicon files in CDN storage
 * with the new favicon from the local files.
 * 
 * Usage: npm run update-favicon
 */

import { config } from 'dotenv';
import { put } from '@vercel/blob';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

// Load environment variables
config({ path: '.env.local' });

interface FaviconUpdateResult {
  file: string;
  success: boolean;
  url?: string;
  error?: string;
}

/**
 * Update a single favicon file in CDN
 */
async function updateFaviconInCDN(fileName: string, localPath: string): Promise<FaviconUpdateResult> {
  try {
    const filePath = join(process.cwd(), 'public', localPath);
    
    if (!existsSync(filePath)) {
      return {
        file: fileName,
        success: false,
        error: `File not found: ${filePath}`
      };
    }
    
    const fileBuffer = readFileSync(filePath);
    
    console.log(`📤 Updating favicon: ${fileName} (${localPath})`);
    
    const { url } = await put(fileName, fileBuffer, {
      access: 'public',
      addRandomSuffix: false,
      allowOverwrite: true
    });
    
    return {
      file: fileName,
      success: true,
      url: url
    };
    
  } catch (error) {
    return {
      file: fileName,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Update all favicon files in CDN
 */
async function updateFavicons(): Promise<void> {
  console.log('🚀 Starting favicon update in Vercel Blob Storage...');
  
  const faviconFiles = [
    { fileName: 'favicon.svg', localPath: 'favicon.svg' },
    { fileName: 'favicon.ico', localPath: 'favicon.ico' }
  ];
  
  const results: FaviconUpdateResult[] = [];
  let successCount = 0;
  let errorCount = 0;
  
  for (const favicon of faviconFiles) {
    const result = await updateFaviconInCDN(favicon.fileName, favicon.localPath);
    results.push(result);
    
    if (result.success) {
      successCount++;
      console.log(`✅ Success: ${favicon.fileName} -> ${result.url}`);
    } else {
      errorCount++;
      console.error(`❌ Failed: ${favicon.fileName} - ${result.error}`);
    }
    
    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  console.log('\n📊 Favicon Update Summary:');
  console.log(`✅ Successful: ${successCount}`);
  console.log(`❌ Failed: ${errorCount}`);
  console.log(`📈 Success Rate: ${Math.round((successCount / faviconFiles.length) * 100)}%`);
  
  if (successCount > 0) {
    console.log('\n🎉 Favicon update complete!');
    console.log('💡 Next steps:');
    console.log('   1. Clear your browser cache to see the new favicon');
    console.log('   2. Test in different browsers');
    console.log('   3. Deploy to production');
  }
}

/**
 * Main execution function
 */
async function main() {
  try {
    // Check if BLOB_READ_WRITE_TOKEN is set
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.error('❌ Error: BLOB_READ_WRITE_TOKEN environment variable is not set');
      console.log('💡 Please set your Vercel Blob token:');
      console.log('   export BLOB_READ_WRITE_TOKEN="your_token_here"');
      process.exit(1);
    }
    
    // Update favicons
    await updateFavicons();
    
  } catch (error) {
    console.error('❌ Favicon update failed:', error);
    process.exit(1);
  }
}

// Run the script if called directly
if (import.meta.main) {
  main();
}
