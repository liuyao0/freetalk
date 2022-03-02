import React from "react";
import {FlatList, TouchableOpacity, View,ToastAndroid} from "react-native";
import AsyncStorage from '@react-native-community/async-storage';
import {TopicCommentSection} from "./TopicCommentSection";
import {styles,changeHTMLToText} from "./MyTopic";
import {localhost} from "../../App";

export class MyComment extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            navigation:props.navigation,
            topicList:[],
            type:props.type,
            userId:props.userId
        }
    }

    componentDidMount() {
        // AsyncStorage.getItem('userid', (error, result) => {
        //
        //
        //     this.setState({
        //         userId:parseInt(result)
        //     })
        // })
        if(this.state.type===0)
            fetch('http://'+localhost+'/getCommentsUserCreat?userId='+this.state.userId, {
            }).then(response => response.json())
                .then(data => {
                    this.setState({
                        topicList:data
                    })
                }).catch(function (e) {
                ToastAndroid.show("error:" + e,1);
            })
        else
            fetch('http://'+localhost+'/getCommentsUserStar?userId='+this.state.userId, {
            }).then(response => response.json())
                .then(data => {
                    this.setState({
                        topicList:data
                    })
                }).catch(function (e) {
                ToastAndroid.show("error:" + e,1);
            })
    }


    render() {
        return <View>
            <FlatList
                style={{backgroundColor: '#f6f6f6'}}
                data={this.state.topicList}
                keyExtractor={(topic, index) => {
                    return 'idx:' + index.toString();
                }}
                ListFooterComponent={this.showEnd}

                ListFooterComponentStyle={{ flex: 1, justifyContent: 'flex-end' }}

                contentContainerStyle={{ flexGrow: 1 }}
                renderItem={(topic) => {
                    return (
                        <View style={styles.sectionStyleWithBorder}>
                            <View style={{flexDirection: 'row'}}>
                                <TouchableOpacity
                                    onPress={() => {
                                        AsyncStorage.setItem('topic', JSON.stringify(topic.item.topicId));
                                        this.props.navigation.push('DetailedTopic',{topicId:topic.item.topicId});
                                    }}>
                                    <TopicCommentSection
                                        topicTitle={topic.item.topicTitle}
                                        authorAvatarUri={topic.item.image}
                                        authorName={topic.item.username}
                                        postingAbbr={changeHTMLToText(topic.item.commentContent)}
                                        likeNum={topic.item.likes}
                                        starNum={topic.item.stars}
                                        replyNum={topic.item.replyNumber}
                                        postingTime={topic.item.sendTime}
                                        showDate={false}
                                        showHot={false}
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
