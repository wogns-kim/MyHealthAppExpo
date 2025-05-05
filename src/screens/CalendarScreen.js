// src/screens/CalendarScreen.js
import React, { useState, useRef, useLayoutEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
  Animated,
  TextInput,
  Button,
  ScrollView,
  Image
} from 'react-native'
import { CalendarList } from 'react-native-calendars'
import { useNavigation } from '@react-navigation/native'
import { AntDesign } from '@expo/vector-icons'

const { height: SCREEN_HEIGHT } = Dimensions.get('window')
const TOTAL_MONTHS_RANGE = 12 * 10
const SHEET_HEIGHT = SCREEN_HEIGHT * 0.6

const colorOptions = ['#FF476C','#FF8C00','#4CAF50','#2196F3','#9C27B0','#FFC107']
const weekdayKor = ['일','월','화','수','목','금','토']

// 예시 기록 데이터
const records = {
  '2025-04-10': {
    visit: { clinic: '일내과의원', description: '알러지성 감기 및 비염 증상' },
    medications: [
      { category:'[해열진통제]', name:'타이레놀8시간이알서방정', icon: require('../../pic/1.png'),
        times:'아침 점심 저녁', tags:['간 부담 가능','음주 금지'] },
      // ... 이하 생략
    ]
  }
}

