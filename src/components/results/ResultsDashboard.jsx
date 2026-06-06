import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip,
} from 'recharts'
import { BIAS_DEFINITIONS, BIAS_ORDER, getSeverity } from '../../data/biasDefinitions.js'
import { formatForRadar, getRankedBiases, getLocalArchetype } from '../../utils/biasScoring.js'

// ─── Radar chart tooltip ──────────────────────────────────────────────────

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const { subject, score } = payload[0]?.payload ?? {}
  return (
    <div className="bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-lg text-sm">
      <p className="font-bold text-slate-800">{subject}</p>
      <p className="text-indigo-600 font-semibold">{score} / 10</p>
    </div>
  )
}

// ─── Bias card ────────────────────────────────────────────────────────────

function BiasCard({ bias, score, rank }) {
  const def = BIAS_DEFINITIONS[bias]
  const sev = getSeverity(score)
  const pct = Math.round(score * 100)

  return (
    <div
      className={`bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 ${
        rank === 0 ? 'ring-2 ring-indigo-200' : 'border border-slate-100'
      }`}
    >
      {/* Colored top accent bar */}
      <div className="h-1" style={{ background: `linear-gradient(to right, ${def.color}, ${def.color}60)` }} />

      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
              style={{ backgroundColor: def.color + '15' }}>
              {def.icon}
            </div>
            <div>
              {rank === 0 && (
                <span className="text-[10px] font-black bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full uppercase tracking-wide block mb-0.5">
                  Strongest
                </span>
              )}
              <h3 className="font-bold text-slate-900 text-base leading-none">{def.name}</h3>
            </div>
          </div>
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0 ${sev.bg} ${sev.color}`}>
            {sev.label}
          </span>
        </div>

        {/* Score bar */}
        <div className="mb-4">
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-slate-400 font-medium">Bias intensity</span>
            <span className="font-bold text-slate-600">{pct}%</span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${pct}%`, backgroundColor: def.color }}
            />
          </div>
        </div>

        <p className="text-slate-600 text-sm leading-relaxed mb-3">{def.description}</p>

        <div className="rounded-xl p-3 border" style={{ backgroundColor: def.bgLight, borderColor: def.color + '25' }}>
          <p className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: def.color }}>Real-world impact</p>
          <p className="text-slate-600 text-sm leading-relaxed">{def.realWorldImpact}</p>
        </div>

        <p className="text-slate-400 text-xs mt-3 italic">{def.reference}</p>
      </div>
    </div>
  )
}

// ─── Archetype banner ─────────────────────────────────────────────────────

function ArchetypeBanner({ archetype }) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-700 rounded-2xl p-7 text-white shadow-xl">
      <div className="absolute inset-0 dot-grid opacity-20" />
      <div className="absolute top-0 right-0 w-48 h-48 bg-violet-500/20 rounded-full blur-2xl pointer-events-none" />
      <div className="relative">
        <p className="text-indigo-200 text-xs font-bold uppercase tracking-[0.2em] mb-2">Your Behavioral Archetype</p>
        <h2 className="text-3xl font-black mb-3 tracking-tight">{archetype.name}</h2>
        <p className="text-indigo-100 leading-relaxed text-base">{archetype.description}</p>
      </div>
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────

export default function ResultsDashboard({ biasScores, profile, onContinue }) {
  const radarData = formatForRadar(biasScores)
  const ranked = getRankedBiases(biasScores)
  const archetype = getLocalArchetype(biasScores)

  const name = profile.name ? `, ${profile.name}` : ''

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12 px-4">
      <div className="max-w-3xl mx-auto">

        {/* ── Headline ────────────────────────────────────────────────────── */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-200 rounded-full px-4 py-1.5 text-indigo-600 text-sm font-bold mb-5">
            <span className="text-base">🎉</span> Your Results Are In
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 mb-4 tracking-tight leading-tight">
            Your Financial
            <br />
            <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              Bias Profile{name}
            </span>
          </h1>
          <p className="text-slate-500 text-lg max-w-xl mx-auto leading-relaxed">
            Based on your decisions across 8 real scenarios — here's a map of the cognitive patterns shaping your financial choices.
          </p>
        </div>

        {/* ── Archetype ───────────────────────────────────────────────────── */}
        <div className="mb-8">
          <ArchetypeBanner archetype={archetype} />
        </div>

        {/* ── Radar chart ─────────────────────────────────────────────────── */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm mb-8 overflow-hidden">
          <div className="flex items-start justify-between mb-5">
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">Bias Radar</h2>
              <p className="text-slate-400 text-sm mt-0.5">Higher spike = stronger bias tendency · Scores out of 10</p>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={340}>
            <RadarChart data={radarData} margin={{ top: 10, right: 40, bottom: 10, left: 40 }}>
              <PolarGrid stroke="#e2e8f0" strokeDasharray="3 3" />
              <PolarAngleAxis
                dataKey="subject"
                tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }}
              />
              <Radar
                name="You"
                dataKey="score"
                stroke="#6366f1"
                fill="#6366f1"
                fillOpacity={0.22}
                strokeWidth={2.5}
              />
              <Tooltip content={<CustomTooltip />} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* ── Bias breakdown ──────────────────────────────────────────────── */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Bias Breakdown</h2>
            <span className="text-slate-400 text-sm font-medium">Ranked by intensity</span>
          </div>
          <div className="space-y-4">
            {ranked.map((b, i) => (
              <BiasCard key={b.id} bias={b.id} score={b.score} rank={i} />
            ))}
          </div>
        </div>

        {/* ── CTA ─────────────────────────────────────────────────────────── */}
        <button
          onClick={onContinue}
          className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-lg py-5 rounded-2xl transition-all duration-200 shadow-xl shadow-indigo-200 hover:shadow-2xl hover:shadow-indigo-200 hover:scale-[1.015] active:scale-[0.99]"
        >
          💡 Get My Personalized Action Plan →
        </button>
        <p className="text-center text-slate-400 text-sm mt-3">
          Powered by Llama 3.3 · Tailored specifically to your profile and biases
        </p>

      </div>
    </div>
  )
}
