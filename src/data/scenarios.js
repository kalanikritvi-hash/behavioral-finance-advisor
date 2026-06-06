// Story-driven bias detection scenarios.
// Each scenario is personalized using the user profile object.

const incomeLabel = (income) => {
  const map = {
    under_1k: '$500', '1k_2500': '$1,200', '2500_5k': '$2,000',
    '5k_8k': '$3,000', '8k_15k': '$5,000', over_15k: '$8,000',
  }
  return map[income] || '$1,500'
}

const bonusLabel = (income) => {
  const map = {
    under_1k: '$200', '1k_2500': '$400', '2500_5k': '$800',
    '5k_8k': '$1,200', '8k_15k': '$2,000', over_15k: '$4,000',
  }
  return map[income] || '$600'
}

const smallAmount = (income) => {
  const map = {
    under_1k: '$100', '1k_2500': '$200', '2500_5k': '$300',
    '5k_8k': '$500', '8k_15k': '$800', over_15k: '$1,500',
  }
  return map[income] || '$300'
}

export const SCENARIOS = [
  // ─── 1. Loss Aversion ─────────────────────────────────────────────────────
  {
    id: 'loss_aversion',
    bias: 'loss_aversion',
    title: 'The Investment Offer',
    icon: '⚖️',
    getScenario(profile) {
      const amt = smallAmount(profile.monthlyIncome)
      const dblAmt = amt.replace('$', '$').replace(/\d+/, (n) => String(Number(n) * 2))

      let intro = `You've managed to save ${amt} that you don't immediately need.`
      if (profile.employment === 'student')
        intro = `Between your side gig and some careful saving, you've got ${amt} sitting in your account.`
      if (profile.employment === 'freelance')
        intro = `A good month landed you ${amt} beyond your usual expenses.`
      if (profile.investingStatus === 'active')
        intro = `You have ${amt} free to deploy from a recent cash-out.`

      return `${intro} A trusted friend offers you two options:\n\nOption A: Put it in a high-yield savings account for one year — guaranteed ${amt} back plus 4.5% interest (about ${Math.round(parseInt(amt.replace('$','').replace(',','')) * 0.045)} in interest, risk-free).\n\nOption B: Invest it in a diversified index fund. Based on historical data, you're likely to earn more over the year — but there's a real chance you're down 5–15% by year-end before recovering.`
    },
    choices: [
      {
        id: 'A',
        label: 'Option A — guaranteed savings, no risk',
        biasScore: 0.85,
        insight: 'You chose certainty over a better expected outcome — a classic loss aversion signal.',
      },
      {
        id: 'B',
        label: 'Option B — index fund, higher expected return',
        biasScore: 0.15,
        insight: 'Accepting short-term volatility for long-term expected gain is the rational, evidence-backed choice.',
      },
    ],
  },

  // ─── 2. Anchoring ─────────────────────────────────────────────────────────
  {
    id: 'anchoring',
    bias: 'anchoring',
    title: 'The Fallen Star',
    icon: '⚓',
    getScenario(profile) {
      let assetType = 'tech stock'
      if (profile.investingStatus === 'retirement') assetType = 'fund in your 401(k)'
      if (profile.investingStatus === 'no' || profile.investingStatus === 'planning')
        assetType = 'stock your coworker has been raving about'

      return `A ${assetType} hit an all-time high of $180 per share two years ago. Today it's trading at $72 — down 60%. However, over the past six months it's actually climbed 28% from its recent low of $56. The company's fundamentals are unchanged and analysts are split on its future.\n\nYour colleague says: "It's still way down from its high — it needs to get back to $180 before it's worth holding." Another colleague says: "It's up 28% in six months — that's momentum."\n\nDoes the $180 high price affect how you'd evaluate this investment?`
    },
    choices: [
      {
        id: 'A',
        label: "Yes — I'd want it to recover toward $180 before feeling comfortable",
        biasScore: 0.90,
        insight: "You're anchored to the past high price. That $180 is a historical artifact — it doesn't predict future value.",
      },
      {
        id: 'B',
        label: "No — I'd evaluate it based on current fundamentals only",
        biasScore: 0.10,
        insight: 'Evaluating an investment on current merits rather than past prices is the anchoring-resistant approach.',
      },
      {
        id: 'C',
        label: "Somewhat — it's a data point, but I'd look at many factors",
        biasScore: 0.45,
        insight: 'Slightly anchored — past price is one of many signals, but it shouldn\'t be the reference point for "value."',
      },
    ],
  },

  // ─── 3. Present Bias ──────────────────────────────────────────────────────
  {
    id: 'present_bias',
    bias: 'present_bias',
    title: 'The Extra $300',
    icon: '⏰',
    getScenario(profile) {
      const amt = smallAmount(profile.monthlyIncome)

      let futureGoal = 'your long-term goals'
      if (profile.goal1yr === 'emergency_fund') futureGoal = 'your emergency fund'
      if (profile.goal1yr === 'pay_debt') futureGoal = 'your debt balance'
      if (profile.goal1yr === 'start_investing') futureGoal = 'your investment account'
      if (profile.debtTypes?.includes('credit_card')) futureGoal = 'your credit card balance'

      let temptation = 'a weekend trip you\'ve been putting off'
      if (profile.employment === 'student') temptation = 'new gear you\'ve been eyeing'
      if (profile.ageRange === '25-34' || profile.ageRange === '35-44')
        temptation = 'a nice dinner out and some shopping you\'ve been delaying'

      return `You come in ${amt} under budget this month — a genuine surprise. You've been meaning to put more toward ${futureGoal}, but this money feels like it "appeared" out of nowhere.\n\nAt the same time, you've been grinding lately and ${temptation} has been on your mind.\n\nWhat do you do with the ${amt}?`
    },
    choices: [
      {
        id: 'A',
        label: 'Spend it — I\'ve been grinding and deserve a reward',
        biasScore: 0.92,
        insight: "Present bias in action — you're discounting the future value of this money to satisfy an immediate want.",
      },
      {
        id: 'B',
        label: 'Put all of it toward my financial goal',
        biasScore: 0.08,
        insight: "Fully deferring to future-you is the financially optimal move, though it requires real impulse discipline.",
      },
      {
        id: 'C',
        label: 'Split it — half to goals, half to enjoy',
        biasScore: 0.50,
        insight: 'A balanced compromise. Better than pure spending, though splitting reduces the compound benefit of saving.',
      },
    ],
  },

  // ─── 4. Overconfidence ────────────────────────────────────────────────────
  {
    id: 'overconfidence',
    bias: 'overconfidence',
    title: 'The Hot Tip',
    icon: '🎯',
    getScenario(profile) {
      let context = 'you\'ve been following'
      if (profile.newsFrequency === 'daily' || profile.newsFrequency === 'weekly')
        context = 'you\'ve researched on your own through financial media'
      if (profile.investingStatus === 'active')
        context = 'you\'ve been monitoring for a while'

      return `You've done some research on a technology company ${context}. You like their products, you understand their market, and your read is that they're undervalued. You're thinking about putting a meaningful chunk of your free cash — maybe 20–30% of your investable savings — into this single stock.\n\nStudies show that individual investors who actively pick stocks underperform simple index funds about 80% of the time, even professionals.\n\nHow do you approach this decision?`
    },
    choices: [
      {
        id: 'A',
        label: 'Invest the 20–30% — my research gives me an edge others miss',
        biasScore: 0.93,
        insight: 'Concentrating based on personal conviction signals overconfidence — this is precisely the situation where data shows most investors lose to the index.',
      },
      {
        id: 'B',
        label: 'Put 5% max in it as a "fun money" bet, keep the rest in index funds',
        biasScore: 0.30,
        insight: 'Capping concentrated bets while keeping the core diversified is a healthy acknowledgment of uncertainty.',
      },
      {
        id: 'C',
        label: 'Skip it — I don\'t trust my ability to pick better than the market',
        biasScore: 0.05,
        insight: 'Epistemic humility about stock-picking is statistically well-founded.',
      },
      {
        id: 'D',
        label: 'Research more and decide — I just need more data',
        biasScore: 0.65,
        insight: 'Believing more research will provide a decisive edge is itself a form of overconfidence about information-processing ability.',
      },
    ],
  },

  // ─── 5. Herd Mentality ────────────────────────────────────────────────────
  {
    id: 'herd_mentality',
    bias: 'herd_mentality',
    title: 'Everyone\'s Doing It',
    icon: '🐑',
    getScenario(profile) {
      let asset = 'a specific cryptocurrency'
      let circle = 'friends'
      if (profile.ageRange === '35-44' || profile.ageRange === '45-54') {
        asset = 'a real estate investment fund'
        circle = 'colleagues'
      }
      if (profile.ageRange === '55+') {
        asset = 'a dividend stock everyone\'s recommending'
        circle = 'people in your network'
      }

      let urgency = ''
      if (profile.financialWorries?.includes('inflation'))
        urgency = " They're framing it as a hedge against inflation."
      if (profile.investingStatus === 'planning')
        urgency = " And you've been looking for a reason to finally start investing."

      return `Three of your closest ${circle} have been putting money into ${asset} and raving about their returns — one is already up 40%.${urgency} The conversation comes up at every get-together now.\n\nYou haven't independently researched this investment. You don't fully understand the underlying mechanics, but you don't want to miss out — and the social proof feels significant.\n\nWhat do you do?`
    },
    choices: [
      {
        id: 'A',
        label: 'Invest — three smart people I trust are seeing real gains',
        biasScore: 0.92,
        insight: 'Social proof driving a financial decision without independent analysis is textbook herd behavior.',
      },
      {
        id: 'B',
        label: 'Research it independently first — then decide on the merits alone',
        biasScore: 0.12,
        insight: 'Independent analysis is the antidote to herd mentality.',
      },
      {
        id: 'C',
        label: 'Ask my friends more about it, and follow their lead if their reasoning sounds solid',
        biasScore: 0.62,
        insight: 'Delegating analysis to your social circle still anchors the decision in herd dynamics, not fundamentals.',
      },
      {
        id: 'D',
        label: 'Pass — I never follow investment trends from social circles',
        biasScore: 0.08,
        insight: 'Strong resistance to social investment pressure is a genuine cognitive advantage.',
      },
    ],
  },

  // ─── 6. Mental Accounting ─────────────────────────────────────────────────
  {
    id: 'mental_accounting',
    bias: 'mental_accounting',
    title: 'The Tax Refund',
    icon: '🗂️',
    getScenario(profile) {
      const amt = bonusLabel(profile.monthlyIncome)

      let debtLine = ''
      if (profile.debtTypes?.includes('credit_card'))
        debtLine = ' You also have a credit card balance you\'ve been meaning to tackle.'
      if (profile.debtTypes?.includes('student'))
        debtLine = ' You also have student loans with a higher interest rate.'

      let source = 'tax refund'
      if (profile.employment === 'student') source = 'scholarship reimbursement check'
      if (profile.employment === 'freelance') source = 'surprisingly large client payment'

      return `You just received a ${source} of ${amt}.${debtLine} This was money you\'d already earned — the government was just holding it for you (interest-free).\n\nBecause it arrived as a lump sum rather than through your regular paycheck, it somehow feels different. What do you do with it?`
    },
    choices: [
      {
        id: 'A',
        label: "Treat it as 'found money' and buy something I wouldn't normally",
        biasScore: 0.93,
        insight: "Classic mental accounting — categorizing money differently based on its source, even though a dollar is a dollar.",
      },
      {
        id: 'B',
        label: 'Use it exactly as I would any regular paycheck money — toward my goals',
        biasScore: 0.05,
        insight: 'Treating all money as fungible regardless of source is the rational, mental-accounting-resistant approach.',
      },
      {
        id: 'C',
        label: 'Split it — put most toward my goals but treat myself a little',
        biasScore: 0.48,
        insight: 'A partial mental accounting effect — the windfall framing still influences you, but you keep it in check.',
      },
    ],
  },

  // ─── 7. Sunk Cost Fallacy ─────────────────────────────────────────────────
  {
    id: 'sunk_cost',
    bias: 'sunk_cost',
    title: 'The Sunken Investment',
    icon: '🕳️',
    getScenario(profile) {
      let scenario = 'an online course that cost $350'
      let continuing = 'finished watching the videos you\'ve already seen, hoping it clicks'
      let quitting = 'spending those hours on free resources that are actually clicking for you'

      if (profile.employment === 'student') {
        scenario = 'a $300 textbook bundle for a class you\'re struggling to stay engaged with'
        continuing = 'grinding through it because you paid for it'
        quitting = 'using free YouTube lectures that explain it better'
      }
      if (profile.investingStatus === 'active') {
        scenario = 'a stock position that cost you $800 to enter'
        continuing = 'holding until it "gets back to break-even"'
        quitting = 'selling and redeploying the capital into a better opportunity'
        return `You bought into ${scenario}. It\'s now worth $480 — you\'re down $320. You\'ve read analyst reports and the reasons you bought in don\'t hold up anymore: the company\'s competitive position has weakened.\n\nBut you keep thinking: "I can\'t sell now, I need it to get back to what I paid." You\'d be ${quitting} if you exit.\n\nThe question: do you hold because you paid $800, or exit based on current prospects?`
      }

      return `Six months ago, you paid for ${scenario}. You\'ve completed only 10% of it because it turned out to be much less useful than you expected — the teaching style doesn\'t work for you and the content is outdated.\n\nYou could spend the next 20 hours either ${continuing} — or ${quitting}.\n\nWhat do you do?`
    },
    choices: [
      {
        id: 'A',
        label: "Push through it — I paid for it, I need to get value from it",
        biasScore: 0.92,
        insight: 'The sunk cost fallacy: letting past, irrecoverable investment dictate future decisions rather than forward-looking costs and benefits.',
      },
      {
        id: 'B',
        label: "Cut my losses — the money is gone either way, my time is better spent elsewhere",
        biasScore: 0.06,
        insight: 'Correctly ignoring sunk costs and evaluating only future opportunity costs is the rational choice.',
      },
      {
        id: 'C',
        label: "Give it one more week — if I\'m still not clicking, I\'ll quit",
        biasScore: 0.42,
        insight: 'A reasonable experiment, but setting a "one more try" threshold can also be a sunk cost rationalization.',
      },
    ],
  },

  // ─── 8. Status Quo Bias ───────────────────────────────────────────────────
  {
    id: 'status_quo',
    bias: 'status_quo',
    title: 'The Easy Switch',
    icon: '🛋️',
    getScenario(profile) {
      let account = 'checking account'
      let rate = '0.01%'
      let newRate = '4.8% APY'
      let effort = '15 minutes'
      let blocker = 'update two auto-pay links'

      if (profile.investingStatus === 'retirement') {
        account = '401(k) default fund'
        rate = 'a 0.85% expense ratio actively managed fund'
        newRate = 'a 0.03% index fund with nearly identical holdings'
        effort = 'one form online'
        blocker = 'pick a new fund'
        return `Your 401(k) defaulted you into ${rate}. There\'s an option in the same plan: ${newRate}. The only difference is fees — you\'d keep ${rate} more per year on every $10,000 invested.\n\nSwitching requires ${effort} to ${blocker}. There\'s no tax event, no risk change — purely administrative.\n\nWhy haven\'t you done it yet, or would you do it now?`
      }

      return `Your ${account} earns ${rate} interest. An online bank offers ${newRate} on the same type of account — fully FDIC insured, same deposit protections. To switch, it would take about ${effort} of setup and you\'d need to ${blocker}.\n\nOn $10,000, that\'s roughly $480 extra per year in interest for ${effort} of work. The math is clear.\n\nWhat do you do?`
    },
    choices: [
      {
        id: 'A',
        label: "Keep my current account — too much hassle to switch",
        biasScore: 0.92,
        insight: 'Choosing inertia over a clear financial win is status quo bias. The $480/year cost of staying is real, even if invisible.',
      },
      {
        id: 'B',
        label: "Switch immediately — that math is obvious",
        biasScore: 0.05,
        insight: "Overcoming inertia for clear financial benefit is exactly what status quo bias prevents most people from doing.",
      },
      {
        id: 'C',
        label: "I'll definitely do it... sometime soon",
        biasScore: 0.78,
        insight: '"Someday" is the status quo bias in its most comfortable form. Most people who say this never switch.',
      },
      {
        id: 'D',
        label: "Research a few more options first, then switch to the best one",
        biasScore: 0.35,
        insight: "Slight status quo pull — the best option is already in front of you, but analysis gives the current state more time.",
      },
    ],
  },
]
