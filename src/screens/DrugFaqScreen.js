import React, { useState } from 'react';
import {
    SafeAreaView,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function DrugFaqScreen() {
    const navigation = useNavigation();
    const [search, setSearch] = useState('');

    const recommendedTags = [
        '예방 접종', '봄철 감기', '미세먼지',
        '공복 복용', '졸음 유발 약', '혈당 수치',
    ];

    const questions = [
        '🍺 약 복용 중 술 마셔도 될까?',
        '🛌 졸음을 유발하는 약 리스트',
        '👵👶 노인/임산부 복약 시 유의사항',
        '💡 이 약은 왜 꼭 식후에 먹어야 하나요?',
        '☕️ 약 먹고 커피 마셔도 되나요?',
        '🩸 혈당 수치 낮을 땐 약을 건너뛰어도 되나요?',
        '🍝 당뇨약 먹을 땐 어떤 음식 피해야 하나요?',
        '📉 다이어트 약이랑 당뇨약 같이 복용해도 되나요?',
        '🔁 약을 오래 먹다 보면 몸이 내성이 생기나요?',
        '🔍 콜레스테롤 낮추는 약 먹을 땐 계란도 피해야 하나요?',
        '💉 혈압약과 당뇨약 같이 먹어도 문제 없나요?',
        '🥛 혈압약 먹을 땐 소금 섭취를 얼마나 줄여야 하나요?',
    ];

    const filtered = questions.filter(q =>
        q.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>💊 약 복용 궁금증</Text>
                <View style={{ width: 24 }} />
            </View>

            {/* Body */}
            <ScrollView contentContainerStyle={styles.content}>
                {/* Search */}
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

                {/* Tags */}
                <Text style={styles.sectionTitleSmall}>추천 검색어</Text>
                <View style={styles.tagsRow}>
                    {recommendedTags.map((tag, i) => (
                        <TouchableOpacity
                            key={i}
                            style={styles.tagButton}
                            onPress={() => setSearch(tag)}
                        >
                            <Text style={styles.tagText}>{tag}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* FAQ List */}
                {filtered.map((q, idx) => (
                    <TouchableOpacity
                        key={idx}
                        style={styles.faqItem}
                        onPress={() => navigation.navigate('chatbot', { question: q })}
                    >
                        <Text style={styles.faqText}>Q. {q}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Floating Chatbot */}
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

    faqItem: {
        paddingVertical: 12,
        borderBottomWidth: 0.5,
        borderColor: '#eee',
    },
    faqText: { fontSize: 15, color: '#333' },

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
