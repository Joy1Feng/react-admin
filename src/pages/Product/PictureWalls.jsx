import React from 'react'
import {Upload, Icon, Modal, message} from 'antd'
import PropType from 'prop-types'

import {reqDeleteImg} from '../../api'
import {BASE_IMG_URL} from '../../utils/constant'


function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
  })
}

class PictureWalls extends React.Component {
  static propTypes = {
    imgs: PropType.array
  }
  state = {
    previewVisible: false, // 标识是否显示大图预览
    previewImage: '', //大图的url
    fileList: !this.props.imgs ? [] :
      this.props.imgs.map((item, index) =>
        ({uid: `-${index}`, name: item, status: 'done', url: `
        ${BASE_IMG_URL}${item}`}))
    //   [   //
    //   // {
    //   //   uid: '-1', //每个file都有自己唯一的id
    //   //   name: 'xxx.png', //图片文件名
    //   //   status: 'done', //图片状态done  uploading  removed
    //   //   url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png' //图片地址
    //   // },
    // ],
  }
  getPictureWallState = () => this.state.fileList.map(item => item.name)
  // 关闭Modal 
  handleCancel = () => this.setState({previewVisible: false})

  // 显示
  handlePreview = async file => {
    console.log(file)
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj)
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    })
  }
  //file 当前操作的图片文件(上传/ 删除)
  // fileList 所有已上传图片文件对象的数组
  handleChange = async ({file, fileList}) => {
    if (file.status === 'done') {
     const res = file.response
      if (res.status === 0) {
        message.success('上传图片成功')
        const {url, name} = res.data
        file = fileList[fileList.length - 1]
        file.name = name
        file.url = url
      } else {
        message.error('上传图片失败')
      }
    } else if (file.status === 'removed') {
      const res = await reqDeleteImg(file.name)
      if (res.status === 0) {
        message.success('删除图片成功')
      } else {
        message.error('删除图片失败')
      }
    }
    // 一旦上传成功, 将单签上传的file的信息修正(name, url)

    // 在操作(上传/删除过程中更新filelist的状态)
    this.setState({fileList})
  }

  render() {
    const {previewVisible, previewImage, fileList} = this.state
    const uploadButton = (
      <div>
        <Icon type="plus"/>
        <div className="ant-upload-text">Upload</div>
      </div>
    )
    return (
      <div className="clearfix">
        <Upload
          action="/manage/img/upload" //图片上传的最后地址
          accept='image/*' //接收图片格式
          name='image' //请求参数名
          listType="picture-card"
          fileList={fileList} //所有已上传图片文件对象的数组
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          {fileList.length >= 3 ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{width: '100%'}} src={previewImage}/>
        </Modal>
      </div>
    )
  }
}

export default PictureWalls

