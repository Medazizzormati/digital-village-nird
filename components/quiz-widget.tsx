"use client"

import type React from "react"
import { useState } from "react"
import { Loader2 } from "lucide-react"

export function QuizWidget({ onClose }: { onClose: () => void }) {
  const [question, setQuestion] = useState("")
  const [answer, setAnswer] = useState("")
  const [loading, setLoading] = useState(false)
  const [answered, setAnswered] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!question.trim()) return

    setLoading(true)
    try {
      const response = await fetch("/api/quiz/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      })

      if (!response.ok) {
        throw new Error("Failed to get quiz response")
      }

      const data = await response.json()
      setAnswer(data.answer)
      setAnswered(true)
    } catch (error) {
      console.error("[v0] Quiz error:", error)
      setAnswer("Oups! Une erreur est survenue. Veuillez réessayer.")
      setAnswered(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="py-16 bg-secondary/20 border-y-4 border-primary">
      <div className="max-w-2xl mx-auto px-4">
        <div
          className="p-8 bg-card rounded-lg border-2 border-primary"
          style={{ boxShadow: "4px 4px 0px rgba(0,0,0,0.15)" }}
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-primary">Quiz NIRD Intelligent</h3>
            <button onClick={onClose} className="text-primary hover:text-primary/70 font-bold text-xl">
              ×
            </button>
          </div>

          {!answered ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Posez votre question sur NIRD..."
                className="w-full px-4 py-2 border-2 border-primary rounded bg-background text-foreground placeholder-muted-foreground"
                rows={3}
              />
              <button
                type="submit"
                disabled={loading || !question.trim()}
                className="w-full px-4 py-2 bg-primary text-primary-foreground font-bold border-2 border-primary rounded flex items-center justify-center gap-2"
                style={{
                  boxShadow: "3px 3px 0px rgba(0,0,0,0.2)",
                  opacity: loading || !question.trim() ? 0.6 : 1,
                  cursor: loading || !question.trim() ? "not-allowed" : "pointer",
                }}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Réponse en cours...
                  </>
                ) : (
                  "Obtenir une réponse"
                )}
              </button>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-primary/10 border-2 border-primary rounded">
                <p className="font-bold text-primary mb-2">Votre question:</p>
                <p className="text-foreground">{question}</p>
              </div>
              <div className="p-4 bg-accent/10 border-2 border-accent rounded">
                <p className="font-bold text-accent mb-2">Réponse NIRD:</p>
                <p className="text-foreground whitespace-pre-wrap">{answer}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setQuestion("")
                    setAnswer("")
                    setAnswered(false)
                  }}
                  className="flex-1 px-4 py-2 bg-secondary text-secondary-foreground font-bold border-2 border-secondary rounded"
                  style={{ boxShadow: "3px 3px 0px rgba(0,0,0,0.2)", cursor: "pointer" }}
                >
                  Nouvelle question
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2 bg-primary text-primary-foreground font-bold border-2 border-primary rounded"
                  style={{ boxShadow: "3px 3px 0px rgba(0,0,0,0.2)", cursor: "pointer" }}
                >
                  Fermer
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
