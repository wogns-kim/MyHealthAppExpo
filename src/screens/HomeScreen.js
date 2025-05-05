// src/screens/HomeScreen.js
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
import { Ionicons, FontAwesome5, AntDesign, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const navigation = useNavigation();
  const today = new Date();
  const month = today.getMonth() + 1;
  const date = today.getDate();
  const days = ['일','월','화','수','목','금','토'];

  // 주간 날짜 배열
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
    };
  });

  // 체크박스 상태
  const [medicines, setMedicines] = useState([
    { id: 'morning', label: '아침 약 복용하기', checked: true },
    { id: 'lunch',   label: '점심 약 복용하기', checked: false },
    { id: 'dinner',  label: '저녁 약 복용하기', checked: false },
  ]);
  const toggleMedicine = id => {
    setMedicines(ms =>
      ms.map(m => m.id === id ? { ...m, checked: !m.checked } : m)
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{month}월 {date}일, 오늘 ▾</Text>
          <View style={styles.notificationIcon}>
            <Ionicons name="notifications-outline" size={28} color="black" />
            <View style={styles.notificationBadge} />
          </View>
        </View>

        {/* Calendar */}
        <TouchableOpacity onPress={() => navigation.navigate('Calendar')}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.calendar}
          >
            {weekDates.map((item, i) => (
              <View key={i} style={styles.dayColumn}>
                <Text style={styles.dayText}>{item.day}</Text>
                <View style={[styles.dateCircle, item.isToday && styles.todayCircle]}>
                  <Text style={[styles.dateText, item.isToday && styles.todayText]}>
                    {item.date}
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </TouchableOpacity>

        {/* Cards */}
        <View style={styles.cardContainer}>
          <TouchableOpacity
            style={[styles.card, styles.medicineCard]}
            onPress={() => navigation.navigate('VisitDetail')}
          >
            <Text style={styles.cardText}>오늘 복용할 약이 있어요.</Text>
            <MaterialIcons name="chevron-right" size={24} color="#8a8a8a" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.card, styles.hospitalCard]}
            onPress={() => navigation.navigate('VisitDetail')}
          >
            <Text style={styles.cardText}>오늘 병원에 방문하셨어요.</Text>
            <MaterialIcons name="chevron-right" size={24} color="#8a8a8a" />
          </TouchableOpacity>
        </View>

        {/* Medicine Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>약 복용</Text>
          {medicines.map(item => (
            <View key={item.id} style={styles.medicineItem}>
              <View style={styles.pillIconContainer}>
                <FontAwesome5 name="pills" size={20} color="white" />
              </View>
              <Text style={styles.medicineText}>{item.label}</Text>
              <TouchableOpacity
                style={[
                  styles.checkbox,
                  item.checked ? styles.checkboxChecked : styles.checkboxUnchecked
                ]}
                onPress={() => toggleMedicine(item.id)}
              >
                {item.checked && <AntDesign name="check" size={16} color="white" />}
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* ← 여기서부터 다시 추가 */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>병원 및 복약 기록</Text>
          <TouchableOpacity
            style={styles.addRecordButton}
            onPress={() => navigation.navigate('MedicineRegister')}
          >
            <View style={styles.addIconContainer}>
              <AntDesign name="plus" size={20} color="#8a8a8a" />
            </View>
            <View style={styles.addRecordTextContainer}>
              <Text style={styles.addRecordText}>간편 처방전 등록하기</Text>
              <Text style={styles.addRecordSubText}>약 봉투도 가능해요.</Text>
            </View>
          </TouchableOpacity>
        </View>
        {/* 추가 끝 */}

        {/* Info Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>지금 나에게 필요한 정보</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.infoCardsContainer}
          >
            {['🤔','💊','📏'].map((emoji,i) => (
              <TouchableOpacity key={i} style={styles.infoCard}>
                <Text style={styles.infoCardEmoji}>{emoji}</Text>
                <Text style={styles.infoCardText}>예시 정보 텍스트</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:           { flex: 1, backgroundColor: '#fff' },
  header:              { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding:16 },
  headerTitle:         { fontSize: 20, fontWeight: 'bold' },
  notificationIcon:    { position: 'relative' },
  notificationBadge:   { position: 'absolute', top: 0, right: 0, backgroundColor:'red', width:8, height:8, borderRadius:4 },

  calendar:            { paddingLeft:16, paddingVertical:8 },
  dayColumn:           { alignItems: 'center', marginRight:24, width:40 },
  dayText:             { fontSize:14, color:'#8a8a8a', marginBottom:4 },
  dateCircle:          { width:36, height:36, borderRadius:18, justifyContent:'center', alignItems:'center' },
  todayCircle:         { backgroundColor:'#4475F2' },
  dateText:            { fontSize:18, fontWeight:'bold' },
  todayText:           { color:'white' },

  cardContainer:       { paddingHorizontal:16, marginBottom:16 },
  card:                { flexDirection:'row', justifyContent:'space-between', alignItems:'center', padding:16, borderRadius:12, marginBottom:8 },
  medicineCard:        { backgroundColor:'#FFF3E0' },
  hospitalCard:        { backgroundColor:'#E3F2FD' },
  cardText:            { fontSize:16, fontWeight:'bold' },

  sectionContainer:    { marginBottom:16, paddingHorizontal:16 },
  sectionTitle:        { fontSize:18, fontWeight:'bold', marginBottom:12 },

  medicineItem:        { flexDirection:'row', alignItems:'center', marginBottom:12 },
  pillIconContainer:   { width:40, height:40, borderRadius:20, backgroundColor:'#FF9500', justifyContent:'center', alignItems:'center', marginRight:12 },
  medicineText:        { flex:1, fontSize:16 },
  checkbox:            { width:24, height:24, borderRadius:4, justifyContent:'center', alignItems:'center' },
  checkboxChecked:     { backgroundColor:'#4CD964' },
  checkboxUnchecked:   { borderWidth:1, borderColor:'#E5E5EA' },

  addRecordButton:     { flexDirection:'row', alignItems:'center', paddingVertical:12 },
  addIconContainer:    { width:36, height:36, borderRadius:18, backgroundColor:'#F2F9FE', justifyContent:'center', alignItems:'center', marginRight:12 },
  addRecordTextContainer:{ flex:1 },
  addRecordText:       { fontSize:16, fontWeight:'bold' },
  addRecordSubText:    { fontSize:14, color:'#8a8a8a' },

  infoCardsContainer:  { marginTop:8 },
  infoCard:            { width:170, height:90, backgroundColor:'#F9F9F9', borderRadius:12, padding:16, marginRight:8 },
  infoCardEmoji:       { fontSize:20, marginBottom:8 },
  infoCardText:        { fontSize:14, lineHeight:20 },
});
