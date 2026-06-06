import { useState } from 'react'
import { SCENARIOS } from '../../data/scenarios.js'
import { BIAS_DEFINITIONS } from '../../data/biasDefinitions.js'

function ChoiceButton({ choice, selected, revealed, onClick }) {
  let containerClass = 'w-full text-left px-5 py-4 rounded-2xl border-2 transition-all duration-200 group'

  if (selected && revealed) {
    containerClass += ' border-indigo-500 bg-indigo-50 shadow-md shadow-indigo-100'
  } else if (selected) {
    containerClass += ' border-indigo-400 bg-indigo-50 shadow-sm'
  } else if (revealed) {
    containerClass += ' border-slate-100 bg-slate-50 opacity-40 cursor-default'
  } else {
    containerClass += ' border-slate-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/30 hover:shadow-sm hover:scale-[1.01] active:scale-[0.99]'
  }

  return (
    <button onClick={revealed ? undefined : onClick} className={containerClass}>
      <div className="flex items-start gap-3">
        <span className={`w-7 h-7 rounded-full border-2 flex-shrink-0 flex items-center justify-center text-xs font-black mt-0.5 transition-all ${
          selected
            ? 'border-indigo-500 bg-indigo-500 text-white'
            : 'border-slate-300 text-slate-400 group-hover:border-indigo-400 group-hover:text-indigo-400'
        }`}>
          {choice.id}
        </span>
        <span className={`text-sm leading-relaxed ${selected ? 'text-indigo-800 font-semibold' : 'text-slate-700'}`}>
          {choice.label}
        </span>
      </div>
    </button>
  )
}

export default function ScenarioFlow({ profile, onComplete }) {
  const [scenarioIndex, setScenarioIndex] = useState(0)
  const [selectedChoice, setSelectedChoice] = useState(null)
  const [revealed, setRevealed] = useState(false)
  const [answers, setAnswers] = useState([])
  const [transitioning, setTransitioning] = useState(false)

  const scenario = SCENARIOS[scenarioIndex]
  const scenarioText = scenario.getScenario(profile)
  const biasDef = BIAS_DEFINITIONS[scenario.bias]
  const total = SCENARIOS.length

  function handleChoice(choice) {
    if (revealed) return
    setSelectedChoice(choice)
    setTimeout(() => setRevealed(true), 150)
  }

  function handleNext() {
    const updated = [
      ...answers,
      {
        scenarioId: scenario.id,
        bias: scenario.bias,
        choiceId: selectedChoice.id,
        biasScore: selectedChoice.biasScore,
      },
    ]

    setTransitioning(true)
    setTimeout(() => {
      if (scenarioIndex < total - 1) {
        setAnswers(updated)
        setScenarioIndex((i) => i + 1)
        setSelectedChoice(null)
        setRevealed(false)
        setTransitioning(false)
      } else {
        onComplete(updated)
      }
    }, 350)
  }

  const insight = selectedChoice ? scenario.choices.find((c) => c.id === selectedChoice.id)?.insight : null

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/20 flex flex-col items-center px-4 py-8">

      {/* ── Progress bar ───────────────────────────────────────────────────── */}
      <div className="w-full max-w-2xl mb-8">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{scenario.icon}</span>
            <div>
              <p className="font-bold text-slate-900 text-sm leading-none">{scenario.title}</p>
              <p className="text-slate-400 text-xs mt-0.5">Scenario {scenarioIndex + 1} of {total}</p>
            </div>
          </div>
          <div className="flex gap-1.5 items-center">
            {SCENARIOS.map((_, i) => (
              <div
                key={i}
                className={`rounded-full transition-all duration-400 ${
                  i < scenarioIndex
                    ? 'bg-indigo-400 w-3 h-3'
                    : i === scenarioIndex
                    ? 'bg-indigo-600 w-4 h-4 ring-4 ring-indigo-100'
                    : 'bg-slate-200 w-3 h-3'
                }`}
              />
            ))}
          </div>
        </div>
        <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-500"
            style={{ width: `${((scenarioIndex + (revealed ? 1 : 0)) / total) * 100}%` }}
          />
        </div>
      </div>

      {/* ── Scenario card ──────────────────────────────────────────────────── */}
      <div
        className={`w-full max-w-2xl transition-all duration-300 ease-out ${
          transitioning ? 'opacity-0 translate-x-8' : 'opacity-100 translate-x-0'
        }`}
      >
        {/* Scenario text */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm mb-5">
          <div
            className="h-1.5 w-full"
            style={{ background: `linear-gradient(to right, ${biasDef.color}80, ${biasDef.color}30)` }}
          />
          <div className="p-6">
            <p className="text-slate-700 leading-relaxed text-[15px] whitespace-pre-line">{scenarioText}</p>
          </div>
        </div>

        {/* Question prompt */}
        <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.15em] mb-3 px-1">
          What would you actually do?
        </p>

        {/* Choices */}
        <div className="space-y-3 mb-5">
          {scenario.choices.map((choice) => (
            <ChoiceButton
              key={choice.id}
              choice={choice}
              selected={selectedChoice?.id === choice.id}
              revealed={revealed}
              onClick={() => handleChoice(choice)}
            />
          ))}
        </div>

        {/* Insight reveal */}
        {revealed && insight && (
          <div
            className="rounded-2xl p-4 mb-5 animate-slide-up border"
            style={{
              backgroundColor: biasDef.bgLight,
              borderColor: biasDef.color + '40',
            }}
          >
            <div className="flex items-start gap-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                style={{ backgroundColor: biasDef.color + '20' }}
              >
                {biasDef.icon}
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.15em] mb-1.5" style={{ color: biasDef.color }}>
                  This tested: {biasDef.name}
                </p>
                <p className="text-slate-700 text-sm leading-relaxed">{insight}</p>
              </div>
            </div>
          </div>
        )}

        {/* Next button */}
        {revealed && (
          <button
            onClick={handleNext}
            className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold py-4 rounded-2xl transition-all duration-200 shadow-lg shadow-indigo-200 hover:shadow-xl hover:shadow-indigo-200 hover:scale-[1.01] active:scale-[0.99] animate-fade-in text-base"
          >
            {scenarioIndex < total - 1 ? 'Next Scenario →' : '🎉 See My Bias Profile →'}
          </button>
        )}

        {!selectedChoice && (
          <p className="text-center text-slate-400 text-sm mt-3">
            Choose the option that best reflects what you'd actually do
          </p>
        )}
      </div>
    </div>
  )
}
