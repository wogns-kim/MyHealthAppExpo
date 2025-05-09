import React from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function PhotoPreviewScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const { imageUri, captureType } = route.params;

    const handleUpload = async () => {
        const token = await AsyncStorage.getItem('authToken');
        if (!token) {
            Alert.alert('인증 오류', '로그인 후 이용해 주세요.');
            navigation.replace('Login');
            return;
        }

        const formData = new FormData();
        formData.append('image', {
            uri: imageUri,
            name: 'photo.jpg',
            type: 'image/jpeg',
        });

        try {
            const res = await fetch('https://309f-165-246-158-4.ngrok-free.app/api/prescriptions/', {
                method: 'POST',
                headers: {
                    Authorization: `Token ${token}`,
                },
                body: formData,
            });

            if (!res.ok) {
                const text = await res.text();
                console.warn('서버 응답 오류:', res.status, text);
                Alert.alert('업로드 실패', `서버 오류: ${res.status}`);
                return;
            }

            const data = await res.json();
            console.log('업로드 성공:', data);
            navigation.navigate('MainTabs', {
                screen: 'MedicineRegister',
                params: {
                    uploaded: true,
                    responseData: data,
                },
            });


        } catch (err) {
            console.error('전송 실패:', err);
            Alert.alert('전송 오류', '서버 전송 중 오류가 발생했습니다.');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* HEADER */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.title}>
                    {captureType === 'pillbag' ? '약봉투 촬영' : '처방전 촬영'}
                </Text>
                <TouchableOpacity
                    onPress={() =>
                        navigation.navigate('MainTabs', {
                            screen: 'MedicineRegister',
                            params: {
                                retake: true,
                                captureType,
                            },
                        })
                    }
                >

                    <Text style={styles.retry}>재촬영</Text>
                </TouchableOpacity>

            </View>

            {/* PHOTO PREVIEW */}
            <View style={styles.imageWrapper}>
                <Image source={{ uri: imageUri }} style={styles.image} resizeMode="contain" />
            </View>

            {/* 완료 버튼 */}
            <TouchableOpacity style={styles.confirmButton} onPress={handleUpload}>
                <Text style={styles.confirmText}>완료</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#333' },
    header: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    title: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
        position: 'absolute',
        left: 0,
        right: 0,
        textAlign: 'center',
    },
    retry: { color: '#fff', fontSize: 14 },
    imageWrapper: {
        flex: 1,
        backgroundColor: '#fff',
        marginHorizontal: 16,
        marginBottom: 16,
        borderRadius: 8,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    confirmButton: {
        width: 200,
        alignSelf: 'center',
        marginBottom: 32,
        backgroundColor: '#3B4FE4',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    confirmText: { color: '#fff', fontSize: 18, fontWeight: '600' },
});
