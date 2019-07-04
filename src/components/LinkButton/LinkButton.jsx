import React from 'react'

import './Link-Button.less'

export default function LinkButton(props) {
  return <button {...props} className='link-button'>{props.children}</button>
}