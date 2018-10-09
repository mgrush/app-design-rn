/**
 * Modal 组件是一种简单的覆盖在其他视图之上显示内容的方式。ReactNative官方推出的Modal组件因为存在以下的一些问题：
 *
 * 1. 在Android客户端中，经常性会出现因为原生Modal的底层依赖问题导致App产生Crash；
 * 2. 出现Crash的时候，因为涉及到Native底层的实现，解决起来难度较大，且需要依赖客户端发布新包才能解决。
 *
 * 所以，考虑通过纯JS的手段实现一个性能已经稳定性都比较可靠的新的Modal组件。
 **/

import React, {
  Component
} from 'react'

import {
  View,
  Platform,
  Animated,
  Easing,
  BackHandler,
  StyleSheet,
  KeyboardAvoidingView,
  TouchableWithoutFeedback
} from 'react-native'

import PropTypes from 'prop-types'
import RootView from '../RootView'

class Modal extends Component {
  static propTypes = {
    /**
     * 是否显示弹窗，在不显示的时候，Dom树上将不会渲染该节点
     * 当该属性发生变化的时候，可触发显示或者隐藏的动画，并调用相关回调onShow和onDismiss
     **/
    visible: PropTypes.bool.isRequired,

    /**
     * 是否显示透明背景
     **/
    transparent: PropTypes.bool,

    /**
     * 这里并没有采取官方Modal的animationType，主要是考虑这里重写的Modal饱含了内容区域，而内容区域的位置决定了动画的类型，所以没有办法随意的支持动画类型的配置
     **/
    needAnimation: PropTypes.bool,

    /**
     * 弹窗显示之后执行的回调
     **/
    onShow: PropTypes.func,

    /**
     * 在弹窗被完全关闭（动画执行完成）之后调用
     **/
    onDismiss: PropTypes.func,

    /**
     * 在用户按下Android设备上的回退物理键时调用
     **/
    onRequestClose: (Platform.isTVOS || Platform.OS === 'android') ?PropTypes.func.isRequired : PropTypes.func,

    /**
     * 自定义属性：如果设置了该属性，则蒙版可点击关闭，并通过该方法修改传入的props.visible的值
     **/
    onClose: PropTypes.func,

    /**
     * 自定义属性：控制内容容器在Y轴的显示位置，可选类型为：flex-start（顶部显示）、center（居中显示）、flex-end（底部显示）
     **/
    alignContent: PropTypes.oneOf(['flex-start', 'center', 'flex-end']),

    /**
     * 自定义属性：控制内容容器自身的视图样式
     **/
    contentContainerStyle: View.propTypes.style
  }

  static defaultProps = {
    visible: false,
    transparent: false,
    needAnimation: true,
    alignContent: 'center'
  }

  constructor(props){
    super(props)

    this.state = {
      contentHeight: 0
    }

    this.modalId = null
    this.animation = new Animated.Value(0)

    if(Platform.isOSTV || Platform.OS === 'android'){
      this.handler = BackHandler.addEventListener('hardwareBackPress', props.onRequestClose)
    }
  }

  componentDidMount(){
    if(this.props.visible){
      this.show()
    }
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.visible !== this.props.visible){
      nextProps.visible ? this.show() : this.hide()
    }
  }

  componentDidUpdate(){
    if(null !== this.modalId){
      RootView.getInstance().update(this.modalId, this.getModal())
    }
  }

  componentWillUnmount(){
    if(this.showAnimation){
      this.showAnimation.stop()
      this.showAnimation = null
    }

    if(this.hideAnimation){
      this.hideAnimation.stop()
      this.hideAnimation = null
    }

    if(this.modalId){
      RootView.getInstance().remove(this.modalId)
    }

    if(this.handler){
      this.handler.remove()
    }
  }

  getModal = () => {
    const {
      transparent,
      alignContent,
      needAnimation,
      contentContainerStyle
    } = this.props

    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'position' : null}
        contentContainerStyle={[styles.container, {
          alignItems: alignContent    
        }]}>
        <TouchableWithoutFeedback onPress={this.onMaskPress}>
          <Animated.View style={[styles.mask, transparent && {
            backgroundColor: 'rgba(0, 0, 0, 0)'
          }, this.getMaskAnimation()]} />
        </TouchableWithoutFeedback>

        <Animated.View 
          onLayout={this.measureLayout}
          style={[styles.content, contentContainerStyle, this.getTransformByNeedAnimation()]} >
          {this.props.children}       
        </Animated.View>
      </KeyboardAvoidingView>
    )
  }

  measureLayout = ({nativeEvent}) => {
    const { height } = nativeEvent.layout

    if(!this._contentHeight) {
      this._contentHeight = height

      this.setState({
        contentHeight: height    
      })
    }
  }

  getMaskAnimation(){
    const {
      needAnimation
    } = this.props

    return {
      opacity: needAnimation ? this.animation : 1
    }
  }

  // 根据是否需要动画，返回相关的动画样式
  getTransformByNeedAnimation(){
    const {
      alignContent,
      needAnimation
    } = this.props

    const {
      contentHeight
    } = this.state

    return !needAnimation ? {
      opacity: 1
    } : {
      opacity: this.animation,
      transform: [{
        scale: alignContent !== 'center' ? 1 : this.animation
      }, {
        translateY: alignContent === 'center' ? 0 : this.animation.interpolate({
          inputRange: [0, 1],
          outputRange: [
            alignContent === 'flex-start' ? - contentHeight : contentHeight, 0
          ]
        })
      }]
    } 
  }

  show = () => {
    const {
      needAnimation
    } = this.props

    if(this.isAnimating){
      return
    }

    this.isAnimating = needAnimation

    RootView.getInstance().append(this.getModal()).then(id => {
      this.modalId = id

      if(needAnimation){
        this.showAnimation = Animated.timing(this.animation, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
          easing: Easing.easeIn
        }).start(() => {
          this.isAnimating = false
          this.showAnimation = null

          this.props.onShow && this.props.onShow()
        })
      }else {
        this.props.onShow && this.props.onShow()
      }
    })
  }

  hide = () => {
    const {
      needAnimation
    } = this.props

    if(this.isAnimating){
      return
    }

    this.isAnimating = needAnimation

    if(needAnimation){
      this.hideAnimation = Animated.timing(this.animation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
        easing: Easing.easeOut
      }).start(() => {
        RootView.getInstance().remove(this.modalId).then(() => {
          this.isAnimating = false
          this.hideAnimation = null

          this.props.onDismiss && this.props.onDismiss()
        })  
      })
    }else {
      RootView.getInstance().remove(this.modalId).then(() => {
        this.props.onDismiss && this.props.onDismiss()
      })  
    }
  }

  onMaskPress = () => {
    if( this.props.onClose){
      this.props.onClose()
    }
  }

  render(){
    return null
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'center'
  },

  mask: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, .5)'
  },

  content: {
    flex: 0.7,
    minHeight: 42,
    borderRadius: 4,
    flexDirection: 'row',
    backgroundColor: '#FFF'
  }
})

export default Modal
