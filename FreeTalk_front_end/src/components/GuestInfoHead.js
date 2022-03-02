import React from 'react';
import {ToastAndroid, Text, View} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {Avatar, Button} from 'react-native-elements';
import {localhost} from '../../App';

export class GuestInfoHead extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      image: '',
      username: '',
      oldPassword: '',
      email: '',
      description: '',
      userId: props.userId,
      navigation: props.navigation,
      fans: 0,
      follows: 0,
      myId: 0,
        myImage:'',
        myName:'',
    };
  }

  componentWillMount = () => {
    AsyncStorage.getItem('userid', (error, result) => {
      this.setState({
        myId: parseInt(result),
      });
    });
      AsyncStorage.getItem('token', (error, result) => {
          this.setState({
              token:result
          })
      });
    fetch(
      'http://' + localhost + '/getUserInfo?userId=' + this.state.userId,
      {},
    )
      .then(response => response.json())
      .then(data => {
        this.setState({
          image: data.image,
          username: data.username,
          oldPassword: data.password,
          email: data.email,
          description: data.description,
          userId: data.userId,
          follows: data.follows,
          fans: data.fans,
        });
      })
      .catch(function (e) {
        ToastAndroid.show('error:' + e, 1);
      });
      setTimeout(this.getMyInf,200);
  };
    getMyInf=()=>{
        fetch(
            'http://' + localhost + '/getUserInfo?userId=' + this.state.myId,
            {},
        )
            .then(response => response.json())
            .then(data => {
                this.setState({
                    myImage: data.image,
                    myName: data.username,
                });
            })
            .catch(function (e) {
                ToastAndroid.show('error:' + e, 1);
            });
    }
  render = () => {
    return (
      <View
        style={{
          flex: 0.2,
          backgroundColor: 'F0F0F0',
          alignItems: 'center',
          borderBottomWidth: 1,
          borderBottomColor: '#B7B7B7',
          flexDirection: 'row',
          paddingLeft: 5,
          paddingRight: 5,
        }}>
        <Avatar
          size="large"
          rounded
          source={{uri: this.state.image}}
          activeOpacity={0.9}
          placeholderStyle={'#FFFFFF'}
        />
        <View
          style={{
            flexDirection: 'column',
            flex: 1,
            paddingLeft: 8,
          }}>
          <Text h4>{this.state.username}</Text>
          <Text
            style={{
              color: '#666',
            }}>
            {this.state.fans + '粉丝  ' + this.state.follows + '关注'}
          </Text>
          <Text>{this.state.description}</Text>
        </View>
        <Button
          onPress={() => {
            this.props.navigation.navigate('ChatPrivate', {
                chatId: this.state.userId,
                userId: this.state.myId,
                userImage: this.state.myImage,
                otherImage: this.state.image,
                userName: this.state.myName,
                otherName: this.state.username,
                token:this.state.token,
            });
          }}
          title=" 私信 "
        />
      </View>
    );
  };
}
