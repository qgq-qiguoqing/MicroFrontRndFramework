import React, { useState, useEffect } from 'react'
import { Form, Input, Button, Upload, message } from 'antd'
import {
  LockOutlined,
  SmileOutlined,
  UserOutlined,
  LoadingOutlined,
  PlusOutlined,
} from '@ant-design/icons'
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface'
import type { UploadChangeParam } from 'antd/es/upload'
import { getLocalStorage } from '@/use/index'
import fetch from '@/axios/index'
import css from '../../login/login.module.css'
const Personal: React.FC = () => {
  const [userInfo, setUserInfo] = useState({
    username: '',
    password: '',
    email: '',
    avatar: '',
  })
  const [loading, setLoading] = useState(false)
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [url, setUrl] = useState('')

  useEffect(() => {
    fetch({
      api: '/user/getUser',
      para: {
        email: getLocalStorage('userInfo').email,
      },
    }).then((res: any) => {
      setUrl(res.avatar)
      setUserInfo({
        username: res.username,
        email: res.email,
        avatar: res.avatar,
        password: '',
      })
      console.log(userInfo)
    })
  }, [])
  const onFinishTwo = async () => {
    // console.log('Received values of form: ', v)
    setLoading(true)
    try {
      await fetch({
        api: '/user/updateUser',

        para: {
          ...userInfo,
          userEmail: getLocalStorage('userInfo').email,
        },
      })
      setLoading(false)
      message.success('修改成功')
    } catch {}
  }

  const getBase64 = (img: RcFile, callback: (url: string) => void) => {
    const reader = new FileReader()
    reader.addEventListener('load', () => callback(reader.result as string))
    reader.readAsDataURL(img)
  }
  const handleChange: UploadProps['onChange'] = (
    info: UploadChangeParam<UploadFile>
  ) => {
    setFileList([info.file.originFileObj as RcFile])
    if (info.file.status === 'uploading') {
      setLoading(true)
      return
    }

    if (info.file.status === 'done') {
      //   setUserInfo({
      //     ...userInfo,
      //     avatar: info.file.response.data.url,
      //   })
      // Get this url from response in real world.
      getBase64(info.file.originFileObj as RcFile, () => {
        setLoading(false)
        setUrl(info.file.response.data.url)
        setUserInfo({
          ...userInfo,
          avatar: info.file.response.data.url,
        })
      })
    }
  }
  const onPreview = async (file: UploadFile) => {
    let src = file.url as string
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader()
        reader.readAsDataURL(file.originFileObj as RcFile)
        reader.onload = () => resolve(reader.result as string)
      })
    }
    const image = new Image()
    image.src = src
    const imgWindow = window.open(src)
    imgWindow?.document.write(image.outerHTML)
  }
  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  )
  return (
    <Form onFinish={onFinishTwo} className="w-2/4">
      <Form.Item
        name="email"
        label={<UserOutlined className={css['site-form-item-icon']} />}>
        {userInfo.email}
      </Form.Item>
      <Form.Item name="password">
        <Input.Password
          autoComplete="off"
          allowClear
          prefix={<LockOutlined className={css['site-form-item-icon']} />}
          type="password"
          placeholder="密码"
          value={userInfo.password}
          onChange={(e) =>
            setUserInfo({ ...userInfo, password: e.target.value })
          }
        />
      </Form.Item>
      <Form.Item
        name="username"
        rules={[{ required: true, message: '请输入用户名' }]}>
        <Input
          autoComplete="off"
          allowClear
          prefix={<SmileOutlined className={css['site-form-item-icon']} />}
          placeholder="用户名"
          value={userInfo.username}
          onChange={(e) => {
            setUserInfo({ ...userInfo, username: e.target.value })
          }}
        />
      </Form.Item>
      <Form.Item label="头像" name="avatar">
        <Upload
          onPreview={onPreview}
          name="file"
          listType="picture-card"
          className="avatar-uploader"
          showUploadList={false}
          action="http://localhost:3000/uploadController/upload"
          fileList={fileList}
          onChange={handleChange}>
          {url ? (
            <img src={url} alt="avatar" style={{ width: '100%' }} />
          ) : (
            uploadButton
          )}
        </Upload>
      </Form.Item>
      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          className={`${css['login-form-button']} bg-indigo-600 hover:bg-indigo-50`}>
          保存
        </Button>
      </Form.Item>
    </Form>
  )
}
export default Personal
