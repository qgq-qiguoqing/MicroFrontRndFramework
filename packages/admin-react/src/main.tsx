import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'

import App from './App.tsx'
import './index.css'
import store from './store/index.ts'
import 'react-quill/dist/quill.snow.css'
if (import.meta.env.DEV) {
  document.domain = 'localhost'
}
// import 'antd/dist/antd.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <Provider store={store}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Provider>
)
