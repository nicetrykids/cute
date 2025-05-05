import { Helmet } from "react-helmet-async"

export default function LibraryPage() {
  return (
    <div className="container">
      <Helmet>
        <title>Library - ImKhok</title>
      </Helmet>
      <div className="flex flex-col gap-4 py-6">
        <h1 className="text-3xl font-bold">Library</h1>
        <p>View your saved comics</p>
      </div>
    </div>
  )
} 