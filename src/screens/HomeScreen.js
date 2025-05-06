// Fully Revised HomeScreen.js with Aligned Checkboxes and Styled Info Cards

import React, { useState } from 'react';
import {
  SafeAreaView,
  StatusBar,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { FontAwesome5, AntDesign, Feather, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const navigation = useNavigation();
  const today = new Date();
  const month = today.getMonth() + 1;
  const date = today.getDate();
  const days = ['일', '월', '화', '수', '목', '금', '토'];

  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - 3 + i);
    return {
      day: days[d.getDay()],
      date: d.getDate(),
      isToday:
        d.getDate() === today.getDate() &&
        d.getMonth() === today.getMonth() &&
        d.getFullYear() === today.getFullYear(),
      tags: d.getDate() === today.getDate() ? ['약 복용', '병원 방문'] : [],
    };
  });

  const [medicines, setMedicines] = useState([
    { id: 'morning', label: '아침 약 복용하기', desc: ['비타민 C', '감기약'], checked: true },
    { id: 'lunch', label: '점심 약 복용하기', desc: ['감기약'], checked: false },
    { id: 'dinner', label: '저녁 약 복용하기', desc: ['감기약'], checked: false },
  ]);

  const toggleMedicine = id => {
    setMedicines(ms => ms.map(m => (m.id === id ? { ...m, checked: !m.checked } : m)));
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.calendarHeader}>
        <Text style={styles.headerName}>김안하님 <AntDesign name="down" size={10} /></Text>

        {/* 날짜를 절대 위치로 중앙에 배치 */}
        <Text style={styles.headerDate}>{month}월 {date}일, 오늘 <AntDesign name="down" size={10} /></Text>

        <View style={styles.headerIcons}>
          <TouchableOpacity onPress={() => navigation.navigate('Calendar')}>
            <Feather name="calendar" size={22} color="black" style={{ marginRight: 16 }} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="settings-outline" size={22} color="black" />
          </TouchableOpacity>
        </View>
      </View>


      {/* Calendar Row */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.calendar}>
        {weekDates.map((item, i) => (
          <View key={i} style={styles.dayColumn}>
            <Text style={styles.dayText}>{item.day}</Text>
            <View style={[styles.dateCircle, item.isToday && styles.todayCircle]}>
              <Text style={[styles.dateTextCircle, item.isToday && styles.todayText]}>{item.date}</Text>
            </View>
            <View style={styles.tagContainer}>
              {item.tags.includes('약 복용') && <Text style={styles.tagPill}>약 복용</Text>}
              {item.tags.includes('병원 방문') && <Text style={styles.tagVisit}>병원 방문</Text>}
            </View>
          </View>
        ))}
      </ScrollView>

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <TouchableOpacity
          style={styles.visitCard}
          onPress={() => navigation.navigate('VisitDetail')}
        >
          <Text style={styles.visitText}>오늘 병원에 방문하셨어요.</Text>
        </TouchableOpacity>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>약 복용</Text>
          {medicines.map(item => (
            <View key={item.id} style={styles.medicineItem}>
              <View style={styles.pillIcon}>
                <FontAwesome5 name="pills" size={20} color="white" />
              </View>
              <View style={styles.medicineInfo}>
                {item.id === 'morning' && <Text style={styles.grayLabel}>아침 식사 하셨나요?</Text>}
                {item.id === 'lunch' && <Text style={styles.grayLabel}>점심 식사는 하셨나요?</Text>}
                {item.id === 'dinner' && <Text style={styles.grayLabel}>저녁 식사를 잊지 마세요!</Text>}
                <Text style={styles.boldLabel}>{item.label}</Text>
                {item.desc.map((d, j) => <Text key={j} style={styles.descDot}>• {d}</Text>)}
              </View>
              <TouchableOpacity onPress={() => toggleMedicine(item.id)} style={styles.checkboxWrapper}>
                <View style={[styles.checkbox, item.checked && styles.checked]}>
                  {item.checked && <AntDesign name="check" size={16} color="white" />}
                </View>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>지금 나에게 필요한 정보</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {['🤔 지금 먹고 있는 약, 약사에게 말해야 할까?', '💊 이제 안 아픈데, 약 끊어도 될까?'].map((text, i) => (
              <TouchableOpacity key={i} style={styles.infoCard}>
                <Text style={styles.infoCardText}>{text}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  calendarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 16,
    marginBottom: 10,
  },
  headerName: { flex: 1, fontSize: 18, fontWeight: '600', color: '#000' },
  headerDate: {
    position: 'absolute',
    left: '50%',
    transform: [{ translateX: -26 }], // 텍스트 길이에 맞게 조정 (숫자 조절 가능)
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },

  headerIcons: { flexDirection: 'row', alignItems: 'center' },

  calendar: { paddingLeft: 16, paddingVertical: 16 },
  dayColumn: { alignItems: 'center', marginRight: 24 },
  dayText: { fontSize: 15, color: '#2d2d2d', marginBottom: 4 },
  dateCircle: { width: 38, height: 38, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  todayCircle: { backgroundColor: '#424CF2' },
  dateTextCircle: { fontSize: 16, fontWeight: '600' },
  todayText: { color: 'white' },
  tagContainer: { marginTop: 6, alignItems: 'center' },
  tagPill: { backgroundColor: '#FFEAcF', color: '#CC6600', fontSize: 12, paddingHorizontal: 6, borderRadius: 6, marginBottom: 2 },
  tagVisit: { backgroundColor: '#E3F2FD', color: '#005BBB', fontSize: 12, paddingHorizontal: 6, borderRadius: 6 },

  visitCard: { backgroundColor: '#D6EBFF', marginHorizontal: 16, padding: 14, borderRadius: 10, marginBottom: 16 },
  visitText: { color: '#1A1A1A', fontWeight: '900', fontSize: 20 },

  section: { paddingHorizontal: 16, marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 14 },

  medicineItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  pillIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#FF9500', justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  medicineInfo: { flex: 1 },
  grayLabel: { fontSize: 13, color: '#888' },
  boldLabel: { fontSize: 16, fontWeight: 'bold', marginBottom: 2 },
  descDot: { fontSize: 14, color: '#888', marginLeft: 6 },
  checkboxWrapper: { paddingLeft: 8 },
  checkbox: { width: 24, height: 24, borderRadius: 4, borderWidth: 1, borderColor: '#ccc', justifyContent: 'center', alignItems: 'center' },
  checked: { backgroundColor: '#4CD964', borderWidth: 0 },

  infoCard: { backgroundColor: '#FBF8F4', padding: 16, marginRight: 12, borderRadius: 12, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 4, elevation: 2 },
  infoCardText: { fontSize: 14, fontWeight: '500', color: '#333' },
});
