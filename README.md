# 🎓 You Learn - AI-Powered YouTube Video Summarizer

Transform YouTube videos into concise, interactive summaries with advanced AI features including multi-language translation, study tools, and voice audio.

![You Learn Demo](https://img.shields.io/badge/Status-Active-brightgreen)
![React](https://img.shields.io/badge/React-18.x-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-Latest-green)
![Gemini AI](https://img.shields.io/badge/Gemini-AI-orange)

## ✨ Features

### 🤖 **AI-Powered Summarization**
- **Gemini AI Integration** - Advanced summarization using Google's latest AI model
- **Intelligent bullet points** - Key concepts extracted and organized
- **Context-aware processing** - Understands video content and structure

### 🌍 **Multi-Language Translation**
- **19 supported languages** including Spanish, French, German, Japanese, Chinese, Arabic
- **Real-time translation** of summaries
- **Native language support** with proper formatting
- **Elegant language selector** interface

### ⏰ **Interactive Timestamps**
- **Smart timestamp matching** - AI links summary points to video moments
- **Clickable "Jump to video" links** - Direct navigation to relevant video sections
- **Formatted timestamps** (MM:SS or HH:MM:SS)
- **Visual timestamp indicators**

### 📚 **Study Tools**
- **AI-Generated Flashcards**:
  - 3D flip animations
  - Question/answer format
  - Category tagging
  - Navigation controls

- **Interactive Quizzes**:
  - Multiple choice questions
  - Instant scoring
  - Detailed explanations
  - Retake functionality

### 🔊 **Voice Audio Integration**
- **Text-to-speech** for summaries and flashcards
- **Adjustable speech rate**
- **Play/pause controls**
- **Cross-browser compatibility**

### 📄 **Export Options**
- **PDF generation** with formatted summaries
- **DOC file creation** for easy editing
- **Professional formatting**
- **Download management**

### 🎨 **Modern UI/UX**
- **Dark/Light mode** toggle
- **Responsive design** - works on all devices
- **Smooth animations** with Framer Motion
- **Intuitive interface** with clear navigation

## 🚀 Quick Deploy (One-Click)

### Deploy to Production
[![Deploy Frontend to Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/PAVAwuywhe3u7/you-learn&project-name=you-learn-frontend&root-directory=frontend)

[![Deploy Backend to Railway](https://railway.app/button.svg)](https://railway.app/template/you-learn-backend?referralCode=you-learn)

### Local Development

### Prerequisites
- **Python 3.8+**
- **Node.js 16+** and npm
- **Gemini API Key** (free from Google AI Studio)

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/you-learn.git
cd you-learn
```

### 2. Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv .venv
.venv\Scripts\activate  # Windows
# source .venv/bin/activate  # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Create .env file with your Gemini API key
echo "GEMINI_API_KEY=your_api_key_here" > .env

# Start backend server
python main.py
```

### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### 4. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000

## 🛠️ Technology Stack

### Backend
- **FastAPI** - Modern Python web framework
- **Google Gemini AI** - Advanced language model
- **YouTube Transcript API** - Video transcript extraction
- **ReportLab** - PDF generation
- **python-docx** - DOC file creation
- **Uvicorn** - ASGI server

### Frontend
- **React 18** - Modern UI library
- **Vite** - Fast build tool
- **TailwindCSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Lucide React** - Beautiful icons
- **Axios** - HTTP client

## 📁 Project Structure

```
you-learn/
├── backend/
│   ├── services/
│   │   ├── youtube_service.py      # YouTube data extraction
│   │   ├── summarization_service.py # AI summarization
│   │   ├── translation_service.py  # Multi-language translation
│   │   ├── study_tools_service.py  # Flashcards & quizzes
│   │   └── file_service.py         # PDF/DOC generation
│   ├── main.py                     # FastAPI application
│   ├── requirements.txt            # Python dependencies
│   └── .env                        # Environment variables
├── frontend/
│   ├── src/
│   │   ├── components/             # React components
│   │   ├── context/               # React context providers
│   │   ├── services/              # API services
│   │   └── App.jsx                # Main application
│   ├── package.json               # Node.js dependencies
│   └── tailwind.config.js         # TailwindCSS configuration
├── .gitignore                     # Git ignore rules
└── README.md                      # This file
```

## 🔧 API Endpoints

### Video Processing
- `POST /api/video/info` - Extract video information and transcript
- `POST /api/summarize` - Generate AI summary with timestamps

### Translation
- `GET /api/languages` - Get supported languages
- `POST /api/translate` - Translate summary to target language

### Study Tools
- `POST /api/study/flashcards` - Generate flashcards from transcript
- `POST /api/study/quiz` - Generate quiz questions

### File Export
- `POST /api/download/pdf` - Generate PDF summary
- `POST /api/download/doc` - Generate DOC summary

## 🌟 Usage Examples

### Basic Video Summarization
1. Paste a YouTube URL (e.g., `https://www.youtube.com/watch?v=dQw4w9WgXcQ`)
2. Click "Generate Summary"
3. View AI-generated bullet points with timestamps
4. Click "Jump to video" links to navigate to specific moments

### Multi-Language Translation
1. After generating a summary, click the language selector
2. Choose from 19 supported languages
3. Summary is instantly translated while preserving formatting

### Study Tools
1. Scroll to the Study Tools section after summarization
2. Generate flashcards for memorization
3. Take interactive quizzes to test knowledge
4. Use voice audio for auditory learning

## 🔐 Environment Variables

Create a `.env` file in the backend directory:

```env
# Required
GEMINI_API_KEY=your_gemini_api_key_here

# Optional
ENVIRONMENT=development
LOG_LEVEL=info
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

## 🚀 Deployment

### Production Deployment (Recommended)

#### Option 1: Vercel + Railway
1. **Frontend (Vercel)**:
   - Connect your GitHub repo to Vercel
   - Set root directory to `frontend`
   - Add environment variable: `VITE_API_URL=your-backend-url`
   - Deploy automatically

2. **Backend (Railway)**:
   - Connect your GitHub repo to Railway
   - Add environment variable: `GEMINI_API_KEY=your-api-key`
   - Deploy automatically with Dockerfile

#### Option 2: Netlify + Heroku
1. **Frontend (Netlify)**:
   - Connect GitHub repo
   - Set build directory to `frontend`
   - Build command: `npm run build`
   - Publish directory: `dist`

2. **Backend (Heroku)**:
   - Create new Heroku app
   - Connect GitHub repo
   - Set buildpack to Python
   - Add environment variables

### Using Docker (Local)
```bash
# Build and run with Docker Compose
docker-compose up --build
```

### Manual Deployment
```bash
# Backend (Production)
cd backend
pip install gunicorn
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000

# Frontend (Production)
cd frontend
npm run build
npm run preview
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google Gemini AI** for advanced language processing
- **YouTube Transcript API** for video transcript extraction
- **React & FastAPI** communities for excellent frameworks
- **TailwindCSS** for beautiful styling utilities

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/yourusername/you-learn/issues) page
2. Create a new issue with detailed information
3. Join our [Discussions](https://github.com/yourusername/you-learn/discussions)

---

**Made with ❤️ by [Your Name]**

⭐ **Star this repository if you found it helpful!**

## Features

- 🎥 Extract transcripts from YouTube videos
- 🤖 AI-powered summarization using Hugging Face models
- 📄 Download summaries as PDF or DOC files
- 🌙 Dark mode support
- 📱 Mobile-responsive design
- ✨ Smooth animations with Framer Motion

## Tech Stack

### Frontend
- React.js with Vite
- TailwindCSS for styling
- Framer Motion for animations
- Axios for API calls

### Backend
- FastAPI (Python)
- YouTube Transcript API
- Hugging Face Transformers
- ReportLab (PDF generation)
- python-docx (DOC generation)

## Project Structure

```
you-learn/
├── frontend/          # React.js application
├── backend/           # FastAPI server
├── README.md
└── requirements.txt   # Python dependencies
```

## Getting Started

### Backend Setup
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## Deployment

The application is configured for deployment on Hugging Face Spaces.

## License

MIT License