import React from 'react'
import { motion } from 'framer-motion'
import { Brain, Download, FileText } from 'lucide-react'
import { useVideo } from '../context/VideoContext'

const LoadingSpinner = () => {
  const { loading, currentStep } = useVideo()

  if (!loading) {
    return null
  }

  const getLoadingContent = () => {
    switch (currentStep) {
      case 'processing':
        return {
          icon: <FileText className="w-8 h-8" />,
          title: 'Fetching Video Transcript',
          description: 'Extracting captions and video information...'
        }
      case 'summary':
        return {
          icon: <Brain className="w-8 h-8" />,
          title: 'Generating AI Summary',
          description: 'Analyzing content and creating bullet points...'
        }
      default:
        return {
          icon: <Download className="w-8 h-8" />,
          title: 'Processing',
          description: 'Please wait...'
        }
    }
  }

  const content = getLoadingContent()

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="card p-8 max-w-md mx-4 text-center"
      >
        {/* Animated Icon */}
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.1, 1]
          }}
          transition={{
            rotate: { duration: 2, repeat: Infinity, ease: "linear" },
            scale: { duration: 1, repeat: Infinity, ease: "easeInOut" }
          }}
          className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 text-white rounded-full mb-6"
        >
          {content.icon}
        </motion.div>

        {/* Loading Text */}
        <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
          {content.title}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {content.description}
        </p>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 dark:bg-dark-600 rounded-full h-2 mb-4">
          <motion.div
            className="bg-primary-600 h-2 rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400">
          This may take a few moments...
        </p>
      </motion.div>
    </motion.div>
  )
}

export default LoadingSpinner