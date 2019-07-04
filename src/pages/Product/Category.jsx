import React, {Component} from 'react'
import {
  Card,
  Button,
  Icon,
  Table,
  message,
  Modal
} from 'antd'
import LinkButton from "../../components/LinkButton/LinkButton";
import AddForm from '../../components/AddForm/AddForm'
import Update from '../../components/UpdateForm/Update'

import {reqAddCategory, reqCategorys, reqUpdateCategory} from '../../api'

class Category extends Component {
  constructor(props) {
    super(props)
    this.state = {
      categorys: [],
      subCategorys: [],
      parentId: '0',
      loading: true,
      parentName: '',
      showStatus: 0,
    }
  }
  addCategoryName = () => {
    this.form.validateFields(async (err, values) => {
      if (!err) {
        this.setState({
          showStatus: 0
        })
        const {categoryName, parentId} = this.form.getFieldsValue()
        this.form.resetFields()
        const res = await reqAddCategory(parentId, categoryName)
        if (res.status === 0) {
          if (parentId === this.state.parentId) {
            this.getcategorys()
          } else if (parentId === '0') {
            this.getcategorys('0')
          }
        }
      }
    })
  }
  updateCategoryNameOk = () => {
    this.form.validateFields(async (err, values) => {
      if (!err) {
        let {categoryName} = values
        let categoryId = this.categoryId
        const res = await reqUpdateCategory(categoryId, categoryName)
        if (res.status === 0){
          this.setState({showStatus:0})
          this.getcategorys()
          this.form.resetFields()
        } else {
          message.error('更新失败')
        }
      }
    })

  }
  setForm = (form) => {
    this.form = form
  }
  addCategory = () => {
    this.setState({showStatus:1})
  }
  updateCategory = (category) => {
    this.categoryName = category.name
    this.setState({showStatus: 2})
    this.categoryId = category._id
  }
  handleOk = () => {

  }
  handleCancel =() => {
    this.setState({showStatus: 0})
    this.form.resetFields()
  }
  showSubCategorys = (props) => {
    this.setState({
      parentId: props._id,
      parentName: props.name
    }, () => {
      this.getcategorys()
    })
  }
  initColumn = () => {
    this.extra = (
      <Button type='primary' onClick={this.addCategory}>
        <Icon type='plus'/>
        添加
      </Button>
    )
    this.columns = [
      {
        title: '分类名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        width: 300,
        title: '操作',
        render: (props) => {
          return (
            <span>
              <LinkButton onClick={() => this.updateCategory(props)}>修改分类</LinkButton>
              {this.state.parentId === '0' ? <LinkButton onClick={() => this.showSubCategorys(props)}>查看子分类</LinkButton> : null}
            </span>
          )
        }
      }
    ]
  }
  getcategorys = async (parentId) => {
    parentId = parentId || this.state.parentId
    const res = await reqCategorys(parentId)
    if (res.status === 0) {
      const categorys = res.data
      if (parentId === '0') {
        this.setState({categorys, loading: false})
      } else {
        this.setState({
          subCategorys: categorys,
          loading: false
        })
      }
    } else {
      message.error('数据请求失败, 稍后再试')
    }
  }
  showCategorys = () => {
    this.setState({
      parentId: '0',
      subCategorys: [],
      parentName: ''
    })
  }
  // 为第一次render准备数据
  componentWillMount() {
    this.initColumn()
  }

  componentDidMount() {
    this.getcategorys()
  }

  render() {
    let {loading, categorys, subCategorys, parentId, parentName} = this.state
    let categoryName = this.categoryName || ''
    let title = parentId === '0' ? '一级分类列表' : (
      <span>
        <LinkButton onClick={this.showCategorys}>一级分类列表</LinkButton>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <Icon type='arrow-right' />
        &nbsp;&nbsp;&nbsp;&nbsp;
        <span>{parentName}</span>
      </span>
    )
    return (
      <Card title={title} extra={this.extra}>
        <Table
          loading={loading}
          pagination={{defaultPageSize: 6, showQuickJumper: true}}
          rowKey="_id"
          bordered
          dataSource={parentId === '0' ? categorys : subCategorys}
          columns={this.columns}/>
        <Modal
          visible={this.state.showStatus === 1}
          title="添加分类"
          onOk={this.addCategoryName}
          onCancel={this.handleCancel}
        >
          <AddForm
            setForm={this.setForm}
            categorys={categorys}
            parentId={parentId}/>
        </Modal>
        <Modal
          visible={this.state.showStatus === 2}
          title="更新分类"
          onOk={this.updateCategoryNameOk}
          onCancel={this.handleCancel}
        >
          <Update name={categoryName} setForm={this.setForm}/>
        </Modal>
      </Card>
    )
  }
}

export default Category