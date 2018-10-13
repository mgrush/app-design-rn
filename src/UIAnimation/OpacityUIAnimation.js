/**
 * 渐隐动画容器组件
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

class OpacityUIAnimation extends PureComponent {
  static propTypes = {
    visible: PropTypes.bool,
    minOpacity: PropTypes.number,
    animateOnDidMount: PropTypes.bool,
    duration: PropTypes.number,
    onShow: PropTypes.func,
    onHide: PropTypes.func,
    style: Animated.View.propTypes.style
  }

  static defaultProps = {
    visible: false,
    minOpacity: 0,
    duration: 180,
    animateOnDidMount: true
  }

  constructor(props){
    super(props)

    const {
      visible,
      minOpacity,
      animateOnDidMount
    } = props

    this.opacityValue = new Animated.Value(visible && !animateOnDidMount ? 1 : minOpacity)
  }

  componentDidMount(){
    const {
      visible,
      animateOnDidMount
    } = this.props

    if(visible && animateOnDidMount){
      this.show()
    }
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.visible !== this.props.visible){
      nextProps.visible ? this.show() : this.hide()
    }
  }

  show = () => {
    const {
      onShow,
      duration,
      minOpacity
    } = this.props

    if(this.isAnimating){
      return
    } 

    this.isAnimating = true
    this.opacityValue.setValue(minOpacity)

    this.animation = Animated.timing(this.opacityValue, {
      toValue: 1,
      duration,
      useNativeDriver: true,
      easing: Easing.easeIn
    }).start(() => {
      this.animation = null
      this.isAnimating = false

      'function' === typeof onShow && onShow()
    })
  }

  hide = () => {
    const {
      onHide,
      duration,
      minOpacity
    } = this.props

    if(this.isAnimating){
      return
    }

    this.isAnimating = true
    this.opacityValue.setValue(1)

    this.animation = Animated.timing(this.opacityValue, {
      toValue: minOpacity,
      duration,
      useNativeDriver: true,
      easing: Easing.easeOut
    }).start(() => {
      this.animation = null
      this.isAnimating = false

      'function' === typeof onHide && onHide()
    })
  }

  render(){
    return (
      <Animated.View style={[{
        opacity: this.opacityValue
      }, this.props.style]}>{this.props.children}</Animated.View>
    )
  }
}

export default OpacityUIAnimation
