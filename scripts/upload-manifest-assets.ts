#!/usr/bin/env node
/**
 * Manifest Asset Upload Script
 *
 * This script uploads the manifest file and favicon assets to Vercel Blob Storage
 * to fix the 401 errors when loading these assets in production.
 *
 * Usage: npm run assets:upload-manifest
 */

import { config } from 'dotenv';
import { put } from '@vercel/blob';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

// Load environment variables
config({ path: '.env.local' });

interface UploadResult {
  fileName: string;
  url: string;
  success: boolean;
  error?: string;
  size?: number;
}

/**
 * Upload a single asset to Vercel Blob Storage
 */
async function uploadAsset(filePath: string, fileName: string): Promise<UploadResult> {
  try {
    if (!existsSync(filePath)) {
      return {
        fileName,
        url: '',
        success: false,
        error: `File not found: ${filePath}`
      };
    }

    const fileBuffer = readFileSync(filePath);

    console.log(`📤 Uploading: ${fileName}`);

    const { url } = await put(fileName, fileBuffer, {
      access: 'public'
    });

    return {
      fileName,
      url: url,
      success: true,
      size: fileBuffer.length
    };

  } catch (error) {
    return {
      fileName,
      url: '',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Upload all manifest-related assets
 */
async function uploadManifestAssets(): Promise<UploadResult[]> {
  console.log('🚀 Starting manifest asset upload to Vercel Blob Storage...');

  const assets = [
    {
      localPath: 'site.webmanifest',
      fileName: 'site.webmanifest'
    },
    {
      localPath: 'favicon.ico',
      fileName: 'favicon.ico'
    },
    {
      localPath: 'public/images/icons/favicon.svg',
      fileName: 'favicon.svg'
    }
  ];

  const results: UploadResult[] = [];
  let successCount = 0;
  let errorCount = 0;

  for (const asset of assets) {
    const filePath = join(process.cwd(), asset.localPath);
    const result = await uploadAsset(filePath, asset.fileName);
    results.push(result);

    if (result.success) {
      successCount++;
      console.log(`✅ Success: ${asset.fileName} -> ${result.url}`);
    } else {
      errorCount++;
      console.error(`❌ Failed: ${asset.fileName} - ${result.error}`);
    }

    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  console.log('\n📊 Upload Summary:');
  console.log(`✅ Successful: ${successCount}`);
  console.log(`❌ Failed: ${errorCount}`);
  console.log(`📈 Success Rate: ${Math.round((successCount / assets.length) * 100)}%`);

  return results;
}

/**
 * Generate updated manifest file with CDN URLs
 */
async function generateUpdatedManifest(cdnBaseUrl: string): Promise<void> {
  console.log('\n🔄 Generating updated manifest file with CDN URLs...');

  const manifestContent = `{
  "name": "Hermes Security - AI-Driven Penetration Testing",
  "short_name": "Hermes Security",
  "description": "AI-accelerated penetration testing with ethical human oversight for European enterprises",
  "start_url": "./",
  "display": "standalone",
  "background_color": "#0f172a",
  "theme_color": "#1e3a8a",
  "orientation": "portrait-primary",
  "scope": "./",
  "lang": "en",
  "dir": "ltr",
  "categories": ["security", "business", "technology"],
  "icons": [
    {
      "src": "${cdnBaseUrl}/favicon.svg",
      "sizes": "any",
      "type": "image/svg+xml",
      "purpose": "any"
    },
    {
      "src": "${cdnBaseUrl}/favicon.ico",
      "sizes": "32x32",
      "type": "image/x-icon"
    }
  ]
}`;

  const manifestPath = join(process.cwd(), 'site.webmanifest');
  const fs = await import('fs/promises');
  await fs.writeFile(manifestPath, manifestContent);

  console.log('✅ Manifest file updated with CDN URLs!');
  console.log(`📁 Updated file: ${manifestPath}`);
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

    // Upload manifest assets
    const uploadResults = await uploadManifestAssets();

    // Get CDN base URL from successful uploads
    const cdnBaseUrl = uploadResults.find(r => r.success)?.url?.split('/').slice(0, -1).join('/');

    if (cdnBaseUrl) {
      // Generate updated manifest with CDN URLs
      await generateUpdatedManifest(cdnBaseUrl);

      console.log('\n🎉 Manifest asset upload and configuration update complete!');
      console.log('💡 Next steps:');
      console.log('   1. Commit the updated manifest file');
      console.log('   2. Deploy to production');
      console.log('   3. Verify favicon and manifest load without 401 errors');
      console.log('   4. Test the contact form submission');
    } else {
      console.error('❌ No assets were uploaded successfully. Cannot update manifest.');
      process.exit(1);
    }

  } catch (error) {
    console.error('❌ Upload failed:', error);
    process.exit(1);
  }
}

// Run the script if called directly
if (import.meta.main) {
  main();
}
