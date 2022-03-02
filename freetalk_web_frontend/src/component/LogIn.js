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
    PlusCircleOutlined
} from "@ant-design/icons";
import logo from '../image/logo.png'
import {RegisterForm} from "./RegisterForm";
import {localhost} from "../App"
import {gotoHotTopics} from "../utils/redirection";

export default class LogIn extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            userId:"",
            password:'',
            onRegister:false,
            key:"1"
        }

    }

    closeRegister=()=>{
        this.setState({
            onRegister:false
        })
    }

    doLogin=()=>{
        let userId = this.state.userId;
        let password = this.state.password;
        let inf = {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userid: userId,
                password: password,
            }),
        };

        fetch('http://'+localhost+'/login', inf)
            .then(response => response.json())
            .then(data => {
                if(data[0].length===0)
                {
                    message.error("用户名或密码错误",1)
                    return;
                }
                message.success("登录成功！",1)
                localStorage.setItem('userId',data[0])
                localStorage.setItem('key',data[2])
                gotoHotTopics()
            })
            .catch(function () {
                message.error('parsing failed', 1);
            });
    }


    render() {
        return(
            <Space direction="vertical">
                <RegisterForm closeRegister={this.closeRegister} onRegister={this.state.onRegister}/>
                <Image
                    width={500}
                    src={logo}
                    preview={false}
                />
                <Input size="large"  placeholder="账号..." value={this.state.userId} prefix={<UserOutlined />} onChange={(e)=>this.setState({userId:e.target.value})} />
                <Input size="large" type={"password"} placeholder="密码..." value={this.state.password} prefix={<KeyOutlined />} onChange={(e)=>this.setState({password:e.target.value})} />
                <Space>
                    <Button onClick={this.doLogin}  type="primary" shape="round" icon={<LoginOutlined />} size={'large'}>
                        登录
                    </Button>
                    <Button onClick={()=>{this.setState({onRegister:true})}} type="primary" shape="round" icon={<PlusCircleOutlined/>  } size={'large'}>
                        注册
                    </Button>
                </Space>
            </Space>
        );
    }

}

