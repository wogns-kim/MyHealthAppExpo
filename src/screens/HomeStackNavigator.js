import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useRoute } from '@react-navigation/native'; // 👈 추가
import HomeScreen from '../screens/HomeScreen';
import InfoDetailScreen from '../screens/InfoDetailScreen';
import SettingsScreen from '../screens/SettingScreen';

const Stack = createNativeStackNavigator();

export default function HomeStackNavigator({ nameFromSignup }) {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen
                name="HomeMain"
                component={HomeScreen}
                initialParams={{ name: nameFromSignup || '사용자' }}
            />
            <Stack.Screen name="InfoDetail" component={InfoDetailScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
        </Stack.Navigator>
    );
}
