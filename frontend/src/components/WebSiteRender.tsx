import { useState, useEffect, useRef } from 'react';

interface WebSiteRenderProps {
    url: string;
    width?: number | string;
    height?: number | string;
    isActive?: boolean;
    className?: string;
}

export function WebSiteRender({ url, width = 800, height = 600, isActive = true, className }: WebSiteRenderProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const webviewRef = useRef<any>(null); // Type check for webview element is tricky in React

    useEffect(() => {
        const webview = webviewRef.current;
        if (!webview) return;

        const handleStartLoading = () => setIsLoading(true);
        const handleStopLoading = () => setIsLoading(false);
        const handleFailLoad = (e: any) => {
            setIsLoading(false);
            setError(`Failed to load: ${e.errorDescription} (${e.errorCode})`);
        };

        webview.addEventListener('did-start-loading', handleStartLoading);
        webview.addEventListener('did-stop-loading', handleStopLoading);
        webview.addEventListener('did-fail-load', handleFailLoad);

        return () => {
            webview.removeEventListener('did-start-loading', handleStartLoading);
            webview.removeEventListener('did-stop-loading', handleStopLoading);
            webview.removeEventListener('did-fail-load', handleFailLoad);
        };
    }, []);

    if (!isActive) return null;

    let finalUrl = url;
    if (url && !url.startsWith('http://') && !url.startsWith('https://')) {
        finalUrl = 'https://' + url;
    }

    return (
        <div
            className={className}
            style={{
                position: 'relative',
                width: typeof width === 'number' ? `${width}px` : width,
                height: typeof height === 'number' ? `${height}px` : height,
                backgroundColor: '#f0f0f0',
                overflow: 'hidden'
            }}
        >
            {/* 
        webviewTag must be enabled in main process webPreferences. 
        Note: style needs to be fully defined for the webview to take up space.
      */}
            <webview
                ref={webviewRef}
                src={finalUrl}
                style={{ width: '100%', height: '100%', display: 'inline-flex' }}
                allowpopups={true}
            />

            {isLoading && (
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    color: '#666',
                    fontSize: '14px',
                    pointerEvents: 'none'
                }}>
                    Loading...
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
                    padding: '20px',
                    pointerEvents: 'none'
                }}>
                    {error}
                </div>
            )}
        </div>
    );
}
