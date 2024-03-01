const express = require('express');
const crypto = require('crypto');

const app = express();
const port = process.env.PORT || 3000;

// Заданные ключ и ключ подписи

const apiKey = "t5spL8Mpi82G9CWfX2hbg2k33EA95Mhy2EE7qpLb"; 
const webhookSecretKey = "1f9ae895-3777-46d2-b9bf-485f6eacb927";

app.use(express.json());

// Обработчик вебхука
app.post('/webhook', (req, res) => {
    // Проверка наличия подписи и API ключа в заголовках запроса
    const signature = req.get('X-Signature');
    const apiKeyHeader = req.get('X-API-Key');

    if (!signature) {
        return res.status(400).send("Missing X-Signature header");
    }

    if (!apiKeyHeader || apiKeyHeader !== apiKey) {
        return res.status(401).send("Invalid API key");
    }

    // Чтение данных из тела запроса
    const data = req.body;

    // Верификация подписи
    if (!verifySignature(data, signature, webhookSecretKey)) {
        return res.status(401).send("Invalid signature");
    }

    // Обработка данных в соответствии с документацией API
    handleWebhookData(data);

    return res.status(200).send("Webhook received successfully");
});

// Функция для верификации подписи
function verifySignature(data, signature, secretKey) {
    const hashed = crypto.createHmac('sha256', secretKey).update(JSON.stringify(data)).digest('hex');
    return crypto.timingSafeEqual(Buffer.from(signature, 'hex'), Buffer.from(hashed, 'hex'));
}

// Функция для обработки данных в соответствии с документацией API
function handleWebhookData(data) {
    // Добавьте код для обработки данных и сохранения их в базу данных или вывода в логи
    console.log('Webhook Data:', data);
}

// Запуск сервера
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
