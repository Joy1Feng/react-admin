import React, {Component} from 'react'

import {
  Card,
  Form,
  Input,
  Cascader,
  Button,
  Icon,
  message
} from 'antd'

import LinkButton from "../../components/LinkButton/LinkButton"
import PictureWalls from './PictureWalls'
import RichTextEditor from './RichTextEditor'

import {reqCategorys, reqAddOrUpdateproduct} from '../../api'


const {Item} = Form
const {TextArea} = Input


class AddUpdate extends Component {
  state = {
    options: []
  }
  constructor (props) {
    super(props)
    this.pw = React.createRef()
    this.detail = React.createRef()
  }

  initOptions = async (categorys) => {
    const options = categorys.map(item => ({
      value: item._id,
      label: item.name,
      isLeaf: false
    }))
    // 如果是二级分类商品的更新
    const {isUpdate, product} = this
    const {pCategoryId} = product
    if (isUpdate && pCategoryId !== '0') {
      const subCategorys = await this.getCategorys(pCategoryId)
      // 生成一个二级分类商品的更新
      const childOptions = subCategorys.map(c => ({
        value: c._id,
        label: c.name,
        isLeaf: true
      }))
      const targetOption = options.find(option => option.value === pCategoryId)
      targetOption.children = childOptions
    }

    this.setState({options})

  }

  getCategorys = async (parentId) => {
    const res = await reqCategorys(parentId)
    if (res.status === 0) {
      if (parentId === '0') {
        this.initOptions(res.data)
      } else {
        return res.data //返回二级列表==>当前async函数返回的promise就会成功且value为categorys
      }
    } else {
      message.error('网络错误')
    }
  }

  loadData = async selectedOptions => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;
    const subCategorys = await this.getCategorys(targetOption.value)
    if (subCategorys && subCategorys.length > 0) {
      targetOption.loading = false;
      const childOptions = subCategorys.map(c => ({
        value: c._id,
        label: c.name,
        isLeaf: true
      }))
      targetOption.children = childOptions
    } else { //当前选中的分类没有二级分类
      targetOption.isLeaf = true
      targetOption.loading = false;
    }
    // load options lazily
    this.setState({
      options: [...this.state.options],
    });
  };


  validatorPrice = (rule, value, callback) => {
    if (value * 1 > 0) {
      callback()
    } else {
      callback('价格必须大于0')
    }
  }

  submit = () => {
    this.props.form.validateFields(async (err, values) => {
      console.log('==========', values)
      if (!err) {
        const {name, desc, price, catyegoryIds} = values
        let pCategoryId, categoryId
        if (catyegoryIds.length === 1) {
          pCategoryId = '0'
          categoryId = catyegoryIds[0]
        } else {
          pCategoryId = catyegoryIds[0]
          categoryId = catyegoryIds[1]
        }
        const imgs = this.pw.current.getPictureWallState()
        const detail = this.detail.current.getDetail()
        const product = {name, desc, price, imgs, detail, pCategoryId, categoryId}
        if (this.isUpdate) {
          product._id = this.product._id
        }
        const res = await reqAddOrUpdateproduct(product)
        if (res.status === 0) {
          message.success(`${this.isUpdate ? '更新' : '添加'}商品成功!`)
          this.props.history.goBack()
        } else {
          message.error(`${this.isUpdate ? '更新' : '添加'}商品失败!`)
        }
      }
    })
  }

  componentDidMount() {
    this.getCategorys('0')
  }

  componentWillMount() {
    const product = this.props.location.state
    this.isUpdate = !!product
    this.product = product || {}
  }

  render() {
    const {isUpdate, product} = this
    const {pCategoryId, categoryId, imgs, detail} = product
    const categoryIds = []
    if (isUpdate) {
      if (pCategoryId === '0') {
        categoryIds.push(categoryId)
      } else {
        categoryIds.push(pCategoryId)
        categoryIds.push(categoryId)
      }
    }
    const title = (
      <span>
        <LinkButton onClick={() => this.props.history.goBack()}>
          <Icon type='arrow-left' style={{fontSize: 20}}/>
        </LinkButton>
        <span>{isUpdate ? '修改商品' : '添加商品'}</span>
      </span>
    )
    const formItemLayout = {
      labelCol: {span: 2},
      wrapperCol: {span: 8},
    }
    const {getFieldDecorator} = this.props.form;
    return (
      <Card title={title}>
        <Form {...formItemLayout}>
          <Item label='商品名称'>
            {
              getFieldDecorator('name', {
                initialValue: product.name,
                rules: [
                  {required: true, message: '商品名称必须输入'}
                ]
              })(<Input placeholder='请输入商品名称'/>
              )
            }
          </Item>
          <Item label='商品描述'>
            {
              getFieldDecorator('desc', {
                initialValue: product.desc,
                rules: [
                  {required: true, message: '商品描述必须输入'}
                ]
              })(<TextArea placeholder="请输入商品描述" autosize={{minRows: 2, maxRows: 6}}/>
              )
            }
          </Item>
          <Item label='商品价格'>
            {
              getFieldDecorator('price', {
                initialValue: product.price,
                rules: [
                  {required: true, message: '商品价格必须输入'},
                  {validator: this.validatorPrice}
                ]
              })(<Input
                  type='number'
                  placeholder="请输入商品价格"
                  addonAfter="元"
                />
              )
            }
          </Item>
          <Item label='商品分类'>

            {
              getFieldDecorator('catyegoryIds', {
                initialValue: categoryIds,
                rules: [
                  {required: true, message: '商品分类必须输入'},
                ]
              })(<Cascader
                  options={this.state.options}
                  loadData={this.loadData}
                  placeholder='请选择商品分类'
                />
              )
            }
          </Item>
          <Item label='商品图片'>
            <PictureWalls ref={this.pw} imgs={imgs}/>
          </Item>
          <Item label='商品详情' labelCol={{span: 2}} wrapperCol={{span: 20}} >
            <RichTextEditor ref={this.detail} detail={detail}/>
          </Item>
          <Item>
            <Button type='primary' onClick={this.submit}>提交</Button>
          </Item>
        </Form>
      </Card>
    )
  }
}

export default Form.create()(AddUpdate)