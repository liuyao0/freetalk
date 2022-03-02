import * as React from 'react';
import {
    FlatList,
    NativeAppEventEmitter,
    TextInput, ToastAndroid,
    TouchableOpacity,
    useWindowDimensions,
    View,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {TopicSection} from '../components/TopicSection';
import PostTopic from './PostTopic';
import {SceneMap, TabView} from 'react-native-tab-view';
import {Avatar, Badge, Icon, Text} from 'react-native-elements';
import Message from './Message';
import Host from './Host';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {styles} from "../components/MyTopic";
import {localhost} from "../../App";
import {getDateTime} from '../components/Reply';

let showEnd=true;

function changeHTMLToText(content) {
  return content
      .replace(/<(p|div)[^>]*>(<br\/?>|&nbsp;)<\/\1>/gi, '\n')
      .replace(/<br\/?>/gi, '\n')
      .replace(/<[^>/]+>/g, '')
      .replace(/(\n)?<\/([^>]+)>/g, '')
      .replace(/\u00a0/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/<\/?(img)[^>]*>/gi, '[图片]')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&#39;/g, "'")
      .replace(/&quot;/g, '"')
      .replace(/<\/?.+?>/g, '');
}

class HottestTopics extends React.Component {
  constructor() {
    super();
    this.state = {
      topicList: null,
      curPage: 1,
      rank: 0,
        userId:0,
        postTopic:true,
    };
    this.getTopicList();
  }
  i = 1;

  componentWillMount() {
      AsyncStorage.getItem('userid', (error, result) => {
          this.setState({
              userId:parseInt(result)
          })
      });
  }

    getTopicList = () => {
    fetch('http://' + localhost + '/getHotTopics/50', {})
      .then(response => response.json())
      .then(data => {
        if (JSON.stringify(data) === '[]') {
          this.setState({
            topicList: null,
          });
        } else {
          this.setState({
            topicList: data,
          });
        }
      })
      .catch(function (e) {
          ToastAndroid.show("error:" + e,1);
      });
  };

  renderBadge = (showBadge, value) => {
    if (showBadge) {
      return (
        <Badge
          value={value}
          badgeStyle={{alignSelf: 'center', marginTop: 5, marginLeft: 3}}
        />
      );
    } else {
      return <View style={{width: 0}} />;
    }
  };

  showTopic = showBadge => {
    if (this.state.topicList !== null) {
      return (
        <View>
          <FlatList
            style={{backgroundColor: '#f6f6f6'}}
            data={this.state.topicList}
            keyExtractor={(topic, index) => {
              return 'idx:' + index.toString();
            }}
            renderItem={topic => {
              return (
                <View style={styles.sectionStyleWithBorder}>
                  <View style={{flexDirection: 'row'}}>
                    {this.renderBadge(showBadge, topic.index + 1)}
                      <TouchableOpacity
                          style={{width:'95%'}}
                          onPress={() => {
                              AsyncStorage.setItem(
                                  'topic',
                                  JSON.stringify(topic.item.topicId),
                              );
                              this.props.navigation.push('DetailedTopic',{topicId:topic.item.topicId});
                          }}>
                          <TopicSection
                              topicTitle={topic.item.title}
                              authorAvatarUri={topic.item.userImage}
                              authorName={topic.item.username}
                              postingAbbr={changeHTMLToText(
                                  topic.item.topicDescription,
                              )}
                              likeNum={topic.item.likes}
                              starNum={topic.item.stars}
                              replyNum={topic.item.replies}
                              browseNum={topic.item.views}
                              postingTime={topic.item.postTime}
                              hot={topic.item.hot}
                              showDate={false}
                              showHot={true}
                          />
                      </TouchableOpacity>
                  </View>
                </View>
              );
            }}
          />
        </View>
      );
    } else {
      return <View />;
    }
  };

  render() {
    return (
      <View
        style={{
          flex: 1,
          alignSelf: 'center',
          flexDirection: 'column',
          width: '100%',
        }}>
        {this.showTopic(true)}
      </View>
    );
  }
}

class NewestTopics extends React.Component {
  constructor() {
    super();
    this.state = {
      topicList: null,
      curPage: 1,
        myUserId:1,
      end: false,
      number: 0,
    };
  }

  componentDidMount() {
    this._navListener = NativeAppEventEmitter.addListener('reFresh', () => {
        showEnd=true;
      this.setState({
        curPage: 1,
        end: false,
      });
      setTimeout(this.getTopicList, 50);
    });
      AsyncStorage.getItem('userid', (error, result) => {
          this.setState({
              myUserId:parseInt(result)
          },()=>{
              this.getTopicList()
          })
      });
  }
  componentWillUnmount() {
    this._navListener.remove();
  }

  getTopicList = () => {
    fetch('http://' + localhost + '/getRecommendTopics?userId='+this.state.myUserId+'&size=6', {})
      .then(response => response.json())
      .then(data => {
          if (data.length<4) this.setState({end:true})
        this.setState({
          topicList: data,
        });
      })
      .catch(function (e) {
          ToastAndroid.show("error:" + e,1);
      });
  };

  _endReached() {
      if (this.state.end) return
    fetch(
      'http://' + localhost + '/getRecommendTopics?userId='+this.state.myUserId+'&size=6',
      {},
    )
      .then(response => response.json())
      .then(data => {
        if (JSON.stringify(data) === '[]') {
          this.setState({
            end: true,
          });
        } else {
          this.setState({
            topicList: this.state.topicList.concat(data),
          });
        }
      })
      .catch(function (e) {
          ToastAndroid.show("error:" + e,1);
      });
    this.setState({
      curPage: this.state.curPage + 1,
    });
  }

  showEnd = () => {
    if ( this.state.end) {
        showEnd=false
      return (
        <Text
          style={{
            textAlign: 'center',
            padding: 5,
            backgroundColor: '#f0f0f0',
            color: '#888',
          }}>
          ....已经到底了....
        </Text>
      );
    } else {
      return null;
    }
  };

  showTopic = () => {
    if (this.state.topicList !== null) {
      return (
        <View>
          <FlatList
            style={{backgroundColor: '#f6f6f6'}}
            data={this.state.topicList}
            keyExtractor={(topic, index) => {
              return 'idx:' + index.toString();
            }}
            ListFooterComponent={this.showEnd}
            ListFooterComponentStyle={{flex: 1, justifyContent: 'flex-end'}}
            contentContainerStyle={{flexGrow: 1}}
            renderItem={topic => {
              return (
                <View style={styles.sectionStyleWithBorder}>
                  <View style={{flexDirection: 'row'}}>
                    <TouchableOpacity
                        style={{width:'100%'}}
                      onPress={() => {
                        AsyncStorage.setItem(
                          'topic',
                          JSON.stringify(topic.item.topicId),
                        );
                        this.props.navigation.push('DetailedTopic',{topicId:topic.item.topicId});
                      }}>
                      <TopicSection
                        topicTitle={topic.item.title}
                        authorAvatarUri={topic.item.userImage}
                        authorName={topic.item.username}
                        postingAbbr={changeHTMLToText(
                          topic.item.topicDescription,
                        )}
                        likeNum={topic.item.likes}
                        starNum={topic.item.stars}
                        replyNum={topic.item.replies}
                        browseNum={topic.item.views}
                        postingTime={topic.item.postTime}
                        showDate={false}
                        showHot={false}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            }}
            onEndReachedThreshold={0.1} //当距离内容比例不足内容0.1比例时触发onEndReached
            onEndReached={this._endReached.bind(this)}
          />
          {this.showEnd()}
        </View>
      );
    } else {
      return null;
    }
  };

  render() {
    return (
      <View
        style={{
          flex: 1,
          alignSelf: 'center',
          flexDirection: 'column',
          width: '100%',
        }}>
        {this.showTopic()}
      </View>
    );
  }
}

class FocusedTopics extends React.Component {
    constructor() {
        super();
        this.state = {
            topicList: null,
            myUserId: 1
        };
    }

    componentDidMount() {
        AsyncStorage.getItem('userid', (error, result) => {
            this.setState({
                myUserId:parseInt(result)
            })
            fetch('http://' + localhost + '/getTopicOfFocusedUsers?userId='+parseInt(result), {})
                .then(response => response.json())
                .then(data => {
                    if (JSON.stringify(data) === '[]') {
                        this.setState({
                            topicList: null,
                        });
                    } else {
                        this.setState({
                            topicList: data,
                        });
                    }
                })
                .catch(function (e) {
                    ToastAndroid.show("error:" + e,1);
                })
            ;
        });
    }

    getTopicList = () => {
        fetch('http://' + localhost + '/getTopicOfFocusedUsers?userId='+this.state.myUserId, {})
            .then(response => response.json())
            .then(data => {
                if (JSON.stringify(data) === '[]') {
                    this.setState({
                        topicList: null,
                    });
                } else {
                    this.setState({
                        topicList: data,
                    });
                }
            })
            .catch(function (e) {
                ToastAndroid.show("error:" + e,1);
            })
        ;
    };


    showTopic = () => {
        if (this.state.topicList !== null) {
            return (
                <View>
                    <FlatList
                        style={{backgroundColor: '#f6f6f6'}}
                        data={this.state.topicList}
                        keyExtractor={(topic, index) => {
                            return 'idx:' + index.toString();
                        }}
                        renderItem={topic => {
                            return (
                                <View style={styles.sectionStyleWithBorder}>
                                    <View style={{flexDirection: 'row'}}>
                                        <TouchableOpacity
                                            style={{width:'100%'}}
                                            onPress={() => {
                                                AsyncStorage.setItem(
                                                    'topic',
                                                    JSON.stringify(topic.item.topicId),
                                                );
                                                this.props.navigation.push('DetailedTopic',{topicId:topic.item.topicId});
                                            }}>
                                            <View
                                                style={{
                                                    flexDirection: 'row',
                                                    height: 39,
                                                    paddingTop: 2,
                                                    paddingBottom: 2,
                                                    paddingLeft: 10
                                                }}>
                                            <Avatar
                                                rounded
                                                size={'small'}
                                                source={{uri:topic.item.focusUserImage}}
                                            />
                                            <Text style={{
                                                height: 35,
                                                lineHeight: 35,
                                                paddingLeft: 8,
                                                color: '#444',
                                                fontSize: 13,
                                            }}>{topic.item.focusUsername}{' '}{topic.item.type===1?'创建了话题':'回答了话题'}</Text>
                                            </View>
                                            <TopicSection
                                                topicTitle={topic.item.title}
                                                authorAvatarUri={topic.item.userImage}
                                                authorName={topic.item.username}
                                                postingAbbr={changeHTMLToText(
                                                    topic.item.topicDescription,
                                                )}
                                                likeNum={topic.item.likes}
                                                starNum={topic.item.stars}
                                                replyNum={topic.item.replies}
                                                browseNum={topic.item.views}
                                                postingTime={topic.item.postTime}
                                                showDate={false}
                                                showHot={false}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            );
                        }}
                    />
                </View>
            );
        } else {
            return <View />;
        }
    };

    render() {
        return (
            <View
                style={{
                    flex: 1,
                    alignSelf: 'center',
                    flexDirection: 'column',
                    width: '100%',
                }}>
                {this.showTopic()}
            </View>
        );
    }
}

class Press extends React.Component{
    constructor() {
        super();
        this.state = {
            PostTopic:null,
            myUserId:0,
        }
    }
    componentDidMount() {
        AsyncStorage.getItem('userid', (error, result) => {
            this.setState({
                myUserId:parseInt(result)
            })
        });
    }
    render(){
        return(
            <TouchableOpacity
                style={styles.addButton}
                onPress={() => {
                    if(this.state.PostTopic===null)this.props.navigation.navigate('PostTopic')
                    else {
                    ToastAndroid.show('您已被禁言到：'+this.state.PostTopic, 1);
                }}
                }
            >
                <Text
                    style={{
                        color: Colors.white,
                        fontSize: 20,
                        textAlign: 'center',
                        textAlignVertical: 'center',
                    }}>
                    +
                </Text>
            </TouchableOpacity>
        );
    }
}
function Home({navigation}) {
  const FirstRoute = () => (
    <View
      style={{
        flex: 1,
        alignSelf: 'center',
        flexDirection: 'column',
        width: '100%',
      }}>
      <HottestTopics navigation={navigation} />
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
      <NewestTopics navigation={navigation} />
    </View>
  );
    const FocusedTopicsRoute = () => (
        <View
            style={{
                flex: 1,
                alignSelf: 'center',
                flexDirection: 'column',
                width: '100%',
            }}>
            <FocusedTopics navigation={navigation} />
        </View>
    );
  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {key: 'first', title: '热榜'},
    {key: 'second', title: '推荐'},
      {key:'third', title: '关注'}
  ]);

  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
      third: FocusedTopicsRoute
  });
  return (
    <View style={{flex: 1}}>
      <View
        style={{flexDirection: 'row', backgroundColor: '#ffffff', height: 45}}>
        <View style={{flex: 1, position: 'relative', height: 40}}>
          <TouchableOpacity onPress={() => navigation.navigate('Search')}>
            <View style={{position: 'absolute', zIndex: 2, left: 16, top: 15}}>
              <Icon name={'search'} type={'feather'} size={16} color={'#999'} />
            </View>
            <TextInput
              editable={false}
              style={styles.searchInput}
              placeholder="搜索您感兴趣的内容"
            />
          </TouchableOpacity>
        </View>
        <Press navigation={navigation}></Press>
      </View>

      <TabView
        navigationState={{index, routes}}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{width: layout.width}}
      />
    </View>
  );
}

