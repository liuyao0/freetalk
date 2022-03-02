import React from "react"
import '../css/register.css'
import {localhost} from "../App";
import {
    Button, Input,
    message,
    Space,
    Upload
} from "antd";
import {
    getBase64,
    beforeUpload
} from "./SelfCenter";
import {
    LoadingOutlined,
    LoginOutlined,
    CloseOutlined,
    PlusOutlined,
    UserOutlined,
    KeyOutlined,
    MailOutlined
} from "@ant-design/icons";

class RegisterForm extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            username:"",
            password:"",
            againPassword:"",
            email:"",
            usernameExist:false,
            passwordEqual:true,
            emailValid:true,
            changedImage:'data:image/jpg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAGQAZADASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD7Tooor9APmgooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKlooAioqWigCKipaKAIqKlooAioqWigCKipaKAIqKlooAioqWigCKipaKAIqKlooAioqWigCKipaKAIqKlooAioqWigCKipaKAIqKlooAioqWigCKipaKAIqKlooAioqWigCKipaKAIqKlooAioqWigCKipaKAIqKlooAKKKKACk9qWigAooooAKKKKAE9qWiigAooooAKT2paKACiiigAooooAT2paKKACiiigApPalooAKKKKACiiigBPaloooAKKKKACk9qWigAooooAKKKKAE9qWiigAooooAKT2paKACiiigAooooAT2paKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKVwCiiii4BRRRRcAoooouAUUUUXAKKKKLgFFFFFwCiiii4BRRRRcAoooouAUUUUXAKKKKLgFFFJg46UriFooop3GFFFFFwCiiii4BRRRRcAoooouAUUUUXAKKKKLgFFFFFwCiiii4BRRRRcAoooouAUUUUXAKKKKzAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooqWztJr64EFvG0srdFUUOyV2G+iIqv6XoF/rDf6Lbs6d5Dwo/E122gfD6C0Czaji4m6+UPuL9fWuxjjESBEUKoGAAMAV4tfM4xfLRV/Pod9PCOWs9DhtO+GSgBr27JPdIBj9T/AIV0Np4O0e0A22SSH1ly/wDOt2ivHqYqtU+KX6HfGhThsitDYW0AxFbxRj/YQCptieg/Kn0Vzavdm1kVpbC2uFxJbxSD/bQGsu78G6Pdg7rJEJ7xZT+VbtFXGc4O8ZNEuEZbo4HUfhkpDNY3ZB7RzjP6j/CuR1PQL/SGP2q3ZE6CQcqfxFe2VFJGsyMjqGVhgqwyDXoUsxrU9J+8vxOSeEhL4dDwmivRde+H0F0Hm07FvN1MR+4309P5V5/d2k9jO8FxG0Uq9VYV71DE08QvcevbqebUpSpP3iKiiiuoyCiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooATb9aNv1qSigCPb9aNv1qSigCPb9aNv1qSigCPb9aNv1qSigCPb9aNv1qSigCPb9aNv1qSigCPb9aNv1qSigCPb9aNv1qSigCPb9aNv1qSpLG0mv7qK2hXfLIcAUm0ldhu7Im0fRrnWbtbe3XJ6s56KPU16toHh210G38uFd0jD55WHzMf6D2pfD+gwaDYrDH8znmSTHLH/CtevlsXi3iHyx+H8z2aFBU1d7hRRRXnHYFFFFABRRRQAUUUUAFFFFABWPrvh21122Mcy7ZR9yVeqn/AA9q2KKqMpQalF2ZMoqSszxHV9GuNGu2t7hcEcq46MPUVR2/WvZdf0GHXbFoJMLIOY5O6n/CvI72ylsLmW3nXZLGcEV9Vg8UsTG0viR4lei6T02K2360bfrUlFd5zke360bfrUlFAEe360bfrUlFAEe360bfrUlFAEe360bfrUlFAEe360bfrUlFAEe360bfrUlFAEe360bfrUlFADKfRRQAUyn0UAFMp9FABRRRQAyn0UUAMp9FFABTKfRQAUyn0UAMr0j4f6ALKyN/Mv7+cfJkfdT/AOvXF+HNLOr6tBbEfu87pD/sjr/h+NexxqqKFUAKBgAdq8XMq/KlRj13O/CU7vnY8DFLRRXzx6wUUUUAFFFFABRRRQAUUUUAFFFFABRRRQA3BrjvH3h8Xtl9vhX9/APnx1ZP/rf412dRuodSrAEEYIPetaVV0ZqcehnOCqRcWeF0ytTxFpR0fV7i2x+7B3R/7p6f4fhWdX2cJKcVJbM+facXZhRRRViGU+iigBlPoooAKZT6KACmU+igAooooAZT6KKACiiigNQooooDUKKKKA1CiiigNQooooDUKKKKA1CiiigNQooplAanoPw000Jb3N6w+Z2ESn2HJ/XH5V3VYvhK1Fn4esUxgtHvP1Y5/rW1XxmIqe0rSl5nvUY8lNIKKKK5zcKKKKACiiigAooooAKKKKACiiigAooooAKKKKAOF+JdgHt7a9UfMjeUx9jyP5H864GvXvFlp9r8P3qYyVTeP+A8/wBK8hr6bLanNR5X0Z42Kjad11CiiivVOPUKKKKA1CiiigNQooooDUKKKKA1CiiigNQooooDUKKKKACiiigAooooAKKKKACiiigAooooAKKKKACmgZp1Iv3h9aAPcLOEQ2sEY6Kir+QqzUcf3R9BUlfCbn0iCiiigYUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAVrqLz7aeLqHQr+YNeIV7sOhrwmveyr7a9DzcYrcoUUUV7p5gUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFIv3h9aWkX7w+tHQaPdY/uD6CpKjj+4PoKkr4M+jQUUUUxhRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQA0dDXhNe7Doa8Jr3sr+38v1PNxn2Qooor3TzAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKQDFLRQB7haP5ltC46Min9KsVj+FrkXegWEmc/ugh+q8f0rYr4aS5ZOPY+ig7xTCiiipLCiiigAooooAKKKKACiiigAooooAKKKKACiiigCvdOIbeaTsqFvyBrw+vYPE9z9l0G/kzj90VH1PH9a8fr38rjaM5HlYt6xQUUUV7h54UUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFID0b4a3om024tSfmhk3Af7Lf8A1wa7KvJvA2pfYNcjRjiO4HlH6np+v869XHWvlMdT9nXb6PU9vDS5qa8h1FFFcB1BRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQBxvxIvvJ0uG2Bw00mSP9lf8A65Fec10PjvURfa5IitmO3HlD69/14/Cuer63BU/Z0Ip9dTwsRLmqMKKKK7jnCiiigAooooAKKKKACiiigAooooAKKKKAE20baWigBNtG2looATbRtpaKAE20baWigBNtG2looATbRtpaKAE20baWigBNtG2looAEZo2DKSGByD6V7J4e1VdY0qC5BG8ja4HZh1rxuup8Ba5/Z+oG0lbEFyQBnor9vz6flXl4+h7WnzR3X5HXhqnJOz2Z6fRTR1p1fMHtBRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABWZrmqLpGmT3TY3KuEB7segrTrzPx/rn229FlE2Ybc/Pju//ANb/ABrqw1H29VR6dTCtU9nC5ykjtI7OxLMxySe5pu2lor7BKx4O4m2jbS0UwE20baWigBNtG2looATbRtpaKAE20baWigBNtG2looATbRtpaKACiiigAooooAKKKKACiiigAooooAKKKKACiiig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'
        }
    }

    userNameChange=(e)=>{
        let username=e.target.value;
        this.setState({username:username})
    }

    handlePasswordEqual=(password,againPassword)=>
    {
        if(password===againPassword||againPassword.length===0)
        {
            this.setState({
                passwordEqual: true
            })
            return;
        }
        this.setState({
            passwordEqual: false
        })
    }

    passwordChange=(e)=>{
        let password=e.target.value;
        this.setState({password:password})
        this.handlePasswordEqual(password,this.state.againPassword)
    }
    againPasswordChange=(e)=>{
        let againPassword=e.target.value
        this.setState({againPassword:againPassword})
        this.handlePasswordEqual(this.state.password,againPassword)
    }
    emailChange=(e)=>{
        let email=e.target.value
        let myreg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/
        if(myreg.test(email)||email.length===0)
        {
            this.setState({
                email:email,
                emailValid:true
            })
        }
        else
        {
            this.setState({
                email:email,
                emailValid:false
            })
        }
    }

    handleRegister=()=>{
        if(this.state.username.length===0)
        {
            message.warning("请输入用户名！",1)
            return;
        }

        if(this.state.password.length===0)
        {
            message.warning("请输入密码！",1)
            return;
        }

        if(this.state.againPassword.length===0)
        {
            message.warning("请输入重复密码！",1)
            return;
        }

        if(this.state.email.length===0)
        {
            message.warning("请输入邮箱！",1)
            return;
        }
        if(!this.state.passwordEqual)
        {
            message.warning("两次输入的密码不一致！",1)
            return;
        }

        if(!this.state.emailValid)
        {
            message.warning("邮箱格式不正确！",1)
            return;
        }

        let username = this.state.username;
        let password = this.state.password;
        let email = this.state.email;
        let avatar= this.state.changedImage;
        let inf = {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                password: password,
                email: email,
                avatar:avatar
            }),

        };

        fetch('http://' + localhost + '/register', inf)
            .then(response => response.json())
            .then(data => {
                message.success(("请牢记你的id：" + data),5);
            })
            .catch(function (ex) {
                console.log('parsing failed', ex);
            });
        this.props.closeRegister();
    }

    handleAvatarChange = info => {
        getBase64(info.file.originFileObj, imageUrl =>{
                this.setState({
                    changedImage:imageUrl,
                    loading: false,
                })
            },
        );
    };

    render=()=>{
        const uploadButton = (
            <div>
                {this.state.loading ? <LoadingOutlined /> : <PlusOutlined />}
                <div style={{ marginTop: 8 }}>Upload</div>
            </div>
        );
        return(
            <div style={{textAlign:"left"}} id="register-holder" className={this.props.onRegister?'appear':'disappear'}>
                <Space id="register-form" direction="vertical">
                    <p id="reg-title">注册</p>
                    <div className="input-control">
                        <Input
                            value={this.state.username}
                            onChange={this.userNameChange}
                            size="large"
                            placeholder="用户名..."
                            prefix={<UserOutlined />}
                            style={{width:'250px'}}
                        />
                    </div>
                    <div className="input-control">
                        <Input
                            value={this.state.password}
                            onChange={this.passwordChange}
                            size="large"
                            type={"password"}
                            placeholder="密码..."
                            prefix={<KeyOutlined />}
                            style={{width:'250px'}}
                            id="reg-password3"/>
                    </div>
                    <div className="input-control">
                          <Input
                            value={this.state.againPassword}
                            onChange={this.againPasswordChange}
                            size="large"
                            type={"password"}
                            placeholder="确认密码..."
                            prefix={<KeyOutlined />}
                            style={{width:'250px'}}
                            id="reg-password2"/>
                    </div>
                    <div className="input-control">
                         <Input
                            value={this.state.email}
                            onChange={this.emailChange}
                            size="large"
                            type={"email"}
                            placeholder="邮箱..."
                            prefix={<MailOutlined />}
                            style={{width:'250px'}}
                         />
                    </div>
                    <div
                        style={{
                            textAlign:"center"
                        }}
                    >

                            <Upload
                                name="avatar"
                                listType="picture-card"
                                className="avatar-uploader"
                                showUploadList={false}
                                beforeUpload={beforeUpload}
                                onChange={this.handleAvatarChange}
                            >
                                {this.state.changedImage ? <img src={this.state.changedImage} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
                            </Upload>
                    </div>

                    <div className="register-button-box-holder">
                        <div className="register-button-box">
                            <Space>
                                <Button onClick={this.handleRegister}  type="primary" shape="round" icon={<LoginOutlined />} size={'large'}>
                                    注册
                                </Button>
                                <Button onClick={this.props.closeRegister} type="primary" shape="round" icon={<CloseOutlined />  } size={'large'}>
                                    取消
                                </Button>
                            </Space>
                        </div>
                    </div>

                </Space>
            </div>
        );
    }
}

export {RegisterForm}
