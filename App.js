// App.js
import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, AntDesign } from '@expo/vector-icons';

// screens
import HomeScreen from './src/screens/HomeScreen';
import CalendarScreen from './src/screens/CalendarScreen';
import SolutionScreen from './src/screens/SolutionScreen';
import HospitalScreen from './src/screens/HospitalScreen';
import MyScreen from './src/screens/MyScreen';
import MedicineRegisterScreen from './src/screens/MedicineRegisterScreen';
// 새로 만든 상세 화면
import VisitDetailScreen from './src/screens/VisitDetailScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#4475F2',
        tabBarInactiveTintColor: '#8A8A8E',
        tabBarStyle: { backgroundColor: '#fff', height: 62, paddingBottom: 6 },
        tabBarIcon: ({ color, size }) => {
          switch (route.name) {
            case 'Home':
              return <Ionicons name="home" size={size} color={color} />;
            case 'Solution':
              return <AntDesign name="like2" size={size} color={color} />;
            case 'Hospital':
              return <AntDesign name="filetext1" size={size} color={color} />;
            case 'My':
              return <Ionicons name="person-outline" size={size} color={color} />;
            default:
              return null;
          }
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: '홈' }} />
      <Tab.Screen name="Solution" component={SolutionScreen} options={{ tabBarLabel: '고민해결' }} />
      <Tab.Screen name="Hospital" component={HospitalScreen} options={{ tabBarLabel: '내 병원' }} />
      <Tab.Screen name="My" component={MyScreen} options={{ tabBarLabel: '마이' }} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerTitleAlign: 'center' }}>
        {/* 1. MainTabs */}
        <Stack.Screen
          name="MainTabs"
          component={MainTabs}
          options={{ headerShown: false }}
        />

        {/* 2. 처방전 등록 */}
        <Stack.Screen
          name="MedicineRegister"
          component={MedicineRegisterScreen}
          options={{
            headerShown: true,
            headerTitle: '처방전 등록',
            headerBackTitle: '홈',
            headerTintColor: '#000',
          }}
        />

        {/* 3. 달력 */}
        <Stack.Screen
          name="Calendar"
          component={CalendarScreen}
          options={{
            headerShown: true,
            headerTitle: '달력',
            headerBackTitle: '홈',
            headerTintColor: '#000',
          }}
        />

        {/* 4. 오늘 방문 상세 */}
        <Stack.Screen
          name="VisitDetail"
          component={VisitDetailScreen}
          options={{
            headerShown: true,
            headerTintColor: '#fff',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
