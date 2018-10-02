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
    visible: PropTypes.bool.isRequired,
    title: PropTypes.string,
    
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
        contentFlex={1}
        visible={visible}
        alignItems={'flex-end'}>
        <View style={styles.header}>
          {cancelButton && (
            <HeaderButton type='cancel' {...this.getButtonProps('cancel')} />
          )}
          {title && (
            <Text style={styles.title}>{title}</Text>
          )}
          {confirmButton && (
            <HeaderButton type='confirm' {...this.getButtonProps('confirm')} />
          )}
        </View>
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
      <TouchableOpacity activeOpacity={0.5} style={styles.buttonContainer}>
        <Text style={[
          styles.buttonName,
          'confirm' === type && styles.confirmButtonName
        ]}>{name}</Text>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
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
