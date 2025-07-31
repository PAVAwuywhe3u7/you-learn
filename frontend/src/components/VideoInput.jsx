import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Play, AlertCircle } from 'lucide-react'
import { useVideo } from '../context/VideoContext'

const VideoInput = () => {
  const [url, setUrl] = useState('')
  const { processVideo, loading, error, currentStep } = useVideo()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!url.trim()) return

    await processVideo(url.trim())
  }

  const isValidYouTubeUrl = (url) => {
    const patterns = [
      /^https?:\/\/(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)/,
      /^https?:\/\/(www\.)?youtube\.com\/embed\//
    ]
    return patterns.some(pattern => pattern.test(url))
  }

  const urlIsValid = url.trim() === '' || isValidYouTubeUrl(url)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="card p-8"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="youtube-url" className="block text-lg font-medium mb-3">
            YouTube Video URL
          </label>
          <div className="relative">
            <input
              id="youtube-url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              className={`input-field pr-12 ${!urlIsValid ? 'border-red-500 focus:ring-red-500' : ''}`}
              disabled={loading}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <Play className="w-5 h-5 text-gray-400" />
            </div>
          </div>

          {!urlIsValid && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center mt-2 text-red-600 dark:text-red-400"
            >
              <AlertCircle className="w-4 h-4 mr-2" />
              <span className="text-sm">Please enter a valid YouTube URL</span>
            </motion.div>
          )}
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
          >
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mr-3" />
              <p className="text-red-700 dark:text-red-300">{error}</p>
            </div>
          </motion.div>
        )}

        <motion.button
          whileHover={{ scale: loading ? 1 : 1.02 }}
          whileTap={{ scale: loading ? 1 : 0.98 }}
          type="submit"
          disabled={loading || !url.trim() || !urlIsValid}
          className="w-full btn-primary py-4 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
              {currentStep === 'processing' ? 'Processing Video...' : 'Generating Summary...'}
            </div>
          ) : (
            'Summarize Video'
          )}
        </motion.button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Paste any YouTube video URL to get an AI-powered summary with timestamps
        </p>
      </div>
    </motion.div>
  )
}

export default VideoInput