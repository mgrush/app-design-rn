# app-design-rn

### 大纲（初版）

本组件库统一使用ReactNative@0.57.0来设计开发！

```
- 移动端RN组件规划
    - UI规范
        - 颜色
        - 字体
        - 尺寸 
    - 基础类
        - RootView
        - ErrorBoundry
        - Icon
    - 动画类
        - OpacityUIAnimation
        - FadeUIAnimation
        - SlideUIAnimation
        - NumberAnimation
    - 弹窗类
        - Modal
        - Dialog
        - Popup
        - Popover
        - Toast
        - Loading
    - 表单类
        - Form
        - Button
        - TextInput
            - AutoComplete
        - Select
            - SelectGroup
        - Checkbox
        - Switch
        - ActionSheet
    - 营销类
        - Carousel
        - Notice
    - 页面操作类
        - RefreshControl
        - Slider
        - ProgressBar
        - Tabbar
    - 导航
        - Navigation
        - StatusBar
```

### UI规范

UI规范主要涉及到组件的字体、颜色、尺寸等部分，该部分元素将使用独立的配置文件进行管理，并通过Context以及HOC等技术手段来下发到所有的组件。同时，允许用户在基本UI规范的基础上做定制化实现；

PS：可以参考 [react-native-material-ui/withTheme](https://github.com/xotahal/react-native-material-ui/blob/master/src/styles/withTheme.js)

UI规范大纲如下：

```
- 颜色 
    - 字体颜色
    - 边框颜色
    - 背景色
    - 点击色
    - 禁用背景色
    - 强调颜色
    - 提醒信息颜色 
- 字体
    - 大小
    - 颜色
    - fontWeight / fontFamily
-  尺寸（可以考虑按照xs、sm、normal、lg四个层次进行设计，并做好平台兼容）
    - 状态栏高度
    - 导航高度
    - 按钮高度
    - 内容留白
    - 圆角
    - 底部工具栏高度
    - 列表项高度
```

### 动画类

动画类相关缓动函数请参考 [缓动函数](https://easings.net/zh-cn)

