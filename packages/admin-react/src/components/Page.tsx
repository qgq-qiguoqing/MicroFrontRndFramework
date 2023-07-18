import './style/page.css'
function Page({ children, bottom, paging }: any) {
  return (
    <div className="page">
      <div className="pageBody">{children}</div>
      <div className="bottom">
        <div>{bottom}</div>
        <div>{paging}</div>
      </div>
    </div>
  )
}

export default Page
