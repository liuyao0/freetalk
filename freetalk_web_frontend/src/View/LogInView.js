import React from 'react';
import logo from '../image/logo1.png'
import 'antd/dist/antd.css';
import '../App.css';
import '../index.css';
import {Button, Image, Input, Layout, Menu, Space, Tabs} from 'antd';
import {
    HomeOutlined,
    MessageOutlined,
    FileTextOutlined,
    PlusOutlined,
    RightCircleOutlined, UserOutlined, KeyOutlined, LoginOutlined, PlusCircleOutlined, CloudDownloadOutlined,
} from '@ant-design/icons';

import {
    gotoAnswer, gotoDownloadApk, gotoFocusTopic,
    gotoHotTopics, gotoNewTopic,
    gotoPostTopic,
    gotoPrivateChat,
    gotoRecommendTopics,
    gotoSelfCenter
} from "../utils/redirection";
import LogIn from "../component/LogIn";
import {RegisterForm} from "../component/RegisterForm";
import QrLogIn from "../component/QrLogIn";
const { TabPane } = Tabs;

const { Header, Content, Sider,Footer } = Layout;
const { SubMenu } = Menu;


export class LogInView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            collapsed: false,
            selectedKey: '1',
            userId:0,
        };
    }

    onCollapse = collapsed => {
        this.setState({ collapsed });
    };

    render() {
        const { collapsed } = this.state;
        return (
            <Layout style={{ minHeight: '100vh' }}>
                <Sider collapsible collapsed={collapsed} onCollapse={this.onCollapse}>
                    <img className="logo" src={logo} alt={''}/>
                    <Menu
                        theme="dark"
                        defaultSelectedKeys={['1']}
                        mode="inline" onSelect={(e)=>{
                        this.setState({selectedKey:e.key})
                    }}
                        selectedKeys={[this.state.selectedKey]}
                    >
                        <Menu.Item key="1" icon={<RightCircleOutlined />} >登录</Menu.Item>
                        <SubMenu key="sub1" icon={<FileTextOutlined />} title="话题">
                            <Menu.Item key="3" onClick={gotoRecommendTopics} disabled={true}>推荐</Menu.Item>
                            <Menu.Item key="4" onClick={gotoHotTopics} disabled={true}>热榜</Menu.Item>
                            {/*<Menu.Item key="10" onClick={gotoNewTopic} >最新</Menu.Item>*/}
                            <Menu.Item key="11" onClick={gotoFocusTopic}>关注</Menu.Item>
                        </SubMenu>
                        <SubMenu key="sub2" icon={<MessageOutlined />} title="通知">
                            <Menu.Item key="5" onClick={gotoPrivateChat} disabled={true}>私信</Menu.Item>
                            <Menu.Item key="6" onClick={gotoAnswer} disabled={true}>回复</Menu.Item>
                        </SubMenu>
                        <Menu.Item key="7" icon={<HomeOutlined />} onClick={gotoSelfCenter} disabled={true}>个人中心</Menu.Item>
                        <Menu.Item key="8" icon={<PlusOutlined />} onClick={gotoPostTopic} disabled={true}>发布话题</Menu.Item>
                        <Menu.Item key="9" icon={<CloudDownloadOutlined />} onClick={gotoDownloadApk}>下载APP</Menu.Item>
                    </Menu>
                </Sider>
                <Layout className="site-layout" stytle={{backgroundColor:'white'}}>
                    <Header className="site-layout-background" style={{ padding: 0 }} />
                    <Content style={{ margin: '0 16px' }}>
                        <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
                            <Tabs defaultActiveKey="1" onChange={(key)=>{this.setState({key:key})}} tabPosition={"left"}>
                                <TabPane tab="密码登录" key="1">
                                    <LogIn/>
                                </TabPane>
                                <TabPane tab="扫码登陆" key="2" onChange={(key)=>{this.setState({key:key})}}>
                                    <QrLogIn/>
                                </TabPane>
                            </Tabs>
                        </div>
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>FreeTalk ©2021 Created by FreeTalk Team</Footer>
                </Layout>
            </Layout>
        );
    }
}
