import { useState, useEffect } from 'react'

const API = import.meta.env.VITE_API_URL

function App() {
  const [tasks, setTasks] = useState([])
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState('Medium')
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('')

  const fetchTasks = async () => {
    const url = filter ? `${API}/tasks?priority=${filter}` : `${API}/tasks`
    const res = await fetch(url)
    const data = await res.json()
    setTasks(data)
  }

  useEffect(() => { fetchTasks() }, [filter])

  const handleSubmit = async () => {
    if (!title.trim()) { setError('Title cannot be empty'); return }
    setError('')
    const res = await fetch(`${API}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, priority })
    })
    if (res.ok) { setTitle(''); fetchTasks() }
  }

  const handleComplete = async (id) => {
    await fetch(`${API}/tasks/${id}/complete`, { method: 'PUT' })
    fetchTasks()
  }

  return (
    <div style={{ maxWidth: 600, margin: '40px auto', fontFamily: 'sans-serif', padding: '0 20px' }}>
      <h1>Task Planner</h1>

      <div style={{ marginBottom: 20 }}>
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Task title"
          style={{ padding: 8, width: '60%', marginRight: 8 }}
        />
        <select value={priority} onChange={e => setPriority(e.target.value)} style={{ padding: 8, marginRight: 8 }}>
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>
        <button onClick={handleSubmit} style={{ padding: '8px 16px' }}>Add</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>

      <div style={{ marginBottom: 16 }}>
        Filter:&nbsp;
        <select value={filter} onChange={e => setFilter(e.target.value)} style={{ padding: 6 }}>
          <option value=''>All</option>
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>
      </div>

      <h3>Pending</h3>
      {tasks.filter(t => !t.completed).map(t => (
        <div key={t._id} style={{ padding: 10, border: '1px solid #ccc', marginBottom: 8, borderRadius: 4 }}>
          <strong>{t.title}</strong> — {t.priority}
          <button onClick={() => handleComplete(t._id)} style={{ float: 'right', padding: '4px 10px' }}>
            Done
          </button>
        </div>
      ))}

      <h3>Completed</h3>
      {tasks.filter(t => t.completed).map(t => (
        <div key={t._id} style={{ padding: 10, border: '1px solid #aaa', marginBottom: 8, borderRadius: 4, background: '#f5f5f5', color: '#888' }}>
          <s>{t.title}</s> — {t.priority}
        </div>
      ))}
    </div>
  )
}

export default App
