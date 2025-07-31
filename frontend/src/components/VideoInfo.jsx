import React from 'react'
import { motion } from 'framer-motion'
import { User, Clock } from 'lucide-react'
import { useVideo } from '../context/VideoContext'

const VideoInfo = () => {
  const { videoInfo, currentStep } = useVideo()

  if (!videoInfo || currentStep === 'input') {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="card p-6 mb-8"
    >
      <div className="flex flex-col md:flex-row gap-6">
        {/* Thumbnail */}
        <div className="flex-shrink-0">
          <img
            src={videoInfo.thumbnail_url}
            alt={videoInfo.title}
            className="w-full md:w-48 h-32 object-cover rounded-lg"
          />
        </div>

        {/* Video Details */}
        <div className="flex-1">
          <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
            {videoInfo.title}
          </h2>

          <div className="flex items-center text-gray-600 dark:text-gray-400 mb-2">
            <User className="w-4 h-4 mr-2" />
            <span>{videoInfo.author_name}</span>
          </div>

          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <Clock className="w-4 h-4 mr-2" />
            <span>
              {videoInfo.transcript_with_timestamps?.length || 0} transcript segments
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default VideoInfo