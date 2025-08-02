# 神话文献下载库

本目录包含了从各种公开资源下载的世界神话文献。

## 已下载文献

### 📚 中国神话 (Chinese)
- **山海经完整版** (`shanhaijing_complete.txt`)
  - 包含：南山经、西山经、北山经、东山经、中山经
  - 来源：古诗文网
  
- **封神演义样本** (`fengshen_yanyi_sample.txt`)
  - 包含：第1-5回
  - 来源：中国哲学书电子化计划

- **山海经样本** (`shanhaijing_sample.txt`)
  - 南山经节选
  - 来源：古诗文网

### ⛩️ 日本神话 (Japanese)
- **古事记前10章** (`古事记_kojiki.txt`)
  - 包含：天地初发到天照大神与须佐之男
  - 来源：Sacred Texts Archive
  
- **古事记样本** (`kojiki_sample.txt`)
  - 前3章：天地初发、七代之神、伊邪那岐与伊邪那美
  - 来源：Sacred Texts Archive

### 🔨 北欧神话 (Norse)
- **老埃达诗歌选** (`老埃达_elder_edda.txt`)
  - 包含：女先知的预言、高人的箴言等6首诗歌
  - 来源：Sacred Texts Archive

### 🕉️ 印度神话 (Indian)
- **梨俱吠陀赞歌选** (`梨俱吠陀_rigveda.txt`)
  - 包含：第1卷前5首赞歌
  - 来源：Sacred Texts Archive

## 文件统计

```
中文文献: 3 个文件
日文文献: 2 个文件  
北欧文献: 1 个文件
印度文献: 1 个文件
总计: 7 个文件
```

## 下载工具

本项目使用了以下Python脚本进行下载：
- `batch_mythology_downloader.py` - 批量下载器
- `chinese_mythology_downloader.py` - 中文文献专用下载器
- `simple_mythology_downloader.py` - 简单下载器

## 数据来源

所有文献均来自公开的数字图书馆和学术网站：
- Sacred Texts Archive (sacred-texts.com)
- 古诗文网 (gushiwen.cn)
- 中国哲学书电子化计划 (ctext.org)
- MIT Classics Archive
- Project Gutenberg

## 版权说明

这些古典文献已超过版权保护期，属于公有领域。下载仅供学习和研究使用。

## 使用建议

1. 文本文件使用UTF-8编码
2. 可以使用任何文本编辑器打开
3. 建议配合原网站阅读以获得更好的阅读体验
4. 部分文献为节选，完整版请访问原网站

## 后续计划

- [ ] 下载希腊神话（伊利亚特、奥德赛）
- [ ] 下载埃及神话（亡灵书）
- [ ] 下载美索不达米亚神话（吉尔伽美什史诗）
- [ ] 添加更多中文神话（聊斋志异）
- [ ] 创建电子书格式（EPUB/PDF）