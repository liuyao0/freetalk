import React from "react";
import {Dimensions, NativeAppEventEmitter, View} from "react-native";
import AsyncStorage from '@react-native-community/async-storage';
import UsersIFollows from "./UsersIFollows";
import MyTopic, {styles} from "./MyTopic";
import {SelfInfo} from "./SelfInfo";
import {SceneMap, TabView} from "react-native-tab-view";
import {MyComment} from "./MyComment";
import MyStarTopic from "./MyStarTopic";
import Icon from "react-native-vector-icons/FontAwesome";
import {FAB} from "react-native-elements";
const initialLayout = {width: Dimensions.get('window').width};

export default class HostComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            navigation: props.navigation,
            index:0,
            routes:[
                {key: 'first', title: '提问'},
                {key: 'second', title: '回答'},
                {key: 'third', title: '关注'},
                {key: 'forth', title: '收藏'},
                {key: 'fifth', title: '粉丝'},
                {key: 'sixth', title: '关注的人'},
            ],
            userId:0
        }
    }

    getData=()=>{
        AsyncStorage.getItem('userid', (error, result) => {
            this.setState({
                userId:parseInt(result)
            })
        });
    }

    componentWillMount() {
        this.getData()
        this.listener=NativeAppEventEmitter.addListener("HostPageRefresh",()=>{
            this.getData()
        })
    }

    componentWillUnmount() {
        this.listener.remove()
    }


    setIndex=(num)=>{
        this.setState({
            index:num
        })
    }


    render() {

        const renderScene = SceneMap({
            first: ()=><MyTopic navigation={this.state.navigation} userId={this.state.userId}/>,
            second: ()=><MyComment navigation={this.state.navigation} type={0} userId={this.state.userId}/>,
            third: ()=><MyStarTopic navigation={this.state.navigation} userId={this.state.userId}/>,
            forth: ()=><MyComment navigation={this.state.navigation} type={1} userId={this.state.userId}/>,
            fifth: ()=><UsersIFollows navigation={this.state.navigation} type={0} userId={this.state.userId}/>,
            sixth: ()=><UsersIFollows navigation={this.state.navigation} type={1} userId={this.state.userId}/>,
        });
        const index=this.state.index
        const routes=this.state.routes

        return (
            <View style={{flex: 1, backgroundColor: 'white'}}>
                <SelfInfo navigation={this.state.navigation} userId={this.state.userId}/>
                <TabView
                    navigationState={{index, routes}}
                    renderScene={renderScene}
                    onIndexChange={(num)=>this.setIndex(num)}
                    initialLayout={initialLayout}
                    style={styles.container}
                />
                <FAB
                    placement={"right"}
                    color={"#22a5ec"}
                    icon={
                        <Icon
                            type="material-community"
                            name="qrcode"
                            size={25}
                            color="white"
                        />
                    }
                    onPress={() => {
                        this.props.navigation.navigate('QR');
                    }}

                />
            </View>
        )
    }
}
