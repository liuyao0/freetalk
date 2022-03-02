import React from 'react';
import {
    FlatList,
    Modal,
    NativeAppEventEmitter,
    SafeAreaView,
    Text,
    ToastAndroid,
    TouchableOpacity,
    View
} from 'react-native';
import {Button, Header, Icon} from 'react-native-elements';
import {PostingSection} from './PostingSection';
import {changeHTMLToText} from "./MyTopic";
import {localhost} from "../../App";

export function getDateTime(nS) {
    let date = new Date(nS);
    return date.getFullYear()
        + "-"
        + ((date.getMonth() + 1) > 10 ? (date.getMonth() + 1) : "0"
            + (date.getMonth() + 1))
        + "-"
        + (date.getDate() < 10 ? "0" + date.getDate() : date.getDate())
        + " "
        + (date.getHours() < 10 ? "0" + date.getHours() : date
            .getHours())
        + ":"
        + (date.getMinutes() < 10 ? "0" + date.getMinutes() : date
            .getMinutes());
}

class Reply extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            commentId:this.props.commentId,
            replyData:[]
        }
    }

    componentDidMount() {
        this.getAllComments()
        this._navListener=NativeAppEventEmitter.addListener("TopicViewRefresh",()=>{
            this.getAllComments()
        })
    }

    componentWillUnmount() {
        this._navListener.remove()
    }

    showNullInfo=()=>{
        if (this.state.replyData.length===0)
        return<View>
            <Text style={{textAlign:'center' ,padding:5,backgroundColor:'#f0f0f0',color:'#888',fontSize:20}}>暂时没有回复哦！</Text>
        </View>
        else return <View/>
    }

    getAllComments=()=>{
        fetch('http://'+localhost+'/findCommentsByReplyId?replyId='+this.state.commentId, {
        }).then(response => response.json())
            .then(data => {
                this.setState({replyData:data})
            }).catch(function (e) {
            ToastAndroid.show("error:" + e,1);
        })
    }


    renderTitle=()=>{
        return(
            <Text
                style={{
                    fontSize:18,
                    fontWeight:"900"
                }}
            >
                回复
            </Text>
        )
    }

    renderExit=()=>{
        return(
            <Button
                icon={<Icon name={"down"} type={"antdesign"} size={22} color={"#333"}/>}
                buttonStyle={{
                    paddingTop:3,
                    paddingBottom:3,
                    paddingLeft:3,
                    paddingRight:3,
                    backgroundColor:0,
                    margin:0,
                    height:30,
                    width:48
                }}
                containerStyle={{
                    padding: 0,
                    margin:0
                }}
                onPress={this.props.closeReply}
            />
        )
    }

    keyGenerate=(item,idx)=>{
        return "idx"+idx
    }

    render=()=>{
        return(
            <SafeAreaView>
                <Modal
                    animationType={'slide'}
                    visible={this.props.visible}
                    onRequestClose={this.props.closeReply}
                >
                    <View
                        style={{
                            flexDirection:'column',
                            height:'100%'
                        }}
                    >
                        <Header
                            containerStyle={{
                                height:40,
                                padding:0,
                                borderWidth:0.5,
                                borderBottomWidth:0.5,
                                borderColor:"#e4e4e4"
                            }}
                            centerComponent={this.renderTitle}
                            rightComponent={this.renderExit}
                            backgroundColor={'white'}
                        />
                        {this.showNullInfo()}
                            <FlatList style={{backgroundColor:'#f6f6f6'}} data={this.state.replyData}
                                      renderItem={
                                          (comment)=>{
                                              return<View style={{
                                                  marginBottom:8
                                              }}>
                                                  <TouchableOpacity
                                                      onPress={() =>{
                                                          this.props.closeReply()
                                                          this.props.navigation.push('Post',{
                                                              //commentInfo
                                                              commentId:comment.item.commentId,
                                                              commentContent:comment.item.commentContent,
                                                              commentTime:comment.item.sendTime,
                                                              //topicInfo
                                                              topicId:this.props.topicId,
                                                              topicTitle:this.props.topicTitle,
                                                              //userInfo
                                                              authorId:comment.item.user.userId,
                                                          });
                                                      }}>
                                                      <PostingSection
                                                          authorAvatarUri={comment.item.user.image}
                                                          authorName={comment.item.user.username}
                                                          postingAbbr={changeHTMLToText(comment.item.commentContent)}
                                                          likeNum={comment.item.likes}
                                                          starNum={comment.item.stars}
                                                          replyNum={comment.item.replyNumber}
                                                          postingTime={getDateTime(comment.item.sendTime)}
                                                      />
                                                  </TouchableOpacity>
                                              </View>
                                          }
                                      }
                                      keyExtractor={this.keyGenerate}
                            />
                        <View
                            style={{
                                width:'100%',
                                height:43,
                            }}
                        >
                            <Button
                                title={"回复 "+this.props.authorName}
                                 buttonStyle={{
                                    borderRadius:0
                                }}

                                onPress={() =>{
                                    this.props.closeReply()
                                    this.props.navigation.navigate('Answer',{
                                    topicId:this.props.topicId,
                                    topicTitle:this.props.topicTitle,
                                    replyId:this.state.commentId,
                                        replierName:this.props.authorName
                                })}}
                            />
                        </View>
                    </View>
                </Modal>
            </SafeAreaView>

        )
    }
}

export {Reply}
