from PIL import Image, ImageDraw, ImageFont
from gtts import gTTS
import os

alphabet_words = {
    'A': 'Apple', 'B': 'Ball', 'C': 'Cat', 'D': 'Dog', 'E': 'Elephant',
    'F': 'Fish', 'G': 'Grapes', 'H': 'Hat', 'I': 'Ice Cream', 'J': 'Juice',
    'K': 'Kite', 'L': 'Lion', 'M': 'Monkey', 'N': 'Nest', 'O': 'Orange',
    'P': 'Penguin', 'Q': 'Queen', 'R': 'Rabbit', 'S': 'Sun', 'T': 'Tiger',
    'U': 'Umbrella', 'V': 'Violin', 'W': 'Whale', 'X': 'Xylophone',
    'Y': 'Yacht', 'Z': 'Zebra'
}

os.makedirs('assets', exist_ok=True)

# Generate images
for letter, word in alphabet_words.items():
    img = Image.new('RGB', (200, 200), color=(255, 255, 255))
    d = ImageDraw.Draw(img)
    try:
        font = ImageFont.truetype("arial.ttf", 48)
    except:
        font = ImageFont.load_default()
    d.text((50, 60), f"{letter}\n{word}", fill=(0, 0, 0), font=font)
    img.save(f"assets/{word.lower().replace(' ', '')}.png")

# Generate audio
for letter, word in alphabet_words.items():
    tts = gTTS(text=word, lang='en')
    tts.save(f"assets/{word.lower().replace(' ', '')}.mp3")
