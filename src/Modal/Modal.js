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
  BackHandler,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView
} from 'react-native'

import PropTypes from 'prop-types'
import RootView from '../RootView'

import FadeUIAnimation from '../UIAnimation/FadeUIAnimation'
import SlideUIAnimation from '../UIAnimation/SlideUIAnimation'
import OpacityUIAnimation from '../UIAnimation/OpacityUIAnimation'

class Modal extends Component {
  static propTypes = {
    /**
     * 是否显示弹窗，在不显示的时候，Dom树上将不会渲染该节点
     * 当该属性发生变化的时候，可触发显示或者隐藏的动画，并调用相关回调onShow和onDismiss
     **/
    visible: PropTypes.bool.isRequired,

    /**
     * 动画时长
     **/
    duration: PropTypes.number,

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
    alignContent: 'center'
  }

  constructor(props){
    super(props)

    this.modalId = null
    this.rootView = RootView.getInstance()
  }

  componentDidMount(){
    if(this.props.visible){
      this.rootView.append(this.getModal(this.props)).then((id) => {
        this.modalId = id
      })
    }
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.visible !== this.props.visible){
      if(nextProps.visible && !this.modalId){
        this.rootView.append(this.getModal(nextProps)).then((id) => {
          this.modalId = id
        })
      }
    }
  }

  componentDidUpdate(){
    if(this.modalId){
      this.rootView.update(this.modalId, this.getModal(this.props))
    }
  }

  getModal = (props) => {
    const {
      visible,
      duration,
      alignContent,
      contentContainerStyle
    } = props

    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'position' : null}
        contentContainerStyle={[styles.container, {
          alignItems: alignContent    
        }]}>

        <TouchableOpacity 
          activeOpacity={1}
          style={styles.container} 
          onPress={this.onMaskPress}>
          <OpacityUIAnimation 
            visible={visible}
            style={styles.mask}
            duration={duration} />
        </TouchableOpacity>

        {alignContent === 'center' ? (
          <FadeUIAnimation
            visible={visible}
            duration={duration}
            onHide={this.onAnimationFinished}
            style={[styles.content, contentContainerStyle]}>
            <View style={styles.innerContent}>
              {this.props.children}
            </View>
          </FadeUIAnimation>
        ) : (
          <SlideUIAnimation
            visible={visible}
            duration={duration}
            slideDirection={alignContent === 'flex-start' ? 'top' : 'bottom'}
            onHide={this.onAnimationFinished}
            style={[styles.content, contentContainerStyle]}>
            <View style={styles.innerContent}>
              {this.props.children}
            </View>
          </SlideUIAnimation>
        )}
      </KeyboardAvoidingView>
    )
  }

  onMaskPress = () => {
    if( this.props.onClose){
      this.props.onClose()
    }
  }

  onAnimationFinished = () => {
    if(this.modalId){
      this.rootView.remove(this.modalId)
      this.modalId = null
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
  },

  innerContent: {
    flex: 1
  }
})

export default Modal
