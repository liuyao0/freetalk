import React from "react";
import {localhost, localhost_frontend} from "../App";
import {
    List,
    Avatar
} from 'antd';

export class MyStarComment extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            userId:props.userId,
            topic:[],
        }
    }

    componentDidMount() {
        fetch('http://'+localhost+'/getCommentsUserStar?userId='+this.state.userId, )
            .then(response => response.json())
            .then(data => {
                this.setState({
                    topic: data,
                });
            })
            .catch(function (ex) {
                console.log('parsing failed', ex);
            });
    }

    render() {
        return (
            <List
                itemLayout="horizontal"
                dataSource={this.state.topic}
                renderItem={item => (
                    <List.Item>
                        <List.Item.Meta
                            avatar={<Avatar src={item.image} />}
                            title={
                                <div
                                    onClick={()=>{
                                        window.location.href=('http://'+localhost_frontend+'/?#/topicDetail?topicId='+item.topicId);
                                    }}
                                    style={{fontWeight:'bold',textAlign:'left'}}
                                >{item.topicTitle}</div>

                            }

                            description={
                                <div
                                    style={{background:"white",textAlign: 'left'}}
                                    dangerouslySetInnerHTML={{__html: item.commentContent}}
                                />
                            }
                        />
                    </List.Item>
                )}
            />

        );
    }
}
