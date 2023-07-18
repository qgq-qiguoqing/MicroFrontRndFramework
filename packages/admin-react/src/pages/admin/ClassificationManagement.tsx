import React, { useState, useEffect } from 'react'
import Page from '@/components/Page'
import Query from '@/components/query/Query'
import QueryItem from '@/components/query/QueryItem'
import {
  Input,
  Table,
  Button,
  Pagination,
  Modal,
  Form,
  message,
  Spin,
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import fetch from '@/axios/index'
const Classification: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [loadingTwo, setLoadingTwo] = useState(false)

  // 分页
  const [search, setSearch] = useState({
    pagerIndex: 1,
    pagerSize: 20,
    name: '',
  })
  const [total, setTotal] = useState(0)
  const [list, setList] = useState([]) // 数据
  const [nameID, setNameID] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false) //控制弹窗
  const [title, setTitle] = useState('新增分类') //弹窗标题
  const [name, setName] = useState('') //弹窗内容
  const [isApiLoading, setIsApiLoading] = useState(false)

  // 新增分类
  async function add() {
    if (!name) {
      message.error('请输入分类名称')
      return
    }

    try {
      setLoading(true)
      await fetch({
        api: nameID ? '/classification/update' : '/classification/create',
        para: nameID
          ? {
              nameID,
              name,
            }
          : {
              name,
            },
      })
      setLoading(false)
      setIsModalOpen(false)

      getList()
    } catch (error: any) {
      setLoading(false)
      // message.error('新增失败')
    }
  }
  // 删除分类
  async function del(id: string) {
    try {
      setLoadingTwo(true)
      await fetch({
        api: '/classification/delete',
        para: {
          nameID: id,
        },
      })
      setLoadingTwo(false)
      getList()
    } catch {
      setLoadingTwo(false)
    }
  }
  interface DataType {
    key: React.Key
    name: string
    age: number
    address: string
    tags: string[]
  }
  const columns: ColumnsType<DataType> = [
    {
      title: '分类名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
    },
    {
      title: '操作',
      key: 'nameID',
      dataIndex: 'nameID',
      render: (row) => {
        return (
          <div key={row}>
            <Button
              type="link"
              onClick={() => {
                list.forEach((it: any) => {
                  if (it.nameID == row) {
                    setNameID(row)
                    setName(it.name)
                  }
                })
                setTitle('编辑分类')
                setIsModalOpen(true)
              }}>
              编辑
            </Button>
            <Button danger type="link" onClick={() => del(row)}>
              删除
            </Button>
          </div>
        )
      },
    },
  ]
  async function getList() {
    try {
      setLoadingTwo(true)
      const res: any = await fetch({
        api: '/classification/getList',
        para: {
          ...search,
        },
      })
      setList(res.list)

      setTotal(res.total)
      setLoadingTwo(false)
    } catch (error) {
      setLoadingTwo(false)
      console.error(error)
    }
  }
  useEffect(() => {
    if (!isApiLoading) {
      getList()
      setIsApiLoading(true)
      console.log('111')
    }
  }, [isApiLoading])
  // getList()

  return (
    <Page
      paging={
        <Pagination
          total={total}
          pageSize={search.pagerSize}
          defaultPageSize={search.pagerSize}
          defaultCurrent={search.pagerIndex}
          current={search.pagerIndex}
          onChange={(page, pageSize) => {
            setSearch({
              ...search,
              pagerIndex: page,
              pagerSize: pageSize,
            })
            getList()
          }}
        />
      }>
      <Query
        action={
          <Button
            type="link"
            onClick={() => {
              setName('')
              setNameID('')
              setTitle('新增分类')
              setIsModalOpen(true)
            }}>
            新增
          </Button>
        }
        onSearch={() => {
          setSearch({
            ...search,
            pagerIndex: 1,
            pagerSize: 20,
          })
          getList()
        }}>
        <QueryItem title={'分类名称'}>
          <Input
            placeholder="请输入"
            value={search.name}
            onChange={(e) => {
              setSearch({
                ...search,
                name: e.target.value,
              })
            }}
          />
        </QueryItem>
      </Query>

      <Table
        loading={loadingTwo}
        pagination={{ position: [] }}
        style={{
          height: '100%',
        }}
        columns={columns}
        dataSource={list.map((item: any) => ({ ...item, key: item.nameID }))}
      />

      <Modal
        title={title}
        open={isModalOpen}
        cancelText={'取消'}
        onOk={() => {
          add()
        }}
        onCancel={() => {
          setIsModalOpen(false)
        }}>
        <Spin spinning={loading}>
          <Form.Item label="分类名称">
            <Input
              placeholder="请输入"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
              }}
            />
          </Form.Item>
        </Spin>
      </Modal>
    </Page>
  )
}
export default Classification
