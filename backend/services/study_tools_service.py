import asyncio
import google.generativeai as genai
import os
from typing import List, Dict
import json
from dotenv import load_dotenv

load_dotenv()

class StudyToolsService:
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

    async def generate_flashcards(self, transcript: str, video_title: str, num_cards: int = 10) -> List[Dict[str, str]]:
        """Generate flashcards from video transcript"""
        if not self._is_configured():
            raise Exception("Gemini API key not configured for study tools.")

        prompt = self._create_flashcard_prompt(transcript, video_title, num_cards)

        try:
            loop = asyncio.get_event_loop()
            response = await loop.run_in_executor(
                None,
                self.model.generate_content,
                prompt
            )

            flashcards = self._parse_flashcard_response(response.text)
            return flashcards

        except Exception as e:
            print(f"Error generating flashcards: {e}")
            return self._fallback_flashcards(transcript)

    async def generate_quiz(self, transcript: str, video_title: str, num_questions: int = 5) -> Dict[str, any]:
        """Generate multiple choice quiz from video transcript"""
        if not self._is_configured():
            raise Exception("Gemini API key not configured for study tools.")

        prompt = self._create_quiz_prompt(transcript, video_title, num_questions)

        try:
            loop = asyncio.get_event_loop()
            response = await loop.run_in_executor(
                None,
                self.model.generate_content,
                prompt
            )

            quiz = self._parse_quiz_response(response.text)
            return quiz

        except Exception as e:
            print(f"Error generating quiz: {e}")
            return self._fallback_quiz(transcript)

    def _create_flashcard_prompt(self, transcript: str, video_title: str, num_cards: int) -> str:
        """Create prompt for generating flashcards"""
        return f"""
Create {num_cards} educational flashcards from this video transcript: "{video_title}"

Transcript (first 3000 characters):
{transcript[:3000]}

Requirements:
- Create question/answer pairs that test key concepts
- Questions should be clear and specific
- Answers should be concise but complete
- Focus on the most important information
- Include definitions, facts, processes, and key insights

Format your response as JSON:
{{
  "flashcards": [
    {{
      "question": "What is...",
      "answer": "The answer is...",
      "category": "Definition/Concept/Process/Fact"
    }}
  ]
}}

Generate exactly {num_cards} flashcards:
"""

    def _create_quiz_prompt(self, transcript: str, video_title: str, num_questions: int) -> str:
        """Create prompt for generating quiz questions"""
        return f"""
Create {num_questions} multiple choice quiz questions from this video transcript: "{video_title}"

Transcript (first 3000 characters):
{transcript[:3000]}

Requirements:
- Create challenging but fair questions
- Each question should have 4 options (A, B, C, D)
- Only one correct answer per question
- Include a mix of factual, conceptual, and application questions
- Provide explanations for correct answers

Format your response as JSON:
{{
  "quiz": {{
    "title": "{video_title} - Quiz",
    "questions": [
      {{
        "question": "What is...",
        "options": {{
          "A": "Option A",
          "B": "Option B",
          "C": "Option C",
          "D": "Option D"
        }},
        "correct_answer": "A",
        "explanation": "The correct answer is A because..."
      }}
    ]
  }}
}}

Generate exactly {num_questions} questions:
"""

    def _parse_flashcard_response(self, response_text: str) -> List[Dict[str, str]]:
        """Parse flashcard response from Gemini"""
        try:
            # Try to extract JSON from response
            start_idx = response_text.find('{')
            end_idx = response_text.rfind('}') + 1

            if start_idx != -1 and end_idx != -1:
                json_str = response_text[start_idx:end_idx]
                data = json.loads(json_str)
                return data.get('flashcards', [])
        except:
            pass

        # Fallback parsing
        return self._fallback_flashcard_parsing(response_text)

    def _parse_quiz_response(self, response_text: str) -> Dict[str, any]:
        """Parse quiz response from Gemini"""
        try:
            # Try to extract JSON from response
            start_idx = response_text.find('{')
            end_idx = response_text.rfind('}') + 1

            if start_idx != -1 and end_idx != -1:
                json_str = response_text[start_idx:end_idx]
                data = json.loads(json_str)
                return data.get('quiz', {})
        except:
            pass

        # Fallback parsing
        return self._fallback_quiz_parsing(response_text)

    def _fallback_flashcard_parsing(self, response_text: str) -> List[Dict[str, str]]:
        """Fallback method to parse flashcards from unstructured text"""
        flashcards = []
        lines = response_text.split('\n')

        current_question = None
        current_answer = None

        for line in lines:
            line = line.strip()
            if not line:
                continue

            if line.lower().startswith(('q:', 'question:', 'q.', 'question')):
                if current_question and current_answer:
                    flashcards.append({
                        "question": current_question,
                        "answer": current_answer,
                        "category": "General"
                    })
                current_question = line.split(':', 1)[1].strip() if ':' in line else line
                current_answer = None
            elif line.lower().startswith(('a:', 'answer:', 'a.', 'answer')):
                current_answer = line.split(':', 1)[1].strip() if ':' in line else line

        # Add the last flashcard
        if current_question and current_answer:
            flashcards.append({
                "question": current_question,
                "answer": current_answer,
                "category": "General"
            })

        return flashcards[:10]  # Limit to 10 cards

    def _fallback_quiz_parsing(self, response_text: str) -> Dict[str, any]:
        """Fallback method to parse quiz from unstructured text"""
        return {
            "title": "Generated Quiz",
            "questions": [{
                "question": "What was the main topic of this video?",
                "options": {
                    "A": "Technology",
                    "B": "Science",
                    "C": "Education",
                    "D": "Entertainment"
                },
                "correct_answer": "C",
                "explanation": "Based on the content, this appears to be educational material."
            }]
        }

    def _fallback_flashcards(self, transcript: str) -> List[Dict[str, str]]:
        """Generate simple flashcards when AI fails"""
        words = transcript.split()
        return [{
            "question": "What is the main topic of this video?",
            "answer": f"The video discusses {' '.join(words[:20])}...",
            "category": "General"
        }]

    def _fallback_quiz(self, transcript: str) -> Dict[str, any]:
        """Generate simple quiz when AI fails"""
        return {
            "title": "Basic Quiz",
            "questions": [{
                "question": "What type of content was in this video?",
                "options": {
                    "A": "Educational",
                    "B": "Entertainment",
                    "C": "News",
                    "D": "Music"
                },
                "correct_answer": "A",
                "explanation": "This appears to be educational content based on the transcript."
            }]
        }