import { validationResult } from 'express-validator';
import { getDB } from '../db.js';

const MOCK_CANDIDATES = [
  { name: "Sarthak Mittal", party: "Digital India Party", constituency: "Mumbai South", vision: "Blockchain-based transparent governance and youth digital literacy." },
  { name: "Sarah Chen", party: "Green Alliance", constituency: "Mumbai South", vision: "Urban forest initiatives and 100% solar-powered street lighting." },
  { name: "James Wilson", party: "National Progress", constituency: "Delhi Central", vision: "Infrastructure modernization and tech-led healthcare." }
];

const MOCK_DATES = [
  { event: "Voter Registration Deadline", date: "2026-04-30" },
  { event: "General Election Phase 1", date: "2026-05-15" },
  { event: "General Election Phase 2", date: "2026-05-22" }
];

const MOCK_BOOTHS = [
  { zip: "110001", name: "Central High School", address: "Sector 4, MG Road, New Delhi" },
  { zip: "400001", name: "St. Xavier's Polling Center", address: "Fort Area, South Mumbai" },
  { zip: "400001", name: "Municipality Hall", address: "Near Gateway of India, Mumbai" }
];

export const getCandidates = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { constituency } = req.query;
  const db = getDB();
  
  if (db) {
    try {
      const candidates = await db.collection('CandidateData').find(
        constituency ? { constituency: new RegExp(constituency, 'i') } : {}
      ).toArray();
      if (candidates.length > 0) return res.json(candidates);
    } catch (e) { console.error('DB fetch failed, falling back to mock'); }
  }

  // Fallback to Mock
  if (constituency) {
    const filtered = MOCK_CANDIDATES.filter(c => c.constituency.toLowerCase().includes(constituency.toLowerCase()));
    return res.json(filtered);
  }
  res.json(MOCK_CANDIDATES);
};

export const getElectionDates = async (req, res) => {
  const db = getDB();
  if (db) {
    try {
      const dates = await db.collection('ElectionDates').find({}).toArray();
      if (dates.length > 0) return res.json(dates);
    } catch (e) {}
  }
  res.json(MOCK_DATES);
};

export const getBooths = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { zip } = req.query;
  if (!zip) return res.status(400).json({ error: 'Zip code required' });
  
  const results = MOCK_BOOTHS.filter(b => b.zip === zip);
  res.json(results);
};

export const saveReminder = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { userId, eventId, eventName, date } = req.body;
    const db = getDB();
    if (db) {
      await db.collection('Reminders').insertOne({
        userId: userId || 'anonymous',
        eventId,
        eventName,
        date,
        createdAt: new Date()
      });
    }
    res.json({ success: true, message: 'Reminder synced successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save reminder.' });
  }
};
