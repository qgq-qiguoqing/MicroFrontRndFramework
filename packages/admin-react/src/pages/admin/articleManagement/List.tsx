import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

import Page from '@/components/Page'
import Query from '@/components/query/Query'
import QueryItem from '@/components/query/QueryItem'
import { Input, Table, Button, Pagination, Select, message } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import fetch from '@/axios/index'
import { useSelector, useDispatch } from 'react-redux'
import { selectNavList, increment } from '@/store/navSlice'
// import { getNav, setNavList } from '@/use/index'
const article: React.FC = () => {
  // 是否是第一次
  const [isFirst, setIsFirst] = useState(false)
  const dispatch = useDispatch()
  const navList = useSelector(selectNavList)
  const columns: ColumnsType<any> = [
    {
      title: '文章标题',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
    },
    {
      title: '所属分类',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '操作',
      key: 'id',
      dataIndex: 'id',
      render: (row, n) => {
        return (
          <div key={row}>
            <Button type="link" onClick={() => onHot(row, n.isHot)}>
              {n.isHot ? '取消热门' : '设为热门'}
            </Button>
            <Button
              type="link"
              onClick={() =>
                goTo(`/admin/article/edit`, '编辑文章', { id: row })
              }>
              编辑
            </Button>
            <Button danger type="link" onClick={() => onDelete(row)}>
              删除
            </Button>
          </div>
        )
      },
    },
  ]
  const navigate = useNavigate()
  const location = useLocation()

  const [loading, setLoading] = useState(false)
  const [category, setCategory] = useState([])
  const [search, setSearch] = useState({
    title: '',
    nameID: [],
    pagerIndex: 1,
    pagerSize: 20,
  })
  const [list, setList] = useState([])
  const [total, setTotal] = useState(0)
  // 新增
  function goTo(api: string, title: string, query?: any) {
    if (query) {
      localStorage.setItem('id', query.id)
    } else {
      localStorage.removeItem('id')
    }
    let nav: any[] = JSON.parse(JSON.stringify(navList))
    let path = nav.map((it: any) => it.path)
    let i = path.indexOf(location.pathname)
    // let url = api.split('?')[0]
    if (path.includes(api)) {
      nav = nav.map((it, index) => {
        if (index === i + 1) {
          it.active = true
        } else {
          it.active = false
        }
        return it
      })
    } else {
      nav = nav.map((it) => {
        it.active = false
        return it
      })
      nav.splice(i + 1, 0, {
        path: api,
        title: title,
        active: true,
        query,
      })
    }
    dispatch(increment([...nav]))
    navigate(api, { state: query, replace: true })
  }
  async function getCategory() {
    try {
      let res: any = await fetch({
        api: '/classification/getListAll',
      })
      setCategory(res.list)
    } catch {}
  }
  async function getList() {
    try {
      setLoading(true)
      let res: any = await fetch({
        api: '/article/getList',
        para: search,
      })
      setList(res.list)
      setTotal(res.total)
      setLoading(false)
    } catch (error: any) {
      setLoading(false)
    }
  }
  async function onDelete(id: number) {
    try {
      setLoading(true)
      await fetch({
        api: '/article/delete',
        para: { id },
      })
      setLoading(false)
      message.success('删除成功')
      getList()
    } catch (error: any) {
      setLoading(false)
    }
  }
  async function onHot(id: number, hot: boolean) {
    try {
      setLoading(true)

      await fetch({
        api: '/article/update',
        para: { id, isHot: !hot },
      })
      setLoading(false)
      message.success('设置成功')
      getList()
    } catch {
      setLoading(false)
    }
  }
  useEffect(() => {
    if (!isFirst) {
      setIsFirst(true)
      getCategory()
      getList()
    }
  }, [isFirst])
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
            onClick={() => goTo('/admin/article/add', '新增文章')}>
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
        <QueryItem title="文章标题">
          <Input
            allowClear
            placeholder="请输入文章标题"
            value={search.title}
            onChange={(e) => {
              setSearch({
                ...search,
                title: e.target.value,
              })
            }}
          />
        </QueryItem>
        <QueryItem title="所属分类">
          <Select
            mode="multiple"
            allowClear
            style={{ width: '100%' }}
            placeholder="请选择分类"
            defaultValue={search.nameID}
            onChange={(e) => {
              setSearch({
                ...search,
                nameID: e,
              })
            }}
            options={category.map((it: any) => {
              return {
                value: it.nameID,
                label: it.name,
              }
            })}></Select>
        </QueryItem>
      </Query>

      <Table
        loading={loading}
        pagination={{ position: [] }}
        style={{
          height: '100%',
        }}
        columns={columns}
        dataSource={list}
      />
    </Page>
  )
}
export default article
