import React, { Component, ChangeEvent, RefObject } from 'react'
import Page from '@/components/Page'
import { Button, Input, message, Spin } from 'antd'
import ReactQuill, { Quill } from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import fetch from '@/axios'
import QuillResize, { PlaceholderRegister } from 'quill-resize-module'
Quill.register('modules/resize', QuillResize)
PlaceholderRegister()
interface AddArticleState {
  loading: boolean
  title: string
  content: string
}

class AddArticle extends Component<{}, AddArticleState> {
  private edit: RefObject<any>
  private contentRef: RefObject<string>

  constructor(props: {}) {
    super(props)
    this.edit = React.createRef()
    this.contentRef = React.createRef()
    this.state = {
      loading: false,
      title: '',
      content: '',
    }
  }
  componentDidMount(): void {}
  handleChange = (value: string) => {
    this.setState({ content: value })
  }

  handleVideo = () => {
    this.handleFileUpload('video/*')
  }

  onHandleImage = () => {
    this.handleFileUpload()
  }

  handleFileUpload = async (accept?: string) => {
    const input = document.createElement('input')
    input.setAttribute('type', 'file')
    input.setAttribute('multiple', 'true')
    input.setAttribute('accept', accept || 'image/*')
    input.onchange = async () => {
      const file = [...(input.files || [])]
      const formData = new FormData()
      file.forEach((item) => {
        formData.append('file', item)
      })
      if (file.length) {
        try {
          this.setState({ loading: true })
          const res: any = await fetch({
            api: 'uploadController/upload',
            para: formData,
            type: 'multipart/form-data',
          })
          this.insertFileToEditor(res.url, accept)
          this.setState({ loading: false })
        } catch (error) {
          this.setState({ loading: false })
        }
      }
    }
    input.click()
  }

  insertFileToEditor = (url: string, accept?: string) => {
    const quill = this.edit.current?.getEditor()
    const range = quill?.getSelection()?.index || 0

    if (this.edit.current) {
      if (accept) {
        quill?.insertEmbed(range, 'video', url) // 插入视频
      } else {
        quill?.insertEmbed(range, 'image', url) // 插入图片
      }

      quill?.setSelection(range + 1)
    }
  }

  handleUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = [...e.target.files!]
    const formData = new FormData()
    file.forEach((item) => {
      formData.append('file', item)
    })
  }

  onSave = async () => {
    const { title, content } = this.state
    if (title.trim().length === 0) {
      message.error('标题不能为空')
      return
    }
    if (content.trim().length === 0) {
      message.error('内容不能为空')
      return
    }
    try {
      this.setState({ loading: true })
      await fetch({
        api: '/article/add',
        para: {
          title,
        },
      })
      this.setState({ loading: false })
    } catch {
      this.setState({ loading: false })
    }
  }

  render() {
    const { loading, title, content } = this.state

    return (
      <Page
        bottom={
          <Button type="primary" onClick={this.onSave}>
            保存
          </Button>
        }>
        <input
          style={{ display: 'none' }}
          type="file"
          onChange={this.handleUpload}
          multiple={true}
        />
        <Spin spinning={loading}>
          <Input
            placeholder="请输入标题"
            className="mb-4"
            value={title}
            onChange={(e) => {
              this.setState({ title: e.target.value })
            }}
          />

          <ReactQuill
            style={{
              overflow: 'hidden',
              paddingBottom: '60px',
              height: '63vh',
            }}
            placeholder="请输入内容"
            ref={this.edit}
            theme="snow"
            value={content}
            onChange={this.handleChange}
            modules={this.getModules()}
            preserveWhitespace
          />
        </Spin>
      </Page>
    )
  }

  getModules = () => ({
    toolbar: {
      container: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ color: [] }, { background: [] }],
        [
          { list: 'ordered' },
          { list: 'bullet' },
          { indent: '-1' },
          { indent: '+1' },
          { align: ['center', 'right', 'justify'] },
        ],
        ['link', 'image', 'video'],
        [{ image: ['small', 'medium', 'large'] }],
        [{ header: 1 }, { header: 2 }],
      ],
      handlers: { image: this.onHandleImage, video: this.handleVideo },
    },
    resize: {
      modules: ['Resize', 'DisplaySize', 'Toolbar'],
    },
  })
}

export default AddArticle
