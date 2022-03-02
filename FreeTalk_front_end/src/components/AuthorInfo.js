import React from 'react';
import {Text, View} from 'react-native';
import {Button, Icon} from 'react-native-elements';
import {Avatar} from 'react-native-elements/dist/avatar/Avatar';

export class AuthorInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      navigation: props.navigation,
    };
  }

  renderAuthorName = () => {
    return (
      <Text style={{fontSize: 16}} numberOfLines={1}>
        {this.props.authorName}
      </Text>
    );
  };

  renderAuthorDescription = () => {
    return (
      <Text
        style={{
          fontSize: 13,
          color: '#888',
        }}
        numberOfLines={1}>
        {this.props.authorDescription}
      </Text>
    );
  };

  renderFollowButton = () => {
    if (this.props.isMe) {
      return <View />;
    }
    if (!this.props.authorFollowed) {
      return (
        <Button
          icon={<Icon name={'add'} color={'white'} size={14} />}
          title={'关注'}
          onPress={() => {
            this.props.followChange();
            console.log('Follow the author.');
          }}
          containerStyle={{
            width: 60,
            height: 45,
          }}
          buttonStyle={{
            padding: 5,
          }}
          titleStyle={{
            fontSize: 14,
          }}
        />
      );
    } else {
      return (
        <Button
          title={'已关注'}
          onPress={() => {
            this.props.followChange();
            console.log('Not follow the author.');
          }}
          containerStyle={{
            width: 60,
          }}
          buttonStyle={{
            padding: 5,
            backgroundColor: '#afafaf',
          }}
          titleStyle={{
            color: '#8f8f8f',
            fontSize: 14,
          }}
        />
      );
    }
  };

  render = () => {
    return (
      <View
        style={{
          backgroundColor: 'white',
          padding: 0,
          marginTop: 0,
          flexDirection: 'row',
          justifyContent: 'space-between',
          height: 70,
        }}>
        <View
          style={{
            padding: 10,
            height: 70,
          }}>
          <Avatar
            rounded
            source={{uri: this.props.authorAvatarUri}}
            onPress={() => {
              this.state.navigation.navigate('GuestInfo', {
                userId: this.props.userId,
              });
            }}
            size={'medium'}
          />
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'space-around',
            paddingTop: 10,
            paddingBottom: 18,
            width: '100%',
          }}>
          {this.renderAuthorName()}
          {this.renderAuthorDescription()}
        </View>
        <View
          style={{
            height: 35,
            width: 60,
            marginRight: 15,
            alignSelf: 'center',
          }}>
          {this.renderFollowButton()}
        </View>
      </View>
    );
  };
}
