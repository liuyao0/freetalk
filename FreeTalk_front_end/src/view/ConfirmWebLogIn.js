import React from 'react';
import {
    ToastAndroid,
    View,
} from 'react-native';
import {localhost} from '../../App';
import {Button, Image, Text} from "react-native-elements";
import logo from "../image/logo.png";

export class ConfirmWebLogIn extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            codeId: this.props.route.params.codeId,
            userId: this.props.route.params.userId,
        };
    }

    refuse=()=>{
        this.props.navigation.navigate('Host');
    }

    accept=()=>{
        fetch('http://' + localhost + '/mobileConfirmLogin?userId='+this.state.userId+"&codeId="+this.state.codeId);
        this.props.navigation.navigate('Host');
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

                <Text h4 style={{color: '#5f5e5e', textAlign: 'center'}}>
                    {'你正试图在电脑登陆FreeTalk'}
                </Text>
                <Text h4 style={{color: '#5f5e5e', textAlign: 'center'}}>
                    {'地点: 上海市'}
                </Text>

                <View
                    style={{
                        width: '100%',
                        height: 40,
                    }}
                />

                <View>
                    <Button
                        title="确认登录"
                        buttonStyle={{borderRadius: 100, backgroundColor: '#0bc7e5'}}
                        onPress={() => {
                            this.accept()
                        }}
                    />
                    <View
                        style={{
                            width: '100%',
                            height: 20,
                        }}
                    />
                    <Button
                        title="拒绝登录"
                        buttonStyle={{borderRadius: 100, backgroundColor: '#0bc7e5'}}
                        onPress={() => {
                            this.refuse()
                        }}
                    />
                </View>
            </View>
        )
    };
}
