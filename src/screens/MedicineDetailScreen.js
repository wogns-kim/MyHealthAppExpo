import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function MedicineDetailScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>약 복용 상세 화면입니다.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  text: { fontSize: 18 },
});
