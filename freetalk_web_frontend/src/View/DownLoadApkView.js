import React from 'react';
import logo from '../image/logo1.png'
import 'antd/dist/antd.css';
import '../App.css';
import '../index.css';
import {Layout, Menu} from 'antd';
import {
    HomeOutlined,
    MessageOutlined,
    FileTextOutlined,
    PlusOutlined, CloudDownloadOutlined,
} from '@ant-design/icons';

import {PostNewTopic} from "../component/PostNewTopic";
import {localhost_frontend} from "../App";
import {
    gotoAnswer, gotoDownloadApk, gotoFocusTopic,
    gotoHotTopics, gotoNewTopic,
    gotoPostTopic,
    gotoPrivateChat,
    gotoRecommendTopics,
    gotoSelfCenter
} from "../utils/redirection";
import {DownLoadAPK} from "../component/DownLoadAPK";

const { Header, Content, Sider,Footer } = Layout;
const { SubMenu } = Menu;


export class DownLoadApkView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            collapsed: false,
            selectedKey: '9',
            userId:0,
        };
    }

    componentWillMount() {
        let userId=localStorage.getItem('userId');
        if(userId===null)
            this.setState({
                logIn:true
            });
        else
            this.setState({
                logIn:false
            })
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
                        defaultSelectedKeys={['9']}
                        mode="inline" onSelect={(e)=>{
                        this.setState({selectedKey:e.key})
                    }}
                        selectedKeys={[this.state.selectedKey]}
                    >
                        <SubMenu key="sub1" icon={<FileTextOutlined />} title="话题">
                            <Menu.Item key="3" onClick={gotoRecommendTopics} disabled={this.state.logIn}>推荐</Menu.Item>
                            <Menu.Item key="4" onClick={gotoHotTopics} disabled={this.state.logIn}>热榜</Menu.Item>
                            {/*<Menu.Item key="10" onClick={gotoNewTopic} disabled={this.state.logIn}>最新</Menu.Item>*/}
                            <Menu.Item key="11" onClick={gotoFocusTopic} disabled={this.state.logIn}>关注</Menu.Item>
                        </SubMenu>
                        <SubMenu key="sub2" icon={<MessageOutlined />} title="通知">
                            <Menu.Item key="5" onClick={gotoPrivateChat} disabled={this.state.logIn}>私信</Menu.Item>
                            <Menu.Item key="6" onClick={gotoAnswer} disabled={this.state.logIn}>回复</Menu.Item>
                        </SubMenu>
                        <Menu.Item key="7" icon={<HomeOutlined />} onClick={gotoSelfCenter} disabled={this.state.logIn}>个人中心</Menu.Item>
                        <Menu.Item key="8" icon={<PlusOutlined />} onClick={gotoPostTopic} disabled={this.state.logIn}>发布话题</Menu.Item>
                        <Menu.Item key="9" icon={<CloudDownloadOutlined />} onClick={gotoDownloadApk}>下载APP</Menu.Item>
                    </Menu>
                </Sider>
                <Layout className="site-layout" stytle={{backgroundColor:'white'}}>
                    <Header className="site-layout-background" style={{ padding: 0 }} />
                    <Content style={{ margin: '0 16px' }}>
                        <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
                            <DownLoadAPK/>
                        </div>
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>FreeTalk ©2021 Created by FreeTalk Team</Footer>
                </Layout>
            </Layout>
        );
    }
}
