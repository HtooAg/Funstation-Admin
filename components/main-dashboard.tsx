"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, UserCheck, Trophy, Play, BarChart3, LogOut, Crown, Target, Clock, Zap, Gamepad2 } from "lucide-react"
import Image from "next/image"

interface MainDashboardProps {
  teams: string[]
  marshals: string[]
}

const games = [
  {
    id: "house-of-cards",
    name: "House of Cards",
    icon: <Crown className="w-6 h-6" />,
    description: "Build the tallest card tower",
    color: "from-red-500 to-pink-500",
  },
  {
    id: "office-chair-race",
    name: "Office Chair Race",
    icon: <Zap className="w-6 h-6" />,
    description: "Speed racing on office chairs",
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: "around-the-clock",
    name: "Around the Clock",
    icon: <Clock className="w-6 h-6" />,
    description: "Time-based precision challenge",
    color: "from-green-500 to-emerald-500",
  },
  {
    id: "pass-the-spud",
    name: "Pass the Spud",
    icon: <Target className="w-6 h-6" />,
    description: "Team coordination game",
    color: "from-yellow-500 to-orange-500",
  },
  {
    id: "drop-the-ball",
    name: "Skin the snake",
    icon: <Trophy className="w-6 h-6" />,
    description: "Precision dropping challenge",
    color: "from-purple-500 to-indigo-500",
  },
  {
    id: "extra-games",
    name: "Extra Games",
    icon: <Gamepad2 className="w-6 h-6" />,
    description: "Additional fun activities",
    color: "from-pink-500 to-rose-500",
  },
]

export default function MainDashboard({ teams, marshals }: MainDashboardProps) {
  const [selectedGame, setSelectedGame] = useState<string | null>(null)

  const handleLogout = () => {
    localStorage.removeItem("admin-token")
    localStorage.removeItem("teams")
    localStorage.removeItem("marshals")
    window.location.reload()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-black/20 backdrop-blur-sm border-b border-white/10 p-4"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Image src="/fun-station-logo.png" alt="Fun Station Logo" width={50} height={50} className="rounded-lg" />
            <div>
              <h1 className="text-2xl font-bold text-white">Office Olympics Dashboard</h1>
              <p className="text-white/70">Welcome back, Eric!</p>
            </div>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </motion.header>

      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <Card className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border-blue-500/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Total Teams</CardTitle>
              <Users className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{teams.length}</div>
              <p className="text-xs text-blue-200">Ready to compete</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-500/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Marshals</CardTitle>
              <UserCheck className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{marshals.length}</div>
              <p className="text-xs text-green-200">Game supervisors</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-500/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Games Available</CardTitle>
              <Trophy className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{games.length}</div>
              <p className="text-xs text-yellow-200">Olympic events</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white/10 backdrop-blur-sm">
            <TabsTrigger value="overview" className="data-[state=active]:bg-white/20">
              <BarChart3 className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="teams" className="data-[state=active]:bg-white/20">
              <Users className="w-4 h-4 mr-2" />
              Teams
            </TabsTrigger>
            <TabsTrigger value="marshals" className="data-[state=active]:bg-white/20">
              <UserCheck className="w-4 h-4 mr-2" />
              Marshals
            </TabsTrigger>
            <TabsTrigger value="games" className="data-[state=active]:bg-white/20">
              <Play className="w-4 h-4 mr-2" />
              Games
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Games Overview</CardTitle>
                  <CardDescription className="text-white/70">
                    All available Olympic games for your teams
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {games.map((game, index) => (
                      <motion.div
                        key={game.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.05 }}
                        className={`p-4 rounded-lg bg-gradient-to-br ${game.color} cursor-pointer`}
                        onClick={() => setSelectedGame(game.id)}
                      >
                        <div className="flex items-center space-x-3 mb-2">
                          {game.icon}
                          <h3 className="font-semibold text-white">{game.name}</h3>
                        </div>
                        <p className="text-white/80 text-sm">{game.description}</p>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="teams" className="space-y-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    Competing Teams
                  </CardTitle>
                  <CardDescription className="text-white/70">
                    All teams registered for the Office Olympics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <AnimatePresence>
                      {teams.map((team, index) => (
                        <motion.div
                          key={team}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ scale: 1.05 }}
                        >
                          <Card className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 border-blue-500/30">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h3 className="font-semibold text-white">{team}</h3>
                                  <p className="text-white/70 text-sm">Team #{index + 1}</p>
                                </div>
                                <Badge className="bg-green-500/20 text-green-300 border-green-500/30">Active</Badge>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="marshals" className="space-y-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <UserCheck className="w-5 h-5 mr-2" />
                    Game Marshals
                  </CardTitle>
                  <CardDescription className="text-white/70">Officials overseeing the Olympic games</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <AnimatePresence>
                      {marshals.map((marshal, index) => (
                        <motion.div
                          key={marshal}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ scale: 1.05 }}
                        >
                          <Card className="bg-gradient-to-br from-green-500/20 to-teal-500/20 border-green-500/30">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h3 className="font-semibold text-white">{marshal}</h3>
                                  <p className="text-white/70 text-sm">Marshal #{index + 1}</p>
                                </div>
                                <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">Official</Badge>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="games" className="space-y-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Play className="w-5 h-5 mr-2" />
                    Olympic Games
                  </CardTitle>
                  <CardDescription className="text-white/70">Manage and start individual games</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {games.map((game, index) => (
                      <motion.div
                        key={game.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card className={`bg-gradient-to-r ${game.color} border-0`}>
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                {game.icon}
                                <div>
                                  <h3 className="text-xl font-bold text-white">{game.name}</h3>
                                  <p className="text-white/80">{game.description}</p>
                                </div>
                              </div>
                              <Button
                                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                                onClick={() => setSelectedGame(game.id)}
                              >
                                Start Game
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
