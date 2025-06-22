"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trophy, Medal, Award, Download, ArrowLeft } from "lucide-react"
import Image from "next/image"

interface ResultsScreenProps {
  teams: string[]
  onBack: () => void
}

interface TeamResult {
  name: string
  totalTime: number
  gamesCompleted: number
  position: number
}

export default function ResultsScreen({ teams, onBack }: ResultsScreenProps) {
  const [results, setResults] = useState<TeamResult[]>([])
  const [showAnimation, setShowAnimation] = useState(true)

  useEffect(() => {
    const gameData = JSON.parse(localStorage.getItem("gameData") || "[]")

    const teamResults: TeamResult[] = teams.map((team) => {
      let totalTime = 0
      let gamesCompleted = 0

      gameData.forEach((game: any) => {
        if (game.teams[team]) {
          totalTime += game.teams[team].time
          gamesCompleted++
        }
      })

      return {
        name: team,
        totalTime,
        gamesCompleted,
        position: 0,
      }
    })

    // Sort by total time (ascending) and assign positions
    teamResults.sort((a, b) => a.totalTime - b.totalTime)
    teamResults.forEach((team, index) => {
      team.position = index + 1
    })

    setResults(teamResults)

    // Hide animation after 3 seconds
    setTimeout(() => setShowAnimation(false), 3000)
  }, [teams])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const exportToPDF = async () => {
    // Create PDF content
    const pdfContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Office Olympics Results</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; }
          .header { text-align: center; margin-bottom: 40px; }
          .logo { width: 80px; height: 80px; margin: 0 auto 20px; }
          .title { font-size: 28px; font-weight: bold; color: #1e293b; margin-bottom: 10px; }
          .subtitle { font-size: 18px; color: #64748b; }
          .results-table { width: 100%; border-collapse: collapse; margin-top: 30px; }
          .results-table th, .results-table td { padding: 15px; text-align: left; border-bottom: 1px solid #e2e8f0; }
          .results-table th { background-color: #f8fafc; font-weight: bold; }
          .winner { background-color: #fef3c7; }
          .podium { background-color: #f0f9ff; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">🏆</div>
          <div class="title">Office Olympics 2025 - Final Results</div>
          <div class="subtitle">Competition Results</div>
        </div>
        
        <table class="results-table">
          <thead>
            <tr>
              <th>Position</th>
              <th>Team Name</th>
              <th>Total Time</th>
              <th>Games Completed</th>
            </tr>
          </thead>
          <tbody>
            ${results
              .map(
                (team) => `
              <tr class="${team.position === 1 ? "winner" : team.position <= 3 ? "podium" : ""}">
                <td>${team.position}</td>
                <td>${team.name}</td>
                <td>${formatTime(team.totalTime)}</td>
                <td>${team.gamesCompleted}</td>
              </tr>
            `,
              )
              .join("")}
          </tbody>
        </table>
        
        <div style="margin-top: 40px; text-align: center; color: #64748b;">
          Generated on ${new Date().toLocaleDateString()}
        </div>
      </body>
      </html>
    `

    // Create and download PDF
    const blob = new Blob([pdfContent], { type: "text/html" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "office-olympics-results.html"
    a.click()
    URL.revokeObjectURL(url)
  }

  const getPodiumIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Trophy className="w-8 h-8 text-yellow-500" />
      case 2:
        return <Medal className="w-8 h-8 text-gray-400" />
      case 3:
        return <Award className="w-8 h-8 text-amber-600" />
      default:
        return (
          <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center text-slate-600 font-bold">
            {position}
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Winner Animation */}
      <AnimatePresence>
        {showAnimation && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="text-center"
            >
              <motion.div
                animate={{
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                className="mb-8"
              >
                <Trophy className="w-32 h-32 text-yellow-400 mx-auto" />
              </motion.div>

              <motion.h1
                className="text-6xl font-bold text-white mb-4"
                animate={{
                  textShadow: [
                    "0 0 20px rgba(251,191,36,0.5)",
                    "0 0 40px rgba(251,191,36,0.8)",
                    "0 0 20px rgba(251,191,36,0.5)",
                  ],
                }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              >
                🎉 WINNER! 🎉
              </motion.h1>

              <motion.h2
                className="text-4xl font-bold text-yellow-400 mb-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                {results[0]?.name}
              </motion.h2>

              <motion.p
                className="text-2xl text-white"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                Total Time: {formatTime(results[0]?.totalTime || 0)}
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-sm border-b border-slate-200 p-6 shadow-sm"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button onClick={onBack} variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-50">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <div className="relative">
              <Image src="/fun-station-logo.png" alt="Fun Station Logo" width={50} height={50} className="rounded-xl" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Final Results</h1>
              <p className="text-slate-600 font-medium">Office Olympics 2025</p>
            </div>
          </div>
          <Button onClick={exportToPDF} className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold">
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </motion.header>

      <div className="max-w-6xl mx-auto p-6 space-y-8">
        {/* Podium */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="bg-white shadow-lg border border-slate-200">
            <CardHeader>
              <CardTitle className="text-center text-2xl font-bold text-slate-900">🏆 Podium 🏆</CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="flex justify-center items-end space-x-8">
                {/* Second Place */}
                {results[1] && (
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-center"
                  >
                    <div className="bg-slate-200 h-24 w-32 rounded-t-lg flex items-center justify-center mb-4">
                      <span className="text-2xl font-bold text-slate-700">2nd</span>
                    </div>
                    <Medal className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <h3 className="font-bold text-slate-900">{results[1].name}</h3>
                    <p className="text-slate-600">{formatTime(results[1].totalTime)}</p>
                  </motion.div>
                )}

                {/* First Place */}
                {results[0] && (
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-center"
                  >
                    <div className="bg-yellow-400 h-32 w-32 rounded-t-lg flex items-center justify-center mb-4">
                      <span className="text-2xl font-bold text-black">1st</span>
                    </div>
                    <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-2" />
                    <h3 className="font-bold text-slate-900 text-lg">{results[0].name}</h3>
                    <p className="text-slate-600 font-semibold">{formatTime(results[0].totalTime)}</p>
                  </motion.div>
                )}

                {/* Third Place */}
                {results[2] && (
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="text-center"
                  >
                    <div className="bg-amber-200 h-20 w-32 rounded-t-lg flex items-center justify-center mb-4">
                      <span className="text-2xl font-bold text-amber-800">3rd</span>
                    </div>
                    <Award className="w-12 h-12 text-amber-600 mx-auto mb-2" />
                    <h3 className="font-bold text-slate-900">{results[2].name}</h3>
                    <p className="text-slate-600">{formatTime(results[2].totalTime)}</p>
                  </motion.div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Full Results Table */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="bg-white shadow-lg border border-slate-200">
            <CardHeader>
              <CardTitle className="text-slate-900 font-bold text-xl">Complete Results</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {results.map((team, index) => (
                  <motion.div
                    key={team.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className={`p-4 rounded-xl border-2 ${
                      team.position === 1
                        ? "bg-yellow-50 border-yellow-200"
                        : team.position === 2
                          ? "bg-slate-50 border-slate-200"
                          : team.position === 3
                            ? "bg-amber-50 border-amber-200"
                            : "bg-slate-50 border-slate-200"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        {getPodiumIcon(team.position)}
                        <div>
                          <h3 className="font-bold text-slate-900 text-lg">{team.name}</h3>
                          <p className="text-slate-600">{team.gamesCompleted} games completed</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-slate-900">{formatTime(team.totalTime)}</div>
                        <Badge
                          className={
                            team.position === 1
                              ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                              : team.position <= 3
                                ? "bg-blue-100 text-blue-800 border-blue-200"
                                : "bg-slate-100 text-slate-600 border-slate-200"
                          }
                        >
                          {team.position === 1
                            ? "Winner"
                            : `${team.position}${team.position === 2 ? "nd" : team.position === 3 ? "rd" : "th"} Place`}
                        </Badge>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
