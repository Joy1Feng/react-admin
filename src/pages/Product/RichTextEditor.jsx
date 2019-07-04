import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { EditorState, convertToRaw, ContentState } from 'draft-js'
import { Editor } from 'react-draft-wysiwyg'
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'


import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'


class RichTextEditor extends Component {
  static propTypes = {
    detail: PropTypes.string
  }

  constructor(props) {
    super(props);
    const html = this.props.detail
    if (html) {
      const contentBlock = htmlToDraft(html);
      if (contentBlock) {
        const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
        const editorState = EditorState.createWithContent(contentState);
        this.state = {
          editorState,
        };
      }
    } else {
      this.state = {
        editorState: EditorState.createEmpty(),
      }
    }

  }
  
  getDetail = () => {
    return draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))
  }
  
  onEditorStateChange = (editorState) => {
    this.setState({
      editorState,
    })
  }

  render() {
    const { editorState } = this.state
    return (
      <div>
        <Editor
          editorState={editorState}
          editorStyle={{border: '1px solid black', minHeight: 200, paddingLeft: 10}}
          onEditorStateChange={this.onEditorStateChange}
        />
      </div>
    )
  }
}

export default RichTextEditor