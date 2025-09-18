#!/usr/bin/env npx tsx

/**
 * Simple CORS Proxy Server for Local Development
 *
 * This server acts as a proxy to bypass CORS issues when testing
 * the contact form submission in local development.
 *
 * Usage:
 * 1. Run: npx tsx scripts/cors-proxy-server.ts
 * 2. In browser console: localStorage.setItem('hermes-use-cors-proxy', 'true')
 * 3. Refresh the page and test the form
 */

import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
const PORT = 3001;

// Enable CORS for all routes
app.use(
  cors({
    origin: ['http://localhost:8080', 'http://127.0.0.1:8080'],
    credentials: true,
  })
);

// Parse JSON bodies
app.use(express.json());

// Proxy endpoint
app.post('/proxy', async (req, res) => {
  try {
    console.log('🔄 Proxying request to webhook...');
    console.log('📊 Request data:', req.body);

    // Forward the request to the actual webhook
    const webhookUrl =
      'https://ilovemylife.app.n8n.cloud/webhook-test/a57cf53e-c2d6-4e59-8e38-44b774355629';

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Hermes-Source': 'website-contact-form',
        'X-Hermes-Environment': 'development',
        'X-Hermes-Version': '1.0.0',
      },
      body: JSON.stringify(req.body),
    });

    console.log('📡 Webhook response status:', response.status);

    const responseText = await response.text();
    console.log('📄 Webhook response:', responseText);

    // Forward the response back to the client
    res.status(response.status);
    res.set('Content-Type', 'application/json');
    res.send(responseText);
  } catch (error) {
    console.error('❌ Proxy error:', error);
    res.status(500).json({
      success: false,
      error: 'Proxy server error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'CORS proxy server is running' });
});

app.listen(PORT, () => {
  console.log(`🚀 CORS Proxy Server running on http://localhost:${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/health`);
  console.log(`🔄 Proxy endpoint: http://localhost:${PORT}/proxy`);
  console.log('');
  console.log('To use this proxy:');
  console.log('1. Open browser console');
  console.log('2. Run: localStorage.setItem("hermes-use-cors-proxy", "true")');
  console.log('3. Refresh the page and test the contact form');
  console.log('');
  console.log('To disable proxy:');
  console.log('localStorage.removeItem("hermes-use-cors-proxy")');
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down CORS proxy server...');
  process.exit(0);
});
