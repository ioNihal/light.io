import { Outlet } from 'react-router-dom'
import './App.css'
import Sidebar from './components/Sidebar/Sidebar'
import ToolsGrid from './components/ToolsGrid/ToolsGrid'
import Topbar from './components/Topbar/Topbar'

export default function App() {
  return (
    <>
      <Sidebar />
      <main className="mainContent">
        <Topbar />
        <Outlet />
      </main>
    </>
  )
}
