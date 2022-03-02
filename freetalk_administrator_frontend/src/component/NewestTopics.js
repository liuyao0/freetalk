import React from 'react';
import 'antd/dist/antd.css';
import '../index.css'
import {List, Pagination, message, Space, Input} from 'antd';
import {changeHTMLToText} from "../utils/functions";
import {localhost} from "../App";
import {TopicSection} from "./TopicSection";
import {getDateTime} from "../utils/functions";


const { Search } = Input;

export default class NewestTopics extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            topicList:null,
            curPage:1,
            totalPage:1,
            ifSearch:false,

            renderTopic:true,
            //以下是显示topic详情的
            topicId:1,
        }
        this.getTopicSize()
        this.getTopicList()
    }

    changeRenderState=()=>{
        this.setState({
            renderTopic:!this.state.renderTopic
        })
    }

    getTopicSize = () =>{
        fetch('http://' + localhost + '/getTopicSize', {})
            .then(response => response.json())
            .then(data => {
                this.setState({
                    totalPage:Math.ceil(parseInt(data)/10)
                })
            })
            .catch(function (e) {
                message.error("error"+e,1)
            });
    }

    getTopicList = () => {
        fetch('http://' + localhost + '/getTopics/'+this.state.curPage+'/10', {})
            .then(response => response.json())
            .then(data => {
                if (JSON.stringify(data) === '[]') {
                    this.setState({
                        topicList: null,
                    });
                } else {
                    this.setState({
                        topicList: data,
                    });
                }
            })
            .catch(function (e) {
                message.error("error"+e,1)
            });
    };

    getSearchedTopicSize(search){
        fetch('http://' + localhost + '/getSearchedTopicSize/'+search, {})
            .then(response => response.json())
            .then(data => {
                this.setState({
                    totalPage:Math.ceil(parseInt(data)/10)
                })
            })
            .catch(function (e) {
                message.error("error"+e,1)
            });
    }

    getSearchedTopicList(search){
        fetch('http://' + localhost + '/getSearchedTopics/'+search+'/'+this.state.curPage+'/10', {})
            .then(response => response.json())
            .then(data => {
                if (JSON.stringify(data) === '[]') {
                    this.setState({
                        topicList: [],
                    });
                } else {
                    this.setState({
                        topicList: data,
                    });
                }
            })
            .catch(function (e) {
                message.error("error"+e,1)
            });
    }

    postSearch(search){
        if (search==="") {
            message.error("搜索内容不能为空哦！")
            return
        }
        this.getSearchedTopicSize(search)
        this.setState({
            curPage: 1,
            ifSearch:true
        },()=>{
            this.getSearchedTopicList(search)
        })
    }

    pageChange=(pageNumber) =>{
        this.setState({
            curPage:pageNumber
        },()=>{
            if (!this.state.ifSearch)
                this.getTopicList()
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
                <Search placeholder="搜索您想查找的内容" onSearch={(value,event)=>this.postSearch(value)} style={{ width: 600 }} />
            </Space>
        )
    }


    renderTopics=()=>{
        if (this.state.topicList!==null){
            return(
                <div>
                    <List
                        className="comment-list"
                        header={this.showSearch()}
                        itemLayout="horizontal"
                        dataSource={this.state.topicList}
                        renderItem={(topic,index) => (
                            <li>
                                <TopicSection
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
                                />
                            </li>
                        )}
                    />
                    <div>
                        <Pagination showQuickJumper current={this.state.curPage} total={this.state.totalPage*10} onChange={this.pageChange} showSizeChanger={false}/>
                    </div>
                </div>)
        }
        else if (this.state.ifSearch)
            return(
                <div>

                    <List
                        className="comment-list"
                        header={this.showSearch()}
                        footer={'没有查找到您想搜索的内容哦！'}
                        itemLayout="horizontal"
                        dataSource={this.state.topicList}
                        renderItem={(topic,index) => (
                            <li>
                                <TopicSection
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
                                />
                            </li>
                        )}
                    />
                </div>)
        else return <div></div>
    }

    render() {
        if (this.state.renderTopic)
            return this.renderTopics()
    }

}

