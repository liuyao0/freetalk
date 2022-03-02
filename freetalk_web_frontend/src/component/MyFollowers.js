import React from "react";
import {
    localhost,
    localhost_frontend
} from "../App";
import {
    List,
    Avatar
} from 'antd';
import {gotoSelfCenter} from "../utils/redirection";

export class MyFollowers extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            userId:props.userId,
            users:[],
        }
    }

    componentDidMount() {
        fetch('http://'+localhost+'/getAllUserFollowingMe?userId='+this.state.userId, )
            .then(response => response.json())
            .then(data => {
                this.setState({
                    users: data,
                });
            })
            .catch(function (ex) {
                console.log('parsing failed', ex);
            });
    }


    render() {
        return (
            <List
            itemLayout="horizontal"
            dataSource={this.state.users}
            renderItem={item => (
                <List.Item>
                    <List.Item.Meta
                        avatar={<Avatar src={item.image} />}
                        title={
                            <div
                                onClick={()=> {
                                    if(item.userId===localStorage.getItem("userId"))
                                        gotoSelfCenter()
                                    else
                                        window.location.href=('http://'+localhost_frontend+'/?#/otherUserSelfCenter/userId='+item.userId);
                                    window.location.reload()
                                }}
                                style={{fontWeight:'bold',textAlign:'left'}}
                            >{item.username}</div>

                        }
                        description={
                            <div style={{background: "white", textAlign: 'left'}}>{item.description}</div>
                        }
                    />
                </List.Item>
            )}
        />

        );
    }
}
