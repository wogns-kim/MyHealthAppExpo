// src/api.js
import AsyncStorage from '@react-native-async-storage/async-storage';

// HTTP 요청용 기본 URL
export const API_BASE = 'https://medsafe-api-devvjccp3q-du.a.run.app/api';

// WebSocket 연결용 기본 URL
export const WS_BASE = 'wss://medsafe-api-devvjccp3q-du.a.run.app';


// ✅ 사용자 등록
export async function registerUser({ username, password }) {
    const url = `${API_BASE}/register/`;
    console.log('registerUser →', url);

    const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    });

    let result = null;
    try {
        result = await res.json(); // 한 번만 읽기
    } catch {
        throw new Error(`Register failed: ${res.status} (JSON 파싱 실패)`);
    }

    if (!res.ok) {
        throw new Error(`Register failed: ${res.status} ${JSON.stringify(result)}`);
    }

    const { token } = result;
    console.log('🗝️ 발급된 토큰:', token);

    await AsyncStorage.setItem('authToken', token);
    console.log('Auth token saved:', token);
    return token;
}


// ✅ 프로필 조회
export async function getProfile() {
    const token = await AsyncStorage.getItem('authToken');
    if (!token) throw new Error('인증 토큰이 없습니다.');

    const url = `${API_BASE}/profile/`;
    console.log('getProfile →', url);

    const res = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
        },
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`프로필 조회 실패: ${res.status} ${text}`);
    }

    return res.json();
}


// ✅ 프로필 생성/업데이트
export async function createProfile(data) {
    const token = await AsyncStorage.getItem('authToken');
    if (!token) throw new Error('인증 토큰이 없습니다.');

    const url = `${API_BASE}/profile/`;

    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
        },
        body: JSON.stringify(data),
    });

    let responseText = '';
    if (!res.ok) {
        const contentType = res.headers.get('content-type');
        try {
            if (contentType && contentType.includes('application/json')) {
                const parsed = await res.json();
                responseText = JSON.stringify(parsed, null, 2);
            } else {
                responseText = await res.text();
            }
        } catch (e) {
            responseText = '(서버 응답 파싱 실패)';
        }

        console.error('🔥 프로필 저장 중 에러:', responseText);
        throw new Error(`Profile creation failed: ${res.status}\n${responseText}`);
    }

    return res.json();
}
