import React, {Component} from 'react'
import {Redirect} from "react-router-dom"

import {Form, Icon, Input, Button, message} from 'antd'

import {reqLogin} from '../../api'
import memoryVar from '../../utils/memoryUtils'
import {saveUser} from '../../utils/storageUtils'


import './Login.less'
import logo from './images/logo.png'


/*登录路由组件*/
class Login extends Component {

   handleSubmit = e => {
    e.preventDefault()
    this.props.form.validateFields(async (err, values) => {
      // 校验成功
      if (!err) {
        const {username, password} = values
        const res = await reqLogin(username, password)
        if (res.status === 0) {
          message.success('登录成功')
          memoryVar.user = res.data
          saveUser(res.data)
          this.props.history.replace('/')
        } else {
          message.error(res.msg)
        }
      }
    })
  }
  validatePwd = (rule, value, callback) => {
    if (!value) {
      callback('密码必须输入')
    } else if (value.length < 4) {
      callback('密码长度不能小于4位')
    } else if (value.length > 12) {
      callback('密码长度不能大于12位')
    } else if (!/^\w+$/.test(value)) {
      callback('密码必须是英文、数字或下划线组成')
    } else {
      callback()
    }

  }

  render() {
    // 得到具有强大功能的form对象
    let {user} = memoryVar
    if (Object.keys(user).length !== 0) {
      return <Redirect to='/'/>
    }
    const {form} = this.props
    const {getFieldDecorator} = form
    return (
      <div className='login'>
        <header className='login-header'>
          <img src={logo} alt=""/>
          <h1>React项目: 后台管理系统</h1>
        </header>
        <section className='login-content'>
          <h2>用户登录</h2>
          <Form onSubmit={this.handleSubmit} className="login-form">
            <Form.Item>
              {getFieldDecorator('username', {
                // 声明式验证: 直接使用别人定义好的验证进行验证
                rules: [
                  {required: true, message: '请输入你的用户名!'},
                  {min: 4, message: '用户名至少4位'},
                  {max: 12, message: '用户名最多12为'},
                  {pattern: /^\w+$/, message: '用户名必须是数字字母和下划线'}
                ],
                initialValue: 'admin'
              })(
                <Input
                  prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>}
                  placeholder="用户名"
                />,
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('password', {
                rules: [
                  {validator: this.validatePwd}
                ],
              })(
                <Input
                  prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}}/>}
                  type="password"
                  placeholder="密码"
                />,
              )}
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" className="login-form-button">
                登录
              </Button>
            </Form.Item>
          </Form>
        </section>
      </div>
    )
  }
}

//包装Form组件生成一个新的组件: Form(Login)
//新组建会向Form组件传递一个强大的对象属性: from
const WrapLogin = Form.create({ name: 'normal_login' })(Login)
export default WrapLogin