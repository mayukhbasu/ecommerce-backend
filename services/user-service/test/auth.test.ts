import chai from 'chai';
import chaiHttp from 'chai-http';
import { MongoClientOptions } from 'mongodb';
import app from "../src/index";
import mongoose from 'mongoose';
import User from '../src/models/User';
import redisMock from 'redis-mock';
import session from 'express-session';
import connectRedis from 'connect-redis';

const { expect } = chai;
chai.use(chaiHttp);

// Use the Redis mock instead of the real Redis client.
const RedisStore = connectRedis(session);
const redisClient = redisMock.createClient();

// Setup the app to use the mock Redis store.
app.use(
    session({
        store: new RedisStore({ client: redisClient as any }),
        secret: 'yourSecretKey',
        resave: false,
        saveUninitialized: true,
        cookie: {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        }
    })
);

describe('Auth Routes', () => {
  before(async() => {
    await mongoose.connect('mongodb://localhost:27017/registration', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    } as MongoClientOptions)
  });

  after(async() => {
    await mongoose.disconnect();
    
  });
  
  beforeEach(async () => {
    await User.deleteMany({})
  });

  it('should create a new user', (done) => {
    chai.request(app).post('/auth/register')
    .send({username: 'testuser', email: 'testuser@example.com', password: 'password123'})
    .end((err, res) => {
      expect(res.status).to.equal(201);
      expect(res.body.message).to.equal('User registered successfully');
      done();
    })
  });

  it('should not register a user with an existing email', async () => {
    // First register a user
    await chai.request(app).post('/auth/register').send({ username: 'testuser', email: 'testuser@example.com', password: 'password123' });

    // Try registering again with the same email
    const res = await chai.request(app).post('/auth/register').send({ username: 'testuser2', email: 'testuser@example.com', password: 'password123' });
    expect(res.status).to.equal(400);
    expect(res.body.error).to.equal('User already exists');
  });
});
