import { useState, useEffect } from 'react';
import './index.css';
import WebSiteRender from './serach_system/site_rendering.jsx';

function App() {
    const [tabs, setTabs] = useState([
        { id: 1, url: 'https://example.com', title: 'New Tab' }
    ]);
    const [activeTabId, setActiveTabId] = useState(1);
    const [nextId, setNextId] = useState(2);
    const [windowSize, setWindowSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight
    });

    // ウィンドウサイズの変更を監視
    useEffect(() => {
        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight
            });
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

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

    const closeTab = (tabId) => {
        if (tabs.length === 1) return;
        const newTabs = tabs.filter(tab => tab.id !== tabId);
        setTabs(newTabs);
        if (activeTabId === tabId) {
            setActiveTabId(newTabs[0].id);
        }
    };

    const updateTabUrl = (tabId, newUrl) => {
        setTabs(tabs.map(tab =>
            tab.id === tabId ? { ...tab, url: newUrl, title: newUrl } : tab
        ));
    };

    const activeTab = tabs.find(tab => tab.id === activeTabId);

    const TAB_BAR_HEIGHT = 40;
    const ADDRESS_BAR_HEIGHT = 50;
    const UI_HEIGHT = TAB_BAR_HEIGHT + ADDRESS_BAR_HEIGHT;

    return (
        <div className="browser">
            <div className="tab-bar" style={{ height: `${TAB_BAR_HEIGHT}px` }}>
                {tabs.map(tab => (
                    <div
                        key={tab.id}
                        className={`tab ${tab.id === activeTabId ? 'active' : ''}`}
                        onClick={() => setActiveTabId(tab.id)}
                    >
                        <span className="tab-title">{tab.title}</span>
                        <button
                            className="tab-close"
                            onClick={(e) => {
                                e.stopPropagation();
                                closeTab(tab.id);
                            }}
                        >
                            ×
                        </button>
                    </div>
                ))}
                <button className="tab-new" onClick={addTab}>+</button>
            </div>

            <div className="address-bar" style={{ height: `${ADDRESS_BAR_HEIGHT}px` }}>
                <input
                    type="text"
                    value={activeTab?.url || ''}
                    onChange={(e) => updateTabUrl(activeTabId, e.target.value)}
                    onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                            e.target.blur();
                        }
                    }}
                    placeholder="URLを入力してEnterキー..."
                />
            </div>

            <div className="content">
                {tabs.map(tab => (
                    <WebSiteRender
                        key={tab.id}
                        url={tab.url}
                        x={0}
                        y={UI_HEIGHT}
                        width={windowSize.width}
                        height={windowSize.height - UI_HEIGHT}
                        isActive={tab.id === activeTabId}
                    />
                ))}
            </div>
        </div>
    );
}

export default App;