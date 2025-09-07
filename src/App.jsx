import { Outlet } from 'react-router-dom'
import './App.css'
import Topbar from './components/Topbar/Topbar'

export default function App() {
  return (
      <main className="mainContent">
        <Outlet />
      </main>
  )
}
