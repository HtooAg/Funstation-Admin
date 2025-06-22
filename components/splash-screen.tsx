"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Trophy, Users, Target, Star, Clock } from "lucide-react"

interface SplashScreenProps {
  onComplete: () => void
  userRole?: "admin" | "marshal" | null
}

export default function SplashScreen({ onComplete, userRole }: SplashScreenProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [showSkip, setShowSkip] = useState(false)

  const slides = [
    {
      icon: <Trophy className="w-20 h-20 text-yellow-500" />,
      title: "Welcome to Office Olympics!",
      description: "Get ready for the ultimate workplace competition",
    },
    {
      icon: <Users className="w-20 h-20 text-slate-700" />,
      title: "Team Competition",
      description:
        userRole === "admin" ? "Create teams and marshals to manage the games" : "Teams are ready to compete!",
    },
    {
      icon: <Target className="w-20 h-20 text-yellow-500" />,
      title: "5 Exciting Games",
      description: "House of Cards, Chair Race, Around the Clock, Pass the Spud, Skin the snake",
    },
    {
      icon: <Clock className="w-20 h-20 text-slate-700" />,
      title: "Time-Based Challenge",
      description: "Each game must be completed within 10 minutes",
    },
    {
      icon: <Star className="w-20 h-20 text-yellow-500" />,
      title: "Let the Games Begin!",
      description: "May the fastest team win the Office Olympics!",
    },
  ]

  useEffect(() => {
    setShowSkip(true)
    const timer = setInterval(() => {
      setCurrentSlide((prev) => {
        if (prev < slides.length - 1) {
          return prev + 1
        } else {
          clearInterval(timer)
          setTimeout(onComplete, 2000)
          return prev
        }
      })
    }, 2500)

    return () => clearInterval(timer)
  }, [onComplete, slides.length])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]"></div>
      </div>

      {/* Skip Button */}
      <AnimatePresence>
        {showSkip && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-8 right-8 z-10"
          >
            <Button
              onClick={onComplete}
              className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold shadow-lg"
            >
              Skip
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Logo */}

      {/* Main Content */}
      <div className="text-center text-white max-w-4xl px-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.8 }}
            transition={{ duration: 0.6, ease: "backOut" }}
            className="space-y-12"
          >
            <motion.div
              className="flex items-center justify-center space-x-6 mb-8"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <motion.div
                animate={{
                  rotate: [0, 5, -5, 0],
                  scale: [1, 1.05, 1],
                }}
                transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
              >
                <Image
                  src="/fun-station-logo.png"
                  alt="Fun Station Logo"
                  width={80}
                  height={80}
                  className="rounded-2xl shadow-2xl"
                />
              </motion.div>

              <motion.h1
                className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-white via-yellow-200 to-white bg-clip-text text-transparent"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                style={{
                  backgroundSize: "200% 200%",
                }}
              >
                {slides[currentSlide].title}
              </motion.h1>
            </motion.div>

            <motion.div
              animate={{
                rotate: [0, 5, -5, 0],
                scale: [1, 1.05, 1],
              }}
              transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
              className="flex justify-center"
            >
              <div className="p-6 bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20">
                {slides[currentSlide].icon}
              </div>
            </motion.div>

            <motion.p
              className="text-xl md:text-2xl text-slate-300 font-medium max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {slides[currentSlide].description}
            </motion.p>
          </motion.div>
        </AnimatePresence>

        {/* Progress Indicator */}
        <motion.div
          className="flex justify-center space-x-3 mt-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          {slides.map((_, index) => (
            <motion.div
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentSlide ? "w-8 bg-yellow-400" : "w-2 bg-white/30"
              }`}
              animate={{
                scale: index === currentSlide ? 1.2 : 1,
              }}
              transition={{ duration: 0.3 }}
            />
          ))}
        </motion.div>
      </div>

      {/* Floating Elements */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-yellow-400/20 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.8, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 4 + Math.random() * 2,
            repeat: Number.POSITIVE_INFINITY,
            delay: Math.random() * 2,
          }}
        />
      ))}
    </div>
  )
}
