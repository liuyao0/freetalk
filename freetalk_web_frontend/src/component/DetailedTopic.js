import React from 'react';
import 'antd/dist/antd.css';
import '../index.css'
import {TopicComment} from './TopicComment'
import {TopicInfo} from "./TopicInfo";

export class DetailedTopic extends React.Component {
    // eslint-disable-next-line no-useless-constructor
    constructor(props) {
        super(props);
        this.state={
            myUserId:props.myUserId
        }
    }

    render() {
        return (
            <div>
                <div>
                    <TopicInfo topicId={this.props.topicId} goBack={this.props.goBack} myUserId={this.state.myUserId}> </TopicInfo>
                </div>
                <div>
                    <TopicComment topicId={this.props.topicId} myUserId={this.state.myUserId}/>
                </div>
            </div>
        )
    }
}
