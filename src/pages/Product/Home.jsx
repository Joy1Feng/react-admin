import React, {Component} from 'react'

import {
  Card,
  Select,
  Input,
  Button,
  Icon,
  Table,
  message
} from 'antd'

import {reqProducts, reqSearchProducts, reqUpdateStatus} from '../../api'
import {PAGE_SIZE} from '../../utils/constant'

import LinkButton from "../../components/LinkButton/LinkButton";


const {Option} = Select

class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
      total: 0,
      products: [],
      loading: false,
      searchType: 'productName',
      searchName: ''
    }
  }

  updateStatus = async (productId, status) => {
    const res = await reqUpdateStatus(productId, status)
    if (res.status === 0) {
      message.success('更新商品成功')
      this.getProducts(this.pageNum)
    } else {
      message.error('更新商品失败')
    }
  }

  getProducts = async (pageNum) => {
    this.pageNum = pageNum
    this.setState({loading: true})
    const {searchType, searchName} = this.state
    let res
    if (searchName) {
      res = await reqSearchProducts({pageNum, pageSize: PAGE_SIZE, searchName, searchType})
    } else {
      res = await reqProducts(pageNum, PAGE_SIZE)
    }

    this.setState({loading: false})
    if (res.status === 0) {
      const {total, list} = res.data
      this.setState({
        total,
        products: list
      })
    } else {
      message.error('网络错误')
    }
  }

  componentDidMount() {
    this.getProducts(1)
  }

  // 初始化表格列
  initColumns = () => {
    this.columns = [
      {
        title: '商品名称',
        dataIndex: 'name',
      },
      {
        title: '商品描述',
        dataIndex: 'desc',
      },
      {
        title: '价格',
        dataIndex: 'price',
        render: (price) => "￥" + price
      },
      {
        width: 100,
        title: '状态',
        render: (product) => {
          const {status, _id} = product
          return (
            <span>
              <Button
                type='primary'
                onClick={() => this.updateStatus(_id, status === 1 ? 2 : 1)}
              >
                {status === 1 ? '下架' : '上架'}
                </Button>
              <span>{status === 1 ? '在售' : '已下架'}</span>
            </span>
          )
        }
      },
      {
        width: 100,
        title: '操作',
        render: (product) => {
          return (
            <span>
              <LinkButton onClick={() => this.props.history.push('/product/detail', {product})}>详情</LinkButton>
              <LinkButton onClick={() => this.props.history.push('/product/addupdate', product)}>修改</LinkButton>
            </span>
          )
        }
      },
    ];
  }

  componentWillMount() {
    this.initColumns()  //保证只执行一次
  }

  render() {
    const {products, total, loading, searchType, searchName} = this.state
    const title = (
      <span>
        <Select value={searchType} style={{width: 150}}
                onChange={value => this.setState({searchType: value})}>
          <Option value='productName'>按名称搜索</Option>
          <Option value='productDesc'>按描述搜索</Option>
        </Select>
        <Input
          placeholder='关键字'
          style={{width: 150, margin: '0 15px'}}
          value={searchName}
          onChange={e => this.setState({searchName: e.target.value})}
        />
        <Button type='primary' onClick={() => this.getProducts(1)}>搜索</Button>
      </span>
    )
    const extra = (
      <Button type='primary' onClick={() => this.props.history.push('/product/addupdate')}>
        <Icon type='plus'/>
        添加商品
      </Button>
    )
    return (
      <Card title={title} extra={extra}>
        <Table
          pagination={
            {
              defaultPageSize: PAGE_SIZE,
              showQuickJumper: true,
              total,
              onChange: this.getProducts,
            }
          }
          loading={loading}
          bordered
          dataSource={products}
          columns={this.columns}
          rowKey='_id'
        />;
      </Card>
    )
  }
}

export default Home