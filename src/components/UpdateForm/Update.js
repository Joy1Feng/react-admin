import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
  Form,
  Input
} from 'antd'

const {Item} = Form


class Update extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired
  }
  componentDidMount () {
    this.props.setForm(this.props.form)
  }
  render() {
    const {getFieldDecorator} = this.props.form
    return (
      <Form>
        <Item>
          {
            getFieldDecorator('categoryName', {
              initialValue: this.props.name,
              rules: [
                {required: true, message: '分类名称必须输入'}
              ]
            })(<Input placeholder='请输入分类名称'/>
            )
          }
        </Item>
      </Form>
    )
  }
}

export default Form.create()(Update)