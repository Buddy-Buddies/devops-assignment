const express = require('express');
const redis = require('redis');
const dotenv = require('dotenv');
const { PrismaClient } = require('@prisma/client');
const client = require('prom-client');

dotenv.config();

const app = express();
const port = 9100;

const prisma = new PrismaClient();
const redisClient = redis.createClient({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
});

// Define a counter metric for tracking the number of requests
const requestsCounter = new client.Counter({
    name: 'app_requests_total',
    help: 'Total number of requests to the application',
});

const checkCache = (req, res, next) => {
    const { userId } = req.params;
    redisClient.get(userId, (err, data) => {
        if (err) throw err;
        if (data !== null) {
            res.send(JSON.parse(data));
        } else {
            next();
        }
    });
};

// Root path handler
app.get('/', (req, res) => {
    res.send('Welcome to the application!');
});

app.get('/user/:email', checkCache, async (req, res) => {
    try {
        // Increment the requests counter for each request
        requestsCounter.inc();

        const { email } = req.params;
        const user = await prisma.user.findUnique({
            where: {
                email: email,
            },
        });
        if (!user) {
            return res.status(404).send('User not found');
        }
        redisClient.setex(userId, 3600, JSON.stringify(user));
        res.status(200).json(user);
    } catch (err) {
        console.log(err);
        res.status(500).send('Server Error');
    }
});

// Expose metrics endpoint
app.get('/metrics', (req, res) => {
    const message = 'Metrics endpoint exposed';
    res.set('Content-Type', client.register.contentType);
    res.end(`${message}\n\n${client.register.metrics()}`);
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
