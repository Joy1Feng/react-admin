import React, {Component} from 'react'
import {Menu, Icon} from 'antd'

import {Link, withRouter} from 'react-router-dom'

import menuList from '../../config/menuConfi'

import './LeftNav.less'
import logo from './images/logo.png'

const {SubMenu} = Menu;

class LeftNav extends Component {
  /*getMenuNodes = menuList => {
    return menuList.map(item => {
        if (!item.children) {
          return (
            <Menu.Item key={item.key}>
              <Link to={item.key}>
                <Icon type={item.icon}/>
                <span>{item.title}</span>
              </Link>
            </Menu.Item>
          )
        } else {
          return (
            <SubMenu
              key={item.key}
              title={
                <span>
                      <Icon type={item.icon}/>
                      <span>{item.title}</span>
                  </span>
              }
            >
              {
                this.getMenuNodes(item.children)
              }
            </SubMenu>
          )
        }
    })
  }*/
  componentWillMount () {
    this.menuNodes = this.getMenuNodes(menuList)
  }
  getMenuNodes = menuList => {
    return menuList.reduce((pre, item) => {
      if (!item.children) {
         pre.push((
          <Menu.Item key={item.key}>
            <Link to={item.key}>
              <Icon type={item.icon}/>
              <span>{item.title}</span>
            </Link>
          </Menu.Item>
        ))
      }
      else {
        let {pathname} = this.props.location
        const cItem = item.children.find(cItem => pathname.indexOf(cItem.key) === 0)
        if (cItem) {
          this.openkey = item.key
        }
         pre.push((
          <SubMenu
            key={item.key}
            title={
              <span>
                      <Icon type={item.icon}/>
                      <span>{item.title}</span>
                  </span>
            }
          >
            {
              this.getMenuNodes(item.children)
            }
          </SubMenu>
        ))
      }
      return pre
    }, [])
  }

  render() {
    // debugger
    let {pathname} = this.props.location
    if (pathname.indexOf('/product') === 0) {
      pathname = '/product'
    }
    const {openkey} = this
    return (
      <div className='left-nav'>
        <Link to='/'>
          <header className='left-nav-header'>
            <img src={logo} alt=""/>
            <h1>硅谷后台</h1>
          </header>
        </Link>
        <Menu
          mode="inline"
          theme="dark"
          selectedKeys={[pathname]}
          defaultOpenKeys={[openkey]}
        >
          {
            this.menuNodes
          }
        </Menu>
      </div>
    )
  }
}

/*
* withRouter高阶组件
* 包装非路由组件, 返回一个新的组件
* 新的组件向非路由组件传递3个属性history/location/match
* */

export default withRouter(LeftNav)