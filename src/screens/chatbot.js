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
        return `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, '0')}.${String(today.getDate()).padStart(2, '0')}`;
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

    const sendQuestion = (text) => {
        const trimmed = text.trim();
        if (!trimmed) return;

        const userMessage = {
            id: Date.now().toString(),
            sender: 'user',
            text: trimmed,
            time: getCurrentTime(),
        };

        setMessages(prev => [...prev, userMessage]);
        setIsTyping(true);

        const typingMessage = {
            id: `typing-${Date.now()}`,
            sender: 'typing',
        };
        setMessages(prev => [...prev, typingMessage]);

        axios.post(
            'https://681e-165-246-131-35.ngrok-free.app/api/chat/bot/',
            { query: trimmed },
            { headers: { 'Content-Type': 'application/json' } }
        )
            .then(response => {
                const botMessage = {
                    id: Date.now().toString(),
                    sender: 'bot',
                    text: response.data.answer || '응답이 없습니다.',
                    time: getCurrentTime(),
                };
                setMessages(prev =>
                    [...prev.filter(msg => msg.sender !== 'typing'), botMessage]
                );
            })
            .catch(() => {
                const errorMessage = {
                    id: Date.now().toString(),
                    sender: 'bot',
                    text: '서버 오류가 발생했습니다. 나중에 다시 시도해 주세요.',
                    time: getCurrentTime(),
                };
                setMessages(prev =>
                    [...prev.filter(msg => msg.sender !== 'typing'), errorMessage]
                );
            })
            .finally(() => {
                setIsTyping(false);
            });
    };



    useEffect(() => {
        if (question) {
            //setInputText(question);
            sendQuestion(question);
        }
    }, [question]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const renderItem = ({ item }) => {
        if (item.sender === 'typing') {
            return (
                <View style={styles.typingIndicatorWrapper}>
                    <Image
                        source={require('../../assets/loading.png')}
                        style={styles.loaderImage}
                        resizeMode="contain"
                    />
                </View>
            );
        }

        return (
            <View
                style={[
                    styles.messageContainer,
                    item.sender === 'user' ? styles.userMessage : styles.botMessage,
                ]}
            >
                <Text style={[styles.messageText, item.sender === 'user' && { color: 'white' }]}>
                    {item.text}
                </Text>
                <Text style={styles.timeText}>{item.time}</Text>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="chevron-back" size={24} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>기억해약 챗봇</Text>
                <View style={{ width: 24 }} />
            </View>

            <Text style={styles.date}>{getToday()}</Text>

            <FlatList
                ref={flatListRef}
                data={messages}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.chat}
                onContentSizeChange={scrollToBottom}
            />

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="메시지를 입력하세요"
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
    container: { flex: 1, padding: 16, backgroundColor: 'white' },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    headerTitle: { fontSize: 18, fontWeight: 'bold' },
    date: { alignSelf: 'center', color: '#888', marginBottom: 16 },
    chat: { flexGrow: 1 },
    messageContainer: {
        maxWidth: '80%',
        borderRadius: 12,
        padding: 12,
        marginBottom: 12,
    },
    userMessage: {
        backgroundColor: '#4B61FF',
        alignSelf: 'flex-end',
    },
    botMessage: {
        backgroundColor: '#F2F2F2',
        alignSelf: 'flex-start',
    },
    messageText: { color: '#000' },
    timeText: { fontSize: 10, color: '#000', marginTop: 4, textAlign: 'right' },
    typingIndicatorWrapper: {
        alignSelf: 'flex-start',
        paddingHorizontal: 0,   
        marginLeft: -4,        
        marginBottom: 12,
    },
    loaderImage: {
        width: 300,
        height: 300,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderTopWidth: 1,
        borderColor: '#ccc',
        paddingVertical: 8,
        paddingHorizontal: 12,
    },
    input: { flex: 1, fontSize: 16 },
    sendButton: {
        backgroundColor: '#4B61FF',
        borderRadius: 20,
        padding: 10,
        marginLeft: 8,
    },
});
