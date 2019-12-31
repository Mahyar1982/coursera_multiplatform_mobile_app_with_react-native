import React, { Component } from 'react'
import { Text } from 'react-native'
import { Card } from 'react-native-elements'
import * as Animatable from 'react-native-animatable'

const cardTitle = 'Contact Information'
const cardText = '121, Clear Water Bay Road\n\Clear Water Bay, Kowloon\n\HONG KONG\n\Tel: +852 1234 5678\n\Fax: +852 8765 4321\n\Email:confusion@food.net'

function RenderItem() {
    return(
        <Card
            title={cardTitle}
            >
            <Text style={{margin: 10, lineHeight: 30}}>
                {cardText}
            </Text>
        </Card>
    )
}

class Contact extends Component {
    
    static navigationOptions = {
        title: 'Contact'
    }

    render() {
        return(
            <Animatable.View 
                animation="fadeInDown"
                duation={2000}
                delay={1000}>
                    <RenderItem />
            </Animatable.View>
        )
    }
}

export default Contact