"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Loader2, Sparkles, CheckCircle2, XCircle, Monitor, Shield, Leaf, BookOpen, Users, Lock, Cpu, Wrench } from "lucide-react"

interface Question {
    question: string
    options: string[]
    correctAnswer: number
    explanation: string
}

const suggestedTopics = [
    { label: "Linux", icon: Monitor, color: "from-orange-500 to-red-500", keywords: "linux ubuntu distribution" },
    { label: "Sécurité", icon: Shield, color: "from-blue-500 to-cyan-500", keywords: "sécurité chiffrement mot de passe" },
    { label: "Environnement", icon: Leaf, color: "from-green-500 to-emerald-500", keywords: "environnement écologie durable" },
    { label: "Logiciels Libres", icon: BookOpen, color: "from-purple-500 to-pink-500", keywords: "libre open source libreoffice" },
    { label: "Inclusion", icon: Users, color: "from-cyan-500 to-blue-500", keywords: "inclusion accessibilité handicap" },
    { label: "Éducation", icon: Cpu, color: "from-yellow-500 to-orange-500", keywords: "école éducation enseignement" },
    { label: "Vie Privée", icon: Lock, color: "from-pink-500 to-rose-500", keywords: "privacy vie privée rgpd données" },
    { label: "Matériel", icon: Wrench, color: "from-gray-500 to-slate-500", keywords: "hardware matériel obsolescence réparation" },
]

