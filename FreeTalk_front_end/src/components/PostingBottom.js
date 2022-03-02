import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {Icon} from 'react-native-elements';

class PostingBottom extends React.Component{
    constructor(props) {
        super(props);
        console.log(props);
    }

    buttonIconSize=22
    buttonNumColor='#444'

    buttonViewStyle={
        width:'20%',
        marginTop:3,
    }

    buttonNumberStyle={
        textAlign:"center",
        fontSize:12,
        color:this.buttonNumColor
    }


    like=()=>{
        this.props.likeChange();
    }

    star=()=>{
        this.props.starChage();
    }

    reply=()=>{
        this.props.openReply();
    }
    render=()=>{
        return(
            <View
                style={{
                    height:46,
                    flexDirection:"row",
                    justifyContent:"space-around",
                    backgroundColor:'white',
                    borderColor:'#eee',
                    borderTopWidth:1,
                    borderBottomWidth:1,
                    borderStyle:'solid'

                }}
            >
                <TouchableOpacity
                    style={this.buttonViewStyle}
                    onPress={this.like}
                >
                    <View>
                        <Icon type='simple-line-icon' name={"like"} size={this.buttonIconSize} color={this.props.like?'#2289DC':"#444"}/>
                        <Text
                            style={this.buttonNumberStyle}
                        >
                            {this.props.likeNum}
                        </Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    style={this.buttonViewStyle}
                    onPress={this.star}
                >
                    <View>
                        <Icon type={'simple-line-icon'} name={"heart"} size={this.buttonIconSize} color={this.props.star?'#FF6A6A':"#444"} />
                        <Text
                            style={this.buttonNumberStyle}
                        >
                            {this.props.starNum}
                        </Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    style={this.buttonViewStyle}
                    onPress={this.reply}
                >
                    <View>
                        <Icon type={'simple-line-icon'} name={"speech"} size={this.buttonIconSize} color={'#444'}/>
                        <Text
                            style={this.buttonNumberStyle}
                        >
                            {this.props.replyNum}
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }
}

export {PostingBottom}
