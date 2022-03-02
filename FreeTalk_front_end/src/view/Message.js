import {
  NativeAppEventEmitter, ScrollView,
  StyleSheet, Text,
  ToastAndroid,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {PrivateSection} from '../components/PrivateSection';
import * as React from 'react';
import {SceneMap, TabView} from 'react-native-tab-view';
import {Comment} from './comment';
import {getDateTime} from '../components/Reply';
import {localhost} from '../../App';

class Message extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      userid: 0,
      hasUserid: false,
      hasUserdata: 0,
      number: [],
      totalNumber: 0,
      token:'',
    };
  }

  getData = () => {
    AsyncStorage.getItem('userid', (error, result) => {
      if (!error) {
        const res = JSON.parse(result).toString();
        this.setState({
          userid: parseInt(res),
        });
        this.setState({
          hasUserid: true,
        });
        this.GetAllUser();
        this.GetRead();
        this.timer1 = setInterval(this.GetAllUser, 5000);
        this.timer2 = setInterval(this.GetRead, 5000);
      }
    });
  };
  componentDidMount() {
    AsyncStorage.getItem('token', (error, result) => {
      this.setState({
        token:result
      })
      this.getData();
    });
    this.listener = NativeAppEventEmitter.addListener(
      'PrivateMessageRefresh',
      () => {
        this.getData();
      },
    );
  }

  componentWillUnmount() {
    if (this.timer1 != null) {
      clearInterval(this.timer1);
    }
    if (this.timer2 != null) {
      clearInterval(this.timer2);
    }
    this.listener.remove();
  }

  GetRead = () => {
    fetch('http://' + localhost + '/Security/numberOfMessagesUnread', {
      method: 'post',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
        'token':this.state.token,
        'userId':this.state.userid.toString(),
      },
      body: 'acceptUserId=' + this.state.userid,
    })
      .catch(function (e) {
        ToastAndroid.show('error:' + e, 1);
      })
      .then(response => response.json())
      .then(data => {
        this.setState({
          totalNumber: data,
        });
      })
      .catch(function (ex) {
        console.log('parsing failed', ex);
      });

    fetch('http://' + localhost + '/Security/numberOfMessagesUnreadWithAUser', {
      method: 'post',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
        'token':this.state.token,
        'userId':this.state.userid.toString(),
      },
      body: 'acceptUserId=' + this.state.userid,
    })
      .catch(function (e) {
        ToastAndroid.show('error:' + e, 1);
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
  };
  GetAllUser = () => {
    fetch('http://' + localhost + '/Security/getAllUsersHasChattedWithAUser', {
      method: 'post',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
        'token':this.state.token,
        'userId':this.state.userid.toString(),
      },
      body: 'userId=' + this.state.userid,
    })
      .catch(function (e) {
        ToastAndroid.show('error:' + e, 1);
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
  };
  render = () => {
    let a = this.state.data;
    return (
        <ScrollView>
      <View
        style={{flex: 1, flexDirection: 'column', backgroundColor: '#FFFFFF'}}>
        {a.map(function (title, idx) {
          let Show = true;
          let message = this.state.data[idx].messageText;
          let tem = message.substring(0, 5);
          let user = this.state.data[idx].sendUser;
          let other = this.state.data[idx].acceptUser;
          if (this.state.data[idx].acceptUser.userId === this.state.userid) {
            user = this.state.data[idx].acceptUser;
            other = this.state.data[idx].sendUser;
          }
          let time = getDateTime(this.state.data[idx].sendTime);
          if (this.state.number[idx] === 0) {
            Show = false;
          }
          return (
            <TouchableOpacity
              style={styles.Private}
              onPress={() => {
                this.props.navigation.navigate('ChatPrivate', {
                  userId: user.userId,
                  chatId: other.userId,
                  userImage: user.image,
                  otherImage: other.image,
                  userName: user.username,
                  otherName: other.username,
                  token:this.state.token,
                });
              }}>
              <PrivateSection
                content={tem}
                time={time}
                title={other.username}
                show={Show}
                number={this.state.number[idx]}
                img={other.image}
              />
            </TouchableOpacity>
          );
        }, this)}
      </View>
        </ScrollView>
    );
  };
}

const styles = StyleSheet.create({
  Private: {
    padding: 5,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderColor: '#808080',
    height: 90,
  },
});
export default function MessageTab({navigation}) {
  const FirstRoute = () => (
    <View
      style={{
        flex: 1,
        alignSelf: 'center',
        flexDirection: 'column',
        width: '100%',
      }}>
      <Message navigation={navigation} />
    </View>
  );
  const SecondRoute = () => (
    <View
      style={{
        flex: 1,
        alignSelf: 'center',
        flexDirection: 'column',
        width: '100%',
      }}>
      <Comment navigation={navigation} />
    </View>
  );
  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {key: 'first', title: '私信'},
    {key: 'second', title: '评论'},
  ]);

  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
  });

  return (
    <View style={{flex: 1}}>
      <TabView
        navigationState={{index, routes}}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{width: layout.width}}
      />
    </View>
  )
}
