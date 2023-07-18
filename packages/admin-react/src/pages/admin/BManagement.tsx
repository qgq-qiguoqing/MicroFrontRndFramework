import React, { useState, useEffect } from 'react'
import Page from '@/components/Page'
import fetch from '@/axios'
import Query from '@/components/query/Query'
import QueryItem from '@/components/query/QueryItem'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons'
import { Table, Button, Spin, Modal, Upload, message, Image } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface'
// import type { UploadChangeParam } from 'antd/es/upload'

const BManagement: React.FC = () => {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploadLoading, setUploadLoading] = useState(false)

  const [showModal, setShowModal] = useState(false)
  const [url, setUrl] = useState('')
  const [fileList, setFileList] = useState<UploadFile[]>([])

  const getBase64 = (img: RcFile, callback: (url: string) => void) => {
    const reader = new FileReader()
    reader.addEventListener('load', () => callback(reader.result as string))
    reader.readAsDataURL(img)
  }
  const handleChange: UploadProps['onChange'] = (info: any) => {
    setFileList([info.file.originFileObj as RcFile])
    if (info.file.status === 'uploading') {
      setLoading(true)
      return
    }

    if (info.file.status === 'done') {
      console.log(info)

      getBase64(info.file.originFileObj as RcFile, (url) => {
        setLoading(false)
        setUrl(info.file.response.data.url)
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
    // const image = new Image()
    // image.src = src
    // const imgWindow = window.open(src)
    // imgWindow?.document.write(image.outerHTML)
  }
  const uploadButton = (
    <div>
      {uploadLoading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  )
  const onUpload = () => {
    setUploadLoading(true)
    fetch({
      api: '/backgroundImage/create',
      para: {
        url: url,
      },
    })
      .then(() => {
        message.success('上传成功')
        setShowModal(false)
        getList()
      })
      .finally(() => {
        setUploadLoading(false)
      })
  }
  const getList = () => {
    setLoading(true)
    fetch({
      api: '/backgroundImage/getList',
    })
      .then((res: any) => {
        if (res.list && res.list.length > 0) {
          setList(res.list)
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }
  const onDelete = (id: number) => {
    setLoading(true)
    fetch({
      api: '/backgroundImage/delete',
      para: {
        id,
      },
    })
      .then(() => {
        setLoading(false)
        message.success('删除成功')
        getList()
      })
      .catch(() => {
        setLoading(false)
      })
  }
  const onStatus = (id: number) => {
    setLoading(true)
    fetch({
      api: '/backgroundImage/setStatus',
      para: {
        id,
      },
    })
      .then(() => {
        setLoading(false)
        message.success('修改成功')
        getList()
      })
      .catch(() => {
        setLoading(false)
      })
  }
  const columns: ColumnsType<any> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '图片',
      dataIndex: 'url',
      key: 'url',
      render: (url) => <Image src={url} width={100} height={100} />,
    },
    {
      title: '上传时间',
      dataIndex: 'createTime',
      key: 'createTime',
    },
    {
      title: '操作',
      key: 'id',
      dataIndex: 'id',
      render: (row, n) => {
        return (
          <div key={row}>
            <Button danger type="link" onClick={() => onDelete(row)}>
              删除
            </Button>
            {!n.isEnable ? (
              <Button type="link" onClick={() => onStatus(row)}>
                启用
              </Button>
            ) : (
              <Button type="link" onClick={() => onStatus(row)}>
                停用
              </Button>
            )}
          </div>
        )
      },
    },
  ]
  useEffect(() => {
    getList()
  }, [])
  return (
    <Page>
      <Modal
        title="上传背景"
        open={showModal}
        onOk={() => onUpload()}
        onCancel={() => setShowModal(false)}>
        <Upload
          onPreview={onPreview}
          name="file"
          listType="picture-card"
          className="avatar-uploader"
          showUploadList={false}
          action="http://localhost:3000/uploadController/upload"
          fileList={fileList}
          accept="image/*"
          onChange={handleChange}>
          {url ? (
            <img src={url} alt="avatar" style={{ width: '100%' }} />
          ) : (
            uploadButton
          )}
        </Upload>
      </Modal>
      <Query
        action={
          <Button
            type="primary"
            onClick={() => {
              setUrl('')
              setShowModal(true)
            }}>
            上传背景
          </Button>
        }></Query>

      <Table
        loading={loading}
        pagination={{ position: [] }}
        columns={columns}
        dataSource={list}></Table>
    </Page>
  )
}
export default BManagement
