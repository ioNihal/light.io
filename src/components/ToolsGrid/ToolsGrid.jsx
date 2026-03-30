import styles from './ToolsGrid.module.css'
import { tools } from '../../data/tools'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { GrFormNext, GrFormPrevious } from 'react-icons/gr'
import { useTheme } from '../../contexts/ThemeProvider'
import { capitalizeFirstLetter } from '../../utils/formatHelpers.js'
import { CiDark, CiLight } from 'react-icons/ci'
import { BsGithub } from 'react-icons/bs'
import Card from '../Common/Card/Card'
import Button from '../Common/Button/Button'
import Input from '../Common/Input/Input'
import { CgDanger } from 'react-icons/cg'
import { LuTriangleAlert } from 'react-icons/lu'

export default function ToolsGrid() {
  const [currentPage, setCurrentPage] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')

  const navigate = useNavigate()
  const { theme, toggle } = useTheme()

  const itemsPerPage = 9
  const startIdx = currentPage * itemsPerPage

  const filteredTools = [...tools]
    .sort((a, b) => a.title.localeCompare(b.title))
    .filter((tool) => tool.title.toLowerCase().includes(searchTerm.toLowerCase()) || tool.desc.toLowerCase().includes(searchTerm.toLowerCase()))

  const totalPages = Math.ceil(tools.length / itemsPerPage)
  const pageItems = filteredTools.slice(startIdx, startIdx + itemsPerPage)

  const goPrev = () => setCurrentPage((page) => Math.max(page - 1, 0))
  const goNext = () => setCurrentPage((page) => Math.min(page + 1, totalPages - 1))
  const jumpTo = (page) => setCurrentPage(Math.min(Math.max(page, 0), totalPages - 1))

  return (
    <div className={styles.container}>
      <section className={styles.header}>
        <div className={styles.left}>
          <h3>TooLight <span style={
            {
              color: 'orange',
              fontSize: '0.8rem',
              fontFamily: "monospace",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem"
            }
          }><LuTriangleAlert /> Work in Progress</span></h3>
          <div className={styles.btnGroup}>
            <Button variant="ghost" size="sm" onClick={toggle} title={`${capitalizeFirstLetter(theme)} Theme`}>
              <span className={styles.icon}>{theme === 'light' ? <CiLight /> : <CiDark />}</span>
            </Button>
            <Button variant="ghost" size="sm"><BsGithub />&nbsp;Github</Button>
            <Button variant="ghost" size="sm" onClick={() => navigate('/updates')}>Updates</Button>
            <Button variant="ghost" size="sm" onClick={() => navigate('/about')}>About</Button>
            <Button variant="ghost" size="sm" onClick={() => navigate('/')}>Home</Button>
          </div>
        </div>

        <div className={styles.actions}>
          <Input placeholder="Search projects..." value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(0) }} />
          <div className={styles.pagination}>
            <button onClick={goPrev} disabled={currentPage === 0}>
              <GrFormPrevious />
            </button>
            {Array.from({ length: totalPages }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => jumpTo(idx)}
                className={currentPage === idx ? styles.activePage : ''}
              >
                {idx + 1}
              </button>
            ))}
            <button onClick={goNext} disabled={currentPage === totalPages - 1}>
              <GrFormNext />
            </button>
          </div>
        </div>
      </section>

      <div className={styles.grid}>
        {pageItems.map((tool, index) => (
          <Card
            key={startIdx + index}
            icon={tool.icon}
            title={tool.title}
            desc={tool.desc}
            onClick={() => navigate(`/${tool.title.split(' ').join('-').toLowerCase()}`)}
          />
        ))}
      </div>
    </div>
  )
}
