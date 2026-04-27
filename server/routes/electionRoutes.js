import express from 'express';
import { query, body } from 'express-validator';
import { getCandidates, getElectionDates, saveReminder, getBooths } from '../controllers/electionController.js';

const router = express.Router();

router.get('/candidates', [
    query('constituency').optional().trim().escape()
], getCandidates);

router.get('/dates', getElectionDates);

router.get('/booths', [
    query('zip').notEmpty().isNumeric().isLength({ min: 6, max: 6 })
], getBooths);

router.post('/reminders', [
    body('userId').optional().trim().escape(),
    body('eventName').notEmpty().trim().escape(),
    body('date').isISO8601()
], saveReminder);

export default router;
