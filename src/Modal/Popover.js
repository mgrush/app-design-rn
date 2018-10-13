/**
 * 气泡悬浮弹窗
 **/

import React, {
  Component
} from 'react'

import {
  View,
  Text,
  StyleSheet,
  NativeModules,
  Dimensions,
  TouchableOpacity,
  TouchableHighlight
} from 'react-native'

import Modal from './Modal'
import PropTypes from 'prop-types'

const winHeight = Dimensions.get('window').height
const winWidth = Dimensions.get('window').width

class Popover extends Component {
  static propTypes = {
    /**
     * 默认显示的内容，如：Ellipsis图标等
     **/
    children: PropTypes.node.isRequired,

    /**
     * 容器的自定义样式
     **/
    contentContainerStyle: View.propTypes.style,

    /**
     * 悬浮弹窗相对于内容节点的位置
     **/
    position: PropTypes.oneOf(['left', 'right', 'top', 'bottom']),

    /**
     * 数据项目列表
     **/
    itemList: PropTypes.array.isRequired,

    /**
     * 每一项数据的渲染方法
     **/
    renderItem: PropTypes.func.isRequired,

    /**
     * 用户点击事件
     **/
    onPress: PropTypes.func.isRequired
  }

  static defaultProps = {
    position: 'bottom'
  }

  constructor(props){
    super(props)

    this.state = {
      // 是否显示弹窗
      visible: false,

      // 标记悬浮弹窗的坐标
      droguePosi: null
    }
  }

  render(){
    const {
      position,
      itemList,
      renderItem,
      contentContainerStyle
    } = this.props

    const {
      visible,
      droguePosi
    } = this.state

    return (
      <View style={[styles.container, contentContainerStyle]}>
        <TouchableOpacity 
          activeOpacity={0.5} 
          onPress={this.onDroguePress} 
          onLayout={this.onDrogueLayout}>
          {this.props.children} 
        </TouchableOpacity>

        <Modal 
          visible={visible} 
          onClose={this.hide}
          contentContainerStyle={[
            styles.contentContainerStyle,
            droguePosi
          ]}>
          <View style={[styles.triangle, this.getTriangleStyle()]}/>

          {itemList.map((item, index) => (
            <TouchableHighlight
              key={index}
              underlayColor={'rgba(0, 0, 0, .2)'}
              onPress={this.onPress.bind(this, item, index)} >
              <View style={styles.itemContainer}>
                <View style={[
                  styles.itemContent, 
                  index !== itemList.length -1 && styles.itemContentWithBorder]}>
                ]}>
                  {renderItem(item, index)}
                </View>
              </View>
            </TouchableHighlight>
          ))}
        </Modal>
      </View>    
    )
  }

  hide = () => {
    this.setState({
      visible: false    
    })
  }

  onPress(item, index){
    const { 
      onPress
    } = this.props

    this.setState({
      visible: false    
    }, () => {
      'function' === typeof onPress && onPress(item, index)
    })
  }
  
  // 根据position返回三角图标的样式
  getTriangleStyle(){
    switch(this.props.position){
      case 'left':
        return styles.posiLeft

      case 'right':
        return styles.posiRight

      case 'top':
        return styles.posiTop

      case 'bottom':
        return styles.posiBottom
    }

    return styles.posiBottom
  }

  onDrogueLayout = ({target}) => {
    const {
      position
    } = this.props

    const offset = 15

    NativeModules.UIManager.measure(target, (x, y, width, height, pageX, pageY) => {
      switch(position){
        case 'bottom':
          return this.setState({
            droguePosi: {
              left: pageX,
              top: pageY + height + offset
            }    
          })

        case 'top':
          return this.setState({
            droguePosi: {
              left: pageX,
              bottom: winHeight - (pageY - offset)
            }
          })

        case 'left':
          return this.setState({
            droguePosi: {
              top: pageY,
              right: winWidth - (pageX - offset)
            }
          })

        case 'right':
          return this.setState({
            droguePosi: {
              top: pageY,
              left: pageX + width + offset
            }    
          })
      }
    })
  }

  // 可点击的浮标
  onDroguePress = () => {
    this.setState({
      visible: true    
    })
  }
}

const styles = StyleSheet.create({
  container: {
  
  },

  contentContainerStyle: {
    minWidth: 120,
    flex: 0.4,
    borderRadius: 4,
    overflow: 'visible',
    position: 'absolute'
  },

  triangle: {
    width: 12,
    height: 12,
    position: 'absolute',
    transform: [{
      rotate: '45deg'
    }],
    backgroundColor: 'white',
  },

  posiBottom: {
    top: -6,
    left: 12,
  },

  posiTop: {
    left: 12,
    bottom: -6
  },

  posiLeft: {
    right: -6,
    top: 12
  },

  posiRight: {
    left: -6,
    top: 12
  },

  itemContainer: {
    paddingHorizontal: 8
  },

  itemContent: {
    minHeight: 42,
    justifyContent: 'center'
  },

  itemContentWithBorder: {
    borderColor: '#8C8C8C',
    borderBottomWidth: StyleSheet.hairlineWidth
  }
})

export default Popover
