import { useState, useEffect } from 'react'
import { CheckCircle2, Circle, Loader2, AlertCircle, ChevronDown, ChevronUp, RefreshCw } from 'lucide-react'
import { generateSituationAdvice, generateBiasAdvice } from '../../utils/groqApi.js'
import { BIAS_DEFINITIONS, getSeverity } from '../../data/biasDefinitions.js'

const CHECKLIST_KEY = 'fbp_action_checklist'

function loadChecklist() {
  try { return JSON.parse(localStorage.getItem(CHECKLIST_KEY) || '[]') } catch { return [] }
}
function saveChecklist(items) {
  localStorage.setItem(CHECKLIST_KEY, JSON.stringify(items))
}

// ─── Part A: Situation Advice ─────────────────────────────────────────────

function SituationCard({ advice, checkedActions, onToggle }) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-700 rounded-2xl p-6 sm:p-8 text-white shadow-2xl shadow-indigo-200">
      <div className="absolute inset-0 dot-grid opacity-20" />
      <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-xl flex-shrink-0">
            🎯
          </div>
          <div>
            <p className="text-indigo-300 text-xs font-bold uppercase tracking-[0.2em]">Part A</p>
            <h2 className="text-xl font-black tracking-tight">Your Situation</h2>
          </div>
        </div>

        {/* Assessment */}
        <div className="bg-white/10 rounded-xl p-4 mb-6 border border-white/10">
          <p className="text-indigo-100 leading-relaxed">{advice.assessment}</p>
        </div>

        {/* Action steps checklist */}
        <div className="mb-6">
          <h3 className="text-indigo-200 text-xs font-bold uppercase tracking-[0.2em] mb-3">
            Prioritized Action Steps
          </h3>
          <div className="space-y-2">
            {advice.actions.map((action, i) => {
              const key = `action_${i}`
              const checked = checkedActions.includes(key)
              return (
                <button
                  key={i}
                  onClick={() => onToggle(key)}
                  className={`w-full flex items-start gap-3 text-left px-4 py-3 rounded-xl transition-all duration-150 ${
                    checked ? 'bg-white/20' : 'bg-white/5 hover:bg-white/10'
                  }`}
                >
                  {checked
                    ? <CheckCircle2 size={18} className="text-emerald-300 flex-shrink-0 mt-0.5" />
                    : <Circle size={18} className="text-indigo-300 flex-shrink-0 mt-0.5" />
                  }
                  <span className={`text-sm leading-relaxed ${checked ? 'line-through text-indigo-300/70' : 'text-white'}`}>
                    {action}
                  </span>
                </button>
              )
            })}
          </div>
          <p className="text-indigo-400 text-xs mt-2.5 ml-1">
            Checkboxes saved automatically in your browser
          </p>
        </div>

        {/* Economic context */}
        <div className="border-t border-white/20 pt-5">
          <h3 className="text-indigo-300 text-xs font-bold uppercase tracking-[0.2em] mb-2">
            Current Economic Context
          </h3>
          <p className="text-indigo-100 text-sm leading-relaxed">{advice.economicContext}</p>
        </div>
      </div>
    </div>
  )
}

// ─── Decision Problems Card ───────────────────────────────────────────────

