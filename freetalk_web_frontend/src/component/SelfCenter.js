import {
    Layout,
    Menu,
    Space
} from "antd";
import React from "react";
import {
    Descriptions,
    Image,
    Button,
    Collapse,
    Modal,
    Input,
    Upload,
    message
} from 'antd';
import {MyTopic} from "./MyTopic";
import {MyStarTopic} from "./MyStarTopic";
import {MyComment} from "./MyComment";
import {MyStarComment} from "./MyStarComment";
import {MyFollows} from "./MyFollows";
import {MyFollowers} from "./MyFollowers";
import {
    LoadingOutlined,
    UserOutlined,
    PlusOutlined,
    MailOutlined,
    IdcardOutlined,
    KeyOutlined,
    MenuFoldOutlined,
    LogoutOutlined
} from '@ant-design/icons';

import {localhost, localhost_frontend} from "../App";

const { Panel } = Collapse;

export function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
}

export function beforeUpload(file) {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
        message.error('You can only upload JPG/PNG file!',1);
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
        message.error('Image must smaller than 2MB!',1);
    }
    return isJpgOrPng && isLt2M;
}

const {Content, Sider } = Layout;

export class SelfCenter extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            data:[],
            selectedKey:'1',
            userInfo:{},
            userId:props.userId,
            visible:false,
            changedUsername:'',
            changedDescription:'',
            changedEmail:'',
            changedImage:'',
            loading: false,
            changePasswordVisible:false,
            oldPassword:'',
            changedPassword:'',
            changedPasswordAgain:''
        }
    }

    componentDidMount() {
        fetch('http://'+localhost+'/getUserInfo?userId='+this.state.userId, )
            .then(response => response.json())
            .then(data => {
                this.setState({
                    userInfo: data,
                    changedUsername:data.username,
                    changedDescription:data.description,
                    changedEmail:data.email,
                    changedImage:data.image,
                });
            })
            .catch(function (ex) {
                console.log('parsing failed', ex);
            });
    }

    logOut=()=>{
        localStorage.removeItem('userId')
        window.location.href=("http://"+localhost_frontend+"/?#/logIn");
    }

    renderItem=()=>{
        return <div>
                {( ()=>{
                        switch(this.state.selectedKey){
                            case "1":return <MyTopic userId={this.state.userId} />;
                            case "2":return <MyComment userId={this.state.userId} />;
                            case "3":return <MyStarTopic userId={this.state.userId} />;
                            case "4":return <MyStarComment userId={this.state.userId} />;
                            case "5":return <MyFollows userId={this.state.userId}/>;
                            case "6":return <MyFollowers userId={this.state.userId}/>;
                            default:return 'undefined';
                        }
                    }
                )()}
            </div>
    }

    handleChange = info => {
        getBase64(info.file.originFileObj, imageUrl =>{
            this.setState({
                changedImage:imageUrl,
                loading: false,
            })
            },
            );
    };

    updateInfo=()=>{
        if(!this.state.changedEmail.match(/^\w+@\w+\.\w+$/i)&&!this.state.changedEmail.match(/^\w+@\w+\.\w+\.\w+$/i)){
            message.error('?????????????????????',1)
            return
        }
        let infToService={
            method:'post',
            headers:{
                "Content-Type":"application/json",
                'token':localStorage.getItem('key'),
                'userId':localStorage.getItem('userId')
            },
            body:JSON.stringify({
                "userId":this.state.userId,
                "username":this.state.changedUsername,
                "description":this.state.changedDescription,
                "email":this.state.changedEmail,
                "image":this.state.changedImage
            })
        }
        fetch("http://"+localhost+"/Security/updateUserInfo?",infToService)
            .then(()=>{
                fetch('http://'+localhost+'/getUserInfo?userId='+this.state.userId, )
                    .then(response => response.json())
                    .then(data => {
                        this.setState({
                            userInfo: data,
                            visible:false,
                        });
                    })
                    .catch(function (ex) {
                        console.log('parsing failed', ex);
                    });
                }
            )
    }

    updatePassword=()=>{
        if(this.state.changedPassword===''){
            message.error('??????????????????',1)
            return
        }
        if(this.state.changedPassword!==this.state.changedPasswordAgain){
            message.error('??????????????????????????????',1)
            return
        }
        if(this.state.changedPassword===this.state.oldPassword){
            message.error('?????????????????????????????????',1)
            return
        }
        let inf={
            method:'post',
            headers:{
                "Content-Type":"application/json",
                'token':localStorage.getItem('key'),
                'userId':localStorage.getItem('userId')
            },
            body:JSON.stringify({
                "userId":this.state.userId,
                "oldPassword":this.state.oldPassword,
                "newPassword":this.state.changedPassword,
            })
        }
        fetch('http://' + localhost + '/Security/updatePassword', inf)
            .then(response => response.text())
            .then(data => {
                if (data !== '') {
                    message.success('????????????', 1);
                    this.setState({changePasswordVisible:false})
                }
                else {
                    message.error('???????????????', 1);
                }
            })
    }


    render() {
        const uploadButton = (
            <div>
                {this.state.loading ? <LoadingOutlined /> : <PlusOutlined />}
                <div style={{ marginTop: 8 }}>Upload</div>
            </div>
        );
        return (
            <div>
                <div style={{ padding: '0 50px' }}>
                    <Collapse
                        defaultActiveKey={['1']}
                        // expandIconPosition={expandIconPosition}
                    >
                        <Panel header="??????????????????" key="1" >
                            {/*extra={genExtra()}*/}
                            <Descriptions
                                size={this.state.size}
                                extra={
                                    <Space>
                                        <Button
                                            type="primary"
                                            icon={<MenuFoldOutlined />}
                                            onClick={()=>this.setState({visible:true})}
                                        >
                                            ????????????
                                        </Button>
                                        <Button
                                            type="primary"
                                            icon={<LogoutOutlined />}
                                            onClick={()=>
                                            {
                                                localStorage.removeItem('userId')
                                                window.location.href=("http://"+localhost_frontend+"/?#/logIn");
                                            }
                                        }
                                        >
                                            ????????????
                                        </Button>
                                        <Button
                                            type="primary"
                                            icon={<KeyOutlined />}
                                            onClick={()=>this.setState({changePasswordVisible:true})}>????????????</Button>
                                    </Space>
                                }
                            >
                                <Descriptions.Item label="?????????">{this.state.userInfo.username}</Descriptions.Item>
                                <Descriptions.Item label="??????">{this.state.userInfo.userId}</Descriptions.Item>
                                <Descriptions.Item label="??????">{this.state.userInfo.email}</Descriptions.Item>
                                <Descriptions.Item label="????????????">{this.state.userInfo.description}</Descriptions.Item>
                                <Descriptions.Item label="??????">
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
                                    <Menu.Item key="1">????????????</Menu.Item>
                                    <Menu.Item key="2">????????????</Menu.Item>
                                    <Menu.Item key="3">????????????</Menu.Item>
                                    <Menu.Item key="4">????????????</Menu.Item>
                                    <Menu.Item key="5">????????????</Menu.Item>
                                    <Menu.Item key="6">????????????</Menu.Item>
                                </Menu>
                            </Sider>
                            <Content style={{ padding: '0 24px', minHeight: 280 }}>
                                {this.renderItem()}
                            </Content>
                        </Layout>
                    </Content>
                </Layout>
                <Modal
                    title="??????????????????"
                    visible={this.state.visible}
                    onOk={this.updateInfo}
                    onCancel={()=>this.setState({visible:false})}
                    cancelText={'??????'}
                    okText={'??????'}
                >
                    <Space direction="vertical">
                        <Input size="small" placeholder="?????????..." stytle={{width:100}} value={this.state.changedUsername} prefix={<UserOutlined />} onChange={(e)=>this.setState({changedUsername:e.target.value})} />
                        <Input size="small" placeholder="??????..." value={this.state.changedEmail} prefix={<MailOutlined />} onChange={(e)=>this.setState({changedEmail:e.target.value})} />
                    <Input size="small" placeholder="????????????..." value={this.state.changedDescription} prefix={<IdcardOutlined />} onChange={(e)=>this.setState({changedDescription:e.target.value})} />

                    <Upload
                        name="avatar"
                        listType="picture-card"
                        className="avatar-uploader"
                        showUploadList={false}
                        beforeUpload={beforeUpload}
                        onChange={this.handleChange}
                    >
                        {this.state.changedImage ? <img src={this.state.changedImage} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
                    </Upload>


                    </Space>
                </Modal>

                <Modal
                    title="????????????"
                    visible={this.state.changePasswordVisible}
                    onOk={this.updatePassword}
                    onCancel={()=>this.setState({changePasswordVisible:false})}
                    cancelText={'??????'}
                    okText={'??????'}
                >
                    <Space direction="vertical">
                        <Input
                            size="small"
                            type={"password"}
                            placeholder="?????????..."
                            stytle={{width:100}}
                            value={this.state.oldPassword}
                            prefix={<KeyOutlined />}
                            onChange={(e)=>this.setState({oldPassword:e.target.value})}
                        />
                        <Input
                            size="small"
                            type={"password"}
                            placeholder="?????????..."
                            value={this.state.changedPassword}
                            prefix={<KeyOutlined />}
                            onChange={(e)=>this.setState({changedPassword:e.target.value})}
                        />
                        <Input
                            size="small"
                            type={"password"}
                            placeholder="???????????????..."
                            value={this.state.changedPasswordAgain}
                            prefix={<KeyOutlined />}
                            onChange={(e)=>this.setState({changedPasswordAgain:e.target.value})}
                        />
                    </Space>
                </Modal>

            </div>

        );
    }
}
