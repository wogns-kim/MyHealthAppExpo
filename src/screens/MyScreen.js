// src/screens/MyPageScreen.js
import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { registerUser, createProfile } from './constants';

export default function MyPageScreen() {
  const navigation = useNavigation();

  // 입력 state
  const [name, setName] = useState('');
  const [gender, setGender] = useState(null);
  const [birthDate, setBirthDate] = useState('');
  const [tempChronic, setTempChronic] = useState('');
  const [chronicList, setChronicList] = useState([]);
  const [tempAllergy, setTempAllergy] = useState('');
  const [allergyList, setAllergyList] = useState([]);

  const addChronic = () => {
    const t = tempChronic.trim();
    if (t) {
      setChronicList(prev => [...prev, t]);
      setTempChronic('');
    }
  };
  const addAllergy = () => {
    const t = tempAllergy.trim();
    if (t) {
      setAllergyList(prev => [...prev, t]);
      setTempAllergy('');
    }
  };

  // 회원가입 + 프로필 생성
  const onRegisterAndCreateProfile = async () => {
    try {
      const token = await registerUser({ username: 'jeowig', password: 'password123' });
      await createProfile({
        name,
        birth_date: birthDate,
        gender: gender === '남성' ? 'M' : gender === '여성' ? 'F' : 'O',
        chronic_diseases: chronicList,
        allergies: allergyList,
      });
      Alert.alert('🎉 완료', '회원가입과 프로필 생성이 모두 완료되었습니다.');
      // Tab 네비게이터 안의 Home으로 이동
      navigation.navigate('MainTabs', { screen: 'Home' });
    } catch (e) {
      console.warn(e);
      Alert.alert('🚨 오류', e.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* ── HEADER ───────────────────────── */}
      <View style={styles.header}>
        {/* 좌측 뒤로가기 → MainTabs의 Home 탭으로 이동 */}
        <TouchableOpacity
          style={styles.headerLeft}
          onPress={() => navigation.navigate('MainTabs', { screen: 'Home' })}
        >
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>

        {/* 가운데 타이틀 */}
        <Text style={styles.headerTitle} pointerEvents="none">마이페이지</Text>

        {/* 우측 아이콘 */}
        <View style={styles.headerRight}>
          <TouchableOpacity
            onPress={() => navigation.navigate('Calendar')}
            style={{ marginRight: 16 }}
          >
            <Feather name="calendar" size={20} color="black" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
            <Ionicons name="settings-outline" size={20} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.form}>
        {/* 이름 */}
        <View style={[styles.row, styles.rowHorizontal]}>
          <Text style={styles.label}>이름</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            style={styles.inputHalf}
            placeholder="이름을 입력해주세요."
          />
        </View>

        {/* 성별 */}
        <View style={[styles.row, styles.rowHorizontal]}>
          <Text style={styles.label}>성별</Text>
          <View style={styles.genderContainer}>
            {['남성', '여성', '기타'].map(g => (
              <TouchableOpacity
                key={g}
                onPress={() => setGender(g)}
                style={[
                  styles.genderButton,
                  gender === g && styles.genderSelected,
                ]}
              >
                <Text style={{ color: gender === g ? '#000' : '#999' }}>{g}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 생년월일 */}
        <View style={[styles.row, styles.rowHorizontal]}>
          <Text style={styles.label}>생년월일</Text>
          <TextInput
            value={birthDate}
            onChangeText={setBirthDate}
            style={styles.inputHalf}
            placeholder="YYYY-MM-DD"
          />
        </View>

        {/* 만성질환 */}
        <View style={styles.row}>
          <View style={[styles.rowHorizontal, { alignItems: 'center' }]}>
            <Text style={styles.label}>만성질환</Text>
            <View style={styles.searchContainer}>
              <View style={styles.searchBox}>
                <TextInput
                  value={tempChronic}
                  onChangeText={setTempChronic}
                  style={styles.searchInput}
                  placeholder="병명 입력"
                />
                <Feather name="search" size={16} color="#999" />
              </View>
              <TouchableOpacity style={styles.plusWrapper} onPress={addChronic}>
                <Text style={styles.plus}>＋</Text>
              </TouchableOpacity>
            </View>
          </View>
          {chronicList.map((it, i) => (
            <Text key={i} style={styles.listItem}>• {it}</Text>
          ))}
        </View>

        {/* 알레르기 */}
        <View style={styles.row}>
          <View style={[styles.rowHorizontal, { alignItems: 'center' }]}>
            <Text style={styles.label}>알레르기</Text>
            <View style={styles.searchContainer}>
              <View style={styles.searchBox}>
                <TextInput
                  value={tempAllergy}
                  onChangeText={setTempAllergy}
                  style={styles.searchInput}
                  placeholder="알레르기 입력"
                />
                <Feather name="search" size={16} color="#999" />
              </View>
              <TouchableOpacity style={styles.plusWrapper} onPress={addAllergy}>
                <Text style={styles.plus}>＋</Text>
              </TouchableOpacity>
            </View>
          </View>
          {allergyList.map((it, i) => (
            <Text key={i} style={styles.listItem}>• {it}</Text>
          ))}
        </View>

        {/* 완료 버튼 */}
        <TouchableOpacity
          style={styles.saveButton}
          onPress={onRegisterAndCreateProfile}
        >
          <Text style={styles.saveButtonText}>완료</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  // ── HEADER 스타일 ───────────────────────
  header: {
    height: 56,
    position: 'relative',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderBottomWidth: 0.5,
    borderColor: '#ddd',
  },
  headerLeft: {
    position: 'absolute',
    left: 16,
    top: '50%',
    transform: [{ translateY: -12 }],
  },
  headerTitle: {
    position: 'absolute',
    left: 0, right: 0,   // 화면 끝까지 늘려서
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  headerRight: {
    position: 'absolute',
    right: 16,
    top: '50%',
    transform: [{ translateY: -12 }],
    flexDirection: 'row',
    alignItems: 'center',
  },

  /* … 이하 기존 스타일 유지 … */
  form: { paddingHorizontal: 20, paddingTop: 10, marginTop: 30 },
  row: { marginBottom: 24 },
  rowHorizontal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 15,
    fontWeight: 'bold',
    width: 90,
    marginRight: 16,
  },
  inputHalf: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
  },
  genderContainer: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'flex-end',
  },
  genderButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginLeft: 8,
  },
  genderSelected: {
    borderColor: '#000',
    backgroundColor: '#eee',
  },
  searchContainer: { flex: 1, position: 'relative' },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flex: 1,
  },
  searchInput: { flex: 1, fontSize: 14 },
  plusWrapper: {
    position: 'absolute',
    top: '100%',
    left: '50%',
    transform: [{ translateX: -12 }],
    marginTop: 8,
  },
  plus: { fontSize: 28, color: '#3F51B5' },
  listItem: {
    marginLeft: 106,
    marginTop: 4,
    color: '#555',
  },
  saveButton: {
    backgroundColor: '#3C4CF1',
    padding: 14,
    borderRadius: 8,
    marginTop: 30,
    alignItems: 'center',
  },
  saveButtonText: { color: '#fff', fontSize: 16 },
});