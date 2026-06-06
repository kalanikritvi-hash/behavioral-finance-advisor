import { useState } from 'react'
import { Menu, X, Lock, Check } from 'lucide-react'

const NAV_ITEMS = [
  { step: 'home',      label: 'Home',              icon: '🏠', desc: 'Landing page' },
  { step: 'intake',    label: 'Your Profile',       icon: '📋', desc: 'Tell us about your situation' },
  { step: 'scenarios', label: 'Decision Scenarios', icon: '🎭', desc: '8 personalized scenarios' },
  { step: 'results',   label: 'Bias Results',       icon: '📊', desc: 'Bias profile & radar chart' },
  { step: 'advice',    label: 'Action Plan',        icon: '💡', desc: 'AI-powered personalized advice' },
]

const STEP_ORDER = ['home', 'intake', 'scenarios', 'results', 'advice']

export default function AppNav({ currentStep, highWater, onNavigate, children }) {
  const [open, setOpen] = useState(false)

  const highIdx = STEP_ORDER.indexOf(highWater)
  const currentIdx = STEP_ORDER.indexOf(currentStep)

  function handleNav(step) {
    const idx = STEP_ORDER.indexOf(step)
    if (idx <= highIdx) {
      onNavigate(step)
      setOpen(false)
    }
  }

  return (
    <>
      {/* ── Fixed top bar ───────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-40 h-14 bg-white/95 backdrop-blur-md border-b border-slate-100/80">
        <div className="max-w-4xl mx-auto px-4 h-full flex items-center justify-between">
          <button
            onClick={() => handleNav('home')}
            className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-base shadow-sm shadow-indigo-200">
              🧠
            </div>
            <span className="font-black text-slate-900 tracking-tight text-base">Money Mind</span>
          </button>

          <button
            onClick={() => setOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-slate-100 transition-colors text-slate-600 hover:text-slate-900 font-medium text-sm"
            aria-label="Open navigation"
          >
            <Menu size={18} />
            <span className="hidden sm:inline text-xs font-semibold">Menu</span>
          </button>
        </div>
      </nav>

      {/* ── Drawer ──────────────────────────────────────────────────────── */}
      <div className={`fixed inset-0 z-50 ${open ? 'pointer-events-auto' : 'pointer-events-none'}`}>
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/50 backdrop-blur-[2px] transition-opacity duration-300 ${
            open ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setOpen(false)}
        />

        {/* Panel — slides from right */}
        <div
          className={`absolute right-0 top-0 bottom-0 w-72 bg-white flex flex-col shadow-2xl transition-transform duration-300 ease-out ${
            open ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Drawer header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-base shadow-sm shadow-indigo-200">
                🧠
              </div>
              <span className="font-black text-slate-900 tracking-tight">Money Mind</span>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X size={18} className="text-slate-500" />
            </button>
          </div>

          {/* Nav items */}
          <nav className="flex-1 py-2 overflow-y-auto">
            {NAV_ITEMS.map((item) => {
              const itemIdx = STEP_ORDER.indexOf(item.step)
              const isLocked  = itemIdx > highIdx
              const isCurrent = item.step === currentStep
              const isDone    = itemIdx < currentIdx && itemIdx <= highIdx

              return (
                <button
                  key={item.step}
                  onClick={() => handleNav(item.step)}
                  disabled={isLocked}
                  className={`w-full flex items-center gap-3 px-5 py-3.5 text-left transition-colors ${
                    isCurrent
                      ? 'bg-indigo-50 border-r-[3px] border-indigo-500'
                      : isLocked
                      ? 'opacity-35 cursor-not-allowed'
                      : 'hover:bg-slate-50 cursor-pointer'
                  }`}
                >
                  <span className="text-xl flex-shrink-0 w-7 text-center">{item.icon}</span>

                  <div className="flex-1 min-w-0">
                    <p className={`font-semibold text-sm ${isCurrent ? 'text-indigo-700' : 'text-slate-800'}`}>
                      {item.label}
                    </p>
                    <p className="text-slate-400 text-xs truncate">{item.desc}</p>
                  </div>

                  {isLocked  && <Lock  size={13} className="text-slate-300 flex-shrink-0" />}
                  {isDone    && <Check size={14} className="text-emerald-500 flex-shrink-0" />}
                  {isCurrent && <div className="w-2 h-2 rounded-full bg-indigo-500 flex-shrink-0" />}
                </button>
              )
            })}
          </nav>

          {/* Drawer footer */}
          <div className="px-5 py-4 border-t border-slate-100 bg-gradient-to-br from-slate-50 to-indigo-50/30">
            <p className="text-slate-400 text-xs leading-relaxed">
              Powered by <span className="font-semibold text-slate-500">Llama 3.3 · 70B</span><br />
              Built on behavioral economics research
            </p>
          </div>
        </div>
      </div>

      {/* ── Page content (below fixed nav) ──────────────────────────────── */}
      <div className="pt-14">
        {children}
      </div>
    </>
  )
}
