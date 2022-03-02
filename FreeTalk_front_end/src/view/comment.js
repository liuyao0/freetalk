import React from 'react';
import {
  NativeAppEventEmitter, ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {ActivitySection} from '../components/ActivitySection';
import {localhost} from '../../App';
import {getDateTime} from '../components/Reply';

class Comment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      comment: [],
      userId: 0,
    };
  }

  getData = () => {
    AsyncStorage.getItem('userid', (error, result) => {
      fetch(
        'http://' +
          localhost +
          '/getUserAnswerMyCommentAndTopic?userId=' +
          result,
        {},
      )
        .then(response => response.json())
        .then(data => {
          this.setState({
            comment: data,
          });
        })
        .catch(function (ex) {
          console.log('parsing failed', ex);
        });
      console.log(error);
      console.log(result);

      this.setState({
        userId: parseInt(result),
      });
    });
  };

  componentWillMount() {
    this.getData();
    this.listener = NativeAppEventEmitter.addListener('CommentRefresh', () => {
      this.getData();
    });
  }

  componentWillUnmount() {
    this.listener.remove();
  }

  render() {
    let data = this.state.comment;
    return (
        <ScrollView>
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          backgroundColor: 'white',
        }}>
        {data.map(function (title, idx) {
          const a = '话题';
          const b = '评论';
          let type;
          if (data[idx].comment.replyId === 0) {
            type = a;
          } else {
            type = b;
          }
          return (
            <TouchableOpacity
              style={styles.Activity}
              onPress={() => {
                AsyncStorage.setItem(
                  'topic',
                  JSON.stringify(data[idx].comment.topic.topicId),
                );
                this.TopicOrAnswer(data[idx]);
              }}>
              <ActivitySection
                type1={'评论'}
                type2={type}
                authorAvatarUri={data[idx].comment.user.image}
                postingAbbr={data[idx].comment.commentContent}
                authorName={data[idx].comment.user.username}
                likeNum={data[idx].comment.likes}
                starNum={data[idx].comment.stars}
                replyNum={data[idx].comment.replyNumber}
                postingTime={getDateTime(data[idx].comment.sendTime)}
                question={data[idx].comment.topic.title}
              />
            </TouchableOpacity>
          );
        }, this)}
      </View>
        </ScrollView>
    );
  }
  TopicOrAnswer = a => {
    if (a.comment.replyId === 0) {
      AsyncStorage.setItem('topic', JSON.stringify(a.comment.topic.topicId));
      this.props.navigation.push('DetailedTopic',{topicId:a.comment.topic.topicId});
    } else {
      this.props.navigation.navigate('Post', {
        //commentInfo
        commentId: a.comment.commentId,
        commentContent: a.comment.commentContent,
        commentTime: a.comment.sendTime,
        //topicInfo
        topicId: a.comment.topic.topicId,
        topicTitle: a.comment.topic.topicTitle,
        //userInfo
        authorId: a.comment.user.userId,
      });
    }
  };
}
const styles = StyleSheet.create({
  Activity: {
    padding: 5,
    backgroundColor: '#F0F0F0',
    height: 130,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: '#808080',
  },
});
export {Comment};
