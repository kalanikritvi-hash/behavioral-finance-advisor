import { ChevronRight, Brain, Shield, TrendingUp } from 'lucide-react'
import { BIAS_DEFINITIONS, BIAS_ORDER } from '../data/biasDefinitions.js'

const HOW_IT_WORKS = [
  {
    number: '01',
    icon: '📋',
    title: 'Tell Us About You',
    desc: 'A conversational intake covering income, debts, goals, and worries — warm and judgment-free.',
  },
  {
    number: '02',
    icon: '🎭',
    title: 'Navigate Real Scenarios',
    desc: "8 story-driven decisions personalized to your life. Pick what you'd actually do, not what sounds smart.",
  },
  {
    number: '03',
    icon: '📊',
    title: 'See Your Bias Profile',
    desc: 'A radar chart maps your cognitive patterns across 8 proven biases, ranked with academic backing.',
  },
  {
    number: '04',
    icon: '💡',
    title: 'Get Your Action Plan',
    desc: 'AI advice tailored to your situation, your biases, and the current economic environment.',
  },
]

const FEATURES = [
  {
    icon: Brain,
    title: 'Grounded in science',
    desc: 'Built on Nobel Prize-winning research by Kahneman, Tversky, and Thaler. The biases are real — so are their costs.',
  },
  {
    icon: TrendingUp,
    title: 'Personalized, not generic',
    desc: 'Every scenario and advice point adapts to your income, debt, goals, and life stage.',
  },
  {
    icon: Shield,
    title: 'Completely private',
    desc: 'No account, no tracking, no server storage. Your data lives only in this browser session.',
  },
]

