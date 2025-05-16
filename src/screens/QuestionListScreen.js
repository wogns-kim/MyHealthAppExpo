// src/screens/QuestionListScreen.js
import React, { useState } from 'react';
import {
    SafeAreaView,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    StyleSheet
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function QuestionListScreen() {
    const navigation = useNavigation();
    const [search, setSearch] = useState('');

    const recommendedTags = [
        '예방 접종', '봄철 감기', '미세먼지',
        '공복 복용', '졸음 유발 약', '혈당 수치'
    ];

    const postList = [
        {
            id: '1',
            title: '약먹을 때 물 말고 다른 음료도 괜찮나요?',
            excerpt: '밖에서 약을 먹어야 하는데 물이 없어서 보리차 음료를 마셔도 될까요?',
            views: 15012,
            comments: 6,
            time: '1시간 전',
        },
        {
            id: '2',
            title: '감기약이랑 두통약 같이 먹어도 되나요?',
            excerpt: '처방받은 감기약으로는 두통이 잘 낫질 않는데 집에 두통약을 같이 먹어도 될까요?',
            views: 10894,
            comments: 4,
            time: '2시간 전',
        },
        {
            id: '3',
            title: '공복에 약 먹으면 안 되는 이유가 뭔가요?',
            excerpt: '아침에 출근 전에 급하게 약을 먹는데, 식전이랑 식후가 헷갈려요',
            views: 10894,
            comments: 4,
            time: '2시간 전',
        },
        {
            id: '4',
            title: '당뇨 약 먹고 나면 너무 피곤해요',
            excerpt: '약 먹고 나면 졸리고 기운이 없어요, 혹시 약 때문일 수도 있을 것 같아서 물어봐요',
            views: 10894,
            comments: 4,
            time: '2시간 전',
        },
        {
            id: '5',
            title: '항생제 먹을 때 유산균도 같이 먹어야 하나요?',
            excerpt: '약 먹고 나면 졸리고 기운이 없어요, 혹시 약 때문일 수도 있을 것 같아서 물어봐요',
            views: 10894,
            comments: 4,
            time: '2시간 전',
        },
        // ... 추가 항목
    ];

    const filtered = postList.filter(p =>
        p.title.includes(search) || p.excerpt.includes(search)
    );

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.postCard}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('QuestionDetail', { post: item })}
        >
            <Text style={styles.postTitle}>{item.title}</Text>
            <Text style={styles.postExcerpt} numberOfLines={2}>{item.excerpt}</Text>
            <View style={styles.postMeta}>
                <View style={styles.metaItem}>
                    <Ionicons name="eye-outline" size={14} color="#888" />
                    <Text style={styles.metaText}>{item.views.toLocaleString()}</Text>
                </View>
                <View style={styles.metaItem}>
                    <Ionicons name="chatbubble-outline" size={14} color="#888" />
                    <Text style={styles.metaText}>{item.comments}</Text>
                </View>
                <Text style={[styles.metaText, { marginLeft: 'auto' }]}>{item.time}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>💬 궁금해요</Text>
                <View style={{ width: 24 }} />
            </View>

            {/* Search + Tags */}
            <View style={styles.body}>
                <View style={styles.searchBox}>
                    <Ionicons name="search-outline" size={20} color="#888" />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="어떤 고민이든 검색해 보세요."
                        placeholderTextColor="#888"
                        value={search}
                        onChangeText={setSearch}
                    />
                </View>

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

                <FlatList
                    data={filtered}
                    keyExtractor={item => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 56,
        paddingHorizontal: 16,
        borderBottomWidth: 0.5,
        borderColor: '#eee',
    },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#000' },

    body: { flex: 1, padding: 16 },

    searchBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F2F2F8',
        borderRadius: 8,
        paddingHorizontal: 12,
        height: 40,
        marginBottom: 16,
    },
    searchInput: { flex: 1, marginLeft: 8, fontSize: 14, color: '#333' },

    tagsRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 24 },
    tagButton: {
        backgroundColor: '#F2F2F8',
        borderRadius: 16,
        paddingHorizontal: 12,
        paddingVertical: 6,
        marginRight: 8,
        marginBottom: 8,
    },
    tagText: { fontSize: 13, color: '#333' },

    listContent: { paddingBottom: 80 },

    postCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 8,
        elevation: 2,
    },
    postTitle: { fontSize: 16, fontWeight: 'bold', color: '#000', marginBottom: 8 },
    postExcerpt: { fontSize: 14, color: '#666', marginBottom: 12, lineHeight: 20 },

    postMeta: { flexDirection: 'row', alignItems: 'center' },
    metaItem: { flexDirection: 'row', alignItems: 'center', marginRight: 16 },
    metaText: { fontSize: 12, color: '#888', marginLeft: 4 },
});
