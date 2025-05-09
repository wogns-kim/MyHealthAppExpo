import React, { useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';





export default function MedicineRegisterScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  useEffect(() => {
    if (route.params?.retake && route.params?.captureType) {
      takePicture(route.params.captureType);
    }
  }, [route.params]);
  const { uploaded, responseData } = route.params || {};

  // ✅ 업로드 후 돌아왔을 때 알림
  useEffect(() => {
    if (uploaded && responseData) {
      Alert.alert('업로드 완료', '사진이 성공적으로 등록되었습니다.');
    }
  }, [uploaded, responseData]);

  const takePicture = async (type) => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('권한 필요', '카메라 권한을 허용해 주세요.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;

      navigation.navigate('PhotoPreview', {
        imageUri: uri,
        captureType: type,
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerLeft}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>처방전/약봉투 사진 촬영</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconButton}>
            <Feather name="calendar" size={24} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Settings')} style={styles.iconButton}>
            <Feather name="settings" size={24} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      {/* BODY */}
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.subtitle}>
          한 번의 사진 촬영으로{"\n"}자동 약 복용 알람, 약 기록 및 관리까지!
        </Text>

        <TouchableOpacity
          style={styles.card}
          onPress={() => takePicture('prescription')}
        >
          <View style={styles.cardTextWrapper}>
            <Text style={styles.cardTitleBig}>처방전</Text>
          </View>
          <Image source={require('../../assets/description2.png')} style={styles.cardImage} resizeMode="contain" />
          <Ionicons name="chevron-forward" size={20} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.card, { marginTop: 16 }]}
          onPress={() => takePicture('pillbag')}
        >
          <View style={styles.cardTextWrapper}>
            <Text style={styles.cardTitleBig}>약봉투</Text>
          </View>
          <Image source={require('../../assets/description1.png')} style={styles.cardImage} resizeMode="contain" />
          <Ionicons name="chevron-forward" size={20} color="#666" />
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
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  headerLeft: { marginRight: 16 },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: 18, fontWeight: '600' },
  headerRight: { flexDirection: 'row' },
  iconButton: { marginLeft: 12 },

  content: { padding: 16 },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 16,
  },
  cardTextWrapper: { flex: 1 },
  cardTitleBig: { fontSize: 20, fontWeight: '600' },
  cardImage: { width: 80, height: 80, marginHorizontal: 16 },
});
