"use client"

import { useState, useEffect } from "react"
import { BookOpen, Save, Info, Sparkles } from "lucide-react"

export default function KnowledgeBase() {
  const [rule, setRule] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    fetch("/api/knowledge")
      .then(res => res.json())
      .then(data => {
        if (data.rule) setRule(data.rule)
        setIsLoaded(true)
      })
      .catch(err => {
        console.error(err)
        setIsLoaded(true)
      })
  }, [])

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await fetch("/api/knowledge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rule })
      })
      // Show short feedback if desired, or just finish saving
      setTimeout(() => setIsSaving(false), 500)
    } catch (err) {
      console.error(err)
      setIsSaving(false)
    }
  }

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <BookOpen className="h-7 w-7 text-blue-500" />
            Extra AI Rules
          </h2>
          <p className="text-zinc-400 mt-2">
            Add extra behaviors, instructions, or specific rules for the AI. The AI will remember these alongside its normal database tasks.
          </p>
        </div>
      </div>

      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-xl">
        <div className="mb-4 flex items-center gap-2 text-sm text-blue-400 bg-blue-500/10 p-3 rounded-xl border border-blue-500/20">
          <Info className="h-5 w-5 shrink-0" />
          <p>
            Write anything you want the AI to remember. Example: "If anyone asks for a discount, say 'Sorry, prices are fixed'."
            If you leave this blank, the AI will just do its normal tasks (selling products).
          </p>
        </div>

        {!isLoaded ? (
          <div className="h-64 flex items-center justify-center">
            <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" />
          </div>
        ) : (
          <div className="space-y-4">
            <label className="block text-sm font-semibold text-zinc-300">
              Your Custom Rule / Instruction:
            </label>
            <textarea
              value={rule}
              onChange={(e) => setRule(e.target.value)}
              placeholder="Type your extra rules here..."
              className="w-full h-64 bg-zinc-900 border border-zinc-800 focus:border-blue-500 rounded-xl p-4 text-white outline-none resize-none custom-scrollbar"
            />

            <div className="flex justify-end">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2"
              >
                {isSaving ? (
                  <>Saving...</>
                ) : (
                  <>
                    <Save className="h-4 w-4" /> Save Rule
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
