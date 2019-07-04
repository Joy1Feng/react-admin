// 入口js
import React from 'react'
import ReactDom from 'react-dom'
import {LocaleProvider} from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';

import {getUser} from './utils/storageUtils'
import memoryUtils from './utils/memoryUtils'

import App from './App'

moment.locale('zh-cn')

let user = getUser()
memoryUtils.user = user

ReactDom.render(
  <LocaleProvider locale={zh_CN}><App/></LocaleProvider>,
  document.getElementById('root'))