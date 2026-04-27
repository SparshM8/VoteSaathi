/**
 * @file aiController.js
 * @description Logic for handling AI interactions using Google Gemini API, including Chat and Fact-Checking.
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import { validationResult } from 'express-validator';
import { getDB } from '../db.js';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const getChatResponse = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  try {
    const { message, history, userId } = req.body;

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
      return res.status(500).json({ error: 'Gemini API Key not configured.' });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const chat = model.startChat({
      history: history || [],
      generationConfig: {
        maxOutputTokens: 500,
      },
    });

    const prompt = `You are "VoteSaathi", a smart civic mentor. Your goal is to educate users about the election process, voter rights, and civic engagement. Be encouraging, clear, and simplify complex terms for first-time voters. User says: ${message}`;

    const result = await chat.sendMessage(prompt);
    const response = await result.response;
    const text = response.text();

    // Save to MongoDB
    const db = getDB();
    if (db) {
      await db.collection('Queries').insertOne({
        userId: userId || 'anonymous',
        query: message,
        response: text,
        timestamp: new Date()
      });
    }

    res.json({ text });
  } catch (error) {
    console.error('AI Chat Error:', error);
    res.status(500).json({ error: 'Failed to get AI response.' });
  }
};

/**
 * Analyzes news content for credibility using AI.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
export const detectFakeNews = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  try {
    const { newsContent, userId } = req.body;

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
      return res.status(500).json({ error: 'Gemini API Key not configured.' });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `Act as a fact-checker and civic expert. Analyze the following news content related to elections and determine its credibility. 
    You MUST classify the news into one of these three categories:
    1. Likely True
    2. Suspicious
    3. Fake
    
    Provide your verdict followed by a brief, clear explanation. Use a friendly but professional tone.
    
    News Content: "${newsContent}"`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Save to MongoDB
    const db = getDB();
    if (db) {
      await db.collection('FakeNewsReports').insertOne({
        userId: userId || 'anonymous',
        content: newsContent,
        analysis: text,
        timestamp: new Date()
      });
    }

    res.json({ analysis: text });
  } catch (error) {
    console.error('Fake News Detector Error:', error);
    res.status(500).json({ error: 'Failed to analyze news.' });
  }
};
