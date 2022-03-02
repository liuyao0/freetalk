import React from 'react';
import 'antd/dist/antd.css';
import '../index.css'
import {CheckComment} from './Comment'
import {Topic} from "./TopicContent";

export default class DetailedTopic extends React.Component {
    // eslint-disable-next-line no-useless-constructor
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <div>
                    <Topic topicId={this.props.topicId}> </Topic>
                </div>
                <div>
                    <CheckComment topicId={this.props.topicId}/>
                </div>
            </div>
        )
    }
}
