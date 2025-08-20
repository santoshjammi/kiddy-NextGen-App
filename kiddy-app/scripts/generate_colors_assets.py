#!/usr/bin/env python3
"""
Generate Color Learning Assets
Creates AI-generated images and audio files for 12 basic colors using Google Gemini 2.0 Flash
"""

from google import genai
from google.genai import types
from PIL import Image
from io import BytesIO
from gtts import gTTS
from pathlib import Path
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv('./.env')

# Initialize Gemini
api_key = os.environ.get('GEMINI_API_KEY')
if not api_key:
    print("Error: Please set GEMINI_API_KEY in your .env file")
    exit(1)

client = genai.Client(api_key=api_key)

# Define colors to generate
COLORS = [
    {"name": "red", "description": "A bright red color like fire trucks and strawberries"},
    {"name": "blue", "description": "A deep blue color like the ocean and sky"},
    {"name": "yellow", "description": "A sunny yellow color like bananas and the sun"},
    {"name": "green", "description": "A fresh green color like grass and leaves"},
    {"name": "orange", "description": "A vibrant orange color like oranges and pumpkins"},
    {"name": "purple", "description": "A rich purple color like grapes and violets"},
    {"name": "pink", "description": "A soft pink color like flamingos and cherry blossoms"},
    {"name": "brown", "description": "A warm brown color like chocolate and tree bark"},
    {"name": "black", "description": "A dark black color like night and coal"},
    {"name": "white", "description": "A pure white color like snow and clouds"},
    {"name": "gray", "description": "A neutral gray color like elephants and rocks"},
    {"name": "turquoise", "description": "A blue-green color like tropical water and peacock feathers"}
]

def generateColorImage(color_name, description, output_dir):
    """Generate an AI image for a specific color using Gemini 2.0 Flash experimental"""
    try:
        # Create educational prompt for the color
        prompt = f"""Create a vibrant, educational illustration showing the color {color_name} for kindergarten children. 
        The image should be:
        - Child-friendly and engaging
        - Show multiple real-world objects that are {color_name} in color
        - Include 3-4 common items that children recognize (like fruits, animals, toys, nature items)
        - Clean, bright illustration with high contrast
        - White or light background
        - The word "{color_name}" written in large, clear text at the bottom
        - Cartoon-style illustration perfect for 3-6 year olds
        - Make sure all objects are clearly {color_name} colored
        
        Description: {description}
        Style: Bright, cheerful cartoon illustration perfect for children's color learning."""

        filename = output_dir / f"{color_name}.webp"
        
        print(f"Generating image for {color_name}...")
        
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
                        
                        # Convert to RGB if necessary
                        if image.mode in ('RGBA', 'LA', 'P'):
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
                                  quality=85,
                                  optimize=True,
                                  method=6)
                        print(f"✅ Saved WebP image: {filename}")
                        return True
            except Exception as e:
                print(f'❌ Error in generating the Image for {color_name}: {e}')
                return False
        else:
            print(f"Image {filename} already exists, skipping generation.")
            return True
            
    except Exception as e:
        print(f"❌ Error generating image for {color_name}: {e}")
        return False

def generateColorAudio(color_name, description, output_dir):
    """Generate audio pronunciation for a color"""
    try:
        # Create spoken text
        spoken_text = f"{color_name}. {description}"
        
        filename = output_dir / f"{color_name}.mp3"
        
        if not filename.exists():
            print(f"🎵 Generating audio for {color_name}...")
            
            # Generate speech
            tts = gTTS(text=spoken_text, lang='en', slow=False)
            tts.save(str(filename))
            
            print(f"✅ Generated audio: {filename}")
            return True
        else:
            print(f"Audio {filename} already exists, skipping generation.")
            return True
            
    except Exception as e:
        print(f"❌ Error generating audio for {color_name}: {e}")
        return False

def main():
    # Create output directory
    output_dir = Path("colors_assets")
    output_dir.mkdir(exist_ok=True)
    
    print("🎨 Starting Color Assets Generation")
    print("=" * 50)
    
    successful_images = 0
    successful_audio = 0
    
    for i, color in enumerate(COLORS, 1):
        color_name = color["name"]
        description = color["description"]
        
        print(f"\n🌈 Processing Color {i}/{len(COLORS)}: {color_name.title()}")
        print("-" * 40)
        
        # Generate image
        if generateColorImage(color_name, description, output_dir):
            successful_images += 1
            
        # Generate audio
        if generateColorAudio(color_name, description, output_dir):
            successful_audio += 1
        
        # Progress update every 4 colors
        if i % 4 == 0 or i == len(COLORS):
            print(f"\n🎯 Progress Update: {i}/{len(COLORS)} colors processed")
            print(f"✅ Images: {successful_images}/{i}")
            print(f"🎵 Audio: {successful_audio}/{i}")
    
    # Final summary
    print("\n" + "=" * 50)
    print("🎉 GENERATION COMPLETE!")
    print("=" * 50)
    print(f"📊 Final Results:")
    print(f"   • Total Colors: {len(COLORS)}")
    print(f"   • Successful Images: {successful_images}/{len(COLORS)}")
    print(f"   • Successful Audio: {successful_audio}/{len(COLORS)}")
    print(f"   • Success Rate: {(successful_images + successful_audio) / (len(COLORS) * 2) * 100:.1f}%")
    print(f"📁 Assets saved in: {output_dir.absolute()}")

if __name__ == "__main__":
    main()
