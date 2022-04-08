import React, {useEffect} from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { white } from '../utils/colors'
import MetricCard from './MetricCard'
import { addEntry } from '../actions'
import { removeEntry } from '../utils/api'
import { timeToString, getDailyReminderValue } from '../utils/helpers'
import { useDispatch } from 'react-redux'
import TextButton from './TextButton'


export default function EntryDetail(props) {
    
    const {route, navigation} = props
    const { date, metrics } = route.params
    const dispatch = useDispatch()

    const remove = () => (dispatch(addEntry({
        [date]: timeToString() === date
            ? getDailyReminderValue()
            : new Array()
    })))

    // using useEffect to change the navigation title on the fly to avoid warning.
    useEffect(() => {
        const newTitleWithDate = (date) => {
        
            const year = date.slice(0,4)
            const month = date.slice(5,7)
            const day = date.slice(8)
            
            return `${month}/${day}/${year}`
        }
        
        navigation.setOptions({
          title: newTitleWithDate(date),
        });
      }, [date, navigation]);

    const reset = () => {
        remove()
        navigation.goBack()
        removeEntry(date)
    }
      
    return (
        <View style={styles.container}>
            <MetricCard metrics={metrics}/>
            <TextButton onPress={reset} style={{margin:20}}>RESET</TextButton>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: white,
        padding: 15,
    }
})