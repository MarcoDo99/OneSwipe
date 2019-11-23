import React, { Component } from 'react'
import Swiper from 'react-native-deck-swiper'
import {StyleSheet,View,Image, Linking } from 'react-native'
import {AsyncStorage} from 'react-native';

import {Header, Icon, Button} from 'react-native-elements';

// demo purposes only
//commenting test
function * range (start, end) {
  for (let i = start; i <= end; i++) {
    yield i
  }
}

export default class Exemple extends Component {
  constructor (props) {
    super(props)
    this.state = {
      cards: [
        {
          url: '',
         image: ''
        }
      ],
      swipedAllCards: false,
      swipeDirection: '',
      cardIndex: 0
    }

    this._storeData = this._storeData.bind(this);
    this._retrieveData = this._retrieveData.bind(this);
    this._onHelpPress = this._onHelpPress.bind(this);
    this._onHeartPress = this._onHeartPress.bind(this);
    this._onCrossPress = this._onCrossPress.bind(this);
  }

  //this function stores the last Url. This is called everytime the app loads new data from the API
  _storeData = async (lastUrl) => {

    try {
      await AsyncStorage.setItem('lastUrl', lastUrl);
      //console.log("done storing");
    } catch (error) {
      console.log(error)
    }
  };

    //this function retrieves the last stored Url. This function is only called in componendDidMount()
  _retrieveData = async () => {

    try {
      const value = await AsyncStorage.getItem('lastUrl');
      if (value !== null) {
        // We have data!!
        //console.log(value);
        return value;
      }
    } catch (error) {
      // Error retrieving data
      //console.log(error)
      console.log("Error in retrieveData")
      return '';
    }
  };

  renderCard = (card, index) => {
    //console.log(card.url)
    if(typeof card === 'undefined') {
      return (<View style= {styles.card}>
            
      </View> )
    }
    return (
      <View style={styles.card}>
        <Image 
          source={{uri: card.image}} 
          resizeMode="contain" 
          style={styles.bodyImage}
          
          />
      </View>
    )
  };

  onSwiped = (type) => {
    //console.log(`on swiped ${type}`)
  }

  //this function loads new data from the API when all cards are swiped
  onSwipedAllCards = () => {
     
    //the last url of the current data set is used for the API call
    let lastUrl = this.state.cards[this.state.cards.length-1].url;

    //the API gets called to load new data
    fetch('https://jfabic58bh.execute-api.eu-central-1.amazonaws.com/default/query-function?card='+lastUrl)
    .then((response) => response.json())
    .then((responseJson) => {
      this.setState({
        cards:responseJson,
      })
      
      //the last url of the new data set is stored.
      this._storeData(responseJson[responseJson.length-1].url)
      
      })
    .catch((error) => console.log(error))

  };

  //When the app starts, the last stored url is retrieved to make sure, that the app only loads data,
  //that the app did not previously load
  async componentDidMount() {
    
    //last stored url is retrieved
    let lastUrl = await this._retrieveData()
    
    
    //API is called with last stored url
    fetch('https://jfabic58bh.execute-api.eu-central-1.amazonaws.com/default/query-function?card='+lastUrl)
    .then((response) => response.json())
    .then((responseJson) => {
      this.setState({
        cards:responseJson,
        
      })
      
      })
    .catch((error) => console.log(error));
  }

  swipeLeft = () => {
    
  };

  swipeRight = (card) => {
    
    Linking.openURL(card.url).catch((err) => console.error('An error occurred', err));
  }
  _onHelpPress= () => {
    let emailUrl = "mailto:m.dollinger@gmail.com?subject=OneSwipe Support";
    Linking.openURL(emailUrl).catch((err) => console.error('An error occurred', err));
  }

  _onHeartPress = () => {
    this.swiper.swipeRight();
    //console.log("HEART")
  }

  _onCrossPress = () => {
    this.swiper.swipeLeft();
  }

