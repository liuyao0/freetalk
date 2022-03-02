import React from "react";
import Modal from "antd/es/modal/Modal";
import Chat from "@chatui/core";
import '../css/chatui-theme.css'
import {localhost} from "../App";
import {message} from "antd";
import {renderMessageContent} from "./UserPrivateChat";

class PrivateChatModel extends React.Component{
    getMessageIntervalId=0;

    // getOtherUser=(item)=>{
    //     return (item.sendUser.userId===this.props.myUserId)?item.acceptUser:item.sendUser;
    // }

    getMeUser=(item)=>{
        return (item.sendUser.userId!==this.props.myUserId)?item.acceptUser:item.sendUser;
    }
    constructor(props) {
        super(props);
        this.state={
            myAvatar:"",
            chatUserAvatar:"",
            chatUsername:"",
            messages:[]
        }
    }

    componentDidMount() {
        fetch("http://"+localhost+"/getUserInfo?userId="+this.props.myUserId)
            .then(response=>response.json())
            .then(userData=>{
                this.setState({
                    myAvatar:userData.image
                })
            })

        fetch("http://"+localhost+"/getUserInfo?userId="+this.props.chatUserId)
            .then(response=>response.json())
            .then(userData=>{
                this.setState({
                    chatUserAvatar:userData.image,
                    chatUsername:userData.username
                })
            })
        setInterval(this.getMessage,300)
    }

    componentWillUnmount() {
        clearInterval(this.getMessageIntervalId)
    }

    getMessage=()=>{
        let messages=[];
        fetch('http://'+localhost+'/Security/getMessagesBetweenTwoUsers', {
            method: 'post',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
                'token':localStorage.getItem('key'),
                'userId':localStorage.getItem('userId')
            },
            body: 'me=' + this.props.myUserId + '&you=' + this.props.chatUserId,
        })
            .catch(function (e) {
                message.error('error:' + e,1);
            })
            .then(response => response.json())
            .then(data => {
                if(data.length===this.state.messages.length)
                    return;
                // eslint-disable-next-line array-callback-return
                data.map((item)=>{
                    if(item.sendId===this.props.myUserId)
                        messages.push({
                            type:'text',
                            content:{text:item.messageText},
                            user:{avatar:this.state.myAvatar},
                            position:'right',
                            _id:item.sendTime,
                        })
                    else
                        messages.push({
                            type:'text',
                            content:{text:item.messageText},
                            user:{avatar:this.state.chatUserAvatar},
                            position:'left',
                            _id:item.sendTime,
                        })
                })
                messages.reverse();
                this.setState({
                    messages:messages
                })
            })
    }
    renderChatForm=()=>{
        const handleSend=(type, val)=> {
            if (type === 'text' && val.trim()) {
                let inf = {
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/json',
                        'token':localStorage.getItem('key'),
                        'userId':localStorage.getItem('userId')
                    },
                    body: JSON.stringify({
                        sendUserId: this.props.myUserId,
                        receiveUserId: this.props.chatUserId,
                        messageContent: val,
                    }),
                };
                console.log(inf);
                fetch('http://' + localhost + '/Security/postAMessage', inf)
                    .catch(function (e) {
                        message.error('error:' + e, 1);
                    })
                    .then(response => response.json())
                    .catch(function (ex) {
                        console.log('parsing failed', ex);
                    });
            }
        }
            return(
                <Chat
                    navbar={{title: this.state.chatUsername}}
                    messages={this.state.messages}
                    renderMessageContent={renderMessageContent}
                    onSend={handleSend}
                />)
        }


    render=()=>{
        return(
            <Modal bodyStyle={{height:"600px",width:"800px"}} width={"800px"} title={"私信"} visible={this.props.isVisible} destroyOnClose={true} onCancel={this.props.closeModal} footer={null}>
                {this.renderChatForm()}
            </Modal>
        )
    }
}

export {PrivateChatModel}
