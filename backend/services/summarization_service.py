import asyncio
import google.generativeai as genai
import os
from typing import List, Dict
import re
from dotenv import load_dotenv

load_dotenv()

class SummarizationService:
    def __init__(self):
        self.api_key = os.getenv('GEMINI_API_KEY')
        if self.api_key:
            genai.configure(api_key=self.api_key)
            self.model = genai.GenerativeModel('gemini-1.5-flash')
        else:
            self.model = None

    def _is_configured(self):
        """Check if Gemini API is properly configured"""
        return self.model is not None

    async def summarize(self, text: str, transcript_with_timestamps: List[Dict] = None) -> List[Dict[str, str]]:
        """Summarize text into bullet points using Gemini"""
        if not self._is_configured():
            raise Exception("Gemini API key not configured. Please set GEMINI_API_KEY environment variable.")

        # Clean and prepare text
        cleaned_text = self._clean_text(text)

        # Create prompt for Gemini
        prompt = self._create_summarization_prompt(cleaned_text)

        try:
            # Generate summary using Gemini
            loop = asyncio.get_event_loop()
            response = await loop.run_in_executor(
                None,
                self.model.generate_content,
                prompt
            )

            # Parse the response into bullet points
            bullet_points = self._parse_gemini_response(response.text)

            # Add timestamps if available
            if transcript_with_timestamps:
                bullet_points = self._add_timestamps_to_summary(bullet_points, transcript_with_timestamps)

            return bullet_points

        except Exception as e:
            print(f"Error with Gemini API: {e}")
            # Fallback to simple extractive summary
            return self._fallback_summary(cleaned_text)

    def _create_summarization_prompt(self, text: str) -> str:
        """Create a prompt for Gemini to summarize the video transcript"""
        return f"""
You are a professional content summarizer. Analyze this YouTube video transcript and create a concise summary.

IMPORTANT: This appears to be a music video transcript with song lyrics. For music videos:
- Identify the song title, artist, and genre
- Describe the main themes or message of the song
- Note any visual elements mentioned
- Summarize the overall mood or style

For other content:
- Extract 5-8 key points that capture the main ideas
- Focus on actionable insights, important concepts, or main arguments
- Organize by topic if the content has distinct sections

Transcript:
{text[:3000]}

Provide your response as bullet points using this format:
• Point 1
• Point 2
• Point 3
etc.

Keep each point concise (1-2 sentences max).
"""

    def _parse_gemini_response(self, response_text: str) -> List[Dict[str, str]]:
        """Parse Gemini's response into structured bullet points"""
        bullet_points = []
        lines = response_text.strip().split('\n')

        current_section = "Summary"

        for line in lines:
            line = line.strip()
            if not line:
                continue

            # Check if it's a bullet point (various formats)
            if (line.startswith('•') or line.startswith('-') or line.startswith('*') or
                line.startswith('→') or line.startswith('▪') or line.startswith('◦')):
                # Clean the bullet point
                point = line[1:].strip()
                if point and len(point) > 15:  # Filter out very short points
                    bullet_points.append({
                        "point": point,
                        "section": current_section
                    })
            elif any(line.startswith(f"{i}.") for i in range(1, 20)):
                # Handle numbered lists (1. 2. 3. etc.)
                point = line.split('.', 1)[1].strip() if '.' in line else line
                if point and len(point) > 15:
                    bullet_points.append({
                        "point": point,
                        "section": current_section
                    })

        # If no bullet points found, try to extract meaningful sentences
        if not bullet_points:
            # Split by sentences and filter for meaningful content
            sentences = response_text.replace('\n', ' ').split('.')
            for sentence in sentences:
                sentence = sentence.strip()
                # Look for sentences that seem like summary points
                if (sentence and len(sentence) > 30 and len(sentence) < 200 and
                    not sentence.lower().startswith(('the transcript', 'this video', 'the video'))):
                    bullet_points.append({
                        "point": sentence + ".",
                        "section": current_section
                    })
                    if len(bullet_points) >= 8:
                        break

        # If still no points, create a fallback summary
        if not bullet_points:
            bullet_points = [{
                "point": "This appears to be a music video or content that couldn't be automatically summarized. Please check the original video for details.",
                "section": current_section
            }]

        return bullet_points[:8]  # Limit to 8 points

    def _fallback_summary(self, text: str) -> List[Dict[str, str]]:
        """Fallback summary when Gemini API fails"""
        sentences = text.split('.')
        bullet_points = []

        # Take every 10th sentence or so to create a summary
        step = max(1, len(sentences) // 8)
        for i in range(0, min(len(sentences), 40), step):
            sentence = sentences[i].strip()
            if sentence and len(sentence) > 20:
                bullet_points.append({
                    "point": sentence,
                    "section": "Summary"
                })
                if len(bullet_points) >= 8:
                    break

        return bullet_points

    def _clean_text(self, text: str) -> str:
        """Clean and preprocess text"""
        # Remove extra whitespace and newlines
        text = re.sub(r'\s+', ' ', text)

        # Remove common transcript artifacts
        text = re.sub(r'\[.*?\]', '', text)  # Remove [Music], [Applause], etc.
        text = re.sub(r'\(.*?\)', '', text)  # Remove parenthetical content

        # Remove repeated phrases (common in auto-generated captions)
        words = text.split()
        cleaned_words = []
        prev_word = ""

        for word in words:
            if word.lower() != prev_word.lower():
                cleaned_words.append(word)
            prev_word = word

        return ' '.join(cleaned_words).strip()

    def _add_timestamps_to_summary(self, bullet_points: List[Dict[str, str]], transcript_with_timestamps: List[Dict]) -> List[Dict[str, str]]:
        """Add relevant timestamps to summary points"""
        enhanced_points = []

        for point in bullet_points:
            # Try to find relevant timestamp by matching keywords
            point_words = set(point['point'].lower().split())
            best_timestamp = None
            best_score = 0

            for transcript_entry in transcript_with_timestamps:
                transcript_words = set(transcript_entry['text'].lower().split())
                # Calculate word overlap
                overlap = len(point_words.intersection(transcript_words))
                if overlap > best_score:
                    best_score = overlap
                    best_timestamp = transcript_entry['start_seconds']

            enhanced_point = point.copy()
            if best_timestamp is not None:
                enhanced_point['timestamp'] = best_timestamp
                enhanced_point['timestamp_formatted'] = self._format_timestamp(best_timestamp)
                enhanced_point['youtube_url'] = f"https://www.youtube.com/watch?v={transcript_with_timestamps[0].get('video_id', '')}&t={int(best_timestamp)}s"

            enhanced_points.append(enhanced_point)

        return enhanced_points

    def _format_timestamp(self, seconds: float) -> str:
        """Convert seconds to MM:SS or HH:MM:SS format"""
        hours = int(seconds // 3600)
        minutes = int((seconds % 3600) // 60)
        secs = int(seconds % 60)

        if hours > 0:
            return f"{hours:02d}:{minutes:02d}:{secs:02d}"
        else:
            return f"{minutes:02d}:{secs:02d}"