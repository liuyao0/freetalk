import React from 'react';
import {ToastAndroid, View} from 'react-native';
import logo from '../image/logo.png';
import {Input, Image, Icon, Button} from 'react-native-elements';
import {localhost} from '../../App';


export class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      passwordAgain: '',
      email: '',
      userid: 0,
      visible: false,
      emailErrorMessage: '',
    };
  }

  Register() {
    if (this.state.password !== this.state.passwordAgain) {
      ToastAndroid.show('两次密码输入不一致',1);
    } else if (
      !this.state.email.match(/^\w+@\w+\.\w+$/i) &&
      !this.state.email.match(/^\w+@\w+\.\w+\.\w+$/i)
    ) {
      ToastAndroid.show('邮箱格式不合法',1);
    } else {
      let username = this.state.username;
      let password = this.state.password;
      let email = this.state.email;
      let inf = {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          password: password,
          email: email,
        }),
      };
      fetch('http://' + localhost + '/register', inf)
        .catch(function (e) {
          ToastAndroid.show('error:' + e,1);
        })
        .then(response => response.json())
        .then(data => {
          this.setState({
            userid: data,
          });
            this.props.navigation.navigate('ChoosePhoto', {
                userId: this.state.userid,
            });
        })
        .catch(function (ex) {
          console.log('parsing failed', ex);
        });
    }
  }

  render() {
    return (
      <View style={{padding: '2%', backgroundColor:'white',height:'100%'}}>
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
          placeholder="用户名..."
          leftIcon={
            <Icon type="antdesign" name="user" size={24} color="black" />
          }
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
        <Input
          placeholder="确认密码..."
          leftIcon={
            <Icon type="antdesign" name="lock" size={24} color="black" />
          }
          secureTextEntry={true}
          onChangeText={text => {
            this.setState({
              passwordAgain: text,
            });
          }}
        />
        <Input
          placeholder="邮箱..."
          leftIcon={<Icon type="feather" name="mail" size={24} color="black" />}
          onChangeText={text => {
            this.setState({
              email: text,
            });
            if (
              !text.match(/^\w+@\w+\.\w+$/i) &&
              !text.match(/^\w+@\w+\.\w+\.\w+$/i)
            ) {
              this.setState({
                emailErrorMessage: '请输入有效邮箱',
              });
            } else {
              this.setState({
                emailErrorMessage: '',
              });
            }
          }}
          errorStyle={{color: 'red'}}
          errorMessage={this.state.emailErrorMessage}
        />
        <View
          style={{
            width: '100%',
            height: 20,
          }}
        />
        <View>
          <Button
            title="注册"
            onPress={() => this.Register()}
            buttonStyle={{borderRadius: 100, backgroundColor: '#0bc7e5'}}
            disabled={
              !(
                this.state.username !== '' &&
                this.state.password !== '' &&
                this.state.passwordAgain !== '' &&
                this.state.email !== ''
              )
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
            title="返回"
            onPress={() => this.props.navigation.navigate('Login')}
            buttonStyle={{borderRadius: 100, backgroundColor: '#0bc7e5'}}
          />
        </View>
      </View>
    );
  }
}