  render () {
    
    return (
      <View style={styles.container}>
        <View  style={styles.header}>
          <Header 
          //leftComponent={{ icon: 'menu', color: '#fff' }}
          centerComponent={{ text: 'OneSwipe', style: { color: '#fff', fontSize: 40 } }}
          rightComponent={<Icon name='help-outline' color='#fff' onPress={this._onHelpPress} />}    
          containerStyle={{
            backgroundColor: '#4FD0E9',
            flex:1
          }}
          />
        </View>
        <View style={styles.body}>
          <Swiper
            ref={swiper => {
              this.swiper = swiper
            }}
            onSwiped={() => this.onSwiped('general')}
            onSwipedLeft={() => this.onSwiped('left')}
            onSwipedRight={(card) => this.swipeRight(card)}
            onSwipedTop={() => this.onSwiped('top')}
            onSwipedBottom={() => this.onSwiped('bottom')}
            //onTapCard={this.swipeLeft}
            cards={this.state.cards}
            cardIndex={this.state.cardIndex}
            cardVerticalMargin={5}
            renderCard={this.renderCard}
            onSwipedAll={this.onSwipedAllCards}
            stackSize={3}
            stackSeparation={15}
            containerStyle={styles.container}
            overlayLabels={{
              // bottom: {
              //   title: 'BLEAH',
              //   style: {
              //     label: {
              //       backgroundColor: 'black',
              //       borderColor: 'black',
              //       color: 'white',
              //       borderWidth: 1
              //     },
              //     wrapper: {
              //       flexDirection: 'column',
              //       alignItems: 'center',
              //       justifyContent: 'center'
              //     }
              //   }
              // },
              left: {
                title: 'NOPE',
                style: {
                  label: {
                    backgroundColor: 'black',
                    borderColor: 'black',
                    color: 'white',
                    borderWidth: 1
                  },
                  wrapper: {
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    justifyContent: 'flex-start',
                    marginTop: 30,
                    marginLeft: -30
                  }
                }
              },
              right: {
                title: 'LIKE',
                style: {
                  label: {
                    backgroundColor: 'black',
                    borderColor: 'black',
                    color: 'white',
                    borderWidth: 1
                  },
                  wrapper: {
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    justifyContent: 'flex-start',
                    marginTop: 30,
                    marginLeft: 30
                  }
                }
              // },
              // top: {
              //   title: 'SUPER LIKE',
              //   style: {
              //     label: {
              //       backgroundColor: 'black',
              //       borderColor: 'black',
              //       color: 'white',
              //       borderWidth: 1
              //     },
              //     wrapper: {
              //       flexDirection: 'column',
              //       alignItems: 'center',
              //       justifyContent: 'center'
              //     }
              //   }
               }
            }}
            animateOverlayLabelsOpacity
            animateCardOpacity
            swipeBackCard
          >
          
          </Swiper>
        </View>
        <Button
          icon={
          <Icon
            name="favorite-border"
            size={100}
            color="red"
          />}
          containerStyle={{
            position: 'absolute',
            top: '80%',
            right: '1%',
            //backgroundColor: 'transparent'
          }
          }
          buttonStyle={{
            backgroundColor: 'transparent',
            
          }}
          onPress={this._onHeartPress}
          
        />
        <Button
          icon={
          <Icon
            name="clear"
            size={100}
            color="red"
          />}
          containerStyle={{
            position: 'absolute',
            top: '80%',
            left: '1%',
            //backgroundColor: 'transparent'
          }
          }
          buttonStyle={{
            backgroundColor: 'transparent',
            
          }}
          onPress={this._onCrossPress}
          
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#4FD0E9",
    
    
    
    
  },
  header: {
    height: 100,
    backgroundColor: '#4FD0E9',
    borderColor: '#fff',
    borderBottomWidth: 2
    
  },
  body: {
    flex: 1,
    backgroundColor: '#fff',
    
    
  },
  card: {
    flex: 1,
    //justifyContent: 'center',
    backgroundColor: '#fff',
    alignSelf: 'center'
    
  },
  text: {
    textAlign: 'center',
    fontSize: 50,
    backgroundColor: 'transparent'
  },
  done: {
    textAlign: 'center',
    fontSize: 30,
    color: 'white',
    backgroundColor: 'transparent'
  },
  bodyImage: {
      flex: 1,
      width:300,
      alignSelf: 'center'
    
  }

})