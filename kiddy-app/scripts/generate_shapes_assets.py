#!/usr/bin/env python3
"""
Generate Shape Learning Assets
Creates AI-generated images and audio files for 10 basic shapes using Google Gemini 2.0 Flash
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

# Define shapes to generate
SHAPES = [
    {"name": "circle", "description": "A round shape with no corners"},
    {"name": "square", "description": "A shape with four equal sides and four corners"},
    {"name": "triangle", "description": "A shape with three sides and three corners"},
    {"name": "rectangle", "description": "A shape with four sides and four corners, longer than it is wide"},
    {"name": "oval", "description": "An elongated round shape like an egg"},
    {"name": "diamond", "description": "A shape that looks like a tilted square"},
    {"name": "star", "description": "A shape with five points"},
    {"name": "heart", "description": "A heart shape that shows love"},
    {"name": "hexagon", "description": "A shape with six sides and six corners"},
    {"name": "pentagon", "description": "A shape with five sides and five corners"}
]

def generateShapeImage(shape_name, description, output_dir):
    """Generate an AI image for a specific shape using Gemini 2.0 Flash experimental"""
    try:
        # Create educational prompt for the shape
        prompt = f"""Create a vibrant, educational illustration of a {shape_name} shape for kindergarten children. 
        The image should be:
        - Child-friendly and colorful (bright primary colors like red, blue, yellow, green)
        - Show a large, clear {shape_name} prominently in the center
        - Clean, simple design with high contrast
        - White or light background
        - The {shape_name} should be filled with a solid bright color
        - Add a cheerful smile or friendly face to make it engaging
        - Include the shape name "{shape_name}" in large, clear text below the shape
        - Cartoon-style illustration perfect for 3-6 year olds
        
        Description: {description}
        Style: Bright, cheerful cartoon illustration perfect for children's learning."""

        filename = output_dir / f"{shape_name}.webp"
        
        print(f"Generating image for {shape_name}...")
        
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
                print(f'❌ Error in generating the Image for {shape_name}: {e}')
                return False
        else:
            print(f"Image {filename} already exists, skipping generation.")
            return True
            
    except Exception as e:
        print(f"❌ Error generating image for {shape_name}: {e}")
        return False

def generateShapeAudio(shape_name, description, output_dir):
    """Generate audio pronunciation for a shape"""
    try:
        # Create spoken text
        spoken_text = f"{shape_name}. {description}"
        
        filename = output_dir / f"{shape_name}.mp3"
        
        if not filename.exists():
            print(f"🎵 Generating audio for {shape_name}...")
            
            # Generate speech
            tts = gTTS(text=spoken_text, lang='en', slow=False)
            tts.save(str(filename))
            
            print(f"✅ Generated audio: {filename}")
            return True
        else:
            print(f"Audio {filename} already exists, skipping generation.")
            return True
            
    except Exception as e:
        print(f"❌ Error generating audio for {shape_name}: {e}")
        return False

def main():
    # Create output directory
    output_dir = Path("shapes_assets")
    output_dir.mkdir(exist_ok=True)
    
    print("🔺 Starting Shape Assets Generation")
    print("=" * 50)
    
    successful_images = 0
    successful_audio = 0
    
    for i, shape in enumerate(SHAPES, 1):
        shape_name = shape["name"]
        description = shape["description"]
        
        print(f"\n📚 Processing Shape {i}/{len(SHAPES)}: {shape_name.title()}")
        print("-" * 40)
        
        # Generate image
        if generateShapeImage(shape_name, description, output_dir):
            successful_images += 1
            
        # Generate audio
        if generateShapeAudio(shape_name, description, output_dir):
            successful_audio += 1
        
        # Progress update every 5 shapes
        if i % 5 == 0 or i == len(SHAPES):
            print(f"\n🎯 Progress Update: {i}/{len(SHAPES)} shapes processed")
            print(f"✅ Images: {successful_images}/{i}")
            print(f"🎵 Audio: {successful_audio}/{i}")
    
    # Final summary
    print("\n" + "=" * 50)
    print("🎉 GENERATION COMPLETE!")
    print("=" * 50)
    print(f"📊 Final Results:")
    print(f"   • Total Shapes: {len(SHAPES)}")
    print(f"   • Successful Images: {successful_images}/{len(SHAPES)}")
    print(f"   • Successful Audio: {successful_audio}/{len(SHAPES)}")
    print(f"   • Success Rate: {(successful_images + successful_audio) / (len(SHAPES) * 2) * 100:.1f}%")
    print(f"📁 Assets saved in: {output_dir.absolute()}")

if __name__ == "__main__":
    main()
