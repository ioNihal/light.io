import styles from './ToolsGrid.module.css'
import { tools } from '../../data/tools'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ToolsGrid() {
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  const navigate = useNavigate();

  const itemsPerPage = 8;
  const startIdx = currentPage * itemsPerPage;

  const goPrev = () => {
    setCurrentPage((p) => Math.max(p - 1, 0));
  };

  const goNext = () => {
    setCurrentPage((p) => Math.min(p + 1, totalPages - 1));
  };

  const jumpTo = (page) => {
    setCurrentPage(Math.min(Math.max(page, 0), totalPages - 1));
  };

  const handleSearchTerm = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(0);
  }

  const filteredTools = [...tools].sort((a,b) => a.title.localeCompare(b.title)).filter(tool => (tool.title.toLowerCase().includes(searchTerm.toLowerCase()) || tool.desc.toLowerCase().includes(searchTerm.toLowerCase())))

  const totalPages = Math.ceil(tools.length / itemsPerPage);
  const pageItems = filteredTools.slice(startIdx, startIdx + itemsPerPage);



  return (
    <div className={styles.container}>
      <div className={styles.actions}>
        <input type="text"
          className={styles.searchInput}
          placeholder="Search projects..."
          value={searchTerm}
          onChange={handleSearchTerm} />
        <div className={styles.pagination}>
          <button onClick={goPrev} disabled={currentPage === 0}>
            Prev
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
            Next
          </button>
        </div>
      </div>
      <div className={styles.grid}>
        {pageItems.map((tool, i) => (
          <div className={styles.card} key={startIdx + i} onClick={() => navigate(`/${tool.title.split(" ").join("-").toLowerCase()}`)}>
            <img className={styles.img} alt={tool.title} src={tools.img || 'thumbnail.png'} width={250} loading='lazy' />
            <div className={styles.title}>{tool.title}</div>
            <div className={styles.desc}>{tool.desc}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
