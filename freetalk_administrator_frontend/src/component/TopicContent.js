import React from 'react';
import 'antd/dist/antd.css';
import {Card, Avatar, Button, message, Popconfirm, Modal, InputNumber} from 'antd';
import Meta from "antd/es/card/Meta";

import {localhost} from "../App";


export class Topic extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            topicId:1,
            data:{"topicId":1,
                "postTime":"",
                "title":"",
                "topicDescription":"",
                "userId":1,
                "username":"",
                "userImage":null,
                "userDescription":"",
                "likes":0,
                "stars":0,
                "views":0,
                "replies":0,
                "hot":0,
                "weight":0},
            isModalVisible:false,
            changedWeight:0
        };
    }
    componentDidMount() {
        fetch('http://'+localhost+'/getATopicView/'+this.props.topicId, {
        }).catch(function (e) {
            message.error("error:" + e,1);
        }).then(response => response.json())
            .then(data => {
                this.setState({
                    data: data,
                    changedWeight:data.weight
                });
            }).catch(function (ex) {
            console.log('parsing failed', ex)
        })
    }
    DeleteTopic=()=>{
        fetch('http://'+localhost+'/deleteATopic?topicId='+this.props.topicId, {
        }).catch(function () {
            message.error("网络错误，请重试",1);
        }).then(()=>{
            message.success("删除话题成功",1)
           window.history.back()
        })
            .catch(function (ex) {
            console.log('parsing failed', ex)
        })
    }

    changeWeight=()=> {
        fetch('http://' + localhost + '/changeWeightOfATopic?topicId=' + this.props.topicId+"&weight="+this.state.changedWeight);
        this.setState({
            isModalVisible:false,
        })
    }


    render() {
        return(
            <>
                <div
                    style={{
                        display:"flex"
                    }}
                >
                </div>
                <Card title={<div style={{textAlign:'left', fontWeight:'bold', fontSize:22}}>{this.state.data.title}</div>}
                      extra={
                          <div>
                          <Button onClick={()=> this.setState({isModalVisible:true})}>修改权重</Button>
                          <Popconfirm
                              title="请确定您是否要删除这个话题"
                              onConfirm={this.DeleteTopic}
                              okText="确定"
                              cancelText="取消"
                          >
                          <Button>删除话题</Button>
                          </Popconfirm>
                          </div>
                      }
                      style={{ padding:10}}>
                    <Meta
                        avatar={
                            <Avatar src={this.state.data.userImage} size={60}/>
                        }
                        title={<div style={{textAlign:'left'}}>{this.state.data.username}</div>}
                        description={<div style={{textAlign:'left'}}>{this.state.data.userDescription}</div>}
                    />
                    <p style={{padding:15,textAlign:'left'}}>
                    {<div  dangerouslySetInnerHTML={{__html: this.state.data.topicDescription}}/>}
                    </p>
                    <div style={{textAlign:'left'}}>
                        {this.state.data.likes +
                        ' 点赞    ' }&nbsp;&nbsp;{
                        this.state.data.stars +
                        ' 收藏    ' }&nbsp;&nbsp;{
                        this.state.data.views +
                        ' 浏览    ' }&nbsp;&nbsp;{
                        this.state.changedWeight+
                        ' 权重    ' }
                    </div>
                </Card>
                <Modal title="修改话题权重"
                       visible={this.state.isModalVisible}
                       onOk={this.changeWeight}
                       onCancel={()=>this.setState({isModalVisible:false})}
                       cancelText={"取消"}
                       okText={"确认"}
                >
                    <InputNumber min={1} max={100} value={this.state.changedWeight} onChange={(value)=>this.setState({changedWeight:value})} />
                </Modal>
            </>
        )
    }
}
