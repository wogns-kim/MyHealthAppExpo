import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function MedicineRegisterScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.contentTitle}>처방전을 등록해 주세요</Text>
        <Text style={styles.contentSubtitle}>나에게 맞는 방법을 선택해보세요</Text>

        {/* Registration Options */}
        <View style={styles.optionsContainer}>
          {/* Auto Registration */}
          <TouchableOpacity
            style={styles.optionCard}
            onPress={() => navigation.navigate('MedicineRegisterAuto')}
          >
            <View style={styles.optionIconContainer}>
              <Ionicons name="camera-outline" size={30} color="#4475F2" />
            </View>
            <View style={styles.optionTextContainer}>
              <Text style={styles.optionTitle}>자동 등록</Text>
              <Text style={styles.optionDescription}>
                처방전 또는 약 봉투를 사진으로 찍으면{`\n`}자동으로 정보를 인식해요
              </Text>
            </View>
            <AntDesign name="right" size={20} color="#AEAEB2" />
          </TouchableOpacity>

          {/* Manual Registration */}
          <TouchableOpacity
            style={styles.optionCard}
            onPress={() => navigation.navigate('MedicineRegisterManual')}
          >
            <View style={styles.optionIconContainer}>
              <Ionicons name="create-outline" size={30} color="#4475F2" />
            </View>
            <View style={styles.optionTextContainer}>
              <Text style={styles.optionTitle}>수동 등록</Text>
              <Text style={styles.optionDescription}>
                처방받은 약 정보를 직접 입력하세요
              </Text>
            </View>
            <AntDesign name="right" size={20} color="#AEAEB2" />
          </TouchableOpacity>
        </View>

        {/* Sample Image */}
        <View style={styles.sampleContainer}>
          <Text style={styles.sampleTitle}>처방전 예시</Text>
          <View style={styles.sampleImageContainer}>
            <View style={styles.sampleImage}>
              <View style={styles.imagePlaceholder}>
                <Text style={styles.placeholderText}>처방전 이미지</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { flex: 1, padding: 20 },
  contentTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 8 },
  contentSubtitle: { fontSize: 16, color: '#8a8a8a', marginBottom: 32 },
  optionsContainer: { marginBottom: 32 },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFF',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 2,
  },
  optionIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F0F5FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  optionTextContainer: { flex: 1 },
  optionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  optionDescription: { fontSize: 14, color: '#8a8a8a', lineHeight: 20 },
  sampleContainer: { marginTop: 16 },
  sampleTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 16 },
  sampleImageContainer: { alignItems: 'center' },
  sampleImage: { width: '100%', height: 150, borderRadius: 12, overflow: 'hidden' },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: { color: '#8a8a8a', fontSize: 16 },
});
