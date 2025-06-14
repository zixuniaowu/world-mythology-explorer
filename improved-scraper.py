#!/usr/bin/env python3
"""
改良版 山海経画像スクレイパー
実際の挿図を探してダウンロード
"""

import requests
from bs4 import BeautifulSoup
import os
import time
from urllib.parse import urljoin, urlparse
import re

class ImprovedShanhaijingScraper:
    def __init__(self):
        self.base_url = "https://shanhaijing.5000yan.com/"
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        })
        self.download_dir = "shanhaijing_illustrations"
        
    def create_directory(self):
        """画像保存用ディレクトリを作成"""
        if not os.path.exists(self.download_dir):
            os.makedirs(self.download_dir)
            
        categories = ['dongshan', 'xishan', 'nanshan', 'beishan', 'zhongshan']
        for category in categories:
            cat_dir = os.path.join(self.download_dir, category)
            if not os.path.exists(cat_dir):
                os.makedirs(cat_dir)
                
    def analyze_page_structure(self, url):
        """ページ構造を分析して画像を探す"""
        try:
            print(f"\nページ分析中: {url}")
            response = self.session.get(url)
            response.raise_for_status()
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # 画像の種類を分析
            images = soup.find_all('img')
            print(f"  見つかった画像数: {len(images)}")
            
            illustration_images = []
            
            for img in images:
                src = img.get('src', '')
                alt = img.get('alt', '')
                title = img.get('title', '')
                
                # QRコードや広告を除外
                if 'qr' in src.lower() or 'gzh' in src.lower() or 'wechat' in src.lower():
                    continue
                    
                # サイズが小さすぎる画像を除外
                width = img.get('width')
                height = img.get('height')
                if width and height:
                    try:
                        if int(width) < 100 or int(height) < 100:
                            continue
                    except:
                        pass
                
                # 山海経関連の画像を探す
                if any(keyword in str(img) for keyword in ['山', '经', '兽', '神', '图', '畫', '獸']):
                    illustration_images.append({
                        'src': urljoin(url, src),
                        'alt': alt,
                        'title': title
                    })
                    print(f"    候補画像: {src} (alt: {alt})")
                    
            # 記事本文内の画像も探す
            content_areas = soup.find_all(['article', 'div'], class_=re.compile('content|main|article|post'))
            for area in content_areas:
                area_images = area.find_all('img')
                for img in area_images:
                    src = img.get('src', '')
                    if src and 'gzh' not in src.lower():
                        full_url = urljoin(url, src)
                        if full_url not in [i['src'] for i in illustration_images]:
                            illustration_images.append({
                                'src': full_url,
                                'alt': img.get('alt', ''),
                                'title': img.get('title', '')
                            })
                            print(f"    コンテンツ内画像: {src}")
                            
            return illustration_images
            
        except Exception as e:
            print(f"  エラー: {e}")
            return []
            
    def scrape_specific_pages(self):
        """特定のページから画像を取得"""
        # 手動で確認したURL
        test_urls = [
            "https://shanhaijing.5000yan.com/dongshan/1/",
            "https://shanhaijing.5000yan.com/xishan/1/",
            "https://shanhaijing.5000yan.com/nanshan/1/",
            "https://shanhaijing.5000yan.com/beishan/1/",
            "https://shanhaijing.5000yan.com/zhongshan/1/"
        ]
        
        for url in test_urls:
            illustrations = self.analyze_page_structure(url)
            
            if illustrations:
                print(f"\n{len(illustrations)}個の挿図候補を発見")
                for ill in illustrations:
                    print(f"  - {ill['src']}")
            else:
                print("\n挿図が見つかりませんでした")
                
            # ページのHTMLも保存して分析
            self.save_page_html(url)
            
            time.sleep(2)
            
    def save_page_html(self, url):
        """デバッグ用：ページのHTMLを保存"""
        try:
            response = self.session.get(url)
            response.raise_for_status()
            
            # URLからファイル名を生成
            parsed = urlparse(url)
            filename = parsed.path.strip('/').replace('/', '_') + '.html'
            filepath = os.path.join(self.download_dir, filename)
            
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(response.text)
                
            print(f"  HTMLを保存: {filename}")
            
        except Exception as e:
            print(f"  HTML保存エラー: {e}")
            
    def find_image_patterns(self):
        """保存したHTMLから画像パターンを探す"""
        html_files = [f for f in os.listdir(self.download_dir) if f.endswith('.html')]
        
        for html_file in html_files:
            filepath = os.path.join(self.download_dir, html_file)
            print(f"\n分析中: {html_file}")
            
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
                
            # 画像URLパターンを探す
            img_patterns = [
                r'<img[^>]+src=["\']([^"\']+)["\']',
                r'background-image:\s*url\(["\']?([^"\')\s]+)["\']?\)',
                r'data-src=["\']([^"\']+)["\']',
                r'data-original=["\']([^"\']+)["\']'
            ]
            
            all_images = set()
            for pattern in img_patterns:
                matches = re.findall(pattern, content, re.IGNORECASE)
                all_images.update(matches)
                
            print(f"  見つかった画像URL: {len(all_images)}")
            for img in list(all_images)[:10]:  # 最初の10個を表示
                if 'gzh' not in img.lower() and 'qr' not in img.lower():
                    print(f"    - {img}")
                    
    def run(self):
        """スクレイピングを実行"""
        print("改良版 山海経画像スクレイパー開始")
        
        self.create_directory()
        
        # まずページ構造を分析
        self.scrape_specific_pages()
        
        # 保存したHTMLから画像パターンを探す
        print("\n\n=== 画像パターン分析 ===")
        self.find_image_patterns()

if __name__ == "__main__":
    scraper = ImprovedShanhaijingScraper()
    scraper.run()