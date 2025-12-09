import { useState } from 'react';
import './App.css';

function App() {
    const [tabs, setTabs] = useState([
        { id: 1, url: 'https://www.google.com', title: 'New Tab' }
    ]);
    const [activeTabId, setActiveTabId] = useState(1);
    const [nextId, setNextId] = useState(2);

    // 新しいタブを追加
    const addTab = () => {
        const newTab = {
            id: nextId,
            url: 'https://www.google.com',
            title: 'New Tab'
        };
        setTabs([...tabs, newTab]);
        setActiveTabId(nextId);
        setNextId(nextId + 1);
    };

    // タブを閉じる
    const closeTab = (tabId) => {
        if (tabs.length === 1) return; // 最後のタブは閉じない

        const newTabs = tabs.filter(tab => tab.id !== tabId);
        setTabs(newTabs);

        // 閉じたタブがアクティブだった場合、隣のタブをアクティブに
        if (activeTabId === tabId) {
            setActiveTabId(newTabs[0].id);
        }
    };

    // URLを変更
    const updateTabUrl = (tabId, newUrl) => {
        setTabs(tabs.map(tab =>
            tab.id === tabId ? { ...tab, url: newUrl, title: newUrl } : tab
        ));
    };

    const activeTab = tabs.find(tab => tab.id === activeTabId);

    return (
        <div className="browser">
            {/* タブバー */}
            <div className="tab-bar">
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
                <button className="tab-new" onClick={addTab}>
                    +
                </button>
            </div>

            {/* アドレスバー */}
            <div className="address-bar">
                <input
                    type="text"
                    value={activeTab?.url || ''}
                    onChange={(e) => updateTabUrl(activeTabId, e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            // Enterキーでページ遷移（後で実装）
                            console.log('Navigate to:', e.target.value);
                        }
                    }}
                    placeholder="URLを入力..."
                />
            </div>

            {/* コンテンツエリア */}
            <div className="content">
                {tabs.map(tab => (
                    <div
                        key={tab.id}
                        className={`webview ${tab.id === activeTabId ? 'active' : ''}`}
                    >
                        <iframe
                            src={tab.url}
                            title={tab.title}
                            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default App;