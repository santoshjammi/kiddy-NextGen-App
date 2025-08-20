#!/usr/bin/env python3
"""
Alphabet Asset Generator using Gemini 2.0 Flash Image Generation
Integrates the generateImage.py functionality with the kindergarten app's alphabet data.
"""

import os
import sys
from generateImage import generateImage, convert_to_webp
from gtts import gTTS
from dotenv import load_dotenv

# Load environment variables
load_dotenv('./.env')

# Alphabet words mapping (consistent with app.js)
alphabet_words = {
    'A': 'Apple', 'B': 'Ball', 'C': 'Cat', 'D': 'Dog', 'E': 'Elephant',
    'F': 'Fish', 'G': 'Grapes', 'H': 'Hat', 'I': 'Ice Cream', 'J': 'Juice',
    'K': 'Kite', 'L': 'Lion', 'M': 'Monkey', 'N': 'Nest', 'O': 'Orange',
    'P': 'Penguin', 'Q': 'Queen', 'R': 'Rabbit', 'S': 'Sun', 'T': 'Tiger',
    'U': 'Umbrella', 'V': 'Violin', 'W': 'Whale', 'X': 'Xylophone',
    'Y': 'Yacht', 'Z': 'Zebra'
}

def create_assets_directory():
    """Create assets directory if it doesn't exist"""
    assets_dir = './assets'
    if not os.path.exists(assets_dir):
        os.makedirs(assets_dir)
        print(f"Created directory: {assets_dir}")
    return assets_dir

def generate_image_prompt(word, letter):
    """
    Create an optimized prompt for Gemini image generation
    Tailored for kindergarten children with colorful, educational imagery
    """
    prompts = {
        'Apple': 'A bright red apple with green leaves, cartoon style, colorful and cheerful for children',
        'Ball': 'A colorful bouncy ball with rainbow stripes, bright and playful for kids',
        'Cat': 'A cute fluffy cat with big eyes, friendly cartoon style, orange tabby with white patches',
        'Dog': 'A happy golden retriever puppy with a wagging tail, friendly cartoon style for children',
        'Elephant': 'A gentle gray elephant with big ears and a long trunk, cartoon style, friendly for kids',
        'Fish': 'A colorful tropical fish with bright scales, swimming happily, cartoon style for children',
        'Grapes': 'A bunch of purple grapes hanging from a vine with green leaves, bright and colorful',
        'Hat': 'A bright red baseball cap or cowboy hat, colorful and fun for children',
        'Ice Cream': 'A colorful ice cream cone with strawberry and vanilla scoops, cheerful cartoon style',
        'Juice': 'A glass of orange juice with orange slices, bright and refreshing cartoon style',
        'Kite': 'A colorful diamond-shaped kite with ribbons flying in blue sky, bright and cheerful',
        'Lion': 'A friendly cartoon lion with a golden mane, smiling and gentle for children',
        'Monkey': 'A playful brown monkey swinging from branches, cartoon style with a big smile',
        'Nest': 'A bird nest made of twigs with small blue eggs inside, cozy and natural',
        'Orange': 'A bright orange fruit with green leaves, fresh and colorful cartoon style',
        'Penguin': 'A cute black and white penguin with a cheerful expression, cartoon style for kids',
        'Queen': 'A kind queen with a golden crown and colorful dress, friendly cartoon style',
        'Rabbit': 'A fluffy white rabbit with long ears and pink nose, cute cartoon style for children',
        'Sun': 'A bright yellow smiling sun with rays, cheerful and warm cartoon style for kids',
        'Tiger': 'A friendly orange tiger with black stripes, gentle cartoon style for children',
        'Umbrella': 'A colorful striped umbrella, bright red and yellow, cheerful cartoon style',
        'Violin': 'A brown wooden violin with strings, elegant and musical for children',
        'Whale': 'A gentle blue whale swimming in the ocean, friendly cartoon style for kids',
        'Xylophone': 'A colorful xylophone with rainbow keys and mallets, musical and bright',
        'Yacht': 'A white sailboat with colorful sails on blue water, cheerful nautical theme',
        'Zebra': 'A friendly zebra with black and white stripes, smiling cartoon style for children'
    }
    
    return prompts.get(word, f'A colorful cartoon {word.lower()} that is friendly and appealing to young children')

