const questions = [
  {
    q: "What does your team's daily workflow live inside?",
    sub: "Where do most people spend the majority of their working day?",
    options: [
      { label: "Slack and Salesforce CRM", desc: "Customer comms, pipeline management, deal tracking", value: "Slack and Salesforce CRM" },
      { label: "Microsoft 365 — Teams, Outlook, Word, Excel", desc: "Documents, emails, spreadsheets, internal comms", value: "Microsoft 365 — Teams, Outlook, Word, Excel" },
      { label: "Google Workspace — Gmail, Docs, Sheets, Meet", desc: "Google's productivity suite across the organisation", value: "Google Workspace — Gmail, Docs, Sheets, Meet" },
      { label: "A mix — no single dominant platform", desc: "Different teams use different tools", value: "A mix — no single dominant platform" }
    ]
  },
  {
    q: "What's the primary AI use case you're trying to solve?",
    sub: "What would make the biggest difference to how your team operates?",
    options: [
      { label: "Customer-facing workflows", desc: "Sales automation, CRM insights, client comms, pipeline intelligence", value: "Customer-facing workflows" },
      { label: "Internal productivity and document work", desc: "Drafting, summarising, meeting notes, data analysis in spreadsheets", value: "Internal productivity and document work" },
      { label: "Collaboration and search across company knowledge", desc: "Finding information, cross-team projects, real-time collaboration", value: "Collaboration and search across company knowledge" },
      { label: "Developer and technical workflows", desc: "Code generation, API integrations, building internal tools", value: "Developer and technical workflows" }
    ]
  },
  {
    q: "How mature is your organisation's existing tech stack?",
    sub: "How deeply are you committed to your current software ecosystem?",
    options: [
      { label: "Heavily invested in Salesforce ecosystem", desc: "Service Cloud, Marketing Cloud, or multi-year Salesforce contracts", value: "Heavily invested in Salesforce ecosystem" },
      { label: "Microsoft-first — Azure, M365, Active Directory", desc: "Deep Microsoft infrastructure, enterprise agreements in place", value: "Microsoft-first — Azure, M365, Active Directory" },
      { label: "Cloud-native or Google Cloud Platform user", desc: "GCP, BigQuery, or strong Google Workspace adoption already", value: "Cloud-native or Google Cloud Platform user" },
      { label: "Relatively platform-agnostic or early stage", desc: "No major lock-in, open to switching or building fresh", value: "Relatively platform-agnostic or early stage" }
    ]
  },
  {
    q: "Who will primarily be using the AI day-to-day?",
    sub: "Which teams need AI capability most urgently?",
    options: [
      { label: "Sales, marketing, and customer success teams", desc: "Revenue-generating roles dealing with clients and pipeline", value: "Sales, marketing, and customer success teams" },
      { label: "Operations, finance, and knowledge workers", desc: "People working in documents, data, and internal processes", value: "Operations, finance, and knowledge workers" },
      { label: "Cross-functional teams and project collaborators", desc: "People who work across departments and need shared context", value: "Cross-functional teams and project collaborators" },
      { label: "Technical and engineering teams", desc: "Developers, data scientists, IT — building things", value: "Technical and engineering teams" }
    ]
  },
  {
    q: "What's your organisation's biggest AI concern right now?",
    sub: "What's the thing keeping your leadership up at night about AI adoption?",
    options: [
      { label: "Making sure AI connects to our customer data safely", desc: "Data governance, CRM integration, client confidentiality", value: "Making sure AI connects to our customer data safely" },
      { label: "Security, compliance, and enterprise governance", desc: "IT controls, data residency, regulatory requirements", value: "Security, compliance, and enterprise governance" },
      { label: "Speed of adoption and getting teams to actually use it", desc: "Change management, ease of use, rolling it out at scale", value: "Speed of adoption and getting teams to actually use it" },
      { label: "Building something bespoke rather than off-the-shelf", desc: "Custom workflows, proprietary data, unique requirements", value: "Building something bespoke rather than off-the-shelf" }
    ]
  }
];

const API_URL = 'http://localhost:3000';

let currentQ = 0, answers = [], selectedValue = null;

