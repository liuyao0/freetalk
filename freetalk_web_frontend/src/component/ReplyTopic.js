import React from "react";
import {
    Drawer,
    Space,
    Button,
    Card,
    Avatar,
    message
} from 'antd';
import BraftEditor from "braft-editor";
import {localhost} from "../App";
import {getDateTime} from "../utils/functions";
const { Meta } = Card;

export class ReplyTopic extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            topicId:props.topicId,
            userId:props.myUserId,
            image:props.image,
            username:props.username,
            visible:props.visible,
            replyId:props.replyId,

            editorState: BraftEditor.createEditorState(''), // 设置编辑器初始内容
            outputHTML: '',
            ban:false,
            editorPlaceHolder:''
        }
    }

    componentWillMount() {
        fetch("http://"+localhost+"/checkBan?userId="+this.state.userId)
            .then(response=>response.json())
            .then((data)=>{
                if(data===null)
                    this.setState({
                        ban:false,
                        editorPlaceHolder:'写回复...'
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

    componentWillReceiveProps(nextProps) {
        this.setState({
            userId:nextProps.myUserId,
            ReplyUserId:nextProps.ReplyUserId,
            image:nextProps.image,
            username:nextProps.username,
            visible:nextProps.visible,
            replyId:nextProps.replyId,
        })
    }

    reply=()=>{
        if (this.state.outputHTML===""){
            message.error("回复内容不能为空！",1)
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
                "content":this.state.outputHTML,
                "replyId":this.state.replyId,
                "topicId":this.state.topicId,
                "userId":this.state.userId,
            })
        }
        fetch("http://"+localhost+"/Security/addAComment",infToService)
            .then(()=>{
                message.success("回复发表成功:)",1)
                this.setState({
                    visible: false,
                });
                this.props.setVisibleFalse()
                window.location.reload()
            })
    }

    render() {
        return (
            <Drawer
                title={"回复" + this.state.username}
                width={720}
                onClose={()=>{
                    this.setState({
                        visible: false,
                    });
                    this.props.setVisibleFalse()
                }}
                visible={this.state.visible}
                bodyStyle={{ paddingBottom: 80 }}
                footer={
                    <div
                        style={{
                            textAlign: 'right',
                        }}
                    >
                        <Button onClick={()=>{
                            this.setState({
                                visible: false,
                            });
                            this.props.setVisibleFalse()
                        }
                        } style={{ marginRight: 8 }}>
                            取消回复
                        </Button>
                        <Button
                            onClick={this.reply}
                            type="primary"
                            disabled={this.state.ban}
                        >
                            提交回复
                        </Button>
                    </div>
                }
            >
                <Space direction="vertical">
                    <Card style={{ width: 300, marginTop: 16 }}>
                        <Meta
                            avatar={
                                <Avatar src={this.state.image} />
                            }
                            title={this.state.username}
                            description="您正在回复TA"
                        />
                    </Card>
                    <BraftEditor
                        value={this.state.editorState}
                        onChange={this.handleChange}
                        readOnly={this.state.ban}

                        placeholder={this.state.editorPlaceHolder}
                    />
                </Space>
            </Drawer>

        );
    }
}
