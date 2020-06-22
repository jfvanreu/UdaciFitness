import 'react-native-gesture-handler'
import * as React from 'react'
import { View, StatusBar, Platform } from 'react-native'
import AddEntry from './components/AddEntry.js'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import reducer from './reducers'
import TabNav from './components/TabNav'
import Constants from "expo-constants"
import { purple, white } from './utils/colors'
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import History from './components/History'
import { FontAwesome, Ionicons } from '@expo/vector-icons'
import EntryDetail from './components/EntryDetail'
import Live from './components/Live'
import { setLocalNotification } from './utils/helpers'
import { createStackNavigator } from '@react-navigation/stack';


//create custom statusbar
function UdaciStatusBar ({ backgroundColor, ...props }) {
    return (
            <View style={{ backgroundColor, height: Constants.statusBarHeight }}>
            <StatusBar translucent backgroundColor={backgroundColor} {...props} />
            </View>)
}
            
const RouteConfigs = {
  History:{
    name: "History",
    component: History,
    options: {tabBarIcon: ({tintColor}) => <Ionicons name='ios-bookmarks' size={30} color={tintColor} />, title: 'History'}
  },
  AddEntry:{
    component: AddEntry,
    name: "AddEntry",
    options: {tabBarIcon: ({tintColor}) => <FontAwesome name='plus-square' size={30} color={tintColor} />, title: 'Add Entry'}
  },
  Live:{
    component: Live,
    name: "Live",
    options: {tabBarIcon: ({tintColor}) => <Ionicons name='ios-speedometer' size={30} color={tintColor} />, title: 'Live'}
  },
  
}

const TabNavigatorConfig = {
  navigationOptions: {
    header: null
  },
  tabBarOptions: {
    activeTintColor: Platform.OS === "ios" ? purple : white,
    style: {
      height: 100,
      backgroundColor: Platform.OS === "ios" ? white : purple,
      shadowColor: "rgba(0, 0, 0, 0.24)",
      shadowOffset: {
        width: 0,
        height: 3
      },
      shadowRadius: 6,
      shadowOpacity: 1
    }
  }
}

const Tab = createBottomTabNavigator()
      
// create Home component which includes our Tab with 2 sub-components
function Home() {
return (
      <Tab.Navigator {...TabNavigatorConfig}>
          <Tab.Screen {...RouteConfigs['History']} />
          <Tab.Screen {...RouteConfigs['AddEntry']} />
          <Tab.Screen {...RouteConfigs['Live']} />
      </Tab.Navigator>
  )
}

//create Stack navigator
const Stack = createStackNavigator()

export default class App extends React.Component {
  
  componentDidMount() {
        setLocalNotification()
    }
    
  render() {
    return (
      <Provider store={createStore(reducer)}>
        <View style={{ flex: 1}}>
            <UdaciStatusBar backgroundColor={purple} barStyle='light-content' />
            <NavigationContainer>
              <Stack.Navigator>
                <Stack.Screen name="Home" component={Home} />
                <Stack.Screen name="Detail" component={EntryDetail} />
              </Stack.Navigator>
            </NavigationContainer>
        </View>
      </Provider>
    )
  }
}
