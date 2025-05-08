// src/screens/MedicineRegisterScreen.js
import React, { useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function MedicineRegisterScreen() {
  const navigation = useNavigation();

  // 카메라 권한 요청
  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('권한 필요', '카메라 권한이 필요합니다.');
      }
    })();
  }, []);

  const handleCapture = async (type) => {
    // 카메라 실행(Base64 포함)
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
      quality: 0.8,
      base64: true,
    });

    if (result.cancelled) return;
    const { base64, uri } = result;

    // 1) 로그인 시 저장한 authToken 가져오기
    let token;
    try {
      token = await AsyncStorage.getItem('authToken');
    } catch (e) {
      console.error('AsyncStorage getItem error:', e);
    }

    if (!token) {
      Alert.alert('인증 오류', '로그인 후 이용해 주세요.');
      navigation.replace('Login');
      return;
    }

    // 2) 서버로 사진 전송
    try {
      const response = await fetch(
        'https://c68f-211-198-0-129.ngrok-free.app/api/prescriptions/',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
          },
          body: JSON.stringify({ image: base64 }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      console.log('사진 전송 성공:', data);

      // 3) 서버 응답 후 미리보기 화면 이동
      navigation.navigate('ImagePreview', {
        imageUri: uri,
        captureType: type,
        serverResponse: data,
      });
    } catch (error) {
      console.error('사진 전송 실패:', error);
      Alert.alert('전송 오류', '서버 전송 중 오류가 발생했습니다.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerLeft}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>처방전/약봉투 사진 촬영</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity onPress={() => { }} style={styles.iconButton}>
            <Feather name="calendar" size={24} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Settings')} style={styles.iconButton}>
            <Feather name="settings" size={24} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      {/* BODY */}
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.subtitle}>
          한 번의 사진 촬영으로{"\n"} 자동 약 복용 알람, 약 기록 및 관리까지!
        </Text>

        {/* 처방전 카드 */}
        <TouchableOpacity
          style={styles.card}
          activeOpacity={0.7}
          onPress={() => handleCapture('prescription')}
        >
          <View style={styles.cardTextWrapper}>
            <Text style={styles.cardTitleBig}>처방전</Text>
          </View>
          <Image
            source={require('../../assets/description2.png')}
            style={styles.cardImage}
            resizeMode="contain"
          />
          <Ionicons name="chevron-forward" size={20} color="#666" />
        </TouchableOpacity>

        {/* 약봉투 카드 */}
        <TouchableOpacity
          style={[styles.card, { marginTop: 16 }]}
          activeOpacity={0.7}
          onPress={() => handleCapture('pillbag')}
        >
          <View style={styles.cardTextWrapper}>
            <Text style={styles.cardTitleBig}>약봉투</Text>
          </View>
          <Image
            source={require('../../assets/description1.png')}
            style={styles.cardImage}
            resizeMode="contain"
          />
          <Ionicons name="chevron-forward" size={20} color="#666" />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

// styles 정의
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  headerLeft: {
    marginRight: 16
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600'
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  iconButton: {
    marginLeft: 12
  },
  content: {
    padding: 16
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 16
  },
  cardTextWrapper: {
    flex: 1
  },
  cardTitleBig: {
    fontSize: 20,
    fontWeight: '600'
  },
  cardImage: {
    width: 80,
    height: 80,
    marginHorizontal: 16
  }
});
