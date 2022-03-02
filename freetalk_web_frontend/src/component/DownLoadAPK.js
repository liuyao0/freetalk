import React from 'react'
import {
    Button,
    Space,
    message,
    Image,
    List,
    Avatar,
    Popover
} from 'antd';
import mobileLogo from '../image/mobile_logo.png'
import {localhost} from "../App";
import { CloudDownloadOutlined } from '@ant-design/icons';
import Text from "antd/lib/typography/Text";
import hjk from "../image/hjk.jpg"
import gy from "../image/gy.png"
import ly from "../image/ly.jpg"
import qyc from "../image/qyc.jpg"

const data = [
    {
        title: 'He Jingkai',
        description:"增加扫码登陆功能(2021.8.22)",
        image:hjk
    },
    {
        title: 'Ge Yu',
        description:"增加内容合法性审查(2021.8.20)",
        image:gy
    },
];

export class DownLoadAPK extends React.Component {


    render () {
        return (
            <Space direction="vertical">
                    <Text>
                        目前我们仅开发了Android端应用，您可以在此处下载最新的apk安装包
                    </Text>
                <Image src={mobileLogo} size={'large'} preview={false}/>
                    <Button
                        type="primary"
                        shape="round"
                        icon={<CloudDownloadOutlined />}
                        onClick={()=>{
                            message.success('开始下载',1);
                            window.location.href=("http://"+localhost+"/download")
                        }}
                    >
                        下载Android APK
                    </Button>
                <Space>
                    <Popover content={(
                        <div>
                            <p>He Jingkai</p>
                        </div>
                    )} title="开发者">
                        <Avatar src={hjk}/>
                    </Popover>
                    <Popover content={(
                        <div>
                            <p>Ge Yu</p>
                        </div>
                    )} title="开发者">
                        <Avatar src={gy}/>
                    </Popover>
                    <Popover content={(
                        <div>
                            <p>Liu Yao</p>
                        </div>
                    )} title="开发者">
                        <Avatar src={ly}/>
                    </Popover>
                    <Popover content={(
                        <div>
                            <p>Qian Yuchen</p>
                        </div>
                    )} title="开发者">
                            <Avatar src={qyc}/>
                    </Popover>
                </Space>
                <List
                    itemLayout="horizontal"
                    dataSource={data}
                    header={<div>更新记录</div>}
                    renderItem={item => (
                        <List.Item>
                            <List.Item.Meta
                                avatar={<Avatar src={item.image} />}
                                title={
                                    <div style={{fontWeight:'bold',textAlign:'left'}}>{item.title}</div>

                                }
                                description={
                                    <div style={{background:"white",textAlign: 'left'}}>{item.description}</div>
                                }
                            />
                        </List.Item>
                    )}
                />
            </Space>
        )
    }
}
