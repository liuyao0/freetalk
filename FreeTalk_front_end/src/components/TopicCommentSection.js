import React from 'react';
import {Text, View} from 'react-native';
import {Avatar} from 'react-native-elements/dist/avatar/Avatar';
import {changeHTMLToText} from './MyTopic';

export class TopicCommentSection extends React.Component {
    constructor(props) {
        super(props);
    }

    paddingLeftValue = 15;
    paddingRightValue = 15;
    bottomTextStyle = {
        color: '#666',
        fontSize: 13,
    };

    renderHot = ()=>{
        if (this.props.showHot===true)
            return (
                <Text>    {'热度：'}
                    {this.props.hot}</Text>
            )
        else return null;
    }

    render = () => {
        return (
            <View
                style={{
                    backgroundColor: 'white',
                }}>
                <Text style={{paddingLeft: this.paddingLeftValue, fontSize: 18}}>
                    {this.props.topicTitle}
                </Text>
                {this.renderHot()}
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
                        source={{uri:this.props.authorAvatarUri}}
                    />
                    <Text
                        style={{
                            height: 35,
                            lineHeight: 35,
                            paddingLeft: 8,
                            color: '#444',
                            fontSize: 13,
                        }}>
                        {this.props.authorName}
                    </Text>
                </View>
                <Text
                    style={{
                        paddingLeft: this.paddingLeftValue,
                        paddingRight: this.paddingRightValue,
                        color: '#222',
                    }}
                    numberOfLines={4}>
                    {changeHTMLToText(this.props.postingAbbr)}
                </Text>
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
                        ' 赞    ' +
                        this.props.starNum +
                        ' 收藏    ' +
                        this.props.replyNum +
                        ' 回复    ' }
                    </Text>
                </View>
            </View>
        );
    };
}
