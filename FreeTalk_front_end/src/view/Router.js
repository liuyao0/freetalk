import React from "react";
import Home from "./Home";
import {LogIn} from "./LogIn";
import DetailedTopicView from "./DetailedTopicView";
import posting from "./PostingView";
import PostTopic from "./PostTopic";
import AnswerTopic from "./AnswerTopic";
import Message from "./Message";
import ChatPrivate from "./ChatPrivate";
import Host from "./Host";
import e from "./edit";
import PostingView from "./PostingView";
import Search from "./Search";
import {NavigationContainer} from "@react-navigation/native";
import {createStackNavigator} from "@react-navigation/stack";
import {Register} from "./Register";
import {ChoosePhoto} from "./ChoosePhoto";
import {Text, ToastAndroid, View} from "react-native";
import AsyncStorage from '@react-native-community/async-storage';
import GuestInfo from "../components/GuestInfo";
import EditPassword from "./EditPassword"
import ScannerScreen from "./QR";
import {ConfirmWebLogIn} from "./ConfirmWebLogIn";
import {QRScannerView} from "react-native-qrcode-scanner-view";
const RootStack = createStackNavigator();

export class Router extends React.Component {
    constructor(props) {
        super(props);
        this.state={load:false}
    }

    componentWillMount() {
        AsyncStorage.getItem('userid', (error, result) => {
            if (result === null)
                this.setState({
                    logInOrNot: false,
                    load: true
                })
            else
                this.setState({
                    logInOrNot: true,
                    load: true
                })
        });
    }


    render() {
        if(!this.state.load)
            return <View/>
        if(this.state.logInOrNot)
            return (
                <NavigationContainer>
                    <RootStack.Navigator mode="modal" headerMode="none"  >
                        <RootStack.Screen name="Home" component={Home} />
                        <RootStack.Screen name="DetailedTopic" component={DetailedTopicView} />
                        <RootStack.Screen name="Post" component={posting} />
                        <RootStack.Screen name="PostTopic" component={PostTopic} />
                        <RootStack.Screen name="Answer" component={AnswerTopic} />
                        <RootStack.Screen name="Message" component={Message} />
                        <RootStack.Screen name="ChatPrivate" component={ChatPrivate} />
                        <RootStack.Screen name="Host" component={Host} />
                        <RootStack.Screen name="Edit" component={e} />
                        <RootStack.Screen name="EditPassword" component={EditPassword} />
                        <RootStack.Screen name="PostingView" component={PostingView} />
                        <RootStack.Screen name="Search" component={Search} />
                        <RootStack.Screen name="Login" component={LogIn} />
                        <RootStack.Screen name="Register" component={Register} />
                        <RootStack.Screen name="ChoosePhoto" component={ChoosePhoto} />
                        <RootStack.Screen name="GuestInfo" component={GuestInfo} />
                        <RootStack.Screen name="QR" component={ScannerScreen} />
                        <RootStack.Screen name="ConfirmWebLogIn" component={ConfirmWebLogIn} />
                    </RootStack.Navigator>
                </NavigationContainer>
        );
        else
            return (
                <NavigationContainer>
                    <RootStack.Navigator mode="modal" headerMode="none"  >
                        <RootStack.Screen name="Login" component={LogIn} />
                        <RootStack.Screen name="Register" component={Register} />
                        <RootStack.Screen name="ChoosePhoto" component={ChoosePhoto} />
                        <RootStack.Screen name="Home" component={Home} />
                        <RootStack.Screen name="DetailedTopic" component={DetailedTopicView} />
                        <RootStack.Screen name="Post" component={posting} />
                        <RootStack.Screen name="PostTopic" component={PostTopic} />
                        <RootStack.Screen name="Answer" component={AnswerTopic} />
                        <RootStack.Screen name="Message" component={Message} />
                        <RootStack.Screen name="ChatPrivate" component={ChatPrivate} />
                        <RootStack.Screen name="Host" component={Host} />
                        <RootStack.Screen name="Edit" component={e} />
                        <RootStack.Screen name="EditPassword" component={EditPassword} />
                        <RootStack.Screen name="PostingView" component={PostingView} />
                        <RootStack.Screen name="Search" component={Search} />
                        <RootStack.Screen name="GuestInfo" component={GuestInfo} />
                        <RootStack.Screen name="QR" component={ScannerScreen} />
                        <RootStack.Screen name="ConfirmWebLogIn" component={ConfirmWebLogIn} />
                    </RootStack.Navigator>
                </NavigationContainer>
            );
    }
}
