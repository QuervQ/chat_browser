import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'
import { signInWithGoogle, getSession, onAuthStateChange, signOut } from '../lib/supabase'
import '@fortawesome/fontawesome-free/css/all.min.css'
import './HomePage.css'

export default function HomePage() {
    const [session, setSession] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [showAuthMenu, setShowAuthMenu] = useState(false)

    useEffect(() => {
        document.body.style.margin = '0';
        document.body.style.padding = '0';
        document.documentElement.style.margin = '0';
        document.documentElement.style.padding = '0';

        // Check initial session
        const checkSession = async () => {
            try {
                const sess = await getSession()
                setSession(sess)
            } catch (error) {
                console.error('Error checking session:', error)
            } finally {
                setLoading(false)
            }
        }

        checkSession()

        // Listen to auth changes
        const subscription = onAuthStateChange((sess) => {
            setSession(sess)
        })

        return () => {
            subscription?.unsubscribe()
        }
    }, []);

    // 追加: session の変化を監視して email をコンソールに出力
    useEffect(() => {
        if (session?.user?.email) {
            console.log('session.user.email:', session.user.email)
        } else {
            console.log('session is null or no email:', session)
        }
    }, [session])

    // メールアドレスから表示名を作るヘルパー
    const formatNameFromEmail = (email: string) => {
        if (!email) return ''
        const local = email.split('@')[0]
        const cleaned = local.replace(/[._]+/g, ' ')
        const words = cleaned.split(/\s+/).filter(Boolean)
        return words.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
    }

    const displayName = session?.user?.email ? formatNameFromEmail(session.user.email) : null

    const handleGoogleSignIn = async () => {
        try {
            await signInWithGoogle()
        } catch (error) {
            console.error('Sign in failed:', error)
        }
    }

    const handleSignOut = async () => {
        try {
            await signOut()
            setSession(null)
        } catch (error) {
            console.error('Sign out failed:', error)
        }
    }

    if (loading) {
        return <div className="home-container"><p>ローディング中...</p></div>
    }

    return (
        <div className="home-container">
            <div className="home-header">
                <div></div>
                <div className="home-auth-buttons">
                    {session ? (
                        <div className="auth-menu">
                            <button 
                                className="btn-user-icon"
                                onClick={() => setShowAuthMenu(!showAuthMenu)}
                                title={displayName || ''}
                            >
                                <i className="fa-regular fa-circle-user"></i>
                            </button>
                            {showAuthMenu && (
                                <div className="auth-dropdown">
                                    <div className="auth-dropdown-item">{displayName}</div>
                                    <button 
                                        onClick={handleSignOut} 
                                        className="auth-dropdown-item btn-logout"
                                    >
                                        ログアウト
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <button onClick={handleGoogleSignIn} className="btn-user-icon">
                            <i className="fa-regular fa-circle-user"></i>
                        </button>
                    )}
                </div>
            </div>
            <div className="home-content">
                <h1 className="home-title">
                    Synapse
                </h1>
                {session ? (
                    <>
                        <p>ようこそ、{displayName}さん</p>
                        <Link to="/chat" className="btn-primary">
                            チャットルームに入る
                        </Link>
                    </>
                ) : (
                    <p>Googleでログインしてチャットを始めましょう</p>
                )}
            </div>
        </div>
    )
}