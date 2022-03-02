import React from 'react';
import 'antd/dist/antd.css';
import '../index.css'
import { Comment , Badge} from 'antd';

import {localhost_frontend} from "../App";

class TopicSection extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            color:'white'
        }
    }

    showTitle=()=>{
        if (this.props.showBadge)
            return(
                <div style={{textAlign:'left'}}>
                    <Badge size={'default'} offset={[0,-10]} count={this.props.rank} style={{backgroundColor:'#1E90FF'}}/>
                    <span style={{textAlign:'left',marginTop:'10px',
                        fontWeight:'bold',fontSize:'20px'}}>
                        {'  '}{this.props.title}
                    </span>
                </div>
            )
        else return (
            <div style={{textAlign:'left',marginTop:'10px',
                fontWeight:'bold',fontSize:'20px'}}>
                        {'  '}{this.props.title}
                    </div>
        )
    }

    showTopicFooter=()=>{
        if (this.props.showHot)
            return (
                <div>
                <p style={{textAlign:'left',fontSize:'12px'}}>热度：{this.props.hot} &nbsp;&nbsp;&nbsp;
                    {this.props.likes +
                    ' 点赞    ' }&nbsp;&nbsp;{
                    this.props.stars +
                    ' 收藏    ' }&nbsp;&nbsp;{
                    this.props.replies +
                    ' 回复    ' }&nbsp;&nbsp;{
                    this.props.views +
                    ' 浏览'}
                </p>
                </div>
            )
    }

    render() {
        return (
            <div
                onClick={()=>{
                    window.location.href='http://'+localhost_frontend+'/?#/topicDetail?topicId='+this.props.topicId;
                }}
                style={{backgroundColor:this.state.color,borderRadius:'5px'}}
                onMouseOver={()=>{
                    this.setState({
                        color:'#f1fcff'
                    })
                }}
                onMouseOut={
                    ()=>this.setState({
                        color:'white'
                    })
                }
            >
                {this.showTitle()}
            <Comment
                author={this.props.author}
                avatar={this.props.avatar}
                content={<div style={{textAlign:'left'}}>{this.props.content}</div>}
                datetime={this.props.datetime}
            />
                {this.showTopicFooter()}
            </div>
        )
    }

}

export {TopicSection}
