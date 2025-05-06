// AsyncStorage 임포트
import AsyncStorage from '@react-native-async-storage/async-storage';

export const API_BASE = 'https://3c33-14-4-100-15.ngrok-free.app/api';

// 1) 회원가입 (또는 로그인) 함수
export async function registerUser({ username, password }) {
    const res = await fetch(`${API_BASE}/register/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    });
    if (!res.ok) throw new Error(`Register failed: ${res.status}`);
    const { token } = await res.json();
    // 받은 토큰은 AsyncStorage 등에 저장
    await AsyncStorage.setItem('authToken', token);
    return token;
}


// 2) 프로필 생성 함수
export async function createProfile({ name, birth_date, gender, allergies, chronic_diseases }) {
    const token = await AsyncStorage.getItem('authToken');
    if (!token) throw new Error('No auth token');

    const res = await fetch(`${API_BASE}/profile/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
        },
        body: JSON.stringify({
            name,
            birth_date,
            gender,
            allergies,
            chronic_diseases,
        }),
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(`Profile creation failed: ${JSON.stringify(err)}`);
    }
    return await res.json();
}
    
