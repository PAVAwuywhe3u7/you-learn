import re
import requests
from youtube_transcript_api import YouTubeTranscriptApi
from typing import Dict, List, Optional
import asyncio

class YouTubeService:
    def __init__(self):
        self.api_key = None  # Optional: Add YouTube Data API key for enhanced features

    def extract_video_id(self, url: str) -> str:
        """Extract video ID from YouTube URL"""
        patterns = [
            r'(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)',
            r'youtube\.com\/watch\?.*v=([^&\n?#]+)'
        ]

        for pattern in patterns:
            match = re.search(pattern, url)
            if match:
                return match.group(1)

        raise ValueError("Invalid YouTube URL")

    async def get_video_info(self, url: str) -> Dict:
        """Get video information and transcript"""
        try:
            video_id = self.extract_video_id(url)

            # Get video metadata using oembed (no API key required)
            metadata = await self._get_video_metadata(video_id)

            # Get transcript
            transcript_data = await self._get_transcript(video_id)

            return {
                "video_id": video_id,
                "title": metadata.get("title", "Unknown Title"),
                "author_name": metadata.get("author_name", "Unknown Channel"),
                "thumbnail_url": metadata.get("thumbnail_url", ""),
                "transcript": transcript_data["text"],
                "transcript_with_timestamps": transcript_data["with_timestamps"]
            }

        except Exception as e:
            raise Exception(f"Failed to fetch video information: {str(e)}")

    async def _get_video_metadata(self, video_id: str) -> Dict:
        """Get video metadata using YouTube oEmbed API"""
        try:
            oembed_url = f"https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v={video_id}&format=json"

            loop = asyncio.get_event_loop()
            response = await loop.run_in_executor(None, requests.get, oembed_url)
            response.raise_for_status()

            return response.json()
        except Exception as e:
            return {
                "title": "Unknown Title",
                "author_name": "Unknown Channel",
                "thumbnail_url": f"https://img.youtube.com/vi/{video_id}/maxresdefault.jpg"
            }

    async def _get_transcript(self, video_id: str) -> Dict:
        """Get video transcript with timestamps"""
        try:
            # Create API instance and use fetch method
            def get_transcript_sync():
                api = YouTubeTranscriptApi()
                return api.fetch(video_id)

            loop = asyncio.get_event_loop()
            transcript_list = await loop.run_in_executor(None, get_transcript_sync)

            # Format transcript
            full_text = ""
            formatted_transcript = []

            for entry in transcript_list:
                # Access attributes directly from FetchedTranscriptSnippet object
                timestamp = self._format_timestamp(entry.start)
                text = entry.text.strip()

                full_text += f"{text} "
                formatted_transcript.append({
                    "timestamp": timestamp,
                    "text": text,
                    "start_seconds": entry.start
                })

            return {
                "text": full_text.strip(),
                "with_timestamps": formatted_transcript
            }

        except Exception as e:
            raise Exception(f"Failed to fetch transcript: {str(e)}. The video might not have captions available.")

    def _format_timestamp(self, seconds: float) -> str:
        """Convert seconds to MM:SS or HH:MM:SS format"""
        hours = int(seconds // 3600)
        minutes = int((seconds % 3600) // 60)
        secs = int(seconds % 60)

        if hours > 0:
            return f"{hours:02d}:{minutes:02d}:{secs:02d}"
        else:
            return f"{minutes:02d}:{secs:02d}"