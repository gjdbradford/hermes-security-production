#!/usr/bin/env npx tsx

/**
 * CORS Proxy Server for Local Development
 * 
 * This server acts as a proxy between your local development server
 * and the 8n8 webhook to bypass CORS restrictions.
 * 
 * Usage:
 * 1. Start this server: npx tsx scripts/cors-proxy-server.ts
 * 2. Update your contactApi.ts to use http://localhost:3001/proxy
 * 3. Test your contact form
 */

import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
const PORT = 3001;

// Enable CORS for all routes
app.use(cors({
  origin: ['http://localhost:8080', 'http://localhost:3000', 'http://127.0.0.1:8080'],
  credentials: true
}));

// Parse JSON bodies
app.use(express.json());

// Proxy endpoint
app.post('/proxy', async (req, res) => {
  console.log('🔄 Proxying request to 8n8 webhook...');
  console.log('📊 Request body:', JSON.stringify(req.body, null, 2));
  
  try {
    const webhookUrl = 'https://ilovemylife.app.n8n.cloud/webhook-test/a57cf53e-c2d6-4e59-8e38-44b774355629';
    
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Hermes-Source': 'cors-proxy-server',
        'X-Original-Origin': req.headers.origin || 'unknown'
      },
      body: JSON.stringify(req.body)
    });

    console.log(`📡 Webhook response: ${response.status} ${response.statusText}`);
    
    const responseText = await response.text();
    console.log('📄 Response body:', responseText);

    // Set CORS headers
    res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, X-Hermes-Source');
    
    res.status(response.status).send(responseText);
    
  } catch (error) {
    console.error('❌ Proxy error:', error);
    res.status(500).json({
      success: false,
      error: 'Proxy server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'CORS Proxy Server'
  });
});

// Start server
app.listen(PORT, () => {
  console.log('🚀 CORS Proxy Server Started');
  console.log('================================');
  console.log(`📍 Server: http://localhost:${PORT}`);
  console.log(`🔄 Proxy endpoint: http://localhost:${PORT}/proxy`);
  console.log(`❤️  Health check: http://localhost:${PORT}/health`);
  console.log('');
  console.log('📋 To use this proxy:');
  console.log('1. Update contactApi.ts to use this proxy URL');
  console.log('2. Test your contact form');
  console.log('3. Check console for webhook responses');
  console.log('');
  console.log('Press Ctrl+C to stop the server');
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down CORS proxy server...');
  process.exit(0);
});
