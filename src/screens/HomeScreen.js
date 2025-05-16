import React, { useState, useEffect, useContext } from 'react';
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
  Image,
} from 'react-native';
import { FontAwesome5, AntDesign, Feather, Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import infoContents from './infoContents';

// Context 추가
import { MemoContext } from './MemoContext';

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
  const defaultName = route.params?.name || '사용자';
  const [username, setUsername] = useState(defaultName);

  useEffect(() => {
    if (route.params?.name) {
      setUsername(route.params.name);
    }
  }, [route.params?.name]);

  // Context에서 메모 상태 및 함수 가져오기
  const { memoMap, saveMemo, deleteMemo } = useContext(MemoContext);

  const [showUserMenu, setShowUserMenu] = useState(false);
  const userOptions = [defaultName, '우리 막둥이', '우리 엄마', '우리 아빠'];

  const [currentDate, setCurrentDate] = useState(new Date());
  const [showCalendarModal, setShowCalendarModal] = useState(false);

  const [selectedDate, setSelectedDate] = useState(null);
  const [memoText, setMemoText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const month = currentDate.getMonth() + 1;
  const date = currentDate.getDate();
  const now = new Date();
  const isTodayHeader = now.toDateString() === currentDate.toDateString();

  const days = ['일', '월', '화', '수', '목', '금', '토'];
  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() - 3 + i);
    const full = d.toISOString().split('T')[0];
    return {
      day: days[d.getDay()],
      date: d.getDate(),
      fullDate: full,
      isToday: full === currentDate.toISOString().split('T')[0],
      memo: memoMap[full]  // Context에서 읽어옴
    };
  });

  const [medicines, setMedicines] = useState([
    { id: 'morning', label: '아침 약 복용하기', desc: ['비타민 C', '감기약'], checked: false },
    { id: 'lunch', label: '점심 약 복용하기', desc: ['감기약'], checked: false },
    { id: 'dinner', label: '저녁 약 복용하기', desc: ['감기약'], checked: false },
  ]);
  const toggleMedicine = id => {
    setMedicines(ms => ms.map(m =>
      m.id === id ? { ...m, checked: !m.checked } : m
    ));
  };

  // 모달에서 메모 저장
  const onSave = () => {
    if (selectedDate && memoText.trim()) {
      saveMemo(selectedDate, memoText.trim());
    }
    setModalVisible(false);
    setMemoText('');
  };

  // 모달에서 메모 삭제
  const onDelete = key => {
    deleteMemo(key);
  };

  return (
    <SafeAreaView style={[styles.container, Platform.OS === 'android' && { paddingTop: StatusBar.currentHeight }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* 헤더 */}
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

      {/* 달력 모달 */}
      <Modal visible={showCalendarModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Calendar
              onDayPress={day => {
                setCurrentDate(new Date(day.dateString));
                setShowCalendarModal(false);
              }}
              markedDates={{
                [currentDate.toISOString().split('T')[0]]: { selected: true, selectedColor: '#3C4CF1' }
              }}
              style={{ marginBottom: 20 }}
              theme={{ selectedDayBackgroundColor: '#3C4CF1', todayTextColor: '#3C4CF1' }}
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

        {/* 이번주 스크롤 달력 */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.calendar}>
          {weekDates.map(i => (
            <View key={i.fullDate} style={styles.dayColumn}>
              <Text style={styles.dayText}>{i.day}</Text>
              <TouchableOpacity onPress={() => {
                setSelectedDate(i.fullDate);
                setMemoText(i.memo || '');
                setModalVisible(true);
              }}>
                <View style={[styles.dateCircle, i.isToday && styles.todayCircle]}>
                  <Text style={[styles.dateTextCircle, i.isToday && styles.todayText]}>{i.date}</Text>
                </View>
              </TouchableOpacity>
              {i.memo && (
                <TouchableOpacity
                  onPress={() => onDelete(i.fullDate)}
                  style={[
                    styles.memoPill,
                    i.memo.includes('약') ? styles.memoPillOrange : styles.memoPillBlue
                  ]}
                >
                  <Text
                    style={[
                      styles.memoPillText,
                      i.memo.includes('약') ? styles.memoPillTextOrange : styles.memoPillTextBlue
                    ]}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {i.memo.length > 4 ? `${i.memo.slice(0, 4)}...` : i.memo}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </ScrollView>

        <View style={styles.divider} />

        {/* 방문 카드 */}
        <TouchableOpacity style={styles.visitCard} onPress={() => navigation.navigate('VisitDetail')}>
          <Text style={styles.visitText}>오늘 병원에 방문하셨어요.</Text>
        </TouchableOpacity>

        {/* 약 복용 섹션 */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.sectionHeader} onPress={() => navigation.navigate('MedicineDetail')} activeOpacity={0.7}>
            <Text style={styles.sectionTitle}>약 복용</Text>
            <AntDesign name="right" size={16} color="black" />
          </TouchableOpacity>

          {medicines.map(item => (
            <View
              key={item.id}
              style={{
                flexDirection: 'row',
                alignItems: 'flex-start',
                marginBottom: 20,
                backgroundColor: '#fff',
                padding: 12,
                borderRadius: 8,
                opacity: item.checked ? 0.4 : 1,
              }}
            >
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

        {/* 필요한 정보 섹션 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>지금 나에게 필요한 정보</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {infoContents.map(item => (
              <TouchableOpacity
                key={item.id}
                style={styles.infoCard}
                onPress={() => navigation.navigate('InfoDetail', { title: item.title, content: item.content })}
              >
                <Text style={styles.infoCardText}>{item.title}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </ScrollView>

      {/* 메모 모달 */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{selectedDate} 메모</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="메모를 입력하세요"
              value={memoText}
              onChangeText={setMemoText}
              multiline
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => setModalVisible(false)}>
                <Text style={styles.modalButtonText}>취소</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.saveButton]} onPress={onSave}>
                <Text style={[styles.modalButtonText, { color: '#fff' }]}>저장</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* 챗봇 버튼 */}
      <TouchableOpacity onPress={() => navigation.navigate('chatbot')} style={styles.chatbotButton}>
        <View style={styles.chatbotCircle}>
          <Image source={require('../../assets/chatbotch.png')} style={styles.chatbotImage} resizeMode="contain" />
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { height: 56, justifyContent: 'center', borderBottomWidth: 0.5, borderColor: '#eee', position: 'relative', backgroundColor: '#fff' },
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
  todayText: { color: '#fff' },
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
  // BlurView 를 덮을 래퍼
  medicineContentWrapper: { flex: 1, position: 'relative' },
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
  chatbotButton: { position: 'absolute', bottom: 90, right: 20, zIndex: 100 },
  chatbotCircle: { backgroundColor: '#3C4CF1', borderRadius: 30, width: 60, height: 60, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4, elevation: 5 },
  chatbotImage: { width: 190, height: 190, marginBottom: 5 },
});
