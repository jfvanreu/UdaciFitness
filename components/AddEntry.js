import React, { Component } from 'react'
import { View, TouchableOpacity, Text, Platform, StyleSheet} from 'react-native'
import {
        getMetricMetaInfo,
        timeToString,
        getDailyReminderValue,
        setLocalNotification,
        clearLocalNotification,
} from '../utils/helpers'
import UdaciSteppers from './UdaciSteppers'
import UdaciSlider from './UdaciSlider'
import DateHeader from './DateHeader'
import { Ionicons } from '@expo/vector-icons'
import TextButton from './TextButton'
import { submitEntry, removeEntry } from '../utils/api'
import { connect } from 'react-redux'
import { addEntry } from '../actions'
import { white, purple } from '../utils/colors'
import { NavigationActions } from 'react-navigation'

function SubmitBtn ({ onPress }) {
    return (
            <TouchableOpacity
            style={Platform.OS === 'ios' ? styles.iosSubmitBtn : styles.androidSubmitBtn}
            onPress={onPress}>
            <Text style={styles.submitBtnText}>SUBMIT</Text>
            </TouchableOpacity>
            )
}

class AddEntry extends Component {
    
    state = {
        run: 0 ,
        bike: 0,
        swim: 0,
        sleep: 0,
        eat: 0,
    }
    
    increment = (metric) => {
        const {max, step} = getMetricMetaInfo(metric)
        
        this.setState((state) => {
            const count = state[metric] + step
            
            return {
                ...state,
                [metric]: count > max ? max : count,
            }
        })
    }

    decrement = (metric) => {
        this.setState((state) => {
            const count = state[metric] - getMetricMetaInfo(metric).step
            
            return {
                ...state,
                [metric]: count < 0 ? 0 : count,
            }
        })
    }
    
    slide = (metric, value) => {
        this.setState(() => ({
            
            [metric]:value,
        }))
    }
    
    submit = () => {
        const key = timeToString()
        const entry = this.state
        
        //update Redux
        this.props.dispatch(addEntry(
            {[key]:entry}))
        
        this.setState(() => ({
            run:0,
            bike:0,
            swim:0,
            sleep:0,
            eat:0,
        }))
        
        //Route to Home
        this.toHome()
        
        //store entry to localStorage "DB"
        submitEntry({ key, entry })
        
        //clear today's notification and set a new one for tomorrow
        clearLocalNotification()
        .then(setLocalNotification)
    }
    
    reset = () => {
        const key = timeToString()
        
        //update Redux
        this.props.dispatch(addEntry({
            [key]: getDailyReminderValue()
        }))
        
        //Route to Home
        this.toHome()
        //Update "DB" (localStorage)
        removeEntry(key)
    }
    
    toHome = () => {
        const nav = this.props.navigation
        console.log('I am going Back:', nav)
        nav.goBack()
    }
        
    render() {
        const metaInfo = getMetricMetaInfo()
        
        if (this.props.alreadyLogged) {
            return (<View style={styles.center}>
                    <Ionicons name={Platform.OS === 'ios' ? 'ios-happy' : 'md-happy'}
                            size={100}
                        />
                        <Text>You already logged your info</Text>
                        <TextButton style={{padding: 10}} onPress={this.reset}>Reset</TextButton>
                    </View>
                    )
        }
        
        return (
                <View style={styles.container}>
                <DateHeader date={(new Date()).toLocaleDateString()} />
                {Object.keys(metaInfo).map((key) => {
                const {getIcon, type, ...rest} = metaInfo[key]
                const value = this.state[key]
                
                return (
                        <View key={key} style={styles.row}>
                            {getIcon()}
                            {type === 'slider'
                                ? <UdaciSlider
                                    value={value}
                                    onChange={(value) => this.slide(key, value)}
                                    {...rest}
                                  />
                                : <UdaciSteppers
                                    value={value}
                                    onIncrement={() => this.increment(key)}
                                    onDecrement={() => this.decrement(key)}
                                    {...rest}
                                  />
                            }
                        </View>
                        )
            })}
            <SubmitBtn onPress={this.submit}/>
            </View>
            )
    }
}

const styles = StyleSheet.create({

container: {
    flex:1,
    padding:20,
    backgroundColor: white,
},
    
row: {
    flexDirection: 'row',
    flex:1,
    alignItems: 'center',
},
    
iosSubmitBtn: {
    backgroundColor: purple,
    padding: 10,
    borderRadius: 7,
    height: 45,
    marginLeft: 40,
    marginRight: 40,
    },

androidSubmitBtn: {
    backgroundColor: purple,
    padding: 10,
    paddingLeft: 30,
    paddingRight: 30,
    height: 45,
    borderRadius: 2,
    alignSelf: 'flex-end',
    justifyContent: 'center',
    alignItems: 'center',
    },

submitBtnText: {
    color: white,
    fontSize: 22,
    textAlign: 'center',
    },

center: {
    flex: 1,
    alignItems: 'center',
    marginRight: 30,
    marginLeft: 30,
}
    })


function mapStateToProps(state, { navigation }) {
    const key = timeToString()
    
    return {
    alreadyLogged: state[key] && typeof state[key].today === 'undefined',
    navigation,
    }
}

//connect our AddEntry component which then gives us access to dispatch method
export default connect(mapStateToProps)(AddEntry)
