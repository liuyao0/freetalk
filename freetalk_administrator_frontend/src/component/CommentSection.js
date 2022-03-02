import React from 'react';
import 'antd/dist/antd.css';
import '../index.css'
import {Comment, message, Button, Collapse, List} from 'antd';
import {localhost} from "../App";
import {LikeOutlined,HeartOutlined,CommentOutlined} from "@ant-design/icons";
import {getDateTime} from "../utils/functions";

const {Panel}=Collapse;

export class CommentSection extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            myUserId: props.myUserId,

            childrenComments: [],
            replyId:0,
            replyComment:null,
        }
    }

    componentDidMount() {
        this.getChildrenComments()
        this.getReplyComment()
    }

    getReplyComment=()=>{
        fetch('http://' + localhost + '/getAComment?commentId=' + this.props.commentId ,
            {}).then(response => response.json())
            .then(data => {
                if (data.replyId===0)return
                fetch('http://' + localhost + '/getAComment?commentId=' + data.replyId, {}).catch(function (e) {
                    message.error("网络错误，请重试", 1)
                }).then(response => response.json())
                    .then(data => {
                        this.setState({
                            replyComment: data,
                        });
                    }).catch(function (ex) {
                    message.error("网络错误，请重试", 1)
                })
            }).catch(function (e) {
            message.error("网络错误，请重试", 1);
        })
    }

    getChildrenComments = () => {
        fetch('http://' + localhost + '/findCommentsByReplyId?replyId=' + this.props.commentId, {}).catch(function (e) {
            message.error("网络错误，请重试", 1)
        }).then(response => response.json())
            .then(data => {
                this.setState({
                    childrenComments: data,
                });
            }).catch(function (ex) {
            message.error("网络错误，请重试", 1)
        })
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

    showCommentFooter = () => {
        return (
            <div style={{textAlign: 'left'}}>
                <div style={{marginBottom:"4px"}}>
                    <Button size={"small"} icon={<LikeOutlined/>}
                            style={{color: this.state.like ? '#1E90FF' : 'black', width: '60px'}}
                            >
                        {<span style={{fontsize: '25px'}}>
                            {this.props.likes}
                            </span>}
                    </Button>

                    <Button size={"small"} icon={<HeartOutlined/>}
                            style={{color: this.state.star ? '#1E90FF' : 'black', width: '60px',marginLeft:"8px",marginRight:"8px"}}
                            >
                        {<span style={{fontsize: '25px'}}>
                            {this.props.stars}
                            </span>}
                    </Button>
                    <Button size={"small"} icon={<CommentOutlined/>} style={{color: 'black', width: '60px'}}
                        >
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
                    actions={this.props.actions}
                    author={this.props.author}
                    avatar={this.props.avatar}
                    content={<div style={{textAlign:'left'}}>{this.props.content}</div>}
                    datetime={this.props.datetime}
                />
                {this.showCommentFooter()}
                <div style={{width:"100%",height:"0.5px",background:"rgba(0,0,0,0.1)",marginTop:"10px",marginBottom:"2px"}}/>
            </div>
        )
    }

}
