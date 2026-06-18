# H5分享页样式说明

此目录基于 Figma 文件 `语音转文字` 的 H5 节点实现：

- `92:326`: 录音准备
- `92:354`: 录音中
- `92:270`: 录音转文字结果

## 文件结构

- `index.html`: 单页 H5，包含四个状态 screen
- `styles.css`: 720×1280 rem 等比适配样式
- `script.js`: 状态切换、计时、loading 跳转
- `assets/`: 本地资源
- `_figma/`: Figma 截图参考图，仅用于对照

## 适配基准

实现按 `720 × 1280` 画布适配，主要面向手机浏览器访问。

```css
html {
  --stage-width: 7.2;
  --stage-height: 12.8;
  font-size: min(calc((100vw - 1px) / var(--stage-width)), calc((100dvh - 1px) / var(--stage-height)));
}
```

换算规则：

- `1rem = 100px`
- 720px 写成 `7.2rem`
- 1280px 写成 `12.8rem`
- Figma H5 节点实际是 360px 宽，坐标已按 2 倍映射到 720px 基准

## 页面状态

所有状态都在 `index.html` 内：

- `[data-state="ready"]`: 准备录音
- `[data-state="recording"]`: 录音中
- `[data-state="loading"]`: 录音 loading
- `[data-state="result"]`: 录音结果

交互连接：

- 准备页点击“开始” -> 录音中
- 录音中 10 秒自动 -> loading -> 结果页
- 录音中手动点击“完成” -> loading -> 结果页，并自动提示失败 toast
- 结果页点击“重新录音” -> 录音中
- 结果页点击“确认” -> 返回准备页
- 左上返回 -> 准备页

失败 toast 文案为“识别失败了，请稍后重试～”。只有手动点击“完成”的链路展示；10 秒倒计时自动完成不展示。toast 展示时，识别结果输入框应同步清空。

## 新版结构规则

新版 H5 按 Figma `92:326` 的结构拆成三层：

- 顶部标题栏：白色区域固定在顶部，高度 `1.12rem`
- 卡片内标题：`.panel-title`，按 Figma `92:326` 放在卡片顶部下方 `0.56rem`
- 内容卡片：`.panel` 从 `1.44rem` 开始，宽 `6.56rem`，高度使用 `calc(100% - 2.96rem)`，会随手机屏幕高度向下拉伸
- 底部操作栏：由 `.screen::after` 生成白色区域，高度 `1.44rem`，顶部圆角为 Figma `16px`，在 720 基准里写作 `0.32rem`
- 内容卡片与底部操作栏之间保持 Figma `16px` 间距，720 基准里写作 `0.32rem`；按钮在底部操作栏内保留 Figma 的上下内边距

按钮不再放在 `.panel` 内，避免高屏手机上按钮跟着内容卡片上浮。

## 关键选择器

- `.viewport`: 720×1280 等比画布
- `.screen`: 单个页面状态
- `.back-button`: 顶部白条和返回按钮
- `.panel`: 主内容卡片
- `.panel-title`: 卡片内标题
- `.mic-visual`: 麦克风视觉容器
- `.record-progress`: 录音进度环
- `.listen-pill`: 正在聆听状态
- `.timer-line`: 计时文本
- `.waveform-video`: 波形视频
- `.primary-button`: 蓝色主按钮
- `.secondary-button`: 橙色次按钮
- `.result-box`: 识别结果文本区域
- `.toast`: 识别失败提示，黑色 70% 背景，Figma/PC 基准圆角 8px，H5 720 基准写作 `0.16rem`

## 验证建议

至少验证：

- `360 × 640`
- `375 × 667`
- `390 × 844`
- `430 × 932`
- `720 × 1280`

需要确认：

- 没有横向滚动
- 没有纵向滚动
- 四个状态都能切换
- 10 秒自动进入 loading 并跳结果页
- 手动“完成”与自动完成交互一致
- 波形视频完整显示，不裁剪
