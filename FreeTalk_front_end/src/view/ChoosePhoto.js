import React from 'react';
import { View,ToastAndroid} from 'react-native';
import {Button} from 'react-native-elements';
import logo from '../image/logo.png';
import {Image} from 'react-native-elements';
import {Text} from 'react-native-elements';
import {Avatar} from 'react-native-elements';
import ImagePicker from 'react-native-image-crop-picker';
import {localhost} from '../../App';


export class ChoosePhoto extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imgBase64:
        'data:image/jpeg;base64,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',
      registerId: this.props.route.params.userId,
    };
  }
  onPressAddImage = () => {
    ImagePicker.openPicker({
      width: 200,
      height: 200,
      cropping: true,
      cropperCircleOverlay: false,
      includeBase64: true,
    }).then(image => {
      this.setState({
        imgBase64: `data:${image.mime};base64,${image.data}`,
      });
    });
  };
  Send = () => {
    let inf = {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: this.state.registerId,
        imageBase64: this.state.imgBase64,
      }),
    };
    fetch('http://' + localhost + '/updateImage', inf)
      .catch(function (e) {
          ToastAndroid.show("error:" + e,1);
      })
      .then(response => response.json())
      .catch(function (ex) {
        console.log('parsing failed', ex);
      });
  };
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

        <Text h4 style={{color: '#5f5e5e', textAlign: 'center'}}>
          {'Hi!' +
            '你的账号是 ' +
            this.state.registerId +
            ' ,上传一张你喜欢的头像吧'}
        </Text>

        <View
          style={{
            width: '100%',
            height: 40,
          }}
        />
        <View
          style={{
            width: '100%',
            height: 153,
            flexDirection: 'row',
            justifyContent: 'center',
          }}>
          <Avatar
            size={'xlarge'}
            rounded
            onPress={this.onPressAddImage}
            source={{
              uri: this.state.imgBase64,
            }}
          />
        </View>

        <View
          style={{
            width: '100%',
            height: 40,
          }}
        />

        <View>
          <Button
            title="确认"
            buttonStyle={{borderRadius: 100, backgroundColor: '#0bc7e5'}}
            onPress={() => {
              this.Send();
              this.props.navigation.navigate('Login');
            }}
          />
          <View
            style={{
              width: '100%',
              height: 20,
            }}
          />
          <Button
            title="使用默认头像"
            buttonStyle={{borderRadius: 100, backgroundColor: '#0bc7e5'}}
            onPress={() => {
              this.Send();
              this.props.navigation.navigate('Login');
            }}
          />
        </View>
      </View>
    );
  }
}
