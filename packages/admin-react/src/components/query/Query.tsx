import { Button } from 'antd'

const Query = ({ children, onSearch, action }: any) => {
  return (
    <div className="flex justify-between mb-3">
      <div className="flex flex-wrap	flex-1">{children}</div>
      <div className="w-40">
        {children ? (
          <Button
            type="primary"
            onClick={() => {
              onSearch()
            }}
            style={{ backgroundColor: '#1677ff', marginRight: '5px' }}>
            搜索
          </Button>
        ) : (
          ''
        )}
        {action}
      </div>
    </div>
  )
}
export default Query
