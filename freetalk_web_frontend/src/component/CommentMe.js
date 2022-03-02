import React from 'react';
import 'antd/dist/antd.css';
import {Comment, List, Tooltip, Avatar,message} from 'antd';
import {getDateTime} from "../utils/functions";
import {localhost, localhost_frontend} from "../App";
import {gotoSelfCenter} from "../utils/redirection";

export class CommentMe extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            comment:[],
            data : []
        };
    }
    reply=(id)=>{
        if(id===0){
            return ' 话题'
        }
        else return ''
    }

    setData=()=>{
        let temData=[];
        // eslint-disable-next-line array-callback-return
        this.state.comment.map(function (title, idx) {
            temData[idx] = {
                author: this.state.comment[idx].comment.user.username,
                avatar: this.state.comment[idx].comment.user.image,
                content: <div style={{textAlign: 'left'}}>评论了
                    {this.state.comment[idx].comment.replyId === 0 ?
                        <span style={{fontSize: '12px'}}>
                            {' '}话题&nbsp;&nbsp;
                            <a
                                style={{fontSize: '12px'}}
                                href={'http://' + localhost_frontend + '/?#/topicDetail?topicId=' + this.state.comment[idx].comment.topic.topicId}

                            >
                            {this.state.comment[idx].comment.topic.title}
                        </a>
                            </span>
                        : <span style={{fontSize: '12px'}}>
                            {' '}您在话题&nbsp;&nbsp;
                            <span>
                <a
                    href={'http://' + localhost_frontend + '/?#/topicDetail?topicId=' + this.state.comment[idx].comment.topic.topicId}
                >{this.state.comment[idx].comment.topic.title}</a>
                    </span>
                            &nbsp;&nbsp;中发表的评论
                        </span>
                    }
                </div>,
                datetime: (
                    <Tooltip title={this.state.comment[idx].sendTime}>
                        <span>{getDateTime(this.state.comment[idx].comment.sendTime)}</span>
                    </Tooltip>
                ),
                children: <div style={{textAlign: 'left'}}
                               dangerouslySetInnerHTML={{__html: this.state.comment[idx].comment.commentContent}}/>,
                userId: this.state.comment[idx].comment.user.userId
            };
        }, this);
        this.setState({
            data:temData
        });
    }
    componentDidMount() {
        this.getData()
    }
    getData=()=>{
        fetch('http://'+localhost+'/getUserAnswerMyCommentAndTopic?userId='+this.props.userId, {
        }).catch(function (e) {
            message.error("error:" + e,1);
        }).then(response => response.json())
            .then(data => {
                // alert("data:" + data);
                this.setState({
                    comment: data,
                },()=> {
                        this.setData()
                    }
                );
            }).catch(function (ex) {
            console.log('parsing failed', ex)
        })
        // setTimeout(this.setData, 500);
    }
    render() {
        return (
            <List
                className="comment-list"
                header={`${this.state.data.length} 条回复`}
                itemLayout="horizontal"
                dataSource={this.state.data}
                renderItem={item => (
                    <li>
                        <Comment
                            actions={item.actions}
                            author={item.author}
                            avatar={<Avatar
                                src={item.avatar}
                                onClick={()=>{
                                    if(item.userId===localStorage.getItem("userId"))
                                        gotoSelfCenter()
                                    else
                                        window.location.href=('http://'+localhost_frontend+'/?#/otherUserSelfCenter/userId='+item.userId);
                                }}
                            />}
                            content={item.content}
                            datetime={item.datetime}
                            children={item.children}
                        />
                    </li>
                )}
            />
        );
    }
}
