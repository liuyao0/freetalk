import React from "react";
import {FlatList, StyleSheet, ToastAndroid, TouchableOpacity, View} from "react-native";
import AsyncStorage from '@react-native-community/async-storage';
import {TopicSection} from "./TopicSection";
import {localhost} from "../../App";

export function changeHTMLToText(content){
    return content.replace(/<(p|div)[^>]*>(<br\/?>|&nbsp;)<\/\1>/gi, '\n').
    replace(/<br\/?>/gi, '\n').
    replace(/<[^>/]+>/g, '').
    replace(/(\n)?<\/([^>]+)>/g, '').
    replace(/\u00a0/g, ' ').
    replace(/&nbsp;/g, ' ').
    replace(/<\/?(img)[^>]*>/gi, '[图片]').
    replace(/&amp;/g, "&").
    replace(/&lt;/g, "<").
    replace(/&gt;/g, ">").
    replace(/&#39;/g, "\'").
    replace(/&quot;/g, "\"").
    replace(/<\/?.+?>/g, "");
}

export const styles = StyleSheet.create({
    sectionContainer: {
        marginTop: 12,
        marginLeft: 5,
        marginRight: 5,
        marginBottom: 12,
        paddingHorizontal: 24,
        backgroundColor: '#ffffff',
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: '600',
    },
    sectionDescription: {
        marginTop: 8,
        fontSize: 18,
        fontWeight: '400',
    },
    highlight: {
        fontWeight: '700',
    },
    searchInput: {
        marginTop: 5,
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 5,
        fontSize: 16,
        borderWidth: 0,
        borderRadius: 15,
        backgroundColor: '#f2f2f2',
        height: 36,
        paddingLeft: 25,
        paddingTop: 0,
        paddingBottom: 0,
        paddingRight: 10,
    },
    addButton: {
        alignSelf: 'center',
        marginRight: 10,
        borderRadius: 400,
        backgroundColor: '#0088ff',
        height: 30,
        width: 30,
    },
    sectionStyleWithBorder: {
        backgroundColor: 'white',
        paddingTop: 3,
        paddingLeft: 5,
        paddingRight: 5,
        paddingBottom: 3,
        borderBottomWidth: 1,
        borderBottomColor: '#aaa',
    },
    sectionStyleWithMargin: {
        backgroundColor: 'white',
        paddingTop: 3,
        paddingLeft: 5,
        paddingRight: 5,
        paddingBottom: 3,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        marginTop: 10,
    },
});

export default class MyTopic extends React.Component{
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
        //     fetch('http://'+localhost+'/getTopicsUserCreat?userId='+result, {
        //     }).then(response => response.json())
        //         .then(data => {
        //             this.setState({
        //                 topicList:data
        //             })
        //         }).catch(function (e) {
        //         alert("error:" + e);
        //     })
        //     this.setState({
        //         userId:parseInt(result)
        //     })
        // })
        fetch('http://'+localhost+'/getTopicsUserCreat?userId='+this.state.userId, {
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
