import React, { useEffect } from 'react'
import { StyleSheet, Text, View, Platform } from 'react-native'
import AddEntry from './components/AddEntry'
import { createStore } from 'redux'
import { Provider, useDispatch } from 'react-redux'
import entries from './reducers'
import History from './components/History'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { purple, white, gray } from './utils/colors'
import { FontAwesome, Ionicons } from '@expo/vector-icons'
import { Constants } from 'expo-constants'
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { StatusBar } from 'expo-status-bar'
import EntryDetail from './components/EntryDetail'
import Live from './components/Live'
import { setLocalNotification, clearCalendar } from './utils/helpers'
import { CALENDAR_STORAGE_KEY } from './utils/_calendar'

const currentHeight = getStatusBarHeight()

function MyStatusBar({backgroundColor, ...props}) {
  return (
      <View style={{backgroundColor, height: currentHeight}}>
        <StatusBar backgroundColor={backgroundColor} {...props}/>
      </View>)
}

const Tabs = createBottomTabNavigator();

function MyTabs() {
  return (
    <Tabs.Navigator screenOptions={{
      tabBarActiveTintColor: Platform.OS === 'ios' ? purple : white,
      style: {
        height: 56,
        backgroundColor: Platform.OS === 'ios' ? white: purple,
        shadowColor: 'rgba(0,0,0,0.24)',
        shadowOffset: {
          width: 0,
          height: 3,
        },
        shadowRadius: 6,
        shadowOpacity: 1
      }
    }}>
      <Tabs.Screen 
          name="History" 
          component={History} 
          options={{
                tabBarLabel: 'History', 
                tabBarIcon: ({focused, color}) => <Ionicons name='ios-bookmarks' size={30} color={focused ? purple : gray} />,
                headerShown: false }} //hide tab header
      />
      <Tabs.Screen 
          name="Add Entry" 
          component={AddEntry}
          options={{
            tabBarLabel: 'Add Entry',
            tabBarIcon: ({focused, color}) => <FontAwesome name='plus-square' size={30} color={focused ? purple: gray} />,
            headerShown: false }} //hide tab header
      />
      <Tabs.Screen 
          name="Live" 
          component={Live} 
          options={{
                tabBarLabel: 'Live', 
                tabBarIcon: ({focused, color}) => <Ionicons name='ios-speedometer' size={30} color={focused ? purple : gray} />,
                headerShown: false }} //hide tab header
      />
    </Tabs.Navigator>
  );
}

const Stack = createNativeStackNavigator();

export default function App() {

  // set notification environment
  useEffect(() => {
    setLocalNotification()
  }, [])

  //clear existing calendar (needed when I changed the calendar data format)
  /*useEffect(() => {
    console.log(CALENDAR_STORAGE_KEY)
    clearCalendar(CALENDAR_STORAGE_KEY)
  }, [])*/

  return (
    <Provider store={createStore(entries)}>
      <NavigationContainer>
        <MyStatusBar backgroundColor={purple} style='light'/>
        <Stack.Navigator initialRouteName="Home" 
              screenOptions={{headerTintColor: white, headerStyle: { backgroundColor: purple }}}>
          <Stack.Screen name="Home" component={MyTabs} />
          <Stack.Screen name="Entry Detail" component={EntryDetail} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
    );
}