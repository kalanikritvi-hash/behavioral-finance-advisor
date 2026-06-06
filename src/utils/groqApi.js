// Groq API integration — uses groq-sdk with llama-3.3-70b-versatile.
// Key is read from VITE_GROQ_API_KEY in .env (never user-supplied or persisted).

import Groq from 'groq-sdk'
import { getRankedBiases, getTopBiases } from './biasScoring.js'
import { BIAS_DEFINITIONS } from '../data/biasDefinitions.js'

const ECONOMIC_CONTEXT = `Current economic environment (mid-2026): Federal funds rate around 4.25–4.5%; high-yield savings accounts offering 4–5% APY; S&P 500 up ~12% YTD but with elevated volatility; inflation at ~2.8%, cooling but still above the 2% target; labor market resilient with low unemployment though some tech/startup layoffs; housing costs remain elevated in most metros with limited inventory; a strong argument exists for passive index fund investing for long-term investors versus active stock picking.`

function getClient() {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY
  if (!apiKey || apiKey === 'your_groq_api_key_here') {
    throw new Error('VITE_GROQ_API_KEY is not set in .env')
  }
  return new Groq({ apiKey, dangerouslyAllowBrowser: true })
}

function buildIncomeDesc(profile) {
  const map = {
    under_1k: 'under $1,000/month', '1k_2500': '$1,000–$2,500/month',
    '2500_5k': '$2,500–$5,000/month', '5k_8k': '$5,000–$8,000/month',
    '8k_15k': '$8,000–$15,000/month', over_15k: 'over $15,000/month',
  }
  return map[profile.monthlyIncome] || 'unknown income'
}

function buildProfile(profile) {
  const debtList = Array.isArray(profile.debtTypes)
    ? profile.debtTypes.filter((d) => d !== 'none').join(', ') || 'none'
    : 'unknown'
  const worries = Array.isArray(profile.financialWorries)
    ? profile.financialWorries.join(', ')
    : 'unknown'

  return `
USER PROFILE:
- Name: ${profile.name || 'Not provided'}
- Age range: ${profile.ageRange}
- Employment: ${profile.employment}
- Dependents: ${profile.dependents}
- Monthly take-home income: ${buildIncomeDesc(profile)}
- Monthly expense ratio: ${profile.expenseRatio}
- Emergency fund: ${profile.emergencyFund}
- Debt types: ${debtList}
- Investing status: ${profile.investingStatus}
- 1-year goal: ${profile.goal1yr}
- 3-year goal: ${profile.goal3yr}
- 10-year goal: ${profile.goal10yr}
- Main financial worries: ${worries}
- Financial mood (1–5): ${profile.financialMood}
- Financial news frequency: ${profile.newsFrequency}
- Financial decision confidence (1–5): ${profile.decisionConfidence}
- Personal situation (their own words): ${profile.personalSituation || 'Not provided'}
- Current financial decision they face: ${profile.currentDecision || 'None specified'}
`.trim()
}

function buildBiasSection(biasScores) {
  const ranked = getRankedBiases(biasScores)
  const lines = ranked.map((b) => `- ${b.name}: ${Math.round(b.score * 10)}/10`).join('\n')
  const top = getTopBiases(biasScores, 3)
  const topNames = top.map((b) => b.name).join(', ')
  return { lines, topNames, top }
}

const SITUATION_PROMPT = (profile, biasScores) => {
  const { lines } = buildBiasSection(biasScores)
  return `
You are an empathetic, knowledgeable personal finance advisor — think of yourself as a brilliant friend who happens to know a lot about money. Your tone is warm, frank, and encouraging but never preachy or generic.

${buildProfile(profile)}

BIAS SCORES (from behavioral assessment, 0–10):
${lines}

${ECONOMIC_CONTEXT}

Provide a financial situation assessment. Return ONLY valid JSON, no markdown, no explanation outside the JSON:

{
  "assessment": "A frank, warm 2–3 sentence assessment of where they stand given their goals, life situation, and personal description. Be specific — reference what they told you in their own words if they provided it.",
  "actions": [
    "Specific action step 1 — concrete and tailored to their exact situation",
    "Specific action step 2",
    "Specific action step 3",
    "Specific action step 4 (optional)",
    "Specific action step 5 (optional)"
  ],
  "economicContext": "2–3 sentences on how the current macro environment (rates, inflation, housing, market) specifically affects someone in their position.",
  "decisionProblems": [
    {
      "title": "Short 4–6 word problem title",
      "description": "1–2 sentences: the specific financial decision trap this person faces, combining their bias scores with their real situation and personal description. Be concrete and personal — name their actual goals, debt, or situation."
    }
  ]
}

Rules:
- Actions should be in priority order (most impactful first for their specific situation)
- Reference their actual goals, worries, and personal situation by name
- decisionProblems should have 2–4 entries covering the most important cognitive traps affecting their specific decisions
- If they described a specific decision they're wrestling with, address it directly in decisionProblems
- Do NOT give generic advice — every sentence should feel written for this specific person
- Be encouraging but honest — if their situation needs urgent attention, say so warmly
`
}

const BIAS_PROMPT = (profile, biasScores) => {
  const { lines, topNames, top } = buildBiasSection(biasScores)
  const topBiasDetails = top.map((b) => `  - ${b.name} (score ${Math.round(b.score * 10)}/10): ${BIAS_DEFINITIONS[b.id]?.description}`).join('\n')

  return `
You are a behavioral finance coach — warm, insightful, non-judgmental. You help people understand how their psychology affects their money decisions and give them practical mental tools.

${buildProfile(profile)}

BIAS ASSESSMENT RESULTS (0–10, where 10 = very strong bias):
${lines}

Top biases for this person: ${topNames}

Top bias descriptions:
${topBiasDetails}

Return ONLY valid JSON, no markdown:

{
  "archetype": {
    "name": "A creative, 3–5 word archetype name (e.g., 'The Cautious Avoider', 'The Trend Chaser')",
    "description": "A 2-sentence affirming description of this behavioral type. Make the person feel understood, not judged."
  },
  "biasInsights": [
    {
      "bias": "Exact bias name",
      "howItShowsUp": "1–2 sentences on how THIS specific bias is likely manifesting in THEIR specific life, given their income, goals, debt, and worries. Be concrete.",
      "override": "A single, practical, memorable mental trick or reframe to counteract this bias. One sentence, actionable."
    }
  ],
  "closing": "One encouraging sentence that ties their behavioral profile to the idea that awareness is the first step — and they just took it."
}

Rules:
- biasInsights should only include their top 2–3 biases (score >= 4/10)
- Reference their specific life details (goals, worries, employment, debt) in the howItShowsUp field
- Override tips should be concise and memorable — not textbook advice
- The archetype should feel custom, not like a generic personality type
`
}

async function callGroq(prompt, maxTokens) {
  const client = getClient()
  const response = await client.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    max_tokens: maxTokens,
    messages: [{ role: 'user', content: prompt }],
  })
  const text = response.choices[0]?.message?.content ?? ''
  // Strip any accidental markdown code fences before parsing
  const cleaned = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim()
  return JSON.parse(cleaned)
}

export async function generateSituationAdvice(profile, biasScores) {
  return callGroq(SITUATION_PROMPT(profile, biasScores), 1400)
}

export async function generateBiasAdvice(profile, biasScores) {
  return callGroq(BIAS_PROMPT(profile, biasScores), 1200)
}