function startQuiz() {
  document.getElementById('intro').classList.add('hidden');
  document.getElementById('quiz').classList.remove('hidden');
  renderQuestion();
}

function renderQuestion() {
  const q = questions[currentQ];
  document.getElementById('progress-fill').style.width = (((currentQ + 1) / questions.length) * 100) + '%';
  document.getElementById('progress-label').textContent = `Question ${currentQ + 1} of ${questions.length}`;
  selectedValue = null;

  document.getElementById('question-screen').innerHTML = `
    <p class="q-number">Question ${currentQ + 1}</p>
    <h2 class="q-text">${q.q}</h2>
    <p class="q-sub">${q.sub}</p>
    <div class="options">
      ${q.options.map((o, i) => `
        <button class="option-btn" id="opt-${i}" onclick="selectOption(${i}, '${o.value}')">
          <div class="option-indicator" id="ind-${i}"></div>
          <div><div class="option-label">${o.label}</div><div class="option-desc">${o.desc}</div></div>
        </button>`).join('')}
    </div>
    <button class="btn-next" id="btn-next" onclick="nextQuestion()">
      ${currentQ < questions.length - 1 ? 'Next question →' : 'Get my recommendation →'}
    </button>`;
}

function selectOption(idx, value) {
  document.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
  document.getElementById(`opt-${idx}`).classList.add('selected');
  selectedValue = value;
  document.getElementById('btn-next').classList.add('visible');
}

function nextQuestion() {
  if (!selectedValue) return;
  answers.push(selectedValue);
  if (currentQ < questions.length - 1) {
    currentQ++;
    renderQuestion();
  } else {
    document.getElementById('quiz').classList.add('hidden');
    document.getElementById('loading').classList.remove('hidden');
    getRecommendation();
  }
}

async function getRecommendation() {
  try {
    const res = await fetch(`${API_URL}/api/recommend`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers })
    });

    if (!res.ok) throw new Error('Server error');
    const result = await res.json();
    showResult(result);

  } catch(e) {
    document.getElementById('loading').classList.add('hidden');
    document.getElementById('result').innerHTML = `
      <div style="text-align:center;padding:40px 0">
        <h3 style="font-family:'DM Serif Display',serif;font-size:22px;margin-bottom:12px">Something went wrong</h3>
        <p style="color:var(--ink-soft);margin-bottom:24px">Couldn't connect to the server. Please try again.</p>
        <button class="btn-restart" onclick="location.reload()">Try again</button>
      </div>`;
    document.getElementById('result').classList.remove('hidden');
  }
}

const colors = { salesforce:'#00A1E0', microsoft:'#00BCF2', google:'#4285F4', bespoke:'#4B3FD8' };

function showResult(r) {
  document.getElementById('loading').classList.add('hidden');
  const c = colors[r.platform_key] || '#4B3FD8';
  document.getElementById('result').innerHTML = `
    <p class="result-eyebrow">Your recommendation</p>
    <span class="result-platform-badge" style="background:${c}20;color:${c};border:1px solid ${c}40">
      <span style="width:8px;height:8px;border-radius:50%;background:${c};display:inline-block"></span>
      ${r.platform} · ${r.confidence}
    </span>
    <h2 class="result-title">${r.headline}</h2>
    <div class="result-card"><h4>Why this fits your organisation</h4><p>${r.reasoning}</p></div>
    <div class="result-card"><h4>Three things to do next</h4><div class="result-recs">
      ${r.three_actions.map(a=>`<div class="rec-item"><div class="rec-bullet"></div><span>${a}</span></div>`).join('')}
    </div></div>
    <div class="caveat-box"><strong>One thing to watch:</strong> ${r.watch_out}</div>
    <div class="cta-card">
      <div><strong>Want a second opinion?</strong><p>${r.apply_ai_note} No pitch, no deck.</p></div>
      <button class="btn-cta" onclick="window.open('mailto:hello@applyai.uk?subject=Platform Matcher: ${encodeURIComponent(r.platform)}')">Get in touch</button>
    </div>
    <button class="btn-restart" onclick="location.reload()">← Start over</button>`;
  document.getElementById('result').classList.remove('hidden');
}
