/**
 * Supabase Realtime Manager
 * カーソル共有、チャット、参加者一覧のリアルタイム通信を管理
 * WebRTC/Electron/Reactと統合可能なモジュール
 */

class SupabaseRealtimeManager {
  constructor(config) {
    // ブラウザ環境
    if (typeof window !== 'undefined' && window.supabase) {
      const { createClient } = window.supabase;
      this.supabase = createClient(config.url, config.key);
    }
    // Node.js環境
    else if (typeof require !== 'undefined') {
      const { createClient } = require('@supabase/supabase-js');
      this.supabase = createClient(config.url, config.key);
    }

    this.roomId = null;
    this.user = null;
    this.channel = null;
    this.messagesChannel = null;
    
    // イベントコールバック
    this.callbacks = {
      onMembersUpdate: () => {},
      onCursorUpdate: () => {},
      onMessageReceived: () => {},
      onMessagesLoaded: () => {},
      onError: () => {},
      onChannelStatus: () => {}
    };
  }

  /**
   * イベントリスナーを登録
   * @param {string} event - イベント名
   * @param {Function} callback - コールバック関数
   */
  on(event, callback) {
    if (this.callbacks[event] !== undefined) {
      this.callbacks[event] = callback;
    }
  }

  /**
   * ルームに参加
   * @param {string} roomId - ルームID
   * @param {Object} user - ユーザー情報 { id, name }
   * @returns {Promise<Object>} 結果オブジェクト
   */
  async joinRoom(roomId, user) {
    this.roomId = roomId;
    this.user = user;

    try {
      // Presenceチャンネルの作成（カーソル＋参加者管理）
      this.channel = this.supabase.channel(`room-${roomId}`);

      // 参加者の同期
      this.channel.on('presence', { event: 'sync' }, () => {
        const state = this.channel.presenceState();
        this.callbacks.onMembersUpdate(state);
      });

      // カーソル更新の受信
      this.channel.on('broadcast', { event: 'cursor' }, (payload) => {
        this.callbacks.onCursorUpdate(payload.payload);
      });

      // チャンネル購読
      await this.channel.subscribe(async (status) => {
        this.callbacks.onChannelStatus({ channel: 'presence', status });
        
        if (status === 'SUBSCRIBED') {
          // プレゼンス情報を送信
          await this.channel.track({ 
            user_id: user.id, 
            name: user.name,
            joined_at: new Date().toISOString()
          });
        }
      });

      // メッセージのRealtime購読（データベース変更監視）
      this.messagesChannel = this.supabase
        .channel(`public:messages:room-${roomId}`)
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `room_id=eq.${roomId}`
        }, (payload) => {
          this.callbacks.onMessageReceived(payload.new);
        })
        .subscribe((status) => {
          this.callbacks.onChannelStatus({ channel: 'messages', status });
        });

      // 既存メッセージの読み込み
      const { data, error } = await this.supabase
        .from('messages')
        .select('*')
        .eq('room_id', roomId)
        .order('created_at', { ascending: true });

      if (error) {
        this.callbacks.onError({ type: 'load_messages', error });
        return { success: false, error };
      }

      if (data) {
        this.callbacks.onMessagesLoaded(data);
      }

      return { success: true, data };

    } catch (err) {
      this.callbacks.onError({ type: 'join_room', error: err });
      return { success: false, error: err };
    }
  }

  /**
   * カーソル位置を送信
   * @param {number} x - X座標（0-1の範囲）
   * @param {number} y - Y座標（0-1の範囲）
   */
  sendCursor(x, y) {
    if (this.channel && this.user) {
      this.channel.send({
        type: 'broadcast',
        event: 'cursor',
        payload: { 
          user_id: this.user.id, 
          x, 
          y, 
          name: this.user.name,
          timestamp: Date.now()
        }
      });
    }
  }

  /**
   * チャットメッセージを送信
   * @param {string} content - メッセージ内容
   * @returns {Promise<Object>} 結果オブジェクト
   */
  async sendMessage(content) {
    if (!this.roomId || !this.user) {
      const error = new Error('Room not joined');
      this.callbacks.onError({ type: 'send_message', error });
      return { success: false, error };
    }

    try {
      const { data, error } = await this.supabase
        .from('messages')
        .insert({
          room_id: this.roomId,
          user_id: this.user.id,
          name: this.user.name,
          content
        })
        .select()
        .single();

      if (error) {
        this.callbacks.onError({ type: 'send_message', error });
        return { success: false, error };
      }

      return { success: true, data };

    } catch (err) {
      this.callbacks.onError({ type: 'send_message', error: err });
      return { success: false, error: err };
    }
  }

  /**
   * プレゼンス情報を更新
   * @param {Object} state - 更新する状態
   */
  async updatePresence(state) {
    if (this.channel) {
      await this.channel.track({
        user_id: this.user.id,
        name: this.user.name,
        ...state
      });
    }
  }

  /**
   * 接続を切断してクリーンアップ
   */
  disconnect() {
    if (this.channel) {
      this.channel.unsubscribe();
      this.channel = null;
    }
    if (this.messagesChannel) {
      this.messagesChannel.unsubscribe();
      this.messagesChannel = null;
    }
  }

  /**
   * 現在の接続状態を取得
   * @returns {Object} 接続状態
   */
  getStatus() {
    return {
      roomId: this.roomId,
      user: this.user,
      isConnected: this.channel !== null && this.messagesChannel !== null
    };
  }
}

// Node.js環境用のエクスポート
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SupabaseRealtimeManager;
}

// ブラウザ環境用のグローバル変数
if (typeof window !== 'undefined') {
  window.SupabaseRealtimeManager = SupabaseRealtimeManager;
}
