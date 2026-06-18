# 移动端样式调整说明

这个目录是语音转文字的移动端三步静态原型：

- `index.html`: 准备录音
- `recording.html`: 录音中
- `result.html`: 识别结果
- `styles.css`: 三页共用样式

## 适配规则

当前样式使用 rem 做等比缩放，设计稿基准是 `1280 × 720`。

```css
html {
  --stage-width: 12.8;
  --stage-height: 7.2;
  font-size: min(calc((100vw - 1px) / var(--stage-width)), calc((100dvh - 1px) / var(--stage-height)));
}
```

换算规则：

- `1rem = 100px` 设计稿尺寸
- 设计稿里的 `1280px × 720px` 对应 `.viewport { width: 12.8rem; height: 7.2rem; }`
- 修改位置时，把设计稿 px 除以 100，例如 `left: 540px` 写成 `left: 5.4rem`
- `- 1px` 是安全余量，避免不同浏览器亚像素四舍五入导致边缘滚动条

不要在局部元素上再叠加 `transform: scale(...)`，否则会和全局 rem 缩放叠加，导致尺寸不可控。

## 布局层级

三页都遵循同一套层级：

1. `.viewport`: 固定设计稿画布，负责整体等比缩放后的展示边界
2. `.stage`: 页面内容舞台，尺寸同 `.viewport`
3. `.workspace-bg`: 全屏背景
4. `.center-card`: 中间白色/浅色卡片背景
5. `.phone-surface`: 手机内容区域背景图
6. `.mobile-shell`: 手机壳资源，目前隐藏
7. 功能元素：按钮、麦克风、录音状态、结果输入框

常用 z-index：

- 背景资源默认无 z-index
- `.phone-surface`: `z-index: 4`
- 交互和核心视觉元素：`z-index: 5`

## 关键组件

### 准备页

主要选择器：

- `.primary-action`: “开始”按钮
- `.voice-visual`: 麦克风视觉整体
- `.mic-orb`: 麦克风圆形按钮视觉
- `.copy-block`: “准备录音”文案区域

调整入口：

- 改按钮位置：`.primary-action` 的 `left/top/width/height`
- 改麦克风位置：`.voice-visual` 的 `left/top`
- 改文案位置：`.copy-block` 的 `left/top/width`

### 录音页

主要选择器：

- `.recording-visual`: 录音麦克风整体
- `.recording-mic-wrap`: 进度环和麦克风容器
- `.record-progress`: SVG 进度环
- `.listen-pill`: “正在聆听…”状态胶囊
- `.timer-line`: 录音时间
- `.waveform-video`: 波形视频
- `.finish-action`: “完成”按钮和 loading 状态

相关脚本：

- `recording.js`

计时相关常量：

```js
const maxSeconds = 10;
const circumference = 309.27;
```

如果进度环半径改了，需要同步更新 `circumference`，计算方式是：

```text
2 * Math.PI * r
```

### 结果页

主要选择器：

- `.result-title`: “识别结果”标题
- `.result-box`: 结果输入框外框
- `.result-box textarea`: 结果文本
- `.secondary-action`: “重新录音”
- `.confirm-action`: “确认”
- `.toast`: 识别失败提示，样式基于 PC：`background: rgba(0,0,0,0.70)`、`border-radius: 8px`，移动端 1280×720 基准写作 `0.08rem`

相关脚本：

- `result.js`

当前结果文案是静态写死在 `result.html` 的 `textarea` 内。
从录音中手动点击“完成”进入结果页时展示失败 toast：“识别失败了，请稍后重试～”，并同步清空结果输入框。倒计时自动完成进入结果页不展示 toast；点击“确认”返回准备页。

倒计时自动完成进入结果页时，输入框展示默认文案：“你好，欢迎学习编程，今天我们一起来写一个有趣的小程序吧！”。结果输入框最多允许 120 字，HTML 使用 `maxlength="120"`，脚本侧保留截断兜底。

## 颜色与按钮

主按钮蓝色：

```css
background: #2694ff;
box-shadow: 0 0.06687rem 0.1003rem rgba(38, 148, 255, 0.3);
```

次按钮橙色：

```css
background: #ff9928;
box-shadow: 0 0.04rem 0.06rem rgba(255, 153, 40, 0.3);
```

正文深色：

```css
#1f2937
```

辅助文字：

```css
#6b7280
```

录音状态蓝：

```css
#0284c7
#38bdf8
```

## 资源说明

核心资源在 `assets/`：

- `bg.png`: 页面大背景
- `card-bg.png`: 中央卡片背景
- `beijing.png`: 手机内容区背景
- `phone-frame.png`: 手机壳资源
- `mic-icon.svg`: 麦克风图标
- `waveform.mp4`: 录音波形动画
- `loading-spinner.svg`: loading 图标

替换图片时尽量保持原始资源比例，否则需要同步调整 CSS 的 `width/height/object-fit`。

## 调整建议

常见改动优先改这些位置：

- 页面整体比例：改 `--stage-width` / `--stage-height`，但三页都要一起验证
- 主内容整体偏移：改 `.center-card`、`.phone-surface` 和对应功能元素的位置
- 按钮大小：改 `.primary-action`、`.secondary-action`、`.confirm-action`
- 录音视觉大小：改 `.recording-visual`、`.recording-mic-wrap`、`.record-progress`
- 文案大小：改对应 `font-size`，不要用 `vw` 做字体缩放

不要做这些：

- 不要把固定设计稿尺寸重新改回 px
- 不要在按钮或文字上使用负 letter-spacing
- 不要用 `vw` 单独缩放字体
- 不要在已经使用 rem 的元素外层再套 scale

## 验证清单

改完样式后至少验证这些尺寸：

- `375 × 667`
- `390 × 844`
- `430 × 932`
- `768 × 1024`
- `844 × 390`

需要确认：

- 没有横向滚动
- 没有纵向滚动
- 三页核心按钮都可见
- 标题、说明、计时、结果文本框不溢出
- loading 图标居中且不会撑大按钮
- 波形视频完整显示，不遮挡按钮

本地预览：

```bash
cd /Users/zyb/Codex
python3 -m http.server 8777
```

访问：

```text
http://127.0.0.1:8777/移动端/index.html
http://127.0.0.1:8777/移动端/recording.html
http://127.0.0.1:8777/移动端/result.html
```
