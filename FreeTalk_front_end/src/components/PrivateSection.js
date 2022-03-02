import React from 'react';
import {View} from 'react-native';
import {Badge, Text} from 'react-native-elements';
import {Avatar} from 'react-native-elements/dist/avatar/Avatar';

class PrivateSection extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: ' ',
            content: ' ',
            time: ' ',
            show: false,
            img: '',
        };
    }

    warn = () => {
        if (this.props.show) {
            return (
                <View>
                    <Badge value={this.props.number} status="error" />
                </View>
            );
        }
    };
    render = () => {
        return (
            <View style={{flexDirection: 'row', alignSelf: 'flex-start', flex: 1}}>
                <View style={{flex: 0.3}}>
                    <Avatar
                        size="large"
                        rounded
                        source={{
                            uri: this.props.img,
                        }}
                        activeOpacity={0.9}
                        placeholderStyle={'#FFFFFF'}
                    />
                </View>

                <View
                    style={{
                        flexDirection: 'column',
                        alignSelf: 'flex-start',
                        padding: 15,
                        flex: 1,
                    }}>
                    <Text h4>{this.props.title}</Text>
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            paddingTop: 5,
                        }}>
                        <Text numberOfLines={1}>{this.props.content}</Text>

                        <Text>{this.props.time}</Text>
                    </View>
                </View>
                {this.warn()}
            </View>
        );
    };
}

export {PrivateSection};
