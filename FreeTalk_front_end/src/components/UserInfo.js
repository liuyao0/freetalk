import React from 'react';
import {Text, View} from 'react-native';
import {Button, Icon} from 'react-native-elements';
import {Avatar} from 'react-native-elements/dist/avatar/Avatar';
import {localhost} from "../../App";
import AsyncStorage from '@react-native-community/async-storage';

export class UserInfo extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            authorName: props.authorName,
            authorDescription: props.authorDescription,
            isMe: props.isMe,
            type:props.type,
            authorFollowed: props.authorFollowed,
            authorAvatarUri:props.authorAvatarUri,
            userId:props.userId,
            authorId:props.authorId,
            token:'',
        }
    }

    componentDidMount() {
        AsyncStorage.getItem('token', (error, result) => {
            this.setState({
                token:result
            })
        });
    }

    renderAuthorName=()=>{
        return(<Text
            style={{fontSize:16}}
            numberOfLines={1}
        >
            {this.state.authorName}
        </Text>)
    }

    renderAuthorDescription=()=>{
        return(<Text
                style={{
                    fontSize:13,
                    color:"#888"
                }}
                numberOfLines={1}
            >
                {this.state.authorDescription}
            </Text>
        )
    }

    renderFollowButton=()=>{
        if (this.state.isMe){
            return <View />
        }
        if (!this.state.authorFollowed)
            return(
                <Button
                    icon={<Icon name={'add'} color={'white'} size={14}/>}
                    title={"关注"}
                    onPress={
                        ()=>{
                            if (this.state.followOrNot === true)
                                fetch('http://' + localhost + '/Security/unfollowAUser?userId=' + this.state.userId + "&userId_toFollow=" + this.state.authorId,{
                                    headers:{
                                        'token':this.state.token,
                                        'userId':this.state.userId.toString(),
                                    }
                                });
                            else
                                fetch('http://' + localhost + '/Security/followAUser?userId=' + this.state.userId + "&userId_toFollow=" + this.state.authorId,{
                                    headers:{
                                        'token':this.state.token,
                                        'userId':this.state.userId.toString(),
                                    }
                                });
                            let temp=!this.state.authorFollowed
                            this.setState({
                                authorFollowed:temp
                            })
                    }}
                    containerStyle={{
                        width:60,
                        height:45,
                    }}
                    buttonStyle={{
                        padding:5
                    }}
                    titleStyle={{
                        fontSize:14
                    }}
                />
            )
        else
            return(
                <Button
                    title={"已关注"}
                    onPress={()=>{
                        if (this.state.authorFollowed === true)
                            fetch('http://' + localhost + '/Security/unfollowAUser?userId=' + this.state.userId + "&userId_toFollow=" + this.state.authorId,{
                                headers:{
                                    'token':this.state.token,
                                    'userId':this.state.userId.toString(),
                                }
                            });
                        else
                            fetch('http://' + localhost + '/Security/followAUser?userId=' + this.state.userId + "&userId_toFollow=" + this.state.authorId,{
                                headers:{
                                    'token':this.state.token,
                                    'userId':this.state.userId.toString(),
                                }
                            });
                        let temp=!this.state.authorFollowed
                        this.setState({
                            authorFollowed:temp
                        })
                    }}
                    containerStyle={{
                        width:60,
                    }}
                    buttonStyle={{
                        padding:5,
                        backgroundColor:'#afafaf'
                    }}
                    titleStyle={{
                        color:'#8f8f8f',
                        fontSize:14
                    }}
                />
            )
    }


    render=()=>{
        return(
            <View
                style={{
                    backgroundColor:'white',
                    padding:0,
                    marginTop:0,
                    flexDirection:"row",
                    justifyContent:"space-between",
                    height:70
                }}
            >
                <View
                    style={{
                        padding:10,
                        height:70
                    }}
                >
                    <Avatar
                        rounded
                        source={{uri:this.state.authorAvatarUri}}
                        onPress={() => console.log("Press the Avatar.")}
                        size={"medium"}
                    />
                </View>
                <View
                    style={{
                        flex:1,
                        flexDirection:"column",
                        justifyContent:"space-around",
                        paddingTop:10,
                        paddingBottom:18,
                        width:"100%"
                    }}
                >
                    {this.renderAuthorName()}
                    {this.renderAuthorDescription()}
                </View>
                <View
                    style={{
                        height:35,
                        width:60,
                        marginRight:15,
                        alignSelf:"center"
                    }}
                >
                    {this.renderFollowButton()}
                </View>
            </View>
        )
    }
}
