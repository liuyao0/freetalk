import 'braft-editor/dist/index.css'
import React from 'react'
import BraftEditor from 'braft-editor'
import {
    Button,
    Space,
    message,
    Input
} from 'antd';
import {PlusOutlined} from "@ant-design/icons";
import {localhost} from "../App";
import {gotoHotTopics} from "../utils/redirection";
import {getDateTime} from "../utils/functions";

export class PostNewTopic extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            userId:props.userId,
            editorState: BraftEditor.createEditorState(''), // 设置编辑器初始内容
            outputHTML: '',
            title:'',
            ban:false,
            editorPlaceHolder:'',

            legal:true,
            illegalMsg:""
        }
    }

    componentWillMount() {
        fetch("http://"+localhost+"/checkBan?userId="+this.state.userId)
            .then(response=>response.json())
            .then((data)=>{
                if(data===null)
                    this.setState({
                        ban:false,
                        editorPlaceHolder:'写描述...'
                    })
                else
                    this.setState({
                        ban:true,
                        editorPlaceHolder:'您已被禁言，禁言时间到 '+getDateTime(data.endTime)
                    })
            })
    }

    handleChange = (editorState) => {
        this.setState({
            editorState: editorState,
            outputHTML: editorState.toHTML()
        })
    }


    postTopic=()=>{
        if (this.state.title===""){
            message.error("话题标题不能为空！",1)
            return
        }
        if (this.state.outputHTML===""){
            message.error("话题描述不能为空！",1)
            return
        }
        let newTopicInfo={
            method:'post',
            headers:{
                "Content-Type":"application/json",
                'token':localStorage.getItem('key'),
                'userId':localStorage.getItem('userId')
            },
            body:JSON.stringify({
                "title":this.state.title,
                "topic_description":this.state.outputHTML,
                "userId":this.state.userId
            })
        }
        fetch('http://'+localhost+'/Security/addATopic', newTopicInfo)
            .catch(function () {
                message.error("出错了，请再试一次:)",1);
            })
        message.success("话题发表成功:)",1)
        setTimeout(gotoHotTopics,1000)
    }

    render () {
        return (
            <Space direction="vertical">
                <Space>
                    <Input placeholder={this.state.editorPlaceHolder} disabled={this.state.ban} style={{ width: 1000 }} onChange={(e)=>this.setState({title:e.target.value})}/>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={this.postTopic}
                        disabled={this.state.ban}
                    >
                        发布话题
                    </Button>
                </Space>
                <div className="editor-wrapper">
                    <BraftEditor
                        value={this.state.editorState}
                        onChange={this.handleChange}
                        placeholder={this.state.editorPlaceHolder}
                        readOnly={this.state.ban}
                    />
                </div>
            </Space>
        )
    }
}
