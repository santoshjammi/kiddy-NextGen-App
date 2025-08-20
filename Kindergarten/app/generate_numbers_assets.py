#!/usr/bin/env python3
"""
Generate Numbers 1-100 Learning Assets
Creates AI-generated images and audio files for numbers 1-100 using Google Gemini 2.0 Flash
"""

import os
import sys
from pathlib import Path
from PIL import Image
from google import genai
from google.genai import types
from io import BytesIO
import time
from gtts import gTTS
from dotenv import load_dotenv

# Load environment variables
load_dotenv('./.env')

# Initialize Gemini
api_key = os.environ.get('GEMINI_API_KEY')
if not api_key:
    print("Error: Please set GEMINI_API_KEY in your .env file")
    sys.exit(1)

client = genai.Client(api_key=api_key)

def generateNumberImage(number, description, output_dir):
    """Generate an AI image for a specific number using Gemini 2.0 Flash experimental"""
    try:
        # Create educational prompt for the number
        prompt = f"""Create a vibrant, educational illustration for the number {number} ({description}). 
        The image should be:
        - Child-friendly and colorful
        - Show the number {number} prominently 
        - Include {number} objects (like {number} apples, {number} stars, etc.)
        - Educational and engaging for kindergarten children
        - Clear, simple, and high contrast
        - Cartoon-style illustration
        - White or light background
        - No text except the number {number}
        
        Style: Bright, cheerful cartoon illustration perfect for children's learning."""

        filename = output_dir / f"{number}.webp"
        
        print(f"Generating image for number {number}...")
        
        if not os.path.exists(filename):
            response = client.models.generate_content(
                model="gemini-2.0-flash-exp-image-generation",
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_modalities=['Text', 'Image']
                )
            )

            try:
                for part in response.candidates[0].content.parts:
                    if part.text is not None:
                        print(part.text)
                    elif part.inline_data is not None:
                        image = Image.open(BytesIO(part.inline_data.data))
                        
                        # Convert to RGB if necessary (WebP doesn't support RGBA with certain settings)
                        if image.mode in ('RGBA', 'LA', 'P'):
                            # Create a white background for transparent images
                            background = Image.new('RGB', image.size, (255, 255, 255))
                            if image.mode == 'P':
                                image = image.convert('RGBA')
                            background.paste(image, mask=image.split()[-1] if image.mode in ('RGBA', 'LA') else None)
                            image = background
                        elif image.mode != 'RGB':
                            image = image.convert('RGB')
                        
                        # Save as WebP with high quality and optimization
                        image.save(filename, 
                                  'WEBP', 
                                  quality=85,  # High quality but still compressed
                                  optimize=True,  # Enable optimization
                                  method=6)  # Best compression method (0-6, 6 is slowest but best compression)
                        print(f"✅ Saved WebP image: {filename} (optimized for web)")
                        return True
            except Exception as e:
                print(f'❌ Error in generating the Image for {number}: {e}')
                return False
        else:
            print(f"Image {filename} already exists, skipping generation.")
            return True
            
    except Exception as e:
        print(f"❌ Error generating image for number {number}: {e}")
        return False

def generateNumberAudio(number, description, output_dir):
    """Generate audio pronunciation for the number"""
    try:
        print(f"🎵 Generating audio for number {number} ({description})...")
        
        # Create text for audio
        text = f"{description}. {number}."
        
        # Generate audio using gTTS
        tts = gTTS(text=text, lang='en', slow=False)
        
        # Save audio file
        audio_path = output_dir / f"{number}.mp3"
        tts.save(str(audio_path))
        
        print(f"✅ Generated audio: {audio_path}")
        return True
        
    except Exception as e:
        print(f"❌ Error generating audio for {number}: {e}")
        return False

