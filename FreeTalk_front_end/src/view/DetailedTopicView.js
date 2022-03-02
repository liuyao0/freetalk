import React from 'react';
import {Icon} from 'react-native-elements';
import {
  FlatList,
  NativeAppEventEmitter,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ToastAndroid,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {PostingSection} from '../components/PostingSection';
import {PostingHead} from '../components/PostingHead';
import {RichTextShower} from '../components/RichTextShower';
import {AuthorInfo} from '../components/AuthorInfo';
import {localhost} from '../../App';
import {changeHTMLToText} from '../components/MyTopic';
import {getDateTime} from '../components/Reply';

class DetailedTopicView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      myUserId: 0,
      topic: [],
      curPage: 1,
      // topicId: 0,
        topicId:this.props.route.params.topicId,
        haveAgreed: false,
      agreeText: '点赞',
      agreeColor: '#00BFFF',
      haveStarred: false,
      authorFollowed: false,

      //话题的基本信息
      agreeNumber: '--',
      browseNumber: '--', //浏览人数
      starNumber: '--', //收藏人数
      replyNumber: '--', //回复人数
      topicTitle: '',
      topicText: '',
      time: '',

      //用户
      userId: 0,
      username: null,
      userAvatarUri: 'aaa',
      userDescription: '',
      comments: [],
      token:'',
      PostComment:null,
    };
  }

  componentDidMount() {
    AsyncStorage.getItem('token', (error, result) => {
      this.setState({
        token:result
      })
    });
    AsyncStorage.getItem('userid', (error, result) => {
      this.setState({
        myUserId: parseInt(result),
      });
    }).then(() => {
      this.getTopicAndComments();
      this.ban();
    });
    this._navListener = NativeAppEventEmitter.addListener(
      'TopicViewRefresh',
      () => {
        this.refreshTopicAndComments();
      },
    );
  }
  ban=()=>{
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
                      PostComment:getDateTime(data.endTime),
                  });
              }
          })
          .catch(function (ex) {
              console.log('parsing failed', ex);
          });
  }
  componentWillUnmount() {
    this._navListener.remove();
  }

  checkLikeAndStarAndFollow = () => {
    fetch(
      'http://' +
        localhost +
        '/checkUserLike/' +
        this.state.topicId +
        '/' +
        this.state.myUserId,
      {},
    )
      .then(response => response.json())
      .then(data => {
        this.setState({
          haveAgreed: data === true,
          agreeNumber:
            data === true ? this.state.agreeNumber - 1 : this.state.agreeNumber,
        });
      })
      .catch(function (e) {
        ToastAndroid.show('error:' + e, 1);
      });

    fetch(
      'http://' +
        localhost +
        '/checkUserStar/' +
        this.state.topicId +
        '/' +
        this.state.myUserId,
      {},
    )
      .then(response => response.json())
      .then(data => {
        this.setState({
          haveStarred: data === true,
          starNumber:
            data === true ? this.state.starNumber - 1 : this.state.starNumber,
        });
      })
      .catch(function (e) {
        ToastAndroid.show('error:' + e, 1);
      });
      let infToService={
          method:'post',
          headers:{
              "Content-Type":"application/json",
              'token':this.state.token,
              'userId':this.state.myUserId.toString()
          },
          body:JSON.stringify({})
      }
      fetch(
          'http://' +
          localhost +
          '/Security/checkUserFollow?userId=' +
          this.state.myUserId +
          '&userId_toFollow=' +
          this.state.userId,
          infToService,
      )
          .then(response => response.json())
          .then(data => {
              if (data === true) {
                  this.setState({authorFollowed: true});
              } else {
                  this.setState({authorFollowed: false});
              }
          })
          .catch(function (e) {
              ToastAndroid.show('error:' + e, 1);
          });
  };

  addOneBrowse = () => {
    fetch(
      'http://' + localhost + '/browseATopic/' + this.state.topicId,
      {},
    ).catch(function (e) {
      ToastAndroid.show('error:' + e, 1);
    });
  };

  refreshTopicAndComments = () => {
    fetch('http://' + localhost + '/getATopicView/' + this.state.topicId, {})
      .then(response => response.json())
      .then(data => {
        this.setState({
          replyNumber: data.replies,
        });
      })
      .catch(function (e) {
        ToastAndroid.show('error:' + e, 1);
      });

    fetch(
      'http://' +
        localhost +
        '/allCommentsOfATopic?topicId=' +
        this.state.topicId,
      {},
    )
      .then(response => response.json())
      .then(data => {
        this.setState({
          comments: data,
        });
      })
      .catch(function (e) {
        ToastAndroid.show('error:' + e, 1);
      });
  };

  getTopicAndComments = () => {
      fetch('http://' + localhost + '/getATopicView/' + this.state.topicId, {})
          .then(response => response.json())
          .then(data => {
            this.setState(
              {
                topicTitle: data.title,
                topicText: data.topicDescription,
                agreeNumber: data.likes,
                replyNumber: data.replies,
                browseNumber: data.views + 1,
                starNumber: data.stars, //显示的收藏/点赞数都是在基础上加的 所以基础数值应该不计算本人是否已经点赞
                time: getDateTime(data.postTime),
                userId: data.userId,
                username: data.username,
                userDescription: data.userDescription,
                userAvatarUri: data.userImage,
              },
              () => {
                this.checkLikeAndStarAndFollow();
              },
            );
          })
          .catch(function (e) {
            ToastAndroid.show('error:' + e, 1);
          });

        fetch(
          'http://' + localhost + '/allCommentsOfATopic?topicId=' + this.state.topicId,
          {},
        )
          .then(response => response.json())
          .then(data => {
            this.setState({
              comments: data,
            });
          })
          .catch(function (e) {
            ToastAndroid.show('error:' + e, 1);
          });

        this.addOneBrowse();
  };

  changeStarState = () => {
    if (this.state.haveStarred) {
      //已经收藏了->取消收藏
      fetch(
        'http://' +
          localhost +
          '/Security/undoStarATopic/' +
          this.state.topicId +
          '/' +
          this.state.myUserId,
        {
          headers:{
            'token':this.state.token,
            'userId':this.state.myUserId.toString(),
          }
        },
      ).catch(function (e) {
        ToastAndroid.show('error:' + e, 1);
      });
    } else {
      fetch(
        'http://' +
          localhost +
          '/Security/starATopic/' +
          this.state.topicId +
          '/' +
          this.state.myUserId,
        {
          headers:{
            'token':this.state.token,
            'userId':this.state.myUserId.toString(),
          }
        },
      ).catch(function (e) {
        ToastAndroid.show('error:' + e, 1);
      });
    }

    this.setState({
      haveStarred: !this.state.haveStarred,
    });
  };

  changeAgreeState = () => {
    if (this.state.haveAgreed) {
      //已点赞->取消点赞
      fetch(
        'http://' +
          localhost +
          '/Security/undoLikeATopic/' +
          this.state.topicId +
          '/' +
          this.state.myUserId,
        {
          headers:{
            'token':this.state.token,
            'userId':this.state.myUserId.toString(),
          }
        },
      ).catch(function (e) {
        ToastAndroid.show('error:' + e, 1);
      });
    } else {
      fetch(
        'http://' +
          localhost +
          '/Security/likeATopic/' +
          this.state.topicId +
          '/' +
          this.state.myUserId,
        {
          headers:{
            'token':this.state.token,
            'userId':this.state.myUserId.toString(),
          }
        },
      ).catch(function (e) {
        ToastAndroid.show('error:' + e, 1);
      });
    }
    this.setState({
      haveAgreed: !this.state.haveAgreed,
    });
  };

  changeFollowState = () => {
    if (this.state.authorFollowed) {
      //已经收藏了->取消收藏
      fetch(
        'http://' +
          localhost +
          '/Security/unfollowAUser?userId=' +
          this.state.myUserId +
          '&userId_toFollow=' +
          this.state.userId,
        {
          headers:{
            'token':this.state.token,
            'userId':this.state.myUserId.toString(),
          }
        },
      )
        .then(() => {
          this.setState({
            authorFollowed: !this.state.authorFollowed,
          });
        })
        .catch(function (e) {
          ToastAndroid.show('error:' + e, 1);
        });
    } else {
      fetch(
        'http://' +
          localhost +
          '/Security/followAUser?userId=' +
          this.state.myUserId +
          '&userId_toFollow=' +
          this.state.userId,
        {
          headers:{
            'token':this.state.token,
            'userId':this.state.myUserId.toString(),
          }
        },
      )
        .then(() => {
          this.setState({
            authorFollowed: !this.state.authorFollowed,
          });
        })
        .catch(function (e) {
          ToastAndroid.show('error:' + e, 1);
        });
    }
  };

  renderDescription=()=>{
      return(
<View>
<RichTextShower
text={this.state.topicText}
showsVerticalScrollIndicator={false}
/>
</View>
      )

  }

  render() {
    return (
      <SafeAreaView
        style={{
          backgroundColor: '#ffffff',
        }}>
        {/* eslint-disable-next-line no-undef */}
        <View style={{height: '100%', backgroundColor: '#F5F5F5'}}>
          <StatusBar barStyle={'light-content'} />
          <PostingHead
            title={this.state.topicTitle}
            navigation={this.props.navigation}
            onPressLeft={() => {
              this.props.navigation.goBack();
            }}
          />
          <AuthorInfo
            isMe={this.state.myUserId === this.state.userId}
            authorName={this.state.username}
            authorAvatarUri={this.state.userAvatarUri}
            authorDescription={this.state.userDescription}
            authorFollowed={this.state.authorFollowed}
            followChange={this.changeFollowState}
            userId={this.state.userId}
            navigation={this.props.navigation}
          />
          <FlatList
            style={{flex: 1}}
            ListHeaderComponent={
              <View style={styles.sectionContainer} >
                  {this.renderDescription()}
                <View style={{flexDirection: 'row', marginTop: 20}}>
                  <Text style={{flex: 1}}>
                    {this.state.haveStarred
                      ? this.state.starNumber + 1
                      : this.state.starNumber}
                    收藏 · {this.state.replyNumber}回复 ·{' '}
                    {this.state.browseNumber}浏览
                  </Text>
                  <TouchableOpacity
                    onPress={this.changeAgreeState}
                    style={{
                      width: 100,
                      borderRadius: 200,
                      alignItems: 'center',
                      backgroundColor: !this.state.haveAgreed
                        ? '#FFF0F5'
                        : '#00BFFF',
                    }}>
                    <Text>
                      <Icon name="like" type="simple-line-icon" size={15} />
                      好话题{' '}
                      {this.state.haveAgreed
                        ? this.state.agreeNumber + 1
                        : this.state.agreeNumber}
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.container}>
                  <TouchableOpacity
                    style={styles.buttonContainer}
                    onPress={() => {
                      if(this.state.PostComment==null)this.props.navigation.navigate('Answer', {
                        topicId: this.state.topicId,
                        topicTitle: this.state.topicTitle,
                        replyId: 0,
                      })
                      else {
                        ToastAndroid.show('您已被禁言到：'+this.state.PostComment, 1);
                      }
                    }
                    }>
                    <Text style={{fontSize: 16}}>
                      <Icon name="note" type="simple-line-icon" size={16} />
                      写回复
                    </Text>
                  </TouchableOpacity>
                  {/*<Text style={{fontSize: 30}}>|</Text>*/}
                  <TouchableOpacity
                    style={{
                      marginLeft: 20,
                      marginRight: 20,
                      padding: 5,
                      flex: 1,
                      borderRadius: 200,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: !this.state.haveStarred
                        ? '#ffffff'
                        : '#00BFFF',
                    }}
                    onPress={this.changeStarState}>
                    <Text style={{fontSize: 16}}>
                      <Icon
                        underlayColor="green"
                        name={!this.state.haveStarred ? 'heart' : 'diamond'}
                        type="simple-line-icon"
                        size={16}
                      />
                      {!this.state.haveStarred ? '收藏话题' : '已收藏'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            }
            data={this.state.comments}
            renderItem={comment => {
              return (
                <View>
                  <TouchableOpacity
                    onPress={() => {
                      this.props.navigation.navigate('Post', {
                        //commentInfo
                        commentId: comment.item.commentId,
                        commentContent: comment.item.commentContent,
                        commentTime: comment.item.sendTime,
                        //topicInfo
                        topicId: this.state.topicId,
                        topicTitle: this.state.topicTitle,
                        //userInfo
                        authorId: comment.item.user.userId,
                      });
                    }}>
                    <PostingSection
                      authorAvatarUri={comment.item.user.image}
                      authorName={comment.item.user.username}
                      postingAbbr={changeHTMLToText(
                        comment.item.commentContent,
                      )}
                      likeNum={comment.item.likes}
                      starNum={comment.item.stars}
                      replyNum={comment.item.replyNumber}
                      postingTime={getDateTime(comment.item.sendTime)}
                    />
                  </TouchableOpacity>
                </View>
              );
            }}
            keyExtractor={(item, index) => {
              return 'idx' + index.toString();
            }}
          />
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginLeft: 5,
    marginRight: 5,
    paddingTop: 5,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: '#ffffff',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
    fontSize: 25,
  },
  detailedInformation: {
    fontSize: 19,
  },
  searchInput: {
    flex: 1,
    alignItems: 'center',
    marginTop: 5,
    marginLeft: 10,
    marginRight: 10,
    fontSize: 20,
    borderWidth: 1,
    borderRadius: 10,
  },
  addButton: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    marginTop: 15,
    borderRadius: 400,
    backgroundColor: '#7b68ee',
    height: 30,
    width: 30,
  },
  container: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonContainer: {
    marginLeft: 20,
    marginRight: 20,
    padding: 5,
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default DetailedTopicView;
