const STEPS = [
  { label: 'About You', icon: '👤' },
  { label: 'Scenarios',  icon: '🎭' },
  { label: 'Your Profile', icon: '📊' },
  { label: 'Advice',     icon: '💡' },
]

export default function ProgressBar({ currentStep, totalIntakeQuestions, currentIntakeQ, currentScenario, totalScenarios }) {
  // currentStep: 'intake' | 'scenarios' | 'results' | 'advice'
  const stepIndex = { intake: 0, scenarios: 1, results: 2, advice: 3 }[currentStep] ?? 0

  let fillPercent = 0
  if (currentStep === 'intake') {
    fillPercent = (currentIntakeQ / totalIntakeQuestions) * 25
  } else if (currentStep === 'scenarios') {
    fillPercent = 25 + (currentScenario / totalScenarios) * 25
  } else if (currentStep === 'results') {
    fillPercent = 75
  } else if (currentStep === 'advice') {
    fillPercent = 100
  }

  return (
    <div className="w-full px-4 sm:px-6 py-3.5 bg-white/95 backdrop-blur-sm border-b border-slate-100/80">
      <div className="max-w-3xl mx-auto">
        {/* Step labels */}
        <div className="flex justify-between mb-2.5">
          {STEPS.map((step, i) => (
            <div
              key={step.label}
              className={`flex items-center gap-1.5 transition-all duration-300 ${
                i === stepIndex
                  ? 'text-indigo-600'
                  : i < stepIndex
                  ? 'text-indigo-400'
                  : 'text-slate-300'
              }`}
            >
              <span className={`text-sm transition-transform duration-300 ${i === stepIndex ? 'scale-110' : 'scale-100'}`}>
                {step.icon}
              </span>
              <span className={`hidden sm:inline text-xs font-bold transition-colors ${
                i === stepIndex ? 'text-indigo-700' : i < stepIndex ? 'text-slate-400' : 'text-slate-300'
              }`}>
                {step.label}
              </span>
            </div>
          ))}
        </div>

        {/* Progress track */}
        <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${fillPercent}%` }}
          />
        </div>
      </div>
    </div>
  )
}
