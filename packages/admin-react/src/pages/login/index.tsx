import React, { useState } from 'react'
import { Form, Input, Button, Upload, message } from 'antd'
import { useNavigate } from 'react-router-dom'
import {
  UserOutlined,
  LockOutlined,
  SmileOutlined,
  LoadingOutlined,
  PlusOutlined,
} from '@ant-design/icons'
import ThreeBackground from '@/components/ThreeBackground'
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface'
import type { UploadChangeParam } from 'antd/es/upload'
import fetch from '../../axios/index'
import css from './login.module.css'
import { setLocalStorage } from '@/use/index'
const Login: React.FC = () => {
  const navigate = useNavigate()
  const [key, setKey] = useState(1)
  const onFinish = async () => {
    window.localStorage.clear()
    try {
      const res: any = await fetch({
        api: '/auth/login',

        para: {
          userEmail: userInfo.userEmail,
          password: userInfo.password,
        },
      })
      setLoading(false)

      if (res) {
        setLocalStorage('token', res.token)
        setLocalStorage('userInfo', JSON.stringify(res))
      }

      message.success('登录成功')
      navigate(-1)
    } catch (error) {
      setLoading(false)
    }
  }

  const onFinishTwo = async () => {
    // console.log('Received values of form: ', v)
    setLoading(true)
    try {
      await fetch({
        api: '/user/reg',

        para: userInfo,
      })
      setLoading(false)
      message.success('注册成功')
      setShow(false)
      setUserInfo({
        username: '',
        password: '',
        userEmail: '',
        avatar: '',
      })
      setKey(key + 1)
    } catch {}
  }
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [show, setShow] = useState(false)
  const [userInfo, setUserInfo] = useState({
    username: '',
    password: '',
    userEmail: '',
    avatar: '',
  })

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
      setUserInfo({
        ...userInfo,
        avatar: info.file.response.data.url,
      })
      console.log(userInfo, info.file.response.data.url)
      // Get this url from response in real world.
      getBase64(info.file.originFileObj as RcFile, (url) => {
        setLoading(false)
        setUrl(url)
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
  // 注册

  return (
    <>
      {/* <ThreeBackground></ThreeBackground> */}
      <div className={css['login-container']} key={key}>
        <h2>登录</h2>
        {!show ? (
          <Form
            name="loginForm"
            initialValues={{ remember: true }}
            onFinish={onFinish}>
            <Form.Item
              name="email"
              rules={[
                { required: true, message: '请输入邮箱地址!' },
                { type: 'email', message: '请输入有效的邮箱地址!' },
              ]}>
              <Input
                autoComplete="off"
                value={userInfo.userEmail}
                onChange={(e) =>
                  setUserInfo({ ...userInfo, userEmail: e.target.value })
                }
                prefix={<UserOutlined className={css['site-form-item-icon']} />}
                placeholder="账户"
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[{ required: true, message: '请输入密码!' }]}>
              <Input.Password
                autoComplete="off"
                value={userInfo.password}
                onChange={(e) =>
                  setUserInfo({ ...userInfo, password: e.target.value })
                }
                prefix={<LockOutlined className={css['site-form-item-icon']} />}
                type="password"
                placeholder="密码"
              />
            </Form.Item>
            <Form.Item>
              {/* <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox style={{ color: '#fff' }}>记住我</Checkbox>
              </Form.Item> */}
              <a className={css['login-form-forgot']} href="/">
                忘记密码
              </a>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className={`${css['login-form-button']} bg-indigo-600 hover:bg-indigo-50`}>
                登录
              </Button>
              <div
                onClick={() => {
                  setShow(true)
                  setUserInfo({
                    username: '',
                    password: '',
                    userEmail: '',
                    avatar: '',
                  })
                  setKey(key + 1)
                }}>
                立即注册!
              </div>
            </Form.Item>
          </Form>
        ) : (
          // 注册
          <Form onFinish={onFinishTwo}>
            <Form.Item
              name="email"
              rules={[
                { required: true, message: '请输入邮箱地址!' },
                { type: 'email', message: '请输入有效的邮箱地址!' },
              ]}>
              <Input
                autoComplete="off"
                allowClear
                prefix={<UserOutlined className={css['site-form-item-icon']} />}
                placeholder="邮箱"
                value={userInfo.userEmail}
                onChange={(e) =>
                  setUserInfo({ ...userInfo, userEmail: e.target.value })
                }
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[{ required: true, message: '请输入密码!' }]}>
              <Input
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
                prefix={
                  <SmileOutlined className={css['site-form-item-icon']} />
                }
                placeholder="用户名"
                value={userInfo.username}
                onChange={(e) =>
                  setUserInfo({ ...userInfo, username: e.target.value })
                }
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
                注册
              </Button>
            </Form.Item>
          </Form>
        )}
      </div>
    </>
  )
}

export default Login
