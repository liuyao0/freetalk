import React from 'react';
import 'antd/dist/antd.css';
import {Tooltip, List, Button, Popconfirm, message} from 'antd';
import {changeHTMLToText} from "../utils/functions";
import {getDateTime} from "../utils/functions";
import {localhost} from "../App";

import {CommentSection} from "./CommentSection";

export class CheckComment extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            comment:[],
            data : []
        };
    }
    DeleteComment=(id)=>{
        fetch('http://'+localhost+'/deleteAComment?commentId='+id+'&type=2', {
        }).catch(function (e) {
            message.error("error:" + e,1);
        }).then(response => response.json())
            .then(data => {
                this.setState({
                    comment: data,
                },()=>{
                    this.getData()
                });
            }).catch(function (ex) {
            console.log('parsing failed', ex)
        })
    }
    reply=(id)=>{
        if(id===0){
            return '话题'
        }
        else return id
    }
    setData=()=>{
        let temData=[];
        // eslint-disable-next-line array-callback-return
        this.state.comment.map(function (title, idx) {
            let S = {
                commentId:this.state.comment[idx].commentId,

                actions: [
                    <Popconfirm
                        title="请确定您是否要删除这条回复"
                        onConfirm={this.DeleteComment.bind(this,this.state.comment[idx].commentId)}
                        okText="确定"
                        cancelText="取消"
                    >
                        <Button>
                            删除该回复
                        </Button>
                    </Popconfirm>
                    ],
                author: this.state.comment[idx].user.username,
                avatar:this.state.comment[idx].user.image,
                content: changeHTMLToText(this.state.comment[idx].commentContent),
                datetime: (
                    <Tooltip title={this.state.comment[idx].sendTime}>
                        <span>{getDateTime(this.state.comment[idx].sendTime)}</span>
                    </Tooltip>
                ),

                likes:this.state.comment[idx].likes,
                stars:this.state.comment[idx].stars,
                replies:this.state.comment[idx].replyNumber,

                replyId:this.state.comment[idx].replyId
            }
            temData[idx] = S;
        }, this);
        this.setState({
            data:temData
        });
    }
    componentDidMount() {
        this.getData()
    }
    getData=()=>{
        fetch('http://'+localhost+'/allCommentsOfATopic?topicId='+this.props.topicId, {
        }).catch(function (e) {
            message.error("error:" + e,1);
        }).then(response => response.json())
            .then(data => {
                this.setState({
                    comment: data,
                },()=>{
                    this.setData()
                });
            }).catch(function (ex) {
            console.log('parsing failed', ex)
        })
    }
    render() {
        return (
            <List
                className="comment-list"
                header={<div style={{textAlign:'left'}}>{this.state.data.length} 条评论</div>}
                itemLayout="horizontal"
                dataSource={this.state.data}
                renderItem={item => (
                    <li>
                        <CommentSection
                            topicId={this.props.topicId}
                            commentId={item.commentId}

                            actions={item.actions}
                            author={item.author}
                            avatar={item.avatar}
                            content={<div style={{textAlign:'left'}}>{item.content}</div>}
                            datetime={item.datetime}

                            likes={item.likes}
                            stars={item.stars}
                            replies={item.replies}

                            replyId={item.replyId}
                        />
                    </li>
                )}
            />
        );
    }
}
