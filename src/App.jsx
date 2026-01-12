import { Outlet } from 'react-router-dom'
import './App.css'
import Footer from './components/Footer/Footer'
import Sidebar from './components/Sidebar/Sidebar'

export default function App() {
  return (
    <>
      <Sidebar />
      <main className="mainContent">
        <Outlet />
        <Footer />
      </main>
    </>

  )
}
