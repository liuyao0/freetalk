import React from 'react';
import 'antd/dist/antd.css';
import '../index.css'
import {List, Pagination, message, Space} from 'antd';
import {changeHTMLToText} from "../utils/functions";
import {localhost} from "../App";
import {TopicSection} from "./TopicSection";
import {getDateTime} from "../utils/functions";
import {TopicFocusSection} from "./TopicFocusSection";

export default class FocusTopics extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            topicList:[],
            curPage:1,
            totalPage:1,
            renderTopic:true,
            //以下是显示topic详情的
            topicId:1,
        }
    }

    changeRenderState=()=>{
        this.setState({
            renderTopic:!this.state.renderTopic
        })
    }

    componentDidMount() {
        fetch('http://' + localhost + '/getTopicOfFocusedUsers?userId='+this.props.userId, {})
            .then(response => response.json())
            .then(data => {
                if (JSON.stringify(data) === '[]') {
                    this.setState({
                        topicList: null,
                        totalPage:0
                    });
                } else {
                    this.setState({
                        topicList: data,
                        totalPage:Math.ceil(parseInt(data.length)/10)
                    });
                }
            })
            .catch(function (e) {
                message.error("error"+e,1)
            });
    }

    pageChange=(pageNumber) =>{
        this.setState({
            curPage:pageNumber
        })
    }

    renderPage=()=>{
        return (
            <div>
                <Pagination showQuickJumper defaultCurrent={this.state.curPage} total={this.state.totalPage*10} onChange={this.pageChange} showSizeChanger={false}/>
            </div>
        )
    }

    showSearch=()=>{
        return (
            <Space direction="vertical">
            </Space>
        )
    }


    renderTopics=()=>{
            return(
                <div>
                    <List
                        className="comment-list"
                        header={this.showSearch()}
                        itemLayout="horizontal"
                        dataSource={this.state.topicList.slice(10*(this.state.curPage-1),10*this.state.curPage)}
                        renderItem={(topic,index) => (
                            <li>
                                <TopicFocusSection
                                    goBackKind={1}
                                    topicId={topic.topicId}
                                    showBadge={false}
                                    rank={index+1}
                                    title={topic.title}
                                    author={topic.username}
                                    avatar={topic.userImage}
                                    content={<div className='render3lines' >{changeHTMLToText(topic.topicDescription)}</div>}
                                    datetime={getDateTime(topic.postTime)}
                                    showHot={true}
                                    hot={topic.hot}
                                    stars={topic.stars}
                                    likes={topic.likes}
                                    views={topic.views}
                                    replies={topic.replies}

                                    focusUsername={topic.focusUsername}
                                    focusUserImage={topic.focusUserImage}
                                    type={topic.type}
                                />
                            </li>
                        )}
                    />
                    <div>
                        <Pagination showQuickJumper current={this.state.curPage} total={this.state.totalPage*10} onChange={this.pageChange} showSizeChanger={false}/>
                    </div>
                </div>)
    }

    render() {
        if (this.state.renderTopic)
            return this.renderTopics()
    }

}

