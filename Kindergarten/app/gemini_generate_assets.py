import os
import requests
from dotenv import load_dotenv
from PIL import Image, ImageDraw, ImageFont
from gtts import gTTS
import io
import base64

# Load API key from .env
load_dotenv()
API_KEY = os.getenv('GEMINI_API_KEY')

alphabet_words = {
    'A': 'Apple', 'B': 'Ball', 'C': 'Cat', 'D': 'Dog', 'E': 'Elephant',
    'F': 'Fish', 'G': 'Grapes', 'H': 'Hat', 'I': 'Ice Cream', 'J': 'Juice',
    'K': 'Kite', 'L': 'Lion', 'M': 'Monkey', 'N': 'Nest', 'O': 'Orange',
    'P': 'Penguin', 'Q': 'Queen', 'R': 'Rabbit', 'S': 'Sun', 'T': 'Tiger',
    'U': 'Umbrella', 'V': 'Violin', 'W': 'Whale', 'X': 'Xylophone',
    'Y': 'Yacht', 'Z': 'Zebra'
}

os.makedirs('assets', exist_ok=True)

# Gemini API endpoint for text generation
GEMINI_API_URL = f'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key={API_KEY}'

# Function to get description from Gemini API
def get_description(word):
    prompt = f"Describe what a {word} looks like in simple words for a 5-year-old child. Keep it under 20 words."
    data = {
        "contents": [{
            "parts": [{"text": prompt}]
        }]
    }
    try:
        response = requests.post(GEMINI_API_URL, json=data)
        if response.status_code == 200:
            result = response.json()
            return result['candidates'][0]['content']['parts'][0]['text'].strip()
        else:
            print(f"Description generation failed for {word}: {response.text}")
            return f"A beautiful {word}"
    except Exception as e:
        print(f"Error getting description for {word}: {e}")
        return f"A beautiful {word}"

# Function to generate image using PIL with Gemini description
def generate_image(word, description, out_path):
    try:
        # Create a colorful image with the word and description
        img = Image.new('RGB', (300, 300), color=(255, 255, 255))
        d = ImageDraw.Draw(img)
        
        try:
            # Try to use a system font
            title_font = ImageFont.truetype("/System/Library/Fonts/Arial.ttf", 36)
            desc_font = ImageFont.truetype("/System/Library/Fonts/Arial.ttf", 16)
        except:
            # Fallback to default font
            title_font = ImageFont.load_default()
            desc_font = ImageFont.load_default()
        
        # Draw the word
        d.text((20, 50), word, fill=(0, 100, 200), font=title_font)
        
        # Draw the description (wrap text)
        words = description.split()
        lines = []
        current_line = ""
        for w in words:
            if len(current_line + w) < 35:
                current_line += w + " "
            else:
                lines.append(current_line.strip())
                current_line = w + " "
        lines.append(current_line.strip())
        
        y_pos = 120
        for line in lines[:4]:  # Max 4 lines
            d.text((20, y_pos), line, fill=(50, 50, 50), font=desc_font)
            y_pos += 25
        
        img.save(out_path)
        print(f"Image saved: {out_path}")
    except Exception as e:
        print(f"Error generating image for {word}: {e}")

# Function to generate audio using gTTS
def generate_audio(word, out_path):
    try:
        tts = gTTS(text=word, lang='en', slow=False)
        tts.save(out_path)
        print(f"Audio saved: {out_path}")
    except Exception as e:
        print(f"Error generating audio for {word}: {e}")

if __name__ == "__main__":
    for letter, word in alphabet_words.items():
        img_path = f"assets/{word.lower().replace(' ', '')}.png"
        audio_path = f"assets/{word.lower().replace(' ', '')}.mp3"
        
        print(f"Generating assets for {letter}: {word}...")
        
        # Get description from Gemini
        description = get_description(word)
        print(f"Description: {description}")
        
        # Generate image with description
        generate_image(word, description, img_path)
        
        # Generate audio
        generate_audio(word, audio_path)
        
        print(f"Completed {word}\n")
    
    print("All assets generated successfully!")
