import React from 'react';
import 'antd/dist/antd.css';
import '../index.css'
import {List, message} from 'antd';
import {changeHTMLToText} from "../utils/functions";
import {localhost} from "../App";
import {TopicSection} from "./TopicSection";
import {getDateTime} from "../utils/functions";

export default class HottestTopics extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            topicList:null,

            renderTopic:true,
            //以下是显示topic详情的
            topicId:1,
        }
        this.getTopicList()
    }

    changeRenderState=()=>{
        this.setState({
            renderTopic:!this.state.renderTopic
        })
    }

    setTopicId=(topicId)=>{
        this.setState({
            topicId:topicId
        },()=>{
            this.changeRenderState()
        })
    }

    getTopicList = () => {
        fetch('http://' + localhost + '/getHotTopics/20', {})
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

    renderTopics=()=>{
        if (this.state.topicList!==null){
            return(
                <List
                    className="comment-list"
                    header={'实时热榜'}
                    itemLayout="horizontal"
                    dataSource={this.state.topicList}
                    renderItem={(topic,index) => (
                        <li>
                            <TopicSection
                                goBackKind={0}
                                topicId={topic.topicId}
                                showBadge={true}
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
                />)
        }
        else return <div/>
    }


    render() {
        if (this.state.renderTopic)
            return this.renderTopics()
    }

}

