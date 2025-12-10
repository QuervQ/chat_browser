import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import ChatPage from './pages/ChatPage'
import NotFound from './pages/NotFound'

function App() {
    return (
        <Routes>
            {/* ホームページ */}
            <Route path="/" element={<HomePage />} />
            
            {/* チャットページ */}
            <Route path="/chat" element={<ChatPage />} />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    )
}

export default App