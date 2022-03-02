import React from 'react';
import {GiftedChat, Bubble, Send} from 'react-native-gifted-chat';
import 'dayjs/locale/zh-cn';
import {View, Text, StyleSheet, SafeAreaView} from 'react-native';
import {PostingHead} from '../components/PostingHead';
import {localhost} from '../../App';

let picUri =
  'https://c-ssl.duitang.com/uploads/item/201707/10/20170710140458_ZiYXU.thumb.1000_0.jpeg';

export default class ChatPrivate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userid: this.props.route.params.userId,
      chatUserId: this.props.route.params.chatId,
      User: false,
      GetFirst: false,
      Message: false,
      setUser: false,
      data: [],
      you: {
        _id: this.props.route.params.chatId,
        name: this.props.route.params.otherName,
        avatar: this.props.route.params.otherImage,
      },
      me: {
        _id: this.props.route.params.userId,
        name: this.props.route.params.userName,
        avatar: this.props.route.params.userImage,
      },
      newMessages: [],
      messages: [],
    };
  }
  renderBubble = props => {
    return (
      <Bubble
        {...props}
        textStyle={{
          right: {
            color: 'black',
          },
        }}
        wrapperStyle={{
          left: {
            backgroundColor: '#fff',
          },
          right: {
            backgroundColor: '#1ec8de',
          },
        }}
      />
    );
  };
  renderSend = props => {
    return (
      <Send {...props} alwaysShowSend={true}>
        <View style={styles.sendBtn}>
          <Text style={{color: '#ffffff', fontSize: 17}}>发送</Text>
        </View>
      </Send>
    );
  };

  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }));
    let sendUserId = this.state.userid;
    let receiveUserId = this.state.chatUserId;
    let inf = {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'token':this.props.route.params.token,
        'userId':this.state.userid.toString(),
      },
      body: JSON.stringify({
        sendUserId: sendUserId,
        receiveUserId: receiveUserId,
        messageContent: messages[0].text,
      }),
    };
    fetch('http://' + localhost + '/Security/postAMessage', inf)
      .catch(function (e) {
        alert('error:' + e);
      })
      .then(response => response.json())
      .catch(function (ex) {
        console.log('parsing failed', ex);
      });
  }
  componentDidMount() {
    fetch('http://' + localhost + '/Security/getMessagesBetweenTwoUsers', {
      method: 'post',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
        'token':this.props.route.params.token,
        'userId':this.state.userid.toString(),
      },
      body: 'me=' + this.state.userid + '&you=' + this.state.chatUserId,
    })
      .catch(function (e) {
        alert('error:' + e);
      })
      .then(response => response.json())
      .then(data => {
        this.setState({
          data: data,
        });
      })
      .catch(function (ex) {
        console.log('parsing failed', ex);
      });
    fetch('http://' + localhost + '/Security/setAllMessageWithAUserHaveRead', {
      method: 'post',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
        'token':this.props.route.params.token,
        'userId':this.state.userid.toString(),
      },
      body:
        'acceptUserId=' +
        this.state.userid +
        '&sentUserId=' +
        this.state.chatUserId,
    })
      .catch(function (e) {
        alert('error:' + e);
      })
      .then(response => response.json())
      .catch(function (ex) {
        console.log('parsing failed', ex);
      });
    setTimeout(this.setMessage, 1000);
    this.timer = setInterval(this.getNewMessage, 5000);
  }
  componentWillUnmount() {
    if (this.timer != null) {
      clearInterval(this.timer);
    }
  }
  setMessage = () => {
    let temMessage = this.state.messages;
    this.state.data.map(function (title, idx) {
      let S = {
        _id: 3,
        text: '嘉然今天吃什么',
        createdAt: new Date(),
        user: {
          _id: 50,
          name: '和敬凯',
          avatar: picUri,
        },
      };
      S._id = this.state.data[idx].messageId;
      S.createdAt = this.state.data[idx].sendTime;
      S.text = this.state.data[idx].messageText;
      if (this.state.data[idx].sendId === this.state.me._id) {
        S.user = this.state.me;
      } else {
        S.user = this.state.you;
      }
      temMessage[idx] = S;
    }, this);
    this.setState({
      messages: temMessage,
    });
  };
  getNewMessage = () => {
    fetch('http://' + localhost + '/Security/getMessagesBetweenTwoUsers', {
      method: 'post',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
        'token':this.props.route.params.token,
        'userId':this.state.userid.toString(),
      },
      body: 'me=' + this.state.userid + '&you=' + this.state.chatUserId,
    })
      .catch(function (e) {
        alert('error:' + e);
      })
      .then(response => response.json())
      .then(data => {
        this.setState({
          data: data,
        });
      })
      .catch(function (ex) {
        console.log('parsing failed', ex);
      });
    setTimeout(this.setNewMessage, 300);
  };
  setNewMessage = () => {
    if (this.state.data[0] != null) {
      let tem = this.state.messages;
      this.state.data.map(function (title, idx) {
        let S = {
          _id: 3,
          text: '嘉然今天吃什么',
          createdAt: new Date(),
          user: {
            _id: 50,
            name: '和敬凯',
            avatar: picUri,
          },
        };
        S._id = this.state.data[idx].messageId;
        S.createdAt = this.state.data[idx].sendTime;
        S.text = this.state.data[idx].messageText;
        if (this.state.data[idx].sendId === this.state.me._id) {
          S.user = this.state.me;
        } else {
          S.user = this.state.you;
        }
        tem[idx] = S;
      }, this);
      this.setState({
        messages: tem,
      });
    }
  };
  render() {
    return (
      <SafeAreaView style={styles.mainContent}>
        <PostingHead
          navigation={this.props.navigation}
          title={this.state.you.name}
          onPressLeft={() => {
            this.props.navigation.goBack();
          }}
        />
        <GiftedChat
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          showUserAvatar={true}
          locale={'zh-cn'}
          renderAvatarOnTop
          showAvatarForEveryMessage={true}
          renderBubble={this.renderBubble}
          renderSend={this.renderSend}
          placeholder={'输入私信...'}
          inverted={true}
          renderUsernameOnMessage={true}
          user={this.state.me}
          alignTop={true}
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  mainContent: {
    flex: 1,
    backgroundColor: '#ededed',
  },
  sendBtn: {
    width: 63,
    height: 32,
    borderRadius: 3,
    backgroundColor: '#25aaf1',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
    marginRight: 5,
  },
});
