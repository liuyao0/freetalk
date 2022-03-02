import React, { Component } from 'react';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
import {Text, ToastAndroid, View} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";

export default class ScanScreen extends Component {
    constructor(props) {
        super(props);
        this.state={
            userId:0,
            update:false,
        }
    }

    componentWillMount() {
        AsyncStorage.getItem('userid', (error, result) => {
            this.setState({
                userId:parseInt(result)
            })
        });
    }

    renderCamera() {
        const isFocused = this.props.navigation.isFocused();
        if (!isFocused) {
            return null;
        } else if (isFocused) {
            return (
                <QRCodeScanner
                    onRead={(event)=>{
                        let regex = /^[-+]?\d*$/;
                        if(!regex.test(event.data)){
                            ToastAndroid.show("请不要扫描freeTalk网站扫码登陆以外的二维码", 1000)
                            setTimeout(()=>this.setState({update:true}),500)
                            this.setState({update:true})
                            return
                        }
                        this.setState({update:false})
                        ToastAndroid.show("扫码成功",1000)
                        this.props.navigation.navigate('ConfirmWebLogIn', {
                            codeId: parseInt(event.data),
                            userId: this.state.userId,
                        });
                    }}
                    flashMode={RNCamera.Constants.FlashMode.auto}
                    topViewStyle={{
                        maxHeight:0
                    }}
                    showMarker={true}
                    markerStyle={{borderColor:'#2ac0ee'}}
                    cameraStyle={{
                        minHeight: "100%"
                    }}
                    permissionDialogTitle={"无相机使用权限"}
                    permissionDialogMessage={"请轻触屏幕，然后选择”允许“或”在使用期间允许“以授予freeTalk使用相机的权限"}
                    buttonPositive={"好的"}
                    notAuthorizedView={
                        <View>
                            <Text>
                                无相机使用权限，请在“设置”中授予freeTalk相机权限
                            </Text>
                        </View>
                    }
                    reactivate={this.state.update}
                />
            )
        }
    }
    render() {
        return (
            <View style={{ flex: 1 }}>
                {this.renderCamera()}
            </View>
        );
    }
}
