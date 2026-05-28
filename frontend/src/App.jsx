import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<div className="text-white bg-gray-900 min-h-screen flex items-center justify-center text-2xl">CoachHub — Login próximamente</div>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App