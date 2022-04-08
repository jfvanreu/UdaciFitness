import React from 'react';
import { View, Text } from 'react-native'
import { purple } from '../utils/colors'


export default function DateHeader({date}) {
    return (
        <View style={{ color: purple, fontSize:25 }}>
            <Text>{date}</Text>
        </View>
    );
}