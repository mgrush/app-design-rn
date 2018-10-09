/**
 * 底部弹窗
 **/

import React, {
  Component
} from 'react'

import {
  Text,
  View,
  Image,
  StyleSheet,
  TouchableOpacity
} from 'react-native'

import PropTypes from 'prop-types'
import Modal from './Modal'

const buttonShape = {
  name: PropTypes.string,
  onPress: PropTypes.func.isRequired
}

class Popup extends Component {
  static propTypes = {
    /**
     * 是否显示底部弹窗
     **/
    visible: PropTypes.bool.isRequired,

    /**
     * 弹窗标题，通常为字符串，但是也支持传入Element自定义节点
     **/
    title: PropTypes.node,
    
    /**
     * 左侧的取消按钮以及右侧的确认按钮
     **/
    cancelButton: PropTypes.shape(buttonShape),
    confirmButton: PropTypes.shape(buttonShape)
  }

  render(){
    const {
      visible,
      title,
      cancelButton,
      confirmButton
    } = this.props

    return (
      <Modal
        visible={visible}
        alignContent='flex-end'
        contentContainerStyle={styles.container} {...this.props}>

        <View style={styles.header}>
          {cancelButton && (
            <HeaderButton type='cancel' {...this.getButtonProps('cancel')} />
          )}

          {title && (React.isValidElement(title) ? title : (
            <Text style={styles.title}>{title}</Text>
          ))}

          {confirmButton && (
            <HeaderButton type='confirm' {...this.getButtonProps('confirm')} />
          )}
        </View>

        {this.props.children}
      </Modal>
    )
  }

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

class HeaderButton extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    onPress: PropTypes.func.isRequired,
    type: PropTypes.oneOf(['cancel', 'confirm'])
  }

  render(){
    const {
      type,
      name,
      onPress
    } = this.props

    return (
      <TouchableOpacity 
        onPress={onPress}
        activeOpacity={0.5} 
        style={styles.buttonContainer}>
        <Text style={[
          styles.buttonName,
          'confirm' === type && styles.confirmButtonName
        ]}>{name}</Text>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 0
  },

  header: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },

  title: {
    fontSize: 16,
    color: '#000'
  },

  buttonContainer: {
    height: 48,
    paddingHorizontal: 16,
    justifyContent: 'center'
  },

  buttonName: {
    fontSize: 14,
    color: '#8C8C8C'
  },

  confirmButtonName: {
    color: '#108ee9'                   
  }
})

export default Popup
