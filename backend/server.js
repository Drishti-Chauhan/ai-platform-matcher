const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const Anthropic = require('@anthropic-ai/sdk');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

app.post('/api/recommend', async (req, res) => {
  const { answers } = req.body;

  if (!answers || answers.length !== 5) {
    return res.status(400).json({ error: 'Invalid answers' });
  }

  const questions = [
    "What does your team's daily workflow live inside?",
    "What's the primary AI use case you're trying to solve?",
    "How mature is your organisation's existing tech stack?",
    "Who will primarily be using the AI day-to-day?",
    "What's your organisation's biggest AI concern right now?"
  ];

  const answerSummary = answers.map((a, i) => `Q${i+1}: "${questions[i]}" → "${a}"`).join('\n');

  try {
    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1000,
      messages: [{
        role: 'user',
        content: `You are an enterprise AI platform advisor at Apply AI, a consultancy that does both technical AI builds and business change. Recommend one of: Salesforce AI, Microsoft Copilot, Google Gemini, or Build Bespoke.

ANSWERS:
${answerSummary}

Return ONLY valid JSON, no markdown, no backticks:
{"platform":"Salesforce AI","platform_key":"salesforce","confidence":"Strong fit","headline":"One sentence max 12 words","reasoning":"2-3 sentences specific to their answers, warm and positive tone","three_actions":["Action 1","Action 2","Action 3"],"watch_out":"One honest caveat 1-2 sentences","apply_ai_note":"One sentence how Apply AI helps, genuine not salesy"}`
      }]
    });

    const result = JSON.parse(response.content[0].text.trim());
    res.json(result);

  } catch (err) {
    console.error('Anthropic error:', err.message);
    res.status(500).json({ error: 'Failed to get recommendation' });
  }
});

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
