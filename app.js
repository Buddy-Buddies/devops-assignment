const { PrismaClient } = require('@prisma/client');
const express = require('express');
const redis = require('redis');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = 3000;

const prisma = new PrismaClient();
const redisClient = redis.createClient({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
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

app.get('/user/:email', checkCache, async (req, res) => {
    try {
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

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
})