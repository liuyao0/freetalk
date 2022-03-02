import React from "react";
import {FlatList, TouchableOpacity, View,ToastAndroid} from "react-native";
import AsyncStorage from '@react-native-community/async-storage';
import {TopicSection} from "./TopicSection";
import {changeHTMLToText,styles} from "./MyTopic";
import {localhost} from "../../App";

export default class MyStarTopic extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            navigation:props.navigation,
            topicList:[],
            userId:props.userId

        }
    }

    componentDidMount() {
        // AsyncStorage.getItem('userid', (error, result) => {
        //
        //     fetch('http://'+localhost+'/getTopicsUserStar?userId='+result, {
        //     }).then(response => response.json())
        //         .then(data => {
        //             this.setState({
        //                 topicList:data
        //             })
        //         }).catch(function (e) {
        //         alert("error:" + e);
        //     })
        //
        //     this.setState({
        //         userId:parseInt(result)
        //     })
        // })
        fetch('http://'+localhost+'/getTopicsUserStar?userId='+this.state.userId, {
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
                                    <TopicSection
                                        topicTitle={topic.item.title}
                                        authorAvatarUri={topic.item.userImage}
                                        authorName={topic.item.username}
                                        postingAbbr={changeHTMLToText(topic.item.topicDescription)}
                                        likeNum={topic.item.likes}
                                        starNum={topic.item.stars}
                                        replyNum={topic.item.replies}
                                        browseNum={topic.item.views}
                                        postingTime={topic.item.postTime}
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
