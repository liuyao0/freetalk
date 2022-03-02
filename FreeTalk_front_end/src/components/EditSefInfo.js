import React from "react";
import {NativeAppEventEmitter, ScrollView, Text, View,ToastAndroid} from "react-native";
import AsyncStorage from '@react-native-community/async-storage';
import {Avatar, Button, Input,Icon} from "react-native-elements";
import ImagePicker from "react-native-image-crop-picker";
import {localhost} from "../../App";

export class EditSefInfo extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            navigation:props.navigation,
            image:'',
            username:'',
            password:'',
            passwordAgain:'',
            email:'',
            description:'',
            emailErrorMessage:'',
            passwordErrorMessage:'',
            oldPassword:'',
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
            fetch('http://'+localhost+'/getUserInfo?userId='+result, {
            }).then(response => response.json())
                .then(data => {
                    this.setState({
                        image:data.image,
                        username:data.username,
                        oldPassword:data.password,
                        email:data.email,
                        description:data.description,
                        userId:data.userId
                    })
                }).catch(function (e) {
                ToastAndroid.show("error:" + e,1);
            })
        });

    }


    onPressAddImage = () => {
        ImagePicker.openPicker({
            width: 100,
            height: 100,
            cropping: true,
            cropperCircleOverlay: false,
            includeBase64: true,
        }).then(image => {
            this.setState({
                    image:`data:${image.mime};base64,${image.data}`
                }
            );
        });
    };

    update=()=>{
        if(this.state.emailErrorMessage!==''){
            ToastAndroid.show('请输入有效邮箱',1)
            return
        }
        let infToService={
            method:'post',
            headers:{
                "Content-Type":"application/json",
                'token':this.state.token,
                'userId':this.state.userId.toString(),
            },
            body:JSON.stringify({
                "userId":this.state.userId,
                "username":this.state.username,
                "description":this.state.description,
                "email":this.state.email,
                "image":this.state.image
            })
        }
        fetch("http://"+localhost+"/Security/updateUserInfo?",infToService)
        this.props.navigation.goBack()
        NativeAppEventEmitter.emit('userInfoRefresh','refresh')
    }

    render=()=>{
        return(
            <ScrollView>
                <View style={{flex: 1, backgroundColor: 'white'}}>
                    <View
                        style={{
                            flex: 0.5,
                            backgroundColor: 'white',
                            alignItems: 'center',
                            borderBottomWidth: 1,
                            borderBottomColor: '#ffffff',
                            flexDirection: 'row',
                        }}>

                        <Icon
                            name={'chevron-left'}
                            size={37}
                            color={'#555'}
                            style={{paddingTop:3}}
                            onPress={() => this.state.navigation.goBack()}
                        />
                        <View style={{flex: 1,
                        backgroundColor:'white'}}>
                            <Text h4>   设置</Text>
                        </View>
                        <Button style={{alignSelf: 'flex-end'}} title="保存" type="clear" onPress={this.update} />
                    </View>

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
                                height:153,
                                flexDirection:"row",
                                justifyContent:"center"
                            }}
                        >
                            <Avatar
                                size={'xlarge'}
                                rounded
                                onPress={this.onPressAddImage}
                                source={{
                                    uri:this.state.image
                                }}
                            />
                        </View>
                        <View
                            style={{
                                width:'100%',
                                height:40
                            }}
                        />

                        <Input
                            placeholder={"用户名..."}
                            leftIcon={
                                <Icon
                                    type='antdesign'
                                    name='user'
                                    size={24}
                                    color='black'
                                />
                            }
                            value={this.state.username}
                            onChangeText={(text=>{
                                this.setState({
                                    username:text
                                })
                            })}
                        />
                        <Input
                            placeholder="个人简介..."
                            leftIcon={
                                <Icon
                                    type='antdesign'
                                    name='tags'
                                    size={24}
                                    color='black'
                                />
                            }
                            value={this.state.description}
                            onChangeText={(text=>{
                                this.setState({
                                    description:text
                                })
                            })}
                        />
                        <Input
                            placeholder={'邮箱...'}
                            leftIcon={
                                <Icon
                                    type='feather'
                                    name="mail"
                                    size={24}
                                    color='black'
                                />
                            }
                            value={this.state.email}
                            onChangeText={(text=>{
                                this.setState({
                                    email:text
                                })
                                if(!text.match(/^\w+@\w+\.\w+$/i)&&!text.match(/^\w+@\w+\.\w+\.\w+$/i))
                                    this.setState({
                                        emailErrorMessage:'请输入有效邮箱'
                                    })
                                else
                                    this.setState({
                                        emailErrorMessage:''
                                    })
                            })}
                            errorStyle={{ color: 'red' }}
                            errorMessage={this.state.emailErrorMessage}
                        />

                        <View
                            style={{
                                width:'100%',
                                height:20
                            }}
                        />
                        <Button
                            title="修改密码"
                            onPress={() => {
                                this.props.navigation.navigate('EditPassword')}}
                            buttonStyle={{borderRadius: 100, backgroundColor: '#0bc7e5'}}
                        />
                        <Button
                            title="退出登录"
                            onPress={() => {
                                AsyncStorage.removeItem('userid')
                                this.props.navigation.navigate('Login')}}
                            buttonStyle={{borderRadius: 100, backgroundColor: '#0bc7e5',marginTop:10}}
                        />
                    </View>
                </View>
            </ScrollView>
        )
    }
}
