import React from 'react';
import {Text, View} from 'react-native';
import {Avatar} from 'react-native-elements/dist/avatar/Avatar';

export class UserInfoNo extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            authorName: props.authorName,
            authorDescription: props.authorDescription,
            isMe: props.isMe,
            type:props.type,
            authorFollowed: props.authorFollowed,
            authorAvatarUri:props.authorAvatarUri,
            userId:props.userId,
            authorId:props.authorId
        }
    }


    renderAuthorName=()=>{
        return(<Text
            style={{fontSize:16}}
            numberOfLines={1}
        >
            {this.state.authorName}
        </Text>)
    }

    renderAuthorDescription=()=>{
        return(<Text
                style={{
                    fontSize:13,
                    color:"#888"
                }}
                numberOfLines={1}
            >
                {this.state.authorDescription}
            </Text>
        )
    }


    render=()=>{
        return(
            <View
                style={{
                    backgroundColor:'white',
                    padding:0,
                    marginTop:0,
                    flexDirection:"row",
                    justifyContent:"space-between",
                    height:70
                }}
            >
                <View
                    style={{
                        padding:10,
                        height:70
                    }}
                >
                    <Avatar
                        rounded
                        source={{uri:this.state.authorAvatarUri}}
                        onPress={() => console.log("Press the Avatar.")}
                        size={"medium"}
                    />
                </View>
                <View
                    style={{
                        flex:1,
                        flexDirection:"column",
                        justifyContent:"space-around",
                        paddingTop:10,
                        paddingBottom:18,
                        width:"100%"
                    }}
                >
                    {this.renderAuthorName()}
                    {this.renderAuthorDescription()}
                </View>
                <View
                    style={{
                        height:35,
                        width:60,
                        marginRight:15,
                        alignSelf:"center"
                    }}
                >

                </View>
            </View>
        )
    }
}
