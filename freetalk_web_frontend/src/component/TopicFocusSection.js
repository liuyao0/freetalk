import React from 'react';
import 'antd/dist/antd.css';
import '../index.css'
import {
    Comment,
    Badge, Space, Avatar
} from 'antd';
import {localhost_frontend} from "../App";
import Text from "antd/lib/typography/Text";

export class TopicFocusSection extends React.Component{

    constructor(props) {
        super(props);
        this.state={
            color:'white'
        }
    }

    showTitle=()=>{
        if (this.props.type===1)
            return(
                <div style={{textAlign:'left',marginTop:'10px'}}>
                    <Space direction={'vertical'}>
                        <Space>
                            <Avatar src={this.props.focusUserImage} size={'small'}/>
                            <Text style={{color: '#0311a8'}}>{this.props.focusUsername} 创建了话题</Text>
                        </Space>
                        <div style={{textAlign:'left',marginTop:'10px',
                            fontWeight:'bold',fontSize:'20px'}}>
                            {'  '}{this.props.title}
                        </div>
                    </Space>
                </div>
            )
        else return (
            <div style={{textAlign:'left',marginTop:'10px'}}>
                <Space direction={'vertical'}>
                <Space>
                    <Avatar src={this.props.focusUserImage} size={'small'}/>
                    <Text style={{color: '#0311a8'}}>{this.props.focusUsername} 回答了话题</Text>
                </Space>
                <div style={{textAlign:'left',marginTop:'10px',
                    fontWeight:'bold',fontSize:'20px'}}>
                    {'  '}{this.props.title}
                </div>
                </Space>
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
    showHeader=()=>{
        if(this.props.type===1)
            return(
                <Space>
                <Text>{this.props.author} 创建了话题</Text>
                </Space>
            )
        else
            return(
                <Space>
                    <Text>{this.props.author} 创建了话题</Text>

                </Space>
            )
    }

    render() {
        return (
            <div
                onClick={()=>{
                    window.location.href=('http://'+localhost_frontend+'/?#/topicDetail?topicId='+this.props.topicId);
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

                {/*<Space style={{float:'left'}}>*/}
                {/*    <Avatar src={this.props.avatar} size={'small'}/>*/}
                {/*    {this.showHeader()}*/}
                {/*</Space>*/}
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
