import os
import sys
import glob
from PIL import Image

# Academy + brand assets only — landing page uses CSS UI mocks (see docs/landing-assets-pro.md)
ASSETS_CONFIG = {
    "brand_logo_icon_512": {
        "src_pattern": "brand_logo_icon_512*.png",
        "dest_path": "public/assets/brand/logo-icon-512.png",
        "size": (512, 512),
        "format": "PNG",
        "quality": 85
    },
    "hero_fallback_cricket": {
        "src_pattern": "hero_fallback_cricket*.png",
        "dest_path": "public/assets/academy/hero-fallback-cricket.webp",
        "size": (1600, 900),
        "format": "WEBP",
        "quality": 82
    },
    "academy_og_template": {
        "src_pattern": "academy_og_template*.png",
        "dest_path": "public/assets/og/academy-og-template.jpg",
        "size": (1200, 630),
        "format": "JPEG",
        "quality": 90
    },
    "hero_fallback_football": {
        "src_pattern": "hero_fallback_football*.png",
        "dest_path": "public/assets/academy/hero-fallback-football.webp",
        "size": (1600, 900),
        "format": "WEBP",
        "quality": 82
    }
}

def crop_and_resize(img, target_size):
    target_w, target_h = target_size
    target_aspect = target_w / target_h
    img_w, img_h = img.size
    img_aspect = img_w / img_h
    
    if img_aspect > target_aspect:
        # Source is wider: crop sides
        new_w = int(img_h * target_aspect)
        left = (img_w - new_w) // 2
        img = img.crop((left, 0, left + new_w, img_h))
    elif img_aspect < target_aspect:
        # Source is taller: crop top & bottom
        new_h = int(img_w / target_aspect)
        top = (img_h - new_h) // 2
        img = img.crop((0, top, img_w, top + new_h))
        
    return img.resize(target_size, Image.Resampling.LANCZOS)

def main(artifacts_dir):
    print(f"Processing assets from: {artifacts_dir}")
    web_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    
    for key, config in ASSETS_CONFIG.items():
        pattern = os.path.join(artifacts_dir, config["src_pattern"])
        matching_files = glob.glob(pattern)
        dest_path = os.path.join(web_dir, config["dest_path"])
        
        # Ensure destination directory exists
        os.makedirs(os.path.dirname(dest_path), exist_ok=True)
        
        if not matching_files:
            print(f"[-] No matching files found for: {pattern} (Skipping...)")
            continue
            
        # Select the most recently modified matching file
        src_path = max(matching_files, key=os.path.getmtime)
        
        print(f"[+] Processing {os.path.basename(src_path)} -> {config['dest_path']}")
        
        try:
            with Image.open(src_path) as img:
                # Handle color modes
                if config["format"] == "JPEG" and img.mode in ("RGBA", "LA", "P"):
                    img = img.convert("RGB")
                elif config["format"] == "WEBP" and img.mode == "RGBA":
                    # Keep transparency if present
                    pass
                elif img.mode not in ("RGB", "RGBA"):
                    img = img.convert("RGB")
                    
                processed_img = crop_and_resize(img, config["size"])
                
                # PNG optimization to bring size down
                if config["format"] == "PNG":
                    processed_img = processed_img.convert("P", palette=Image.Palette.ADAPTIVE, colors=256)
                    processed_img.save(dest_path, format=config["format"])
                else:
                    processed_img.save(dest_path, format=config["format"], quality=config["quality"])
                    
                print(f"    Saved: size={config['size']}, format={config['format']}, file_size={os.path.getsize(dest_path)/1024:.1f} KB")
        except Exception as e:
            print(f"    Error processing {key}: {e}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python convert-assets.py <artifacts_dir>")
        sys.exit(1)
    main(sys.argv[1])
