// src/WebSocketClient.js
import { useEffect, useRef } from 'react';
import { Alert } from 'react-native';
import { WS_BASE } from './constant' ;

/**
 * WebSocket을 통해 알림을 받아 처리하는 커스텀 훅
 * @param {{ token: string, onReceive: (data:any) => void }} props
 */
export function useNotificationSocket({ token, onReceive }) {
    const socketRef = useRef(null);

    useEffect(() => {
        if (!token) return;

        // wss://로 시작하는 WS_BASE 사용
        const WS_URL = `${WS_BASE}/ws/notifications/?token=${token}`;
        const socket = new WebSocket(WS_URL);
        socketRef.current = socket;

        socket.onopen = () => console.log('✅ WS 연결됨', WS_URL);
        socket.onmessage = e => {
            try {
                const data = JSON.parse(e.data);
                onReceive(data);
            } catch (err) {
                console.warn('메시지 파싱 실패', err);
            }
        };
        socket.onerror = e => {
            console.error('WS 에러', e);
            // 필요시 사용자에게도 띄울 수 있습니다.
            // Alert.alert('소켓 에러', String(e));
        };
        socket.onclose = () => console.warn('WS 종료');

        return () => {
            socket.close();
        };
    }, [token, onReceive]);
}
