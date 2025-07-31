import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Header from './components/Header'
import VideoInput from './components/VideoInput'
import VideoInfo from './components/VideoInfo'
import SummaryDisplay from './components/SummaryDisplay'
import StudyTools from './components/StudyTools'
import LoadingSpinner from './components/LoadingSpinner'
import { ThemeProvider } from './context/ThemeContext'
import { VideoProvider } from './context/VideoContext'

function App() {
  return (
    <ThemeProvider>
      <VideoProvider>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-dark-900 dark:via-dark-800 dark:to-dark-900">
          <Header />
          <main className="container mx-auto px-4 py-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto"
            >
              {/* Hero Section */}
              <div className="text-center mb-12">
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="text-4xl md:text-6xl font-bold mb-6"
                >
                  <span className="text-gradient">You Learn</span>
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto"
                >
                  Transform YouTube videos into concise, AI-powered summaries with timestamps.
                  Download as PDF or DOC files for easy reference.
                </motion.p>
              </div>

              {/* Video Input Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mb-8"
              >
                <VideoInput />
              </motion.div>

              {/* Video Info Section */}
              <VideoInfo />

              {/* Summary Display Section */}
              <SummaryDisplay />

              {/* Study Tools Section */}
              <StudyTools />

              {/* Loading Spinner */}
              <LoadingSpinner />
            </motion.div>
          </main>

          {/* Footer */}
          <footer className="mt-16 py-8 border-t border-gray-200 dark:border-dark-700">
            <div className="container mx-auto px-4 text-center">
              <p className="text-gray-600 dark:text-gray-400">
                Built with ❤️ using React, FastAPI, and Hugging Face Transformers
              </p>
            </div>
          </footer>
        </div>
      </VideoProvider>
    </ThemeProvider>
  )
}

export default App