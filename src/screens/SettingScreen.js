// src/screens/SettingsScreen.js
import React from 'react';
import {
    SafeAreaView,
    View,
    TouchableOpacity,
    Text,
    StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export default function SettingsScreen() {
    const navigation = useNavigation();

    // 실제로 이동할 화면이 없으면 onPress 안에 Alert나 빈 함수로 대체하세요
    const menuItems = [
        { label: '가족 회원 관리', onPress: () => navigation.navigate('FamilyManage') },
        { label: '로그인 정보', onPress: () => navigation.navigate('LoginInfo') },
        { label: '개인정보처리방침', onPress: () => navigation.navigate('PrivacyPolicy') },
        { label: '버전 정보', onPress: () => navigation.navigate('VersionInfo') },
        { label: '고객센터 / 문의하기', onPress: () => navigation.navigate('CustomerService') },
        { label: '로그아웃', onPress: () => {/* TODO: 로그아웃 처리 */ } },
        { label: '계정탈퇴', onPress: () => {/* TODO: 계정탈퇴 처리 */ } },
    ];

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                >
                    <Ionicons name="chevron-back" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>설정</Text>
            </View>

            {/* Menu List */}
            <View style={styles.menu}>
                {menuItems.map((item, idx) => (
                    <TouchableOpacity
                        key={idx}
                        style={styles.menuItem}
                        onPress={item.onPress}
                    >
                        <Text style={styles.menuText}>{item.label}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        height: 56,
        borderBottomWidth: 0.5,
        borderColor: '#ddd',
        justifyContent: 'center',
        alignItems: 'center',
    },
    backButton: {
        position: 'absolute',
        left: 16,
        top: 16,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    menu: {
        marginTop: 20,
    },
    menuItem: {
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderBottomWidth: 0.5,
        borderColor: '#eee',
    },
    menuText: {
        fontSize: 16,
    },
});