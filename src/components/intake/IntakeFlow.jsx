import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Check } from 'lucide-react'
import { INTAKE_QUESTIONS, INTAKE_SECTIONS } from '../../data/intakeQuestions.js'

// ─── Sub-input components ─────────────────────────────────────────────────

function SingleSelect({ options, value, onChange }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`group flex items-center gap-3 px-4 py-4 rounded-2xl border-2 text-left transition-all duration-150 hover:scale-[1.015] active:scale-[0.985] ${
            value === opt.value
              ? 'border-indigo-500 bg-indigo-50 shadow-md shadow-indigo-100'
              : 'border-slate-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/30 hover:shadow-sm'
          }`}
        >
          {opt.emoji && <span className="text-xl flex-shrink-0">{opt.emoji}</span>}
          <span className={`font-semibold text-sm flex-1 ${value === opt.value ? 'text-indigo-700' : 'text-slate-700'}`}>
            {opt.label}
          </span>
          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
            value === opt.value ? 'border-indigo-500 bg-indigo-500' : 'border-slate-300 group-hover:border-indigo-300'
          }`}>
            {value === opt.value && <Check size={11} className="text-white" strokeWidth={3} />}
          </div>
        </button>
      ))}
    </div>
  )
}

function MultiSelect({ options, value = [], onChange }) {
  function toggle(v) {
    if (v === 'none') {
      onChange(['none'])
      return
    }
    const filtered = value.filter((x) => x !== 'none')
    if (filtered.includes(v)) {
      onChange(filtered.filter((x) => x !== v))
    } else {
      onChange([...filtered, v])
    }
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {options.map((opt) => {
        const selected = value.includes(opt.value)
        return (
          <button
            key={opt.value}
            onClick={() => toggle(opt.value)}
            className={`group flex items-center gap-3 px-4 py-4 rounded-2xl border-2 text-left transition-all duration-150 hover:scale-[1.015] active:scale-[0.985] ${
              selected
                ? 'border-indigo-500 bg-indigo-50 shadow-md shadow-indigo-100'
                : 'border-slate-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/30 hover:shadow-sm'
            }`}
          >
            <span className="text-xl flex-shrink-0">{opt.emoji}</span>
            <span className={`font-semibold text-sm flex-1 ${selected ? 'text-indigo-700' : 'text-slate-700'}`}>
              {opt.label}
            </span>
            <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${
              selected ? 'border-indigo-500 bg-indigo-500' : 'border-slate-300 group-hover:border-indigo-300'
            }`}>
              {selected && <Check size={11} className="text-white" strokeWidth={3} />}
            </div>
          </button>
        )
      })}
    </div>
  )
}

function ScaleSelect({ options, value, onChange }) {
  return (
    <div className="flex gap-3 flex-wrap">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          title={opt.label}
          className={`flex flex-col items-center gap-1.5 px-5 py-4 rounded-2xl border-2 transition-all duration-150 hover:scale-105 active:scale-95 min-w-[64px] ${
            value === opt.value
              ? 'border-indigo-500 bg-indigo-50 shadow-md shadow-indigo-100'
              : 'border-slate-200 bg-white text-slate-600 hover:border-indigo-300 hover:bg-indigo-50/30'
          }`}
        >
          <span className={`text-xl font-black ${value === opt.value ? 'text-indigo-700' : 'text-slate-700'}`}>
            {opt.value}
          </span>
          <span className="text-xs text-center leading-tight text-slate-400 max-w-[64px]">{opt.label}</span>
        </button>
      ))}
    </div>
  )
}

function MoodSelector({ options, value, onChange }) {
  return (
    <div className="flex gap-3 sm:gap-4 flex-wrap justify-center">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`flex flex-col items-center gap-2 px-5 py-5 rounded-2xl border-2 transition-all duration-200 hover:scale-110 active:scale-95 ${
            value === opt.value
              ? 'border-indigo-500 bg-indigo-50 shadow-lg shadow-indigo-100'
              : 'border-slate-200 bg-white hover:border-indigo-200 hover:bg-indigo-50/20'
          }`}
        >
          <span className="text-4xl leading-none">{opt.emoji}</span>
          <span className={`text-xs font-semibold ${value === opt.value ? 'text-indigo-700' : 'text-slate-500'}`}>
            {opt.label}
          </span>
        </button>
      ))}
    </div>
  )
}

function TextInput({ placeholder, value, onChange, optional }) {
  return (
    <div>
      <input
        type="text"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoFocus
        className="w-full border-2 border-slate-200 rounded-2xl px-5 py-4 text-slate-800 placeholder-slate-300 text-lg font-medium focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 transition-all bg-white shadow-sm"
      />
      {optional && (
        <p className="text-slate-400 text-sm mt-2.5">Press Enter or click Next to skip</p>
      )}
    </div>
  )
}

function TextArea({ placeholder, value, onChange, optional }) {
  return (
    <div>
      <textarea
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={5}
        autoFocus
        className="w-full border-2 border-slate-200 rounded-2xl px-5 py-4 text-slate-800 placeholder-slate-300 text-[15px] leading-relaxed focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 transition-all resize-none bg-white shadow-sm"
      />
      <p className="text-slate-400 text-sm mt-2.5">
        {optional ? 'Optional — click Next to skip' : 'Click Next when done'}
      </p>
    </div>
  )
}

// ─── Main IntakeFlow ──────────────────────────────────────────────────────

