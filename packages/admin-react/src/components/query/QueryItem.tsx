const QueryItem = ({ children, title }: any) => {
  return (
    <div className="flex align-center justify-center mr-4">
      <div className="shrink w-20 flex align-center justify-center leading-loose	">
        {title}
      </div>
      <div className="shrink-0" style={{ width: '178px' }}>
        {children}
      </div>
    </div>
  )
}
export default QueryItem
