import React from 'react';
import 'antd/dist/antd.css';
import '../index.css'
import {Route, HashRouter} from "react-router-dom";
import {UserPrivateChatView} from "./UserPrivateChatView";
import {HottestTopicsView} from "./HottestTopicsView";
import {RecommendTopicsView} from "./RecommendTopicsView";
import {SelfCenterView} from "./SelfCenterView";
import {PostNewTopicView} from "./PostNewTopicView";
import {LogInView} from "./LogInView";
import {OtherUserSelfCenterView} from "./OtherUserSelfCenterView";
import {AnswerView} from "./AnswerView";
import {TopicDetailView} from "./TopicDetailView";
import {DownLoadApkView} from "./DownLoadApkView";
import {NewTopicView} from "./NewTopicView";
import {FocusTopicsView} from "./FocusTopicsView";


export class Routers extends React.Component{
    constructor(props) {
        super(props);
        this.state={
        }
    }

    render() {
        let userId=localStorage.getItem('userId');
        if(userId===null)
            return(
                <HashRouter>
                    <Route path="/" component={LogInView} exact />
                    <Route path='/privateChat'>
                        <UserPrivateChatView/>
                    </Route>
                    <Route path='/hotTopics'>
                        <HottestTopicsView/>
                    </Route>
                    <Route path='/recommendTopics'>
                        <RecommendTopicsView/>
                    </Route>
                    <Route path='/selfCenter'>
                        <SelfCenterView/>
                    </Route>
                    <Route path='/postTopic'>
                        <PostNewTopicView/>
                    </Route>
                    <Route path='/answer'>
                        <AnswerView/>
                    </Route>
                    <Route path='/logIn' exact>
                        <LogInView/>
                    </Route>
                    <Route path='/otherUserSelfCenter'>
                        <OtherUserSelfCenterView/>
                    </Route>
                    <Route path='/topicDetail'>
                        <TopicDetailView/>
                    </Route>
                    <Route path='/downloadApk'>
                        <DownLoadApkView/>
                    </Route>
                    <Route path='/newTopic'>
                        <NewTopicView/>
                    </Route>
                    <Route path='/focusTopic'>
                        <FocusTopicsView/>
                    </Route>
                </HashRouter>
        );

        else
            return (
                <HashRouter>
                    <Route path="/" component={HottestTopicsView} exact />
                    <Route path='/privateChat'>
                        <UserPrivateChatView/>
                    </Route>
                    <Route path='/hotTopics' exact>
                        <HottestTopicsView/>
                    </Route>
                    <Route path='/recommendTopics'>
                        <RecommendTopicsView/>
                    </Route>
                    <Route path='/selfCenter'>
                        <SelfCenterView/>
                    </Route>
                    <Route path='/postTopic'>
                        <PostNewTopicView/>
                    </Route>
                    <Route path='/answer'>
                        <AnswerView/>
                    </Route>
                    <Route path='/logIn'>
                        <LogInView/>
                    </Route>
                    <Route path='/otherUserSelfCenter'>
                        <OtherUserSelfCenterView/>
                    </Route>
                    <Route path='/topicDetail'>
                        <TopicDetailView/>
                    </Route>
                    <Route path='/downloadApk'>
                        <DownLoadApkView/>
                    </Route>
                    <Route path='/newTopic'>
                        <NewTopicView/>
                    </Route>
                    <Route path='/focusTopic'>
                        <FocusTopicsView/>
                    </Route>
                </HashRouter>
            );
    }
}

