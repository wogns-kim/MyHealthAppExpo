// src/api/auth.js
import AsyncStorage from '@react-native-async-storage/async-storage';

// API_BASE를 /api로 지정하여 엔드포인트 중복 제거
export const API_BASE = 'https://c68f-211-198-0-129.ngrok-free.app/api';

export async function registerUser({ username, password }) {
    const url = `${API_BASE}/register/`;
    console.log('registerUser →', url);

    const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    });
    if (!res.ok) {
        let errJson = null;
        try { errJson = await res.json(); } catch { };
        throw new Error(`Register failed: ${res.status} ${JSON.stringify(errJson)}`);
    }

    const { token } = await res.json();
    // 토큰을 AsyncStorage에 저장
    await AsyncStorage.setItem('authToken', token);
    return token;
}


export async function createProfile({ name, birth_date, gender, allergies, chronic_diseases }) {
    const token = await AsyncStorage.getItem('authToken');
    if (!token) throw new Error('No auth token');

    const url = `${API_BASE}/profile/`;
    console.log('createProfile →', url);

    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,  // DRF TokenAuthentication 사용 시
            // JWT/Bearer 방식이면 'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name, birth_date, gender, allergies, chronic_diseases }),
    });

    if (!res.ok) {
        let errJson = null;
        try { errJson = await res.json(); } catch { };
        throw new Error(`Profile creation failed: ${res.status} ${JSON.stringify(errJson)}`);
    }

    return await res.json();
}
