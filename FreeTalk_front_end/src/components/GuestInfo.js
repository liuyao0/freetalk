import React from 'react';
import {Dimensions, View} from 'react-native';
import MyTopic, {styles} from './MyTopic';
import {SceneMap, TabView} from 'react-native-tab-view';
import {MyComment} from './MyComment';
import MyStarTopic from './MyStarTopic';
import UsersIFollowsNo from './UsersIFollowsNo';
import {GuestInfoHead} from './GuestInfoHead';
import {PostingHead} from './PostingHead';
const initialLayout = {width: Dimensions.get('window').width};

export default class GuestInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      navigation: props.navigation,
      index: 0,
      routes: [
        {key: 'first', title: '提问'},
        {key: 'second', title: '回答'},
        {key: 'third', title: '关注'},
        {key: 'forth', title: '收藏'},
        {key: 'fifth', title: '粉丝'},
        {key: 'sixth', title: '关注的人'},
      ],
      userId: this.props.route.params.userId,
    };
  }

  setIndex = num => {
    this.setState({
      index: num,
    });
  };

  render() {
    const renderScene = SceneMap({
      first: () => (
        <MyTopic
          navigation={this.state.navigation}
          userId={this.state.userId}
        />
      ),
      second: () => (
        <MyComment
          navigation={this.state.navigation}
          type={0}
          userId={this.state.userId}
        />
      ),
      third: () => (
        <MyStarTopic
          navigation={this.state.navigation}
          userId={this.state.userId}
        />
      ),
      forth: () => (
        <MyComment
          navigation={this.state.navigation}
          type={1}
          userId={this.state.userId}
        />
      ),
      fifth: () => (
        <UsersIFollowsNo
          navigation={this.state.navigation}
          type={0}
          userId={this.state.userId}
        />
      ),
      sixth: () => (
        <UsersIFollowsNo
          navigation={this.state.navigation}
          type={1}
          userId={this.state.userId}
        />
      ),
    });
    const index = this.state.index;
    const routes = this.state.routes;

    return (
      <View style={{flex: 1, backgroundColor: 'white'}}>
        <PostingHead
          title={'用户个人信息'}
          onPressLeft={() => {
            this.props.navigation.goBack();
          }}
        />
        <GuestInfoHead
          navigation={this.state.navigation}
          userId={this.state.userId}
        />
        <TabView
          navigationState={{index, routes}}
          renderScene={renderScene}
          onIndexChange={num => this.setIndex(num)}
          initialLayout={initialLayout}
          style={styles.container}
        />
      </View>
    );
  }
}
