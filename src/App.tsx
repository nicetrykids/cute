import { ThemeProvider } from 'next-themes'
import './App.css'
import { RouterProvider } from 'react-router'
import { AppRouter } from './routers/router'
import { ReactQueryProvider } from './api/react-query/ReactQueryProvider'

function App() {

  return (
    <ReactQueryProvider>
      <ThemeProvider attribute="class" defaultTheme="system" storageKey="vite-ui-theme"
        themes={[
          'light', 'dark',
          'light-red', 'light-rose', 'light-orange', 'light-green', 'light-blue', 'light-yellow', 'light-violet',
          'dark-red', 'dark-rose', 'dark-orange', 'dark-green', 'dark-blue', 'dark-yellow', 'dark-violet'
        ]} >
        <RouterProvider router={AppRouter} />
      </ThemeProvider>
    </ReactQueryProvider>
  )
}

export default App
