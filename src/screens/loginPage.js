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
    StatusBar,
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { registerUser, createProfile } from './constants';

export default function MyPageScreen() {
    const navigation = useNavigation();

    // 입력 상태 관리
    const [name, setName] = useState('');
    const [gender, setGender] = useState(null);
    const [birthDate, setBirthDate] = useState('');
    const [birthDateRaw, setBirthDateRaw] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);

    const [tempChronic, setTempChronic] = useState('');
    const [chronicList, setChronicList] = useState([]);
    const [tempAllergy, setTempAllergy] = useState('');
    const [allergyList, setAllergyList] = useState([]);

    // 만성질환 추가/삭제
    const addChronic = () => {
        const t = tempChronic.trim();
        if (t) {
            setChronicList(prev => [...prev, t]);
            setTempChronic('');
        }
    };
    const removeChronic = idx => {
        setChronicList(prev => prev.filter((_, i) => i !== idx));
    };

    // 알레르기 추가/삭제
    const addAllergy = () => {
        const t = tempAllergy.trim();
        if (t) {
            setAllergyList(prev => [...prev, t]);
            setTempAllergy('');
        }
    };
    const removeAllergy = idx => {
        setAllergyList(prev => prev.filter((_, i) => i !== idx));
    };

    // 회원가입 + 프로필 생성
    const onRegisterAndCreateProfile = async () => {
        try {
            const token = await registerUser({ username: 'wkowas', password: 'password123' });
            await createProfile({
                name,
                birth_date: birthDate,
                gender: gender === '남성' ? 'M' : gender === '여성' ? 'F' : 'O',
                chronic_diseases: chronicList,
                allergies: allergyList,
            });
            Alert.alert('🎉 완료', '회원가입과 프로필 생성이 완료되었습니다.');
            navigation.replace('MainTabs', { screen: 'Home', params: { username: name } });
        } catch (err) {
            console.warn(err);
            Alert.alert('🚨 오류', err.message);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {Platform.OS === 'android' && (
                <StatusBar backgroundColor="#fff" barStyle="dark-content" />
            )}

            {/* HEADER */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back" size={24} color="black" />
                </TouchableOpacity>
                <View style={styles.headerCenter}>
                    <Text style={styles.headerTitle}>회원가입</Text>
                </View>

            </View>

            {/* DATE PICKER */}
            <DateTimePickerModal
                isVisible={showDatePicker}
                mode="date"
                // Android에선 native dialog를 사용하기 위해 default로 설정
                display={Platform.OS === 'ios' ? 'inline' : 'default'}
                locale="ko_KR"
                confirmTextIOS="확인"
                cancelTextIOS="취소"
                date={birthDateRaw}
                maximumDate={new Date()}
                onConfirm={selected => {
                    setBirthDateRaw(selected);
                    setBirthDate(selected.toISOString().split('T')[0]);
                    setShowDatePicker(false);
                }}
                themeVariant="light"
                onCancel={() => setShowDatePicker(false)}
            />

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
                    <TouchableOpacity
                        onPress={() => setShowDatePicker(true)}
                        style={[styles.inputHalf, { justifyContent: 'center' }]}>
                        <Text style={{ color: birthDate ? '#000' : '#aaa' }}>
                            {birthDate || 'YYYY-MM-DD'}
                        </Text>
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
                                onSubmitEditing={addChronic}
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
                                onSubmitEditing={addAllergy}
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
        justifyContent: 'space-between',
        position: 'relative',
    },
    headerCenter: { position: 'absolute', left: 0, right: 0, alignItems: 'center' },
    headerTitle: { fontSize: 18, fontWeight: 'bold' },

    form: { paddingHorizontal: 20, paddingTop: 40, paddingBottom: 40 },
    row: { marginBottom: 50 },
    rowHorizontal: { flexDirection: 'row', justifyContent: 'space-between' },
    label: { fontSize: 15, fontWeight: 'bold', width: 90, marginRight: 16 },
    inputHalf: { flex: 1, borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 12, marginTop: -10 },

    genderContainer: { flexDirection: 'row', flex: 1, justifyContent: 'flex-end' },
    genderButton: { borderWidth: 1, borderColor: '#ddd', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8, marginLeft: 8 },
    genderSelected: { borderColor: '#000', backgroundColor: '#eee' },

    searchContainer: { flex: 1, position: 'relative', flexDirection: 'row' },
    searchInput: { flex: 1, borderWidth: 1, borderColor: '#ddd', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14 },
    plusWrapper: { position: 'absolute', top: '50%', right: 12, transform: [{ translateY: -15 }] },
    plus: { fontSize: 28, color: '#3F51B5' },

    listItemRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8, marginLeft: 106 },
    listItem: { flex: 1, color: '#555' },

    saveButton: { backgroundColor: '#3C4CF1', padding: 14, borderRadius: 8, marginTop: 30, alignItems: 'center' },
    saveButtonText: { color: '#fff', fontSize: 16 },
});
