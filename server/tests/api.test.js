import request from 'supertest';
import app from '../server.js';

describe('VoteSaathi API Endpoints', () => {
  
  // Test Election Dates
  it('GET /api/election/dates should return election dates', async () => {
    const res = await request(app).get('/api/election/dates');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body.length).toBeGreaterThan(0);
  });

  // Test Candidate Search (Valid)
  it('GET /api/election/candidates should return candidates for Mumbai', async () => {
    const res = await request(app).get('/api/election/candidates?constituency=Mumbai');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  // Test Booth Locator (Valid)
  it('GET /api/election/booths should return booths for valid zip', async () => {
    const res = await request(app).get('/api/election/booths?zip=400001');
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  // Test Booth Locator (Invalid Zip - Security Test)
  it('GET /api/election/booths should fail for invalid zip format', async () => {
    const res = await request(app).get('/api/election/booths?zip=abc');
    expect(res.statusCode).toEqual(400);
    expect(res.body.errors).toBeDefined();
  });

  // Test AI Chat (Validation Test)
  it('POST /api/ai/chat should fail if message is missing', async () => {
    const res = await request(app)
      .post('/api/ai/chat')
      .send({ history: [] });
    expect(res.statusCode).toEqual(400);
  });

});
