import React, { Component } from 'react'
import { Text, FlatList, ScrollView, View } from 'react-native'
import { Card, ListItem } from 'react-native-elements'
import { LEADERS } from '../shared/leaders'
import { connect } from 'react-redux'
import { baseUrl } from '../shared/baseUrl'
import { Loading } from './LoadingComponent'
import * as Animatable from 'react-native-animatable'

const mapStateToProps = state => {
    return {
        leaders: state.leaders
    }
}

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
                        data={this.props.leaders.leaders}
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
                    leftAvatar={{ source: { uri: baseUrl + item.image } }}
                    />
            )
        }

        const { navigate } = this.props.navigation

        if(this.props.leaders.isLoading) {
            return(
                <ScrollView>
                    <History />
                    <Card title='Corporate Leadership'>
                        <Loading />
                    </Card>
                </ScrollView>
            )
        }
        else if(this.props.leaders.errMess) {
            return(
                <ScrollView>
                    <Animatable.View 
                        animation="fadeInDown"
                        duation={2000}
                        delay={1000}>
                            <History />
                            <Card title='Corporate Leadership'>
                                <Text>{this.props.leaders.errMess}</Text>
                            </Card>
                    </Animatable.View>    
                </ScrollView>
            )
        }
        else {
            return(
                <ScrollView>
                    <Animatable.View 
                        animation="fadeInDown"
                        duation={2000}
                        delay={1000}>
                            <History />
                            <View style={{marginBottom: 30}}>
                                <LeaderShipCard />
                            </View>
                    </Animatable.View>
                </ScrollView>
            )    
        }
    }
}

export default connect(mapStateToProps)(About)