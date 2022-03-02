import React from 'react';
import {Text, View} from 'react-native';
import {Avatar} from 'react-native-elements/dist/avatar/Avatar';
import {changeHTMLToText} from './MyTopic';

class ActivitySection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      postingAbbr: '',
      likeNum: 0,
      starNum: 0,
      replyNum: 0,
      postingTime: '',
      authorName: '',
      question: '',
    };
  }

  paddingLeftValue = 15;
  paddingRightValue = 15;
  bottomTextStyle = {
    color: '#666',
    fontSize: 13,
  };

  render = () => {
    return (
      <View
        style={{
          backgroundColor: 'white',
          flexDirection: 'row',
          flex: 1,
        }}>
        <View style={{flex: 1}}>
          <View
            style={{
              flexDirection: 'row',
              height: 39,
              paddingTop: 2,
              paddingBottom: 2,
              paddingLeft: this.paddingLeftValue,
            }}>
            <Avatar
              rounded
              size={'small'}
              source={{uri: this.props.authorAvatarUri}}
            />
            <View style={{flexDirection: 'column'}}>
              <Text
                style={{
                  height: 25,
                  lineHeight: 25,
                  paddingLeft: 8,
                  color: '#444',
                  fontSize: 13,
                }}>
                {this.props.authorName}
              </Text>
              <Text
                style={{
                  height: 35,
                  lineHeight: 12,
                  paddingLeft: 8,
                  color: '#444',
                  fontSize: 10,
                }}>
                {this.props.type1}了{this.props.type2}
              </Text>
            </View>
          </View>
          <View style={{flexDirection: 'column'}}>
            <Text
              style={{
                paddingLeft: this.paddingLeftValue,
                paddingRight: this.paddingRightValue,
                color: '#222',
                fontSize: 15,
              }}
              numberOfLines={1}>
              {this.props.question}
            </Text>
            <Text
              style={{
                paddingLeft: this.paddingLeftValue,
                paddingRight: this.paddingRightValue,
                height: 40,
                color: '#222',
              }}
              numberOfLines={2}>
              {changeHTMLToText(this.props.postingAbbr)}
            </Text>
          </View>
          <View
            style={{
              paddingLeft: this.paddingLeftValue,
              paddingRight: this.paddingRightValue,
              paddingTop: 3,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Text style={this.bottomTextStyle}>
              {this.props.likeNum +
                '赞    ' +
                this.props.starNum +
                '收藏    ' +
                this.props.replyNum +
                '回复    '}
            </Text>
            <Text style={this.bottomTextStyle}>{this.props.postingTime}</Text>
          </View>
        </View>
      </View>
    );
  };
}

export {ActivitySection};
