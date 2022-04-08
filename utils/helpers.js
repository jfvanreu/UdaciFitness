// utils/helpers.js
import React from 'react'
import { View, StyleSheet } from 'react-native'
import { FontAwesome, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons'
import { white, red, blue, orange, lightPurp, pink, black } from './colors'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Permissions from "expo-permissions";
import * as Notifications from 'expo-notifications';

const NOTIFICATION_KEY = 'UdaciTri:notifications'

export function isBetween (num, x, y) {
    if (num >= x && num <= y) {
      return true
    }
  
    return false
  }
  
export function calculateDirection (heading) {
  let direction = ''

  if (isBetween(heading, 0, 22.5)) {
    direction = 'North'
  } else if (isBetween(heading, 22.5, 67.5)) {
    direction = 'North East'
  } else if (isBetween(heading, 67.5, 112.5)) {
    direction = 'East'
  } else if (isBetween(heading, 112.5, 157.5)) {
    direction = 'South East'
  } else if (isBetween(heading, 157.5, 202.5)) {
    direction = 'South'
  } else if (isBetween(heading, 202.5, 247.5)) {
    direction = 'South West'
  } else if (isBetween(heading, 247.5, 292.5)) {
    direction = 'West'
  } else if (isBetween(heading, 292.5, 337.5)) {
    direction = 'North West'
  } else if (isBetween(heading, 337.5, 360)) {
    direction = 'North'
  } else {
    direction = 'Calculating'
  }

  return direction
}

export function timeToString (time = Date.now()) {
  const date = new Date(time)
  const todayUTC = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  return todayUTC.toISOString().split('T')[0]
}

const styles = StyleSheet.create({
  iconContainer: {
      padding: 5,
      borderRadius: 8,
      width: 50,
      height: 50,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 20,
      }
})

export function getMetricMetaInfo (metric) {
  const info = {
  run: {
      displayName:'run',
      max: 50,
      unit: 'miles',
      step: 1,
      type: 'steppers',
      getIcon() {
          return(
                  <View style={[styles.iconContainer, {backgroundColor:red}]}>
                  <MaterialIcons
                      name='directions-run'
                      color={'white'}
                      size={35}
                  />
              </View>
              )
      }
  },
  bike: {
      displayName:'bike',
      max: 100,
      unit: 'miles',
      step: 1,
      type: 'steppers',
      getIcon() {
          return(
              <View style={[styles.iconContainer, {backgroundColor:orange}]}>
                  <MaterialCommunityIcons
                      name='bike'
                      color={'white'}
                      size={35}
                  />
              </View>
              )
      }
  },
  swim: {
      displayName:'swim',
      max: 9900,
      unit: 'meters',
      step: 100,
      type: 'steppers',
      getIcon() {
          return(
              <View style={[styles.iconContainer, {backgroundColor:blue}]}>
                  <MaterialCommunityIcons
                      name='swim'
                      color={'white'}
                      size={35}
                  />
              </View>
              )
      }
  },
  sleep: {
      displayName:'Sleep',
      max: 24,
      unit: 'hours',
      step: 1,
      type: 'slider',
      getIcon() {
          return(
              <View style={[styles.iconContainer, {backgroundColor:lightPurp}]}>
                  <FontAwesome
                      name='bed'
                      color={'white'}
                      size={35}
                  />
              </View>
              )
      }
  },
  eat: {
      displayName:'Eat',
      max: 10,
      unit: 'rating',
      step: 1,
      type: 'slider',
      getIcon() {
          return(
              <View style={[styles.iconContainer, {backgroundColor:pink}]}>
                  <MaterialCommunityIcons
                      name='food'
                      color={'white'}
                      size={35}
                  />
              </View>
              )
      }
  },
  }
return typeof metric === 'undefined'
      ? info
      : info[metric]
}

export function getDailyReminderValue() {
  return new Array({
      today: "👋 hey, don't forget to log your data today!"
  })
}

export async function clearCalendar(key) {
  console.log(key)
  try {
    const result = await AsyncStorage.removeItem(key) // delete the Notification records in my local drive
    return result
  } catch (error) {
    return console(`Error clearing the calendar ${key}: ${error}`)
  }
}


export async function clearLocalNotification() {
  try {
    const result = await AsyncStorage.removeItem(NOTIFICATION_KEY) // delete the Notification records in my local drive
      
    return Notifications.cancelAllScheduledNotificationsAsync(result)
  } catch (error) {
    return console('Error canceling all notifications', error)
  }
}

function createNotification() {
  return {
    title: 'Log your stats!',
    body: "👋 don't forget to log your stats today!",
    ios: {
      sound: true,
    },
    android: {
      sound: true,
      priority: 'high',
      sticky: false,
      vibrate: true,
    }
  }
}

export function setLocalNotification () {
  AsyncStorage.getItem(NOTIFICATION_KEY)
    .then(JSON.parse)
    .then((data) => {
      if (data === null) {
        Permissions.askAsync(Permissions.NOTIFICATIONS)
          .then(({ status }) => {
            if (status === 'granted') {
              Notifications.cancelAllScheduledNotificationsAsync()

              let tomorrow = new Date()
              tomorrow.setDate(tomorrow.getDate() + 1)
              //notify users at 20:00 that he needs to log in data.
              tomorrow.setHours(20)
              tomorrow.setMinutes(0)

              Notifications.scheduleLocalNotificationAsync(
                createNotification(),
                {
                  time: tomorrow,
                  repeat: 'day',
                }
              )

              AsyncStorage.setItem(NOTIFICATION_KEY, JSON.stringify(true))
            }
          })
          .catch((error) => {
            console.warn('Error asking for notification permissions:', error)})
      }
    })
}