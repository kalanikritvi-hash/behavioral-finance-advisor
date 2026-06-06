import { useState } from 'react'
import HomeScreen from './components/HomeScreen.jsx'
import AppNav from './components/layout/AppNav.jsx'
import IntakeFlow from './components/intake/IntakeFlow.jsx'
import ScenarioFlow from './components/scenarios/ScenarioFlow.jsx'
import ResultsDashboard from './components/results/ResultsDashboard.jsx'
import AdvicePanel from './components/advice/AdvicePanel.jsx'
import ProgressBar from './components/ui/ProgressBar.jsx'
import { computeBiasScores } from './utils/biasScoring.js'
import { SCENARIOS } from './data/scenarios.js'
import { INTAKE_QUESTIONS } from './data/intakeQuestions.js'

const STEP_ORDER = ['home', 'intake', 'scenarios', 'results', 'advice']

export default function App() {
  const [step, setStep]           = useState('home')
  // highest step the user has reached — controls which nav items are unlocked
  const [highWater, setHighWater] = useState('home')

  const [userProfile,   setUserProfile]   = useState({})
  const [intakeQIndex,  setIntakeQIndex]  = useState(0)
  const [scenarioIndex, setScenarioIndex] = useState(0)
  const [biasScores,    setBiasScores]    = useState({})

  // Move forward and unlock the new step
  function advance(nextStep) {
    setStep(nextStep)
    const nextIdx = STEP_ORDER.indexOf(nextStep)
    const highIdx = STEP_ORDER.indexOf(highWater)
    if (nextIdx > highIdx) setHighWater(nextStep)
  }

  // Navigate to any already-unlocked step (used by hamburger menu)
  function goTo(targetStep) {
    const targetIdx = STEP_ORDER.indexOf(targetStep)
    const highIdx   = STEP_ORDER.indexOf(highWater)
    if (targetIdx <= highIdx) setStep(targetStep)
  }

  function handleIntakeProfileUpdate(partial) {
    setUserProfile(partial)
    setIntakeQIndex(Object.keys(partial).length)
  }

  function handleIntakeComplete(finalProfile) {
    setUserProfile(finalProfile)
    advance('scenarios')
  }

  function handleScenariosComplete(answers) {
    setBiasScores(computeBiasScores(answers))
    advance('results')
  }

  return (
    <AppNav currentStep={step} highWater={highWater} onNavigate={goTo}>

      {step !== 'home' && (
        <ProgressBar
          currentStep={step}
          totalIntakeQuestions={INTAKE_QUESTIONS.length}
          currentIntakeQ={intakeQIndex}
          currentScenario={scenarioIndex}
          totalScenarios={SCENARIOS.length}
        />
      )}

      {step === 'home' && (
        <HomeScreen onStart={() => advance('intake')} />
      )}

      {step === 'intake' && (
        <IntakeFlow
          onComplete={handleIntakeComplete}
          onUpdateProfile={handleIntakeProfileUpdate}
        />
      )}

      {step === 'scenarios' && (
        <ScenarioFlow
          profile={userProfile}
          onComplete={handleScenariosComplete}
        />
      )}

      {step === 'results' && (
        <ResultsDashboard
          biasScores={biasScores}
          profile={userProfile}
          onContinue={() => advance('advice')}
        />
      )}

      {step === 'advice' && (
        <AdvicePanel
          profile={userProfile}
          biasScores={biasScores}
        />
      )}

    </AppNav>
  )
}
