import React from "react";
import {localhost} from "../App";
import {message, Space} from "antd";
import { Steps } from 'antd';
import { MobileTwoTone, CameraTwoTone, SafetyCertificateTwoTone, SmileOutlined } from '@ant-design/icons';
import {gotoHotTopics} from "../utils/redirection";

const { Step } = Steps;
var QRCode = require('qrcode.react');

export default class QrLogIn extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            codeString:"0",
            codeId:0
        }
    }

    checkLogIn=()=>{
        fetch('http://'+localhost+'/checkLogin?codeId='+this.state.codeId)
            .then(response => response.json())
            .then(data => {
                if(data[0]==="0")
                    return
                message.success("登录成功！",1)
                localStorage.setItem('userId',data[0])
                localStorage.setItem('key',data[2])
                gotoHotTopics()
            })
            .catch(function () {
                message.error('parsing failed', 1);
            });
    }

    componentDidMount() {
        fetch('http://'+localhost+'/computerRequestAQrCode')
            .then(response => response.json())
            .then(data => {
                let a=data.codeId
                this.setState({
                    codeString:a.toString(),
                    codeId:a,
                })
            })
            .catch(function () {
                message.error('parsing failed', 1);
            });
        this.interval = setInterval(() => this.checkLogIn(), 1000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }


    render() {
        return(
            <Space direction="vertical">
                <Steps direction="vertical">
                    <Step status="finish" title="打开移动端个人中心,点击扫码图标" icon={<MobileTwoTone />} />
                    <Step status="finish" title="使用手机扫描下方二维码" icon={<CameraTwoTone />} />
                    <Step status="finish" title="点击确认登陆" icon={<SafetyCertificateTwoTone />} />
                    <Step status="finish" title="登陆成功" icon={<SmileOutlined />} />
                </Steps>
                <QRCode value={this.state.codeString} />
            </Space>

        );
    }

}
