import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {Icon} from 'react-native-elements';

class PostingHead extends React.Component{
    constructor(props) {
        super(props);
    }


    static defaultProps={
        onPressRight:()=>{console.log('Press Right.')},
    }

    renderLeftButton=()=>{
        return(
            <TouchableOpacity
                style={{
                        width:40,
                        height:45,
                }}
                onPress={this.props.onPressLeft}
            >
                <Icon
                    name={'chevron-left'}
                    size={37}
                    color={'#555'}
                    style={{paddingTop:3}}
                />
            </TouchableOpacity>
        )
    }

    renderTitle=()=>{
        return(
            <View
                style={{
                    height:40,
                    flex:1,
                    flexDirection:'row'
                }}
            >
                <Text
                    style={{
                        textAlign:'left',
                        textAlignVertical:'center',
                        flex:1,
                        padding:2
                    }}
                    numberOfLines={2}
                >
                    {this.props.title}
                </Text>
            </View>
        )
    }

    renderRightButton=()=>{
        if(this.props.showRight)
            return(
                <TouchableOpacity
                    style={{
                        width:40,
                        height:33,
                    }}
                    onPress={this.props.onPressRight}
                >
                    <Icon
                        name={"menu"}
                        size={30}
                        color={'#555'}
                        style={{
                            paddingTop:2
                        }}
                    />
                </TouchableOpacity>
            )
        else
            return (
                <View
                    style={{
                        height:45,
                        width:15
                    }}
                />
            )
    }

    render=()=>{
        return(
            <View
                style={{
                    height:54,
                    width:'100%',
                    flexDirection:"row",
                    alignItems:'center',
                    paddingTop:7,
                    paddingBottom:7,
                    backgroundColor:'white',
                    borderBottomWidth:0.5,
                    borderBottomColor:'#e4e4e4'
                }}
            >
                {this.renderLeftButton()}
                {this.renderTitle()}
                {this.renderRightButton()}
            </View>
        )
    }
}

export {PostingHead}
