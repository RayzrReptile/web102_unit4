import { useState } from 'react'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  // API Key
  const ACCESS_KEY = import.meta.env.VITE_APP_ACCESS_KEY;

  return (
    <div>Hello</div>
  )
}

export default App
