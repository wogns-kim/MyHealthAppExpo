import 'react-native-gesture-handler';
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
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
import VisitDetailScreen from './src/screens/VisitDetailScreen';
import SplashScreen from './src/screens/SplashScreen';
import MedicineDetailScreen from './src/screens/MedicineDetailScreen';
import SettingsScreen from './src/screens/SettingScreen';
// 새로 추가된 로그인 페이지
// import LoginPage from './src/screens/loginPage';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function CustomTabBarButton({ children, onPress }) {
  return (
    <TouchableOpacity style={styles.customButton} onPress={onPress}>
      <View style={styles.plusContainer}>{children}</View>
    </TouchableOpacity>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: true,
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: { fontSize: 11 },
        tabBarActiveTintColor: '#3C4CF1',
        tabBarInactiveTintColor: '#999',
      }}
    >
      {/* ... 기존 탭들 그대로 ... */}
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: '홈',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          )
        }}
      />
      <Tab.Screen
        name="Solution"
        component={SolutionScreen}
        options={{
          tabBarLabel: '고민해결',
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="like2" size={size} color={color} />
          )
        }}
      />
      <Tab.Screen
        name="MedicineRegister"
        component={MedicineRegisterScreen}
        options={{
          tabBarLabel: '',
          tabBarIcon: () => (
            <AntDesign name="plus" size={22} color="white" style={{ marginTop: 8 }} />
          ),
          tabBarButton: (props) => <CustomTabBarButton {...props} />,
        }}
      />
      <Tab.Screen
        name="Hospital"
        component={HospitalScreen}
        options={{
          tabBarLabel: '나의기록',
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="filetext1" size={size} color={color} />
          )
        }}
      />
      <Tab.Screen
        name="My"
        component={MyScreen}
        options={{
          tabBarLabel: '마이',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          )
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{ headerTitleAlign: 'center' }}
      >
        {/* 1. Splash */}
        <Stack.Screen
          name="Splash"
          component={SplashScreen}
          options={{ headerShown: false }}
        />

        {/* 2. LoginPage */}
        {/* <Stack.Screen
          name="Login"
          component={LoginPage}
          options={{ headerShown: false }}
        /> */}

        {/* 3. Main */}
        <Stack.Screen
          name="MainTabs"
          component={MainTabs}
          options={{ headerShown: false }}
        />

        {/* 이하 기존 스택들 */}
        <Stack.Screen
          name="Calendar"
          component={CalendarScreen}
          options={{
            headerShown: true,
            headerTitle: '달력',
            headerBackTitle: '홈',
            headerTintColor: '#000'
          }}
        />
        <Stack.Screen
          name="VisitDetail"
          component={VisitDetailScreen}
          options={{ headerShown: true, headerTintColor: '#fff' }}
        />
        <Stack.Screen
          name="MedicineDetail"
          component={MedicineDetailScreen}
          options={{
            headerShown: false,   // ← 기본 네이티브 헤더 숨김
          }}
        />
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="MyRecords"
          component={HospitalScreen}
          options={{ headerShown: false }}
        />









      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    height: 70,
    borderTopWidth: 0.5,
    borderColor: '#eee',
    backgroundColor: 'white',
    elevation: 10,
  },
  customButton: {
    top: -14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  plusContainer: {
    marginTop: 27,
    width: 40,
    height: 40,
    borderRadius: 24,
    backgroundColor: '#3C4CF1',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 6,
  },
});
