import React from 'react';
import 'antd/dist/antd.css';
import '../index.css'
import {
    message,
    List
} from 'antd';
import {changeHTMLToText} from "../utils/functions";
import {localhost} from "../App";
import {TopicSection} from "./TopicSection";
import {getDateTime} from "../utils/functions";

export default class HottestTopics extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            topicList:[]
        }
    }

    componentWillMount() {
        fetch('http://' + localhost + '/getHotTopics/20', {})
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

    render() {
        if (this.state.topicList!==null){
        return(
        <List
            style={{backgroundColor:'white'}}
            className="comment-list"
            header={'实时热榜'}
            itemLayout="horizontal"
            dataSource={this.state.topicList}
            renderItem={(topic,index) => (
                <li>
                    <TopicSection
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
                        topicId={topic.topicId}
                    />
                </li>
            )}
        />)
        }
        else return <div/>
    }

}

