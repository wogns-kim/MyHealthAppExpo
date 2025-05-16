// MemoContext.js
import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const MemoContext = createContext();

export function MemoProvider({ children }) {
    const [memoMap, setMemoMap] = useState({});

    // 앱 시작 시 AsyncStorage에서 불러오기
    useEffect(() => {
        AsyncStorage.getItem('memoMap').then(data => {
            if (data) setMemoMap(JSON.parse(data));
        });
    }, []);

    // memoMap 변경 시 AsyncStorage에 저장
    useEffect(() => {
        AsyncStorage.setItem('memoMap', JSON.stringify(memoMap));
    }, [memoMap]);

    const saveMemo = (dateKey, text) => {
        setMemoMap(prev => ({
            ...prev,
            [dateKey]: text,
        }));
    };

    const deleteMemo = dateKey => {
        setMemoMap(prev => {
            const next = { ...prev };
            delete next[dateKey];
            return next;
        });
    };

    return (
        <MemoContext.Provider value={{ memoMap, saveMemo, deleteMemo }}>
            {children}
        </MemoContext.Provider>
    );
}

