// src/navigators/SolutionStackNavigator.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SolutionScreen from '../screens/SolutionScreen';
import DrugFaqScreen from '../screens/DrugFaqScreen';
import QuestionListScreen from '../screens/QuestionListScreen';
import QuestionDetailScreen from '../screens/QuestionDetailScreen';


const Stack = createNativeStackNavigator();

export default function SolutionStackNavigator() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="SolutionMain" component={SolutionScreen} />
            <Stack.Screen name="DrugFaq" component={DrugFaqScreen} />
            <Stack.Screen name="QuestionList" component={QuestionListScreen} />
            <Stack.Screen name="QuestionDetail" component={QuestionDetailScreen} />

        </Stack.Navigator>
    );
}
