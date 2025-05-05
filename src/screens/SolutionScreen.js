import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function SolutionScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>고민해결 화면</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, justifyContent:'center', alignItems:'center' },
  title: { fontSize:20, fontWeight:'bold' }
});
