import React, { Component } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import { white } from '../utils/colors'
import MetricCard from './MetricCard'
import { addEntry } from '../actions'
import { removeEntry } from '../utils/api'
import { timeToString, getDailyReminderValue } from '../utils/helpers'
import TextButton from './TextButton'

class EntryDetail extends Component {
    
    static navigationOptions = ({ navigation }) => {
        const { entryId } = navigation.state.params
        
        const year = entryId.slice(0,4)
        const month = entryId.slice(5,7)
        const day = entryId.slice(8)
        
        return {
        title: `${month}/${day}/${year}`
        }
    }
    
    reset = () => {
        const { remove, goBack, entryId } = this.props
        
        remove()
        goBack()
        removeEntry(entryId)
    }
    
    //need to refresh component only if meet following conditions
    //this is necessary otherwise the code would crash after pressing on reset
    shouldComponentUpdate (nextProps) {
        return nextProps.metrics !== null && !nextProps.metrics.today
    }
    
    render() {
        const metrics = this.props.metrics
        
        return(
                <View style={styles.container}>
                    <MetricCard metrics={metrics} />
                    <TextButton onPress={this.reset} style={{margin:20}}>
                        RESET
                    </TextButton>
               </View>
               )
    }
}

const styles = StyleSheet.create({
    constainer: {
    flex:1,
    backgroundColor: white,
    padding: 15,
    }
})

function mapStateToProps(state, { route, navigation }){
    const { entryId } = route.params
    const metrics = state[entryId]
    console.log(metrics)
    return {
        entryId,
        metrics,
    }
    
}

function mapDispatchToProps (dispatch, { route, navigation }) {
    const { entryId } = route.params
        
    return {
    remove:() => dispatch(addEntry({
        [entryId]: timeToString() === entryId
        ? getDailyReminderValue()
        : null
    })),
    goBack: () => navigation.goBack(),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(EntryDetail)