export default function HomeScreen({ onStart }) {
  return (
    <div className="bg-white">

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-[#160d50] to-violet-950" />
        <div className="absolute inset-0 dot-grid" />
        <div className="absolute top-1/4 left-1/3 w-[520px] h-[320px] bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-60 bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative px-4 pt-20 pb-32 sm:pt-28 sm:pb-40">
          <div className="max-w-3xl mx-auto text-center">

            <div className="inline-flex items-center gap-2 bg-indigo-500/20 border border-indigo-400/30 rounded-full px-4 py-1.5 text-indigo-300 text-sm font-medium mb-8 animate-fade-in">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
              Behavioral Finance Assessment
            </div>

            <h1 className="text-5xl sm:text-7xl font-black text-white leading-[1.05] tracking-tight mb-6 animate-fade-in" style={{ animationDelay: '60ms' }}>
              Discover What's Really
              <br />
              <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">
                Driving Your Money
              </span>
            </h1>

            <p className="text-slate-400 text-xl mb-12 max-w-2xl mx-auto leading-relaxed animate-fade-in" style={{ animationDelay: '120ms' }}>
              A 12-minute assessment that reveals the cognitive biases shaping your financial choices
              — then an AI-powered action plan built around your real situation.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-10 sm:gap-16 mb-12 animate-fade-in" style={{ animationDelay: '180ms' }}>
              {[
                { value: '8', label: 'Biases Tested' },
                { value: '~12', label: 'Minutes' },
                { value: 'AI', label: 'Action Plan' },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <p className="text-5xl sm:text-6xl font-black text-white tracking-tight leading-none">{s.value}</p>
                  <p className="text-slate-400 text-sm mt-2 font-medium">{s.label}</p>
                </div>
              ))}
            </div>

            <div className="animate-fade-in" style={{ animationDelay: '240ms' }}>
              <button
                onClick={onStart}
                className="group inline-flex items-center gap-3 bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-400 hover:to-violet-400 text-white font-bold text-xl px-10 py-5 rounded-2xl transition-all duration-200 shadow-2xl shadow-indigo-900/60 hover:scale-[1.04] active:scale-[0.98]"
              >
                Start Free Assessment
                <ChevronRight size={22} className="group-hover:translate-x-1.5 transition-transform duration-200" />
              </button>
              <p className="text-slate-500 text-sm mt-5">No account required · 100% private · Free forever</p>
            </div>

          </div>
        </div>
      </section>

      {/* ── How It Works ───────────────────────────────────────────────────── */}
      <section className="px-4 py-24 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-indigo-600 font-bold text-xs uppercase tracking-[0.2em] mb-3">The Process</p>
            <h2 className="text-4xl sm:text-5xl font-black text-slate-900 mb-4 tracking-tight">Four Steps to Clarity</h2>
            <p className="text-slate-500 text-lg max-w-lg mx-auto">From financial blind spots to a concrete, personalized plan</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            <div className="hidden lg:block absolute top-[38px] left-[calc(12.5%+40px)] right-[calc(12.5%+40px)] h-px bg-gradient-to-r from-transparent via-indigo-200 to-transparent pointer-events-none" />

            {HOW_IT_WORKS.map((s, idx) => (
              <div key={s.number} className="relative flex flex-col items-center text-center group">
                <div className="relative z-10 w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-100 flex items-center justify-center mb-5 transition-all duration-300 group-hover:border-indigo-300 group-hover:shadow-xl group-hover:shadow-indigo-100/80 group-hover:-translate-y-1">
                  <span className="text-3xl">{s.icon}</span>
                  <div className="absolute -top-2.5 -right-2.5 w-6 h-6 rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 text-white text-[11px] font-black flex items-center justify-center shadow-md">
                    {idx + 1}
                  </div>
                </div>
                <h3 className="font-bold text-slate-900 mb-2">{s.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8 Biases Preview ───────────────────────────────────────────────── */}
      <section className="px-4 py-24 dot-grid-light bg-slate-50/60">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-indigo-600 font-bold text-xs uppercase tracking-[0.2em] mb-3">What We Measure</p>
            <h2 className="text-4xl sm:text-5xl font-black text-slate-900 mb-4 tracking-tight">
              8 Proven Cognitive Biases
            </h2>
            <p className="text-slate-500 text-lg max-w-lg mx-auto">
              Each backed by decades of behavioral economics research
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {BIAS_ORDER.map((id) => {
              const b = BIAS_DEFINITIONS[id]
              return (
                <div
                  key={id}
                  className="group rounded-2xl p-5 border transition-all duration-250 hover:-translate-y-1 hover:shadow-xl cursor-default"
                  style={{
                    backgroundColor: b.bgLight,
                    borderColor: b.color + '35',
                    boxShadow: `0 1px 4px ${b.color}12`,
                  }}
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center mb-3 text-2xl transition-transform duration-200 group-hover:scale-110"
                    style={{ backgroundColor: b.color + '18' }}
                  >
                    {b.icon}
                  </div>
                  <p className="font-bold text-slate-900 text-sm mb-1.5">{b.name}</p>
                  <p className="text-xs leading-snug font-medium" style={{ color: b.color + 'bb' }}>
                    {b.description.split('.')[0]}.
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Features ───────────────────────────────────────────────────────── */}
      <section className="px-4 py-24 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-indigo-600 font-bold text-xs uppercase tracking-[0.2em] mb-3">Why This Works</p>
            <h2 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">Built Different</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex flex-col items-center text-center group">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-100 to-violet-100 flex items-center justify-center mb-5 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-indigo-100 group-hover:-translate-y-1">
                  <Icon size={26} className="text-indigo-600" />
                </div>
                <h3 className="font-bold text-slate-900 mb-2">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ──────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-4 py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-[#160d50] to-violet-950" />
        <div className="absolute inset-0 dot-grid opacity-60" />
        <div className="absolute top-1/4 left-1/4 w-96 h-64 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/3 right-1/3 w-72 h-56 bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-2xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-5 tracking-tight leading-tight">
            Ready to understand<br />your money mind?
          </h2>
          <p className="text-slate-400 text-xl mb-10 leading-relaxed">
            Most people never discover what's actually holding their finances back. Now you can.
          </p>
          <button
            onClick={onStart}
            className="group inline-flex items-center gap-3 bg-white hover:bg-indigo-50 text-indigo-700 font-bold text-xl px-10 py-5 rounded-2xl transition-all hover:scale-[1.04] active:scale-[0.98] shadow-2xl"
          >
            Start Free Assessment
            <ChevronRight size={22} className="group-hover:translate-x-1.5 transition-transform duration-200" />
          </button>
          <p className="text-slate-500 text-sm mt-5">No account · No credit card · ~12 minutes</p>
        </div>
      </section>

    </div>
  )
}
