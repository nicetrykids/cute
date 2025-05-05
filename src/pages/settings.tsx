import { Helmet } from "react-helmet-async"

export default function SettingsPage() {
  return (
    <div className="container">
      <Helmet>
        <title>Settings - ImKhok</title>
      </Helmet>
      <div className="flex flex-col gap-4 py-6">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p>Configure your app settings</p>
      </div>
    </div>
  )
} 