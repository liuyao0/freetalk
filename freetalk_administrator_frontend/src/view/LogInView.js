import React from 'react';
import logo from '../image/logo1.png'
import 'antd/dist/antd.css';
import '../App.css';
import '../index.css';
import {Layout, Menu} from 'antd';
import {
    HomeOutlined,
    FileTextOutlined,
    TeamOutlined, AreaChartOutlined,
} from '@ant-design/icons';

import LogIn from "../component/LogIn";
import {
    gotoGrafana,
    gotoHottestTopicsView,
    gotoNewestTopicsView, gotoPrometheus,
    gotoSelfCenterView,
    gotoUserManagementView
} from "../utils/redirection";

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
                        defaultOpenKeys={['sub1']}

                    >
                        <Menu.Item key="2" onClick={gotoUserManagementView} icon={<TeamOutlined />} disabled={true}>
                            用户管理
                        </Menu.Item>
                        <SubMenu key="sub1" icon={<FileTextOutlined />} title="话题管理">
                            <Menu.Item key="3" onClick={gotoHottestTopicsView} disabled={true}>查看热榜</Menu.Item>
                            <Menu.Item key="4" onClick={gotoNewestTopicsView} disabled={true}>最新话题</Menu.Item>
                            {/*<Menu.Item key="5" onClick={gotoMarkedTopicsView}>重点话题</Menu.Item>*/}
                        </SubMenu>

                        <SubMenu key="sub2" icon={<AreaChartOutlined />} title="后端运行监控">
                            <Menu.Item key="7" onClick={gotoPrometheus}>Prometheus</Menu.Item>
                            <Menu.Item key="8" onClick={gotoGrafana}>Grafana</Menu.Item>
                        </SubMenu>
                        <Menu.Item key="6" onClick={gotoSelfCenterView} icon={<HomeOutlined />} disabled={true} >
                            个人中心
                        </Menu.Item>
                    </Menu>
                </Sider>
                <Layout className="site-layout" stytle={{backgroundColor:'white'}}>
                    <Header className="site-layout-background" style={{ padding: 0 }} />
                    <Content style={{ margin: '0 16px' }}>
                        <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
                            <LogIn/>
                        </div>
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>FreeTalk ©2021 Created by FreeTalk Team</Footer>
                </Layout>
            </Layout>
        );
    }
}
