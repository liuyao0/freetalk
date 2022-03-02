import React from 'react';
import 'antd/dist/antd.css';
import { Collapse } from 'antd';
import { List, Avatar } from 'antd';
import {localhost, localhost_frontend} from "../App";
import {getDateTime} from "../utils/functions";
const { Panel } = Collapse;

export class UserTopicAndComment extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            topic:[],
            comment:[],
            userId:props.userId,
            banData:[]
        }
    }

    componentDidMount() {
        fetch('http://'+localhost+'/getTopicsUserCreat?userId='+this.state.userId, )
            .then(response => response.json())
            .then(data => {
                this.setState({
                    topic: data,
                });
            })
            .catch(function (ex) {
                console.log('parsing failed', ex);
            });
        fetch('http://'+localhost+'/getCommentsUserCreat?userId='+this.state.userId, )
            .then(response => response.json())
            .then(data => {
                this.setState({
                    comment: data,
                });
            })
            .catch(function (ex) {
                console.log('parsing failed', ex);
            });
        fetch('http://'+localhost+'/findAllBanTime?userId='+this.state.userId, )
            .then(response => response.json())
            .then(data => {
                this.setState({
                    banData: data,
                });
            })
            .catch(function (ex) {
                console.log('parsing failed', ex);
            });
    }

    render() {
        return(
            <Collapse defaultActiveKey={['1']} >
                <Panel header="用户发帖" key="1">
                    <List
                        itemLayout="horizontal"
                        dataSource={this.state.topic}
                        renderItem={item => (
                            <List.Item>
                                <List.Item.Meta
                                    avatar={<Avatar src={item.userImage} />}
                                    title={<a href={'http://'+localhost_frontend+'/?#/topicDetail?topicId='+item.topicId}>{item.title}</a>}
                                />
                            </List.Item>
                        )}
                    />
                </Panel>
                <Panel header="用户回帖" key="2">
                    <List
                        itemLayout="horizontal"
                        dataSource={this.state.comment}
                        renderItem={item => (
                            <List.Item>
                                <List.Item.Meta
                                    avatar={<Avatar src={item.image} />}
                                    title={<a href={'http://'+localhost_frontend+'/?#/topicDetail?topicId='+item.topicId}>{item.topicTitle}</a>}
                                    description={ <div dangerouslySetInnerHTML={{__html: item.commentContent}}></div>}
                                />
                            </List.Item>
                        )}
                    />
                </Panel>
                <Panel header="禁言记录" key="3">
                    <List
                        itemLayout="horizontal"
                        dataSource={this.state.banData}
                        renderItem={item => (
                            <List.Item>
                                <List.Item.Meta
                                    title={<a>{getDateTime(item.beginTime)}至{getDateTime(item.endTime)}</a>}
                                />
                            </List.Item>
                        )}
                    />
                </Panel>
            </Collapse>
        );
    }
}