def generate_audio_asset(word, output_path):
    """Generate audio file using gTTS"""
    try:
        if os.path.exists(output_path):
            print(f"Audio already exists: {output_path}")
            return output_path
            
        print(f"Generating audio for: {word}")
        tts = gTTS(text=word, lang='en', slow=False)
        tts.save(output_path)
        print(f"✅ Audio saved: {output_path}")
        return output_path
    except Exception as e:
        print(f"❌ Error generating audio for {word}: {e}")
        return None

def generate_all_assets(letters_to_generate=None):
    """
    Generate all alphabet assets (images and audio)
    
    Args:
        letters_to_generate (list): Specific letters to generate, or None for all
    """
    assets_dir = create_assets_directory()
    
    # Filter letters if specified
    if letters_to_generate:
        items_to_process = {k: v for k, v in alphabet_words.items() if k in letters_to_generate}
    else:
        items_to_process = alphabet_words
    
    print(f"Generating assets for {len(items_to_process)} words...")
    print("=" * 50)
    
    success_count = 0
    total_count = len(items_to_process)
    
    for letter, word in items_to_process.items():
        print(f"\n🔤 Processing {letter}: {word}")
        
        # Generate file paths
        word_filename = word.lower().replace(' ', '')
        image_path = os.path.join(assets_dir, f"{word_filename}.webp")
        audio_path = os.path.join(assets_dir, f"{word_filename}.mp3")
        
        try:
            # Generate image using Gemini
            prompt = generate_image_prompt(word, letter)
            print(f"   📸 Generating image with prompt: {prompt[:60]}...")
            
            generated_image = generateImage(prompt, image_path)
            if generated_image:
                print(f"   ✅ Image generated: {image_path}")
            else:
                print(f"   ❌ Failed to generate image for {word}")
                continue
            
            # Generate audio
            audio_result = generate_audio_asset(word, audio_path)
            if audio_result:
                success_count += 1
                print(f"   ✅ Complete: {word} ({success_count}/{total_count})")
            else:
                print(f"   ⚠️  Image generated but audio failed for {word}")
                
        except Exception as e:
            print(f"   ❌ Error processing {word}: {e}")
    
    print("\n" + "=" * 50)
    print(f"🎉 Generation complete!")
    print(f"✅ Successfully generated: {success_count}/{total_count} complete sets")
    print(f"📁 Assets saved in: {os.path.abspath(assets_dir)}")
    
    # Update app.js to use WebP images
    update_app_js_for_webp()

def update_app_js_for_webp():
    """Update app.js to use .webp images instead of .png"""
    app_js_path = './app.js'
    
    if not os.path.exists(app_js_path):
        print("⚠️  app.js not found - skipping update")
        return
        
    try:
        with open(app_js_path, 'r') as f:
            content = f.read()
        
        # Replace .png with .webp in asset paths
        updated_content = content.replace('.png', '.webp')
        
        with open(app_js_path, 'w') as f:
            f.write(updated_content)
            
        print("✅ Updated app.js to use WebP images")
    except Exception as e:
        print(f"❌ Error updating app.js: {e}")

def main():
    """Main function with command line argument support"""
    if len(sys.argv) > 1:
        # Generate specific letters if provided
        letters = [letter.upper() for letter in sys.argv[1:] if letter.upper() in alphabet_words]
        if letters:
            print(f"Generating assets for specific letters: {', '.join(letters)}")
            generate_all_assets(letters)
        else:
            print("Invalid letters provided. Available letters: A-Z")
            print("Usage: python generate_alphabet_assets.py [A B C ...]")
    else:
        # Generate all assets
        print("Generating all alphabet assets...")
        generate_all_assets()

if __name__ == "__main__":
    main()
