import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, Brain, Volume2, VolumeX, RotateCcw, CheckCircle, XCircle } from 'lucide-react'
import { useVideo } from '../context/VideoContext'

const StudyTools = () => {
  const { flashcards, quiz, generateStudyTools, loading } = useVideo()
  const [activeTab, setActiveTab] = useState('flashcards')
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState({})
  const [showResults, setShowResults] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)

  const handleGenerateFlashcards = () => {
    generateStudyTools('flashcards', 10)
  }

  const handleGenerateQuiz = () => {
    generateStudyTools('quiz', 5)
  }

  const nextCard = () => {
    if (currentCardIndex < flashcards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1)
      setShowAnswer(false)
    }
  }

  const prevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1)
      setShowAnswer(false)
    }
  }

  const handleQuizAnswer = (questionIndex, answer) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionIndex]: answer
    })
  }

  const submitQuiz = () => {
    setShowResults(true)
  }

  const resetQuiz = () => {
    setSelectedAnswers({})
    setShowResults(false)
    setCurrentQuestionIndex(0)
  }

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      if (isPlaying) {
        window.speechSynthesis.cancel()
        setIsPlaying(false)
      } else {
        const utterance = new SpeechSynthesisUtterance(text)
        utterance.rate = 0.8
        utterance.onend = () => setIsPlaying(false)
        window.speechSynthesis.speak(utterance)
        setIsPlaying(true)
      }
    }
  }

  const calculateScore = () => {
    if (!quiz?.questions) return 0
    let correct = 0
    quiz.questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correct_answer) {
        correct++
      }
    })
    return Math.round((correct / quiz.questions.length) * 100)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="card p-8 mt-8"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
          Study Tools
        </h3>

        {/* Tab Navigation */}
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('flashcards')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
              activeTab === 'flashcards'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 dark:bg-dark-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-dark-600'
            }`}
          >
            <BookOpen className="w-4 h-4 inline mr-2" />
            Flashcards
          </button>
          <button
            onClick={() => setActiveTab('quiz')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
              activeTab === 'quiz'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 dark:bg-dark-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-dark-600'
            }`}
          >
            <Brain className="w-4 h-4 inline mr-2" />
            Quiz
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'flashcards' && (
          <motion.div
            key="flashcards"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            {!flashcards ? (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Generate flashcards to help you study and memorize key concepts from this video.
                </p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleGenerateFlashcards}
                  disabled={loading}
                  className="btn-primary disabled:opacity-50"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Generating...
                    </div>
                  ) : (
                    'Generate Flashcards'
                  )}
                </motion.button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Flashcard */}
                <div className="relative">
                  <motion.div
                    key={currentCardIndex}
                    initial={{ rotateY: 0 }}
                    animate={{ rotateY: showAnswer ? 180 : 0 }}
                    transition={{ duration: 0.6 }}
                    className="relative h-64 cursor-pointer"
                    onClick={() => setShowAnswer(!showAnswer)}
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    {/* Front of card */}
                    <div
                      className="absolute inset-0 bg-gradient-to-br from-primary-500 to-purple-600 rounded-xl p-6 flex items-center justify-center text-white"
                      style={{ backfaceVisibility: 'hidden' }}
                    >
                      <div className="text-center">
                        <h4 className="text-lg font-semibold mb-4">Question</h4>
                        <p className="text-xl">{flashcards[currentCardIndex]?.question}</p>
                      </div>
                    </div>

                    {/* Back of card */}
                    <div
                      className="absolute inset-0 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl p-6 flex items-center justify-center text-white"
                      style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                    >
                      <div className="text-center">
                        <h4 className="text-lg font-semibold mb-4">Answer</h4>
                        <p className="text-xl">{flashcards[currentCardIndex]?.answer}</p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Audio button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      const text = showAnswer
                        ? flashcards[currentCardIndex]?.answer
                        : flashcards[currentCardIndex]?.question
                      speakText(text)
                    }}
                    className="absolute top-4 right-4 p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors duration-200"
                  >
                    {isPlaying ? (
                      <VolumeX className="w-5 h-5 text-white" />
                    ) : (
                      <Volume2 className="w-5 h-5 text-white" />
                    )}
                  </button>
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between">
                  <button
                    onClick={prevCard}
                    disabled={currentCardIndex === 0}
                    className="btn-secondary disabled:opacity-50"
                  >
                    Previous
                  </button>

                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {currentCardIndex + 1} of {flashcards.length}
                    </span>
                    <button
                      onClick={() => setShowAnswer(!showAnswer)}
                      className="btn-secondary"
                    >
                      {showAnswer ? 'Show Question' : 'Show Answer'}
                    </button>
                  </div>

                  <button
                    onClick={nextCard}
                    disabled={currentCardIndex === flashcards.length - 1}
                    className="btn-secondary disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'quiz' && (
          <motion.div
            key="quiz"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {!quiz ? (
              <div className="text-center py-12">
                <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Test your knowledge with an AI-generated quiz based on the video content.
                </p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleGenerateQuiz}
                  disabled={loading}
                  className="btn-primary disabled:opacity-50"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Generating...
                    </div>
                  ) : (
                    'Generate Quiz'
                  )}
                </motion.button>
              </div>
            ) : showResults ? (
              <div className="text-center py-8">
                <div className="mb-6">
                  <div className={`text-6xl font-bold mb-4 ${
                    calculateScore() >= 70 ? 'text-green-600' : 'text-orange-600'
                  }`}>
                    {calculateScore()}%
                  </div>
                  <p className="text-xl text-gray-600 dark:text-gray-400">
                    You got {Object.values(selectedAnswers).filter((answer, index) =>
                      answer === quiz.questions[index]?.correct_answer
                    ).length} out of {quiz.questions.length} questions correct!
                  </p>
                </div>

                <div className="space-y-4 mb-8">
                  {quiz.questions.map((question, index) => (
                    <div key={index} className="text-left p-4 bg-gray-50 dark:bg-dark-700 rounded-lg">
                      <div className="flex items-start space-x-3">
                        {selectedAnswers[index] === question.correct_answer ? (
                          <CheckCircle className="w-5 h-5 text-green-600 mt-1" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-600 mt-1" />
                        )}
                        <div className="flex-1">
                          <p className="font-medium mb-2">{question.question}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Your answer: <span className={selectedAnswers[index] === question.correct_answer ? 'text-green-600' : 'text-red-600'}>
                              {question.options[selectedAnswers[index]]}
                            </span>
                          </p>
                          {selectedAnswers[index] !== question.correct_answer && (
                            <p className="text-sm text-green-600 mt-1">
                              Correct answer: {question.options[question.correct_answer]}
                            </p>
                          )}
                          {question.explanation && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                              {question.explanation}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={resetQuiz}
                  className="btn-primary"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Retake Quiz
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold">{quiz.title}</h4>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Question {currentQuestionIndex + 1} of {quiz.questions?.length || 0}
                  </span>
                </div>

                {quiz.questions?.map((question, questionIndex) => (
                  <div key={questionIndex} className="space-y-4">
                    <h5 className="text-lg font-medium">{question.question}</h5>

                    <div className="space-y-2">
                      {Object.entries(question.options).map(([key, value]) => (
                        <motion.button
                          key={key}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          onClick={() => handleQuizAnswer(questionIndex, key)}
                          className={`w-full text-left p-4 rounded-lg border transition-colors duration-200 ${
                            selectedAnswers[questionIndex] === key
                              ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                              : 'border-gray-300 dark:border-dark-600 hover:border-primary-300 dark:hover:border-primary-700'
                          }`}
                        >
                          <span className="font-medium mr-3">{key}.</span>
                          {value}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                ))}

                <div className="flex justify-between pt-6">
                  <div></div>
                  <button
                    onClick={submitQuiz}
                    disabled={Object.keys(selectedAnswers).length !== quiz.questions?.length}
                    className="btn-primary disabled:opacity-50"
                  >
                    Submit Quiz
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default StudyTools