// Bias scoring logic — computes a 0–1 score per bias from scenario answers.
// Higher score = stronger bias detected.

import { BIAS_DEFINITIONS, BIAS_ORDER } from '../data/biasDefinitions.js'

/**
 * @param {Array<{scenarioId: string, choiceId: string, biasScore: number, bias: string}>} answers
 * @returns {Object} { loss_aversion: 0.85, anchoring: 0.45, ... }
 */
export function computeBiasScores(answers) {
  const scores = {}
  BIAS_ORDER.forEach((bias) => { scores[bias] = 0 })

  answers.forEach(({ bias, biasScore }) => {
    if (bias && typeof biasScore === 'number') {
      scores[bias] = biasScore
    }
  })

  return scores
}

/**
 * Returns biases sorted from strongest to weakest.
 */
export function getRankedBiases(scores) {
  return BIAS_ORDER
    .map((id) => ({ id, score: scores[id] ?? 0, ...BIAS_DEFINITIONS[id] }))
    .sort((a, b) => b.score - a.score)
}

/**
 * Returns the top N biases (score above threshold).
 */
export function getTopBiases(scores, n = 3, threshold = 0.4) {
  return getRankedBiases(scores)
    .filter((b) => b.score >= threshold)
    .slice(0, n)
}

/**
 * Formats scores as a chart-ready array for Recharts RadarChart.
 */
export function formatForRadar(scores) {
  return BIAS_ORDER.map((id) => ({
    subject: BIAS_DEFINITIONS[id].shortName,
    score: Math.round((scores[id] ?? 0) * 10 * 10) / 10,
    fullMark: 10,
  }))
}

/**
 * Returns a behavioral archetype label based on top biases.
 * This is used as a fallback if the AI doesn't generate one.
 */
export function getLocalArchetype(scores) {
  const ranked = getRankedBiases(scores)
  const top = ranked[0]?.id
  const second = ranked[1]?.id

  const archetypes = {
    loss_aversion_present_bias: { name: 'The Safety-First Drifter', desc: 'You protect what you have and focus on today, which keeps you comfortable — but may hold you back from the growth your future self needs.' },
    loss_aversion_status_quo: { name: 'The Cautious Holder', desc: 'You value security and stability deeply. Your portfolio rarely changes — which reduces stress but may mean missing better opportunities.' },
    present_bias_herd_mentality: { name: 'The Trend Chaser', desc: 'You\'re energized by what\'s happening now, and your social circle influences your moves. The FOMO is real, but so is the risk.' },
    overconfidence_herd_mentality: { name: 'The Confident Follower', desc: 'You trust your instincts and the crowd equally — a combination that feels very right until the crowd is wrong.' },
    sunk_cost_loss_aversion: { name: 'The Committed Holder', desc: 'You finish what you start and hate admitting a mistake. Your loyalty to past decisions sometimes costs you better future options.' },
    anchoring_overconfidence: { name: 'The Informed Optimist', desc: 'You do your homework and trust your reads — but your first impressions tend to stick longer than the data warrants.' },
    mental_accounting_present_bias: { name: 'The Spontaneous Spender', desc: 'Windfall money feels like fair game, and today\'s pleasures feel more real than tomorrow\'s goals. Small leaks can sink big ships.' },
  }

  const key = `${top}_${second}`
  return archetypes[key] || { name: 'The Balanced Navigator', desc: 'Your biases are distributed without a single dominant pattern — you tend toward caution but are more adaptable than most.' }
}
