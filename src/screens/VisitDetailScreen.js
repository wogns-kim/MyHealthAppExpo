// src/screens/VisitDetailScreen.js
import React, { useCallback } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

export default function VisitDetailScreen() {
  const navigation = useNavigation();

  // 오늘 날짜 포맷 (예: 5월 5일, 오늘)
  const today = new Date();
  const month = today.getMonth() + 1;
  const date = today.getDate();
  const headerTitle = `${month}월 ${date}일, 오늘`;

  // 헤더 커스터마이징
  useFocusEffect(
    useCallback(() => {
      navigation.setOptions({
        headerStyle: {
          backgroundColor: '#fff',
          shadowColor: 'transparent',
          elevation: 0,
        },
        headerTintColor: '#000',
        headerTitle: headerTitle,
        headerTitleAlign: 'center',

        // 좌측 뒤로가기
        headerLeft: () => (
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
        ),

        // 우측 달력 / 설정 아이콘
        headerRight: () => (
          <View style={styles.headerRightContainer}>
            <TouchableOpacity
              onPress={() => navigation.navigate('Calendar')}
              style={styles.headerButton}
            >
              <Ionicons name="calendar-outline" size={24} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {/* TODO: 설정 화면으로 */ }}
              style={styles.headerButton}
            >
              <Ionicons name="settings-outline" size={24} color="#000" />
            </TouchableOpacity>
          </View>
        ),
      });
    }, [navigation, headerTitle])
  );

  // 샘플 데이터 (하드코딩)
  const hospital = {
    name: '월내과의원',
    label: '내과',
    doctor: '한석규',
    address: '인천 미추홀구 독배로 309 302호, 303호',
    phone: '032-882-8822',
    website: 'http://www.ysleaders.co.kr/',
  };
  const pharmacy = {
    name: '큰사랑약국',
    label: '약국',
    pharmacist: '조은미',
    address: '인천 미추홀구 독배로 309 302호, 103호',
    phone: '032-888-9270',
    website: 'https://naver.me/FUh48DWr',
  };

  const openLink = url => {
    Linking.canOpenURL(url).then(supported => {
      if (supported) Linking.openURL(url);
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.body}>
        {/* 오늘 방문한 병원 */}
        <Text style={styles.sectionTitle}>오늘 방문한 병원</Text>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.placeName}>{hospital.name}</Text>
            <View style={styles.headerRight}>
              <Text style={styles.placeLabel}>{hospital.label}</Text>
              <TouchableOpacity onPress={() => {/* TODO: 편집 로직 */ }} style={styles.editButton}>
                <Ionicons name="pencil-outline" size={20} color="#666" />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="person-outline" size={16} color="#666" style={styles.infoIcon} />
            <Text style={styles.infoText}>담당의 {hospital.doctor}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={16} color="#666" style={styles.infoIcon} />
            <Text style={styles.infoText}>{hospital.address}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="call-outline" size={16} color="#666" style={styles.infoIcon} />
            <Text style={styles.infoText}>{hospital.phone}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="globe-outline" size={16} color="#666" style={styles.infoIcon} />
            <Text style={[styles.infoText, styles.linkText]} onPress={() => openLink(hospital.website)}>
              {hospital.website}
            </Text>
          </View>
        </View>

        {/* 오늘 방문한 약국 */}
        <Text style={styles.sectionTitle}>오늘 방문한 약국</Text>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.nameWithLabel}>
              <Text style={styles.placeName}>{hospital.name}</Text>
              <Text style={styles.placeLabel}>{hospital.label}</Text>
            </View>
            <TouchableOpacity onPress={() => {/* TODO */ }} style={styles.editButton}>
              <Ionicons name="pencil-outline" size={20} color="#666" />
            </TouchableOpacity>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="medkit-outline" size={16} color="#666" style={styles.infoIcon} />
            <Text style={styles.infoText}>담당약사 {pharmacy.pharmacist}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={16} color="#666" style={styles.infoIcon} />
            <Text style={styles.infoText}>{pharmacy.address}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="call-outline" size={16} color="#666" style={styles.infoIcon} />
            <Text style={styles.infoText}>{pharmacy.phone}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="globe-outline" size={16} color="#666" style={styles.infoIcon} />
            <Text style={[styles.infoText, styles.linkText]} onPress={() => openLink(pharmacy.website)}>
              {pharmacy.website}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  body: { padding: 16 },

  headerButton: { paddingHorizontal: 12 },
  headerRightContainer: { flexDirection: 'row' },

  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111',
    marginBottom: 8,
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
    padding: 12,
    marginBottom: 16,
  },

  // 수정된 cardHeader
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },

  // 새로 추가: 이름과 라벨을 묶기 위한 컨테이너
  nameWithLabel: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  placeName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2a2aff',
    marginRight: 6,
  },

  placeLabel: {
    fontSize: 14,
    color: '#666',
  },

  editButton: {
    padding: 4,
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  infoIcon: { width: 20 },
  infoText: { fontSize: 14, color: '#333', marginLeft: 4 },
  linkText: { textDecorationLine: 'underline', color: '#1e88e5' },
});

