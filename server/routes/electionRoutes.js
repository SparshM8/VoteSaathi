import express from 'express';
import { query, body } from 'express-validator';
import { getCandidates, getElectionDates, saveReminder, getBooths } from '../controllers/electionController.js';
import { cacheMiddleware } from '../cache.js';

const router = express.Router();

// Cache election dates for 1 hour (rarely changes)
router.get('/candidates', cacheMiddleware(600), [
    query('constituency').optional().trim().escape()
], getCandidates);

router.get('/dates', cacheMiddleware(3600), getElectionDates);

router.get('/booths', cacheMiddleware(600), [
    query('zip').notEmpty().isNumeric().isLength({ min: 6, max: 6 })
], getBooths);

router.post('/reminders', [
    body('userId').optional().trim().escape(),
    body('eventName').notEmpty().trim().escape(),
    body('date').isISO8601()
], saveReminder);

export default router;
