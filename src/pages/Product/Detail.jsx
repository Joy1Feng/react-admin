import React, {Component} from 'react'

import {
  Card,
  Icon,
  List
} from 'antd'
import LinkButton from "../../components/LinkButton/LinkButton";

import {BASE_IMG_URL} from '../../utils/constant'
import {reqCategory} from '../../api'

const {Item} = List

class Detail extends Component {
  constructor (props) {
    super(props)
    this.state = {
      cName1: '',
      cName2: '',
    }
  }
  getCategory = async () => {
    const {pCategoryId, categoryId} = this.props.location.state.product
    if (pCategoryId === '0') { //一级分类
      let res = await reqCategory(categoryId)
      let cName1 = res.data.name
      this.setState({cName1})
    } else {
      // 效率太低, 后面一个请求是在前一个请求成功之后才发送
      // let res1 = await reqCategory(categoryId)
      // let res2 = await reqCategory(pCategoryId)
      // let cName1 = res1.data.name
      // let cName2 = res2.data.name
      const res = await Promise.all([reqCategory(pCategoryId), reqCategory(categoryId)])
      let cName1 = res[0].data.name
      let cName2 = res[1].data.name
      this.setState({cName1, cName2})
    }
  }
  componentDidMount () {
    this.getCategory()
  }
  render() {
    const {name, desc, price, detail, imgs} = this.props.location.state.product
    const {cName1, cName2} = this.state
    const title = (
      <span>
        <LinkButton>
          <Icon
            type='arrow-left'
            style={{color: 'green', marginRight: 6, fontSize: 18}}
            onClick={() => this.props.history.goBack()}
          />
        </LinkButton>
        <span>商品详情</span>
      </span>
    )
    return (
      <Card title={title} className='product-detail'>
        <List>
          <Item>
            <span className='left'>商品名称:</span>
            <span className='desc'>{name}</span>
          </Item>
          <Item>
            <span className='left'>商品描述:</span>
            <span>{desc}</span>
          </Item>
          <Item>
            <span className='left'>商品价格:</span>
            <span>{price}元</span>
          </Item>
          <Item>
            <span className='left'>所属分类:</span>
            <span>{cName1}{cName2 ? `--->${cName2}` : ''}</span>
          </Item>
          <Item>
            <span className='left'>商品图片:</span>
            <span>
              {
                imgs.map(img => (
                    <img
                      key={img}
                      className='product-img'
                      src={BASE_IMG_URL + img}
                      alt="img"
                    />
                  )
                )
              }
            </span>
          </Item>
          <Item>
            <span className='left'>商品详情:</span>
            <span dangerouslySetInnerHTML={{__html: detail}}></span>
          </Item>
        </List>
      </Card>
    )
  }
}

export default Detail