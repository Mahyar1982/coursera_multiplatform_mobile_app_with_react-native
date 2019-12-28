import React, { Component } from 'react'
import { Text, FlatList, ScrollView, View } from 'react-native'
import { Card, ListItem } from 'react-native-elements'
import { LEADERS } from '../shared/leaders'

const cardHistoryTitle = 'Our History'
const cardHistoryText = 'Started in 2010, Ristorante con Fusion quickly established itself as a culinary icon par excellence in Hong Kong. With its unique brand of world fusion cuisine that can be found nowhere else, it enjoys patronage from the A-list clientele in Hong Kong.  Featuring four of the best three-star Michelin chefs in the world, you never know what will arrive on your plate the next time you visit us.\n\The restaurant traces its humble beginnings to The Frying Pan, a successful chain started by our CEO, Mr. Peter Pan, that featured for the first time the worlds best cuisines in a pan.'
const cardLeaderTitle = 'Corporate Leadership'

function History() {
    return(
        <Card
            title={cardHistoryTitle}
            >
            <Text style={{margin: 10, lineHeight: 20}}>
                {cardHistoryText}
            </Text>
        </Card>
    )
}

class About extends Component {

    constructor(props) {
        super(props)
        this.state = {
            leaders: LEADERS
        }
    }
    
    static navigationOptions = {
        title: 'About'
    }

    render() {

        const LeaderShipCard = () => {
            return(
                <Card
                    title={cardLeaderTitle}
                    >
                    <FlatList 
                        data={this.state.leaders}
                        renderItem={LeaderShipItems}
                        keyExtractor={item => item.id.toString()}
                        />
                </Card>
            )
        }

        const LeaderShipItems = ({item, index}) => {
            return(
                <ListItem
                    key={index}
                    title={item.name}
                    subtitle={item.description}
                    hideChevron={true}
                    leftAvatar={{ source: require('./images/alberto.png') }}
                    />
            )
        }

        const { navigate } = this.props.navigation

        return(
            <ScrollView>
                <History />
                <View style={{marginBottom: 30}}>
                    <LeaderShipCard />
                </View>
            </ScrollView>
        )
    }
}

export default About