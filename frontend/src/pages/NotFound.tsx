import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'

export default function NotFound() {
    useEffect(() => {
        document.body.style.margin = '0';
        document.body.style.padding = '0';
        document.documentElement.style.margin = '0';
        document.documentElement.style.padding = '0';
    }, []);
    const navigate = useNavigate()

    return (
        <div style={{
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#1e1e1e',
            color: '#d4d4d4'
        }}>
            <h1 style={{ fontSize: '6em', margin: 0, color: '#ff5555' }}>404</h1>
            <p style={{ fontSize: '1.5em', marginTop: '20px', color: '#858585' }}>
                ページが見つかりません
            </p>
            <button
                onClick={() => navigate('/')}
                style={{
                    marginTop: '40px',
                    padding: '12px 24px',
                    background: '#ff5555',
                    border: 'none',
                    borderRadius: '4px',
                    color: '#fff',
                    fontSize: '1em',
                    cursor: 'pointer'
                }}
            >
                ホームに戻る
            </button>
        </div>
    )
}