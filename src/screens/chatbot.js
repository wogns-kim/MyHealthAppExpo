import React, { useEffect, useRef, useState } from 'react';
import {
    SafeAreaView,
    View,
    Text,
    TouchableOpacity,
    TextInput,
    StyleSheet,
    FlatList,
    Image,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useRoute, useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Animatable from 'react-native-animatable';

export default function ChatScreen() {
    const route = useRoute();
    const navigation = useNavigation();
    const { question } = route.params || {};

    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const flatListRef = useRef(null);

    const getToday = () => {
        const today = new Date();
        return `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, '0')}.${String(
            today.getDate(),
        ).padStart(2, '0')}`;
    };

    const getCurrentTime = () => {
        const date = new Date();
        return `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
    };

    const scrollToBottom = () => {
        if (flatListRef.current) {
            flatListRef.current.scrollToEnd({ animated: true });
        }
    };

    const sendQuestion = async (text) => {
        const trimmed = text.trim();
        if (!trimmed) return;

        const userMessage = {
            id: Date.now().toString(),
            sender: 'user',
            text: trimmed,
            time: getCurrentTime(),
        };
        setMessages((prev) => [...prev, userMessage]);
        setIsTyping(true);

        try {
            const token = await AsyncStorage.getItem('authToken');

            const response = await axios.post(
                '  ',
                { query: trimmed },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const botMessage = {
                id: Date.now().toString(),
                sender: 'bot',
                text: response.data.answer || '응답이 없습니다.',
                time: getCurrentTime(),
            };
            setMessages((prev) => [...prev, botMessage]);
        } catch (error) {
            const errorMessage = {
                id: Date.now().toString(),
                sender: 'bot',
                text: '서버 오류가 발생했습니다. 나중에 다시 시도해 주세요.',
                time: getCurrentTime(),
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsTyping(false);
        }
    };

    useEffect(() => {
        if (question) sendQuestion(question);
    }, [question]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const renderItem = ({ item }) => {
        if (item.sender === 'bot') {
            return (
                <View style={styles.botRow}>
                    <View style={styles.botAvatarCircle}>
                        <Image
                            source={require('../../assets/chatbotch.png')}
                            style={styles.botAvatarIcon}
                            resizeMode="contain"
                        />
                    </View>
                    <View style={styles.botBubble}>
                        <Text style={styles.botText}>{item.text}</Text>
                        <Text style={styles.timeText}>{item.time}</Text>
                        <View style={styles.botBubbleTail} />
                    </View>
                </View>
            );
        }

        // user 메시지
        return (
            <View style={styles.userRow}>
                <View style={styles.userBubble}>
                    <Text style={[styles.messageText, { color: 'white' }]}>{item.text}</Text>
                    <Text style={styles.timeText}>{item.time}</Text>
                    <View style={styles.userBubbleTail} />
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="chevron-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>기억해약 챗봇</Text>
                <View style={{ width: 24 }} />
            </View>

            <View style={styles.chatContainer}>
                <Text style={styles.date}>{getToday()}</Text>
                <FlatList
                    ref={flatListRef}
                    data={messages}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.chatList}
                    onContentSizeChange={scrollToBottom}
                />

                {isTyping && (
                    <View style={styles.typingInline}>
                        <View style={styles.dotContainer}>
                            <Animatable.View
                                animation="pulse"
                                iterationCount="infinite"
                                duration={600}
                                delay={0}
                                style={styles.dot}
                            />
                            <Animatable.View
                                animation="pulse"
                                iterationCount="infinite"
                                duration={600}
                                delay={200}
                                style={styles.dot}
                            />
                            <Animatable.View
                                animation="pulse"
                                iterationCount="infinite"
                                duration={600}
                                delay={400}
                                style={styles.dot}
                            />
                        </View>
                    </View>
                )}
            </View>

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                <View style={styles.inputWrapper}>
                    <TextInput
                        style={styles.input}
                        placeholder="메시지를 입력하세요"
                        placeholderTextColor="#888"
                        value={inputText}
                        onChangeText={setInputText}
                        onSubmitEditing={() => {
                            sendQuestion(inputText);
                            setInputText('');
                        }}
                        returnKeyType="send"
                    />
                    <TouchableOpacity
                        style={styles.sendButton}
                        onPress={() => {
                            sendQuestion(inputText);
                            setInputText('');
                        }}
                    >
                        <Icon name="send" size={20} color="white" />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#EEF2FF' },

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#000' },

    chatContainer: {
        flex: 1,
        paddingHorizontal: 16,
        position: 'relative', // overlay 위치 기준
    },
    date: {
        textAlign: 'center',
        color: '#888',
        marginVertical: 12,
        fontSize: 14,
    },
    chatList: {
        paddingBottom: 16,
    },

    typingOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
        backgroundColor: 'transparent',
    },
    dotContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#4B61FF',
        marginHorizontal: 4,
    },

    botRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        marginBottom: 12,
    },
    botAvatarCircle: {
        width: 40,
        height: 40,
        backgroundColor: '#3C4CF1',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
    },
    botAvatarIcon: {
        width: 130,
        height: 130,
        tintColor: '#fff',
        marginBottom: 3,
    },
    botBubble: {
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: 12,
        maxWidth: '75%',
        position: 'relative',
    },
    botText: { color: '#000', lineHeight: 20 },
    botBubbleTail: {
        position: 'absolute',
        left: -6,
        bottom: 12,
        width: 0,
        height: 0,
        borderTopWidth: 6,
        borderTopColor: 'transparent',
        borderRightWidth: 6,
        borderRightColor: '#FFF',
        borderBottomWidth: 6,
        borderBottomColor: 'transparent',
    },

    userRow: {
        alignSelf: 'flex-end',
        marginBottom: 12,
        paddingHorizontal: 16,
    },
    userBubble: {
        backgroundColor: '#4B61FF',
        borderRadius: 12,
        padding: 12,
        maxWidth: '80%',
        position: 'relative',
    },
    userBubbleTail: {
        position: 'absolute',
        right: -6,
        bottom: 12,
        width: 0,
        height: 0,
        borderTopWidth: 6,
        borderTopColor: 'transparent',
        borderLeftWidth: 6,
        borderLeftColor: '#4B61FF',
        borderBottomWidth: 6,
        borderBottomColor: 'transparent',
    },

    messageText: { color: '#000' },
    timeText: { fontSize: 10, color: '#000', marginTop: 4, textAlign: 'right' },

    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        margin: 16,
        borderRadius: 24,
        paddingHorizontal: 16,
        paddingVertical: Platform.OS === 'ios' ? 12 : 8,
        marginBottom: Platform.OS === 'ios' ? 32 : 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    input: { flex: 1, fontSize: 16, color: '#333' },
    sendButton: {
        backgroundColor: '#4B61FF',
        borderRadius: 20,
        padding: 10,
        marginLeft: 8,
    },
});
