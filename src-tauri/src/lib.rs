use tauri::Manager;

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

// 新しいWebviewウィンドウを作成する方法（Tauri v2推奨）
#[tauri::command]
fn create_webview(
    app: tauri::AppHandle,
    url: String,
    x: f64,
    y: f64,
    width: f64,
    height: f64,
) -> Result<String, String> {
    let label = format!("webview_{}", std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .unwrap()
        .as_millis());
    
    tauri::WebviewWindowBuilder::new(
        &app,
        &label,
        tauri::WebviewUrl::External(url.parse().map_err(|e| format!("Invalid URL: {}", e))?)
    )
    .title("")
    .decorations(false)  // ウィンドウの装飾を非表示
    .position(x, y)
    .inner_size(width, height)
    .skip_taskbar(true)  // タスクバーに表示しない
    .visible(true)       // 表示
    .build()
    .map_err(|e| e.to_string())?;
    
    Ok(label)
}

// Webviewウィンドウを削除
#[tauri::command]
fn destroy_webview(app: tauri::AppHandle, label: String) -> Result<(), String> {
    if let Some(window) = app.get_webview_window(&label) {
        window.close().map_err(|e| e.to_string())?;
    }
    Ok(())
}

// Webviewウィンドウの位置とサイズを更新
#[tauri::command]
fn update_webview_bounds(
    app: tauri::AppHandle,
    label: String,
    x: f64,
    y: f64,
    width: f64,
    height: f64,
) -> Result<(), String> {
    if let Some(window) = app.get_webview_window(&label) {
        window.set_position(tauri::Position::Physical(tauri::PhysicalPosition { x: x as i32, y: y as i32 }))
            .map_err(|e| e.to_string())?;
        window.set_size(tauri::Size::Physical(tauri::PhysicalSize { width: width as u32, height: height as u32 }))
            .map_err(|e| e.to_string())?;
    }
    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            greet, 
            create_webview, 
            destroy_webview,
            update_webview_bounds
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}