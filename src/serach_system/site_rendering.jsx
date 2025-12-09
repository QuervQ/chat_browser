import { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';

function WebSiteRender({ url, x = 0, y = 100, width = 800, height = 600, isActive = true }) {
  const [webviewLabel, setWebviewLabel] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // URLが変更されるたびにWebviewを再作成
  useEffect(() => {
    if (!url || url === '' || !isActive) {
      // 非アクティブな場合は既存のWebviewを削除
      if (webviewLabel) {
        invoke('destroy_webview', { label: webviewLabel }).catch(console.error);
        setWebviewLabel(null);
      }
      return;
    }

    const loadWebsite = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // 既存のWebviewがあれば削除
        if (webviewLabel) {
          await invoke('destroy_webview', { label: webviewLabel });
        }

        // URLがhttp/httpsで始まらない場合は補完
        let finalUrl = url;
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
          finalUrl = 'https://' + url;
        }

        // 新しいWebviewを作成
        const label = await invoke('create_webview', {
          url: finalUrl,
          x: x,
          y: y,
          width: width,
          height: height
        });
        
        setWebviewLabel(label);
      } catch (err) {
        console.error('Failed to load website:', err);
        setError(err.toString());
      } finally {
        setIsLoading(false);
      }
    };

    loadWebsite();

    // クリーンアップ: コンポーネントがアンマウントされたら削除
    return () => {
      if (webviewLabel) {
        invoke('destroy_webview', { label: webviewLabel }).catch(console.error);
      }
    };
  }, [url, isActive]); // URLまたはアクティブ状態が変わったら再実行

  // 位置やサイズが変更された時の処理
  useEffect(() => {
    if (webviewLabel && isActive) {
      invoke('update_webview_bounds', {
        label: webviewLabel,
        x: x,
        y: y,
        width: width,
        height: height
      }).catch(console.error);
    }
  }, [x, y, width, height, webviewLabel, isActive]);

  return (
    <div style={{ 
      position: 'relative',
      width: `${width}px`, 
      height: `${height}px`,
      backgroundColor: '#f0f0f0'
    }}>
      {isLoading && (
        <div style={{ 
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: '#666',
          fontSize: '14px'
        }}>
          Loading {url}...
        </div>
      )}
      {error && (
        <div style={{ 
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: '#d00',
          fontSize: '14px',
          textAlign: 'center',
          padding: '20px'
        }}>
          Failed to load: {error}
        </div>
      )}
    </div>
  );
}

export default WebSiteRender;