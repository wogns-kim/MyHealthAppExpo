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
} from 'react-native';
import { FontAwesome5, AntDesign, Feather, Ionicons, Entypo } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Dimensions } from 'react-native';




export default function HomeScreen() {
  const navigation = useNavigation();
  const today = new Date();
  const month = today.getMonth() + 1;
  const date = today.getDate();
  const days = ['일', '월', '화', '수', '목', '금', '토'];

  const [memoMap, setMemoMap] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [memoText, setMemoText] = useState('');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [currentDate, setCurrentDate] = useState(today);


  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - 3 + i);
    const fullDate = d.toISOString().split('T')[0];
    return {
      day: days[d.getDay()],
      date: d.getDate(),
      fullDate,
      isToday:
        d.getDate() === today.getDate() &&
        d.getMonth() === today.getMonth() &&
        d.getFullYear() === today.getFullYear(),
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
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View style={styles.calendarHeader}>
        <Text style={styles.headerName}>김안하님 <AntDesign name="down" size={10} /></Text>
        <TouchableOpacity onPress={() => setDatePickerVisibility(true)}>
          <Text style={styles.headerDate}>{month}월 {date}일, 오늘 <AntDesign name="down" size={10} /></Text>
        </TouchableOpacity>

        <View style={styles.headerIcons}>
          <TouchableOpacity onPress={() => navigation.navigate('Calendar')}>
            <Feather name="calendar" size={22} color="black" style={{ marginRight: 16 }} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="settings-outline" size={22} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.calendar}>
        {weekDates.map((item, i) => (
          <View key={i} style={styles.dayColumn}>
            <Text style={styles.dayText}>{item.day}</Text>
            <TouchableOpacity
              onPress={() => {
                setSelectedDate(item.fullDate);
                setMemoText(memoMap[item.fullDate] || '');
                setModalVisible(true);
              }}
            >
              <View style={[styles.dateCircle, item.isToday && styles.todayCircle]}>
                <Text style={[styles.dateTextCircle, item.isToday && styles.todayText]}>{item.date}</Text>
              </View>
            </TouchableOpacity>
            <View style={styles.tagContainer}>
              {item.memo && <Text style={styles.memoTag} numberOfLines={1}>{item.memo}</Text>}

            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.divider} />

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <TouchableOpacity
          style={styles.visitCard}
          onPress={() => navigation.navigate('VisitDetail')}
        >
          <Text style={styles.visitText}>오늘 병원에 방문하셨어요.</Text>
        </TouchableOpacity>

        <View style={styles.section}>
          <TouchableOpacity
            style={styles.sectionHeader}
            onPress={() => navigation.navigate('MedicineDetail')}
            activeOpacity={0.7}
          >
            <Text style={styles.sectionTitle}>약 복용</Text>
            <AntDesign name="right" size={16} color="black" marginBottom='5' />
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
                {item.desc.map((d, j) => (
                  <Text key={j} style={styles.descDot}>• {d}</Text>
                ))}
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
            {['🤔 지금 먹고 있는 약, 약사에게 말해야 할까?', '💊 이제 안 아픈데, 약 끊어도 될까?'].map((text, i) => (
              <TouchableOpacity key={i} style={styles.infoCard}>
                <Text style={styles.infoCardText}>{text}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </ScrollView>

      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlayCentered}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{selectedDate} 메모</Text>
            <TextInput
              style={styles.modalInput}
              value={memoText}
              onChangeText={setMemoText}
              multiline
              placeholder="메모를 입력하세요"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={() => {
                  setMemoMap(prev => ({ ...prev, [selectedDate]: memoText }));
                  setModalVisible(false);
                }}
                style={styles.modalButton}
              >
                <Text>저장</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setMemoMap(prev => {
                    const updated = { ...prev };
                    delete updated[selectedDate];
                    return updated;
                  });
                  setModalVisible(false);
                }}
                style={styles.modalButton}
              >
                <Text style={{ color: 'red' }}>삭제</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        date={currentDate}
        onConfirm={(date) => {
          setCurrentDate(date);
          setDatePickerVisibility(false);
        }}
        onCancel={() => setDatePickerVisibility(false)}
      />

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
    transform: [{ translateX: -165
      
     }, { translateY: -10 }], // 텍스트 길이에 맞게 조정 (숫자 조절 가능)
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

  visitCard: {
    backgroundColor: '#D6EBFF',
    marginHorizontal: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 20, // ✅ 적당한 반지름
    marginBottom: 15,
    marginTop: 15
  },

  visitText: {
    fontWeight: 'bold',
    fontSize: 20,
    color: '#1A1A1A',

  },


  section: { paddingHorizontal: 16, marginBottom: 24 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },


  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 14, marginTop: 10 },

  medicineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },

  medicineLeft: {
    width: 40,
    alignItems: 'center',
    marginRight: 12,
  },

  pillIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FF9500',
    justifyContent: 'center',
    alignItems: 'center',
  },

  medicineInfo: {
    flex: 1,
    paddingTop: 2,
  },

  grayLabel: {
    fontSize: 13,
    color: '#888',
    marginBottom: 2,
  },

  boldLabel: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 2,
  },

  descDot: {
    fontSize: 13,
    color: '#000',
    marginLeft: 2,
  },

  checkboxWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 8,
  },

  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },

  checked: {
    backgroundColor: '#4CD964',
    borderWidth: 0,
  },

  infoCard: { backgroundColor: '#FBF8F4', padding: 16, marginRight: 12, borderRadius: 12, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 4, elevation: 2 },
  infoCardText: { fontSize: 14, fontWeight: '500', color: '#333' },

  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 16,
    marginBottom: 12,
  },

  modalOverlayCentered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    width: '80%',
    elevation: 4,
  },
  modalTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    height: 100,
    textAlignVertical: 'top',
    marginBottom: 12,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    padding: 8,
  },
  memoTag: {
    backgroundColor: '#E6F4EA',
    color: '#007E33',
    fontSize: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 2,
    maxWidth: 64,
    textAlign: 'center',
  },

});
