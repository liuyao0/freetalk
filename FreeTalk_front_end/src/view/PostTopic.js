import React from 'react';
import {
    ScrollView,
    Text,
    TextInput,
    View,
    NativeAppEventEmitter,
    ToastAndroid
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {PostingHead} from '../components/PostingHead';
import {Button} from 'react-native-elements';
import {actions, RichEditor, RichToolbar} from 'react-native-pell-rich-editor';
import ImagePicker from 'react-native-image-crop-picker';
import {localhost} from "../../App";
import {getDateTime} from '../components/Reply';
import {_enCoderUrl, imageIllegalType, textIllegalType} from "./AnswerTopic";
import {changeHTMLToText} from "../components/MyTopic";
import {error} from "react-native-gifted-chat/lib/utils";


export default class PostTopic extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            description:"",
            titleValue:"",
            richText: React.createRef(),
            myUserId:0,
            token:'',
            PostTopic:null,

            legal:true,
            illegalMsg:"",
            imageLegal: true,
            imageIllegalMessage:0,
        }
    }

    async checkImage(imageString){
        let image=_enCoderUrl(imageString)
        const res = await fetch('https://aip.baidubce.com/rest/2.0/solution/v1/img_censor/v2/user_defined?access_token=' +
            '24.627c4b480090851aea7e9214bb994e56.2592000.1631936238.282335-24709377', {
            method: 'post',
            headers: {
                "Access-Control-Allow-Origin":'*',
                'Access-Control-Allow-Credentials': 'true',
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body:
                "image="+image
            ,
        })
        const json=await res.json()
        if (json.conclusion==="不合规") {
            this.setState({
                imageLegal: false,
                imageIllegalMessage:json.conclusionType
            })
        }
        else
            this.setState({
                imageLegal:true
            })
    }

    async checkText(textString){
        const res = await fetch('https://aip.baidubce.com/rest/2.0/solution/v1/text_censor/v2/user_defined?access_token=' +
            '24.627c4b480090851aea7e9214bb994e56.2592000.1631936238.282335-24709377', {
            method: 'post',
            headers: {
                "Access-Control-Allow-Origin":'*',
                'Access-Control-Allow-Credentials': 'true',
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body:
                "text="+textString
            ,
        })
        const json=await res.json()
        if (json.conclusion==="合规"){
            this.setState({
                legal:true
            })
        }
        else {
            this.setState({
                legal:false,
                illegalMsg:json.data[0].msg
            })
        }
    }

    componentWillMount() {
        AsyncStorage.getItem('token', (error, result) => {
            this.setState({
                token:result
            })
        });
        AsyncStorage.getItem('userid', (error, result) => {
           this.setState({
               myUserId:parseInt(result)
           })
            fetch('http://'+localhost+'/checkBan', {
                method: 'post',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
                },
                body: 'userId='+this.state.myUserId,
            })
                .catch(function (e) {
                    ToastAndroid.show("error:" + e,1);
                })
                .then(response => response.json())
                .then(data => {
                    if(data!==null){
                        this.setState({
                            PostTopic:getDateTime(data.endTime),
                        });
                    }
                })
                .catch(function (ex) {
                    console.log('parsing failed', ex);
                });
        });
    }

    handleCursorPosition = () => {
        this.scrollRef.current.scrollTo({y: scro55llY - 30, animated: true});
    };

    onPressAddImage = () => {
        ImagePicker.openPicker({
            width: 200,
            height: 200,
            cropping: true,
            cropperCircleOverlay: false,
            includeBase64: true,
        }).then(image => {
            let imageBase64=`data:${image.mime};base64,${image.data}`
            this.checkImage(imageBase64.replace(/^data:image\/\w+;base64,/, ""))
                .then(() => {
                    if (!this.state.imageLegal)
                        ToastAndroid.show("此图片中有违规内容！原因:"+imageIllegalType[this.state.imageIllegalMessage-1], 1)
                    else
                        this.state.richText.current.insertImage(
                            imageBase64,
                        );
                    this.setState({
                        imageLegal:true
                    })
                })
            // this.state.richText.current.insertImage(
            //     `data:${image.mime};base64,${image.data}`,
            // );
        });
    };

    onChangeTitleText(text){
        this.setState({
            titleValue:text,
        })
    }

    legalPost=()=>{
        let newTopicInfo={
            method:'post',
            headers:{
                "Content-Type":"application/json",
                'token':this.state.token,
                'userId':this.state.myUserId.toString(),
            },
            body:JSON.stringify({
                "title":this.state.titleValue,
                "topic_description":this.state.description,
                "userId":this.state.myUserId
            })
        }
        fetch('http://'+localhost+'/Security/addATopic', newTopicInfo)
            .catch(function () {
                ToastAndroid.show("出错了，请再试一次:)",1 );
            })
        ToastAndroid.show("话题发表成功:)",1)
        this.props.navigation.goBack()
        NativeAppEventEmitter.emit("reFresh","ccc")
    }
    postTopic(){
        if (this.state.titleValue==="")
        ToastAndroid.show("话题标题不能为空！",1)
        if (this.state.description===""){
            ToastAndroid.show("话题描述不能为空！",1)
            return
        }
        if(changeHTMLToText(this.state.description)===''){
            this.legalPost()
            return;
        }
        this.checkText(changeHTMLToText(this.state.description)).then(r => {
            if (!this.state.legal)
                ToastAndroid.showWithGravity('文本内容不合规！原因:'+this.state.illegalMsg,
                    1,ToastAndroid.TOP)
            else
                this.legalPost()
        })
    }
    render() {
        return (
            <ScrollView
                style={{container:'true',backgroundColor:'white'}}>
                <PostingHead title={"首页"} navigation={this.props.navigation} onPressLeft={()=>{this.props.navigation.goBack();}}/>
                <View style={{backgroundColor:'white'}}>
                    <Text style={{paddingLeft:5, paddingRight:5, paddingTop:3,paddingBottom:3, fontSize:18}}>
                        话题标题
                    </Text>
                    <TextInput
                        style={{ height: 40,borderBottomWidth:1,borderTopWidth:1,borderColor:'#e3e3e3',fontSize:16}}
                        onChangeText={text => this.onChangeTitleText(text)}
                        value={this.state.titleValue}
                        placeholder="写标题..."
                    />
                </View>
                <View style={{marginTop:10}}>
                    <Text style={{paddingLeft:5, paddingRight:5, paddingTop:3,paddingBottom:3, fontSize:18}}>
                        话题描述
                    </Text>
                    <View style={{container: true,borderBottomWidth:1,borderTopWidth:1,borderColor:'#e3e3e3'}}>
                        <RichEditor
                            ref={this.state.richText}
                            placeholder={'写描述...'}
                            onCursorPosition={this.handleCursorPosition}
                            pasteAsPlainText={true}
                            onChange={text => {
                                this.setState({
                                    description: text,
                                });
                            }}
                        />
                        <RichToolbar
                            editor={this.state.richText}
                            onPressAddImage={this.onPressAddImage}
                            actions={[
                                actions.insertImage,
                                actions.setStrikethrough,
                                actions.blockquote,
                                actions.alignLeft,
                                actions.alignCenter,
                                actions.alignRight,
                                actions.code,
                                actions.line,
                                actions.foreColor,
                                actions.hiliteColor,
                                actions.heading1,
                                actions.heading4,
                                'insertEmoji',
                                'insertHTML',
                                'fontSize',
                            ]}
                        />
                    </View>
                </View>
                <View
                    style={{
                        width:'100%',
                        height:20
                    }}
                />
                <View>
                    <Button
                        title={this.ifBan()}
                        onPress={() => this.postTopic()}
                        buttonStyle={{backgroundColor:'#0088ff'}}
                        disabled={!(this.state.PostTopic===null)}
                    />
                </View>
            </ScrollView>
        );
    }
    ifBan=()=>{
        if(this.state.PostTopic===null)return '发布话题';
        else return '您已被禁言到'+this.state.PostTopic;
    }
}
