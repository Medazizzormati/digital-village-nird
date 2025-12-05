"use client"

import { useState, useEffect } from "react"
import { Loader2, CheckCircle2, XCircle, Trophy, BarChart3, Zap, Star, Target } from "lucide-react"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"

interface QuizQuestion {
  id: number
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

interface StageData {
  stage: number
  name: string
  description: string
  difficulty: string
  totalStages: number
  questions: QuizQuestion[]
}

interface AnswerRecord {
  questionIndex: number
  question: string
  userAnswer: string
  correctAnswer: string
  isCorrect: boolean
  explanation: string
}

export default function QuizPage() {
  const [currentStage, setCurrentStage] = useState(1)
  const [stageData, setStageData] = useState<StageData | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [answered, setAnswered] = useState(false)
  const [stageScore, setStageScore] = useState(0)
  const [stageComplete, setStageComplete] = useState(false)
  const [showSummary, setShowSummary] = useState(false)
  const [globalScore, setGlobalScore] = useState(0)
  const [allStagesComplete, setAllStagesComplete] = useState(false)
  const [completedStages, setCompletedStages] = useState<number[]>([])
  const [answers, setAnswers] = useState<AnswerRecord[]>([])

  const stageHeroes = {
    1: { emoji: "📚", color: "from-cyan-500 to-blue-600", title: "Les Fondamentaux", xp: 100 },
    2: { emoji: "🐧", color: "from-orange-500 to-red-600", title: "Linux & Logiciels Libres", xp: 150 },
    3: { emoji: "⚙️", color: "from-purple-500 to-pink-600", title: "Implémentation Pratique", xp: 200 },
    4: { emoji: "🔒", color: "from-red-500 to-rose-600", title: "Sécurité & Données", xp: 250 },
    5: { emoji: "🌍", color: "from-emerald-500 to-teal-600", title: "Engagement Communautaire", xp: 300 },
  }

  useEffect(() => {
    const fetchStageQuestions = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/quiz/questions?stage=${currentStage}`)
        const data = await response.json()
        setStageData(data)
        setCurrentQuestionIndex(0)
        setSelectedAnswer(null)
        setAnswered(false)
        setStageScore(0)
        setStageComplete(false)
        setShowSummary(false)
        setAnswers([])
      } catch (error) {
        console.error("Error fetching stage:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStageQuestions()
  }, [currentStage])

  const handleSelectAnswer = (index: number) => {
    if (!answered) {
      setSelectedAnswer(index)
      setAnswered(true)
      const isCorrect = index === stageData!.questions[currentQuestionIndex].correctAnswer
      if (isCorrect) {
        setStageScore((prev) => prev + 1)
      }
      const question = stageData!.questions[currentQuestionIndex]
      setAnswers((prev) => [
        ...prev,
        {
          questionIndex: currentQuestionIndex,
          question: question.question,
          userAnswer: question.options[index],
          correctAnswer: question.options[question.correctAnswer],
          isCorrect,
          explanation: question.explanation,
        },
      ])
    }
  }

  const handleNextQuestion = () => {
    if (stageData && currentQuestionIndex < stageData.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setSelectedAnswer(null)
      setAnswered(false)
    } else {
      setShowSummary(true)
    }
  }

  const handleCompleteStageSummary = () => {
    setStageComplete(true)
    const stagePoints = stageScore * (currentStage * 10)
    setGlobalScore((prev) => prev + stagePoints)
    setCompletedStages((prev) => [...prev, currentStage])

    if (currentStage === 5) {
      setAllStagesComplete(true)
    }
  }

  const handleNextStage = () => {
    if (currentStage < 5) {
      setCurrentStage(currentStage + 1)
    }
  }

  const handleRestartStage = () => {
    setCurrentStage(currentStage)
  }

  const handleRestartAllStages = () => {
    setCurrentStage(1)
    setGlobalScore(0)
    setCompletedStages([])
    setAllStagesComplete(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-lg text-muted-foreground font-medium">Chargement du stage...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (allStagesComplete) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1 py-24 relative overflow-hidden">
          <div className="absolute inset-0 grid-pattern opacity-50"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-yellow-500/10 via-transparent to-transparent"></div>
          
          <div className="max-w-2xl mx-auto px-4 relative z-10">
            <div className="game-card p-10 rounded-3xl text-center border-yellow-500/50">
              <Trophy className="w-24 h-24 text-yellow-500 mx-auto mb-6" />
              <div className="xp-badge inline-block mb-4">🏆 MAÎTRE NIRD</div>
              <h1 className="text-4xl font-black gradient-text mb-4">Félicitations!</h1>
              <p className="text-xl text-muted-foreground mb-6">Tu as complété tous les 5 stages de NIRD!</p>
              
              <div className="p-6 rounded-2xl bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 mb-8">
                <p className="text-6xl font-black text-yellow-500 mb-2">{globalScore}</p>
                <p className="text-lg text-foreground font-bold">Points totaux</p>
              </div>

              <div className="flex gap-4 justify-center flex-wrap">
                <button
                  onClick={handleRestartAllStages}
                  className="game-btn rounded-xl text-primary-foreground"
                >
                  Recommencer
                </button>
                <Link
                  href="/"
                  className="px-8 py-3 rounded-xl font-bold border-2 border-border/50 text-foreground hover:border-primary/50 transition-all"
                >
                  Retour Accueil
                </Link>
              </div>
            </div>

            {/* Stage Progress */}
            <div className="grid grid-cols-5 gap-2 mt-8">
              {[1, 2, 3, 4, 5].map((stage) => {
                const hero = stageHeroes[stage as keyof typeof stageHeroes]
                return (
                  <div
                    key={stage}
                    className={`p-4 rounded-xl text-center font-bold ${
                      completedStages.includes(stage)
                        ? "bg-accent/20 border-2 border-accent text-foreground"
                        : "bg-secondary/30 border border-border/50 text-muted-foreground"
                    }`}
                  >
                    <span className="text-2xl">{hero.emoji}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (showSummary && stageData) {
    const stagePoints = stageScore * (currentStage * 10)
    const totalQuestions = stageData.questions.length
    const percentage = Math.round((stageScore / totalQuestions) * 100)
    const hero = stageHeroes[currentStage as keyof typeof stageHeroes]

    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1 py-24 relative overflow-hidden">
          <div className="absolute inset-0 grid-pattern opacity-50"></div>
          
          <div className="max-w-4xl mx-auto px-4 relative z-10">
            {/* Summary Header */}
            <div className="game-card p-8 rounded-3xl mb-8">
              <div className="text-center mb-8">
                <span className="text-6xl mb-4 block">{hero.emoji}</span>
                <h1 className="text-3xl font-black text-foreground mb-2">Stage {currentStage} - Résumé</h1>
                <p className="text-lg text-muted-foreground">{stageData.name}</p>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="p-4 rounded-xl bg-accent/20 border border-accent/30 text-center">
                  <div className="text-3xl font-black text-accent">{stageScore}/{totalQuestions}</div>
                  <p className="text-sm text-muted-foreground font-bold">Correct</p>
                </div>
                <div className="p-4 rounded-xl bg-yellow-500/20 border border-yellow-500/30 text-center">
                  <div className="text-3xl font-black text-yellow-500">{percentage}%</div>
                  <p className="text-sm text-muted-foreground font-bold">Score</p>
                </div>
                <div className="p-4 rounded-xl bg-primary/20 border border-primary/30 text-center">
                  <div className="text-3xl font-black text-primary">+{stagePoints}</div>
                  <p className="text-sm text-muted-foreground font-bold">XP</p>
                </div>
              </div>

              <p className="text-center text-lg font-bold text-foreground">
                {stageScore === totalQuestions
                  ? "🏆 Parfait! Tu as maîtrisé ce stage!"
                  : stageScore >= 8
                    ? "⭐ Très bien! Excellente compréhension!"
                    : stageScore >= 5
                      ? "👍 Bien! Continue ton apprentissage!"
                      : "💪 Essaie encore!"}
              </p>
            </div>

            {/* Detailed Answer Review */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                <BarChart3 className="w-6 h-6 text-primary" />
                Détail des Réponses
              </h2>

              <div className="space-y-4">
                {answers.map((answer, idx) => (
                  <div
                    key={idx}
                    className={`game-card p-6 rounded-2xl ${
                      answer.isCorrect ? "border-accent/50" : "border-red-500/50"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-bold text-lg flex-1 text-foreground">
                        {idx + 1}. {answer.question}
                      </h3>
                      {answer.isCorrect ? (
                        <CheckCircle2 className="w-6 h-6 text-accent flex-shrink-0 ml-2" />
                      ) : (
                        <XCircle className="w-6 h-6 text-red-500 flex-shrink-0 ml-2" />
                      )}
                    </div>

                    <div className="space-y-2 text-sm">
                      <p className="text-muted-foreground">
                        <span className="font-bold text-foreground">Ta réponse:</span>{" "}
                        <span className={answer.isCorrect ? "text-accent" : "text-red-400"}>{answer.userAnswer}</span>
                      </p>
                      {!answer.isCorrect && (
                        <p className="text-muted-foreground">
                          <span className="font-bold text-foreground">Réponse correcte:</span>{" "}
                          <span className="text-accent">{answer.correctAnswer}</span>
                        </p>
                      )}
                      <p className="italic text-muted-foreground pt-2 border-t border-border/30">{answer.explanation}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Next Button */}
            <div className="flex gap-4 justify-center">
              <button
                onClick={handleCompleteStageSummary}
                className="game-btn rounded-xl text-primary-foreground"
              >
                Continuer <Zap className="w-5 h-5 inline ml-2" />
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (stageComplete) {
    const stagePoints = stageScore * (currentStage * 10)
    const hero = stageHeroes[currentStage as keyof typeof stageHeroes]
    
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1 py-24 relative overflow-hidden">
          <div className="absolute inset-0 grid-pattern opacity-50"></div>
          
          <div className="max-w-2xl mx-auto px-4 relative z-10">
            <div className="game-card p-10 rounded-3xl text-center mb-8">
              <span className="text-6xl mb-4 block">{hero.emoji}</span>
              <div className="xp-badge inline-block mb-4">+{stagePoints} XP</div>
              <h1 className="text-3xl font-black text-foreground mb-2">Stage {currentStage} Terminé!</h1>
              <p className="text-lg text-muted-foreground mb-6">{stageData?.name}</p>

              <div className="p-6 rounded-2xl bg-primary/10 border border-primary/30 mb-8">
                <div className="text-4xl font-black text-primary mb-2">
                  {stageScore}/{stageData?.questions.length}
                </div>
                <p className="text-foreground font-bold">Score total: {globalScore + stagePoints}</p>
              </div>

              <div className="flex gap-4 justify-center flex-wrap">
                {currentStage < 5 ? (
                  <>
                    <button
                      onClick={handleRestartStage}
                      className="px-6 py-3 rounded-xl font-bold border-2 border-border/50 text-foreground hover:border-primary/50 transition-all"
                    >
                      Recommencer
                    </button>
                    <button
                      onClick={handleNextStage}
                      className="game-btn rounded-xl text-primary-foreground"
                    >
                      Stage Suivant →
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setAllStagesComplete(true)}
                    className="game-btn rounded-xl text-primary-foreground"
                  >
                    Voir Résultats Finaux
                  </button>
                )}
              </div>
            </div>

            {/* Stage Progress */}
            <div className="grid grid-cols-5 gap-2">
              {[1, 2, 3, 4, 5].map((stage) => {
                const stageHero = stageHeroes[stage as keyof typeof stageHeroes]
                return (
                  <div
                    key={stage}
                    className={`p-4 rounded-xl text-center font-bold transition-all ${
                      completedStages.includes(stage)
                        ? "bg-accent/20 border-2 border-accent"
                        : stage === currentStage
                          ? "bg-primary/20 border-2 border-primary"
                          : "bg-secondary/30 border border-border/50"
                    }`}
                  >
                    <span className="text-2xl">{stageHero.emoji}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!stageData) {
    return <div>Erreur: Stage non trouvé</div>
  }

  const currentQuestion = stageData.questions[currentQuestionIndex]
  const isCorrect = selectedAnswer === currentQuestion.correctAnswer
  const hero = stageHeroes[currentStage as keyof typeof stageHeroes]

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 py-24 relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-50"></div>
        
        <div className="max-w-2xl mx-auto px-4 relative z-10">
          {/* Stage Header */}
          <div 
            className={`mb-8 p-8 rounded-3xl text-center text-white bg-gradient-to-br ${hero.color} relative overflow-hidden`}
          >
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="relative z-10">
              <div className="text-6xl mb-4">{hero.emoji}</div>
              <div className="inline-block px-3 py-1 rounded-full bg-white/20 text-sm font-bold mb-3">
                Stage {currentStage}/5
              </div>
              <h1 className="text-2xl font-black mb-2">{hero.title}</h1>
              <p className="text-white/80">{stageData.description}</p>
            </div>
          </div>

          {/* Progress Header */}
          <div className="game-card p-6 rounded-2xl mb-6">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-primary" />
                <span className="font-bold text-foreground">Difficulté: {stageData.difficulty}</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" />
                <span className="font-bold text-foreground">{stageScore} pts</span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="game-progress h-4">
              <div
                className="game-progress-bar"
                style={{ width: `${((currentQuestionIndex + 1) / stageData.questions.length) * 100}%` }}
              ></div>
            </div>
            <p className="text-center text-sm text-muted-foreground mt-2 font-medium">
              Question {currentQuestionIndex + 1}/{stageData.questions.length}
            </p>
          </div>

          {/* Question */}
          <div className="game-card p-8 rounded-3xl">
            <h3 className="text-xl font-bold text-foreground mb-8">{currentQuestion.question}</h3>

            {/* Options */}
            <div className="space-y-3 mb-8">
              {currentQuestion.options.map((option, index) => {
                const isSelected = selectedAnswer === index
                const showCorrect = answered && index === currentQuestion.correctAnswer

                return (
                  <button
                    key={index}
                    onClick={() => handleSelectAnswer(index)}
                    disabled={answered}
                    className={`w-full p-5 rounded-xl text-left font-medium transition-all ${
                      isSelected
                        ? isCorrect
                          ? "bg-accent/20 border-2 border-accent text-foreground"
                          : "bg-red-500/20 border-2 border-red-500 text-foreground"
                        : showCorrect
                          ? "bg-accent/20 border-2 border-accent text-foreground"
                          : answered
                            ? "bg-secondary/30 border border-border/30 text-muted-foreground"
                            : "bg-secondary/50 border border-border/50 text-foreground hover:border-primary/50 hover:bg-primary/10"
                    } ${answered ? "cursor-default" : "cursor-pointer"}`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{option}</span>
                      {isSelected && (
                        isCorrect ? (
                          <CheckCircle2 className="w-6 h-6 text-accent" />
                        ) : (
                          <XCircle className="w-6 h-6 text-red-500" />
                        )
                      )}
                      {!isSelected && showCorrect && (
                        <CheckCircle2 className="w-6 h-6 text-accent" />
                      )}
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Explanation */}
            {answered && (
              <div className={`p-6 rounded-xl mb-6 ${
                isCorrect 
                  ? "bg-accent/10 border border-accent/30" 
                  : "bg-red-500/10 border border-red-500/30"
              }`}>
                <div className="flex items-start gap-3">
                  {isCorrect ? (
                    <CheckCircle2 className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className={`font-bold mb-2 ${isCorrect ? "text-accent" : "text-red-400"}`}>
                      {isCorrect ? "Correct! +10 XP" : "Incorrect!"}
                    </p>
                    <p className="text-muted-foreground">{currentQuestion.explanation}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Next button */}
            {answered && (
              <button
                onClick={handleNextQuestion}
                className="w-full game-btn rounded-xl text-primary-foreground"
              >
                {currentQuestionIndex === stageData.questions.length - 1 ? "Voir Résumé" : "Question Suivante"}
              </button>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
