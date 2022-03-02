import React from 'react';
import {NativeAppEventEmitter, Text, ToastAndroid, View} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {Button} from 'react-native-elements';
import logo from '../image/logo.png';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Input, Image} from 'react-native-elements';
import {localhost} from '../../App';
import {getDateTime} from '../components/Reply';

export class LogIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      userid: '',
        ban:'',
        token:'',
    };
  }

  logIn() {
    let username = this.state.username;
    let password = this.state.password;
    let inf = {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
          'Token':'test',
      },
      body: JSON.stringify({
        userid: username,
        password: password,
      }),
    };
    fetch('http://' + localhost + '/login', inf)
      .then(response => response.json())
      .then(data => {
        this.setState({
          userid: data[0],
            ban:data[1],
            token:data[2],
        });
        if (this.state.userid !== '') {
          AsyncStorage.setItem('userid',this.state.userid);
          AsyncStorage.setItem('token',this.state.token);
            if(this.state.ban!==''){
                ToastAndroid.show('提示：您已被禁言到'+this.state.ban, 1);
            }
          this.props.navigation.navigate('Home');
          this.setState({
              userid: '',
          });
          NativeAppEventEmitter.emit('userInfoRefresh', 'refresh');
          NativeAppEventEmitter.emit('PrivateMessageRefresh', 'refresh');
          NativeAppEventEmitter.emit('CommentRefresh', 'refresh');
          NativeAppEventEmitter.emit('HostPageRefresh', 'refresh');
        }
        else {
          ToastAndroid.show('用户名或密码错误', 1);
        }
      })
      .catch(function (ex) {
        console.log('parsing failed', ex);
      });
  }

  // nav = () => {
  //   if (this.state.jump !== '') {
  //     AsyncStorage.setItem('userid', JSON.stringify(this.state.jump));
  //     this.props.navigation.navigate('Home');
  //     this.setState({
  //       jump: '',
  //     });
  //       NativeAppEventEmitter.emit('userInfoRefresh','refresh')
  //       NativeAppEventEmitter.emit('PrivateMessageRefresh','refresh')
  //       NativeAppEventEmitter.emit('CommentRefresh','refresh')
  //       NativeAppEventEmitter.emit('HostPageRefresh','refresh')
  //
  //   } else {
  //     ToastAndroid.show('用户名或密码错误',1);
  //   }
  // };
  render() {
    return (
      <View style={{padding: '2%', backgroundColor: 'white', height: '100%'}}>
        <View style={{width: '100%'}}>
          <Image containerStyle={{width: '100%', height: 200}} source={logo} />
        </View>

        <View
          style={{
            width: '100%',
            height: 20,
          }}
        />
        <Input
          placeholder="账号..."
          leftIcon={<Icon name="user" size={24} color="black" />}
          onChangeText={text => {
            this.setState({
              username: text,
            });
          }}
        />

        <Input
          placeholder="密码..."
          leftIcon={
            <Icon type="antdesign" name="lock" size={24} color="black" />
          }
          secureTextEntry={true}
          onChangeText={text => {
            this.setState({
              password: text,
            });
          }}
        />
        <View
          style={{
            width: '100%',
            height: 20,
          }}
        />
        <View>
          <Button
            title="登录"
            onPress={() => this.logIn()}
            buttonStyle={{borderRadius: 100, backgroundColor: '#0bc7e5'}}
            disabled={
              !(this.state.username !== '' && this.state.password !== '')
            }
          />
        </View>
        <View
          style={{
            width: '100%',
            height: 20,
          }}
        />
        <View>
          <Button
            title="注册"
            onPress={() => this.props.navigation.navigate('Register')}
            buttonStyle={{borderRadius: 100, backgroundColor: '#0bc7e5'}}
          />
        </View>
      </View>
    );
  }
}
