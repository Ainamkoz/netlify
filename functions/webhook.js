const express = require('express');
const crypto = require('crypto');

const app = express();
const port = process.env.PORT || 3000;


const apiKey = "t5spL8Mpi82G9CWfX2hbg2k33EA95Mhy2EE7qpLb"; 
const webhookSecretKey = "1f9ae895-3777-46d2-b9bf-485f6eacb927";

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello, this is your webhook receiver!');
});

app.post('/webhook', (req, res) => {
    const signature = req.get('X-Signature');
    const apiKeyHeader = req.get('X-API-Key');

    if (!signature) {
        return res.status(400).send("Missing X-Signature header");
    }

    if (!apiKeyHeader || apiKeyHeader !== apiKey) {
        return res.status(401).send("Invalid API key");
    }

    const data = req.body; // Assuming the data is a JSON object in the request body

    if (!verifySignature(data, signature, webhookSecretKey)) {
        return res.status(401).send("Invalid signature");
    }

    handleWebhookData(data);

    return res.status(200).send("Webhook received successfully");
});

function verifySignature(data, signature, secretKey) {
    const stringifiedData = JSON.stringify(data);
    const hashed = crypto.createHmac('sha256', secretKey).update(stringifiedData, 'utf-8').digest('hex');
    return crypto.timingSafeEqual(Buffer.from(signature, 'hex'), Buffer.from(hashed, 'hex'));
}

function handleWebhookData(data) {
    console.log('Webhook Data:', data);
}

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
