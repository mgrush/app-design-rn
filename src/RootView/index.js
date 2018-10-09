import React, {
  Component
} from 'react'

import {
  View,
  StyleSheet,
  AppRegistry
} from 'react-native'

var instance = null

class RootView extends Component {
  static getInstance = () => {
    return instance
  }

  constructor(props){
    super(props)

    this.state = {
      layerList: []
    }

    instance = this
  }

  append = (component) => {
    return new Promise((resolve) => {
      let layerList = this.state.layerList
      let length = layerList.length

      this.setState({
        layerList: layerList.concat([{
          id: length + 1,
          component
        }])
      }, () => {
        resolve(length + 1)
      })
    }) 
  }

  remove = (id) => {
    return new Promise((resolve) => {
      let layerList = this.state.layerList.concat()
      let matchIndex = layerList.findIndex((item) => item.id === id)

      if(-1 === matchIndex){
        return resolve()
      }

      layerList.splice(matchIndex, 1)

      this.setState({
        layerList
      }, () => {
        resolve() 
      })
    })
  }

  update = (id, component) => {
    return new Promise((resolve) => {
      let layerList = this.state.layerList.concat()
      let matchIndex = layerList.findIndex((item) => item.id === id)

      if(-1 === matchIndex){
        return resolve()
      }
      
      layerList.splice(matchIndex, 1, {
        id,
        component
      })    

      this.setState({
        layerList
      }, () => {
        resolve()
      })
    })
  }

  render(){
    const { layerList } = this.state

    return layerList.length ? (
      <View style={styles.container}>
        {layerList.map(item => {
          return item.component ? (
            <View key={item.id} style={styles.flex}>{item.component}</View>
          ) : null
        })}
      </View>
    ) : null
  }
}

if(!AppRegistry.hasHookedRootView) {
  let registerComponent = AppRegistry.registerComponent

  // 在最顶层置入RootView，用以实现全屏浮层
  AppRegistry.registerComponent = function(key, getElement){
    let Element = getElement()

    return registerComponent(key, () => {
      return class extends Component {
        render(){
          return (
            <View style={{flex: 1}}>
              <Element {...this.props} />
              <RootView />
            </View>    
          )
        }
      }    
    })
  }

  AppRegistry.hasHookedRootView = true
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },

  flex: {
    flex: 1
  }
})

export default RootView
