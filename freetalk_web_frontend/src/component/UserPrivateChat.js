import React from 'react';
import '@chatui/core/es/styles/index.less';
import '@chatui/core/dist/index.css';
import Chat, {Bubble} from '@chatui/core';
import {
    Avatar,
    Badge,
    List,
    message
} from "antd";
import Text from "antd/es/typography/Text";
import {localhost} from "../App";
import '../css/chatui-theme.css'
import {getDateTime} from "../utils/functions";


export function renderMessageContent(msg) {
    const {type, content, _id} = msg;
    let date=new Date(_id);
    switch (type) {
        case 'text':
            return <Bubble color={"#178FFE"} type={'text'}>
                <div style={{
                    textAlign:"left",
                }}>
                    <p
                    >
                        {content.text}
                    </p>
                    <div
                        style={{
                            color:"#888",
                            fontSize:"9px"
                        }}
                    >{getDateTime(date)}</div>
                </div>
            </Bubble>;
        case 'image':
            return (
                <Bubble type="image">
                    <img src={content.picUrl} alt=""/>
                </Bubble>
            );
        default:
            return null;
    }
}

let defaultMessageTime=new Date(2021,8,2,2,2,11,222);

class DialogCard extends React.Component{
    // eslint-disable-next-line no-useless-constructor
    constructor(props) {
        super(props);
    }



    static defaultProps={
        avatar:'https://i0.hdslb.com/bfs/face/cb49e8804447945761979822437f76a9eabce318.jpg',
        userName:"hyy",
        messageNotReadNum:0,
        messageContent:"以后有机会去上海找你玩呀！",
        messageTime:defaultMessageTime
    }



    renderTime=()=>{
        let messageTime=this.props.messageTime;
        let currentTime=new Date();
        if(messageTime.getFullYear()<currentTime.getFullYear())
            return(messageTime.getFullYear()+"-"+(messageTime.getMonth()+1)+"-"+messageTime.getDate())
        if(messageTime.getMonth()<currentTime.getMonth())
            return ((messageTime.getMonth()+1)+"-"+messageTime.getDate());
        if(messageTime.getDate()<currentTime.getDate())
            return ((messageTime.getMonth()+1)+"-"+messageTime.getDate());
        return ((messageTime.getHours()<10?"0":"")+messageTime.getHours()+":"+(messageTime.getMinutes()<10?"0":"")+(messageTime.getMinutes()));
    }

    renderRedDot=()=>{
        return <Badge
            count={this.props.messageNotReadNum}
            overflowCount={99}
        />
    }

    render=()=>{
        return(
            <button
                style={{
                    width:'300px',
                    height:'60px',
                    border:'0px',
                    background:'white',
                    padding:0,
                    display:"flex"
                }}
                onClick={()=>{this.props.buttonClick(this.props.index)}}
            >
                <div
                    style={{
                        height:'100%',
                        width:'60px',
                        paddingTop:'6px',
                        paddingBottom:'5px',
                    }}
                >
                    <Avatar
                        src={this.props.avatar}
                        size={48}
                    />
                </div>
                <div
                    style={{
                        height:"100%",
                        flexGrow:1,
                        paddingTop:'6px',
                        paddingBottom:'5px',
                        textAlign:'left',
                        overflow:"hidden"
                    }}
                >
                    <Text style={{width:"100%",fontSize:'18px'}} ellipsis={{width:"100%",symbol:'more'}}>{this.props.userName}</Text>
                    <Text style={{width:"100%",fontSize:'14px',color:"#777"}} ellipsis={{width:"100%",symbol:'more'}}>{this.props.messageContent}</Text>
                </div>
                <div
                    style={{
                        height:"100%",
                        width:"80px",
                        display:"flex",
                        flexDirection:"column",
                        justifyContent:"space-around"
                    }}
                >
                    <div
                        style={{
                            fontSize:"10px",
                            color:"#777",
                            textAlign:"right"
                        }}
                    >
                        {this.renderTime()}
                    </div>
                    <div style={{
                        width:"100%",
                        textAlign:"right"
                    }}>
                        {this.renderRedDot()}
                    </div>
                </div>

            </button>
        )
    }
}

