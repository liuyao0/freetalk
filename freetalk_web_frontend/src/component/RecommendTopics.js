import React from 'react';
import 'antd/dist/antd.css';
import '../index.css'
import {List, Pagination, message, Space, Input, Button} from 'antd';
import {changeHTMLToText} from "../utils/functions";
import {localhost} from "../App";
import {TopicSection} from "./TopicSection";
import {getDateTime} from "../utils/functions";
import {SyncOutlined} from "@ant-design/icons"

const { Search } = Input;

export default class RecommendTopics extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            topicList:null,
            curPage:1,
            totalPage:1,
            //false:推荐 推荐不需要分页
            ifSearch:false,

            userId:props.userId
        }
    }

    componentDidMount() {
        this.getTopicSize()
        this.getTopicList()
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
                message.error("error"+e,0.5)
            });
    }

    getTopicList = () => {
        fetch('http://' + localhost + '/getRecommendTopics?userId='+this.state.userId+'&size=10', {})
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
                message.error("error"+e,0.5)
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
                message.error("error"+e,1000)
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
                message.error("error"+e,1000)
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
        if (this.state.ifSearch)
            return (
                <div>
                    <Pagination showQuickJumper defaultCurrent={this.state.curPage} total={this.state.totalPage*10} onChange={this.pageChange} showSizeChanger={false}/>
                </div>
            )
    }

    showSearch=()=>{
        return (
            <div style={{height:'32px',display:"flex",flexDirection:"row",justifyContent:"center"}}>
                <Space style={{display:"block",height:"32px",width:"600px"}} direction="vertical">
                    <Search placeholder="搜索您想查找的内容" onSearch={(value)=>this.postSearch(value)}
                            onChange={(e)=>{
                                if (e.target.value===""){
                                    this.setState({
                                        ifSearch:false
                                    })
                                    this.getTopicSize()
                                    this.getTopicList()
                                }
                            }}
                            style={{ width: 600 }} />
                </Space>
                <span style={{
                    display:"block",
                    height:"32px"
                }}>
                    <Button style={{marginLeft:'20px'}} icon={<SyncOutlined />} onClick={()=>{
                        this.getTopicList()
                    }}>刷新</Button>
                </span>
            </div>
        )
    }

    render() {
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
                                    topicId={topic.topicId}
                                />
                            </li>
                        )}
                    />
                    {this.renderPage()}
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
                                    topicId={topic.topicId}
                                />
                            </li>
                        )}
                    />
                </div>)
        else return <div/>
    }

}
