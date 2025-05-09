import { SafeAreaView, View, Text, ScrollView, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';

export default function InfoDetailScreen() {
    const route = useRoute();
    const navigation = useNavigation();
    const { title, content } = route.params;

    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <AntDesign name="arrowleft" size={24} color="black" />
            </TouchableOpacity>

            <ScrollView contentContainerStyle={styles.scroll}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.body}>{content}</Text>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: Platform.OS === 'ios' ? 70 : 50,
        paddingHorizontal: 28, // 여백 넉넉히
    },
    scroll: {
        paddingTop: 30,          // 상단 여백 추가
        paddingHorizontal: 30,
        paddingBottom: 70,
    },
    backButton: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 50 : 30, // 버튼 아래로 이동
        left: 16,
        zIndex: 10,
    },

    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#000',
    },
    body: {
        fontSize: 16,
        lineHeight: 28,
        color: '#222',
    },
});
