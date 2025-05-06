import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function MyPageScreen() {
  const navigation = useNavigation();
  const [gender, setGender] = useState(null);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>마이페이지</Text>

        <View style={styles.headerIcons}>
          <TouchableOpacity onPress={() => navigation.navigate('Calendar')}>
            <Feather name="calendar" size={20} color="black" style={styles.iconSpacing} />
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
          <TextInput style={styles.inputHalf} placeholder="이름을 입력해주세요." />
        </View>

        {/* 성별 */}
        <View style={[styles.row, styles.rowHorizontal]}>
          <Text style={styles.label}>성별</Text>
          <View style={styles.genderContainer}>
            {['남성', '여성', '기타'].map((g) => (
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
          <TextInput style={styles.inputHalf} placeholder="생년월일을 입력해주세요." />
        </View>

        {/* 만성질환 */}
        <View style={styles.row}>
          <View style={[styles.rowHorizontal, { alignItems: 'center' }]}>
            <Text style={styles.label}>만성질환</Text>

            {/* ▼ 이 부분만 추가 */}
            <View style={styles.searchContainer}>
              <View style={styles.searchBox}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="다음과 같은 질병으로 진단을 받았어요."
                />
                <Feather name="search" size={16} color="#999" />
              </View>
              <TouchableOpacity style={styles.plusWrapper}>
                <Text style={styles.plus}>＋</Text>
              </TouchableOpacity>
            </View>
            {/* ▲ 여긴 수정 금지 */}
          </View>
        </View>


        {/* 알레르기 */}
        <View style={styles.row}>
          <View style={[styles.rowHorizontal, { alignItems: 'center' }]}>
            <Text style={styles.label}>알레르기</Text>

            <View style={styles.searchContainer}>
              <View style={styles.searchBox}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="나의 약물 알레르기 증상이에요."
                />
                <Feather name="search" size={16} color="#999" />
              </View>
              <TouchableOpacity style={styles.plusWrapper}>
                <Text style={styles.plus}>＋</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    justifyContent: 'space-between',
    borderBottomWidth: 0.5,
    borderColor: '#ddd',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    position: 'absolute',
    left: '50%',
    transform: [{ translateX: -35 }],
  },
  headerIcons: { flexDirection: 'row' },
  iconSpacing: { marginRight: 16 },
  form: { paddingHorizontal: 20, paddingTop: 10, marginTop: 30 },
  row: { marginBottom: 48 },
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
  searchInput: {
    flex: 1,
    fontSize: 14,
  },

  // ▼ 만성질환 + 버튼 중앙정렬용 wrapper
  searchContainer: {
    flex: 1,
    position: 'relative',
  },
  // ▼ plus 버튼만 수정
  plusWrapper: {
    position: 'absolute',
    top: '100%',
    left: '50%',
    transform: [{ translateX: -12 }], // 버튼 너비 절반만큼 왼쪽으로
    marginTop: 8,
  },

  plus: {
    fontSize: 28,
    color: '#3F51B5',
  },
});
