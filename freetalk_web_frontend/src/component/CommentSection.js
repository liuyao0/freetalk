import React from 'react';
import 'antd/dist/antd.css';
import '../index.css'
import {Comment, message, Button, Collapse, List, Avatar} from 'antd';
import {localhost, localhost_frontend} from "../App";
import {LikeOutlined,HeartOutlined,CommentOutlined} from "@ant-design/icons";
import {getDateTime} from "../utils/functions";
import {ReplyTopic} from "./ReplyTopic";
import {gotoSelfCenter} from "../utils/redirection";

const {Panel}=Collapse;

class CommentSection extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            myUserId: props.myUserId,

            originalLike: false,
            originalStar: false,

            like: false,
            star: false,

            childrenComments: [],

            replyId:0,
            replyComment:null,

            visible:false
        }
    }

    componentDidMount() {
        this.checkLikeAndStar()
        this.getChildrenComments()
        this.getReplyComment()
    }

    getReplyComment=()=>{
        fetch('http://' + localhost + '/getAComment?commentId=' + this.props.commentId ,
            {}).then(response => response.json())
            .then(data => {
                if (data.replyId===0)return
                fetch('http://' + localhost + '/getAComment?commentId=' + data.replyId, {}).catch(function () {
                    message.error("网络错误，请重试", 1)
                }).then(response => response.json())
                    .then(data => {
                        this.setState({
                            replyComment: data,
                        });
                    }).catch(function () {
                    message.error("网络错误，请重试", 1)
                })
            }).catch(function () {
            message.error("网络错误，请重试", 1);
        })
    }

    getChildrenComments = () => {
        fetch('http://' + localhost + '/findCommentsByReplyId?replyId=' + this.props.commentId, {}).catch(function () {
            message.error("网络错误，请重试", 1)
        }).then(response => response.json())
            .then(data => {
                this.setState({
                    childrenComments: data,
                });
            }).catch(function () {
            message.error("网络错误，请重试", 1)
        })
    }

    checkLikeAndStar = () => {
        let infToService={
            method:'post',
            headers:{
                "Content-Type":"application/json",
                'token':localStorage.getItem('key'),
                'userId':localStorage.getItem('userId')
            },
            body:JSON.stringify({})
        }
        fetch('http://' + localhost + '/Security/checkLikeAComment?commentId=' + this.props.commentId + '&userId=' + this.state.myUserId,infToService).then(response => response.json())
            .then(data => {
                if (data === 'yes') this.setState({like: true, originalLike: true})
                else this.setState({like: false, originalLike: false})
            }).catch(function () {
            message.error("网络错误，请重试", 1);
        })

        fetch('http://' + localhost + '/Security/checkStarAComment?commentId=' + this.props.commentId + '&userId=' + this.state.myUserId, infToService).then(response => response.json())
            .then(data => {
                if (data === 'yes') this.setState({star: true, originalStar: true})
                else this.setState({star: false, originalStar: false})
            }).catch(function () {
            message.error("网络错误，请重试", 1);
        })
    }

    changeLikeState = () => {
        if (this.state.like) {
            let infToService={
                method:'post',
                headers:{
                    "Content-Type":"application/json",
                    'token':localStorage.getItem('key'),
                    'userId':localStorage.getItem('userId')
                },
                body:JSON.stringify({})
            }
            fetch('http://' + localhost + '/Security/unlikeAComment?commentId=' + this.props.commentId + '&userId=' + this.state.myUserId, infToService).then(() => {
                this.setState({
                    like: false
                })
            }).catch(function () {
                message.error("网络错误，请重试", 1);
            })

        } else {
            let infToService={
                method:'post',
                headers:{
                    "Content-Type":"application/json",
                    'token':localStorage.getItem('key'),
                    'userId':localStorage.getItem('userId')
                },
                body:JSON.stringify({})
            }
            fetch('http://' + localhost + '/Security/likeAComment?commentId=' + this.props.commentId + '&userId=' + this.state.myUserId, infToService).then(
                () => {
                    this.setState({
                        like: true
                    })
                }
            ).catch(function () {
                message.error("网络错误，请重试", 1);
            })

        }
    }

    changeStarState = () => {
        let infToService={
            method:'post',
            headers:{
                "Content-Type":"application/json",
                'token':localStorage.getItem('key'),
                'userId':localStorage.getItem('userId')
            },
            body:JSON.stringify({})
        }
        if (this.state.star) {
            fetch('http://' + localhost + '/Security/unstarAComment?commentId=' + this.props.commentId + '&userId=' + this.state.myUserId, infToService).then(() => {
                this.setState({
                    star: false
                })
            }).catch(function () {
                message.error("网络错误，请重试", 1);
            })

        } else {
            fetch('http://' + localhost + '/Security/starAComment?commentId=' + this.props.commentId + '&userId=' + this.state.myUserId, infToService).then(
                () => {
                    this.setState({
                        star: true
                    })
                }
            ).catch(function () {
                message.error("网络错误，请重试", 1);
            })

        }
    }

    renderFatherComment =()=>{
        if (this.state.replyComment!==null){
            return (
                <Collapse style={{width: '800px'}}>
                    <Panel header={"回复自 "+this.state.replyComment.user.username} key="1">
                        <Comment
                            author={this.state.replyComment.user.username}
                            avatar={this.state.replyComment.user.image}
                            content={<div dangerouslySetInnerHTML={{__html: this.state.replyComment.commentContent}}/>}
                            datetime={getDateTime(this.state.replyComment.sendTime)}
                        />
                    </Panel>
                </Collapse>
            )
        }
    }

    renderChildrenComments = () => {
        if (this.state.childrenComments.length !== 0)
            return (
                <Collapse style={{width: '800px'}}>
                    <Panel header={"展开所有" + this.props.replies + "条回复"} key="1">
                        <List
                            className="comment-list"
                            itemLayout="horizontal"
                            dataSource={this.state.childrenComments}
                            renderItem={item => (
                                <li>
                                    <Comment
                                        author={item.user.username}
                                        avatar={item.user.image}
                                        content={<div dangerouslySetInnerHTML={{__html: item.commentContent}}/>}
                                        datetime={getDateTime(item.sendTime)}
                                    />
                                </li>
                            )}
                        />
                    </Panel>
                </Collapse>
            )
    }

    postComment = () => {
        this.setState({
            visible:true
        })
    }


    setVisibleFalse=()=>{
        this.setState({
            visible:false
        })
    }

    showCommentFooter = () => {
        return (
            <div style={{textAlign: 'left'}}>
                <div style={{marginBottom:"4px"}}>
                    <Button size={"small"} icon={<LikeOutlined/>}
                            style={{color: this.state.like ? '#1E90FF' : 'black', width: '60px'}}
                            onClick={this.changeLikeState}>
                        {<span style={{fontsize: '25px'}}>
                            {this.props.likes - this.state.originalLike + this.state.like}
                            </span>}
                    </Button>

                    <Button size={"small"} icon={<HeartOutlined/>}
                            style={{color: this.state.star ? '#1E90FF' : 'black', width: '60px',marginLeft:"8px",marginRight:"8px"}}
                            onClick={this.changeStarState}>
                        {<span style={{fontsize: '25px'}}>
                            {this.props.stars - this.state.originalStar + this.state.star}
                            </span>}
                    </Button>
                    <Button size={"small"} icon={<CommentOutlined/>} style={{color: 'black', width: '60px'}}
                            onClick={this.postComment}>
                        {<span style={{fontsize: '25px'}}>
                            {this.props.replies}
                            </span>}
                    </Button>
                </div>
                {this.renderFatherComment()}
                {this.renderChildrenComments()}
            </div>
        )
    }
    render() {
        return (
            <div>
                <Comment
                    author={this.props.author}
                    avatar={<Avatar
                        src={this.props.avatar}
                        onClick={()=>{
                            if(this.props.authorId===localStorage.getItem("userId"))
                                gotoSelfCenter()
                            else
                                window.location.href=('http://'+localhost_frontend+'/?#/otherUserSelfCenter/userId='+this.props.authorId);
                        }}
                    />}
                    content={<div style={{textAlign:'left'}}>{this.props.content}</div>}
                    datetime={this.props.datetime}
                />
                {this.showCommentFooter()}
                <div style={{width:"100%",height:"0.5px",background:"rgba(0,0,0,0.1)",marginTop:"10px",marginBottom:"2px"}}/>
                <ReplyTopic
                    topicId={this.props.topicId}
                    myUserId={this.state.myUserId}
                    image={this.props.avatar}
                    username={this.props.author}
                    visible={this.state.visible}
                    replyId={this.props.commentId}
                    setVisibleFalse={this.setVisibleFalse}
                />
            </div>
        )
    }

}

export {CommentSection}
