#!/usr/bin/env node
/**
 * Asset Upload Script
 *
 * This script uploads all configured assets to Vercel Blob Storage (CDN)
 * and updates the asset configuration with CDN URLs.
 *
 * Usage: npm run assets:upload
 */

import { config } from 'dotenv';
import { put } from '@vercel/blob';

// Load environment variables
config({ path: '.env.local' });
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { ASSET_CONFIG, AssetConfig } from '../src/config/assets';

interface UploadResult {
  id: string;
  url: string;
  success: boolean;
  error?: string;
  size?: number;
}

/**
 * Upload a single asset to Vercel Blob Storage
 */
async function uploadAsset(asset: AssetConfig): Promise<UploadResult> {
  try {
    const filePath = join(process.cwd(), 'public', asset.localPath);

    if (!existsSync(filePath)) {
      return {
        id: asset.id,
        url: '',
        success: false,
        error: `File not found: ${filePath}`
      };
    }

    const fileBuffer = readFileSync(filePath);
    const fileName = asset.localPath.split('/').pop() || asset.id;

    console.log(`📤 Uploading: ${asset.name} (${asset.localPath})`);

    const { url } = await put(fileName, fileBuffer, {
      access: 'public',
      addRandomSuffix: false
    });

    return {
      id: asset.id,
      url: url,
      success: true,
      size: fileBuffer.length
    };

  } catch (error) {
    return {
      id: asset.id,
      url: '',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Get content type based on file extension
 */
function getContentType(filePath: string): string {
  const extension = filePath.split('.').pop()?.toLowerCase();

  const contentTypes: Record<string, string> = {
    'svg': 'image/svg+xml',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'webp': 'image/webp',
    'ico': 'image/x-icon',
    'pdf': 'application/pdf',
    'doc': 'application/msword',
    'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  };

  return contentTypes[extension || ''] || 'application/octet-stream';
}

/**
 * Upload all assets to CDN
 */
export async function uploadAssetsToCDN(): Promise<UploadResult[]> {
  console.log('🚀 Starting asset upload to Vercel Blob Storage...');
  console.log(`📊 Total assets to upload: ${ASSET_CONFIG.length}`);

  const results: UploadResult[] = [];
  let successCount = 0;
  let errorCount = 0;

  for (const asset of ASSET_CONFIG) {
    const result = await uploadAsset(asset);
    results.push(result);

    if (result.success) {
      successCount++;
      console.log(`✅ Success: ${asset.name} -> ${result.url}`);
    } else {
      errorCount++;
      console.error(`❌ Failed: ${asset.name} - ${result.error}`);
    }

    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  console.log('\n📊 Upload Summary:');
  console.log(`✅ Successful: ${successCount}`);
  console.log(`❌ Failed: ${errorCount}`);
  console.log(`📈 Success Rate: ${Math.round((successCount / ASSET_CONFIG.length) * 100)}%`);

  return results;
}

/**
 * Update asset configuration with CDN URLs
 */
export async function updateAssetConfigWithCDN(uploadResults: UploadResult[]): Promise<void> {
  console.log('\n🔄 Updating asset configuration with CDN URLs...');

  const updatedConfig = ASSET_CONFIG.map(asset => {
    const result = uploadResults.find(r => r.id === asset.id);

    if (result?.success) {
      return {
        ...asset,
        cdnUrl: result.url,
        lastUpdated: new Date().toISOString()
      };
    }

    return asset;
  });

  // Generate new asset configuration file
  const configContent = `/**
 * Asset Configuration System
 * 
 * This file manages all static assets (images, documents, etc.) for the application.
 * Assets are stored in a CDN and referenced by their full URLs for optimal performance.
 * 
 * Last updated: ${new Date().toISOString()}
 */

export interface AssetConfig {
  id: string;
  name: string;
  category: 'logo' | 'background' | 'icon' | 'social' | 'case-study' | 'document';
  localPath: string;
  cdnUrl?: string;
  alt: string;
  width?: number;
  height?: number;
  optimized?: boolean;
  lastUpdated: string;
  description?: string;
}

/**
 * Master asset configuration
 * Add new assets here and run \`npm run assets:sync\` to upload to CDN
 */
export const ASSET_CONFIG: AssetConfig[] = ${JSON.stringify(updatedConfig, null, 2)};

/**
 * Get asset URL by ID
 * Returns CDN URL if available, otherwise falls back to local path
 */
export const getAssetUrl = (id: string): string => {
  const asset = ASSET_CONFIG.find(a => a.id === id);
  if (!asset) {
    console.warn(\`Asset not found: \${id}\`);
    return '';
  }
  
  // Use CDN URL if available, fallback to local path
  return asset.cdnUrl || \`/\${asset.localPath}\`;
};

/**
 * Get asset configuration by ID
 */
export const getAssetConfig = (id: string): AssetConfig | undefined => {
  return ASSET_CONFIG.find(a => a.id === id);
};

/**
 * Get all assets by category
 */
export const getAssetsByCategory = (category: AssetConfig['category']): AssetConfig[] => {
  return ASSET_CONFIG.filter(a => a.category === category);
};

/**
 * Find asset ID by local path
 */
export const findAssetIdByPath = (path: string): string | null => {
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  const asset = ASSET_CONFIG.find(a => a.localPath === cleanPath);
  return asset?.id || null;
};

/**
 * Check if asset has CDN URL
 */
export const hasCdnUrl = (id: string): boolean => {
  const asset = getAssetConfig(id);
  return Boolean(asset?.cdnUrl);
};

/**
 * Get asset statistics
 */
export const getAssetStats = () => {
  const total = ASSET_CONFIG.length;
  const withCdn = ASSET_CONFIG.filter(a => a.cdnUrl).length;
  const withoutCdn = total - withCdn;
  
  return {
    total,
    withCdn,
    withoutCdn,
    cdnPercentage: Math.round((withCdn / total) * 100)
  };
};
`;

  const configPath = join(process.cwd(), 'src', 'config', 'assets.ts');
  const fs = await import('fs/promises');
  await fs.writeFile(configPath, configContent);

  console.log('✅ Asset configuration updated!');
  console.log(`📁 Updated file: ${configPath}`);
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

    // Upload all assets
    const uploadResults = await uploadAssetsToCDN();

    // Update configuration with CDN URLs
    await updateAssetConfigWithCDN(uploadResults);

    console.log('\n🎉 Asset upload and configuration update complete!');
    console.log('💡 Next steps:');
    console.log('   1. Test your application to ensure images load correctly');
    console.log('   2. Deploy to production');
    console.log('   3. Verify CDN URLs work in production environment');

  } catch (error) {
    console.error('❌ Upload failed:', error);
    process.exit(1);
  }
}

// Run the script if called directly
if (import.meta.main) {
  main();
}
