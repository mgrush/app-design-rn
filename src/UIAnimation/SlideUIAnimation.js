/**
 * 滑入画出动画容器组件
 **/

import React, {
  PureComponent
} from 'react'

import {
  Animated,
  Easing,
  Dimensions,
  NativeModules,
  InteractionManager
} from 'react-native'

import PropTypes from 'prop-types'

// 动画执行的方向
const SLIDE_FROM_LEFT = 'left'
const SLIDE_FROM_RIGHT = 'right'
const SLIDE_FROM_TOP = 'top'
const SLIDE_FROM_BOTTOM = 'bottom'

const {
  width: winWidth,
  height: winHeight
} = Dimensions.get('window')

class SlideUIAnimation extends PureComponent {
  static propTypes = {
    /**
     * 是否显示动画组件，如果为true则会启用淡出动画
     **/
    visible: PropTypes.bool,

    /**
     * 最低透明度
     **/
    minOpacity: PropTypes.number,

    /**
     * 在X或者Y轴执行Slide操作时，需要保留显示的偏移量
     **/
    translateOffset: PropTypes.number,

    /**
     * Slide动画的执行方向
     **/
    translateDirection: PropTypes.oneOf([
      SLIDE_FROM_LEFT,
      SLIDE_FROM_RIGHT,
      SLIDE_FROM_TOP,
      SLIDE_FROM_BOTTOM
    ]),

    /**
     * 初始化显示的时候是否需要执行动画，只有当初始化是visible=true时才生效
     **/
    animateOnDidMount: PropTypes.bool,

    /**
     * 动画持续时长
     **/
    duration: PropTypes.number,

    /**
     * 完全显示或者完全隐藏时，执行相关的回调
     **/
    onShow: PropTypes.func,
    onHide: PropTypes.func
  }

  static defaultProps = {
    visible: false,
    minOpacity: 0,
    translateOffset: 0,
    duration: 300,
    animateOnDidMount: false,
    translateDirection: SLIDE_FROM_BOTTOM
  }

  constructor(props){
    super(props)

    // 标记内容区域在挂载或者布局发生变化时候相对屏幕的位置和尺寸
    this.measureContent = {
      width: 0,
      height: 0,
      pageX: 0,
      pageY: 0
    }

    this.opacityValue = new Animated.Value(0)
    this.translateValue = new Animated.Value(0)

    //this.opacityValue = new Animated.Value(visible && !animateOnDidMount ? 1 : minOpacity)
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.visible !== this.props.visible){
      nextProps.visible ? this.show() : this.hide()
    }
  }

  componentWillUnmount(){
    if(this.animation){
      this.animation.stop()
      this.animation = null
    }
  }

  setSlideAnimatedValue(isHidden){
    const {
      minOpacity
    } = this.props

    if(isHidden){
      this.opacityValue.setValue(minOpacity)
      this.translateValue.setValue(this.getHiddenPosition())
    }else {
      this.opacityValue.setValue(1)
      this.translateValue.setValue(0)
    }
  }

  show(){
    const {
      onShow,
      duration
    } = this.props

    if(this.isAnimating){
      return
    }

    this.isAnimating = true

    this.setSlideAnimatedValue(true)

    this.animation = Animated.parallel([
      Animated.timing(this.opacityValue, {
        toValue: 1,
        duration,
        useNativeDriver: true,
        easing: Easing.easeInOut
      }),

      Animated.timing(this.translateValue, {
        toValue: 0,
        duration,
        useNativeDriver: true,
        easing: Easing.easeInOut
      })
    ]).start(() => {
      this.animation = null
      this.isAnimating = false  

      'function' === typeof onShow && onShow()
    })
  }

  hide(){
    const {
      onHide,
      duration,
      minOpacity
    } = this.props

    if(this.isAnimating){
      return
    }

    this.isAnimating = true

    this.setSlideAnimatedValue(false)

    this.animation = Animated.parallel([
      Animated.timing(this.opacityValue, {
        toValue: minOpacity,
        duration,
        useNativeDriver: true,
        easing: Easing.easeOutIn
      }),

      Animated.timing(this.translateValue, {
        toValue: this.getHiddenPosition(),
        duration,
        useNativeDriver: true,
        easing: Easing.easeOutIn
      })
    ]).start(() => {
      this.animation = null
      this.isAnimating = false  

      'function' === typeof onHide && onHide()
    })
  }

  getHiddenPosition = () => {
    const {
      translateOffset,
      translateDirection
    } = this.props

    switch(translateDirection){
      case SLIDE_FROM_LEFT:
        return -(this.measureContent.pageX + this.measureContent.width) + translateOffset

      case SLIDE_FROM_RIGHT:
        return winWidth - this.measureContent.pageX - translateOffset

      case SLIDE_FROM_TOP:
        return -(this.measureContent.pageY + this.measureContent.height) + translateOffset

      case SLIDE_FROM_BOTTOM:
        return winHeight - this.measureContent.pageY - translateOffset
    }

    return 0
  }

  render(){
    const {
      translateDirection
    } = this.props

    return (
      <Animated.View style={{
        opacity: this.opacityValue,
        transform: [{
          [[SLIDE_FROM_TOP, SLIDE_FROM_BOTTOM].includes(translateDirection) ? 'translateY' : 'translateX']: this.translateValue
        }]
      }} onLayout={this.measureLayout}>{this.props.children}</Animated.View> 
    )
  }

  measureLayout = ({target}) => {
    const {
      visible,
      animateOnDidMount
    } = this.props

    NativeModules.UIManager.measure(target, (x, y, width, height, pageX, pageY) => {
      this.measureContent = {
        width,
        height,
        pageX,
        pageY
      }

      if(visible){
        if(animateOnDidMount){
          InteractionManager.runAfterInteractions(() => this.show())
        }else {
          this.setSlideAnimatedValue(false)
        }
      }else {
        this.setSlideAnimatedValue(true)
      }
    })
  }
}

export default SlideUIAnimation
