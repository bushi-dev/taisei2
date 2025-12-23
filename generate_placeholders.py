import os
import re
import random
from PIL import Image, ImageDraw, ImageFont

# 設定
MD_FILE = 'document/画像生成指示書.md'
OUTPUT_DIR = 'public/image/busho'
FONT_PATH = '/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc'
IMAGE_SIZE = (512, 512)

def random_pastel_color():
    """ランダムなパステルカラーを生成"""
    r = random.randint(180, 255)
    g = random.randint(180, 255)
    b = random.randint(180, 255)
    return (r, g, b)

def create_placeholder(filename, name, description):
    """プレースホルダー画像を生成"""
    img = Image.new('RGB', IMAGE_SIZE, color=random_pastel_color())
    d = ImageDraw.Draw(img)
    
    try:
        # フォントサイズ調整
        font_size = 40
        font = ImageFont.truetype(FONT_PATH, font_size)
        
        # テキスト位置計算 (中央寄せ)
        # ファイル名
        bbox_file = d.textbbox((0, 0), filename, font=font)
        w_file = bbox_file[2] - bbox_file[0]
        h_file = bbox_file[3] - bbox_file[1]
        
        # 名前
        font_name = ImageFont.truetype(FONT_PATH, 60)
        bbox_name = d.textbbox((0, 0), name, font=font_name)
        w_name = bbox_name[2] - bbox_name[0]
        h_name = bbox_name[3] - bbox_name[1]
        
        # 描画
        d.text(((IMAGE_SIZE[0]-w_file)/2, IMAGE_SIZE[1]/2 - h_name - 20), filename, fill=(0, 0, 0), font=font)
        d.text(((IMAGE_SIZE[0]-w_name)/2, IMAGE_SIZE[1]/2 + 10), name, fill=(0, 0, 0), font=font_name)
        
    except Exception as e:
        print(f"Error drawing text: {e}")
        # フォールバック: デフォルトフォント
        d.text((10, 10), filename, fill=(0, 0, 0))
        d.text((10, 30), name, fill=(0, 0, 0))

    # 保存
    output_path = os.path.join(OUTPUT_DIR, filename)
    img.save(output_path)
    print(f"Generated: {output_path}")

def main():
    if not os.path.exists(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR)
        print(f"Created directory: {OUTPUT_DIR}")

    with open(MD_FILE, 'r', encoding='utf-8') as f:
        content = f.read()

    # テーブル行を抽出する正規表現
    # | No | ファイル名 | 武将名 | ...
    # | 1 | `oda_nobunaga.png` | 織田信長 | ...
    
    # 行ごとに処理
    lines = content.split('\n')
    
    count = 0
    for line in lines:
        line = line.strip()
        if not line.startswith('|'):
            continue
        
        parts = [p.strip() for p in line.split('|')]
        # parts[0] is empty (before first |)
        # parts[1] is No
        # parts[2] is filename (with backticks sometimes)
        # parts[3] is name
        # parts[4] is prompt
        
        if len(parts) < 5:
            continue
            
        # ヘッダー行スキップ
        if 'No' in parts[1] or '----' in parts[1]:
            continue
            
        filename = parts[2].replace('`', '')
        name = parts[3]
        prompt = parts[4]
        
        if filename and name:
            create_placeholder(filename, name, prompt)
            count += 1

    print(f"Total images generated: {count}")

if __name__ == "__main__":
    main()
