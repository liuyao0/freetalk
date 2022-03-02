import React from "react";
import { ScrollView, View,ToastAndroid} from "react-native";
import AsyncStorage from '@react-native-community/async-storage';
import {Button, Input,Icon} from "react-native-elements";
import {localhost} from "../../App";

export class EditSefInfo extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            navigation:props.navigation,
            newPassword:'',
            oldPassword:'',
            passwordAgain:'',
            passwordErrorMessage:'',
            passwordErrorMessage2:'',
            userId:'',
            token:'',
        }
    }

    componentDidMount() {
        AsyncStorage.getItem('token', (error, result) => {
            this.setState({
                token:result
            })
        });
        AsyncStorage.getItem('userid', (error, result) => {
            this.setState({
                userId:parseInt(result)
            })
        });

    }
    update=()=>{
        if(this.state.passwordErrorMessage!==''){
            ToastAndroid.show('两次输入的密码不一致',1)
            return
        }
        if(this.state.passwordErrorMessage2!==''){
            ToastAndroid.show('和原密码输入一致',1)
            return
        }
        let inf={
            method:'post',
            headers:{
                "Content-Type":"application/json",
                'token':this.state.token,
                'userId':this.state.userId.toString(),
            },
            body:JSON.stringify({
                "userId":this.state.userId,
                "oldPassword":this.state.oldPassword,
                "newPassword":this.state.newPassword,
            })
        }
        fetch('http://' + localhost + 'Security/updatePassword', inf)
            .then(response => response.text())
            .then(data => {
                if (data !== '') {
                    ToastAndroid.show('修改成功', 1);
                    this.props.navigation.goBack()
                }
                else {
                    ToastAndroid.show('旧密码错误', 1);
                }
            })
    }

    render=()=>{
        return(
            <ScrollView>
                <View style={{flex: 1, backgroundColor: 'white'}}>
                    <View
                        style={{
                            flex: 0.3,
                            alignItems: 'stretch',
                            backgroundColor: '#FFFFFF',
                            padding: 5,
                        }}>
                    </View>
                    <View
                        style={{
                            flex: 3,
                            alignItems: 'stretch',
                            backgroundColor: '#FFFFFF',
                            flexDirection: 'column',
                        }}>
                        <View
                            style={{
                                width:'100%',
                                height:40
                            }}
                        />
                        <View
                            style={{
                                width:'100%',
                                height:40
                            }}
                        />
                        <Input
                            placeholder='旧密码'
                            leftIcon={
                                <Icon
                                    type='antdesign'
                                    name='lock'
                                    size={24}
                                    color='black'
                                />
                            }
                            secureTextEntry={true}
                            onChangeText={(text=>{
                                this.setState({
                                    oldPassword:text
                                })
                            })}
                        />

                        <Input
                            placeholder='新密码...'
                            leftIcon={
                                <Icon
                                    type='antdesign'
                                    name='lock'
                                    size={24}
                                    color='black'
                                />
                            }
                            secureTextEntry={true}
                            onChangeText={(text=>{
                                this.setState({
                                    newPassword:text
                                })
                                if(text===this.state.oldPassword)
                                    this.setState({
                                        passwordErrorMessage2:"和原密码一致"
                                    })
                                else
                                    this.setState({
                                        passwordErrorMessage2:""
                                    })
                            })}
                            errorMessage={this.state.passwordErrorMessage2}
                        />
                        <Input
                            placeholder='确认密码...'
                            leftIcon={
                                <Icon
                                    type='antdesign'
                                    name='lock'
                                    size={24}
                                    color='black'
                                />
                            }
                            secureTextEntry={true}
                            onChangeText={(text=>{
                                this.setState({
                                    passwordAgain:text
                                })
                                if(text!==this.state.newPassword)
                                    this.setState({
                                        passwordErrorMessage:"两次输入的密码不一致"
                                    })
                                else
                                    this.setState({
                                        passwordErrorMessage:""
                                    })

                            })}
                            errorStyle={{ color: 'red' }}
                            errorMessage={this.state.passwordErrorMessage}
                        />
                        <View
                            style={{
                                width:'100%',
                                height:20
                            }}
                        />
                        <Button
                            title="修改密码"
                            onPress={() => this.update()}
                            buttonStyle={{borderRadius: 100, backgroundColor: '#0bc7e5'}}
                        />
                        <Button
                            title="返回"
                            onPress={() => {
                                this.props.navigation.goBack()}}
                            buttonStyle={{borderRadius: 100, backgroundColor: '#0bc7e5',marginTop:5}}
                        />
                    </View>
                </View>
            </ScrollView>
        )
    }
}
export default EditSefInfo;
