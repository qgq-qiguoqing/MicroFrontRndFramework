import axios, { AxiosInstance, } from 'axios'
// import QS from 'qs'
import { message } from 'antd'
import { getLocalStorage } from '@/use/index'
// import { useHistory } from 'react-router-dom'
const isPrd: boolean = process.env.NODE_ENV === 'production'
const baseURL: string = isPrd
  ? ''
  : 'http://localhost:3000'

interface IParaOptions {
  api: string
  para?: any
  type?: string
  onUploadProgress?: any
  isBlob?: boolean
  filename?: string
  method?: string
}

const fetch = <T>(
  {
    api,
    para,
    onUploadProgress,
    isBlob,
    type,
    method = 'post',
  }: IParaOptions = {
      api: '',
      type: 'application/json',
    }
) => {
  return new Promise<T>(async (resolve, reject) => {
    // const navigate = useNavigate()
    // if (isRequestInProgress) {
    // reject(new Error('Another request is already in progress.'));
    // return;
    // }

    // if (!getLocalStorage('userInfo')) {
    //   window.location.href = '#/login'
    // }
    let email = getLocalStorage('userInfo')?.email || null
    try {

      const service: AxiosInstance = axios.create({
        baseURL: baseURL,
        method: method,
        headers: {
          'Content-Type': type,
          token:
            window.localStorage.getItem('token') ||
            window.sessionStorage.getItem('userToken'),
        },
      })

      // service.interceptors.request.use(
      //   (config: any) => {
      //     const token: string | null =
      //       window.localStorage.getItem('userToken') ||
      //       window.sessionStorage.getItem('userToken')
      //     config.data = {
      //       ...config.data,
      //       token: token,
      //     }

      //     config.data = QS.stringify(config.data)
      //     return config
      //   },
      //   (error) => {
      //     return Promise.reject(error)
      //   }
      // )
      service.interceptors.response.use((res) => {
        return res
      })
      service.interceptors.request.use((_res) => {
        if (isBlob) {
          _res.responseType = 'blob'
        }
        return _res
      })
      const res: any = await service.request({
        url: api,
        data: { ...para, email },
        onUploadProgress: onUploadProgress,
      })

      const status = res.data.code || res.data.status


      switch (status) {
        case 200:
        case 0:
          if (res.data.msg) {
            message.error(res.data.msg)
          }

          resolve(res.data.data)

          break
        case 1:
          console.log(res.data, 'res.data');

          if (res.data.msg) {
            message.error(res.data.msg)
          }
          reject(res.data)
          break

        case -1:
          message.error(res.data.msg)
          reject(res)
          break
        case 2:
          if (res.data.msg) {
            message.error(res.data.msg)
          } else if (res.data.data && res.data.data.length) {
            // main.manualTip(res.data.data)
          }
          reject(res.data)
          break
        case 3:
          message.error(res.data.msg)
          reject(res.data)
          window.location.href = '#/login'
          window.localStorage.clear()
          // navigate('/login')
          break
        //4是需要后台验证状态，
        //返回的Data，如果有数据，则展示出来
        case 400:
          resolve({
            data: res.data.data,
            status: res.data.status,
          } as T)
          break
        default:
          // Vue.tips({
          //   content:res.data.Message,
          //   type: 'error'
          // }).hide(3000)
          reject(res.data.msg)
      }
    } catch (error) {
      message.error('服务端问题')
      return reject(error)
    } finally {
    }
    // service.interceptors.response.use(
    //   (response: AxiosResponse) => {
    //     if (response.data.code) {
    //       switch (response.data.code) {
    //         case 200:
    //           resolve(response.data)
    //           return response.data
    //         case 401:
    //           // 未登录处理方法
    //           break
    //         case 403:
    //           // token过期处理方法
    //           break
    //         default:
    //           message.error(response.data.msg)
    //           reject(response.data.msg)
    //       }
    //     } else {
    //       return response
    //     }
    //   },
    //   (error) => {
    //     return reject(error)
    //   }
    // )
  })
}
export default fetch