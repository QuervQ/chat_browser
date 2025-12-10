import { useState } from 'react';
import { WebSiteRender } from '../components/WebSiteRender';
import { Link } from 'react-router-dom';

interface Tab {
    id: number;
    url: string;
    title: string;
}

function BrowserPage() {
    const [tabs, setTabs] = useState<Tab[]>([
        { id: 1, url: 'https://example.com', title: 'New Tab' }
    ]);
    const [activeTabId, setActiveTabId] = useState(1);
    const [nextId, setNextId] = useState(2);
    // Use fixed calc or flex instead of window resize listener for simplicity in modern CSS

    // But WebSiteRender expects width/height manually? 
    // Actually my WebSiteRender implementation supports className and internal full width/height 
    // if parent has size.
    // Let's rely on CSS flexbox.

    const addTab = () => {
        const newTab = {
            id: nextId,
            url: 'https://google.com',
            title: 'New Tab'
        };
        setTabs([...tabs, newTab]);
        setActiveTabId(nextId);
        setNextId(nextId + 1);
    };

    const closeTab = (tabId: number) => {
        if (tabs.length === 1) return;
        const newTabs = tabs.filter(tab => tab.id !== tabId);
        setTabs(newTabs);
        if (activeTabId === tabId) {
            setActiveTabId(newTabs[0].id);
        }
    };

    const updateTabUrl = (tabId: number, newUrl: string) => {
        setTabs(tabs.map(tab =>
            tab.id === tabId ? { ...tab, url: newUrl, title: newUrl } : tab
        ));
    };

    const activeTab = tabs.find(tab => tab.id === activeTabId);

    return (
        <div className="browser-page" style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
            <div className="browser-header" style={{ padding: '8px', background: '#e0e0e0', borderBottom: '1px solid #ccc' }}>
                <Link to="/" style={{ marginRight: '10px', textDecoration: 'none' }}>🏠 Home</Link>
                <div className="tab-bar" style={{ display: 'flex', gap: '4px', marginBottom: '8px', overflowX: 'auto' }}>
                    {tabs.map(tab => (
                        <div
                            key={tab.id}
                            className={`tab ${tab.id === activeTabId ? 'active' : ''}`}
                            onClick={() => setActiveTabId(tab.id)}
                            style={{
                                padding: '4px 12px',
                                background: tab.id === activeTabId ? '#fff' : '#ddd',
                                border: '1px solid #999',
                                borderRadius: '4px 4px 0 0',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                maxWidth: '150px'
                            }}
                        >
                            <span className="tab-title" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{tab.title}</span>
                            <button
                                style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontWeight: 'bold' }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    closeTab(tab.id);
                                }}
                            >
                                ×
                            </button>
                        </div>
                    ))}
                    <button onClick={addTab} style={{ padding: '4px 8px' }}>+</button>
                </div>

                <div className="address-bar" style={{ display: 'flex', gap: '8px' }}>
                    <input
                        type="text"
                        value={activeTab?.url || ''}
                        onChange={(e) => updateTabUrl(activeTabId, e.target.value)}
                        placeholder="URL inputted..."
                        style={{ flex: 1, padding: '4px' }}
                    />
                </div>
            </div>

            <div className="browser-content" style={{ flex: 1, position: 'relative' }}>
                {tabs.map(tab => (
                    <WebSiteRender
                        key={tab.id}
                        url={tab.url}
                        isActive={tab.id === activeTabId}
                        width="100%"
                        height="100%"
                        className={tab.id === activeTabId ? 'visible' : 'hidden'}
                    // Pass explicit styles via style prop if needed, but WebSiteRender supports width/height props mapping to style
                    />
                ))}
            </div>

            {/* Inject simple CSS for visible/hidden management if not done via unmounting */}
            <style>{`
                .hidden { display: none !important; }
                .visible { display: flex !important; }
            `}</style>
        </div>
    );
}

export default BrowserPage;
