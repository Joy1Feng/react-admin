import React, {Component} from 'react'

import {
  Card,
  Table,
  Button,
  message,
  Modal
} from 'antd'

import formatDate from '../../utils/formatDate'
import {reqUserList, reqAddUser, reqUpdateAuth} from '../../api'
import {PAGE_SIZE} from '../../utils/constant'
import AddForm from './AddForm'
import AuthForm from './AuthForm'
import memoryUtils from "../../utils/memoryUtils";

class Role extends Component {
  constructor(props) {
    super(props)
    this.menuRef = React.createRef()
    this.state = {
      roles: [],
      role: {},
      showCreateModal: false,
      showAuthModal: false
    }
  }

  getRole = () => this.state.role

  updateRole = async () => {
    const res = this.menuRef.current.getMenus()
    const {_id, auth_time} = this.state.role
    const auth_name = memoryUtils.user.username
    const result = await reqUpdateAuth(_id, res, auth_name, auth_time)
    if (result.status === 0) {
      message.success('更新权限成功')
      this.getUserList()
    } else {
      message.error('更新权限失败')
    }
    this.setState({showAuthModal: false})
  }

  addRole = () => {
    this.form.validateFields(async (err, value) => {
      if (!err) {
        const res = await reqAddUser(value.roleName)
        if (res.status === 0) {
          message.success('添加角色成功')
          // const roles = [...this.state.roles]
          // roles.push(res.role)
          // this.setState({
          //   roles: roles
          // })

          // this.setState(state => ({
          //   roles: [...state.roles, res.role]
          // }))

          this.getUserList()
        } else {
          message.error('添加角色失败')
        }
        this.form.resetFields()
      }
    })
    this.setState({showCreateModal: false})
  }

  setForm = (form) => {
    this.form = form
  }

  getUserList = async () => {
    const res = await reqUserList()
    if (res.status === 0) {
      this.setState({
        roles: res.data.roles
      })
    } else {
      message.error('获取用户列表失败')
    }
  }
  clickRow = record => {
    return {
      onClick: event => {
        this.setState({
          role: record
        })
      }
    }
  }

  initColumns = () => {
    this.columns = [
      {
        title: '角色名称',
        dataIndex: 'name',
      },
      {
        title: '创建时间',
        dataIndex: 'create_time',
        render: (value) =>  formatDate(value)
      },
      {
        title: '授权时间',
        dataIndex: 'auth_time',
        render: formatDate
      },
      {
        title: '授权人',
        dataIndex: 'auth_name',
      },
    ]
  }

  componentDidMount() {
    this.getUserList()
  }

  componentWillMount() {
    this.initColumns()
  }

  render() {
    const {roles, role, showCreateModal, showAuthModal} = this.state
    const {columns, getRole} = this
    return (
      <Card>
        <span>
          <Button
            type='primary'
            onClick={() => this.setState({showCreateModal: true})}
          >创建角色</Button>&nbsp;&nbsp;&nbsp;&nbsp;
          <Button
            disabled={!role._id}
            type='primary'
            onClick={() => this.setState({showAuthModal: true})}
          >设置角色权限</Button>
        </span>
        <Table
          dataSource={roles}
          columns={columns}
          rowKey='_id'
          bordered
          style={{marginTop: 50}}
          onRow={this.clickRow}
          rowSelection={{
            type: 'radio', selectedRowKeys: [role._id]
          }}
          pagination={{defaultPageSize: PAGE_SIZE}}
        />
        <Modal
          title="创建角色"
          visible={showCreateModal}
          onOk={this.addRole}
          onCancel={() => {
            this.setState({showCreateModal: false})
            this.form.resetFields()
          }}
        >
          <AddForm setForm={this.setForm}/>
        </Modal>

        <Modal
          title="设置角色权限"
          visible={showAuthModal}
          onOk={this.updateRole}
          onCancel={() => this.setState({showAuthModal: false})}
        >
          <AuthForm role={role} ref={this.menuRef} getRole={getRole}/>
        </Modal>
      </Card>
    )
  }
}

export default Role