const T = createBottomTabNavigator();

class Tab extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      number: 0,
        userId:0,
        postTopic:false,
        token:'',
    };
  }
  //
  // componentWillMount() {
  //     AsyncStorage.getItem('isBan', (error, result) => {
  //         this.setState({
  //             postTopic:result
  //         })
  //     });
  // }

    componentDidMount() {
      AsyncStorage.getItem('userid', (error, result) => {
          this.setState({
              userId:parseInt(result)
          })
      });
        AsyncStorage.getItem('token', (error, result) => {
            this.setState({
                token:result
            })
        });
    setInterval(this.getUnread, 5000);
  }

  getUnread = () => {
    fetch('http://'+localhost+'/Security/numberOfMessagesUnread', {
      method: 'post',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
          'token':this.state.token,
          'userId':this.state.userId.toString(),
      },
      body: 'acceptUserId='+this.state.userId,
    })
      .catch(function (e) {
          ToastAndroid.show("error:" + e,1);
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
  isShown = () => {
    if (this.state.number === 0) {
      return <T.Screen name="消息" component={Message} />;
    } else {
      return (
        <T.Screen
          name="消息"
          component={Message}
          options={{tabBarBadge: this.state.number}}
        />
      );
    }
  };
  render() {
    return (
      <T.Navigator
        screenOptions={({route}) => ({
          tabBarIcon: ({focused, color, size}) => {
            let iconName;

            if (route.name === '消息') {
              iconName = focused
                ? 'ios-information-circle'
                : 'ios-information-circle-outline';
            } else if (route.name === '首页') {
              iconName = focused ? 'home' : 'home';
            } else if (route.name === '我的') {
              iconName = focused ? 'ios-list' : 'ios-list';
            }

            // You can return any component that you like here!
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
        tabBarOptions={{
          activeTintColor: 'skyblue',
          inactiveTintColor: 'gray',
        }}>
          <T.Screen name="首页" component={Home} />
        {this.isShown()}
        <T.Screen name="我的" component={Host} />
      </T.Navigator>
    );
  }
}
export default Tab;
