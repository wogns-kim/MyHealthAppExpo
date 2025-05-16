// ✅ DropDownPicker 사용을 위한 추가 import
import DropDownPicker from 'react-native-dropdown-picker';

// 👇 알레르기 옵션 리스트 정의
const allergyOptions = [
    '페니실린',
    '아스피린',
    '세팔로스포린',
    '설파제',
    '비스테로이드(NSAIDs)',
    '요오드 조영제',
    '라텍스',
];

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
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, CommonActions } from '@react-navigation/native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { registerUser, createProfile } from './constants';

export default function SignUpScreen() {
    const navigation = useNavigation();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [gender, setGender] = useState(null);
    const [birthDate, setBirthDate] = useState('');
    const [birthDateRaw, setBirthDateRaw] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);

    const [tempChronic, setTempChronic] = useState('');
    const [chronicList, setChronicList] = useState([]);
    const [allergyList, setAllergyList] = useState([]);

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [dropdownItems, setDropdownItems] = useState(
        allergyOptions.map(a => ({ label: a, value: a }))
    );
    const [showCustomAllergyInput, setShowCustomAllergyInput] = useState(false);
    const [customAllergyText, setCustomAllergyText] = useState('');

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

    const addCustomAllergy = () => {
        const t = customAllergyText.trim();
        if (t && !allergyList.includes(t)) {
            setAllergyList(prev => [...prev, t]);
            setCustomAllergyText('');
            setShowCustomAllergyInput(false);
        }
    };

    const removeAllergy = idx => {
        setAllergyList(prev => prev.filter((_, i) => i !== idx));
    };

    const handleDateConfirm = (date) => {
        setBirthDateRaw(date);
        const formatted = date.toISOString().split('T')[0];
        setBirthDate(formatted);
        setShowDatePicker(false);
    };

    const onRegisterAndCreateProfile = async () => {
        if (!username || !password || !name || !gender || !birthDate) {
            Alert.alert('오류', '모든 필드를 입력해주세요.');
            return;
        }
        try {
            const token = await registerUser({ username, password });
            await createProfile({
                name,
                birth_date: birthDate,
                gender: gender === '남성' ? 'M' : gender === '여성' ? 'F' : 'O',
                chronic_diseases: chronicList,
                allergies: allergyList,
            });
            Alert.alert('🎉 완료', '회원가입과 프로필 생성이 완료되었습니다.');
            navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [{ name: 'MainTabs', params: { name } }],
                })
            );
        } catch (err) {
            console.warn(err);

            if (err.message.includes('username') && err.message.includes('exists')) {
                Alert.alert('🚫 아이디 중복', '이미 사용 중인 아이디입니다. 다른 아이디를 입력해주세요.');
            } else {
                Alert.alert('🚨 오류', err.message);
            }

        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {Platform.OS === 'android' && <StatusBar backgroundColor="#fff" barStyle="dark-content" />}
            <View style={styles.header}>
                <View style={styles.headerCenter}>
                    <Text style={styles.headerTitle}>회원가입</Text>
                </View>
            </View>
            <ScrollView contentContainerStyle={styles.form} keyboardShouldPersistTaps="handled">
                <DateTimePickerModal
                    isVisible={showDatePicker}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'inline' : 'default'}
                    locale="ko_KR"
                    confirmTextIOS="확인"
                    cancelTextIOS="취소"
                    date={birthDateRaw}
                    maximumDate={new Date()}
                    themeVariant="light"
                    onConfirm={handleDateConfirm}
                    onCancel={() => setShowDatePicker(false)}
                />

                {/* 아이디 */}
                <View style={[styles.row, styles.rowHorizontal]}>
                    <Text style={styles.label}>아이디</Text>
                    <TextInput
                        value={username}
                        onChangeText={setUsername}
                        style={styles.inputHalf}
                        placeholder="아이디를 입력해주세요"
                        autoCapitalize="none"
                    />
                </View>

                {/* 비밀번호 */}
                <View style={[styles.row, styles.rowHorizontal]}>
                    <Text style={styles.label}>비밀번호</Text>
                    <TextInput
                        value={password}
                        onChangeText={setPassword}
                        style={styles.inputHalf}
                        placeholder="비밀번호를 입력해주세요"
                        secureTextEntry
                    />
                </View>

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
                <View style={[styles.row, { zIndex: 1000 }]}>
                    <View style={[styles.rowHorizontal, { alignItems: 'center' }]}>
                        <Text style={styles.label}>알레르기</Text>
                        <View style={{ flex: 1, zIndex: 1000 }}>
                            <DropDownPicker
                                open={dropdownOpen}
                                setOpen={setDropdownOpen}
                                value={null}
                                setValue={() => { }}
                                items={dropdownItems}
                                setItems={setDropdownItems}
                                onSelectItem={({ value }) => {
                                    if (!allergyList.includes(value)) {
                                        setAllergyList(prev => [...prev, value]);
                                    }
                                }}
                                multiple={false}
                                placeholder="알레르기 선택"
                                style={{ borderColor: '#ddd', minHeight: 44, zIndex: 1000 }}
                                dropDownContainerStyle={{ borderColor: '#ddd', zIndex: 999 }}
                                listMode="SCROLLVIEW"
                            />
                        </View>
                    </View>

                    <TouchableOpacity
                        style={{ marginTop: 10, alignSelf: 'flex-end', marginRight: 10 }}
                        onPress={() => setShowCustomAllergyInput(true)}
                    >
                        <Text style={{ color: '#3F51B5', fontWeight: 'bold' }}>+ 기타 알레르기 입력</Text>
                    </TouchableOpacity>

                    {showCustomAllergyInput && (
                        <View>
                            <View style={[styles.searchContainer, { marginTop: 10 }]}>
                                <TextInput
                                    value={customAllergyText}
                                    onChangeText={setCustomAllergyText}
                                    placeholder="기타 알레르기 입력"
                                    style={styles.searchInput}
                                    onSubmitEditing={addCustomAllergy}
                                />
                                <TouchableOpacity style={styles.plusWrapper} onPress={addCustomAllergy}>
                                    <Text style={styles.plus}>＋</Text>
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity onPress={() => setShowCustomAllergyInput(false)}>
                                <Text style={{ color: 'red', textAlign: 'right', marginTop: 6, marginRight: 10 }}>닫기</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {allergyList.map((it, i) => (
                        <View key={i} style={styles.listItemRow}>
                            <Text style={styles.listItem}>• {it}</Text>
                            <TouchableOpacity onPress={() => removeAllergy(i)}>
                                <Ionicons name="close-circle" size={20} color="#f44336" />
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>

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
    inputHalf: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        padding: 12,
        marginTop: -10
    },
    genderContainer: { flexDirection: 'row', flex: 1, justifyContent: 'flex-end' },
    genderButton: {
        borderWidth: 1,
        borderColor: '#ddd',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginLeft: 8
    },
    genderSelected: { borderColor: '#000', backgroundColor: '#eee' },
    searchContainer: { flex: 1, position: 'relative', flexDirection: 'row' },
    searchInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 14
    },
    plusWrapper: {
        position: 'absolute',
        top: '50%',
        right: 12,
        transform: [{ translateY: -15 }]
    },
    plus: { fontSize: 28, color: '#3F51B5' },
    listItemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
        marginLeft: 106
    },
    listItem: { flex: 1, color: '#555' },
    saveButton: {
        backgroundColor: '#3C4CF1',
        padding: 14,
        borderRadius: 8,
        marginTop: 30,
        alignItems: 'center'
    },
    saveButtonText: { color: '#fff', fontSize: 16 },
});