export default function CalendarScreen() {
  const navigation = useNavigation()
  const [selectedDay, setSelectedDay] = useState(null)
  const [notes, setNotes] = useState({
    '2025-04-15': [{ text:'정형외과 예약', color:'#FF476C' }],
    '2025-05-04': [{ text:'정기 건강검진', color:'#FF476C' }]
  })
  const [newNoteText, setNewNoteText] = useState('')
  const [newNoteColor, setNewNoteColor] = useState(colorOptions[0])
  const slideAnim = useRef(new Animated.Value(SHEET_HEIGHT)).current

  // 1) selectedDay가 있으면 스택 헤더 숨기고, 없으면 다시 보여줌
  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: !selectedDay })
  }, [navigation, selectedDay])

  const openBottomSheet = () =>
    Animated.timing(slideAnim,{
      toValue: 0,
      duration: 300,
      useNativeDriver: true
    }).start()

  const closeBottomSheet = () =>
    Animated.timing(slideAnim,{
      toValue: SHEET_HEIGHT,
      duration: 300,
      useNativeDriver: true
    }).start(() => {
      // 2) 바텀시트 닫힐 때 selectedDay 해제 → useLayoutEffect가 트리거되어 헤더 복원
      setSelectedDay(null)
      setNewNoteText('')
      setNewNoteColor(colorOptions[0])
    })

  const onDayPress = day => {
    setSelectedDay(day)
    openBottomSheet()
  }

  const handleAddNote = () => {
    if (!newNoteText.trim() || !selectedDay) return
    const key = selectedDay.dateString
    setNotes(prev => ({
      ...prev,
      [key]: [...(prev[key]||[]), { text: newNoteText.trim(), color: newNoteColor }]
    }))
    setNewNoteText('')
  }

  // 바텀 시트 헤더에 표시할 제목
  const todayString = new Date().toISOString().split('T')[0]
  let sheetTitle = ''
  if (selectedDay) {
    const { dateString, month, day } = selectedDay
    sheetTitle = `${month}월 ${day}일`
    sheetTitle += dateString === todayString
      ? ', 오늘'
      : `, ${weekdayKor[new Date(dateString).getDay()]}`
  }

  const todayRecord = selectedDay && records[selectedDay.dateString] // 예시

  // 달력의 각 날짜 셀
  const renderDay = ({ date, state }) => {
    const isSel = selectedDay?.dateString === date.dateString
    const dayNotes = notes[date.dateString] || []
    return (
      <TouchableOpacity style={styles.dayContainer} onPress={()=>onDayPress(date)}>
        <View style={[styles.dayNumberContainer, isSel && styles.selectedDay]}>
          <Text style={ isSel
            ? styles.selectedDayText
            : state==='disabled'
              ? styles.disabledDayText
              : styles.dayText
          }>{date.day}</Text>
        </View>
        {dayNotes.map((n,i)=>(
          <View key={i} style={[styles.labelContainer,{ backgroundColor:n.color }]}>
            <Text style={styles.labelText} numberOfLines={1}>{n.text}</Text>
          </View>
        ))}
      </TouchableOpacity>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* 기본 달력 리스트 */}
      <CalendarList
        pastScrollRange={TOTAL_MONTHS_RANGE}
        futureScrollRange={TOTAL_MONTHS_RANGE}
        scrollEnabled showScrollIndicator
        onDayPress={onDayPress}
        dayComponent={renderDay}
        renderHeader={date=>(
          <View style={styles.monthHeaderContainer}>
            <Text style={styles.monthHeaderText}>{`${date.getMonth()+1}월`}</Text>
          </View>
        )}
        theme={{
          calendarBackground:'#FFF',
          textSectionTitleColor:'#000',
          monthTextColor:'#000',
          arrowColor:'#000',
        }}
      />

      {/* 바텀 시트 */}
      <Animated.View style={[styles.bottomSheet,{ transform:[{ translateY: slideAnim }] }]}>
        <ScrollView style={styles.sheetContent}>
          { /* selectedDay가 있을 때만 내부를 렌더링 */ }
          {selectedDay && (
            <>
              {/* 내부 헤더: 뒤로가기 화살표 + 날짜 제목 */}
              <View style={styles.sheetHeaderRow}>
                <TouchableOpacity onPress={closeBottomSheet}>
                  <AntDesign name="arrowleft" size={20} color="#000" />
                </TouchableOpacity>
                <Text style={styles.sheetHeaderText}>{sheetTitle}</Text>
                <View style={{ width: 24 }} />
              </View>

              {todayRecord ? (
                /* 예시: 오늘 기록이 있을 때 */
                <>
                  <Text style={styles.sectionTitle}>● {todayRecord.visit.clinic}</Text>
                  <Text style={styles.sectionDesc}>{todayRecord.visit.description}</Text>
                  <Text style={[styles.sectionTitle,{ marginTop:16 }]}>● 복용약</Text>
                  {todayRecord.medications.map((med,i)=>(
                    <View key={i} style={styles.medRow}>
                      <Image source={med.icon} style={styles.medIcon}/>
                      <View style={styles.medInfo}>
                        <Text style={styles.medTimes}>{med.times}</Text>
                        <Text style={styles.medName}>{med.category} {med.name}</Text>
                        <View style={styles.tagRow}>
                          {med.tags.map((tag,j)=>(
                            <View key={j} style={styles.tag}>
                              <Text style={styles.tagText}>{tag}</Text>
                            </View>
                          ))}
                        </View>
                      </View>
                    </View>
                  ))}
                </>
              ) : (
                /* 메모 리스트 + 입력폼 */
                <>
                  {(notes[selectedDay.dateString]||[]).map((n,idx)=>(
                    <View key={idx} style={styles.existingNote}>
                      <View style={[styles.colorBox,{ backgroundColor: n.color }]} />
                      <Text>{n.text}</Text>
                    </View>
                  ))}
                  <Text style={styles.inputLabel}>새 메모 내용</Text>
                  <TextInput
                    style={styles.noteInput}
                    value={newNoteText}
                    onChangeText={setNewNoteText}
                    placeholder="메모를 입력하세요"
                  />
                  <Text style={styles.inputLabel}>라벨 색상 선택</Text>
                  <View style={styles.swatchContainer}>
                    {colorOptions.map(col=>(
                      <TouchableOpacity
                        key={col}
                        style={[
                          styles.swatch,
                          { backgroundColor: col },
                          newNoteColor===col && styles.swatchSelected
                        ]}
                        onPress={()=>setNewNoteColor(col)}
                      />
                    ))}
                  </View>
                  <Button title="메모 추가" onPress={handleAddNote}/>
                </>
              )}
            </>
          )}
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container:{ flex:1, backgroundColor:'#FFF' },
  monthHeaderContainer:{ width:'100%', paddingHorizontal:16, paddingVertical:8, alignItems:'flex-start' },
  monthHeaderText:{ fontSize:18, fontWeight:'600', color:'#000' },
  dayContainer:{ flex:1, alignItems:'center', paddingVertical:4 },
  dayNumberContainer:{ width:28, height:28, alignItems:'center', justifyContent:'center' },
  selectedDay:{ backgroundColor:'#3351FF', borderRadius:14 },
  dayText:{ fontSize:16, color:'#000' },
  disabledDayText:{ fontSize:16, color:'#d9e1e8' },
  selectedDayText:{ fontSize:16, color:'#FFF' },
  labelContainer:{ marginTop:2, borderRadius:4, paddingHorizontal:4, paddingVertical:1 },
  labelText:{ color:'#FFF', fontSize:10, lineHeight:12 },
  bottomSheet:{
    position:'absolute', bottom:0, left:0, right:0,
    height:SHEET_HEIGHT, backgroundColor:'#FFF',
    borderTopLeftRadius:16, borderTopRightRadius:16,
    shadowColor:'#000', shadowOffset:{ width:0, height:-3 },
    shadowOpacity:0.1, shadowRadius:5, elevation:5
  },
  sheetContent:{ padding:16 },
  sheetHeaderRow:{ flexDirection:'row', alignItems:'center', marginBottom:12 },
  sheetHeaderText:{ flex:1, textAlign:'center', fontSize:18, fontWeight:'600' },
  sectionTitle:{ fontSize:16, fontWeight:'600', marginBottom:4 },
  sectionDesc:{ fontSize:14, lineHeight:20 },
  medRow:{ flexDirection:'row', marginTop:12, alignItems:'flex-start' },
  medIcon:{ width:40, height:40, resizeMode:'contain', marginRight:12 },
  medInfo:{ flex:1 },
  medTimes:{ fontSize:12, color:'#666' },
  medName:{ fontSize:14, fontWeight:'500', marginTop:2 },
  tagRow:{ flexDirection:'row', flexWrap:'wrap', marginTop:4 },
  tag:{ backgroundColor:'#3351FF', borderRadius:4, paddingHorizontal:6, paddingVertical:2, marginRight:6, marginBottom:4 },
  tagText:{ color:'#FFF', fontSize:10 },
  existingNote:{ flexDirection:'row', alignItems:'center', marginBottom:8 },
  colorBox:{ width:12, height:12, marginRight:8, borderRadius:2 },
  inputLabel:{ marginTop:12, marginBottom:4, fontSize:14, fontWeight:'500' },
  noteInput:{ borderWidth:1, borderColor:'#DDD', borderRadius:6, padding:8, marginBottom:8, textAlignVertical:'top' },
  swatchContainer:{ flexDirection:'row', marginBottom:12 },
  swatch:{ width:24, height:24, borderRadius:12, marginRight:8 },
  swatchSelected:{ borderWidth:2, borderColor:'#000' },
})
