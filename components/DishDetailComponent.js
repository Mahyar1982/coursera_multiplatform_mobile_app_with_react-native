import React, { Component } from 'react'
import { View, Text, ScrollView, FlatList, StyleSheet, Modal, Button, Alert, PanResponder } from 'react-native'
import { Card, Icon, Rating, Input } from 'react-native-elements'
import { connect } from 'react-redux'
import { baseUrl } from '../shared/baseUrl'
import { postFavorite, postComment } from '../redux/ActionCreators'
import * as Animatable from 'react-native-animatable'

const mapStateToProps = state => {
    return {
        dishes: state.dishes,
        comments: state.comments,
        favorites: state.favorites
    }
}

const mapDispatchToProps = dispatch => ({
    postFavorite: (dishId) => dispatch(postFavorite(dishId)),
    postComment: (dishId, rating, author, comment) => dispatch(postComment(dishId, rating, author, comment))
})

function RenderDish(props) {
    const dish = props.dish

    handleViewRef = ref => this.view = ref

    const recognizeDrag = ({ moveX, moveY, dx, dy }) => {
        if( dx < -200 )
            return true
        else
            return false 
    }

    const recognizeComment = ({ moveX, moveY, dx, dy }) => {
        if( dx > 200 )
            return true
        else
            return false
    }

    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: (e, gestureState) => {
            return true
        },
        onPanResponderGrant: () => {
            this.view.rubberBand(1000)
                .then(endState => console.log(endState.finished ? 'finished' : 'cancelled'))
        },
        onPanResponderEnd: (e, gestureState) => {
            if(recognizeComment(gestureState)) {
                props.onToggle()
                return true
            }
            if(recognizeDrag(gestureState)) {
                Alert.alert(
                    'Add to Favorites',
                    'Are you sure you wish to add ' + dish.name + ' to your favorites?',
                    [
                        {
                            text: 'Cancel',
                            onPress: () => console.log('Cancel pressed'),
                            style: 'cancel'
                        },
                        {
                            text: 'OK',
                            onPress: () => props.favorite ? console.log('Already favorite') : props.onPress()
                        }
                    ],
                    { cancelable: false }
                )
            return true
            }
        }
    })

    if (dish != null) {
        return(
            <Animatable.View 
                animation="fadeInDown"
                duation={2000}
                delay={1000}
                ref={this.handleViewRef}
                {...panResponder.panHandlers}>
                    <Card
                        featuredTitle={dish.name}
                        image={{ uri: baseUrl + dish.image }}
                        >
                        <Text style={{margin: 10}}>
                            {dish.description}
                        </Text>
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
                        <Icon
                            raised
                            reverse
                            name={ props.favorite ? 'heart' : 'heart-o' }
                            type='font-awesome'
                            color='#f50'
                            onPress={() => props.favorite ? console.log('Already favorite') : props.onPress()}
                            />
                        <Icon
                            raised
                            reverse
                            name={ 'pencil' }
                            type='font-awesome'
                            color='#512DA8'
                            onPress={() => props.onToggle()}
                            />                     
                        </View>     
                    </Card>
            </Animatable.View>
        )
    }
    else {
        return(<View></View>)
    }
}

function RenderComments(props) {
    const comments = props.comments

    const renderCommentItem = ({ item, index }) => {
        return(
            <View key={index} style={{margin: 10}}>
                <Text style={{fontSize: 14}}>
                    {item.comment}
                </Text>
                <Text style={{fontSize: 12}}>
                    {item.rating} Stars
                </Text>
                <Text style={{fontSize: 12}}>
                    {'-- ' + item.author + ', ' + item.date}
                </Text>
            </View>
        )
    }

    return(
        <Animatable.View 
            animation="fadeInUp"
            duation={2000}
            delay={1000}>
                <Card 
                    title="Comments"
                    >
                    <FlatList
                        data={comments}
                        renderItem={renderCommentItem}
                        keyExtractor={item => item.id.toString()}
                        /> 
                </Card>
        </Animatable.View>    
    )

}

class Dishdetail extends Component {

    constructor(props) {
        super(props)
        this.state = {
            ratingStar: 1,
            author: '',
            comment: '',
            showModal: false
        }
    }

    markFavorite(dishId) {
        this.props.postFavorite(dishId)
    }

    ratingCompleted = (rating) => {
        console.log("Rating is: " + rating)
            this.setState({
                ratingStar: rating
            })
      }

    toggleModal() {
        this.setState({
            showModal: !this.state.showModal
        })
    }

    handleComment(dishId) {
        this.props.postComment(dishId, this.state.ratingStar, this.state.author, this.state.comment)
    }

    resetForm() {
        this.setState({
            author: '',
            comment: '',
            ratingStar: 1
        })
    }
    
    static navigationOptions = {
        title: 'Dish Details'
    }

    render() {
        const dishId = this.props.navigation.getParam('dishId','')
        
        return(
            <ScrollView>
                <RenderDish dish={this.props.dishes.dishes[+dishId]}
                    favorite={ this.props.favorites.some(el => el === dishId) }
                    onPress={() => this.markFavorite(dishId)}
                    onToggle={() => this.toggleModal()}
                    />
                <RenderComments comments={this.props.comments.comments.filter((comment) => comment.dishId === dishId)} />
                <Modal
                    animationType={'slide'}
                    transparent={false}
                    visible={this.state.showModal}
                    onDismiss={() => {this.toggleModal(); this.resetForm()}}
                    onRequestClose={() => {this.toggleModal(); this.resetForm()}}
                    >
                    <View style={styles.modal}>
                        <Rating
                            showRating    
                            startingValue= {1}   
                            onFinishRating={this.ratingCompleted}
                             />
                       <Input
                            placeholder='Author'
                            leftIcon={{ type: 'font-awesome', name: 'user-o'}}
                            onChangeText={(value) => this.setState({ author: value })}
                            />
                        <Input
                            placeholder='Author'
                            leftIcon={{ type: 'font-awesome', name: 'comment-o' }}
                            onChangeText={(value) => this.setState({ comment: value })}
                            />
                        <View style={{height: 20}}></View>        
                        <Button
                            onPress={() => {this.handleComment(dishId); this.toggleModal()}}
                            color='#512DA8'
                            title='Submit'
                         />
                         <View style={{height: 20}}></View>
                        <Button
                            onPress={() => {this.toggleModal(); this.resetForm()}}
                            color='#373a3c'
                            title='Close'
                         />
                    </View>
                </Modal>
            </ScrollView>
            )
    }
}

const styles = StyleSheet.create({
    modal: {
        justifyContent: 'center',
        margin: 20
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        backgroundColor: '#512DA8',
        textAlign: 'center',
        color: 'white',
        marginBottom: 20 
    },
    modalText: {
        fontSize: 18,
        margin: 10
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(Dishdetail)