export default function IntakeFlow({ onComplete, onUpdateProfile }) {
  const [qIndex, setQIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [direction, setDirection] = useState('forward')
  const [visible, setVisible] = useState(true)

  const q = INTAKE_QUESTIONS[qIndex]
  const totalQ = INTAKE_QUESTIONS.length
  const currentSection = q.section
  const sectionIndex = INTAKE_SECTIONS.indexOf(currentSection)

  function getAnswer() { return answers[q.field] }

  function canAdvance() {
    if (q.optional) return true
    const val = getAnswer()
    if (q.type === 'multi-select') return Array.isArray(val) && val.length > 0
    return val !== undefined && val !== ''
  }

  function setAnswer(val) {
    const updated = { ...answers, [q.field]: val }
    setAnswers(updated)
    onUpdateProfile(updated)

    if ((q.type === 'single-select' || q.type === 'mood') && qIndex < totalQ - 1) {
      setTimeout(() => advance(updated), 320)
    }
  }

  function advance(currentAnswers = answers) {
    if (qIndex >= totalQ - 1) {
      onComplete(currentAnswers)
      return
    }
    setDirection('forward')
    animateTransition(() => setQIndex((i) => i + 1))
  }

  function goBack() {
    if (qIndex === 0) return
    setDirection('back')
    animateTransition(() => setQIndex((i) => i - 1))
  }

  function animateTransition(cb) {
    setVisible(false)
    setTimeout(() => { cb(); setVisible(true) }, 220)
  }

  useEffect(() => {
    function onKey(e) {
      const tag = document.activeElement.tagName
      if (e.key === 'Enter' && canAdvance() && tag !== 'TEXTAREA') advance()
      if (e.key === 'Backspace' && tag !== 'INPUT' && tag !== 'TEXTAREA') goBack()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  const translateClass = visible
    ? 'opacity-100 translate-y-0'
    : direction === 'forward'
    ? 'opacity-0 -translate-y-4'
    : 'opacity-0 translate-y-4'

  const progressPct = Math.round((qIndex / (totalQ - 1)) * 100)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 flex flex-col">

      {/* ── Top progress strip ────────────────────────────────────────────── */}
      <div className="px-6 pt-6 pb-2">
        <div className="max-w-xl mx-auto">
          {/* Section dots */}
          <div className="flex items-center justify-between mb-3">
            {INTAKE_SECTIONS.map((sec, i) => (
              <div key={sec} className="flex flex-col items-center gap-1">
                <div className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  i < sectionIndex ? 'bg-indigo-400 scale-100' :
                  i === sectionIndex ? 'bg-indigo-600 scale-125 ring-4 ring-indigo-100' :
                  'bg-slate-200'
                }`} />
                <span className={`text-[10px] font-semibold transition-colors duration-300 hidden sm:block ${
                  i === sectionIndex ? 'text-indigo-600' :
                  i < sectionIndex ? 'text-slate-400' :
                  'text-slate-300'
                }`}>{sec}</span>
              </div>
            ))}
          </div>

          {/* Progress bar */}
          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-500 ease-out"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* ── Question area ─────────────────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center px-4 py-10">
        <div className={`max-w-xl w-full transition-all duration-200 ease-out ${translateClass}`}>

          {/* Question number */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 text-xs font-black flex-shrink-0">
              {qIndex + 1}
            </div>
            <span className="text-xs font-bold text-indigo-500 uppercase tracking-[0.15em]">
              {currentSection}
            </span>
            <span className="text-slate-300 text-xs ml-auto font-medium">{qIndex + 1}/{totalQ}</span>
          </div>

          {/* Question */}
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2 leading-snug tracking-tight">
            {q.question}
          </h2>

          {q.subtext && (
            <p className="text-slate-500 text-base mb-7 leading-relaxed">{q.subtext}</p>
          )}

          {!q.subtext && <div className="mb-6" />}

          {/* Input */}
          <div className="mb-9">
            {q.type === 'single-select' && (
              <SingleSelect options={q.options} value={getAnswer()} onChange={setAnswer} />
            )}
            {q.type === 'multi-select' && (
              <MultiSelect options={q.options} value={getAnswer()} onChange={setAnswer} />
            )}
            {q.type === 'scale' && (
              <ScaleSelect options={q.options} value={getAnswer()} onChange={setAnswer} />
            )}
            {q.type === 'mood' && (
              <MoodSelector options={q.options} value={getAnswer()} onChange={setAnswer} />
            )}
            {q.type === 'text' && (
              <TextInput
                placeholder={q.placeholder}
                value={getAnswer()}
                onChange={setAnswer}
                optional={q.optional}
              />
            )}
            {q.type === 'textarea' && (
              <TextArea
                placeholder={q.placeholder}
                value={getAnswer()}
                onChange={setAnswer}
                optional={q.optional}
              />
            )}
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-3">
            {qIndex > 0 && (
              <button
                onClick={goBack}
                className="flex items-center gap-2 text-slate-500 hover:text-slate-700 px-4 py-3 rounded-xl border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all font-semibold text-sm"
              >
                <ChevronLeft size={16} /> Back
              </button>
            )}

            {(q.type === 'multi-select' || q.type === 'scale' || q.type === 'text' || q.type === 'textarea') && (
              <button
                onClick={() => advance()}
                disabled={!canAdvance()}
                className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:from-slate-200 disabled:to-slate-200 disabled:text-slate-400 text-white px-6 py-3 rounded-xl transition-all font-bold text-sm shadow-sm hover:shadow-lg hover:shadow-indigo-200 disabled:cursor-not-allowed active:scale-95"
              >
                {qIndex === totalQ - 1 ? 'See My Scenarios →' : 'Next →'}
              </button>
            )}
          </div>

          {(q.type === 'single-select' || q.type === 'mood') && !getAnswer() && (
            <p className="text-slate-400 text-xs mt-4">Select an option to continue</p>
          )}
        </div>
      </div>
    </div>
  )
}
