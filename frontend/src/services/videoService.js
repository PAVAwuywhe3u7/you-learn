import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 300000, // 5 minutes timeout for AI processing
})

export const videoService = {
  async getVideoInfo(url) {
    try {
      const response = await api.post('/api/video/info', { url })
      return response.data
    } catch (error) {
      throw new Error(
        error.response?.data?.detail ||
        'Failed to fetch video information. Please check the URL and try again.'
      )
    }
  },

  async generateSummary(transcript, videoTitle, transcriptWithTimestamps = null) {
    try {
      const response = await api.post('/api/summarize', {
        transcript,
        video_title: videoTitle,
        transcript_with_timestamps: transcriptWithTimestamps
      })
      return response.data
    } catch (error) {
      throw new Error(
        error.response?.data?.detail ||
        'Failed to generate summary. Please try again.'
      )
    }
  },

  async translateSummary(summary, targetLanguage) {
    try {
      const response = await api.post('/api/translate', {
        summary,
        target_language: targetLanguage
      })
      return response.data
    } catch (error) {
      throw new Error(
        error.response?.data?.detail ||
        'Failed to translate summary. Please try again.'
      )
    }
  },

  async getSupportedLanguages() {
    try {
      const response = await api.get('/api/languages')
      return response.data
    } catch (error) {
      throw new Error(
        error.response?.data?.detail ||
        'Failed to get supported languages.'
      )
    }
  },

  async generateFlashcards(transcript, videoTitle, numCards = 10) {
    try {
      const response = await api.post('/api/study/flashcards', {
        transcript,
        video_title: videoTitle,
        num_items: numCards
      })
      return response.data
    } catch (error) {
      throw new Error(
        error.response?.data?.detail ||
        'Failed to generate flashcards. Please try again.'
      )
    }
  },

  async generateQuiz(transcript, videoTitle, numQuestions = 5) {
    try {
      const response = await api.post('/api/study/quiz', {
        transcript,
        video_title: videoTitle,
        num_items: numQuestions
      })
      return response.data
    } catch (error) {
      throw new Error(
        error.response?.data?.detail ||
        'Failed to generate quiz. Please try again.'
      )
    }
  },

  async downloadSummary(videoTitle, summary, format) {
    try {
      const endpoint = format === 'pdf' ? '/api/download/pdf' : '/api/download/doc'

      const response = await api.post(endpoint, {
        video_title: videoTitle,
        summary: summary
      }, {
        responseType: 'blob'
      })

      // Create download link
      const blob = new Blob([response.data], {
        type: format === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      })

      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${videoTitle}_summary.${format === 'pdf' ? 'pdf' : 'docx'}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      throw new Error(
        error.response?.data?.detail ||
        `Failed to download ${format.toUpperCase()} file. Please try again.`
      )
    }
  }
}