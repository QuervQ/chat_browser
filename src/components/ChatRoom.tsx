import { useEffect, useState, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { Message } from '../types/message'
import { ChatMessage } from './ChatMessage'
import { ChatInput } from './ChatInput'

export function ChatRoom() {
    const [messages, setMessages] = useState<Message[]>([])
    const messagesEndRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        fetchMessages()

        // リアルタイム購読
        const channel = supabase
            .channel('public:messages') // チャンネル名を明示的に指定
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'messages'
                },
                (payload) => {
                    console.log('New message received:', payload) // デバッグ用
                    setMessages((prev) => [...prev, payload.new as Message])
                }
            )
            .subscribe((status) => {
                console.log('Subscription status:', status) // デバッグ用
            })

        return () => {
            supabase.removeChannel(channel)
        }
    }, [])

    // 自動スクロール
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const fetchMessages = async () => {
        const { data, error } = await supabase
            .from('messages')
            .select('*')
            .order('created_at', { ascending: true })

        if (error) {
            console.error('Error fetching messages:', error)
        } else if (data) {
            setMessages(data)
        }
    }

    const sendMessage = async (userName: string, content: string) => {
        const { error } = await supabase
            .from('messages')
            .insert({ user_name: userName, content })

        if (error) {
            console.error('Error sending message:', error)
        }
    }

    return (
        <div className="chat-room">
            <div className="messages">
                {messages.map((msg) => (
                    <ChatMessage key={msg.id} message={msg} />
                ))}
                <div ref={messagesEndRef} />
            </div>
            <ChatInput onSend={sendMessage} />
        </div>
    )
}