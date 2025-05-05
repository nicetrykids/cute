import { Helmet } from "react-helmet-async"

export default function ComicsPage() {
  return (
    <div className="container">
      <Helmet>
        <title>Comics - ImKhok</title>
      </Helmet>
      <div className="flex flex-col gap-4 py-6">
        <h1 className="text-3xl font-bold">Comics</h1>
        <p>Browse all comics</p>
      </div>
    </div>
  )
} 