/**
 * 淡入淡出动画容器组件
 **/

import React, {
  PureComponent
} from 'react'

import {
  Animated,
  Easing,
  InteractionManager
} from 'react-native'

import PropTypes from 'prop-types'

class FadeUIAnimation extends PureComponent {
  static propTypes = {
    /**
     * 是否显示动画组件，如果为true则会启用淡出动画
     **/
    visible: PropTypes.bool,

    /**
     * 最低透明度和缩放程度
     **/
    minOpacity: PropTypes.number,
    minScale: PropTypes.number,

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
    minScale: 0,
    duration: 300,
    animateOnDidMount: false
  }

  constructor(props){
    super(props)

    const {
      visible,
      animateOnDidMount
    } = props

    this.scaleValue = new Animated.Value(visible && !animateOnDidMount ? 1 : 0)
    this.opacityValue = new Animated.Value(visible && !animateOnDidMount ? 1 : 0)
  }

  componentDidMount(){
    const {
      visible,
      animateOnDidMount
    } = this.props

    if(visible && animateOnDidMount){
      InteractionManager.runAfterInteractions(() => this.show())
    }
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

  show(){
    const {
      duration,
      onShow
    } = this.props

    if(!this.isAnimating){
      this.isAnimating = true

      this.animation = Animated.parallel([
        Animated.timing(this.opacityValue, {
          toValue: 1,
          duration,
          useNativeDriver: true,
          easing: Easing.easeIn
        }),

        Animated.timing(this.scaleValue, {
          toValue: 1,
          duration,
          useNativeDriver: true,
          easing: Easing.easeIn
        })
      ]).start(() => {
        this.animation = null
        this.isAnimating = false  

        'function' === typeof onShow && onShow()
      })
    }
  }

  hide(){
    const {
      duration,
      minOpacity,
      minScale,
      onHide
    } = this.props

    if(!this.isAnimating){
      this.isAnimating = true

      this.animation = Animated.parallel([
        Animated.timing(this.opacityValue, {
          toValue: minOpacity,
          duration,
          useNativeDriver: true,
          easing: Easing.easeIn
        }),

        Animated.timing(this.scaleValue, {
          toValue: minScale,
          duration,
          useNativeDriver: true,
          easing: Easing.easeIn
        })
      ]).start(() => {
        this.animation = null
        this.isAnimating = false  

        'function' === typeof onHide && onHide()
      })
    }
  }

  render(){
    return (
      <Animated.View style={{
        opacity: this.opacityValue,
        transform: [{
          scale: this.scaleValue
        }]
      }}>{this.props.children}</Animated.View> 
    )
  }
}

export default FadeUIAnimation
