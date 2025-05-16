import React, { useState } from 'react';
import { Alert, Image } from 'react-native'; // ✅ Image 추가

import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
  StyleSheet,
} from 'react-native';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import QuestionDetailScreen from './QuestionDetailScreen';


export default function SolutionScreen() {
  const navigation = useNavigation();
  const [search, setSearch] = useState('');

  const recommendedTags = [
    '예방 접종',
    '봄철 감기',
    '미세먼지',
    '공복 복용',
    '졸음 유발 약',
    '혈당 수치',
  ];

  const faqList = [
    { id: '1', question: '🍺 약 복용 중 술 마셔도 될까?' },
    { id: '2', question: '💤 졸음을 유발하는 약 리스트' },
    { id: '3', question: '👵👶 노인/임산부 복약 시 유의사항' },
    { id: '4', question: '💡 이 약은 왜 꼭 식후에 먹어야 하나요?' },
    { id: '5', question: '☕️ 약 먹고 커피 마셔도 되나요?' },
  ];

  const postList = [
    {
      id: 'a',
      title: '약먹을 때 물 말고 다른 음료도 괜찮나요?',
      views: 15012,
      comments: 6,
      time: '1시간 전',
    },
    {
      id: 'b',
      title: '감기약이랑 두통약 같이 먹어도 되나요?',
      views: 10894,
      comments: 4,
      time: '2시간 전',
    },
  ];

  const handleFaqPress = async (question) => {
    try {
      const response = await fetch('https://3140-165-246-131-35.ngrok-free.app/api/chat/bot/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: question }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      Alert.alert('답변', data.response || '응답이 없습니다.');
    } catch (error) {
      console.error('요청 실패:', error);
      Alert.alert('오류', '서버 응답 처리 중 문제가 발생했습니다.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>고민해결</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={20} color="#888" style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="어떤 고민이든 검색해 보세요."
            placeholderTextColor="#888"
            value={search}
            onChangeText={setSearch}
          />
        </View>

        <Text style={styles.sectionTitleSmall}>추천 검색어</Text>
        <View style={styles.tagsRow}>
          {recommendedTags.map((tag, idx) => (
            <TouchableOpacity key={idx} style={styles.tagButton}>
              <Text style={styles.tagText}>{tag}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.sectionHeader}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>

            <Text style={styles.sectionTitle}>💊 약 복용 궁금증</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('DrugFaq')}>
            <Text style={styles.viewAll}>전체보기</Text>
          </TouchableOpacity>

        </View>

        {faqList.map(item => (
          <TouchableOpacity
            key={item.id}
            style={styles.faqItem}
            onPress={() => navigation.navigate('chatbot', { question: item.question })}
          >
            <Text style={styles.faqText}>Q. {item.question}</Text>
          </TouchableOpacity>
        ))}

        <View style={[styles.sectionHeader, { marginTop: 24 }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="chatbubble-ellipses-outline" size={20} color="#000" style={{ marginRight: 6 }} />
            <Text style={styles.sectionTitle}>궁금해요</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('QuestionList')}>
            <Text style={styles.viewAll}>전체보기</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={postList}
          keyExtractor={item => item.id}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.postCard}
              activeOpacity={0.7}
              onPress={() => navigation.navigate('QuestionDetail', { post: item })}
            >
              <Text style={styles.postTitle}>{item.title}</Text>
              <View style={styles.postMeta}>
                <View style={styles.metaItem}>
                  <Ionicons name="eye-outline" size={14} color="#888" />
                  <Text style={styles.metaText}>{item.views}</Text>
                </View>
                <View style={styles.metaItem}>
                  <Ionicons name="chatbubble-outline" size={14} color="#888" />
                  <Text style={styles.metaText}>{item.comments}</Text>
                </View>
                <Text style={styles.metaText}>{item.time}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </ScrollView>

      {/* ✅ 챗봇 버튼 추가 */}
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

  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 0.5,
    borderColor: '#eee',
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },

  content: { padding: 16, paddingBottom: 40 },

  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F8',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
    marginBottom: 16,
  },
  searchInput: { flex: 1, fontSize: 14 },

  sectionTitleSmall: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
  },
  tagButton: {
    backgroundColor: '#F2F2F8',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: { fontSize: 13, color: '#333' },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 16, fontWeight: 'bold' },
  viewAll: { fontSize: 14, color: '#3C4CF1' },

  faqItem: {
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderColor: '#eee',
  },
  faqText: { fontSize: 15, color: '#333' },

  postCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  postTitle: { fontSize: 15, color: '#333', marginBottom: 8 },
  postMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  metaText: { fontSize: 12, color: '#888', marginLeft: 4 },

  // ✅ 챗봇 버튼 스타일 추가
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
    width: 190,
    height: 190,
    marginBottom: 5,
  },
});
