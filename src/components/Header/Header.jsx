import React, {Component} from 'react'
import {withRouter} from 'react-router-dom'
import {Modal} from 'antd';

import LinkButton from '../LinkButton/LinkButton'

import {reqWeather} from '../../api'
import {getUser, deleteUser} from '../../utils/storageUtils'
import memoryUtils from '../../utils/memoryUtils'
import menuList from '../../config/menuConfi'


import './Header.less'
import formatDate from "../../utils/formatDate";

const {confirm} = Modal;

class Header extends Component {
  constructor(props) {
    super(props)
    this.state = {
      curTime: formatDate(),
      dayPictureUrl: '',
      weather: '',
    }
  }

  getWeather = async () => {
    const {dayPictureUrl, weather} = await reqWeather('重庆')
    this.setState({dayPictureUrl, weather})
  }

  getTitle = () => {
    let {pathname} = this.props.history.location
    let title
    menuList.forEach(item => {
      if (!item.children) {
        if (item.key === pathname) {
          title = item.title
        }
      } else {
        item.children.forEach(item1 => {
          if (pathname.indexOf(item1.key) === 0) {
            title = item1.title
          }
        })
      }
    })
    return title
  }
  logout = () => {
    confirm({
      title: '确定要退出吗?',
      onOk: () => {
        memoryUtils.user = {}
        deleteUser()
        this.props.history.replace('/login')
      }
    });
  }

  componentDidMount() {
    this.getTitle()
    this.getWeather()
    this.intervalId = setInterval(() => {
      let curTime = formatDate()
      this.setState({
        curTime
      })
    }, 1000)
  }
  componentWillUnmount () {
    clearInterval(this.intervalId)
  }
  render() {
    let {username} = getUser()
    const title = this.getTitle()
    return (
      <div className='header'>
        <div className='header-top'>
          <span>欢迎, {username}</span>
          <LinkButton onClick={this.logout}>退出</LinkButton>
        </div>
        <div className='header-bottom'>
          <div className='header-bottom-left'>{title}</div>
          <div className='header-bottom-right'>
            <span>{this.state.curTime}</span>
            <img src={this.state.dayPictureUrl} alt=""/>
            <span>{this.state.weather}</span>
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(Header)