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

    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      safetySettings: [
        { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      ]
    });

    const chat = model.startChat({
      history: history || [],
      generationConfig: {
        maxOutputTokens: 800,
        temperature: 0.7,
      },
    });

    const prompt = `System: You are "VoteSaathi", an expert AI civic mentor dedicated to empowering Indian citizens. 
    Your mission is to provide accurate, unbiased, and easy-to-understand information about:
    1. The voter registration process and eligibility.
    2. How to find polling stations and use EVM/VVPAT machines.
    3. Understanding the roles of various elected officials (MP, MLA, Corporator).
    4. Explaining democratic concepts like NOTA, First-Past-The-Post, and Model Code of Conduct.
    
    Guidelines:
    - Be non-partisan: Never support or oppose any specific political party or candidate.
    - Be encouraging: Motivate citizens to participate in the democratic process.
    - Be concise but thorough: Use bullet points for steps.
    - If a query is outside the scope of Indian elections or civic duties, politely redirect the user.
    
    User Query: ${message}`;

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

    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      safetySettings: [
        { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      ]
    });

    const prompt = `System: You are an expert fact-checker specializing in Indian elections and civic information. 
    Analyze the provided news content or claim for credibility.
    
    Response Format:
    Verdict: [Likely True / Suspicious / Fake]
    Reasoning: [Provide a brief, clear explanation of why the content is classified this way. Mention official sources if applicable, like the Election Commission of India (ECI).]
    
    Guidelines:
    - If the content is true, confirm it with facts.
    - If it's fake or suspicious, explain the misinformation clearly.
    - Maintain a neutral, professional, and helpful tone.
    
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
