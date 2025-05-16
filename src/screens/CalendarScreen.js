// src/screens/CalendarScreen.js
import React, {
  useState,
  useRef,
  useLayoutEffect,
  useContext,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
  Animated,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { CalendarList } from 'react-native-calendars';
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';

// 추가된 부분: Context import
import { MemoContext } from './MemoContext';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const TOTAL_MONTHS_RANGE = 12 * 10;
const SHEET_HEIGHT = SCREEN_HEIGHT * 0.6;
const weekdayKor = ['일', '월', '화', '수', '목', '금', '토'];

export default function CalendarScreen() {
  const navigation = useNavigation();
  // Context 훅으로 교체
  const { memoMap, saveMemo, deleteMemo } = useContext(MemoContext);

  const [selectedDay, setSelectedDay] = useState(null);
  const [records, setRecords] = useState({
    default: [
      { title: '월내과의원', description: '알러지성 감기 및 비염 증상' },
      { title: '복용약', description: '알러지성 감기약 복용하기' },
    ],
  });
  const [editingRecordIdx, setEditingRecordIdx] = useState(null);
  const [recordTitle, setRecordTitle] = useState('');
  const [recordDesc, setRecordDesc] = useState('');

  // 메모 입력 관련
  const [memoText, setMemoText] = useState('');
  const [editingMemoIdx, setEditingMemoIdx] = useState(null);
  const [editingMode, setEditingMode] = useState(false);

  const slideAnim = useRef(new Animated.Value(SHEET_HEIGHT)).current;
  const scrollRef = useRef();

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: !selectedDay });
  }, [navigation, selectedDay]);

  const openBottomSheet = () =>
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  const closeBottomSheet = () =>
    Animated.timing(slideAnim, {
      toValue: SHEET_HEIGHT,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setSelectedDay(null);
      setMemoText('');
      setEditingMemoIdx(null);
      setEditingRecordIdx(null);
      setRecordTitle('');
      setRecordDesc('');
      setEditingMode(false);
    });

  const onDayPress = (day) => {
    setSelectedDay(day);
    setMemoText(''); // 새로 열 때 초기화
    setEditingMemoIdx(null);
    openBottomSheet();
  };

  // Context의 saveMemo 사용
  const handleSaveMemo = () => {
    const key = selectedDay.dateString;
    if (!memoText.trim()) return;
    saveMemo(key, memoText.trim());
    setMemoText('');
    setEditingMemoIdx(null);
  };

  const handleEditMemo = (text, idx) => {
    setMemoText(text);
    setEditingMemoIdx(idx);
  };

  // Context의 deleteMemo 사용 (인덱스 기반 삭제 원하면 Context 구현 수정 필요)
  const handleDeleteMemo = (idx) => {
    const key = selectedDay.dateString;
    Alert.alert('삭제 확인', '이 메모를 삭제할까요?', [
      { text: '취소', style: 'cancel' },
      {
        text: '삭제',
        style: 'destructive',
        onPress: () => {
          // Context에서 전체 삭제: deleteMemo(key)
          // 만약 여러 개 중 하나만 지우고 싶다면 Context 로직 수정 필요합니다.
          deleteMemo(key);
        },
      },
    ]);
  };

  const handleEditRecord = (item, idx) => {
    setEditingRecordIdx(idx);
    setRecordTitle(item.title);
    setRecordDesc(item.description);
  };
  const handleSaveRecord = () => {
    const key = 'default';
    if (!recordTitle.trim()) return;
    setRecords((prev) => {
      const current = prev[key] || [];
      const updated = current.map((item, i) =>
        i === editingRecordIdx
          ? {
            title: recordTitle.trim(),
            description: recordDesc.trim(),
          }
          : item
      );
      return { ...prev, [key]: updated };
    });
    setEditingRecordIdx(null);
    setRecordTitle('');
    setRecordDesc('');
  };

  const sheetTitle = selectedDay
    ? `${selectedDay.month}월 ${selectedDay.day}일 (${weekdayKor[new Date(selectedDay.dateString).getDay()]
    })`
    : '';

  const renderRecords = () => {
    const current = records['default'] || [];
    return current.map((item, idx) => (
      <View key={idx} style={styles.recordItem}>
        <View
          style={[
            styles.bullet,
            { backgroundColor: idx === 0 ? '#3351FF' : '#FFA726' },
          ]}
        />
        {editingMode && editingRecordIdx === idx ? (
          <View style={{ flex: 1 }}>
            <TextInput
              style={styles.recordInput}
              value={recordTitle}
              onChangeText={setRecordTitle}
              placeholder="제목"
            />
            <TextInput
              style={styles.recordInput}
              value={recordDesc}
              onChangeText={setRecordDesc}
              placeholder="내용"
              multiline
            />
            <TouchableOpacity
              onPress={handleSaveRecord}
              style={{ alignSelf: 'flex-end' }}
            >
              <Text style={styles.actionText}>저장</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={{ flex: 1 }}>
            <Text style={styles.recordTitle}>{item.title}</Text>
            <Text style={styles.recordDesc}>{item.description}</Text>
          </View>
        )}
        {editingMode && editingRecordIdx !== idx && (
          <TouchableOpacity onPress={() => handleEditRecord(item, idx)}>
            <Text style={styles.actionText}>수정</Text>
          </TouchableOpacity>
        )}
      </View>
    ));
  };

  const renderMemoList = () => {
    const key = selectedDay?.dateString;
    const list = memoMap[key] ? [memoMap[key]] : [];
    return list.map((item, idx) => (
      <View key={idx} style={styles.memoRow}>
        <Text style={styles.memoItem}>• {item}</Text>
        {editingMode && (
          <View style={styles.memoActions}>
            <TouchableOpacity onPress={() => handleEditMemo(item, idx)}>
              <Text style={styles.actionText}>수정</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDeleteMemo(idx)}>
              <Text style={styles.actionText}>삭제</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    ));
  };

  return (
    <SafeAreaView style={styles.container}>
      <CalendarList
        pastScrollRange={TOTAL_MONTHS_RANGE}
        futureScrollRange={TOTAL_MONTHS_RANGE}
        scrollEnabled
        showScrollIndicator
        onDayPress={onDayPress}
        renderHeader={(date) => (
          <Text style={styles.monthHeaderText}>
            {date.getMonth() + 1}월
          </Text>
        )}
        theme={{ calendarBackground: '#FFF' }}
        dayComponent={({ date, state }) => {
          const key = date.dateString;
          const memosForDay = memoMap[key] ? [memoMap[key]] : [];
          const isToday =
            key === new Date().toISOString().split('T')[0];

          const labels = memosForDay.map((memo) => {
            const shortText =
              memo.length > 10
                ? memo.slice(0, 10) + '...'
                : memo;
            return { type: 'memo', text: shortText };
          });
          if (isToday)
            labels.push({ type: 'record', text: '병원 방문' });

          return (
            <TouchableOpacity onPress={() => onDayPress(date)}>
              <View style={{ alignItems: 'center', paddingVertical: 4 }}>
                <Text
                  style={{
                    color: state === 'disabled' ? '#ccc' : '#000',
                    fontWeight: isToday ? 'bold' : 'normal',
                  }}
                >
                  {date.day}
                </Text>
                {labels.map((label, idx) => (
                  <Text
                    key={idx}
                    style={{
                      fontSize: 8,
                      backgroundColor:
                        label.type === 'memo'
                          ? '#3366FF'
                          : '#FFA726',
                      color: '#fff',
                      borderRadius: 4,
                      paddingHorizontal: 4,
                      marginTop: 2,
                      overflow: 'hidden',
                    }}
                  >
                    {label.text}
                  </Text>
                ))}
              </View>
            </TouchableOpacity>
          );
        }}
      />

      <Animated.View
        style={[
          styles.bottomSheet,
          { transform: [{ translateY: slideAnim }] },
        ]}
      >
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            ref={scrollRef}
            style={styles.sheetContent}
            keyboardShouldPersistTaps="handled"
          >
            {selectedDay && (
              <>
                <View style={styles.sheetHeaderRow}>
                  <TouchableOpacity onPress={closeBottomSheet}>
                    <AntDesign
                      name="arrowleft"
                      size={20}
                      color="#000"
                    />
                  </TouchableOpacity>
                  <Text style={styles.sheetHeaderText}>
                    {sheetTitle}
                  </Text>
                  <TouchableOpacity
                    onPress={() => setEditingMode(!editingMode)}
                  >
                    <Text style={styles.modifyButton}>
                      {editingMode ? '완료' : '기록 수정'}
                    </Text>
                  </TouchableOpacity>
                </View>
                {renderRecords()}
                <Text style={styles.memoLabel}>메모</Text>
                {renderMemoList()}
              </>
            )}
          </ScrollView>

          <View style={styles.inputCardAdjusted}>
            <TextInput
              style={styles.inputField}
              value={memoText}
              onChangeText={setMemoText}
              placeholder="내용을 입력하세요"
              placeholderTextColor="#999"
              multiline
              blurOnSubmit={true}
              onSubmitEditing={handleSaveMemo}
              returnKeyType="done"
            />
          </View>
        </KeyboardAvoidingView>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  monthHeaderText: { padding: 16, fontSize: 18, fontWeight: '600' },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: SHEET_HEIGHT,
    backgroundColor: '#FFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  sheetContent: { padding: 16, paddingBottom: 120 },
  sheetHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    justifyContent: 'space-between',
  },
  sheetHeaderText: { fontSize: 18, fontWeight: '600' },
  modifyButton: {
    fontSize: 14,
    color: '#3366FF',
    fontWeight: '600',
  },
  recordItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  bullet: { width: 10, height: 10, borderRadius: 5, marginTop: 6, marginRight: 8 },
  recordTitle: { fontSize: 15, fontWeight: 'bold', marginBottom: 4 },
  recordDesc: { fontSize: 14, color: '#444' },
  recordInput: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 8,
    fontSize: 14,
    marginBottom: 4,
  },
  memoLabel: { marginTop: 20, fontWeight: 'bold', fontSize: 15, marginBottom: 10 },
  memoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  memoItem: { fontSize: 14, color: '#222', flex: 1 },
  memoActions: { flexDirection: 'row' },
  actionText: { fontSize: 13, color: '#3366FF', marginLeft: 12 },
  inputCardAdjusted: {
    borderTopWidth: 1,
    borderColor: '#eee',
    padding: 16,
    backgroundColor: '#fafafa',
    marginBottom: 32,
  },
  inputField: {
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 14,
    fontSize: 15,
    minHeight: 48,
    textAlignVertical: 'top',
  },
});
