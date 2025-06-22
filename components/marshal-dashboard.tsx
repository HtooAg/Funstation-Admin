"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { LogOut, Users, Trophy, Clock, Play, Bell, CheckCircle } from "lucide-react"
import Image from "next/image"
import { useWebSocket } from "@/hooks/use-websocket"
import { useToast } from "@/hooks/use-toast"

export default function MarshalDashboard() {
  const [teams, setTeams] = useState<string[]>([])
  const [gameData, setGameData] = useState<any[]>([])
  const [notifications, setNotifications] = useState<any[]>([])
  const { messages } = useWebSocket()
  const { toast } = useToast()

  useEffect(() => {
    const savedTeams = localStorage.getItem("teams")
    if (savedTeams) {
      setTeams(JSON.parse(savedTeams))
    }

    const checkGameData = () => {
      const savedGameData = localStorage.getItem("gameData")
      if (savedGameData) {
        setGameData(JSON.parse(savedGameData))
      }
    }

    checkGameData()
    const interval = setInterval(checkGameData, 1000)

    return () => clearInterval(interval)
  }, [])

  // Handle WebSocket messages
  useEffect(() => {
    messages.forEach((message) => {
      if (message.type === "GAME_COMPLETED") {
        const notification = {
          id: Date.now(),
          type: "game_completed",
          title: "Game Completed!",
          message: `${message.data.gameName} has been completed`,
          timestamp: message.timestamp,
          gameIndex: message.data.gameIndex,
          totalGames: message.data.totalGames,
        }

        setNotifications((prev) => [notification, ...prev.slice(0, 4)]) // Keep last 5 notifications

        toast({
          title: "🎉 Game Completed!",
          description: `${message.data.gameName} has been finished by all teams`,
          duration: 5000,
        })
      }
    })
  }, [messages, toast])

  const handleLogout = () => {
    localStorage.removeItem("auth-token")
    localStorage.removeItem("user-role")
    window.location.reload()
  }

  const games = [
    { id: "house-of-cards", name: "House of Cards" },
    { id: "office-chair-race", name: "Office Chair Race" },
    { id: "around-the-clock", name: "Around the Clock" },
    { id: "pass-the-spud", name: "Pass the Spud" },
    { id: "drop-the-ball", name: "Skin the snake" },
  ]

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const getTeamTimes = (gameId: string) => {
    const game = gameData.find((g) => g.id === gameId)
    if (!game) return []

    return Object.entries(game.teams || {})
      .map(([teamName, data]: [string, any]) => ({
        name: teamName,
        time: data.time,
        completed: data.completed,
      }))
      .sort((a, b) => a.time - b.time)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-sm border-b border-slate-200 p-6 shadow-sm"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Image src="/fun-station-logo.png" alt="Fun Station Logo" width={50} height={50} className="rounded-xl" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Office Olympics</h1>
              <p className="text-slate-600 font-medium">Marshal Oversight Dashboard</p>
            </div>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="border-slate-300 text-slate-700 hover:bg-slate-50"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </motion.header>

      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Real-time Notifications */}
        <AnimatePresence>
          {notifications.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg shadow-sm"
            >
              <div className="flex items-center space-x-3">
                <Bell className="w-5 h-5 text-yellow-600" />
                <div>
                  <h3 className="font-semibold text-yellow-800">Latest Update</h3>
                  <p className="text-yellow-700">{notifications[0]?.message}</p>
                  <p className="text-xs text-yellow-600 mt-1">
                    Game {notifications[0]?.gameIndex} of {notifications[0]?.totalGames} completed
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <Card className="bg-white shadow-lg border border-slate-200 hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-slate-600">Total Teams</CardTitle>
              <div className="p-2 bg-blue-50 rounded-lg">
                <Users className="h-4 w-4 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">{teams.length}</div>
              <p className="text-xs text-slate-500 mt-1">Competing teams</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg border border-slate-200 hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-slate-600">Games Completed</CardTitle>
              <div className="p-2 bg-green-50 rounded-lg">
                <Trophy className="h-4 w-4 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">{gameData.length}</div>
              <p className="text-xs text-slate-500 mt-1">Out of 5 games</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg border border-slate-200 hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-slate-600">Status</CardTitle>
              <div className="p-2 bg-purple-50 rounded-lg">
                <Clock className="h-4 w-4 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold text-slate-900">
                {gameData.length === 0 ? "Waiting" : gameData.length === 5 ? "Complete" : "In Progress"}
              </div>
              <p className="text-xs text-slate-500 mt-1">Competition status</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Teams Overview */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="bg-white shadow-lg border border-slate-200">
            <CardHeader>
              <CardTitle className="text-slate-900 font-bold text-xl">Teams Overview</CardTitle>
              <CardDescription className="text-slate-600">
                All teams participating in the Office Olympics
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {teams.map((team, index) => (
                  <motion.div
                    key={team}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <Card className="bg-slate-50 border border-slate-200 hover:shadow-md transition-all">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-slate-900">{team}</h3>
                            <p className="text-slate-500 text-sm">Team #{index + 1}</p>
                          </div>
                          <Badge className="bg-green-100 text-green-700 border-green-200">Ready</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Game Progress with Real-time Results */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="bg-white shadow-lg border border-slate-200">
            <CardHeader>
              <CardTitle className="text-slate-900 font-bold text-xl">Game Progress & Results</CardTitle>
              <CardDescription className="text-slate-600">
                Monitor competition progress and live results
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                {games.map((game, index) => {
                  const gameCompleted = gameData.find((g) => g.id === game.id)
                  const teamTimes = getTeamTimes(game.id)

                  return (
                    <motion.div
                      key={game.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card
                        className={`${
                          gameCompleted ? "bg-green-50 border-green-200" : "bg-slate-50 border-slate-200"
                        } hover:shadow-md transition-all`}
                      >
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-4">
                              <div className="p-2 bg-white rounded-lg shadow-sm">
                                <Play className="w-5 h-5 text-slate-600" />
                              </div>
                              <div>
                                <h3 className="text-lg font-semibold text-slate-900">{game.name}</h3>
                                <p className="text-slate-600 text-sm">
                                  Game {index + 1} of {games.length}
                                </p>
                              </div>
                            </div>
                            <Badge
                              className={`${
                                gameCompleted
                                  ? "bg-green-100 text-green-700 border-green-200"
                                  : "bg-slate-100 text-slate-600 border-slate-200"
                              }`}
                            >
                              {gameCompleted ? (
                                <>
                                  <CheckCircle className="w-3 h-3 mr-1" /> Completed
                                </>
                              ) : (
                                "Pending"
                              )}
                            </Badge>
                          </div>

                          {gameCompleted && teamTimes.length > 0 && (
                            <div className="mt-4 space-y-2">
                              <h4 className="font-semibold text-slate-700 text-sm">Live Results:</h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {teamTimes.map((team, idx) => (
                                  <motion.div
                                    key={team.name}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className={`flex items-center justify-between p-2 rounded-lg text-sm ${
                                      idx === 0
                                        ? "bg-yellow-100 border border-yellow-200"
                                        : "bg-white border border-slate-200"
                                    }`}
                                  >
                                    <span className="font-medium text-slate-900">
                                      {idx + 1}. {team.name}
                                    </span>
                                    <span className={`font-bold ${idx === 0 ? "text-yellow-700" : "text-slate-600"}`}>
                                      {formatTime(team.time)}
                                    </span>
                                  </motion.div>
                                ))}
                              </div>
                            </div>
                          )}

                          {gameCompleted && (
                            <div className="mt-3 text-sm text-green-600 font-medium">
                              ✓ Teams completed: {Object.keys(gameCompleted.teams || {}).length}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Instructions */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="bg-white shadow-lg border border-slate-200">
            <CardHeader>
              <CardTitle className="text-slate-900 font-bold text-xl">Marshal Instructions</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4 text-slate-700">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="font-medium">Monitor team progress and ensure fair play</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="font-medium">Observe game completion status and live results in real-time</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="font-medium">Receive instant notifications when games are completed</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="font-medium">Ensure all teams follow the 10-minute time limit</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="font-medium">Watch for the final results announcement</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
