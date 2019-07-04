import React, {Component} from 'react'
import {Switch, Route, Redirect} from 'react-router-dom'

import Home from './Home'
import AddUpdate from './AddUpdate'
import Detail from './Detail'

import './product.less'

class Products extends Component{
  render () {
    return (
      <Switch>
        <Route exact path='/product' component={Home}></Route>
        <Route path='/product/detail' component={Detail}></Route>
        <Route  path='/product/addupdate' component={AddUpdate}></Route>
        <Redirect to='/product'/>
      </Switch>
    )
  }
}
export default Products