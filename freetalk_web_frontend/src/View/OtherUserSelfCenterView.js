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
    PlusOutlined,
    UserSwitchOutlined, CloudDownloadOutlined,
} from '@ant-design/icons';

import {localhost_frontend} from "../App";
import {
    gotoAnswer, gotoDownloadApk, gotoFocusTopic,
    gotoHotTopics, gotoNewTopic,
    gotoPostTopic,
    gotoPrivateChat,
    gotoRecommendTopics,
    gotoSelfCenter
} from "../utils/redirection";
import {OtherUserSelfCenter} from "../component/OtherUserSelfCenter";

const { Header, Content, Sider,Footer } = Layout;
const { SubMenu } = Menu;
const reg = new RegExp('userId=([^&]*)(&|$)');


export class OtherUserSelfCenterView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            collapsed: false,
            selectedKey: '2',
            userId:0,
            otherUserId:parseInt(window.location.href.match(reg)[1]),
        };
    }

    onCollapse = collapsed => {
        this.setState({ collapsed });
    };

    componentWillMount() {
        let userId=localStorage.getItem('userId');
        if(userId===null)
            window.location.replace("http://"+localhost_frontend+"/?#/logIn");
        else
            this.setState({
                userId:parseInt(userId)
            })
    }

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
                        <Menu.Item key="2" icon={<UserSwitchOutlined />}>????????????</Menu.Item>
                        <SubMenu key="sub1" icon={<FileTextOutlined />} title="??????">
                            <Menu.Item key="3" onClick={gotoRecommendTopics}>??????</Menu.Item>
                            <Menu.Item key="4" onClick={gotoHotTopics}>??????</Menu.Item>
                            {/*<Menu.Item key="10" onClick={gotoNewTopic} >??????</Menu.Item>*/}
                            <Menu.Item key="11" onClick={gotoFocusTopic}>??????</Menu.Item>
                        </SubMenu>
                        <SubMenu key="sub2" icon={<MessageOutlined />} title="??????">
                            <Menu.Item key="5" onClick={gotoPrivateChat}>??????</Menu.Item>
                            <Menu.Item key="6" onClick={gotoAnswer}>??????</Menu.Item>
                        </SubMenu>
                        <Menu.Item key="7" icon={<HomeOutlined />} onClick={gotoSelfCenter}>????????????</Menu.Item>
                        <Menu.Item key="8" icon={<PlusOutlined />} onClick={gotoPostTopic}>????????????</Menu.Item>
                        <Menu.Item key="9" icon={<CloudDownloadOutlined />} onClick={gotoDownloadApk}>??????APP</Menu.Item>
                    </Menu>
                </Sider>
                <Layout className="site-layout" stytle={{backgroundColor:'white'}}>
                    <Header className="site-layout-background" style={{ padding: 0 }} />
                    <Content style={{ margin: '0 16px' }}>
                        <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
                            <OtherUserSelfCenter otherUserId={this.state.otherUserId} userId={this.state.userId}/>
                        </div>
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>FreeTalk ??2021 Created by FreeTalk Team</Footer>
                </Layout>
            </Layout>
        );
    }
}
