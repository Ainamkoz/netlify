// netlify/functions/webhook.js

const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');

const app = express();
const port = process.env.PORT || 3000;

const webhookSecretKey = '1f9ae895-3777-46d2-b9bf-485f6eacb927';

app.use(bodyParser.json());

app.post('/netlify/functions/webhook', (req, res) => {
  const payload = JSON.stringify(req.body);
  const timestamp = req.header('X-Signature-Timestamp');
  const signatureHeader = req.header('X-Signature');

  if (!verifyWebhookSignature(payload, timestamp, signatureHeader)) {
    return res.status(403).send('Invalid signature');
  }

  // Process the webhook data according to your requirements
  // You can save it to a database or log it for further processing
  console.log('Webhook received:', req.body);

  res.status(200).send('Webhook received successfully');
});

function verifyWebhookSignature(payload, timestamp, signatureHeader) {
  const expectedSignature = crypto
    .createHmac('sha256', webhookSecretKey)
    .update(timestamp + '.' + payload)
    .digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(expectedSignature, 'hex'),
    Buffer.from(signatureHeader, 'hex')
  );
}

module.exports = app;
