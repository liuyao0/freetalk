import React from 'react';
import 'antd/dist/antd.css';
import '../index.css'
import {
    Input,
    Space,
    Image,
    Button,
    message
} from "antd";
import {
    KeyOutlined,
    UserOutlined,
    LoginOutlined,
} from "@ant-design/icons";
import logo from '../image/logo.png'
import {localhost} from "../App"
import {gotoUserManagementView} from "../utils/redirection";

export default class LogIn extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            userId:"",
            password:'',
            onRegister:false
        }
    }

    doLogin=()=>{
        let userId = parseInt(this.state.userId);
        let password = this.state.password;
        let inf = {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                administratorId: userId,
                password: password,
            }),
        };

        fetch('http://'+localhost+'/administratorLogin', inf)
            .then(response => response.json())
            .then(data => {
                if(data===true) {
                    message.success("登录成功！",1)
                    localStorage.setItem("adUserId",this.state.userId)
                    gotoUserManagementView()
                }
                else{
                    message.error("用户名或密码错误",1)
                }
            })
            .catch(function () {
                message.error('parsing failed', 1);
            });
    }


    render() {
        return(
            <Space direction="vertical">
                <Image
                    width={500}
                    src={logo}
                    preview={false}
                />
                <Input size="large"  placeholder="管理员账号..." value={this.state.userId} prefix={<UserOutlined />} onChange={(e)=>this.setState({userId:e.target.value})} />
                <Input size="large" type={"password"} placeholder="密码..." value={this.state.password} prefix={<KeyOutlined />} onChange={(e)=>this.setState({password:e.target.value})} />
                <Space>
                    <Button onClick={this.doLogin}  type="primary" shape="round" icon={<LoginOutlined />} size={'large'}>
                        管理员登录
                    </Button>
                </Space>

            </Space>
        );
    }

}

