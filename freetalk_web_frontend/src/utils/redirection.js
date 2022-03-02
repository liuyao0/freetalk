import {localhost_frontend} from "../App";

export function gotoPrivateChat(){
    window.location.href=("http://"+localhost_frontend+"/?#/privateChat");
}

export function gotoHotTopics(){
    window.location.href=("http://"+localhost_frontend+"/?#/hotTopics");
}

export function gotoRecommendTopics(){
    window.location.href=("http://"+localhost_frontend+"/?#/recommendTopics");
}

export function gotoSelfCenter(){
    window.location.href=("http://"+localhost_frontend+"/?#/selfCenter");
}

export function gotoPostTopic(){
    window.location.href=("http://"+localhost_frontend+"/?#/postTopic");
}

export function gotoAnswer(){
    window.location.href=("http://"+localhost_frontend+"/?#/answer");
}

export function gotoDownloadApk(){
    window.location.href=("http://"+localhost_frontend+"/?#/downloadApk");
}

export function gotoNewTopic(){
    window.location.href=("http://"+localhost_frontend+"/?#/newTopic");
}

export function gotoFocusTopic(){
    window.location.href=("http://"+localhost_frontend+"/?#/focusTopic");
}
