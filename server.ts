import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', app: 'Beyond Finance Manager' });
});

// AI Financial Assistant Endpoint
app.post('/api/ai/financial-advisor', async (req, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(400).json({
        error: 'GEMINI_API_KEY is not configured in the environment variables.',
        financialSummary: 'Please configure your Gemini API Key in AI Studio settings to unlock automated AI insights.',
        savingSuggestions: [
          'Set up recurring auto-transfers into a high-yield savings account.',
          'Review subscriptions monthly and eliminate unused business services.'
        ],
        expenseReductions: [
          'Negotiate bulk vendor discounts for high-volume inventory purchases.',
          'Optimize electricity and utility usage across branch offices.'
        ],
        futurePredictions: [
          'Projected steady 8-12% growth in monthly net profit based on income history.',
          'Anticipated higher utility costs during upcoming summer peak months.'
        ]
      });
    }

    const { transactions, partnerStats, budgets, currency, userPrompt } = req.body;

    const ai = new GoogleGenAI({ apiKey });

    const systemInstruction = `You are Beyond AI, an expert Chief Financial Officer and Financial Advisor for Beyond Finance Manager.
Provide clear, actionable, high-precision financial guidance for individuals and multi-partner business teams.
Structure your output as valid JSON matching this schema:
{
  "financialSummary": "A concise, professional 2-3 sentence overview of the current financial health, net margin, and cash flow balance.",
  "savingSuggestions": ["Bullet point 1", "Bullet point 2", "Bullet point 3"],
  "expenseReductions": ["Specific expense reduction strategy 1", "Specific expense reduction strategy 2"],
  "futurePredictions": ["Forecast prediction 1 with numerical context", "Forecast prediction 2"],
  "answer": "Direct detailed answer to the user query if provided, or general advisory summary."
}
Do NOT wrap in markdown backticks if possible, return raw JSON string.`;

    const promptContext = `
Currency: ${currency || 'USD'}
User Specific Question / Goal: ${userPrompt || 'Provide an overall financial audit and strategy.'}
Financial Overview:
- Recent Transactions Summary: ${JSON.stringify(transactions ? transactions.slice(0, 15) : [])}
- Partner Capital & Profit Metrics: ${JSON.stringify(partnerStats || {})}
- Monthly Category Budgets: ${JSON.stringify(budgets || [])}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: promptContext,
      config: {
        systemInstruction,
        responseMimeType: 'application/json'
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error('Empty response received from Gemini model');
    }

    try {
      const parsed = JSON.parse(text);
      return res.json(parsed);
    } catch {
      return res.json({
        financialSummary: text.substring(0, 300),
        savingSuggestions: ['Maintain emergency cash reserves equal to 3 months of operating expenses.'],
        expenseReductions: ['Audit vendor software licenses and consolidate duplicate tools.'],
        futurePredictions: ['Monthly expense trend shows stability over the next quarter.'],
        answer: text
      });
    }
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    return res.status(500).json({
      error: error.message || 'Failed to generate financial analysis',
      financialSummary: 'Unable to connect to AI engine at the moment.',
      savingSuggestions: ['Audit top 3 expense categories monthly.'],
      expenseReductions: ['Review software subscriptions and recurring costs.'],
      futurePredictions: ['Maintain positive cash reserves to cushion against volatility.']
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Beyond Finance Manager server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
