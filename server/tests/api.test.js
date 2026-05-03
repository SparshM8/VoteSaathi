import request from 'supertest';
import app from '../server.js';

describe('VoteSaathi API Endpoints', () => {
  
  // ── 1. ELECTION ENDPOINTS ────────────────────────────
  it('GET /api/election/dates should return election dates', async () => {
    const res = await request(app).get('/api/election/dates');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('GET /api/election/candidates should return candidates for Mumbai', async () => {
    const res = await request(app).get('/api/election/candidates?constituency=Mumbai');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  it('GET /api/election/booths should return booths for valid zip', async () => {
    const res = await request(app).get('/api/election/booths?zip=400001');
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('GET /api/election/booths should fail for invalid zip format', async () => {
    const res = await request(app).get('/api/election/booths?zip=abc');
    expect(res.statusCode).toEqual(400);
  });

  // ── 2. AI ENDPOINTS ───────────────────────────────────
  it('POST /api/ai/chat should fail if message is missing', async () => {
    const res = await request(app)
      .post('/api/ai/chat')
      .send({ history: [] });
    expect(res.statusCode).toEqual(400);
  });

  it('POST /api/ai/fake-news-detector should fail for short content', async () => {
    const res = await request(app)
      .post('/api/ai/fake-news-detector')
      .send({ newsContent: 'short' });
    expect(res.statusCode).toEqual(400);
  });

  // ── 3. SECURITY TESTS ─────────────────────────────────
  it('Should have security headers (Helmet)', async () => {
    const res = await request(app).get('/');
    expect(res.headers['x-dns-prefetch-control']).toBeDefined();
    expect(res.headers['x-frame-options']).toBeDefined();
    expect(res.headers['content-security-policy']).toBeDefined();
  });

  it('Should handle CORS correctly', async () => {
    const res = await request(app)
      .options('/api/election/dates')
      .set('Origin', 'http://example.com');
    expect(res.headers['access-control-allow-origin']).toBeDefined();
  });

  it('Config endpoint should be restricted in production', async () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    process.env.ALLOWED_ORIGINS = 'trusted.com';
    
    const res = await request(app)
      .get('/api/config/keys')
      .set('Origin', 'http://malicious.com');
    
    expect(res.statusCode).toEqual(403);
    
    // Cleanup
    process.env.NODE_ENV = originalEnv;
    delete process.env.ALLOWED_ORIGINS;
  });

});
