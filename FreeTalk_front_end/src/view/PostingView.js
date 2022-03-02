import React from 'react';
import {
    NativeAppEventEmitter,
    SafeAreaView,
    ScrollView,
    StatusBar,
    Text,
    ToastAndroid,
    View
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {Button, Icon} from 'react-native-elements';
import {PostingHead} from '../components/PostingHead';
import {AuthorInfo} from '../components/AuthorInfo';
import {PostingBottom} from '../components/PostingBottom';
import {Reply} from '../components/Reply';
import {RichTextShower} from '../components/RichTextShower';
import {getDateTime} from "../components/Reply";
import {localhost} from "../../App";
import {RichTextShowerComment} from "../components/RichTextShowerComment";


class PostingView extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            topicId:this.props.route.params.topicId,
            title:this.props.route.params.topicTitle,
            //commentInfo  传参
            commentId:this.props.route.params.commentId,
            postContain:this.props.route.params.commentContent,
            //commentInfo  请求获取
            likeNum:0,
            starNum:0,
            replyNum:0,
            like:false,
            star:false,
            postingTime:0,
            replyOpen:false,

            //myUserId
            myUserId:0,

            //UserInfo
            authorId:this.props.route.params.authorId,
            authorName:"",
            authorAvatarUri:"aaa",
            authorDescription:"",
            authorFollowed:false,
            //被回复的评论信息（被回复者的信息），通过请求获取
            replyToTopic:this.props.route.params.replyToTopic,
            replyId:0,
            replyContent:"",
            replierName:"",
            replierId:0,
            token:'',
            PostComment:null,
        }

    }


    getData=()=>{
        AsyncStorage.getItem('userid', (error, result) => {
            let myUserId=parseInt(result)
            this.setState({
                myUserId:myUserId
            })
            fetch('http://' + localhost + '/getAComment?commentId=' + this.state.commentId, {}).then(response => response.json())
                .then(data => {
                    let authorId=data.user.userId
                    console.log(data)
                    this.setState({
                        //Comment
                        postContain: data.commentContent,
                        likeNum: data.likes,
                        starNum: data.stars,
                        replyNum: data.replyNumber,
                        postingTime: getDateTime(data.sendTime),
                        //CommentAuthor
                        authorId: data.user.userId,
                        authorName: data.user.username,
                        authorAvatarUri: data.user.image,
                        authorDescription: data.user.description,
                        //replyId
                        replyId: data.replyId
                    })
                    this.checkLikeAndStarAndFollow(myUserId,this.state.commentId,authorId)
                    this.getReplierName(data.replyId)
                }).catch(function (e) {
                ToastAndroid.show("error1:" + e,1);
             });
            fetch('http://'+localhost+'/checkBan', {
                method: 'post',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
                },
                body: 'userId='+this.state.myUserId,
            })
                .catch(function (e) {
                    ToastAndroid.show("error:" + e,1);
                })
                .then(response => response.json())
                .then(data => {
                    if(data!==null){
                        this.setState({
                            PostComment:getDateTime(data.endTime),
                        });
                    }
                })
                .catch(function (ex) {
                    console.log('parsing failed', ex);
                });
        })
    }

    componentDidMount() {
        this.getData();
        this._navListener=NativeAppEventEmitter.addListener("TopicViewRefresh",()=>{
            this.getData()
        })
        AsyncStorage.getItem('token', (error, result) => {
            this.setState({
                token:result
            })
        });
    }

    componentWillUnmount() {
        this._navListener.remove()
    }

    checkLikeAndStarAndFollow=(myUserId,commentId,authorId)=>{
        fetch('http://'+localhost+'/Security/checkLikeAComment?commentId='+commentId+'&userId='+myUserId, {
            headers:{
                'token':this.state.token,
                'userId':this.state.myUserId.toString(),
            }
        }).then(response => response.json())
            .then(data => {
                if (data==="yes") {
                    this.setState({like: true});
                }
                else
                    this.setState({like:false})
            }).catch(function (e) {
            ToastAndroid.show("error2:" + e,1);
        })


        fetch('http://'+localhost+'/Security/checkStarAComment?commentId='+commentId+'&userId='+myUserId, {
            headers:{
                'token':this.state.token,
                'userId':this.state.myUserId.toString(),
            }
        }).then(response => response.json())
            .then(data => {
                console.log("star "+data);
                if (data==='yes') this.setState({star:true})
                else this.setState({star:false})
            }).catch(function (e) {
            ToastAndroid.show("error:" + e,1);
        })

        fetch('http://'+localhost+'/Security/checkUserFollow?userId='+myUserId+'&userId_toFollow='+authorId, {
            headers:{
                'token':this.state.token,
                'userId':this.state.myUserId.toString(),
            }
        }).then(response => response.json())
            .then(data => {
                if (data===true) this.setState({authorFollowed:true})
                else this.setState({authorFollowed:false})
            }).catch(function (e) {
            ToastAndroid.show("error3:" + e,1);
        })
    }


    followChange=()=>{
        if (this.state.authorFollowed)//已经收藏了->取消收藏
            fetch('http://'+localhost+'/Security/unfollowAUser?userId='+this.state.myUserId+'&userId_toFollow='+this.state.authorId, {
                headers:{
                    'token':this.state.token,
                    'userId':this.state.myUserId.toString(),
                }
            }).catch(function (e) {
                ToastAndroid.show("error4:" + e,1);
            })
        else fetch('http://'+localhost+'/Security/followAUser?userId='+this.state.myUserId+'&userId_toFollow='+this.state.authorId, {
            headers:{
                'token':this.state.token,
                'userId':this.state.myUserId.toString(),
            }
        }).catch(function (e) {
            ToastAndroid.show("error5:" + e,1);
        })

        this.setState({
            authorFollowed:!this.state.authorFollowed
        });
    }

    likeChange=()=>{

        if (this.state.like){//已经like 取消like
            fetch('http://'+localhost+'/Security/unlikeAComment?commentId='+this.state.commentId+'&userId='+this.state.myUserId, {
                headers:{
                    'token':this.state.token,
                    'userId':this.state.myUserId.toString(),
                }
            }).catch(function (e) {
                ToastAndroid.show("error6:" + e,1);
            })
        }
        else {
            fetch('http://'+localhost+'/Security/likeAComment?commentId='+this.state.commentId+'&userId='+this.state.myUserId, {
                headers:{
                    'token':this.state.token,
                    'userId':this.state.myUserId.toString(),
                }
            }).catch(function (e) {
                ToastAndroid.show("error7:" + e,1);
            })
        }

        this.setState({
            like:!this.state.like,
            likeNum:this.state.like?this.state.likeNum-1:this.state.likeNum+1
        })
    }

    starChange=()=>{
        if (this.state.star){//已经star 取消star
            fetch('http://'+localhost+'/Security/unstarAComment?commentId='+this.state.commentId+'&userId='+this.state.myUserId, {
                headers:{
                    'token':this.state.token,
                    'userId':this.state.myUserId.toString(),
                }
            }).catch(function (e) {
                ToastAndroid.show("error8:" + e,1);
            })
        }
        else{
            fetch('http://'+localhost+'/Security/starAComment?commentId='+this.state.commentId+'&userId='+this.state.myUserId, {
                headers:{
                    'token':this.state.token,
                    'userId':this.state.myUserId.toString(),
                }
            }).catch(function (e) {
                ToastAndroid.show("error9:" + e,1);
            })
        }
        this.setState({
            star:!this.state.star,
            starNum:this.state.star?this.state.starNum-1:this.state.starNum+1
        })
    }

    openReply=()=>{
        this.setState({
            replyOpen:true
        })
    }

    closeReply=()=>{
        this.setState({
            replyOpen:false
        })
    }

    topTextStyle={
        color:'#888',
        fontSize:14,
        fontWeight:'normal'
    }

    getReplierName=(replyId)=>{
            fetch('http://' + localhost + '/getAComment?commentId=' + replyId, {})
                .then(response => response.json())
                .then(data => {
                    this.setState({
                        replierName:data.user.username,
                        replierId:data.user.replierId,
                        replyContent:data.commentContent
                    })
                }).catch(function (e) {
                // ToastAndroid.show("error10:" + e,1);

            })
    }

    renderReplyButton=()=>{
        if (this.state.replyId!==0){

            return<Button icon={<Icon
                name={'arrow-undo'}
                type={'ionicon'}
                color={'#777'}
                size={18}
            />}
                          onPress={()=>{
                              this.props.navigation.push('Post',{
                                  //commentInfo
                                  commentId:this.state.replyId,
                                  commentContent:this.state.replyContent,
                                  // commentTime:comment.item.sendTime,
                                  // //topicInfo
                                  topicId:this.state.topicId,
                                  topicTitle:this.state.title,
                                  // //userInfo
                                  authorId:this.state.replierId,
                              });
                          }}
                          title={this.props.replyToTopic?"":"回复自 "+ this.state.replierName}
                          buttonStyle={{
                              backgroundColor:'white',
                              padding:0,
                          }}
                          titleStyle={this.topTextStyle}
                          containerStyle={{
                              height:25,
                              marginTop:4,
                              marginRight:14
                          }}
            />
        }
        else return <View/>
    }

    renderPostingContain=()=>{
        return(
            <ScrollView
                style={{
                    backgroundColor:"white",
                    borderTopWidth:1,
                    borderStyle:"solid",
                    borderColor:"#eee",
                    flex:1,
                }}
            >
                <View
                    style={{
                        flexDirection:'row',
                        justifyContent:'space-between',
                        width:'100%',
                        height:25
                    }}
                >
                    <View
                        style={{
                            marginLeft:14, marginTop:6
                        }}
                    >
                        <Text
                            style={this.topTextStyle}
                        >
                            {(this.state.likeNum).toString()+" 人认为很棒"}
                        </Text>
                    </View>
                    {this.renderReplyButton()}

                </View>

                <View
                    style={{
                        marginLeft:12,
                    }}>
                <RichTextShower
                    text={this.state.postContain}
                />
                </View>

                <Text
                    style={{
                        color:"#888",
                        textAlign:'left',
                        marginLeft:12,
                        marginBottom:8
                    }}
                >
                    {this.state.postingTime}
                </Text>
            </ScrollView>
            )
    }

    render=()=>{
        return(
            <SafeAreaView style={this.props.backgroundStyle}>
                <View
                    style={{flexDirection:'column',height:"100%"}}
                >
                    <StatusBar barStyle={this.props.isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={'#ebebeb'} />
                    <PostingHead title={this.state.title} showRight={false} onPressLeft={()=>{this.props.navigation.goBack();}}/>
                    <AuthorInfo
                        isMe={this.state.myUserId===this.state.authorId}
                        authorName={this.state.authorName}
                        authorAvatarUri={this.state.authorAvatarUri}
                        authorDescription={this.state.authorDescription}
                        authorFollowed={this.state.authorFollowed}
                        followChange={this.followChange}
                        userId={this.state.authorId}
                        navigation={this.props.navigation}
                    />
                    {this.renderPostingContain()}
                    <PostingBottom
                        likeChange={this.likeChange}
                        starChage={this.starChange}
                        like={this.state.like}
                        star={this.state.star}
                        likeNum={this.state.likeNum}
                        starNum={this.state.starNum}
                        replyNum={this.state.replyNum}
                        openReply={()=>{if(this.state.PostComment==null)this.openReply()
                        else ToastAndroid.show('您已被禁言到：'+this.state.PostComment, 1);}}
                    />
                </View>
            <Reply visible={this.state.replyOpen} closeReply={this.closeReply}
                   topicId={this.state.topicId} topicTitle={this.state.title}
                   commentId={this.state.commentId} authorName={this.state.authorName}
                   navigation={this.props.navigation}
            />
            </SafeAreaView>
        )
    }
}

export {PostingView};
export default PostingView;
