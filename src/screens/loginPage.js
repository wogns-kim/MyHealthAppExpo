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
    Platform,
    Modal,
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { registerUser, createProfile } from './constants';

export default function MyPageScreen() {
    const navigation = useNavigation();

    // 모든 입력을 state 로 관리
    const [name, setName] = useState('');
    const [gender, setGender] = useState(null);
    const [birthDate, setBirthDate] = useState('');
    const [birthDateRaw, setBirthDateRaw] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [tempChronic, setTempChronic] = useState('');
    const [chronicList, setChronicList] = useState([]);
    const [tempAllergy, setTempAllergy] = useState('');
    const [allergyList, setAllergyList] = useState([]);

    // 만성질환 추가
    const addChronic = () => {
        const t = tempChronic.trim();
        if (t) {
            setChronicList(prev => [...prev, t]);
            setTempChronic('');
        }
    };
    // 만성질환 삭제
    const removeChronic = index => {
        setChronicList(prev => prev.filter((_, i) => i !== index));
    };
    // 알레르기 추가
    const addAllergy = () => {
        const t = tempAllergy.trim();
        if (t) {
            setAllergyList(prev => [...prev, t]);
            setTempAllergy('');
        }
    };
    // 알레르기 삭제
    const removeAllergy = index => {
        setAllergyList(prev => prev.filter((_, i) => i !== index));
    };

    // 회원가입 + 프로필 생성
    const onRegisterAndCreateProfile = async () => {
        try {
            const token = await registerUser({ username: 'kim', password: 'password123' });
            await createProfile({
                name,
                birth_date: birthDate,
                gender: gender === '남성' ? 'M' : gender === '여성' ? 'F' : 'O',
                chronic_diseases: chronicList,
                allergies: allergyList,
            });
            Alert.alert('🎉 완료', '회원가입과 프로필 생성이 모두 완료되었습니다.');
            navigation.replace('MainTabs', { screen: 'Home' });
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
                <View style={styles.headerCenter}>
                    <Text style={styles.headerTitle}>회원가입</Text>
                </View>
                <View style={styles.headerRight}>
                    <TouchableOpacity onPress={() => navigation.navigate('Calendar')}>
                        <Feather name="calendar" size={20} color="black" style={styles.iconSpacing} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
                        <Ionicons name="settings-outline" size={20} color="black" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* DATE PICKER MODAL */}
            <Modal
                visible={showDatePicker}
                transparent
                animationType="fade"
                onRequestClose={() => setShowDatePicker(false)}
            >
                <View style={styles.modalBackground}>
                    <View style={styles.modalContainer}>
                        <DateTimePicker
                            value={birthDateRaw}
                            mode="date"
                            display="spinner"
                            locale="ko-KR"  
                            maximumDate={new Date()}
                            onChange={(e, selected) => {
                                if (selected) {
                                    setBirthDateRaw(selected);
                                    setBirthDate(selected.toISOString().split('T')[0]);
                                }
                            }}
                        />
                        <TouchableOpacity style={styles.modalButton} onPress={() => setShowDatePicker(false)}>
                            <Text style={styles.modalButtonText}>확인</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* FORM */}
            <ScrollView contentContainerStyle={styles.form}>
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
                                style={[styles.genderButton, gender === g && styles.genderSelected]}
                            >
                                <Text style={{ color: gender === g ? '#000' : '#999' }}>{g}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* 생년월일 */}
                <View style={[styles.row, styles.rowHorizontal]}>
                    <Text style={styles.label}>생년월일</Text>
                    <TouchableOpacity onPress={() => setShowDatePicker(true)} style={[styles.inputHalf, { justifyContent: 'center' }]}>
                        <Text style={{ color: birthDate ? '#000' : '#aaa' }}>{birthDate || 'YYYY-MM-DD'}</Text>
                    </TouchableOpacity>
                </View>

                {/* 만성질환 */}
                <View style={styles.row}>
                    <View style={[styles.rowHorizontal, { alignItems: 'center' }]}>
                        <Text style={styles.label}>만성질환</Text>
                        <View style={styles.searchContainer}>
                            <TextInput
                                value={tempChronic}
                                onChangeText={setTempChronic}
                                onSubmitEditing={addChronic}  // Enter 입력 시 추가
                                returnKeyType="done"
                                style={styles.searchInput}
                                placeholder="병명 입력"
                            />
                            <TouchableOpacity style={styles.plusWrapper} onPress={addChronic}>
                                <Text style={styles.plus}>＋</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    {chronicList.map((it, i) => (
                        <View key={i} style={styles.listItemRow}>
                            <Text style={styles.listItem}>• {it}</Text>
                            <TouchableOpacity onPress={() => removeChronic(i)}>
                                <Ionicons name="close-circle" size={20} color="#f44336" />
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>

                {/* 알레르기 */}
                <View style={styles.row}>
                    <View style={[styles.rowHorizontal, { alignItems: 'center' }]}>
                        <Text style={styles.label}>알레르기</Text>
                        <View style={styles.searchContainer}>
                            <TextInput
                                value={tempAllergy}
                                onChangeText={setTempAllergy}
                                onSubmitEditing={addAllergy}  // Enter 입력 시 추가
                                returnKeyType="done"
                                style={styles.searchInput}
                                placeholder="알레르기 입력"
                            />
                            <TouchableOpacity style={styles.plusWrapper} onPress={addAllergy}>
                                <Text style={styles.plus}>＋</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    {allergyList.map((it, i) => (
                        <View key={i} style={styles.listItemRow}>
                            <Text style={styles.listItem}>• {it}</Text>
                            <TouchableOpacity onPress={() => removeAllergy(i)}>
                                <Ionicons name="close-circle" size={20} color="#f44336" />
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>

                {/* 완료 버튼 */}
                <TouchableOpacity style={styles.saveButton} onPress={onRegisterAndCreateProfile}>
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
        borderBottomWidth: 0.5,
        borderColor: '#ddd',
        position: 'relative',
        justifyContent: 'space-between',
    },
    headerCenter: {
        position: 'absolute',
        left: 0,
        right: 0,
        alignItems: 'center',
    },
    headerTitle: { fontSize: 18, fontWeight: 'bold' },
    headerRight: { flexDirection: 'row', alignItems: 'center' },
    iconSpacing: { marginRight: 16 },

    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: '80%',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        alignItems: 'center',
    },
    modalButton: {
        marginTop: 12,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        backgroundColor: '#3C4CF1',
    },
    modalButtonText: { color: '#fff', fontSize: 16 },

    form: { paddingHorizontal: 20, paddingTop: 40, paddingBottom: 40 },
    row: { marginBottom: 50 },
    rowHorizontal: { flexDirection: 'row', justifyContent: 'space-between' },
    label: { fontSize: 15, fontWeight: 'bold', width: 90, marginRight: 16 },
    inputHalf: { flex: 1, borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 12, marginTop: -10 },

    searchContainer: { flex: 1, position: 'relative', flexDirection: 'row' },
    searchInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 14,
    },
    plusWrapper: {
        position: 'absolute',
        top: '50%',
        right: 12,
        transform: [{ translateY: -12 }],
    },
    plus: { fontSize: 28, color: '#3F51B5' },

    listItemRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8, marginLeft: 106 },
    listItem: { flex: 1, color: '#555' },

    saveButton: { backgroundColor: '#3C4CF1', padding: 14, borderRadius: 8, marginTop: 30, alignItems: 'center' },
    saveButtonText: { color: '#fff', fontSize: 16 },

    genderContainer: { flexDirection: 'row', flex: 1, justifyContent: 'flex-end' },
    genderButton: { borderWidth: 1, borderColor: '#ddd', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8, marginLeft: 8 },
    genderSelected: { borderColor: '#000', backgroundColor: '#eee' },
});
