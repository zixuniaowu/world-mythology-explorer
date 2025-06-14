#!/usr/bin/env python3
"""
山海経画像スクレイパー
https://shanhaijing.5000yan.com/ から画像をダウンロード
"""

import requests
from bs4 import BeautifulSoup
import os
import time
from urllib.parse import urljoin, urlparse
import re

class ShanhaijingScraper:
    def __init__(self, base_url="https://shanhaijing.5000yan.com/"):
        self.base_url = base_url
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        })
        self.download_dir = "shanhaijing_images"
        
    def create_directory(self):
        """画像保存用ディレクトリを作成"""
        if not os.path.exists(self.download_dir):
            os.makedirs(self.download_dir)
            
        # 各経のサブディレクトリを作成
        categories = ['dongshan', 'xishan', 'nanshan', 'beishan', 'zhongshan']
        for category in categories:
            cat_dir = os.path.join(self.download_dir, category)
            if not os.path.exists(cat_dir):
                os.makedirs(cat_dir)
                
    def get_chapter_links(self):
        """メインページから各章のリンクを取得"""
        try:
            response = self.session.get(self.base_url)
            response.raise_for_status()
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # 章のリンクを探す
            chapter_links = []
            
            # 各経のセクションを探す
            categories = {
                'dongshan': '东山经',
                'xishan': '西山经', 
                'nanshan': '南山经',
                'beishan': '北山经',
                'zhongshan': '中山经'
            }
            
            for cat_id, cat_name in categories.items():
                print(f"\n{cat_name}のリンクを検索中...")
                
                # リンクパターンを探す
                # 例: /dongshan/1/, /dongshan/2/ など
                pattern = f"/{cat_id}/\\d+/"
                links = soup.find_all('a', href=re.compile(pattern))
                
                for link in links:
                    href = link.get('href')
                    full_url = urljoin(self.base_url, href)
                    chapter_links.append({
                        'url': full_url,
                        'category': cat_id,
                        'title': link.text.strip() or f"{cat_name} - {href}"
                    })
                    
            return chapter_links
            
        except Exception as e:
            print(f"章リンクの取得に失敗: {e}")
            return []
            
    def download_image(self, img_url, save_path):
        """画像をダウンロード"""
        try:
            response = self.session.get(img_url, stream=True)
            response.raise_for_status()
            
            with open(save_path, 'wb') as f:
                for chunk in response.iter_content(chunk_size=8192):
                    f.write(chunk)
                    
            print(f"  ✓ ダウンロード完了: {os.path.basename(save_path)}")
            return True
            
        except Exception as e:
            print(f"  ✗ ダウンロード失敗: {e}")
            return False
            
    def scrape_chapter_images(self, chapter_url, category, title):
        """各章から画像を抽出してダウンロード"""
        try:
            print(f"\n処理中: {title}")
            response = self.session.get(chapter_url)
            response.raise_for_status()
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # 画像を探す
            images = soup.find_all('img')
            downloaded = 0
            
            for idx, img in enumerate(images):
                img_url = img.get('src')
                if not img_url:
                    continue
                    
                # 相対URLを絶対URLに変換
                img_url = urljoin(chapter_url, img_url)
                
                # ファイル名を生成
                parsed_url = urlparse(img_url)
                filename = os.path.basename(parsed_url.path)
                
                if not filename or filename == '':
                    filename = f"image_{idx}.jpg"
                    
                # カテゴリ名とタイトルをファイル名に含める
                safe_title = re.sub(r'[^\w\s-]', '', title)
                safe_title = re.sub(r'[-\s]+', '_', safe_title)
                filename = f"{safe_title}_{filename}"
                
                save_path = os.path.join(self.download_dir, category, filename)
                
                # 既にダウンロード済みの場合はスキップ
                if os.path.exists(save_path):
                    print(f"  - スキップ（既存）: {filename}")
                    continue
                    
                # ダウンロード
                if self.download_image(img_url, save_path):
                    downloaded += 1
                    
                # サーバーに負荷をかけないよう少し待機
                time.sleep(0.5)
                
            print(f"  完了: {downloaded}枚の画像をダウンロード")
            
        except Exception as e:
            print(f"  エラー: {e}")
            
    def run(self):
        """スクレイピングを実行"""
        print("山海経画像スクレイパー開始")
        
        # ディレクトリ作成
        self.create_directory()
        
        # 章のリンクを取得
        chapter_links = self.get_chapter_links()
        
        if not chapter_links:
            print("章のリンクが見つかりませんでした")
            # 手動でいくつかのURLを試す
            manual_links = [
                {'url': 'https://shanhaijing.5000yan.com/dongshan/1/', 'category': 'dongshan', 'title': '東山経第一'},
                {'url': 'https://shanhaijing.5000yan.com/dongshan/2/', 'category': 'dongshan', 'title': '東山経第二'},
                {'url': 'https://shanhaijing.5000yan.com/xishan/1/', 'category': 'xishan', 'title': '西山経第一'},
                {'url': 'https://shanhaijing.5000yan.com/nanshan/1/', 'category': 'nanshan', 'title': '南山経第一'},
                {'url': 'https://shanhaijing.5000yan.com/beishan/1/', 'category': 'beishan', 'title': '北山経第一'},
                {'url': 'https://shanhaijing.5000yan.com/zhongshan/1/', 'category': 'zhongshan', 'title': '中山経第一'},
            ]
            chapter_links = manual_links
            
        print(f"\n合計 {len(chapter_links)} 章を処理します")
        
        # 各章を処理
        for chapter in chapter_links:
            self.scrape_chapter_images(
                chapter['url'],
                chapter['category'],
                chapter['title']
            )
            # サーバーに負荷をかけないよう待機
            time.sleep(2)
            
        print("\n\nスクレイピング完了！")
        print(f"画像は {self.download_dir} ディレクトリに保存されました")

if __name__ == "__main__":
    scraper = ShanhaijingScraper()
    scraper.run()