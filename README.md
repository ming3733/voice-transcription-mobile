# 语音转文字静态页面

静态 HTML/CSS/JS 还原的语音转文字页面，包含移动端、H5 分享页和 PC 端。

## 移动端

- `index.html`: 准备录音
- `recording.html`: 录音中
- `result.html`: 识别结果

## H5 分享页

- `h5分享页/index.html`: 单页版，包含准备录音、录音中、loading、识别结果四个状态

## PC 端

- `pc端/index.html`: 准备录音
- `pc端/step2-recording.html`: 录音中
- `pc端/step3-result.html`: 识别结果

直接用静态服务器打开即可，例如：

```bash
python3 -m http.server 8766
```
