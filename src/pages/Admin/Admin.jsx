import React, {Component} from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {Layout} from 'antd'

import memoryVar from '../../utils/memoryUtils'


import Header from '../../components/Header/Header'
import LeftNav from '../../components/LeftNav/LeftNav'
import Home from '../Home/Home'
import Bar from '../Charts/Bar'
import Line from '../Charts/Line'
import Pie from '../Charts/Pie'
import Category from '../Product/Category'
import Products from '../Product/Products'
import Role from '../Role/Role'
import User from '../User/User'


const { Footer, Sider, Content } = Layout

class Admin extends Component{
  render () {
    let {user} = memoryVar
    if (!Object.keys(user).length) {
      return <Redirect to='/login'/>
    }
    return (
        <Layout style={{minHeight: '100%'}}>
          <Sider>
            <LeftNav/>
          </Sider>
          <Layout>
            <Header>Header</Header>
            <Content style={{margin: '20px', backgroundColor: '#fff'}}>
              <Switch>
                <Route path='/home' component={Home}/>
                <Route path='/category' component={Category}/>
                <Route path='/product' component={Products}/>
                <Route path='/role' component={Role}/>
                <Route path='/user' component={User}/>
                <Route path='/charts/bar' component={Bar}/>
                <Route path='/charts/line' component={Line}/>
                <Route path='/charts/pie' component={Pie}/>
                <Redirect to='/home'/>
              </Switch>
            </Content>
            <Footer style={{textAlign: 'center', color: '#ccc'}}>推荐使用谷歌浏览器, 可以获得更佳页面操作体验</Footer>
          </Layout>
        </Layout>
    )
  }
}
export default Admin