export default function AIQuizPage() {
    const [topic, setTopic] = useState("")
    const [difficulty, setDifficulty] = useState("medium")
    const [count, setCount] = useState(5)
    const [loading, setLoading] = useState(false)
    const [questions, setQuestions] = useState<Question[]>([])
    const [error, setError] = useState("")
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
    const [answered, setAnswered] = useState(false)
    const [score, setScore] = useState(0)

    const handleGenerate = async () => {
        if (!topic.trim()) {
            setError("Veuillez entrer un sujet")
            return
        }

        setLoading(true)
        setError("")
        setQuestions([])
        setCurrentQuestionIndex(0)
        setScore(0)

        try {
            const response = await fetch("/api/quiz/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ topic, difficulty, count }),
            })

            if (!response.ok) {
                throw new Error("Erreur lors de la génération")
            }

            const data = await response.json()
            setQuestions(data.questions)
        } catch (err) {
            setError("Erreur lors de la génération des questions. Veuillez réessayer.")
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleSelectAnswer = (index: number) => {
        if (!answered) {
            setSelectedAnswer(index)
            setAnswered(true)
            if (index === questions[currentQuestionIndex].correctAnswer) {
                setScore(score + 1)
            }
        }
    }

    const handleNextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1)
            setSelectedAnswer(null)
            setAnswered(false)
        }
    }

    const handleReset = () => {
        setQuestions([])
        setCurrentQuestionIndex(0)
        setSelectedAnswer(null)
        setAnswered(false)
        setScore(0)
        setTopic("")
    }

    const handleTopicClick = (topicKeywords: string) => {
        setTopic(topicKeywords)
    }

    const currentQuestion = questions[currentQuestionIndex]
    const isCorrect = selectedAnswer === currentQuestion?.correctAnswer
    const isComplete = questions.length > 0 && currentQuestionIndex === questions.length - 1 && answered

    return (
        <div className="min-h-screen flex flex-col bg-[#0a0a0a]">
            <Navigation />
            <main className="flex-1 pt-24 pb-16">
                <div className="max-w-4xl mx-auto px-4">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full mb-6">
                            <Sparkles className="w-5 h-5" />
                            <span className="font-bold">Quiz Intelligent</span>
                        </div>
                        <h1 className="text-4xl sm:text-5xl font-black text-white mb-4">
                            Quiz <span className="bg-gradient-to-r from-primary to-cyan-400 bg-clip-text text-transparent">NIRD</span> Personnalisé
                        </h1>
                        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                            Générez des questions de quiz personnalisées sur n&apos;importe quel sujet NIRD
                        </p>
                    </div>

                    {questions.length === 0 ? (
                        /* Generation Form */
                        <div className="space-y-8">
                            {/* Topic Suggestions */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-4">Sujets suggérés</label>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                    {suggestedTopics.map((t, idx) => {
                                        const Icon = t.icon
                                        const isSelected = topic === t.keywords
                                        return (
                                            <button
                                                key={idx}
                                                onClick={() => handleTopicClick(t.keywords)}
                                                className={`p-4 rounded-xl border transition-all duration-300 flex flex-col items-center gap-2 ${
                                                    isSelected 
                                                        ? "bg-white/10 border-primary shadow-lg shadow-primary/20" 
                                                        : "bg-white/5 border-white/10 hover:border-white/30"
                                                }`}
                                            >
                                                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${t.color} flex items-center justify-center`}>
                                                    <Icon className="w-5 h-5 text-white" />
                                                </div>
                                                <span className="text-sm font-medium text-white">{t.label}</span>
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>

                            {/* Main Form */}
                            <div className="p-8 rounded-2xl bg-white/5 border border-white/10">
                                <h2 className="text-xl font-bold text-white mb-6">Personnaliser votre Quiz</h2>

                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Sujet du Quiz</label>
                                        <input
                                            type="text"
                                            value={topic}
                                            onChange={(e) => setTopic(e.target.value)}
                                            placeholder="Ex: Linux, sécurité, environnement, logiciels libres..."
                                            className="w-full px-4 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">Difficulté</label>
                                            <select
                                                value={difficulty}
                                                onChange={(e) => setDifficulty(e.target.value)}
                                                className="w-full px-4 py-4 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-primary transition-all"
                                            >
                                                <option value="easy">Facile</option>
                                                <option value="medium">Moyen</option>
                                                <option value="hard">Difficile</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">Nombre de questions</label>
                                            <input
                                                type="number"
                                                value={count}
                                                onChange={(e) => setCount(Number.parseInt(e.target.value))}
                                                min="1"
                                                max="10"
                                                className="w-full px-4 py-4 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-primary transition-all"
                                            />
                                        </div>
                                    </div>

                                    {error && (
                                        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 font-medium">
                                            {error}
                                        </div>
                                    )}

                                    <button
                                        onClick={handleGenerate}
                                        disabled={loading}
                                        className="w-full py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-primary to-cyan-400 text-black flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-primary/30 transition-all disabled:opacity-50"
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                Génération en cours...
                                            </>
                                        ) : (
                                            <>
                                                <Sparkles className="w-5 h-5" />
                                                Générer le Quiz
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Info */}
                            <div className="p-6 rounded-xl bg-primary/10 border border-primary/30 text-center">
                                <p className="text-sm text-gray-300">
                                    <span className="text-primary font-bold">80+ questions</span> disponibles sur 8 thèmes différents : Linux, Sécurité, Environnement, Logiciels Libres, Inclusion, Éducation, Vie Privée et Matériel.
                                </p>
                            </div>
                        </div>
                    ) : isComplete ? (
                        /* Results */
                        <div className="p-8 rounded-2xl bg-white/5 border border-white/10 text-center">
                            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary to-cyan-400 flex items-center justify-center">
                                <CheckCircle2 className="w-10 h-10 text-black" />
                            </div>
                            <h2 className="text-3xl font-black text-white mb-4">Quiz Terminé!</h2>
                            <div className="text-6xl font-black bg-gradient-to-r from-primary to-cyan-400 bg-clip-text text-transparent mb-4">
                                {score}/{questions.length}
                            </div>
                            <p className="text-xl text-gray-300 mb-8">
                                {score === questions.length
                                    ? "Parfait! Excellent travail!"
                                    : score >= questions.length * 0.7
                                        ? "Très bien! Bonne compréhension!"
                                        : "Continue à apprendre!"}
                            </p>
                            <button
                                onClick={handleReset}
                                className="px-8 py-4 rounded-xl font-bold bg-gradient-to-r from-primary to-cyan-400 text-black hover:shadow-lg hover:shadow-primary/30 transition-all"
                            >
                                Nouveau Quiz
                            </button>
                        </div>
                    ) : (
                        /* Quiz Question */
                        <div>
                            {/* Progress */}
                            <div className="p-4 rounded-xl bg-white/5 border border-white/10 mb-6">
                                <div className="flex justify-between items-center mb-3">
                                    <span className="font-bold text-white">
                                        Question {currentQuestionIndex + 1}/{questions.length}
                                    </span>
                                    <span className="font-bold text-primary">Score: {score}</span>
                                </div>
                                <div className="w-full bg-white/10 rounded-full overflow-hidden h-2">
                                    <div
                                        className="bg-gradient-to-r from-primary to-cyan-400 h-full transition-all duration-300"
                                        style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                                    ></div>
                                </div>
                            </div>

                            {/* Question */}
                            <div className="p-8 rounded-2xl bg-white/5 border border-white/10 mb-6">
                                <h3 className="text-2xl font-bold text-white mb-8">{currentQuestion.question}</h3>

                                <div className="space-y-4 mb-6">
                                    {currentQuestion.options.map((option, index) => {
                                        const isSelected = selectedAnswer === index
                                        const isCorrectAnswer = index === currentQuestion.correctAnswer
                                        const showAsCorrect = answered && isCorrectAnswer
                                        const showAsWrong = answered && isSelected && !isCorrectAnswer

                                        return (
                                            <button
                                                key={index}
                                                onClick={() => handleSelectAnswer(index)}
                                                disabled={answered}
                                                className={`w-full p-5 rounded-xl border-2 text-left font-medium transition-all ${
                                                    showAsCorrect
                                                        ? "border-green-500 bg-green-500/20 text-green-400"
                                                        : showAsWrong
                                                            ? "border-red-500 bg-red-500/20 text-red-400"
                                                            : isSelected
                                                                ? "border-primary bg-primary/20 text-white"
                                                                : "border-white/10 bg-white/5 text-gray-300 hover:border-white/30 hover:bg-white/10"
                                                } ${answered ? "cursor-default" : "cursor-pointer"}`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span>{option}</span>
                                                    {showAsCorrect && <CheckCircle2 className="w-6 h-6 text-green-500" />}
                                                    {showAsWrong && <XCircle className="w-6 h-6 text-red-500" />}
                                                </div>
                                            </button>
                                        )
                                    })}
                                </div>

                                {answered && (
                                    <div className={`p-6 rounded-xl mb-6 ${
                                        isCorrect 
                                            ? "bg-green-500/10 border border-green-500/30" 
                                            : "bg-red-500/10 border border-red-500/30"
                                    }`}>
                                        <p className={`font-bold mb-2 ${isCorrect ? "text-green-400" : "text-red-400"}`}>
                                            {isCorrect ? "Correct!" : "Incorrect"}
                                        </p>
                                        <p className="text-gray-300">{currentQuestion.explanation}</p>
                                    </div>
                                )}

                                {answered && (
                                    <button
                                        onClick={handleNextQuestion}
                                        className="w-full py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-primary to-cyan-400 text-black hover:shadow-lg hover:shadow-primary/30 transition-all"
                                    >
                                        {currentQuestionIndex === questions.length - 1 ? "Voir les Résultats" : "Question Suivante"}
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    )
}
