import React, {useState} from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { getMetricMetaInfo, timeToString, getDailyReminderValue, setLocalNotification, clearLocalNotification } from '../utils/helpers'
import UdaciSlider from './UdaciSlider';
import UdaciStepper from './UdaciStepper';
import DateHeader from './DateHeader'
import { Ionicons } from '@expo/vector-icons'
import TextButton from './TextButton';
import { submitEntry, removeEntry } from '../utils/api.js'
import { useDispatch, useSelector } from 'react-redux'
import {addEntry} from '../actions'
import { white, purple} from '../utils/colors'
import { NavigationContainer } from '@react-navigation/native';


function SubmitBtn({ onPress}) {
    return (
        <TouchableOpacity 
            style={Platform.OS === 'ios' ? styles.iosSubmitBtn : styles.androidSubmitBtn}
            onPress={onPress}>
                <Text style={styles.submitBtnText}>SUBMIT</Text>
        </TouchableOpacity>
    )
}

export default function AddEntry(props) {
  const [localState, setState] = useState({
    swim: 0,
    bike: 0,  
    run: 0,
    sleep: 0,
    swim: 0
  });

  const dispatch = useDispatch()

  const toHome = () => {
      //props.navigation.goBack()
      props.navigation.navigate('History')
      console.log("Route:", props.route)
  }

  function increment(metric) {
        const { max, step } = getMetricMetaInfo(metric);
        setState((localState) => {
            const count = localState[metric] + step
            return {
                ...localState,
                [metric]: count > max ? max : count
            }});
    }

  function decrement(metric) {
        const { max, step } = getMetricMetaInfo(metric);
        setState((localState) => {
            const count = localState[metric] - getMetricMetaInfo(metric).step

            return {
                ...localState,
                [metric]: count < 0 ? 0 : count
        }});
    }

  function slide(metric, value) {
        setState(localState => ({
            ...localState,
            [metric]: value
          }))
        }

  function submit() {
      const key = timeToString()
      const entry = [{
          date: key,
          metrics: localState}]

      //dispatch to our redux store
      dispatch(addEntry({
          [key]: entry
      }))
      
      //reset localState to 0
      setState({
        swim: 0,
        bike: 0,  
        run: 0,
        sleep: 0,
        swim: 0
      })

      toHome()
      submitEntry({key, entry})
      
      //clear the notification for today and set a new one for tomorrow
      clearLocalNotification().then(setLocalNotification())
  }

  function reset() {
      const key = timeToString()

      // reset to the default value of the specific day in Redux store. Check getDailyReminderValue in helpers.
      dispatch(addEntry({
          [key]: getDailyReminderValue()
      }))

      removeEntry(key)
      toHome()
  }

  const metaInfo = getMetricMetaInfo()

  // get slice from the Redux store state to determine if already logged
  const alreadyLogged = useSelector((state) => {
      const key = timeToString()
      return state[key] && typeof state[key][0].today === 'undefined'
  })

  if (alreadyLogged) {
      return (
          <View style={styles.center}>
              <Ionicons name={Platform.OS === 'ios' ? 'ios-happy-outline': 'md-happy-outline'} size={100} />
              <Text>You already logged your information for today</Text>
              <TextButton style={{padding: 10}} onPress={reset}>
                  Reset
              </TextButton>
          </View>
      )
  }
  return (  
    <View style={styles.container}>
      <DateHeader date={(new Date()).toLocaleDateString()} />
      {Object.keys(metaInfo).map((key) => {
          const {getIcon, type, ...rest} = metaInfo[key]
          const value = localState[key]
          return (
              <View style={styles.row} key={key}>
                  {getIcon()}
                  {type === 'slider'
                    ? <UdaciSlider
                        value={value}
                        onChange={(value) => slide(key, value)} 
                        {...rest}
                        />
                    : <UdaciStepper
                        value={value}
                        onIncrement={() => increment(key)}
                        onDecrement={() => decrement(key)}
                        {...rest}
                        />  
                    }
              </View>
          )
      })}
      <SubmitBtn onPress={submit}/>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,    //so children will take the all width
        padding: 20,
        backgroundColor: white,
    },
    row: {
        flexDirection: 'row',
        flex: 1,
        alignItems: 'center',
    },
    iosSubmitBtn:{
        backgroundColor: 'purple',
        padding: 10,
        borderRadius: 7,
        height: 45,
        marginLeft: 40,
        marginRight: 40,
    },
    androidSubmitBtn: {
        backgroundColor: 'purple',
        padding: 10,
        paddingLeft: 30,
        paddingRight: 30,
        height: 45,
        borderRadius: 2,
        alignSelf: 'flex-end',
        justifyContent: 'center',
        alignItems: 'center',
    },
    submitBtnText:{
        color: white,
        fontSize: 22,
        textAlign: 'center',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 30,
    }
})