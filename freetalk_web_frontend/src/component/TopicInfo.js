import React from 'react';
import 'antd/dist/antd.css';
import {Card, Avatar, Button, message} from 'antd';
import  {HeartOutlined,LikeOutlined, FormOutlined} from "@ant-design/icons";
import Meta from "antd/es/card/Meta";

import {localhost, localhost_frontend} from "../App";
import {ReplyTopic} from "./ReplyTopic";
import {gotoSelfCenter} from "../utils/redirection";

export class TopicInfo extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            myUserId:props.myUserId,
            originalAgree:false,
            originalStar:false,
            haveAgreed:false,
            haveStarred:false,
            authorFollowed:false,
            topicId:1,
            data:{"topicId":1,
                "postTime":"",
                "title":"",
                "topicDescription":"",
                "userId":1,
                "username":"",
                "userImage":null,
                "userDescription":"",
                "likes":0,
                "stars":0,
                "views":0,
                "replies":0,
                "hot":0,
                "weight":0},
            visible:false
        };
    }
    componentDidMount() {
        fetch('http://'+localhost+'/getATopicView/'+this.props.topicId, {
        }).catch(function (e) {
            alert("error:" + e);
        }).then(response => response.json())
            .then(data => {
                // alert("data:" + data);
                this.setState({
                    data: data,
                },()=>{
                    this.checkLikeAndStarAndFollow()
                });
            }).catch(function (ex) {
            console.log('parsing failed', ex)
        })

        this.addOneBrowse()
    }

    setVisibleFalse=()=>{
        this.setState({
            visible:false
        })
    }

    checkLikeAndStarAndFollow=()=>{
        fetch('http://'+localhost+'/checkUserLike/'+this.props.topicId+'/'+this.state.myUserId, {
        }).then(response => response.json())
            .then(data => {
                this.setState({
                    originalAgree:data===true,
                    haveAgreed:data===true,
                })
            }).catch(function (e) {
            message.error("error:" + e,1);
        })

        fetch('http://'+localhost+'/checkUserStar/'+this.props.topicId+'/'+this.state.myUserId, {
        }).then(response => response.json())
            .then(data => {
                this.setState({
                    originalStar:data===true,
                    haveStarred:data===true,
                })
            }).catch(function (e) {
            message.error("error:" + e,1);
        })

        let infToService={
            method:'post',
            headers:{
                "Content-Type":"application/json",
                'token':localStorage.getItem('key'),
                'userId':localStorage.getItem('userId')
            },
            body:JSON.stringify({})
        }
        fetch('http://'+localhost+'/Security/checkUserFollow?userId='+this.state.myUserId+'&userId_toFollow='+this.state.data.userId,infToService).then(response => response.json())
            .then(data => {
                if (data===true) this.setState({authorFollowed:true})
                else this.setState({authorFollowed:false})
            }).catch(function (e) {
            message.error("error:" + e,1);
        })
    }

    addOneBrowse=()=>{
        fetch('http://'+localhost+'/browseATopic/'+this.props.topicId, {
        }).catch(function (e) {
            message.error("error:" + e,1);
        })
    }

    changeStarTopic=()=>{
        let infToService={
            method:'post',
            headers:{
                "Content-Type":"application/json",
                'token':localStorage.getItem('key'),
                'userId':localStorage.getItem('userId')
            },
            body:JSON.stringify({})
        }
        if (this.state.haveStarred){
            message.success("已取消收藏",1)
            fetch('http://'+localhost+'/Security/undoStarATopic/'+this.props.topicId+'/'+this.state.myUserId, infToService).then(()=>{
                this.setState({
                    haveStarred:false
                })
            }).catch(function () {
                message.error("网络错误，请重试",1);
            })

        }
        else {
            message.success("已收藏",1)
            fetch('http://'+localhost+'/Security/starATopic/'+this.props.topicId+'/'+this.state.myUserId, infToService).then(
                ()=>{
                    this.setState({
                        haveStarred:true
                    })
                }
            ).catch(function () {
                message.error("网络错误，请重试",1);
            })

        }
    }
    changeLikeTopic=()=>{
        let infToService={
            method:'post',
            headers:{
                "Content-Type":"application/json",
                'token':localStorage.getItem('key'),
                'userId':localStorage.getItem('userId')
            },
            body:JSON.stringify({})
        }
        if (this.state.haveAgreed){
            message.success("已取消点赞",1)
            fetch('http://'+localhost+'/Security/undoLikeATopic/'+this.props.topicId+'/'+this.state.myUserId, infToService).then(()=>{
                this.setState({
                    haveAgreed:false
                })
            }).catch(function () {
                message.error("网络错误，请重试",1);
            })

        }
        else {
            message.success("已点赞",1)
            fetch('http://'+localhost+'/Security/likeATopic/'+this.props.topicId+'/'+this.state.myUserId, infToService).then(()=>{
                this.setState({
                    haveAgreed:true
                })
            }).catch(function () {
                message.error("网络错误，请重试",1);
            })
        }
    }

    changeFollowState=()=>{
        let infToService={
            method:'post',
            headers:{
                "Content-Type":"application/json",
                'token':localStorage.getItem('key'),
                'userId':localStorage.getItem('userId')
            },
            body:JSON.stringify({})
        }
        if (this.state.authorFollowed){
            message.success("已取消关注作者",1)
            fetch('http://'+localhost+'/Security/unfollowAUser?userId='+this.state.myUserId+'&userId_toFollow='+this.state.data.userId, infToService).then(()=>{
                this.setState({
                    authorFollowed:false
                })
            }).catch(function () {
                message.error("网络错误，请重试",1);
            })
        }
        else {
            message.success("已关注作者",1)
            fetch('http://'+localhost+'/Security/followAUser?userId='+this.state.myUserId+'&userId_toFollow='+this.state.data.userId, infToService).then(()=>{
                this.setState({
                    authorFollowed:true
                })
            }).catch(function () {
                message.error("网络错误，请重试",1);
            })
        }
    }

    renderFollowButton=()=>{
        if (this.state.myUserId!==this.state.data.userId){
            return (
                <Button style={{marginRight:'-80%',color:this.state.authorFollowed?'#1E90FF':'black',width:'110px'}}
                        onClick={this.changeFollowState}>{this.state.authorFollowed?'已关注':'关注作者'}</Button>
            )
        }
        else return <div/>
    }

    render() {
        return(
            <>
                <Card title={<div style={{textAlign:'left', fontWeight:'bold', fontSize:22}}>{this.state.data.title}</div>}
                      extra={<div>
                          <Button icon={<LikeOutlined />} style={{color:this.state.haveAgreed?'#1E90FF':'black',width:'110px'}}
                                  onClick={this.changeLikeTopic}>{this.state.haveAgreed?'已点赞':'点赞话题'}</Button>
                          <Button style={{marginLeft:'10px',color:this.state.haveStarred?'#1E90FF':'black',width:'110px'}}
                                  icon={<HeartOutlined />}
                                  onClick={this.changeStarTopic}>{this.state.haveStarred?'已关注':'关注话题'}</Button>
                      </div>}>
                    <Meta
                        avatar={
                            <Avatar
                                src={this.state.data.userImage}
                                size={60}
                                onClick={()=>{
                                    if(this.state.data.userId===localStorage.getItem("userId"))
                                        gotoSelfCenter()
                                    else
                                        window.location.href=('http://'+localhost_frontend+'/?#/otherUserSelfCenter/userId='+this.state.data.userId);}}
                            />
                        }
                        title={<div>
                            <div style={{textAlign:'left',float:'left'}}>{this.state.data.username}
                            </div>
                            {this.renderFollowButton()}
                        </div>}
                        description={<div style={{textAlign:'left'}}>{this.state.data.userDescription}</div>}
                    />
                    <p style={{padding:10,textAlign:'left'}}>
                        {<div dangerouslySetInnerHTML={{__html: this.state.data.topicDescription}}/>}
                    </p>
                    <Button icon={<FormOutlined /> } onClick={
                        ()=>{
                            this.setState({
                                visible:true
                            })
                        }
                    }>写回答</Button>
                    <div style={{textAlign:'left'}}>
                        {this.state.data.likes-this.state.originalAgree+this.state.haveAgreed +
                        ' 点赞    ' }&nbsp;&nbsp;{
                        this.state.data.stars-this.state.originalStar+this.state.haveStarred +
                        ' 收藏    ' }&nbsp;&nbsp;{
                        this.state.data.views+1 +
                        ' 浏览'}
                    </div>
                </Card>
                <ReplyTopic
                    topicId={this.props.topicId}
                    myUserId={this.state.myUserId}
                    image={this.state.data.userImage}
                    username={this.state.data.username}
                    visible={this.state.visible}
                    replyId={0}
                    setVisibleFalse={this.setVisibleFalse}
                />
            </>
        )
    }
}
