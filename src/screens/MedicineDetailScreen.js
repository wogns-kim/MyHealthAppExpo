// src/screens/TodayMedicationScreen.js
import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function TodayMedicationScreen() {
  const navigation = useNavigation();

  // ── 오늘 날짜 자동 계산 ─────────────────────
  const today = new Date();
  const month = today.getMonth() + 1;
  const date = today.getDate();

  const [category, setCategory] = useState('감기약');
  // 로컬 이미지
  const img1 = require('../../pic/1.png');
  const img2 = require('../../pic/2.png');

  // 예시 데이터
  const medicines = [
    {
      id: '1',
      image: img1,
      times: ['아침', '점심', '저녁'],
      classText: '[기타 진통제]',
      name: '타이레놀8시간이알서방전',
      desc: '해열진통제로, 열을 내리고 통증을 줄여줍니다.',
      info: '1정씩 3회 3일분 · 실온보관(1~30°C)',
      tags: ['간 부담 가능', '음주 금지'],
    },
    {
      id: '2',
      image: img2,
      times: ['아침', '점심', '저녁'],
      classText: '[진해거담제/기침감기약]',
      name: '코대원정',
      desc: '기침, 가래 증상을 완화합니다.',
      info: '1정씩 3회 3일분 · 실온보관(1~30°C)',
      tags: ['운전 및 기계 조작 주의', '졸음 주의'],
    },
    // …
  ];

  const getTagStyle = tag => ({
    backgroundColor: tag.includes('금지') || tag.includes('주의')
      ? '#FF5252'
      : '#3C4CF1',
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* ── HEADER ───────────────────────── */}
      <View style={styles.header}>
        {/* 뒤로가기 */}
        <TouchableOpacity
          style={styles.headerLeft}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>

        {/* 가운데 오늘 날짜 */}
        <Text style={styles.headerTitle} pointerEvents="none">
          {month}월 {date}일, 오늘
        </Text>

        {/* 우측 달력·설정 */}
        <View style={styles.headerRight}>
          <TouchableOpacity
            onPress={() => navigation.navigate("Calendar")}
            style={{ marginRight: 16 }}
          >
            <Feather name="calendar" size={24} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
            <Feather name="settings" size={24} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      {/* ── BODY ─────────────────────────── */}
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>오늘 복용하는 약</Text>

        {/* 카테고리 선택 */}
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={category}
            onValueChange={setCategory}
            style={styles.picker}
            dropdownIconColor="#888"
          >
            <Picker.Item label="감기약" value="감기약" />
            <Picker.Item label="두통약" value="두통약" />
            <Picker.Item label="소화제" value="소화제" />
          </Picker>
        </View>

        {/* 약 리스트 */}
        {medicines.map(item => (
          <View key={item.id} style={styles.card}>
            <Image source={item.image} style={styles.thumbnail} />
            <View style={styles.cardBody}>
              <Text style={styles.times}>{item.times.join(' ')}</Text>
              <Text style={styles.medTitle}>
                <Text style={styles.classText}>{item.classText} </Text>
                {item.name}
              </Text>
              <Text style={styles.description}>{item.desc}</Text>
              <Text style={styles.infoText}>{item.info}</Text>
              <View style={styles.tagsContainer}>
                {item.tags.map((tag, i) => (
                  <View key={i} style={[styles.tag, getTagStyle(tag)]}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  // ── HEADER ─────────────────────────────
  header: {
    height: 56,
    position: 'relative',
    backgroundColor: '#fff',
    borderBottomWidth: 0.5,
    borderColor: '#eee',
    justifyContent: 'center',
  },
  headerLeft: {
    position: 'absolute',
    left: 16,
    top: '50%',
    transform: [{ translateY: -12 }],
  },
  headerTitle: {
    position: 'absolute',
    left: 0, right: 0,
    textAlign: 'center',
    fontSize: 16,
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

  // ── BODY ───────────────────────────────
  content: { paddingHorizontal: 16, paddingTop: 20, paddingBottom: 40 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 20,
  },
  picker: { height: 40 },
  card: { flexDirection: 'row', marginBottom: 20 },
  thumbnail: { width: 40, height: 40, borderRadius: 4 },
  cardBody: { flex: 1, marginLeft: 12 },
  times: { fontSize: 12, color: '#3C4CF1', marginBottom: 4 },
  medTitle: { fontSize: 14, fontWeight: 'bold', marginBottom: 4, color: '#333' },
  classText: { color: '#666', fontWeight: 'normal' },
  description: { fontSize: 13, color: '#555', marginBottom: 4 },
  infoText: { fontSize: 12, color: '#888', marginBottom: 6 },
  tagsContainer: { flexDirection: 'row', flexWrap: 'wrap' },
  tag: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginRight: 6, marginBottom: 6 },
  tagText: { fontSize: 12, color: '#fff' },
});