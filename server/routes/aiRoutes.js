import express from 'express';
import { body } from 'express-validator';
import { getChatResponse, detectFakeNews } from '../controllers/aiController.js';

const router = express.Router();

router.post('/chat', [
    body('message').trim().isLength({ min: 1, max: 1000 }).escape(),
    body('history').optional().isArray()
], getChatResponse);

router.post('/fake-news-detector', [
    body('newsContent').trim().isLength({ min: 10, max: 5000 }).escape()
], detectFakeNews);

export default router;
