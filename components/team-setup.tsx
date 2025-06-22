"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, X, Users, UserCheck, ArrowRight } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import NewYearAnimation from "@/components/new-year-animation"

interface TeamSetupProps {
  onComplete: (teams: string[], marshals: string[]) => void
}

export default function TeamSetup({ onComplete }: TeamSetupProps) {
  const [teams, setTeams] = useState<string[]>([])
  const [marshals, setMarshals] = useState<string[]>([])
  const [newTeamName, setNewTeamName] = useState("")
  const [newMarshalName, setNewMarshalName] = useState("")
  const [showAnimation, setShowAnimation] = useState(false)
  const { toast } = useToast()

  const addTeam = () => {
    if (newTeamName.trim() && !teams.includes(newTeamName.trim())) {
      setTeams([...teams, newTeamName.trim()])
      setNewTeamName("")
      toast({
        title: "Team Added!",
        description: `${newTeamName.trim()} has been added to the competition.`,
      })
    }
  }

  const addMarshal = () => {
    if (newMarshalName.trim() && !marshals.includes(newMarshalName.trim())) {
      setMarshals([...marshals, newMarshalName.trim()])
      setNewMarshalName("")
      toast({
        title: "Marshal Added!",
        description: `${newMarshalName.trim()} has been added as a marshal.`,
      })
    }
  }

  const removeTeam = (teamToRemove: string) => {
    setTeams(teams.filter((team) => team !== teamToRemove))
  }

  const removeMarshal = (marshalToRemove: string) => {
    setMarshals(marshals.filter((marshal) => marshal !== marshalToRemove))
  }

  const handleStartGame = () => {
    if (teams.length === 0) {
      toast({
        title: "No Teams!",
        description: "Please add at least one team to start the games.",
        variant: "destructive",
      })
      return
    }
    if (marshals.length === 0) {
      toast({
        title: "No Marshals!",
        description: "Please add at least one marshal to start the games.",
        variant: "destructive",
      })
      return
    }
    setShowAnimation(true)
  }

  const handleAnimationComplete = () => {
    onComplete(teams, marshals)
  }

  if (showAnimation) {
    return <NewYearAnimation onComplete={handleAnimationComplete} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Setup Teams & Marshals</h1>
          <p className="text-slate-600 text-lg">Create your teams and assign marshals for the Office Olympics</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Tabs defaultValue="teams" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 bg-white shadow-sm border border-slate-200">
              <TabsTrigger
                value="teams"
                className="data-[state=active]:bg-slate-100 data-[state=active]:text-slate-900 font-medium"
              >
                <Users className="w-4 h-4 mr-2" />
                Teams ({teams.length})
              </TabsTrigger>
              <TabsTrigger
                value="marshals"
                className="data-[state=active]:bg-slate-100 data-[state=active]:text-slate-900 font-medium"
              >
                <UserCheck className="w-4 h-4 mr-2" />
                Marshals ({marshals.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="teams">
              <Card className="bg-white shadow-lg border border-slate-200">
                <CardHeader>
                  <CardTitle className="text-slate-900 flex items-center text-xl font-bold">
                    <Users className="w-5 h-5 mr-2" />
                    Team Management
                  </CardTitle>
                  <CardDescription className="text-slate-600">
                    Add teams that will compete in the Office Olympics
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 p-6">
                  <div className="flex gap-3">
                    <Input
                      placeholder="Enter team name..."
                      value={newTeamName}
                      onChange={(e) => setNewTeamName(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && addTeam()}
                      className="h-12 border-slate-300 focus:border-yellow-400 focus:ring-yellow-400"
                    />
                    <Button
                      onClick={addTeam}
                      className="h-12 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="space-y-3">
                    <AnimatePresence>
                      {teams.map((team, index) => (
                        <motion.div
                          key={team}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                            <span className="font-medium text-slate-900">{team}</span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => removeTeam(team)}
                              className="text-slate-500 hover:text-red-500 hover:bg-red-50"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="marshals">
              <Card className="bg-white shadow-lg border border-slate-200">
                <CardHeader>
                  <CardTitle className="text-slate-900 flex items-center text-xl font-bold">
                    <UserCheck className="w-5 h-5 mr-2" />
                    Marshal Management
                  </CardTitle>
                  <CardDescription className="text-slate-600">Add marshals who will oversee the games</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 p-6">
                  <div className="flex gap-3">
                    <Input
                      placeholder="Enter marshal name..."
                      value={newMarshalName}
                      onChange={(e) => setNewMarshalName(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && addMarshal()}
                      className="h-12 border-slate-300 focus:border-yellow-400 focus:ring-yellow-400"
                    />
                    <Button
                      onClick={addMarshal}
                      className="h-12 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="space-y-3">
                    <AnimatePresence>
                      {marshals.map((marshal, index) => (
                        <motion.div
                          key={marshal}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                            <span className="font-medium text-slate-900">{marshal}</span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => removeMarshal(marshal)}
                              className="text-slate-500 hover:text-red-500 hover:bg-red-50"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <motion.div
            className="text-center mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Button
              onClick={handleStartGame}
              size="lg"
              className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all"
            >
              Start the Games!
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
