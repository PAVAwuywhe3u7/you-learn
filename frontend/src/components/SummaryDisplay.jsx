import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Download, FileText, RefreshCw, ExternalLink, Volume2, VolumeX } from 'lucide-react'
import { useVideo } from '../context/VideoContext'
import LanguageSelector from './LanguageSelector'

const SummaryDisplay = () => {
  const { videoInfo, summary, translatedSummary, currentLanguage, currentStep, downloadFile, loading, reset } = useVideo()
  const [isPlaying, setIsPlaying] = useState(false)

  const currentSummary = translatedSummary || summary

  if (currentStep !== 'summary' || !currentSummary) {
    return null
  }

  const speakSummary = () => {
    if ('speechSynthesis' in window) {
      if (isPlaying) {
        window.speechSynthesis.cancel()
        setIsPlaying(false)
      } else {
        const text = currentSummary.map(point => point.point).join('. ')
        const utterance = new SpeechSynthesisUtterance(text)
        utterance.rate = 0.8
        utterance.onend = () => setIsPlaying(false)
        window.speechSynthesis.speak(utterance)
        setIsPlaying(true)
      }
    }
  }

  const handleDownload = async (format) => {
    await downloadFile(format)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="card p-8"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
          AI Summary
          {currentLanguage !== 'en' && (
            <span className="text-sm font-normal text-gray-600 dark:text-gray-400 ml-2">
              (Translated)
            </span>
          )}
        </h3>
        <div className="flex items-center space-x-3">
          <LanguageSelector />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={speakSummary}
            className="btn-secondary flex items-center"
            title={isPlaying ? 'Stop audio' : 'Play audio'}
          >
            {isPlaying ? (
              <VolumeX className="w-4 h-4 mr-2" />
            ) : (
              <Volume2 className="w-4 h-4 mr-2" />
            )}
            {isPlaying ? 'Stop' : 'Listen'}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={reset}
            className="btn-secondary flex items-center"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            New Video
          </motion.button>
        </div>
      </div>

      {/* Summary Points */}
      <div className="space-y-4 mb-8">
        {currentSummary.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="flex items-start space-x-3 p-4 bg-gray-50 dark:bg-dark-700 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-600 transition-colors duration-200"
          >
            <div className="flex-shrink-0 w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
              {index + 1}
            </div>
            <div className="flex-1">
              <p className="text-gray-900 dark:text-gray-100 leading-relaxed">
                {item.point}
              </p>
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center space-x-2">
                  {item.section && item.section !== 'Summary' && (
                    <span className="inline-block px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 text-xs rounded-full">
                      {item.section}
                    </span>
                  )}
                  {item.timestamp_formatted && (
                    <span className="inline-block px-2 py-1 bg-gray-200 dark:bg-dark-600 text-gray-700 dark:text-gray-300 text-xs rounded-full">
                      {item.timestamp_formatted}
                    </span>
                  )}
                </div>
                {item.youtube_url && (
                  <motion.a
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    href={item.youtube_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 text-sm font-medium"
                  >
                    <ExternalLink className="w-3 h-3 mr-1" />
                    Jump to video
                  </motion.a>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Download Buttons */}
      <div className="border-t border-gray-200 dark:border-dark-600 pt-6">
        <h4 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          Download Summary
        </h4>
        <div className="flex flex-col sm:flex-row gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleDownload('pdf')}
            disabled={loading}
            className="flex-1 btn-primary flex items-center justify-center py-3 disabled:opacity-50"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : (
              <Download className="w-4 h-4 mr-2" />
            )}
            Download PDF
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleDownload('doc')}
            disabled={loading}
            className="flex-1 btn-secondary flex items-center justify-center py-3 disabled:opacity-50"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
            ) : (
              <FileText className="w-4 h-4 mr-2" />
            )}
            Download DOC
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

export default SummaryDisplay