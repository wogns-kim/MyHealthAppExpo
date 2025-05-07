// src/screens/MyPageScreen.js
import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    SafeAreaView,
    Alert,
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { registerUser, createProfile } from './constants';  

export default function MyPageScreen() {
    const navigation = useNavigation();

    // — 모든 입력을 state 로 관리
    const [name, setName] = useState('');
    const [gender, setGender] = useState(null);
    const [birthDate, setBirthDate] = useState('');
    const [tempChronic, setTempChronic] = useState('');
    const [chronicList, setChronicList] = useState([]);
    const [tempAllergy, setTempAllergy] = useState('');
    const [allergyList, setAllergyList] = useState([]);

    // 만성질환 / 알레르기 추가
    const addChronic = () => {
        const t = tempChronic.trim();
        if (t) {
            setChronicList(prev => [...prev, t]);
            setTempChronic('');
        }
    };
    const addAllergy = () => {
        const t = tempAllergy.trim();
        if (t) {
            setAllergyList(prev => [...prev, t]);
            setTempAllergy('');
        }
    };

    // — 회원가입 + 프로필 생성을 한 번에 처리
    const onRegisterAndCreateProfile = async () => {
        try {
            // 1️⃣ 회원가입 → 토큰 저장(AsyncStorage에 자동 저장됨)
            const token = await registerUser({
                username: 'kim',
                password: 'password123',
            });

            // 2️⃣ 프로필 생성 (createProfile 내부에서 AsyncStorage에서 토큰 꺼내 헤더에 포함)
            await createProfile({
                name,
                birth_date: birthDate,
                gender:
                    gender === '남성' ? 'M' :
                        gender === '여성' ? 'F' : 'O',
                chronic_diseases: chronicList,
                allergies: allergyList,
            });

            Alert.alert('🎉 완료', '회원가입과 프로필 생성이 모두 완료되었습니다.');
            navigation.replace('MainTabs',{screen:'Home'});  // 필요에 따라 이동할 화면 이름으로 교체
        } catch (e) {
            console.warn(e);
            Alert.alert('🚨 오류', e.message);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* HEADER */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>마이페이지</Text>
                <View style={styles.headerIcons}>
                    <TouchableOpacity onPress={() => navigation.navigate('Calendar')}>
                        <Feather name="calendar" size={20} color="black" style={styles.iconSpacing} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
                        <Ionicons name="settings-outline" size={20} color="black" />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView style={styles.form}>
                {/* 이름 */}
                <View style={[styles.row, styles.rowHorizontal]}>
                    <Text style={styles.label}>이름</Text>
                    <TextInput
                        value={name}
                        onChangeText={setName}
                        style={styles.inputHalf}
                        placeholder="이름을 입력해주세요."
                    />
                </View>

                {/* 성별 */}
                <View style={[styles.row, styles.rowHorizontal]}>
                    <Text style={styles.label}>성별</Text>
                    <View style={styles.genderContainer}>
                        {['남성', '여성', '기타'].map(g => (
                            <TouchableOpacity
                                key={g}
                                onPress={() => setGender(g)}
                                style={[
                                    styles.genderButton,
                                    gender === g && styles.genderSelected,
                                ]}
                            >
                                <Text style={{ color: gender === g ? '#000' : '#999' }}>
                                    {g}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* 생년월일 */}
                <View style={[styles.row, styles.rowHorizontal]}>
                    <Text style={styles.label}>생년월일</Text>
                    <TextInput
                        value={birthDate}
                        onChangeText={setBirthDate}
                        style={styles.inputHalf}
                        placeholder="YYYY-MM-DD"
                    />
                </View>

                {/* 만성질환 */}
                <View style={styles.row}>
                    <View style={[styles.rowHorizontal, { alignItems: 'center' }]}>
                        <Text style={styles.label}>만성질환</Text>
                        <View style={styles.searchContainer}>
                            <View style={styles.searchBox}>
                                <TextInput
                                    value={tempChronic}
                                    onChangeText={setTempChronic}
                                    style={styles.searchInput}
                                    placeholder="병명 입력"
                                />
                                <Feather name="search" size={16} color="#999" />
                            </View>
                            <TouchableOpacity style={styles.plusWrapper} onPress={addChronic}>
                                <Text style={styles.plus}>＋</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    {chronicList.map((it, i) => (
                        <Text key={i} style={styles.listItem}>• {it}</Text>
                    ))}
                </View>

                {/* 알레르기 */}
                <View style={styles.row}>
                    <View style={[styles.rowHorizontal, { alignItems: 'center' }]}>
                        <Text style={styles.label}>알레르기</Text>
                        <View style={styles.searchContainer}>
                            <View style={styles.searchBox}>
                                <TextInput
                                    value={tempAllergy}
                                    onChangeText={setTempAllergy}
                                    style={styles.searchInput}
                                    placeholder="알레르기 입력"
                                />
                                <Feather name="search" size={16} color="#999" />
                            </View>
                            <TouchableOpacity style={styles.plusWrapper} onPress={addAllergy}>
                                <Text style={styles.plus}>＋</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    {allergyList.map((it, i) => (
                        <Text key={i} style={styles.listItem}>• {it}</Text>
                    ))}
                </View>

                {/* 완료 버튼 (회원가입 + 프로필 생성) */}
                <TouchableOpacity
                    style={styles.saveButton}
                    onPress={onRegisterAndCreateProfile}
                >
                    <Text style={styles.saveButtonText}>완료</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
 
    container: { flex: 1, backgroundColor: '#fff' },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 14,
        justifyContent: 'space-between',
        borderBottomWidth: 0.5,
        borderColor: '#ddd',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        position: 'absolute',
        left: '50%',
        transform: [{ translateX: -35 }],
    },
    headerIcons: { flexDirection: 'row' },
    iconSpacing: { marginRight: 16 },
    form: { paddingHorizontal: 20, paddingTop: 10, marginTop: 30 },
    row: { marginBottom: 24 },
    rowHorizontal: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    label: {
        fontSize: 15,
        fontWeight: 'bold',
        width: 90,
        marginRight: 16,
    },
    inputHalf: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        padding: 12,
    },
    genderContainer: {
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'flex-end',
    },
    genderButton: {
        borderWidth: 1,
        borderColor: '#ddd',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginLeft: 8,
    },
    genderSelected: {
        borderColor: '#000',
        backgroundColor: '#eee',
    },
    searchBox: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 10,
        flex: 1,
    },
    searchInput: {
        flex: 1,
        fontSize: 14,
    },
    searchContainer: {
        flex: 1,
        position: 'relative',
    },
    plusWrapper: {
        position: 'absolute',
        top: '100%',
        left: '50%',
        transform: [{ translateX: -12 }],
        marginTop: 8,
    },
    plus: {
        fontSize: 28,
        color: '#3F51B5',
    },
    listItem: {
        marginLeft: 106,
        marginTop: 4,
        color: '#555',
    },
    saveButton: {
        backgroundColor: '#3C4CF1',
        padding: 14,
        borderRadius: 8,
        marginTop: 30,
        alignItems: 'center',
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
    },
});