// Full component with no content omitted
import React, { useState } from 'react';
import {
  SafeAreaView,
  StatusBar,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  Platform,
} from 'react-native';
import { FontAwesome5, AntDesign, Feather, Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Calendar } from 'react-native-calendars';
import { LocaleConfig } from 'react-native-calendars';
import { Image } from 'react-native';
import infoContents from './infoContents';



LocaleConfig.locales['ko'] = {
  monthNames: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
  monthNamesShort: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
  dayNames: ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'],
  dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
  today: '오늘'
};
LocaleConfig.defaultLocale = 'ko';

export default function HomeScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const defaultName = route.params?.username || '김안하';
  const [username, setUsername] = useState(defaultName);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userOptions = [defaultName, '우리 막둥이', '우리 엄마', '우리 아빠'];

  const [currentDate, setCurrentDate] = useState(new Date());
  const [showCalendarModal, setShowCalendarModal] = useState(false);

  const [memoMap, setMemoMap] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [memoText, setMemoText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const saveMemo = () => {
    if (selectedDate) {
      setMemoMap(prev => ({ ...prev, [selectedDate]: memoText }));
    }
    setModalVisible(false);
  };

  const deleteMemo = dateKey => {
    setMemoMap(prev => {
      const next = { ...prev };
      delete next[dateKey];
      return next;
    });
  };


  const month = currentDate.getMonth() + 1;
  const date = currentDate.getDate();
  const now = new Date();
  const isTodayHeader =
    now.getFullYear() === currentDate.getFullYear() &&
    now.getMonth() === currentDate.getMonth() &&
    now.getDate() === currentDate.getDate();

  const days = ['일', '월', '화', '수', '목', '금', '토'];
  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() - 3 + i);
    const fullDate = d.toISOString().split('T')[0];
    return {
      day: days[d.getDay()],
      date: d.getDate(),
      fullDate,
      isToday: fullDate === currentDate.toISOString().split('T')[0],
      memo: memoMap[fullDate],
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
    <SafeAreaView style={[styles.container, Platform.OS === 'android' && { paddingTop: StatusBar.currentHeight }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View style={styles.header}>
        <View style={{ position: 'relative' }}>
          <TouchableOpacity style={styles.headerLeft} onPress={() => setShowUserMenu(v => !v)}>
            <Text style={styles.headerName}>
              {username}님 <AntDesign name="down" size={10} />
            </Text>
          </TouchableOpacity>
          {showUserMenu && (
            <View style={styles.userMenu}>
              {userOptions.map(opt => (
                <TouchableOpacity key={opt} onPress={() => { setUsername(opt); setShowUserMenu(false); }}>
                  <Text style={styles.userMenuItem}>{opt}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <TouchableOpacity style={styles.headerTitleWrapper} onPress={() => setShowCalendarModal(true)}>
          <Text style={styles.headerDate}>
            {month}월 {date}일{isTodayHeader ? ', 오늘' : ''} <AntDesign name="down" size={10} />
          </Text>
        </TouchableOpacity>

        <View style={styles.headerRight}>
          <TouchableOpacity onPress={() => navigation.navigate('Calendar')} style={{ marginRight: 16 }}>
            <Feather name="calendar" size={22} color="black" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
            <Ionicons name="settings-outline" size={22} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      <Modal visible={showCalendarModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Calendar
              onDayPress={(day) => {
                setCurrentDate(new Date(day.dateString));
                setShowCalendarModal(false);
              }}
              markedDates={{
                [currentDate.toISOString().split('T')[0]]: {
                  selected: true,
                  selectedColor: '#3C4CF1',
                },
              }}
              style={{ marginBottom: 20 }}
              theme={{
                selectedDayBackgroundColor: '#3C4CF1',
                todayTextColor: '#3C4CF1',
              }}
            />
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton, { alignSelf: 'flex-end' }]}
              onPress={() => setShowCalendarModal(false)}
            >
              <Text style={styles.modalButtonText}>닫기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.calendar}>
          {weekDates.map(item => (
            <View key={item.fullDate} style={styles.dayColumn}>
              <Text style={styles.dayText}>{item.day}</Text>
              <TouchableOpacity onPress={() => { setSelectedDate(item.fullDate); setMemoText(item.memo || ''); setModalVisible(true); }}>
                <View style={[styles.dateCircle, item.isToday && styles.todayCircle]}>
                  <Text style={[styles.dateTextCircle, item.isToday && styles.todayText]}>{item.date}</Text>
                </View>
              </TouchableOpacity>
              {item.memo && (
                <TouchableOpacity style={[styles.memoPill, item.memo.includes('약') ? styles.memoPillOrange : styles.memoPillBlue]} onPress={() => deleteMemo(item.fullDate)}>
                  <Text style={[styles.memoPillText, item.memo.includes('약') ? styles.memoPillTextOrange : styles.memoPillTextBlue]} numberOfLines={1} ellipsizeMode="tail">
                    {item.memo.length > 4 ? `${item.memo.slice(0, 4)}...` : item.memo}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </ScrollView>

        <View style={styles.divider} />

        <TouchableOpacity style={styles.visitCard} onPress={() => navigation.navigate('VisitDetail')}>
          <Text style={styles.visitText}>오늘 병원에 방문하셨어요.</Text>
        </TouchableOpacity>

        <View style={styles.section}>
          <TouchableOpacity style={styles.sectionHeader} onPress={() => navigation.navigate('MedicineDetail')} activeOpacity={0.7}>
            <Text style={styles.sectionTitle}>약 복용</Text>
            <AntDesign name="right" size={16} color="black" />
          </TouchableOpacity>
          {medicines.map(item => (
            <View key={item.id} style={styles.medicineItem}>
              <View style={styles.medicineLeft}>
                <View style={styles.pillIcon}>
                  <FontAwesome5 name="pills" size={18} color="white" />
                </View>
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
                  {item.checked && <AntDesign name="check" size={14} color="white" />}
                </View>
              </TouchableOpacity>
            </View>
          ))}
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>지금 나에게 필요한 정보</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {infoContents.map((item, i) => (
              <TouchableOpacity
                key={item.id}
                style={styles.infoCard}
                onPress={() =>
                  navigation.navigate('InfoDetail', {
                    title: item.title,
                    content: item.content,
                  })
                }
              >
                <Text style={styles.infoCardText}>{item.title}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

      </ScrollView>

      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{selectedDate} 메모</Text>
            <TextInput value={memoText} onChangeText={setMemoText} placeholder="메모를 입력하세요" style={styles.modalInput} multiline />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => setModalVisible(false)}>
                <Text style={styles.modalButtonText}>취소</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.saveButton]} onPress={saveMemo}>
                <Text style={[styles.modalButtonText, { color: '#fff' }]}>저장</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <TouchableOpacity
        onPress={() => navigation.navigate('chatbot')}
        style={styles.chatbotButton}
      >
        <View style={styles.chatbotCircle}>
          <Image
            source={require('../../assets/chatbotch.png')}

            style={styles.chatbotImage}
            resizeMode="contain"
          />
        </View>
      </TouchableOpacity>




    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { height: 56, justifyContent: 'center', backgroundColor: '#fff', borderBottomWidth: 0.5, borderColor: '#eee', position: 'relative' },
  headerLeft: { position: 'absolute', left: 16, top: '50%', transform: [{ translateY: -12 }], zIndex: 2 },
  headerName: { fontSize: 18, fontWeight: '600', color: '#000' },
  headerTitleWrapper: { position: 'absolute', left: 80, right: 80, alignItems: 'center', top: '50%', transform: [{ translateY: -10 }], zIndex: 1 },
  headerDate: { fontSize: 16, fontWeight: 'bold', color: '#000' },
  headerRight: { position: 'absolute', right: 16, top: '50%', transform: [{ translateY: -10 }], flexDirection: 'row', alignItems: 'center' },
  userMenu: { position: 'absolute', top: '100%', marginTop: 10, left: 16, backgroundColor: '#fff', borderRadius: 6, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, elevation: 5, zIndex: 10 },
  userMenuItem: { paddingVertical: 12, paddingHorizontal: 16, fontSize: 16, color: '#333' },
  calendar: { paddingLeft: 16, paddingVertical: 16 },
  dayColumn: { alignItems: 'center', marginRight: 24 },
  dayText: { fontSize: 15, color: '#2d2d2d', marginBottom: 4 },
  dateCircle: { width: 38, height: 38, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  todayCircle: { backgroundColor: '#424CF2' },
  dateTextCircle: { fontSize: 16, fontWeight: '600' },
  todayText: { color: 'white' },
  memoPill: { marginTop: 6, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, maxWidth: 120 },
  memoPillBlue: { backgroundColor: '#D6EBFF' },
  memoPillOrange: { backgroundColor: '#FFE8CC' },
  memoPillText: { fontSize: 12, fontWeight: '500', flexShrink: 1 },
  memoPillTextBlue: { color: '#007E33' },
  memoPillTextOrange: { color: '#FF8A00' },
  divider: { height: 1, backgroundColor: '#E0E0E0', marginHorizontal: 16, marginBottom: 12 },
  visitCard: { backgroundColor: '#D6EBFF', marginHorizontal: 16, paddingVertical: 12, paddingHorizontal: 16, borderRadius: 20, marginBottom: 15, marginTop: 15 },
  visitText: { fontWeight: 'bold', fontSize: 20, color: '#1A1A1A' },
  section: { paddingHorizontal: 16, marginBottom: 24 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 14, marginTop: 10 },
  medicineItem: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 20 },
  medicineLeft: { width: 50, alignItems: 'center', marginRight: 12 },
  pillIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#FF9500', justifyContent: 'center', alignItems: 'center' },
  medicineInfo: { flex: 1, paddingTop: 2 },
  grayLabel: { fontSize: 13, color: '#888', marginBottom: 2 },
  boldLabel: { fontSize: 15, fontWeight: 'bold', marginBottom: 2 },
  descDot: { fontSize: 15, color: '#000', marginLeft: 2 },
  checkboxWrapper: { justifyContent: 'center', alignItems: 'center', paddingLeft: 8 },
  checkbox: { width: 22, height: 22, borderRadius: 4, borderWidth: 1, borderColor: '#ccc', justifyContent: 'center', alignItems: 'center' },
  checked: { backgroundColor: '#4CD964', borderWidth: 0 },
  infoCard: { backgroundColor: '#FBF8F4', padding: 16, marginRight: 12, borderRadius: 12, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 4, elevation: 2 },
  infoCardText: { fontSize: 14, fontWeight: '500', color: '#333' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalCard: { width: '85%', backgroundColor: '#fff', borderRadius: 12, padding: 20, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 8 },
  modalTitle: { fontSize: 18, fontWeight: '600', marginBottom: 12 },
  modalInput: { height: 100, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, textAlignVertical: 'top', marginBottom: 16 },
  modalButtons: { flexDirection: 'row', justifyContent: 'flex-end' },
  modalButton: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 6, marginLeft: 8 },
  cancelButton: { backgroundColor: '#f0f0f0' },
  saveButton: { backgroundColor: '#3C4CF1' },
  modalButtonText: { fontSize: 14, fontWeight: '500', color: '#333' },
  chatbotButton: {
    position: 'absolute',
    bottom: 90, // 하단 탭바 위 여유
    right: 20,
    zIndex: 100,
  },
  chatbotCircle: {
    backgroundColor: '#3C4CF1',
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  chatbotImage: {
    width: 150,
    height: 150,
    marginBottom: 5,
  },


});
