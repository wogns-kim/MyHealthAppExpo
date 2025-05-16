// src/screens/QuestionDetailScreen.js
import React, { useState, useEffect, useCallback } from 'react';
import {
    SafeAreaView,
    View,
    Text,
    TouchableOpacity,
    TextInput,
    FlatList,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';

export default function QuestionDetailScreen() {
    const navigation = useNavigation();
    const { post } = useRoute().params;

    // 댓글 목록을 상태로 관리
    const [comments, setComments] = useState([
        { id: 'c1', author: '@약사의조언', text: '처음엔 그런 증상 있지만 곧 적응됩니다!', time: '2025.04.10 11:15', type: 'first' },
        { id: 'c1-1', author: '@hihi행복144', text: '네! 저는 괜찮아졌어요, 감사합니다!', time: '2025.04.10 15:09', replyTo: 'c1' },
        { id: 'c2', author: '@피곤한당', text: '저도 힘이 없었어요. 상담 받아보세요^^', time: '2025.04.10 11:47' },
        { id: 'c3', author: '@천천히건강', text: '운동과 식단 병행하면 피로감 줄어요~', time: '2025.04.10 12:02' },
    ]);
    const [commentText, setCommentText] = useState('');

    // 탭 바 숨기기
    useEffect(() => {
        const parent = navigation.getParent();
        parent?.setOptions({ tabBarStyle: { display: 'none' } });
        return () => parent?.setOptions({ tabBarStyle: undefined });
    }, [navigation]);

    // 현재 시간 문자열 (HH:MM)
    const getCurrentTime = () => {
        const d = new Date();
        return `${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`;
    };

    // 새 댓글 등록
    const handleSend = useCallback(() => {
        const text = commentText.trim();
        if (!text) return;
        const newComment = {
            id: Date.now().toString(),
            author: '@익명',
            text,
            time: getCurrentTime(),
        };
        setComments(prev => [...prev, newComment]);
        setCommentText('');
    }, [commentText]);

    // 댓글 렌더러
    const renderComment = ({ item }) => (
        <View style={[styles.commentRow, item.replyTo && styles.replyRow]}>
            {item.type === 'first' && (
                <Text style={[styles.commentType, styles.firstType]}>첫댓글</Text>
            )}
            {item.replyTo && (
                <Text style={[styles.commentType, styles.replyType]}>답글</Text>
            )}
            <Text style={styles.commentAuthor}>{item.author}</Text>
            <Text style={styles.commentText}>{item.text}</Text>
            <Text style={styles.commentTime}>{item.time}</Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={comments}
                keyExtractor={i => i.id}
                renderItem={renderComment}
                // 댓글들 사이에 구분선
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                ListHeaderComponent={() => (
                    <>
                        {/* 헤더 */}
                        <View style={styles.header}>
                            <TouchableOpacity onPress={() => navigation.goBack()}>
                                <Ionicons name="chevron-back" size={24} color="#000" />
                            </TouchableOpacity>
                            <Text style={styles.headerTitle}>💬 궁금해요</Text>
                            <View style={{ width: 24 }} />
                        </View>
                        <View style={styles.separator} />

                        {/* 질문 본문 */}
                        <View style={styles.postContainer}>
                            <Text style={styles.postTitle}>{post.title}</Text>
                            <View style={styles.postMeta}>
                                <Text style={styles.metaAuthor}>{post.author || '@익명'}</Text>
                                <Text style={styles.metaDot}>·</Text>
                                <Ionicons name="eye-outline" size={14} color="#888" />
                                <Text style={styles.metaText}>{post.views}</Text>
                                <Text style={[styles.metaText, { marginLeft: 16 }]}>{post.time}</Text>
                            </View>
                            <Text style={styles.postContent}>{post.excerpt}</Text>
                        </View>
                        <View style={styles.separator} />

                        {/* 댓글 헤더 */}
                        <Text style={styles.commentHeader}>댓글 {comments.length}</Text>
                    </>
                )}
                contentContainerStyle={{ paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
            />

            {/* 고정된 입력창 */}
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                <View style={styles.inputBox}>
                    <TextInput
                        style={styles.input}
                        placeholder="댓글을 입력해주세요"
                        value={commentText}
                        onChangeText={setCommentText}
                        returnKeyType="send"
                        onSubmitEditing={handleSend}
                    />
                    <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
                        <Ionicons name="send" size={20} color="#fff" />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },

    /* 헤더 */
    header: {
        height: 56,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
    },
    headerTitle: { fontSize: 18, fontWeight: 'bold' },

    /* 구분선 */
    separator: {
        height: 1,
        backgroundColor: '#eee',
        marginHorizontal: 16,
    },

    /* 질문 본문 */
    postContainer: {
        padding: 16,
    },
    postTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
    postMeta: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
    metaAuthor: { fontSize: 12, color: '#888' },
    metaDot: { marginHorizontal: 4, color: '#888' },
    metaText: { fontSize: 12, color: '#888', marginLeft: 4 },
    postContent: { fontSize: 14, color: '#444', lineHeight: 20 },

    commentHeader: {
        fontSize: 16,
        fontWeight: 'bold',
        marginHorizontal: 16,
        marginVertical: 8,
    },

    /* 댓글 */
    commentRow: { marginHorizontal: 16, paddingVertical: 8 },
    replyRow: { paddingLeft: 24 },
    commentType: {
        fontSize: 12,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderWidth: 1,
        borderRadius: 4,
        alignSelf: 'flex-start',
        marginBottom: 4,
    },
    firstType: {
        backgroundColor: '#3C4CF1',
        borderColor: '#3C4CF1',
        color: '#fff',
    },
    replyType: { borderColor: '#666', color: '#666' },
    commentAuthor: { fontSize: 14, fontWeight: '600', marginBottom: 4 },
    commentText: { fontSize: 14, color: '#333', lineHeight: 20 },
    commentTime: { fontSize: 12, color: '#888', marginTop: 4 },

    /* 고정된 댓글 입력창 */
    inputBox: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        flexDirection: 'row',
        alignItems: 'center',
        borderTopWidth: 1,
        borderColor: '#eee',
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        paddingVertical: Platform.OS === 'ios' ? 12 : 8,
    },
    input: { flex: 1, fontSize: 14 },
    sendBtn: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#3C4CF1',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8,
    },
});
