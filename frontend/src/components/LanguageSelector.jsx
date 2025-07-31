import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Languages, ChevronDown } from 'lucide-react'
import { useVideo } from '../context/VideoContext'

const LanguageSelector = () => {
  const { supportedLanguages, currentLanguage, translateSummary, loading } = useVideo()
  const [isOpen, setIsOpen] = useState(false)

  const handleLanguageChange = async (languageCode) => {
    if (languageCode !== currentLanguage) {
      await translateSummary(languageCode)
    }
    setIsOpen(false)
  }

  if (Object.keys(supportedLanguages).length === 0) {
    return null
  }

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        disabled={loading}
        className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-dark-800 border border-gray-300 dark:border-dark-600 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors duration-200 disabled:opacity-50"
      >
        <Languages className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {supportedLanguages[currentLanguage] || 'English'}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-600 dark:text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </motion.button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-dark-800 border border-gray-300 dark:border-dark-600 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto"
        >
          {Object.entries(supportedLanguages).map(([code, name]) => (
            <motion.button
              key={code}
              whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
              onClick={() => handleLanguageChange(code)}
              className={`w-full text-left px-4 py-3 text-sm hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors duration-200 ${
                currentLanguage === code
                  ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                  : 'text-gray-700 dark:text-gray-300'
              }`}
            >
              {name}
            </motion.button>
          ))}
        </motion.div>
      )}
    </div>
  )
}

export default LanguageSelector