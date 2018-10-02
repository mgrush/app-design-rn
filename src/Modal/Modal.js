import React, {
  Component
} from 'react'

import {
  View,
  StyleSheet,
  Animated,
  Easing,
  Dimensions,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback
} from 'react-native'

import PropTypes from 'prop-types'

import RootView from '../RootView'

const {
  width: winWidth,
  height: winHeight
} = Dimensions.get('window')

class Modal extends Component {
  static propTypes = {
    visible: PropTypes.bool.isRequired,

    onClose: PropTypes.func,

    // 蒙版
    maskOpacity: PropTypes.number,
    maskClosable: PropTypes.bool,

    // Content的弹性宽度
    contentFlex: PropTypes.number,

    // Content在Column方向上的排版
    alignItems: PropTypes.oneOf(['center', 'flex-start', 'flex-end']),

    // 根据排版的不同，设置不同的margin属性来预留Content与上（下）屏幕的距离
    marginTop: PropTypes.number,
    marginBottom: PropTypes.number, 

    // Content在水平方向上与屏幕两边的距离
    marginHorizontal: PropTypes.number,

    borderRadius: PropTypes.number
  }

  static defaultProps = {
    maskOpacity: 0.5,
    maskClosable: false,
    contentFlex: 0.8,
    alignItems: 'center',
    marginTop: 0,
    marginBottom: 0,
    marginHorizontal: 0,
    borderRadius: 0
  }

  constructor(props){
    super(props)

    this.state = {
      contentHeight: 0,
      isAnimating: false
    }

    this.maskAnimatedValue = new Animated.Value(0)
    this.contentAnimatedValue = new Animated.Value(0)
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.visible !== this.props.visible){
      nextProps.visible ? this.show() : this.hide()
    }
  }

  componentDidMount(){
    RootView.getInstance().append(this.getModal()).then((id) => {
      this.modalId = id    

      // 如果初始化状态下visible=true，则调用动画显示Modal
      if(this.props.visible){
        this.show()
      }
    })
  }

  componentDidUpdate(){
    if(null !== this.modalId) {
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
  }

  getModal = () => {
    const { 
      maskOpacity, 
      alignItems, 
      marginTop, 
      marginBottom, 
      borderRadius, 
      contentFlex,
      marginHorizontal
    } = this.props

    const { 
      contentHeight
    } = this.state

    const behavior = Platform.OS === 'ios' ? 'position' : null
    return (
      <KeyboardAvoidingView 
        behavior={behavior}
        style={styles.container}
        contentContainerStyle={[styles.container, {alignItems}]}>

        <TouchableWithoutFeedback onPress={this.onMaskPress}>
          <Animated.View style={[
            styles.mask,
            {
              opacity: this.maskAnimatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [0, maskOpacity]
              })
            }
          ]}/>
        </TouchableWithoutFeedback>

        <Animated.View style={[
          styles.content,
          {
            borderRadius,
            flex: contentFlex,
            marginTop: alignItems === 'flex-start' ? marginTop : null,
            marginBottom: alignItems === 'flex-end' ? marginBottom : null,
            marginHorizontal,
            opacity: this.contentAnimatedValue.interpolate({
              inputRange: [0, 1],
              outputRange: [0.3, 1]
            }),
            transform: [{
              scale: alignItems !== 'center' ? 1 : this.contentAnimatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 1]
              })
            }, {
              translateY: alignItems === 'center' ? 0 : this.contentAnimatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [alignItems === 'flex-start' ? - contentHeight : contentHeight, 0]
              })
            }]
          }
        ]} onLayout={this.measureLayout}>
          <View style={styles.contentContainer}>
            {this.props.children}
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    ) 
  }

  measureLayout = ({ nativeEvent }) => {
    const { height } = nativeEvent.layout

    if(!this.contentHeight) {
      this.contentHeight = height

      this.setState({
        contentHeight: height    
      })
    }
  }

  show(){
    this.maskAnimatedValue.setValue(0)
    this.contentAnimatedValue.setValue(0)

    if(this.state.isAnimating){
      return
    }

    this.setState({
      isAnimating: true    
    })

    this.showAnimation = Animated.parallel([
      Animated.timing(this.maskAnimatedValue, {
        toValue: 1,
        duration: 300,
        easing: Easing.easeIn
      }),
      Animated.timing(this.contentAnimatedValue, {
        toValue: 1,
        duration: 300,
        easing: Easing.easeIn
      })
    ]).start(() => {
      this.setState({
        isAnimating: false    
      })

      this.showAnimation = null
    })
  }

  hide(){
    this.maskAnimatedValue.setValue(1)
    this.contentAnimatedValue.setValue(1)

    if(this.state.isAnimating){
      return
    }

    this.setState({
      isAnimating: true
    })

    this.hideAnimation = Animated.parallel([
      Animated.timing(this.maskAnimatedValue, {
        toValue: 0,
        duration: 200,
        easing: Easing.easeOut
      }),
      Animated.timing(this.contentAnimatedValue, {
        toValue: 0,
        duration: 200,
        easing: Easing.easeOut
      })
    ]).start(() => {
      this.setState({
        isAnimating: false
      })

      this.hideAnimation = null
    })
  }

  onMaskPress = () => {
    // 通过onClose方法更新props.visible来达到关闭的效果
    const { maskClosable, onClose } = this.props

    maskClosable && onClose && onClose()
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
    width: winWidth,
    height: winHeight,
    backgroundColor: '#000'
  },

  content: {
    overflow: 'hidden',
    flexDirection: 'row',
    backgroundColor: '#FFF'
  },

  contentContainer: {
    flex: 1                  
  }
})

export default Modal
