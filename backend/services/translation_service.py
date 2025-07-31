import asyncio
import google.generativeai as genai
import os
from typing import List, Dict
from dotenv import load_dotenv

load_dotenv()

class TranslationService:
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

    async def translate_summary(self, summary_points: List[Dict[str, str]], target_language: str) -> List[Dict[str, str]]:
        """Translate summary points to target language"""
        if not self._is_configured():
            raise Exception("Gemini API key not configured for translation.")

        # Prepare text for translation
        text_to_translate = "\n".join([f"• {point['point']}" for point in summary_points])

        # Create translation prompt
        prompt = self._create_translation_prompt(text_to_translate, target_language)

        try:
            # Generate translation using Gemini
            loop = asyncio.get_event_loop()
            response = await loop.run_in_executor(
                None,
                self.model.generate_content,
                prompt
            )

            # Parse the translated response
            translated_points = self._parse_translation_response(response.text, summary_points)

            return translated_points

        except Exception as e:
            print(f"Error with translation: {e}")
            # Return original if translation fails
            return summary_points

    def _create_translation_prompt(self, text: str, target_language: str) -> str:
        """Create a prompt for Gemini to translate the summary"""
        # Special handling for Indian languages
        language_instructions = ""
        if target_language.lower() in ["tamil", "தமிழ்"]:
            language_instructions = "\n- Use proper Tamil script (தமிழ்)\n- Maintain cultural context appropriate for Tamil speakers\n- Use formal Tamil register suitable for educational content"
        elif target_language.lower() in ["telugu", "తెలుగు"]:
            language_instructions = "\n- Use proper Telugu script (తెలుగు)\n- Maintain cultural context appropriate for Telugu speakers\n- Use formal Telugu register suitable for educational content"
        elif target_language.lower() in ["hindi", "हिन्दी"]:
            language_instructions = "\n- Use proper Devanagari script\n- Maintain cultural context appropriate for Hindi speakers"

        return f"""
Please translate the following bullet points to {target_language}.
Maintain the same structure and meaning, but make it natural and fluent in the target language.

Original text:
{text}

Requirements:
- Keep the bullet point format (•)
- Maintain the same number of points
- Preserve the meaning and context
- Use natural, fluent {target_language}
- Don't add explanations, just provide the translation{language_instructions}

Translated text:
"""

    def _parse_translation_response(self, response_text: str, original_points: List[Dict[str, str]]) -> List[Dict[str, str]]:
        """Parse the translated response back into structured format"""
        translated_points = []
        lines = response_text.strip().split('\n')

        point_index = 0
        for line in lines:
            line = line.strip()
            if not line:
                continue

            # Check if it's a bullet point
            if line.startswith('•') or line.startswith('-') or line.startswith('*'):
                translated_text = line[1:].strip()
                if translated_text and point_index < len(original_points):
                    translated_points.append({
                        "point": translated_text,
                        "section": original_points[point_index]["section"],
                        "original_point": original_points[point_index]["point"]
                    })
                    point_index += 1

        # If parsing failed, return original with translation attempt
        if len(translated_points) != len(original_points):
            return original_points

        return translated_points

    def get_supported_languages(self) -> Dict[str, str]:
        """Get list of supported languages"""
        return {
            "en": "English",
            "es": "Spanish",
            "fr": "French",
            "de": "German",
            "it": "Italian",
            "pt": "Portuguese",
            "ru": "Russian",
            "ja": "Japanese",
            "ko": "Korean",
            "zh": "Chinese (Simplified)",
            "ar": "Arabic",
            "hi": "Hindi",
            "ta": "Tamil (தமிழ்)",
            "te": "Telugu (తెలుగు)",
            "tr": "Turkish",
            "pl": "Polish",
            "nl": "Dutch",
            "sv": "Swedish",
            "da": "Danish",
            "no": "Norwegian",
            "fi": "Finnish"
        }