def getNumberDescription(number):
    """Get word description for number"""
    number_words = {
        1: 'One', 2: 'Two', 3: 'Three', 4: 'Four', 5: 'Five',
        6: 'Six', 7: 'Seven', 8: 'Eight', 9: 'Nine', 10: 'Ten',
        11: 'Eleven', 12: 'Twelve', 13: 'Thirteen', 14: 'Fourteen', 15: 'Fifteen',
        16: 'Sixteen', 17: 'Seventeen', 18: 'Eighteen', 19: 'Nineteen', 20: 'Twenty',
        21: 'Twenty-One', 22: 'Twenty-Two', 23: 'Twenty-Three', 24: 'Twenty-Four', 25: 'Twenty-Five',
        26: 'Twenty-Six', 27: 'Twenty-Seven', 28: 'Twenty-Eight', 29: 'Twenty-Nine', 30: 'Thirty',
        31: 'Thirty-One', 32: 'Thirty-Two', 33: 'Thirty-Three', 34: 'Thirty-Four', 35: 'Thirty-Five',
        36: 'Thirty-Six', 37: 'Thirty-Seven', 38: 'Thirty-Eight', 39: 'Thirty-Nine', 40: 'Forty',
        41: 'Forty-One', 42: 'Forty-Two', 43: 'Forty-Three', 44: 'Forty-Four', 45: 'Forty-Five',
        46: 'Forty-Six', 47: 'Forty-Seven', 48: 'Forty-Eight', 49: 'Forty-Nine', 50: 'Fifty',
        51: 'Fifty-One', 52: 'Fifty-Two', 53: 'Fifty-Three', 54: 'Fifty-Four', 55: 'Fifty-Five',
        56: 'Fifty-Six', 57: 'Fifty-Seven', 58: 'Fifty-Eight', 59: 'Fifty-Nine', 60: 'Sixty',
        61: 'Sixty-One', 62: 'Sixty-Two', 63: 'Sixty-Three', 64: 'Sixty-Four', 65: 'Sixty-Five',
        66: 'Sixty-Six', 67: 'Sixty-Seven', 68: 'Sixty-Eight', 69: 'Sixty-Nine', 70: 'Seventy',
        71: 'Seventy-One', 72: 'Seventy-Two', 73: 'Seventy-Three', 74: 'Seventy-Four', 75: 'Seventy-Five',
        76: 'Seventy-Six', 77: 'Seventy-Seven', 78: 'Seventy-Eight', 79: 'Seventy-Nine', 80: 'Eighty',
        81: 'Eighty-One', 82: 'Eighty-Two', 83: 'Eighty-Three', 84: 'Eighty-Four', 85: 'Eighty-Five',
        86: 'Eighty-Six', 87: 'Eighty-Seven', 88: 'Eighty-Eight', 89: 'Eighty-Nine', 90: 'Ninety',
        91: 'Ninety-One', 92: 'Ninety-Two', 93: 'Ninety-Three', 94: 'Ninety-Four', 95: 'Ninety-Five',
        96: 'Ninety-Six', 97: 'Ninety-Seven', 98: 'Ninety-Eight', 99: 'Ninety-Nine', 100: 'One Hundred'
    }
    return number_words.get(number, str(number))

def main():
    """Generate all number assets (1-100)"""
    print("🚀 Starting Numbers 1-100 Asset Generation...")
    print("=" * 50)
    
    # Create output directory
    output_dir = Path("numbers_assets")
    output_dir.mkdir(exist_ok=True)
    
    # Track progress
    successful_images = 0
    successful_audio = 0
    total_numbers = 100
    
    # Generate assets for each number
    for number in range(1, 101):
        description = getNumberDescription(number)
        
        print(f"\n📚 Processing Number {number}/100: {description}")
        print("-" * 40)
        
        # Generate image
        if generateNumberImage(number, description, output_dir):
            successful_images += 1
        
        # Generate audio
        if generateNumberAudio(number, description, output_dir):
            successful_audio += 1
        
        # Small delay to be respectful to APIs
        time.sleep(0.5)
        
        # Progress update every 10 numbers
        if number % 10 == 0:
            print(f"\n🎯 Progress Update: {number}/100 numbers processed")
            print(f"✅ Images: {successful_images}/{number}")
            print(f"🎵 Audio: {successful_audio}/{number}")
    
    # Final summary
    print("\n" + "=" * 50)
    print("🎉 GENERATION COMPLETE!")
    print("=" * 50)
    print(f"📊 Final Results:")
    print(f"   • Total Numbers: {total_numbers}")
    print(f"   • Successful Images: {successful_images}/{total_numbers}")
    print(f"   • Successful Audio: {successful_audio}/{total_numbers}")
    print(f"   • Success Rate: {((successful_images + successful_audio) / (total_numbers * 2)) * 100:.1f}%")
    print(f"📁 Assets saved in: {output_dir.absolute()}")
    
    # List generated files
    webp_files = list(output_dir.glob("*.webp"))
    mp3_files = list(output_dir.glob("*.mp3"))
    
    print(f"\n📋 Generated Files:")
    print(f"   • WebP Images: {len(webp_files)} files")
    print(f"   • MP3 Audio: {len(mp3_files)} files")
    print(f"   • Total File Size: {sum(f.stat().st_size for f in output_dir.iterdir()) / 1024 / 1024:.1f} MB")

if __name__ == "__main__":
    main()
