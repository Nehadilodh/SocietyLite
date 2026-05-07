import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'

export default function Navbar() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark'
  })

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [darkMode])

  return (
    <nav className="sticky top-0 bg-white dark:bg-gray-900 shadow-md p-4 z-50 transition-colors duration-300">
      <div className="max-w-6xl mx-auto flex items-center justify-between">

        <h1 className="text-2xl font-heading text-indigo-600 dark:text-indigo-400">
          SocietyLite
        </h1>

        <div className="flex items-center gap-6">
          <Link to="/" className="text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 no-underline transition-colors">Home</Link>
          <Link to="/about" className="text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 no-underline transition-colors">About</Link>
          <Link to="/notice" className="text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 no-underline transition-colors">Notice</Link>
          <Link to="/contact" className="text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 no-underline transition-colors">Contact</Link>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-xl"
          >
            {darkMode? '☀️' : '🌙'}
          </button>

          <Link
            to="/login"
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 no-underline transition-colors"
          >
            Login
          </Link>
        </div>

      </div>
    </nav>
  )
}
