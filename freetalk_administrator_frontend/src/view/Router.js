import React from 'react';
import 'antd/dist/antd.css';
import '../index.css'
import {Route, HashRouter} from "react-router-dom";
import HottestTopics from "./HottestTopics";
import NewestTopics from "./NewestTopics";
import UserManagementView from "./UserManagementView";
import SelfCenterView from "./SelfCenterView";
import MarkedTopicsView from "./MarkedTopicsView";
import TopicDetailView from "./TopicDetailView";
import {LogInView} from "./LogInView";


export class Routers extends React.Component{
    constructor(props) {
        super(props);
        this.state={
        }
    }

    render() {
        let userId=localStorage.getItem('adUserId');
        if(userId===null)
            return(
                <HashRouter>
                    <Route path="/" component={LogInView} exact />
                    <Route path='/HottestTopics'>
                        <HottestTopics />
                    </Route>
                    <Route path='/NewestTopics' >
                        <NewestTopics />
                    </Route>
                    <Route path='/UserManagement' >
                        <UserManagementView />
                    </Route>
                    <Route path='/SelfCenter'>
                        <SelfCenterView />
                    </Route>
                    <Route path='/MarkedTopics' >
                        <MarkedTopicsView />
                    </Route>
                    <Route path='/topicDetail'>
                        <TopicDetailView/>
                    </Route>
                    <Route path='/logIn'>
                        <LogInView/>
                    </Route>
                </HashRouter>
            );

        else
            return (
                <HashRouter>
                    {/*<Route path="/" component={LogInView} exact />*/}
                    <Route path="/" component={HottestTopics} exact />
                    <Route path='/HottestTopics'>
                        <HottestTopics />
                    </Route>
                    <Route path='/NewestTopics' >
                        <NewestTopics />
                    </Route>
                    <Route path='/UserManagement' >
                        <UserManagementView />
                    </Route>
                    <Route path='/SelfCenter'>
                        <SelfCenterView />
                    </Route>
                    <Route path='/MarkedTopics' >
                        <MarkedTopicsView />
                    </Route>
                    <Route path='/topicDetail'>
                        <TopicDetailView />
                    </Route>
                    <Route path='/logIn'>
                        <LogInView/>
                    </Route>
                </HashRouter>
            );
    }
}

