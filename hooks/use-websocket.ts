"use client"

import { useEffect, useRef, useState } from "react"

interface WebSocketMessage {
  type: string
  data: any
  timestamp: number
}

export function useWebSocket() {
  const [isConnected, setIsConnected] = useState(false)
  const [messages, setMessages] = useState<WebSocketMessage[]>([])
  const wsRef = useRef<WebSocket | null>(null)

  // Simulate WebSocket connection (in real app, this would connect to actual WebSocket server)
  useEffect(() => {
    // Simulate connection
    setIsConnected(true)

    // Listen for localStorage changes to simulate real-time updates
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "gameData" && e.newValue) {
        const gameData = JSON.parse(e.newValue)
        const message: WebSocketMessage = {
          type: "GAME_UPDATE",
          data: gameData,
          timestamp: Date.now(),
        }
        setMessages((prev) => [...prev, message])
      }

      if (e.key === "gameCompleted" && e.newValue) {
        const completedGame = JSON.parse(e.newValue)
        const message: WebSocketMessage = {
          type: "GAME_COMPLETED",
          data: completedGame,
          timestamp: Date.now(),
        }
        setMessages((prev) => [...prev, message])
      }
    }

    window.addEventListener("storage", handleStorageChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [])

  const sendMessage = (type: string, data: any) => {
    const message: WebSocketMessage = {
      type,
      data,
      timestamp: Date.now(),
    }

    // Simulate broadcasting to other tabs/windows
    localStorage.setItem("wsMessage", JSON.stringify(message))
    localStorage.removeItem("wsMessage")
  }

  return {
    isConnected,
    messages,
    sendMessage,
  }
}
