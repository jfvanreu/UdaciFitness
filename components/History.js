import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native'
import { timeToString, getDailyReminderValue } from '../utils/helpers'
import { fetchCalendarResults } from '../utils/api'
import { useSelector, useDispatch } from 'react-redux'
import { receiveEntries, addEntry } from '../actions'
import { Agenda as UdaciFitnessCalendar} from 'react-native-calendars'
import { white, purple, red } from '../utils/colors'
import DateHeader from './DateHeader'
import MetricCard from './MetricCard'
import AppLoading from 'expo-app-loading';

export default function History({navigation}) {

    //const [entries, updateEntries] = useState([])   //component state to display entries
    const [loadingStatus, updateLoadingStatus] = useState(true)

    const entries = useSelector((state) => state)
    const dispatch = useDispatch()

    // fetch historical data and update if no entry for today
    useEffect(() => {
      fetchCalendarResults()
      .then((entries) => dispatch(receiveEntries(entries))) //feed data to our store; dispatch returns action instead of store
      .then(({entries}) => {
          if (!entries[timeToString()]) { // if no data today, then create an entry with the default reminder.
                dispatch(addEntry({
                  [timeToString()]: getDailyReminderValue()
                }))
          }
        })
      .then(updateLoadingStatus(false))
    },[])

    const renderItem = (item, firstItemInDay) => {
        const { today, metrics } = item
        return (   
        <View style={styles.item}>
            {today
                ? <View>
                    <Text style={styles.noDataText}>
                        {today}
                    </Text>
                  </View>
                : <TouchableOpacity onPress={() => navigation.navigate('Entry Detail', item)}>
                    <MetricCard metrics={metrics} />
                  </TouchableOpacity>}
        </View>
    )}   

    const renderEmptyDate = () => {
        return(
            <View style={styles.item}>
                <Text style={styles.noDataText}>
                    You didn't log any data on this day
                </Text>
            </View>
        )
    }

    if (loadingStatus === true) {
        return (<AppLoading />)
    }

    return (
              <UdaciFitnessCalendar
                    items={entries}
                    onDayPress={day => {
                        console.log('day pressed');
                    }}
                    renderItem={renderItem}
                    maxDate={timeToString()}
                    renderEmptyDate={renderEmptyDate}
                    theme={{
                        //indicatorColor: purple,
                        agendaDayTextColor: purple,
                        agendaDayNumColor: purple,
                        agendaTodayColor: purple,
                        agendaKnobColor: purple,
                        monthTextColor: purple,
                        selectedDayBackgroundColor: purple,
                        selectedDayTextColor: white,
                        todayTextColor: purple,
                        dayTextColor: '#2d4150',
                        dotColor: purple,
                        selectedDotColor: white,
                      }} />
    );
}

const styles = StyleSheet.create({
    item: {
        backgroundColor: white,
        borderRadius: Platform.OS === 'ios' ? 16 : 2,
        padding: 20,
        marginLeft: 10,
        marginRight: 10,
        marginTop: 17,
        justifyContent: 'center',
        shadowRadius: 3,
        shadowOpacity: 0.8,
        shadowColor: 'rgba(0,0,0,0.24)',
        shadowOffset: {
            width: 0,
            height: 3,
            }
        },
        noDataText: {
            fontSize: 20,
            paddingTop: 20,
            paddingBottom: 20,
        },
})