function DecisionProblemsCard({ problems }) {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
      <div className="relative overflow-hidden bg-gradient-to-r from-amber-500 to-orange-500 px-6 sm:px-8 py-6">
        <div className="absolute inset-0 dot-grid opacity-15" />
        <div className="relative flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-xl flex-shrink-0">
            ⚠️
          </div>
          <div>
            <p className="text-amber-100 text-xs font-bold uppercase tracking-[0.2em]">Your Action Plan</p>
            <h2 className="text-xl font-black text-white tracking-tight">Decision-Making Problems</h2>
          </div>
        </div>
        <p className="text-amber-100/80 text-sm mt-3 relative">
          Where your biases and situation create specific financial blind spots right now.
        </p>
      </div>

      <div className="p-6 sm:p-8 space-y-3">
        {problems.map((problem, i) => (
          <div key={i} className="flex gap-4 p-4 rounded-2xl border border-slate-100 bg-slate-50/80 hover:bg-amber-50/40 hover:border-amber-200/60 transition-all duration-150">
            <div className="flex-shrink-0 w-7 h-7 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center text-xs font-black mt-0.5">
              {i + 1}
            </div>
            <div>
              <p className="font-bold text-slate-900 mb-1">{problem.title}</p>
              <p className="text-slate-600 text-sm leading-relaxed">{problem.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Part B: Bias Override Advice ─────────────────────────────────────────

function BiasOverrideCard({ advice, biasScores }) {
  const [expandedBias, setExpandedBias] = useState(null)

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 p-6 sm:p-8">
        <div className="absolute inset-0 dot-grid opacity-10" />
        <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-600/15 rounded-full blur-2xl pointer-events-none" />
        <div className="relative">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center text-xl flex-shrink-0">
              🧠
            </div>
            <div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">Part B</p>
              <h2 className="text-xl font-black text-white tracking-tight">Watch Your Biases</h2>
            </div>
          </div>

          {/* Archetype */}
          <div className="bg-white/10 rounded-2xl p-4 border border-white/10">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.15em] mb-2">
              Your Behavioral Archetype
            </p>
            <h3 className="text-white text-2xl font-black mb-2 tracking-tight">{advice.archetype.name}</h3>
            <p className="text-slate-300 text-sm leading-relaxed">{advice.archetype.description}</p>
          </div>
        </div>
      </div>

      {/* Bias insights */}
      <div className="p-6 sm:p-8">
        <h3 className="text-slate-700 font-semibold mb-4">How your top biases are showing up right now</h3>

        <div className="space-y-3 mb-6">
          {advice.biasInsights.map((insight, i) => {
            const biasKey = Object.keys(BIAS_DEFINITIONS).find(
              (k) => BIAS_DEFINITIONS[k].name.toLowerCase() === insight.bias.toLowerCase()
            )
            const def = biasKey ? BIAS_DEFINITIONS[biasKey] : null
            const sev = biasKey ? getSeverity(biasScores[biasKey] ?? 0) : null
            const isOpen = expandedBias === i

            return (
              <div key={i} className="border border-slate-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setExpandedBias(isOpen ? null : i)}
                  className="w-full flex items-center gap-3 p-4 text-left hover:bg-slate-50 transition-colors"
                >
                  <span className="text-xl flex-shrink-0">{def?.icon || '🎯'}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-slate-800 text-sm">{insight.bias}</span>
                      {sev && (
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${sev.bg} ${sev.color}`}>
                          {sev.label}
                        </span>
                      )}
                    </div>
                    {!isOpen && (
                      <p className="text-slate-500 text-xs mt-0.5 truncate">{insight.howItShowsUp}</p>
                    )}
                  </div>
                  {isOpen ? <ChevronUp size={16} className="text-slate-400 flex-shrink-0" /> : <ChevronDown size={16} className="text-slate-400 flex-shrink-0" />}
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 space-y-3 bg-slate-50/50">
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                        How it's showing up for you
                      </p>
                      <p className="text-slate-700 text-sm leading-relaxed">{insight.howItShowsUp}</p>
                    </div>
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                      <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-1">
                        💡 Bias Override
                      </p>
                      <p className="text-amber-800 text-sm leading-relaxed font-medium">{insight.override}</p>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Closing */}
        <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4">
          <p className="text-indigo-800 text-sm leading-relaxed font-medium">{advice.closing}</p>
        </div>
      </div>
    </div>
  )
}

// ─── Loading state ────────────────────────────────────────────────────────

function LoadingCard({ label }) {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm overflow-hidden">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl skeleton flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-3 w-16 skeleton rounded" />
          <div className="h-4 w-40 skeleton rounded" />
        </div>
      </div>
      <div className="space-y-2.5 mb-6">
        <div className="h-3.5 skeleton rounded w-full" />
        <div className="h-3.5 skeleton rounded w-5/6" />
        <div className="h-3.5 skeleton rounded w-4/5" />
        <div className="h-3.5 skeleton rounded w-3/4" />
      </div>
      <div className="space-y-2">
        {[1,2,3].map(i => (
          <div key={i} className="h-12 skeleton rounded-xl" />
        ))}
      </div>
      <div className="flex items-center gap-2 mt-6 pt-5 border-t border-slate-100">
        <Loader2 size={14} className="text-indigo-400 animate-spin flex-shrink-0" />
        <p className="text-slate-400 text-sm">Generating {label} — Llama is reading your full profile…</p>
      </div>
    </div>
  )
}

// ─── Main AdvicePanel ─────────────────────────────────────────────────────

export default function AdvicePanel({ profile, biasScores }) {
  const [situationAdvice, setSituationAdvice] = useState(null)
  const [biasAdvice, setBiasAdvice] = useState(null)
  const [situationLoading, setSituationLoading] = useState(false)
  const [biasLoading, setBiasLoading] = useState(false)
  const [situationError, setSituationError] = useState(null)
  const [biasError, setBiasError] = useState(null)
  const [checkedActions, setCheckedActions] = useState(loadChecklist)

  useEffect(() => {
    async function loadSituation() {
      setSituationLoading(true)
      setSituationError(null)
      try {
        const data = await generateSituationAdvice(profile, biasScores)
        setSituationAdvice(data)
      } catch (e) {
        setSituationError(e.message || 'Failed to generate advice')
      } finally {
        setSituationLoading(false)
      }
    }

    async function loadBias() {
      setBiasLoading(true)
      setBiasError(null)
      try {
        const data = await generateBiasAdvice(profile, biasScores)
        setBiasAdvice(data)
      } catch (e) {
        setBiasError(e.message || 'Failed to generate advice')
      } finally {
        setBiasLoading(false)
      }
    }

    loadSituation()
    loadBias()
  }, [])

  function toggleAction(key) {
    setCheckedActions((prev) => {
      const next = prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
      saveChecklist(next)
      return next
    })
  }

  function retrySection(section) {
    if (section === 'situation') {
      setSituationError(null)
      setSituationAdvice(null)
      setSituationLoading(true)
      generateSituationAdvice(profile, biasScores)
        .then(setSituationAdvice)
        .catch((e) => setSituationError(e.message))
        .finally(() => setSituationLoading(false))
    } else {
      setBiasError(null)
      setBiasAdvice(null)
      setBiasLoading(true)
      generateBiasAdvice(profile, biasScores)
        .then(setBiasAdvice)
        .catch((e) => setBiasError(e.message))
        .finally(() => setBiasLoading(false))
    }
  }

  const name = profile.name ? `, ${profile.name}` : ''

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12 px-4">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-full px-4 py-1.5 text-amber-700 text-sm font-bold mb-5">
            <span className="text-base">💡</span> Personalized for You
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 mb-4 tracking-tight leading-tight">
            Your Action Plan{name}
          </h1>
          <p className="text-slate-500 text-lg max-w-xl mx-auto leading-relaxed">
            Two-part AI advice grounded in your real financial situation and behavioral bias profile.
          </p>
        </div>

        <div className="space-y-8">
            {/* Part A */}
            {situationLoading && <LoadingCard label="situation advice" />}
            {situationError && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
                <AlertCircle size={24} className="text-red-500 mx-auto mb-3" />
                <p className="text-red-700 font-semibold mb-1">Couldn't generate situation advice</p>
                <p className="text-red-500 text-sm mb-4">{situationError}</p>
                <button
                  onClick={() => retrySection('situation')}
                  className="flex items-center gap-2 mx-auto text-red-600 hover:text-red-700 font-medium text-sm border border-red-200 px-4 py-2 rounded-xl hover:bg-red-50 transition-colors"
                >
                  <RefreshCw size={14} /> Try Again
                </button>
              </div>
            )}
            {situationAdvice && (
              <>
                <SituationCard
                  advice={situationAdvice}
                  checkedActions={checkedActions}
                  onToggle={toggleAction}
                />
                {situationAdvice.decisionProblems?.length > 0 && (
                  <DecisionProblemsCard problems={situationAdvice.decisionProblems} />
                )}
              </>
            )}

            {/* Part B */}
            {biasLoading && <LoadingCard label="bias override advice" />}
            {biasError && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
                <AlertCircle size={24} className="text-red-500 mx-auto mb-3" />
                <p className="text-red-700 font-semibold mb-1">Couldn't generate bias advice</p>
                <p className="text-red-500 text-sm mb-4">{biasError}</p>
                <button
                  onClick={() => retrySection('bias')}
                  className="flex items-center gap-2 mx-auto text-red-600 hover:text-red-700 font-medium text-sm border border-red-200 px-4 py-2 rounded-xl hover:bg-red-50 transition-colors"
                >
                  <RefreshCw size={14} /> Try Again
                </button>
              </div>
            )}
            {biasAdvice && (
              <BiasOverrideCard advice={biasAdvice} biasScores={biasScores} />
            )}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-slate-400 text-sm">
            This is for educational purposes. For major financial decisions, consult a licensed financial advisor.
          </p>
        </div>
      </div>
    </div>
  )
}
