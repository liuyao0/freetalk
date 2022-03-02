import {
    Space
} from "antd";
import React from "react";
import {
    Descriptions,
    Button,
    Modal,
    Input,
    message
} from 'antd';
import {
    KeyOutlined
} from '@ant-design/icons';

import {localhost, localhost_frontend} from "../App";

export class SelfCenter extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            selectedKey:'1',
            userInfo:{},
            userId:props.adUserId,
            changePasswordVisible:false,
            oldPassword:'',
            changedPassword:'',
            changedPasswordAgain:''
        }
    }

    componentDidMount() {
        fetch('http://'+localhost+'/getUsernameOfAdministrator?userId='+this.state.userId, )
            .then(response => response.text())
            .then(data => {
                this.setState({
                    username: data,
                });
            })
            .catch(function (ex) {
                console.log('parsing failed', ex);
            });
    }

    logOut=()=>{
        localStorage.removeItem('adUserId')
        // window.location.replace("http://"+localhost_frontend+"/?#/logIn");
    }

    updatePassword=()=>{
        if(this.state.changedPassword===''){
            message.error('请输入新密码',1)
            return
        }
        if(this.state.changedPassword!==this.state.changedPasswordAgain){
            message.error('两次输入的密码不一致',1)
            return
        }
        if(this.state.changedPassword===this.state.oldPassword){
            message.error('新密码和原密码输入一致',1)
            return
        }
        let inf={
            method:'post',
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                "userId":this.state.userId,
                "oldPassword":this.state.oldPassword,
                "newPassword":this.state.changedPassword,
            })
        }
        fetch('http://' + localhost + '/administratorChangePassword', inf)
            .then(response => response.text())
            .then(data => {
                if (data === 'wrong old password') {
                    message.error('旧密码错误', 1);
                }
                else {
                    message.success('修改成功', 1);
                    this.setState({changePasswordVisible:false})
                }
            })
    }


    render() {
        return (
            <div>
                <div style={{ padding: '0 50px' }}>

                            {/*extra={genExtra()}*/}
                            <Descriptions
                                size={this.state.size}
                                extra={
                                    <Space>
                                        <Button type="primary" onClick={()=>
                                        {
                                            localStorage.removeItem('userId')
                                            window.location.replace("http://"+localhost_frontend+"/?#/logIn");
                                        }
                                        }>退出登录</Button>
                                        <Button type="primary" onClick={()=>this.setState({changePasswordVisible:true})}>修改密码</Button>
                                    </Space>
                                }
                            >
                                <Descriptions.Item label="身份">{"管理员"}</Descriptions.Item>
                                <Descriptions.Item label="用户名">{this.state.username}</Descriptions.Item>
                                <Descriptions.Item label="账号">{this.state.userId}</Descriptions.Item>
                            </Descriptions>
                </div>

                <Modal
                    title="修改密码"
                    visible={this.state.changePasswordVisible}
                    onOk={this.updatePassword}
                    onCancel={()=>this.setState({changePasswordVisible:false})}
                    cancelText={'取消'}
                    okText={'确认'}
                >
                    <Space direction="vertical">
                        <Input
                            type={"password"}
                            size="small"
                            placeholder="原密码..."
                            stytle={{width:100}}
                            value={this.state.oldPassword}
                            prefix={<KeyOutlined />}
                            onChange={(e)=>this.setState({oldPassword:e.target.value})}
                        />
                        <Input
                            size="small"
                            placeholder="新密码..."
                            value={this.state.changedPassword}
                            prefix={<KeyOutlined />}
                            onChange={(e)=>this.setState({changedPassword:e.target.value})}
                        />
                        <Input
                            size="small"
                            placeholder="重复新密码..."
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
