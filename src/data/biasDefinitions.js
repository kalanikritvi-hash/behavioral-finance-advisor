// Behavioral economics bias definitions with academic references
export const BIAS_DEFINITIONS = {
  loss_aversion: {
    id: 'loss_aversion',
    name: 'Loss Aversion',
    shortName: 'Loss Aversion',
    icon: '⚖️',
    color: '#f43f5e',   // rose-500 — universally distinguishable
    bgLight: '#fff1f2',
    description:
      'You feel the pain of a loss roughly twice as intensely as the pleasure of an equivalent gain. This makes you avoid risk even when the expected value clearly favors taking it.',
    realWorldImpact:
      'Selling winning investments too early to "lock in gains," holding losing investments too long to avoid realizing losses, refusing better opportunities out of fear of being worse off.',
    reference: 'Kahneman & Tversky (1979), Prospect Theory, Econometrica',
    overrideHint: 'Frame choices as trade-offs, not as potential losses. Ask: "If I didn\'t already own this, would I buy it today?"',
  },
  anchoring: {
    id: 'anchoring',
    name: 'Anchoring',
    shortName: 'Anchoring',
    icon: '⚓',
    color: '#3b82f6',   // blue-500
    bgLight: '#eff6ff',
    description:
      'Your first piece of information about a price or number becomes a mental "anchor" that distorts all subsequent judgments — even when that number is arbitrary.',
    realWorldImpact:
      'Staying in a losing investment because "it used to be worth more," overpaying for a house because the listing price set the anchor, treating a salary offer as a ceiling when it should be a floor.',
    reference: 'Tversky & Kahneman (1974), Judgment Under Uncertainty: Heuristics and Biases, Science',
    overrideHint: 'Before making any financial decision, write down what you\'d decide if you had never seen the first number. Re-evaluate from a blank slate.',
  },
  present_bias: {
    id: 'present_bias',
    name: 'Present Bias',
    shortName: 'Present Bias',
    icon: '⏰',
    color: '#f59e0b',   // amber-500
    bgLight: '#fffbeb',
    description:
      'You overweight immediate rewards compared to future ones, even when the future payoff is objectively much larger. Also called hyperbolic discounting.',
    realWorldImpact:
      'Spending instead of saving, skipping retirement contributions "for now," perpetually postponing debt payoff in favor of today\'s pleasures.',
    reference: 'Laibson (1997), Golden Eggs and Hyperbolic Discounting, Quarterly Journal of Economics',
    overrideHint: 'Automate savings on payday before you see the money. Making the future default means present-you never gets the chance to spend it.',
  },
  overconfidence: {
    id: 'overconfidence',
    name: 'Overconfidence',
    shortName: 'Overconfidence',
    icon: '🎯',
    color: '#8b5cf6',   // violet-500
    bgLight: '#f5f3ff',
    description:
      'You systematically overestimate your ability to predict market movements, assess risk, and make good financial decisions compared to objective evidence.',
    realWorldImpact:
      'Trading too frequently (which historically underperforms index funds), concentrating risk in sectors you "understand," underestimating the difficulty of timing the market.',
    reference: 'Barber & Odean (2000), Trading Is Hazardous to Your Wealth, Journal of Finance',
    overrideHint: 'Track your predictions in writing. Most people are shocked how poorly their gut calls perform. Default to passive index strategies for the core of your portfolio.',
  },
  herd_mentality: {
    id: 'herd_mentality',
    name: 'Herd Mentality',
    shortName: 'Herd Mentality',
    icon: '🐑',
    color: '#14b8a6',   // teal-500
    bgLight: '#f0fdfa',
    description:
      'You take financial cues from the crowd — what friends are buying, what\'s trending in the news — rather than independent analysis, even when the crowd is demonstrably wrong.',
    realWorldImpact:
      'Buying crypto or meme stocks at the peak because "everyone\'s doing it," panic-selling during downturns when others do, missing contrarian opportunities.',
    reference: 'Shiller (2000), Irrational Exuberance; Bikhchandani et al. (1992), A Theory of Fads, Journal of Political Economy',
    overrideHint: 'Write a one-paragraph investment thesis BEFORE looking at what others are doing. If you can\'t articulate why an investment makes sense on its own merits, don\'t buy it.',
  },
  mental_accounting: {
    id: 'mental_accounting',
    name: 'Mental Accounting',
    shortName: 'Mental Accounting',
    icon: '🗂️',
    color: '#f97316',   // orange-500
    bgLight: '#fff7ed',
    description:
      'You treat money differently based on where it came from or what mental "bucket" it lives in — even though a dollar is a dollar regardless of its origin.',
    realWorldImpact:
      'Blowing a tax refund on things you\'d never buy from your paycheck, keeping high-interest debt while also holding a low-yield savings account, treating casino winnings as "house money."',
    reference: 'Thaler (1985), Mental Accounting and Consumer Choice, Marketing Science',
    overrideHint: 'Whenever you receive any windfall (bonus, refund, gift), immediately ask: "What would I do with this if it were regular income?" Then do that.',
  },
  sunk_cost: {
    id: 'sunk_cost',
    name: 'Sunk Cost Fallacy',
    shortName: 'Sunk Cost',
    icon: '🕳️',
    color: '#ef4444',   // red-500
    bgLight: '#fef2f2',
    description:
      'You continue a failing course of action because you\'ve already invested money, time, or energy — even when cutting losses and moving on is objectively the better choice.',
    realWorldImpact:
      'Holding a bad stock until it "gets back to even," finishing a useless course because you paid for it, staying in an underperforming investment fund because you\'ve already lost so much.',
    reference: 'Arkes & Blumer (1985), The Psychology of Sunk Cost, Organizational Behavior and Human Decision Processes',
    overrideHint: 'Ask yourself: "If I had never made this investment and someone offered me this exact position today, would I buy in?" If no, it\'s time to exit.',
  },
  status_quo: {
    id: 'status_quo',
    name: 'Status Quo Bias',
    shortName: 'Status Quo',
    icon: '🛋️',
    color: '#6366f1',   // indigo-500
    bgLight: '#eef2ff',
    description:
      'You prefer the current state of affairs and perceive any change as a loss, even when switching to an alternative is clearly better on every measurable dimension.',
    realWorldImpact:
      'Keeping a checking account with 0.01% interest when 5% HYSA alternatives exist, never rebalancing a portfolio, staying in a high-fee actively managed fund out of inertia.',
    reference: 'Samuelson & Zeckhauser (1988), Status Quo Bias in Decision Making, Journal of Risk and Uncertainty',
    overrideHint: 'Schedule a 30-minute "financial audit" once a year. Treat every existing financial product as if you\'re choosing it fresh — keep it only if you\'d actively select it today.',
  },
}

export const BIAS_ORDER = [
  'loss_aversion',
  'anchoring',
  'present_bias',
  'overconfidence',
  'herd_mentality',
  'mental_accounting',
  'sunk_cost',
  'status_quo',
]

// Severity thresholds for display.
// Higher score = more bias present = worse outcome — labels reflect that.
export function getSeverity(score) {
  if (score >= 0.67) return { label: 'High Risk',  color: 'text-red-600',     bg: 'bg-red-50',     ring: 'ring-red-200',     dot: 'bg-red-500'     }
  if (score >= 0.34) return { label: 'Notable',    color: 'text-amber-600',   bg: 'bg-amber-50',   ring: 'ring-amber-200',   dot: 'bg-amber-500'   }
  return               { label: 'Minimal',    color: 'text-emerald-600', bg: 'bg-emerald-50', ring: 'ring-emerald-200', dot: 'bg-emerald-500' }
}
