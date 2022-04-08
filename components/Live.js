import React, { useState, Fragment, useEffect, useRef } from 'react'
import { View, Text, ActivityIndicator, TouchableOpacity, StyleSheet, Animated } from 'react-native'
import { Foundation } from '@expo/vector-icons'
import { purple, white } from '../utils/colors'
import { calculateDirection } from '../utils/helpers'
import * as Location from 'expo-location';

export default function Live() {
  
  // define state variables
  const [coords, setCoords] = useState(null)
  const [locationStatus, setLocationStatus] = useState(null)
  const [direction, setDirection] = useState('')
  const bounceValue = useRef(new Animated.Value(1)).current;
  
  // get permissions from the user
  useEffect(() => {
      Location.requestForegroundPermissionsAsync()
      .then(({status})=> {
        if (status === 'granted') {
          return setLocation()
        }
        setLocationStatus(status)
      })
      .catch((error) => {
        console.warn('Error getting Location permission:', error)
        setLocationStatus('undetermined')
      })
    },[])

  // create animation when direction changes  
  useEffect(() => {
      // sequence of animations
      Animated.sequence([ 
        Animated.timing(bounceValue, {duration: 200, toValue: 1.04, useNativeDriver: true}),
        Animated.spring(bounceValue, {toValue: 1, friction:4, useNativeDriver: true})
      ]).start()
    }, [direction])
  
  const askPermission = () => {
      Location.getCurrentPositionAsync({})
      .then(({status}) => {
        if (status === 'granted') {
          return setLocation()
        }
        setLocationStatus(status)
      })
      .catch((error) => {
        console.warn('Error asking for location permissions:', error)
      })
  }

  const setLocation = () => {
    Location.watchPositionAsync({
      enableHighAccuracy: true,
      timeInterval: 1,
      distanceInterval:1,
    }, ({coords}) => {
      const newDirection = calculateDirection(coords.heading)
      setCoords(coords)
      setLocationStatus('granted')
      setDirection(newDirection)
    })
  }

  if (locationStatus === null) {
      return <ActivityIndicator style={{marginTop: 30}}/>
    }

    if (locationStatus === 'denied') {
      return (
              <View style={styles.center}>
                <Foundation name='alert' size={50} />
                <Text>You denied your location. You can fix this by visiting your settings and enabling location services for this app.</Text>
              </View>
      )
    }

    if (locationStatus === 'undetermined') {
      return (
        <View style={styles.center}>
              <Foundation name='alert' size={50} />
              <Text>You need to enable location services for this app</Text>
              <TouchableOpacity onPress={askPermission} style={styles.button}>
                <Text style={styles.buttonText}>Enable</Text>
              </TouchableOpacity>
        </View>
      )
    }

    return (
        <Fragment>
            <View style={styles.directionContainer}>
                <Animated.Text style={[styles.direction, {transform: [{scale: bounceValue}]}]}>{direction}</Animated.Text>
            </View>
            <View style={styles.metricContainer}>
              <View style={styles.metric}>
                <Text style={[styles.header, {color: white}]}>
                  Altitude
                </Text>
                <Text style={[styles.subHeader, {color: white}]}>
                    {Math.round(coords.altitude * 3.2808)} Feet
                </Text>
              </View>
              <View style={styles.metric}>
                <Text style={[styles.header, {color: white}]}>
                  Speed
                </Text>
                <Text style={[styles.subHeader, {color: white}]}>
                {(coords.speed * 2.2369).toFixed(1)} MPH
                </Text>
              </View>
            </View>
        </Fragment>
    )
  }

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between'
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 30,
        marginRight: 30,
    },
    button: {
        padding: 10,
        backgroundColor: purple,
        alignSelf: 'center',
        borderRadius: 5,
        margin: 20,
    },
        buttonText :{
        color: white,
        fontSize: 20,
    },
    directionContainer: {
          flex: 1,
          justifyContent: 'center',
    },
    header: {
          fontSize: 35,
          textAlign: 'center',
    },
    direction: {
          color: purple,
          fontSize: 120,
          textAlign: 'center',
    },
    metricContainer: {
          flexDirection: 'row',
          justifyContent: 'space-around',
          backgroundColor: purple,
    },
    metric: {
          flex: 1,
          paddingTop: 15,
          paddingBottom: 15,
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          marginTop: 20,
          marginBottom: 20,
          marginLeft: 10,
          marginRight: 10,
    },
    subHeader: {
          fontSize: 25,
          textAlign: 'center',
          marginTop: 5,
    },
})

