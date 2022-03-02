import React from 'react';
import logo from '../image/logo1.png'
import 'antd/dist/antd.css';
import '../index.css';
import '../App.css'
import { Layout, Menu} from 'antd';
import {
    PlusOutlined,
    HomeOutlined,
    TeamOutlined,
    FileTextOutlined, AreaChartOutlined,
} from '@ant-design/icons';

import {
    gotoUserManagementView,
    gotoHottestTopicsView,
    gotoNewestTopicsView,
    gotoSelfCenterView, gotoPrometheus, gotoGrafana,
} from "../utils/redirection";

import DetailedTopic from "../component/DetailedTopic";
import {localhost_frontend} from "../App";

const { Header, Content, Sider,Footer } = Layout;
const { SubMenu } = Menu;
const reg = new RegExp('topicId=([^&]*)(&|$)');
class SiderDemo extends React.Component {
    state = {
        collapsed: false,
        selectedKey: '9',
        topicId:parseInt(window.location.href.match(reg)[1]),
    };

    componentWillMount() {
        let userId=localStorage.getItem('adUserId');
        if(userId===null)
            window.location.replace("http://"+localhost_frontend+"/?#/logIn");
        else
            this.setState({
                userId:parseInt(userId)
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
                        defaultSelectedKeys={['1']}
                        mode="inline" onSelect={(e)=>{
                        this.setState({selectedKey:e.key})
                    }}
                        selectedKeys={[this.state.selectedKey]}
                    >
                        {/*<Menu.Item key="1" disabled icon={<CommentOutlined />}>*/}
                        {/*  话题详情*/}
                        {/*</Menu.Item>*/}
                        <Menu.Item key="9" icon={<PlusOutlined />} >
                            话题详情
                        </Menu.Item>
                        <Menu.Item key="2" onClick={gotoUserManagementView} icon={<TeamOutlined />}>
                            用户管理
                        </Menu.Item>
                        <SubMenu key="sub1" icon={<FileTextOutlined />} title="话题管理">
                            <Menu.Item key="3" onClick={gotoHottestTopicsView}>查看热榜</Menu.Item>
                            <Menu.Item key="4" onClick={gotoNewestTopicsView}>最新话题</Menu.Item>
                            {/*<Menu.Item key="5" onClick={gotoMarkedTopicsView}>重点话题</Menu.Item>*/}
                        </SubMenu>

                        <SubMenu key="sub2" icon={<AreaChartOutlined />} title="后端运行监控">
                            <Menu.Item key="7" onClick={gotoPrometheus}>Prometheus</Menu.Item>
                            <Menu.Item key="8" onClick={gotoGrafana}>Grafana</Menu.Item>
                        </SubMenu>
                        <Menu.Item key="6" onClick={gotoSelfCenterView} icon={<HomeOutlined />} >
                            个人中心
                        </Menu.Item>
                    </Menu>
                </Sider>
                <Layout className="site-layout">
                    <Header className="site-layout-background" style={{ padding: 0 }} />
                    <Content style={{ margin: '0 16px' }}>
                        <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
                            <DetailedTopic topicId={this.state.topicId}/>
                        </div>
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>FreeTalk ©2021 Created by FreeTalk Team</Footer>
                </Layout>
            </Layout>
        );
    }
}
function App() {
    return (
        <div className="App">
            <SiderDemo />
        </div>
    );
}

export default App;
