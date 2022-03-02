import React from 'react';
import {ScrollView, View, NativeAppEventEmitter, ToastAndroid} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {PostingHead} from '../components/PostingHead';
import {Button, Text} from 'react-native-elements';
import {actions, RichEditor, RichToolbar} from 'react-native-pell-rich-editor';
import ImagePicker from 'react-native-image-crop-picker';
import {localhost} from "../../App";
import {changeHTMLToText} from '../components/MyTopic';

export function _enCoderUrl(str){
    let encodeStr = encodeURIComponent(str);   //不会对这些进行编码  - _ . ! ~ * ' ( )
    encodeStr = encodeStr.replace(/!/g,"%21");   //转换!
    encodeStr = encodeStr.replace(/\*/g,"%2A");  //转换*
    encodeStr = encodeStr.replace(/'/g,"%27");   //转换'
    encodeStr = encodeStr.replace(/\(/g,"%28");  //转换(
    encodeStr = encodeStr.replace(/\)/g,"%29");  //转换)
    encodeStr = encodeStr.replace(/\[/g,"%5B");   //转换[
    encodeStr = encodeStr.replace(/]/g,"5D");    //转换]
    return  encodeStr;
}

export const imageIllegalType=[
    '存在色情信息',
    '存在暴恐信息',
    '存在色情信息',
    '存在广告信息',
    '存在敏感政治人物',
    '存在敏感公众人物',
    '其他不合规信息',
    '存在不良旗帜标识',
    '存在不良场景',
]

export const textIllegalType=[
    '低质灌水',
    '暴恐违禁',
    '文本色情',
    '政治敏感',
    '恶意推广',
    '低俗辱骂',
    '恶意推广-联系方式',
    '恶意推广-软文推广',
    '不符合广告法审核'
]

export default class AnswerTopic extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            topicId:this.props.route.params.topicId,
            replyId:this.props.route.params.replyId,
            myUserId:0,
            titleValue: this.props.route.params.topicTitle,
            richText: React.createRef(),
            answerValue: '',

            legal:true,
            illegalMsg:0,
            imageLegal: true,
            imageIllegalMessage:0,
        };
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
        AsyncStorage.getItem('userid', (error, result) => {
            this.setState({
                myUserId:parseInt(result)
                })
        });
        AsyncStorage.getItem('token', (error, result) => {
            this.setState({
                token:result
            })
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
        });
    };



    renderHint=()=>{
        if (this.state.replyId!==0)
            return <View>
                <Text h4>{'回复: '+this.props.route.params.replierName}</Text>
            </View>
        else return <View/>
    }

    postAnswer(){
        let infToService={
            method:'post',
            headers:{
                "Content-Type":"application/json",
                'token':this.state.token,
                'userId':this.state.myUserId.toString(),
            },
            body:JSON.stringify({
                "content":this.state.answerValue,
                "replyId":this.state.replyId,
                "topicId":parseInt(this.state.topicId),
                "userId":this.state.myUserId,
            })
        }
        fetch("http://"+localhost+"/Security/addAComment",infToService)
            .then(()=>{
                ToastAndroid.show("回复发表成功:)",1)
                NativeAppEventEmitter.emit("TopicViewRefresh","refresh")
                this.props.navigation.goBack()
            }).catch((e)=>{
            ToastAndroid.show(("Network Error"))
        });

    }

    answerTopic() {
        // let tem;
        // let reg = /<img.+?src=('|")?([^'"]+)('|")?(?:\s+|>)/gim;
        // let imgsrcArr = [];
        // while (tem = reg.exec(this.state.answerValue)) {
        //     imgsrcArr.push(tem[2].replace(/^data:image\/\w+;base64,/, ""));
        // }
        if (this.state.answerValue===""){
            ToastAndroid.show("回复内容不能为空！",1)
            return
        }
        if(changeHTMLToText(this.state.answerValue)===''){
            this.postAnswer()
            return;
        }
        this.checkText(changeHTMLToText(this.state.answerValue)).then(r => {
                if (!this.state.legal)
                    ToastAndroid.showWithGravity('文本内容不合规！原因:'+this.state.illegalMsg,
                        1,ToastAndroid.TOP)
                else
                    this.postAnswer()
        })
    }

    render() {
        return (
            <View style={{padding: '2%'}}>
                <PostingHead
                    title={this.props.route.params.topicTitle}
                    onPressLeft={() => {
                        this.props.navigation.goBack();
                    }}
                />
                {this.renderHint()}
                <View
                    style={{
                        width: '100%',
                        height: 20,
                    }}
                />
                <View>
                    <ScrollView style={{container: true}}>
                        <RichEditor
                            ref={this.state.richText}
                            placeholder={this.state.placeholder}
                            onCursorPosition={this.handleCursorPosition}
                            pasteAsPlainText={true}
                            onChange={text => {
                                this.setState({
                                    answerValue: text,
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
                    </ScrollView>
                </View>
                <View
                    style={{
                        width: '100%',
                        height: 20,
                    }}
                />
                <View>
                    <Button
                        title="发布我的回答"
                        onPress={() => this.answerTopic()}
                        buttonStyle={{borderRadius: 100, backgroundColor: '#0bc7e5'}}
                    />
                </View>
            </View>
        );
    }
}
