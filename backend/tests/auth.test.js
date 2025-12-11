import request from 'supertest';
import mongoose from 'mongoose';
import app from '../server.js';
import db from '../db.js';

describe('Auth Endpoints', () => {
    beforeAll(async () => {
        // Tests will use the test database configured in server.js
        // Wait for connection to be ready
        const maxAttempts = 10;
        let attempts = 0;
        while (mongoose.connection.readyState !== 1 && attempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 500));
            attempts++;
        }
        if (mongoose.connection.readyState !== 1) {
            console.warn('MongoDB not connected - tests may fail');
        }
    });

    afterAll(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
    });

    describe('POST /api/auth/register', () => {
        it('should register a new user', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    email: 'test@example.com',
                    password: 'password123',
                    name: 'Test User',
                    role: 'patient'
                });
            expect(res.statusCode).toEqual(201);
            expect(res.body).toHaveProperty('token');
            expect(res.body.user).toHaveProperty('email', 'test@example.com');
        });

        it('should not register a duplicate user', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    email: 'test@example.com',
                    password: 'password123',
                    name: 'Test User',
                    role: 'patient'
                });
            expect(res.statusCode).toEqual(400);
        });
    });

    describe('POST /api/auth/login', () => {
        it('should login with valid credentials', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'test@example.com',
                    password: 'password123'
                });
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('token');
        });

        it('should not login with invalid password', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'test@example.com',
                    password: 'wrongpassword'
                });
            expect(res.statusCode).toEqual(401);
        });
    });
});
