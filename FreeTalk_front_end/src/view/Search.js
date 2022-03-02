import React from 'react';
import {Icon} from 'react-native-elements';
import {
    FlatList,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text, TextInput,
    TouchableOpacity,
    View, ToastAndroid,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {PostingHead} from '../components/PostingHead';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {TopicSection} from '../components/TopicSection';
import {changeHTMLToText} from "../components/MyTopic";
import {localhost} from "../../App";

const styles = StyleSheet.create({
    sectionContainer: {
        marginLeft: 5,
        marginRight: 5,
        paddingTop:5,
        paddingLeft:10,
        paddingRight:10,
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
        fontSize: 25,
    },
    detailedInformation: {
        fontSize: 19,
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
        borderRadius: 200,
        backgroundColor: '#0088ff',
        height: 30,
        width: 60
    },
    container: {
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    buttonContainer: {
        marginLeft: 20,
        marginRight: 20,
        padding: 5,
        flex: 1,
        backgroundColor: '#ffffff',
        borderRadius: 200,
        alignItems: 'center',
        justifyContent: 'center',
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
});

let showEnd=true;

class Search extends React.Component {
    constructor() {
        super();
        this.state = {
            search:"",
            topicList:null,
            curPage:1,
            end:false,
            haveSearched:false
        };
    }

    searchTopics=()=>{
        if (this.state.search===""){
            ToastAndroid.show("搜索信息不能为空哦:)",1)
        }
        else {
            showEnd=true
            this.setState({
                end:false,
                haveSearched:true
            })
            this.getTopicList()
        }
    }

    getTopicList=()=>{
        fetch('http://'+localhost+'/getSearchedTopics/'+this.state.search+'/'+this.state.curPage+'/6', {
        }).then(response => response.json())
            .then(data => {
                this.setState({
                    topicList:data
                })
                if (data.length<6){
                    this.setState({
                    end:true
                })}
            }).catch(function (e) {
            alert("error:" + e);
        })
    }

    _endReached(){
        if (!this.state.end) {
            fetch('http://' + localhost + '/getSearchedTopics/' + this.state.search + '/' + (this.state.curPage + 1) + '/4', {}).then(response => response.json())
                .then(data => {
                    if (JSON.stringify(data) === "[]") {
                        this.setState({
                            end: true
                        })
                    } else
                        this.setState({
                            topicList: this.state.topicList.concat(data)
                        })
                    // alert(this.state.topicList[0].topicId)
                }).catch(function (e) {
                alert("error:" + e);
            })
            this.setState({
                curPage: this.state.curPage + 1
            })
        }
    }

    showEnd=()=>{
        if (showEnd && this.state.end===true){
            showEnd=false
            return <Text style={{textAlign:'center' ,padding:5,backgroundColor:'#f0f0f0',color:'#888'}}>....以上是所有搜索内容....</Text>
        }
        else return null;
    }

    showTopic=()=>{
        if (this.state.topicList!=null){
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
                                    style={{width:'100%'}}
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
                onEndReachedThreshold = {0.1} //当距离内容比例不足内容0.1比例时触发onEndReached
                onEndReached = {this._endReached.bind(this)} />
                {this.showEnd()}
            </View>
        }
        else if (this.state.haveSearched )return <View><Text>没有您想搜索的内容哦:(</Text></View>
    }


    render() {
        return (
            <SafeAreaView
                style={{
                    backgroundColor: '#ffffff',
                }}>
                <View style={{height:"100%", backgroundColor: '#F5F5F5',}}>
                    <StatusBar barStyle={'light-content'} />
                    <PostingHead title='返回' navigation={this.props.navigation} onPressLeft={()=>{this.props.navigation.goBack();}}/>
                    <View
                        style={{flexDirection: 'row', backgroundColor: '#ffffff', height: 45}}>
                        <View style={{flex: 1, position: 'relative', height: 40}}>
                            <View style={{position: 'absolute', zIndex: 2, left: 16, top: 15}}>
                                <Icon name={'search'} type={'feather'} size={16} color={'#999'} />
                            </View>
                            <TextInput
                                style={styles.searchInput}
                                placeholder="搜索您感兴趣的内容"
                                onChangeText={(text)=>{this.setState({search:text});
                                showEnd=true}}
                            />
                        </View>
                        <TouchableOpacity
                            style={styles.addButton}
                            onPress={this.searchTopics}>
                            <Text
                                style={{
                                    color: Colors.white,
                                    fontSize: 16,
                                    textAlign: 'center',
                                    textAlignVertical: 'center',
                                }}>
                                搜索
                            </Text>

                        </TouchableOpacity>
                    </View>
                    <View
                        style={{
                            flex: 1,
                            alignSelf: 'center',
                            flexDirection: 'column',
                            width: '100%',
                        }}>
                        {this.showTopic()}
                    </View>
                </View>

            </SafeAreaView>
        );
    }
}

export default Search
