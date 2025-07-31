import React, { createContext, useContext, useState } from 'react'
import { videoService } from '../services/videoService'

const VideoContext = createContext()

export const useVideo = () => {
  const context = useContext(VideoContext)
  if (!context) {
    throw new Error('useVideo must be used within a VideoProvider')
  }
  return context
}

export const VideoProvider = ({ children }) => {
  const [videoInfo, setVideoInfo] = useState(null)
  const [summary, setSummary] = useState(null)
  const [translatedSummary, setTranslatedSummary] = useState(null)
  const [currentLanguage, setCurrentLanguage] = useState('en')
  const [supportedLanguages, setSupportedLanguages] = useState({})
  const [flashcards, setFlashcards] = useState(null)
  const [quiz, setQuiz] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [currentStep, setCurrentStep] = useState('input') // input, processing, summary

  const processVideo = async (url) => {
    try {
      setLoading(true)
      setError(null)
      setCurrentStep('processing')

      // Step 1: Get video info and transcript
      const info = await videoService.getVideoInfo(url)
      setVideoInfo(info)

      // Step 2: Generate summary with timestamps
      const summaryResult = await videoService.generateSummary(
        info.transcript,
        info.title,
        info.transcript_with_timestamps
      )
      setSummary(summaryResult.summary)

      // Load supported languages
      try {
        const languagesResult = await videoService.getSupportedLanguages()
        setSupportedLanguages(languagesResult.languages)
      } catch (err) {
        console.warn('Failed to load supported languages:', err)
      }

      setCurrentStep('summary')
    } catch (err) {
      setError(err.message || 'An error occurred while processing the video')
      setCurrentStep('input')
    } finally {
      setLoading(false)
    }
  }

  const downloadFile = async (format) => {
    if (!summary || !videoInfo) return

    try {
      setLoading(true)
      await videoService.downloadSummary(videoInfo.title, summary, format)
    } catch (err) {
      setError(err.message || 'Failed to download file')
    } finally {
      setLoading(false)
    }
  }

  const translateSummary = async (targetLanguage) => {
    if (!summary) return

    try {
      setLoading(true)
      const result = await videoService.translateSummary(summary, targetLanguage)
      setTranslatedSummary(result.translated_summary)
      setCurrentLanguage(targetLanguage)
    } catch (err) {
      setError(err.message || 'Failed to translate summary')
    } finally {
      setLoading(false)
    }
  }

  const generateStudyTools = async (type, numItems = 10) => {
    if (!videoInfo) return

    try {
      setLoading(true)
      if (type === 'flashcards') {
        const result = await videoService.generateFlashcards(
          videoInfo.transcript,
          videoInfo.title,
          numItems
        )
        setFlashcards(result.flashcards)
      } else if (type === 'quiz') {
        const result = await videoService.generateQuiz(
          videoInfo.transcript,
          videoInfo.title,
          numItems
        )
        setQuiz(result.quiz)
      }
    } catch (err) {
      setError(err.message || `Failed to generate ${type}`)
    } finally {
      setLoading(false)
    }
  }

  const reset = () => {
    setVideoInfo(null)
    setSummary(null)
    setTranslatedSummary(null)
    setCurrentLanguage('en')
    setFlashcards(null)
    setQuiz(null)
    setError(null)
    setCurrentStep('input')
  }

  const value = {
    videoInfo,
    summary,
    translatedSummary,
    currentLanguage,
    supportedLanguages,
    flashcards,
    quiz,
    loading,
    error,
    currentStep,
    processVideo,
    downloadFile,
    translateSummary,
    generateStudyTools,
    reset,
  }

  return (
    <VideoContext.Provider value={value}>
      {children}
    </VideoContext.Provider>
  )
}