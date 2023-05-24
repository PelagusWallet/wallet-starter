import { AnimatePresence, motion } from "framer-motion"
import React, { useEffect, useState } from "react"
import { useLocation } from "wouter"

const greetings = [
  {
    language: "English",
    greeting: "Hello, welcome to Pelagus",
    getStarted: "Click anywhere to get started."
  },
  {
    language: "Spanish",
    greeting: "Hola, bienvenido a Pelagus",
    getStarted: "Haz clic en cualquier lugar para comenzar."
  },
  {
    language: "French",
    greeting: "Bonjour, bienvenue à Pelagus",
    getStarted: "Cliquez n'importe où pour commencer."
  },
  {
    language: "German",
    greeting: "Hallo, willkommen bei Pelagus",
    getStarted: "Klicken Sie irgendwo, um zu starten."
  },
  {
    language: "Italian",
    greeting: "Ciao, benvenuto a Pelagus",
    getStarted: "Clicca ovunque per iniziare."
  },
  {
    language: "Portuguese",
    greeting: "Olá, bem-vindo ao Pelagus",
    getStarted: "Clique em qualquer lugar para começar."
  },
  {
    language: "Russian",
    greeting: "Привет, добро пожаловать в Pelagus",
    getStarted: "Нажмите куда угодно, чтобы начать."
  },
  {
    language: "Chinese",
    greeting: "你好，欢迎来到Pelagus",
    getStarted: "点击任意位置开始。"
  }
]

const App = () => {
  const [index, setIndex] = useState(0)

  const [, setLocation] = useLocation()

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((current) => (current + 1) % greetings.length)
    }, 2800)
    return () => clearInterval(interval)
  }, [])

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
      className="cursor-pointer"
      onClick={() => setLocation("/language")}>
      <AnimatePresence exitBeforeEnter>
        <motion.div
          key={greetings[index].language}
          initial={{ y: 0, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 0, opacity: 0 }}
          className="text-center flex flex-col "
          transition={{ duration: 1.4, ease: "easeInOut" }}
          style={{ color: "white" }}>
          <h1 className="text-[64px]">{greetings[index].greeting}</h1>
          <h2 className="text-[32px]">{greetings[index].getStarted}</h2>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default App
