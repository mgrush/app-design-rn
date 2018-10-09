/**
 * 基于自定义Modal开发的弹窗组件
 **/
import React, {
  Component
} from 'react'

import {
  Text,
  View,
  StyleSheet,
  TouchableHighlight
} from 'react-native'

import PropTypes from 'prop-types'

import Modal from './Modal'

const buttonShape = {
  name: PropTypes.string,
  onPress: PropTypes.func.isRequired
}

class Dialog extends Component {
  static propTypes = {
    /**
     * 是否显示弹窗
     **/
    visible: PropTypes.bool.isRequired,

    /**
     * 弹窗显示的标题，通常为字符串，但是也支持传入复杂的Element作为标题
     **/
    title: PropTypes.node.isRequired,
      
    /**
     * 固定命名弹窗按钮为取消按钮和确认按钮，用户可以灵活调整显示的文案，但是必须设置点击事件处理函数
     **/
    cancelButton: PropTypes.shape(buttonShape).isRequired,
    confirmButton: PropTypes.shape(buttonShape).isRequired,

    /**
     * 内容显示容器自身的样式设置
     **/
    contentContainerStyle: View.propTypes.style
  }

  render(){
    const {
      title,
      visible,
      contentContainerStyle
    } = this.props

    return (
      <Modal 
        visible={visible}
        alignContent='center'
        contentContainerStyle={contentContainerStyle} {...this.props} >

        <View style={styles.titleContainer}>
          {React.isValidElement(title) ? title : (
            <Text style={styles.title}>{title}</Text>
          )}
        </View>

        <View style={styles.content}>
          {this.props.children}              
        </View>

        <View style={styles.footer}>
          <FooterButton type='cancel' {...this.getButtonProps('cancel')} />
          <FooterButton type='confirm' {...this.getButtonProps('confirm')} />
        </View>
      </Modal>
    )   
  }

  // 内部组装，允许只对button.onPress属性进行设置
  getButtonProps(type){
    const {
      cancelButton,
      confirmButton
    } = this.props

    switch(type){
      case 'cancel':
        return Object.assign({
          name: '取消'
        }, cancelButton)

      case 'confirm':
        return Object.assign({
          name: '确定'    
        }, confirmButton)

      default:
        return {}
    }
  }
}

// 底部按钮
class FooterButton extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    onPress: PropTypes.func.isRequired,
    type: PropTypes.oneOf(['cancel','confirm']).isRequired
  }

  render(){
    const {
      name,
      type,
      onPress
    } = this.props

    return (
      <TouchableHighlight
        style={[
          styles.button,
          'confirm' === type && styles.confirmButton
        ]} 
        onPress={onPress}
        underlayColor={'rgba(0, 0, 0, .1)'} >
        <Text style={[
          styles.buttonName,
          'confirm' === type && styles.confirmButtonName 
        ]}>{name}</Text>
      </TouchableHighlight>    
    )
  }
}

const styles = StyleSheet.create({
  titleContainer: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },

  title: {
    fontSize: 18,
    color: '#000'
  },

  content: {
    paddingBottom: 16,
    paddingHorizontal: 16
  },

  button: {
    flex: 0.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },

  confirmButton: {
    borderColor: '#8C8C8C',
    borderLeftWidth: StyleSheet.hairlineWidth
  },

  buttonName: {
    fontSize: 16,
    color: '#000'
  },

  confirmButtonName: {
    color: 'rgb(16, 142, 233)',
    fontWeight: '500'
  },

  footer: {
    height: 50,
    borderColor: '#8C8C8C',
    flexDirection: 'row',
    borderTopWidth: StyleSheet.hairlineWidth
  }
})

export default Dialog