class UserPrivateChat extends React.Component{
    getMessageIntervalId=0;
    getNewDataIntervalId=0;

    getOtherUser=(item)=>{
        return (item.sendUser.userId===this.props.myUserId)?item.acceptUser:item.sendUser;
    }

    getMeUser=(item)=>{
        return (item.sendUser.userId!==this.props.myUserId)?item.acceptUser:item.sendUser;
    }

    getDataAndNumber=()=>{
        fetch('http://'+localhost+'/Security/getAllUsersHasChattedWithAUser', {
            method: 'post',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
                'token':localStorage.getItem('key'),
                'userId':localStorage.getItem('userId')
                },
            body: 'userId=' +this.props.myUserId
        })
            .then(response => response.json())
            .then(data => {
                this.setState({
                    data: data,
                });
            })
            .catch(function (ex) {
                console.log('parsing failed', ex);
            }).then(()=>{
            this.getMessageIntervalId=setInterval(this.getMessagePeriodically,300)
            this.getNewDataIntervalId=setInterval(this.getNewData,300)
        })

        fetch('http://'+localhost+'/Security/numberOfMessagesUnreadWithAUser', {
            method: 'post',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
                'token':localStorage.getItem('key'),
                'userId':localStorage.getItem('userId')
            },
            body: 'acceptUserId=' + this.props.myUserId,
        })
            .then(response => response.json())
            .then(data => {
                this.setState({
                    number: data,
                });
            })
            .catch(function (ex) {
                console.log('parsing failed', ex);
            });
    }

    componentWillUnmount() {
        clearInterval(this.getNewDataIntervalId)
        clearInterval(this.getMessageIntervalId)
    }

    getMessage=(chatUser,forceJumpToTheEnd)=>{
        let messages=[];
        let dataLength=0;
        fetch('http://'+localhost+'/Security/getMessagesBetweenTwoUsers', {
            method: 'post',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
                'token':localStorage.getItem('key'),
                'userId':localStorage.getItem('userId')
            },
            body: 'me=' + this.props.myUserId + '&you=' + chatUser.userId,
        })
            .catch(function (e) {
                message.error('error:' + e,1000);
            })
            .then(response => response.json())
            .then(data => {
                dataLength=data.length;
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
                            user:{avatar:chatUser.image},
                            position:'left',
                            _id:item.sendTime,
                        })
                })
                messages.reverse()
            }).then(()=>{
            if(forceJumpToTheEnd||(this.state.messages.length!==dataLength)) {
                this.setState({
                    messages: messages,
                })
            }
        })
            .catch(function (ex) {
                console.log('parsing failed', ex);
            });
    }


    getNewData=()=>{

        let newData=[]
        let newNumber=[]
        fetch('http://'+localhost+'/Security/getAllUsersHasChattedWithAUser', {
            method: 'post',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
                'token':localStorage.getItem('key'),
                'userId':localStorage.getItem('userId')
            },
            body: 'userId=' +this.props.myUserId
        })
            .then(response => response.json())
            .then(data => {
                newData=data;
            }).then(()=>{
            fetch('http://'+localhost+'/Security/numberOfMessagesUnreadWithAUser', {
                method: 'post',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
                    'token':localStorage.getItem('key'),
                    'userId':localStorage.getItem('userId')
                },
                body: 'acceptUserId=' + this.props.myUserId,
            })
                .then(response => response.json())
                .then((data) => {
                    newNumber=data
                    let chatUser=this.state.chatUser;
                    let index=-1;
                    if(chatUser!==null)
                    {
                        // eslint-disable-next-line array-callback-return
                        newData.map((item,idx)=>{
                            if(this.getOtherUser(item).userId===chatUser.userId)
                                index=idx
                        })
                        newNumber[index]=0;
                    }
                    this.setState({
                        number:newNumber,
                        data:newData,
                    })
                })
        })
    }

    getMessagePeriodically=()=>{
        if(this.state.chatUser===null)
            return;
        this.getMessage(this.state.chatUser,false);
    }

    static defaultProps={
        myUserId:1,
    }

    constructor(props) {
        super(props);
        this.state={
            data:[],
            number:[],
            index:-1,
            messages:[],
            chatUser:null,
            myAvatar:null,
        }

    };

    componentDidMount() {
        fetch("http://"+localhost+"/getUserInfo?userId="+this.props.myUserId)
            .then(response=>response.json())
            .then(userData=>{
                this.setState({
                    myAvatar:userData.image
                })
            })
        this.getDataAndNumber();
    }

    renderChatForm=()=>{
        if(this.state.chatUser&&!this.state.waitForInitLoad)
        {
            const handleSend=(type, val)=>{
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
                            receiveUserId: this.state.chatUser.userId,
                            messageContent: val,
                        }),
                    };

                    fetch('http://' + localhost + '/Security/postAMessage', inf)
                        .catch(function (e) {
                            message.error('error:' + e,1);
                        })
                        .then(response => response.json())
                        .catch(function (ex) {
                            console.log('parsing failed', ex);
                        });

                    //let messages = this.state.messages;
                    // messages.push({
                    //     type: 'text',
                    //     content: {text: val},
                    //     user: {avatar: this.state.myAvatar},
                    //     position: 'right',
                    // })
                    // this.setState({messages: messages})
                }
            }



            return(
                <div
                    style={{
                        flexGrow:1,
                        overflow:"hidden"
                    }}
                >
                    <Chat
                        navbar={{title: this.state.chatUser.username}}
                        messages={this.state.messages}
                        renderMessageContent={renderMessageContent}
                        onSend={handleSend}
                    />
                </div>
            )
        }
        return <div
            style={{
                background:"#f2f4f5",
                flexGrow:1,
                overflow:"hidden"
            }}
        />
    }

    switchDialog=(index)=>{
        this.setState({
            messages:[]
        })
        let number=this.state.number;
        let chatUser=this.getOtherUser(this.state.data[index])
        number[index]=0;
        fetch('http://'+localhost+'/Security/setAllMessageWithAUserHaveRead', {
            method: 'post',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
                'token':localStorage.getItem('key'),
                'userId':localStorage.getItem('userId')
            },
            body:
                'acceptUserId=' +
                this.props.myUserId +
                '&sentUserId=' +
                chatUser.userId
        })
            .then(response => response.json())
            .catch(function (ex) {
                console.log('parsing failed', ex);
            });
        this.setState({
            index:index,
            number:number,
            chatUser:chatUser
        })
        this.getMessage(chatUser,true)
    }

    renderMessageTag=()=>{
        return(
            <List
                style={{
                    width:"300px",
                    borderRight:"1px solid #e9e9e9",
                    borderRadius:"4px"
                }}
                rowKey={(item)=>item.messageId}
                itemLayout="horizontal"
                dataSource={this.state.data}
                renderItem={(item,index) => {
                    let user=(item.sendUser.userId===this.props.myUserId)?item.acceptUser:item.sendUser;
                    let messageTime=new Date(item.sendTime);
                    return(
                        <List.Item
                            style={{padding:5}}
                        >
                            <DialogCard
                                avatar={user.image}
                                userId={user.userId}
                                userName={user.username}
                                messageNotReadNum={this.state.number[index]}
                                messageTime={messageTime}
                                messageContent={item.messageText}
                                index={index}
                                buttonClick={this.switchDialog}
                            />
                        </List.Item>
                    )
                }}
            />
        )
    }

    render=()=>{
        return (
            <div
                style={{
                    display:"flex",
                    flexDirection:"row",
                    width:"900px",
                    height:"600px",
                    border:"1px solid #e9e9e9",
                    borderRadius:"4px"
                }}
            >
                {this.renderMessageTag()}
                {this.renderChatForm()}
            </div>
        );
    }

}

export {UserPrivateChat}
