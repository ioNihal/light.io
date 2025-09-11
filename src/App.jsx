import { Outlet } from 'react-router-dom'
import './App.css'
import Footer from './components/Footer/Footer'

export default function App() {
  return (
    <>
      <main className="mainContent">
        <Outlet />
      </main>
      <Footer />
    </>

  )
}
