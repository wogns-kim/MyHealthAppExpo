// src/screens/MyRecordsScreen.js
import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from 'react-native';
import { Ionicons, Feather, AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const records = [
  {
    id: '1',
    title: '알러지성 감기 및 비염',
    clinic: '월내과의원',
    date: '2025.04.10',
    currentDay: 1,
    totalDay: 3,
  },
  {
    id: '2',
    title: '소화불량 및 복부팽만감',
    clinic: '월내과의원',
    date: '2025.03.29',
  },
  {
    id: '3',
    title: '습진 및 두드러기',
    clinic: '아이미소피부과의',
    date: '2025.03.16',
  },
  {
    id: '4',
    title: '미열을 동반한 인후통',
    clinic: '월내과의원',
    date: '2025.01.18',
  },
  {
    id: '5',
    title: '치아 교정 및 임플란트',
    clinic: '늘푸른치과',
    date: '2024.12.30',
  },
  {
    id: '6',
    title: '근육통',
    clinic: '행복정형외과',
    date: '2024.11.10',
  },
];

export default function MyRecordsScreen() {
  const navigation = useNavigation();

  const renderItem = ({ item }) => {
    const showProgress =
      typeof item.currentDay === 'number' &&
      typeof item.totalDay === 'number';
    const progressRatio = showProgress
      ? item.currentDay / item.totalDay
      : 0;

    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.7}
        onPress={() => {
          // 상세 화면으로 이동하고 싶으면 여기에 navigation.navigate(...)
        }}
      >
        <View style={styles.cardBody}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardClinic}>{item.clinic}</Text>

          {showProgress && (
            <View style={styles.progressWrapper}>
              <View
                style={[
                  styles.progressBar,
                  { width: `${progressRatio * 100}%` },
                ]}
              />
            </View>
          )}
        </View>

        <View style={styles.cardRight}>
          <Text style={styles.cardDate}>{item.date}</Text>
          <AntDesign name="right" size={16} color="#888" />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        {/* 뒤로가기 */}
        <TouchableOpacity
          style={styles.headerLeft}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>

        {/* 중앙 타이틀 (터치 통과) */}
        <Text
          style={styles.headerTitle}
          pointerEvents="none"
        >
          나의 기록
        </Text>

        {/* 우측 아이콘 */}
        <View style={styles.headerRight}>
          <TouchableOpacity
            onPress={() => navigation.navigate('Calendar')}
            style={{ marginRight: 16 }}
          >
            <Feather name="calendar" size={24} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
            <Feather name="settings" size={24} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      {/* SECTION HEADER */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>처방 목록</Text>
      </View>

      {/* LIST */}
      <FlatList
        data={records}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  // HEADER
  header: {
    height: 56,
    position: 'relative',
    backgroundColor: '#fff',
    borderBottomWidth: 0.5,
    borderColor: '#ddd',
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
    left: 0,
    right: 0,
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

  // SECTION HEADER
  sectionHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderColor: '#eee',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },

  // LIST
  listContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 30,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#E6F4FF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardBody: {
    flex: 1,
    paddingRight: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  cardClinic: {
    fontSize: 13,
    color: '#666',
    marginBottom: 8,
  },
  progressWrapper: {
    height: 4,
    backgroundColor: '#fff',
    borderRadius: 2,
    overflow: 'hidden',
    marginTop: 4,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#3C4CF1',
  },
  cardRight: {
    alignItems: 'flex-end',
  },
  cardDate: {
    fontSize: 12,
    color: '#888',
    marginBottom: 4,
  },
});