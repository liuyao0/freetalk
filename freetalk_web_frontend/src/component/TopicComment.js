import React from 'react';
import 'antd/dist/antd.css';
import {List, message} from 'antd';
import {CommentSection} from "./CommentSection";
import {getDateTime} from "../utils/functions";
import {localhost} from "../App";

export class TopicComment extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            comment:[],
            data : [],
            topicId:props.topicId,
            myUserId:props.myUserId,
        };

    }

    componentDidMount() {
        this.getComments()
    }

    getComments=()=>{
            fetch('http://'+localhost+'/allCommentsOfATopic?topicId='+this.state.topicId, {
            }).catch(function () {
                message.error("网络错误，请重试",1)
            }).then(response => response.json())
                .then(data => {
                    // alert("data:" + data);
                    this.setState({
                        comment: data,
                    });
                }).catch(function () {
                message.error("网络错误，请重试",1)
            })
    }

    render() {
        return (
            <List
                className="comment-list"
                header={<div style={{textAlign:'left'}}>{this.state.comment.length} 条回复</div>}
                itemLayout="horizontal"
                dataSource={this.state.comment}
                renderItem={item => (
                    <li>
                        <CommentSection
                            commentId={item.commentId}
                            myUserId={this.state.myUserId}
                            topicId={this.state.topicId}

                            author={item.user.username}
                            avatar={item.user.image}
                            authorId={item.user.userId}
                            content={<div style={{textAlign: 'left'}} dangerouslySetInnerHTML={{__html: item.commentContent}}/>}
                            datetime={<div>{getDateTime(item.sendTime)}</div>}

                            likes={item.likes}
                            stars={item.stars}
                            replies={item.replyNumber}

                            replyId={item.replyId}
                        />
                        <div>
                        </div>
                    </li>
                )}
            />
        );
    }
}
