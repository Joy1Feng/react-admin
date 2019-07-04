import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
  Form,
  Input,
  Tree
} from 'antd'

import menuList from '../../config/menuConfi'

const {Item} = Form
const {TreeNode} = Tree

class AuthForm extends Component {
  static propTypes = {
    role: PropTypes.object
  }

  constructor(props) {
    super(props)
    const {menus} = this.props.role
    this.state = {
      checkedKeys: menus
    }
  }

  getMenus = () => this.state.checkedKeys

  checkKeysMenus = (checkedKeys) => {
    this.setState({checkedKeys})
  }

  getTreeNodes = (menuList) => {
    return menuList.reduce((pre, item) => {
      pre.push(<TreeNode title={item.title} key={item.key}>
        {
          item.children ? this.getTreeNodes(item.children) : null
        }
      </TreeNode>)
      return pre
    }, [])
  }

  componentWillMount() {
    this.treeNodes = this.getTreeNodes(menuList)
  }

  componentWillReceiveProps (nextProps) {
    const {menus} = nextProps.role
    this.setState({checkedKeys: menus})
  }
   
  render() {
    const formItemLayout = {
      labelCol: {span: 4},
      wrapperCol: {span: 15}
    }
    const {role} = this.props
    const {checkedKeys} = this.state
    return (
      <div>
        <Item label='角色名称' {...formItemLayout}>
          <Input value={role.name} disabled/>
        </Item>
        <Tree
          checkable
          defaultExpandAll
          checkedKeys={checkedKeys}
          onCheck={this.checkKeysMenus}
        >
          <TreeNode title="平台权限" key="all">
            {this.treeNodes}
          </TreeNode>
        </Tree>
      </div>
    )
  }
}

export default AuthForm