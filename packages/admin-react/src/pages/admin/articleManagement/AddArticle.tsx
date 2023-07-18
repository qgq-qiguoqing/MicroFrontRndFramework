import React, { Component, ChangeEvent, RefObject } from 'react'
import Page from '@/components/Page'
import { Button, Input, message, Spin, Select } from 'antd'
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
  category: any[]
  nameID: string
  id: string | number
  abstract: string
}

class AddArticle extends Component<{}, AddArticleState> {
  private edit: RefObject<any>

  constructor(props: any) {
    super(props)
    this.edit = React.createRef()
    console.log(this.props)

    this.state = {
      loading: false,
      title: '',
      content: '',
      category: [],
      nameID: '',
      id: '',
      abstract: '',
    }
  }

  async getCategory() {
    try {
      let res: any = await fetch({
        api: '/classification/getListAll',
      })
      this.setState({
        category: res.list,
      })
    } catch {}
  }
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
    const { title, content, nameID, abstract } = this.state

    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '')

    if (title.trim().length === 0) {
      message.error('标题不能为空')
      return
    }
    if (content.trim().length === 0) {
      message.error('内容不能为空')
      return
    }
    if (!nameID || !nameID.length) {
      message.error('请选择所属分类')
      return
    }
    if (!abstract) {
      message.error('请输入摘要')
      return
    }
    const name = this.state.category.filter((it) => it.nameID == nameID)[0].name

    if (this.state.id) {
      this.update(userInfo, name)
      return
    }
    try {
      this.setState({ loading: true })
      await fetch({
        api: '/article/add',
        para: {
          title,
          content,
          nameID,
          name,
          authorEmail: userInfo.email,
          author: userInfo.username,
          abstract,
        },
      })
      this.setState({ loading: false })
      message.success('添加成功')
    } catch {
      this.setState({ loading: false })
    }
  }
  getDetails = async (id: string) => {
    this.setState({ loading: true })
    try {
      let res: any = await fetch({
        api: '/article/getDetails',
        para: {
          id,
        },
      })
      this.setState({
        title: res.title,
        content: res.content,
        nameID: res.nameID,
        id: res.id,
        abstract: res.abstract,
      })

      this.setState({ loading: false })
    } catch (error) {
      this.setState({ loading: false })
    }
  }
  update = async (userInfo: any, name: string) => {
    this.setState({ loading: true })
    try {
      // const name = this.state.category.filter(
      //   (it) => it.nameID == this.state.nameID
      // )[0].name

      await fetch({
        api: '/article/update',
        para: {
          id: this.state.id,
          title: this.state.title,
          content: this.state.content,
          nameID: this.state.nameID,
          name: name,
          abstract: this.state.abstract,
          authorEmail: userInfo.email,
          author: userInfo.username,
        },
      })
      this.setState({ loading: false })
      message.success('更新成功')
    } catch (error) {
      this.setState({ loading: false })
    }
  }
  componentDidMount(): void {
    this.getCategory()
    let id = localStorage.getItem('id')
    if (id) {
      this.getDetails(id)
    }
  }
  render() {
    const { loading, title, content, nameID, abstract } = this.state

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
            placeholder="文章标题"
            className="mb-4"
            value={title}
            onChange={(e) => {
              this.setState({ title: e.target.value })
            }}
          />
          <Input
            placeholder="文章摘要"
            className="mb-4"
            value={abstract}
            onChange={(e) => {
              this.setState({ abstract: e.target.value })
            }}
          />
          <Select
            className="mb-4"
            allowClear
            style={{ width: '100%' }}
            placeholder="所属分类"
            defaultValue={nameID}
            value={nameID}
            onChange={(e) => {
              this.setState({
                nameID: e,
              })
            }}
            options={this.state.category.map((it: any) => {
              return {
                value: it.nameID,
                label: it.name,
              }
            })}></Select>
          <ReactQuill
            style={{
              overflow: 'hidden',
              paddingBottom: '60px',
              height: '58vh',
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
