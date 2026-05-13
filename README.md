# AI Platform Matcher — Apply AI

A Claude-powered tool that helps organisations find which AI platform fits how they actually work — Salesforce AI, Microsoft Copilot, Google Gemini, or a bespoke build.

**Live tool:** [Drishti-Chauhan.github.io/ai-platform-matcher](https://Drishti-Chauhan.github.io/ai-platform-matcher)

---

## How it works

1. User answers 5 questions about their organisation's workflows, tech stack, and priorities
2. Frontend sends answers to the backend API
3. Backend calls Claude (Anthropic) to reason about the answers and generate a personalised recommendation
4. User gets a platform recommendation with reasoning, next actions, and honest caveats

---

## Structure

```
ai-platform-matcher/
├── frontend/
│   ├── index.html      # UI structure
│   ├── style.css       # Styling
│   └── app.js          # Quiz logic + API calls
├── backend/
│   ├── server.js       # Express server + Anthropic API call
│   ├── package.json
│   └── .env.example    # Copy to .env and add your key
├── .gitignore
└── README.md
```

---

## Running locally

**Backend:**
```bash
cd backend
cp .env.example .env
# Add your ANTHROPIC_API_KEY to .env
npm install
node server.js
```

**Frontend:**
Open `frontend/index.html` in your browser — it auto-detects localhost and points to your local backend.

---

## Deployment

- **Frontend** → GitHub Pages (this repo)
- **Backend** → Railway.app (free tier)

After deploying the backend, update the `API_URL` in `frontend/app.js` with your Railway URL.

---

Built by [Apply AI](https://applyai.uk) — we help organisations build and embed AI that actually works.
