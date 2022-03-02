import React from 'react';
import 'antd/dist/antd.css';
import {UserTopicAndComment} from "./UserTopicAndComment";
import {Space, Input, Table, message} from 'antd';

import {localhost} from "../App";

const { Search } = Input;

function ban(userId){
    fetch('http://'+localhost+'/banAUser?userId='+userId);
    message.success("已禁言账号为 "+userId+" 的用户",1);
    window.location.reload()
}

function unban(userId){
    fetch('http://'+localhost+'/unbanAUser?userId='+userId);
    message.success("已解除禁言账号为 "+userId+" 的用户",1);
    window.location.reload();
}

const columns = [
    { title: '用户名', dataIndex: 'username', key: 'username' },
    { title: '账号', dataIndex: 'userId', key: 'userId' },
    { title: '邮箱', dataIndex: 'email', key: 'email' },
    { title: '个人描述', dataIndex: 'description', key: 'description' },
    {
        title: '操作',
        dataIndex: '',
        key: 'x',
        render: (_,record) => {
            let userId=record.userId
            if(record.ban===0)
                return(<a onClick={()=>ban(userId)} >禁言</a>)
            else
                return (<a onClick={()=>unban(userId)}>解禁</a>)
        },
    },
];
export class UserManagement extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            data:[]
        }
    }
    componentDidMount() {
        fetch('http://'+localhost+'/findAllUserInfo', )
            .then(response => response.json())
            .then(data => {
                this.setState({
                    data: data,
                });
            })
            .catch(function (ex) {
                console.log('parsing failed', ex);
            });
    }

    searchByUserName(value){
        fetch('http://'+localhost+'/searchByUsername?username='+value, )
            .then(response => response.json())
            .then(data => {
                this.setState({
                    data: data,
                });
            })
            .catch(function (ex) {
                console.log('parsing failed', ex);
            });
    }

    searchByUserId(value){
        fetch('http://'+localhost+'/searchByUserId?userId='+value )
            .then(response => response.json())
            .then(data => {
                this.setState({
                    data: data,
                });
            })
            .catch(function (ex) {
                console.log('parsing failed', ex);
            });
    }

    render() {
        return(
            <div>
            <Space direction="vertical">
                <Search placeholder="使用用户名搜索" onSearch={(value)=>
                    this.searchByUserName(value)} onChange={(e)=>{
                        if (e.target.value==="")
                            this.componentDidMount()
                }} style={{ width: 1000 }} />
                <Search placeholder="使用用户账号搜索" allowClear onSearch={(value)=>
                    this.searchByUserId(value)} onChange={(e)=>{
                        if (e.target.value==="")
                            this.componentDidMount()
                }}
                        style={{ width: 1000 }} />
                <p/>
                <p/>
            </Space>

            <Table
                columns={columns}
                rowKey={'userId'}
                expandable={{
                    expandedRowRender: record => <UserTopicAndComment userId={record.userId}/>,
                    rowExpandable: record => true,
                }}
                dataSource={this.state.data}
            />
            </div>
        );
    }
}
