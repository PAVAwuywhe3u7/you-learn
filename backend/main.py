from fastapi import FastAPI, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel
import os
import tempfile
from typing import Optional

from services.youtube_service import YouTubeService
from services.summarization_service import SummarizationService
from services.file_service import FileService
from services.translation_service import TranslationService
from services.study_tools_service import StudyToolsService

app = FastAPI(title="You Learn API", version="1.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
youtube_service = YouTubeService()
summarization_service = SummarizationService()
file_service = FileService()
translation_service = TranslationService()
study_tools_service = StudyToolsService()

class VideoRequest(BaseModel):
    url: str

class SummarizeRequest(BaseModel):
    transcript: str
    video_title: str
    transcript_with_timestamps: list = None

class TranslateRequest(BaseModel):
    summary: list
    target_language: str

class StudyToolsRequest(BaseModel):
    transcript: str
    video_title: str
    num_items: int = 10

@app.get("/")
async def root():
    return {"message": "You Learn API is running!"}

@app.post("/api/video/info")
async def get_video_info(request: VideoRequest):
    """Get video information and transcript"""
    try:
        video_info = await youtube_service.get_video_info(request.url)
        return video_info
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/summarize")
async def summarize_transcript(request: SummarizeRequest):
    """Summarize the video transcript"""
    try:
        summary = await summarization_service.summarize(
            request.transcript,
            request.transcript_with_timestamps
        )
        return {"summary": summary}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/download/pdf")
async def download_pdf(request: dict):
    """Generate and download PDF summary"""
    try:
        video_title = request.get("video_title", "Video Summary")
        summary = request.get("summary", "")

        pdf_path = file_service.generate_pdf(video_title, summary)

        return FileResponse(
            pdf_path,
            media_type="application/pdf",
            filename=f"{video_title}_summary.pdf"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/download/doc")
async def download_doc(request: dict):
    """Generate and download DOC summary"""
    try:
        video_title = request.get("video_title", "Video Summary")
        summary = request.get("summary", "")

        doc_path = file_service.generate_doc(video_title, summary)

        return FileResponse(
            doc_path,
            media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            filename=f"{video_title}_summary.docx"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/translate")
async def translate_summary(request: TranslateRequest):
    """Translate summary to target language"""
    try:
        translated_summary = await translation_service.translate_summary(
            request.summary, request.target_language
        )
        return {"translated_summary": translated_summary}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/languages")
async def get_supported_languages():
    """Get list of supported languages for translation"""
    try:
        languages = translation_service.get_supported_languages()
        return {"languages": languages}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/study/flashcards")
async def generate_flashcards(request: StudyToolsRequest):
    """Generate flashcards from video transcript"""
    try:
        flashcards = await study_tools_service.generate_flashcards(
            request.transcript, request.video_title, request.num_items
        )
        return {"flashcards": flashcards}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/study/quiz")
async def generate_quiz(request: StudyToolsRequest):
    """Generate quiz from video transcript"""
    try:
        quiz = await study_tools_service.generate_quiz(
            request.transcript, request.video_title, request.num_items
        )
        return {"quiz": quiz}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)