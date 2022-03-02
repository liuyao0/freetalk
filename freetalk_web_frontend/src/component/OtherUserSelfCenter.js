import {
    Layout,
    Menu, message,
    Space
} from "antd";
import React from "react";
import {
    Descriptions,
    Image,
    Button,
    Collapse,
} from 'antd';
import {MyTopic} from "./MyTopic";
import {MyStarTopic} from "./MyStarTopic";
import {MyComment} from "./MyComment";
import {MyStarComment} from "./MyStarComment";
import {MyFollows} from "./MyFollows";
import {MyFollowers} from "./MyFollowers";
import {WechatOutlined, HeartOutlined} from '@ant-design/icons'

import {localhost} from "../App";
import {PrivateChatModel} from "./PrivateChatModel";



const { Panel } = Collapse;

const {Content, Sider } = Layout;

export class OtherUserSelfCenter extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            data:[],
            selectedKey:'1',
            userInfo:{},
            userId:props.userId,
            otherUserId:props.otherUserId,
            onChat:false,
            authorFollowed:false
        }
    }

    componentDidMount() {
        let infToService={
            method:'post',
            headers:{
                "Content-Type":"application/json",
                'token':localStorage.getItem('key'),
                'userId':localStorage.getItem('userId')
            },
            body:JSON.stringify({})
        }
        fetch('http://'+localhost+'/getUserInfo?userId='+this.state.otherUserId, )
            .then(response => response.json())
            .then(data => {
                this.setState({
                    userInfo: data,
                });
            })
            .catch(function (ex) {
                console.log('parsing failed', ex);
            });

        fetch('http://'+localhost+'/Security/checkUserFollow?userId='+this.state.userId+'&userId_toFollow='+this.state.otherUserId,infToService).then(response => response.json())
            .then(data => {
                if (data===true) this.setState({authorFollowed:true})
                else this.setState({authorFollowed:false})
            }).catch(function (e) {
            message.error("error:" + e,1);
        });
    }

    changeFollowState=()=>{
        let infToService={
            method:'post',
            headers:{
                "Content-Type":"application/json",
                'token':localStorage.getItem('key'),
                'userId':localStorage.getItem('userId')
            },
            body:JSON.stringify({})
        }
        if (this.state.authorFollowed){
            message.success("已取消关注作者",1)
            fetch('http://'+localhost+'/Security/unfollowAUser?userId='+this.state.userId+'&userId_toFollow='+this.state.otherUserId, infToService).then(()=>{
                this.setState({
                    authorFollowed:false
                })
            }).catch(function () {
                message.error("网络错误，请重试",1);
            })
        }
        else {
            message.success("已关注作者",1)
            fetch('http://'+localhost+'/Security/followAUser?userId='+this.state.userId+'&userId_toFollow='+this.state.otherUserId, infToService).then(()=>{
                this.setState({
                    authorFollowed:true
                })
            }).catch(function () {
                message.error("网络错误，请重试",1);
            })
        }
    }

    renderItem=()=>{
        return <div>
            {( ()=>{
                    switch(this.state.selectedKey){
                        case "1":return <MyTopic userId={this.state.otherUserId} />;
                        case "2":return <MyComment userId={this.state.otherUserId} />;
                        case "3":return <MyStarTopic userId={this.state.otherUserId} />;
                        case "4":return <MyStarComment userId={this.state.otherUserId} />;
                        case "5":return <MyFollows userId={this.state.otherUserId}/>;
                        case "6":return <MyFollowers userId={this.state.otherUserId}/>;
                        default:return 'undefined';
                    }
                }
            )()}
        </div>
    }


    render() {
        return (
            <div>
                <div style={{ padding: '0 50px' }}>
                    <Collapse
                        defaultActiveKey={['1']}
                    >
                        <Panel header="用户个人信息" key="1" >
                            <Descriptions
                                size={this.state.size}
                                extra={
                                    <Space>
                                        <Button icon={<WechatOutlined />} onClick={()=>{this.setState({onChat:true})}} type="primary">私信</Button>
                                        <Button icon={<HeartOutlined />}  onClick={this.changeFollowState} type="primary">
                                            {this.state.authorFollowed?'已关注':'关注'}
                                        </Button>
                                    </Space>
                                }
                            >
                                <Descriptions.Item label="用户名">{this.state.userInfo.username}</Descriptions.Item>
                                <Descriptions.Item label="账号">{this.state.userInfo.userId}</Descriptions.Item>
                                <Descriptions.Item label="邮箱">{this.state.userInfo.email}</Descriptions.Item>
                                <Descriptions.Item label="个人描述">{this.state.userInfo.description}</Descriptions.Item>
                                <Descriptions.Item label="头像">
                                    <Image
                                        width={100}
                                        src={this.state.userInfo.image}
                                    />
                                </Descriptions.Item>
                            </Descriptions>
                        </Panel>
                    </Collapse>
                </div>
                <p/>
                <p/>
                <p/>
                <p/>
                <Layout>
                    <Content style={{ padding: '0 50px' }}>
                        <Layout className="site-layout-background" style={{ padding: '24px 0' }}>
                            <Sider className="site-layout-background" width={200}>
                                <Menu
                                    mode="inline"
                                    defaultSelectedKeys={['1']}
                                    defaultOpenKeys={['1']}
                                    style={{ height: '100%' }}
                                    onSelect={(key)=>{this.setState({selectedKey:key.key})}}
                                >
                                    <Menu.Item key="1">TA的话题</Menu.Item>
                                    <Menu.Item key="2">TA的评论</Menu.Item>
                                    <Menu.Item key="3">TA的关注</Menu.Item>
                                    <Menu.Item key="4">TA的收藏</Menu.Item>
                                    <Menu.Item key="5">TA的粉丝</Menu.Item>
                                    <Menu.Item key="6">关注的人</Menu.Item>
                                </Menu>
                            </Sider>
                            <Content style={{ padding: '0 24px', minHeight: 280 }}>
                                {this.renderItem()}
                            </Content>
                            <PrivateChatModel myUserId={this.state.userId}
                                              chatUserId={this.state.otherUserId}
                                              isVisible={this.state.onChat}
                                              closeModal={()=>{this.setState({onChat:false})}}
                            />

                        </Layout>
                    </Content>
                </Layout>
            </div>
        );
    }
}
