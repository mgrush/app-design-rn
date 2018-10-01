/**
 * 自定义弹窗
 **/

import React, {
  Component
} from 'react'

import {
  Text,
  View,
  TouchableHighlight,
  StyleSheet
} from 'react-native'

import PropTypes from 'prop-types'

import Modal from './index'

const buttonShape = {
  name: PropTypes.string,
  onPress: PropTypes.func.isRequired
}

class Dialog extends Component {
  static propTypes = {
    visible: PropTypes.bool.isRequired,
    title: PropTypes.string.isRequired,
      
    // 按钮的名称以及回调事件设置
    cancelButton: PropTypes.shape(buttonShape).isRequired,
    confirmButton: PropTypes.shape(buttonShape).isRequired,

    contentFlex: PropTypes.number
  }

  static defaultProps = {
    contentFlex: 0.7
  }

  render(){
    const {
      visible,
      title,
      contentFlex
    } = this.props

    return (
      <Modal 
        visible={visible}
        maskClosable={false}
        alignItems={'center'}
        borderRadius={6}
        onClose={() => {}}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{title}</Text>
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
    type: PropTypes.oneOf(['cancel','confirm', 'normal']).isRequired
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
