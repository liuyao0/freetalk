import React from "react";
import {ToastAndroid, FlatList, TouchableOpacity, View} from "react-native";
import {UserInfo} from "./UserInfo";
import {styles} from "./MyTopic";
import {localhost} from "../../App";

export default class UsersIFollows extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            navigation: props.navigation,
            usersList: [],
            type: props.type,
            userId:props.userId

        }
    }

    componentDidMount() {
        // AsyncStorage.getItem('userid', (error, result) => {
        //
        //     if (this.state.type === 1)
        //         fetch('http://' + localhost + '/getAllUserIFollowing?userId=' + result, {}).then(response => response.json())
        //             .then(data => {
        //                 this.setState({
        //                     userList: data
        //                 })
        //             }).catch(function (e) {
        //             alert("error:" + e);
        //         })
        //     else
        //         fetch('http://' + localhost + '/getAllUserFollowingMe?userId=' + result, {}).then(response => response.json())
        //             .then(data => {
        //                 this.setState({
        //                     userList: data
        //                 })
        //             }).catch(function (e) {
        //             alert("error:" + e);
        //         })
        //
        //     this.setState({
        //         userId:parseInt(result)
        //     })
        // })
        if (this.state.type === 1)
            fetch('http://' + localhost + '/getAllUserIFollowing?userId=' + this.state.userId, {}).then(response => response.json())
                .then(data => {
                    this.setState({
                        userList: data
                    })
                }).catch(function (e) {
                ToastAndroid.show("error:" + e,1);
            })
        else
            fetch('http://' + localhost + '/getAllUserFollowingMe?userId=' + this.state.userId, {}).then(response => response.json())
                .then(data => {
                    this.setState({
                        userList: data
                    })
                }).catch(function (e) {
                ToastAndroid.show("error:" + e,1);
            })

    }


    render() {
        return <View>
            <FlatList
                style={{backgroundColor: '#f6f6f6'}}
                data={this.state.userList}
                keyExtractor={(user, index) => {
                    return 'idx:' + index.toString();
                }}

                ListFooterComponentStyle={{flex: 1, justifyContent: 'flex-end'}}

                contentContainerStyle={{flexGrow: 1}}
                renderItem={(user) => {
                    return (
                        <View style={styles.sectionStyleWithBorder}>
                            <View style={{flexDirection: 'row'}}>
                                <TouchableOpacity
                                    style={{
                                        width: '100%'
                                    }}
                                    onPress={() => {
                                        this.props.navigation.navigate('GuestInfo', {
                                            userId: user.item.userId,
                                        });
                                    }}>
                                    <UserInfo
                                        authorName={user.item.username}
                                        authorDescription={user.item.description}
                                        authorAvatarUri={user.item.image}
                                        authorFollowed={user.item.followOrNot}
                                        authorId={user.item.userId}
                                        userId={this.state.userId}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                    );
                }
                }
            />
        </View>
    }
}
