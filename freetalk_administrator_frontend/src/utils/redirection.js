import {ip, localhost_frontend} from "../App";

export function gotoHottestTopicsView(){
    window.location.href="http://"+localhost_frontend+"/?#/HottestTopics";
}

export function gotoNewestTopicsView(){
    window.location.href="http://"+localhost_frontend+"/?#/NewestTopics";
}

export function gotoSelfCenterView(){
    window.location.href="http://"+localhost_frontend+"/?#/SelfCenter";
}

export function gotoUserManagementView(){
    window.location.href="http://"+localhost_frontend+"/?#/UserManagement";
}

export function gotoMarkedTopicsView(){
    window.location.href="http://"+localhost_frontend+"/?#/MarkedTopics";
}
export function gotoLogInView(){
    window.location.href="http://"+localhost_frontend+"/?#/logIn";
}
export function gotoPrometheus(){
    window.location.href="http://"+ip+':9090';
}
export function gotoGrafana(){
    window.location.href="http://"+ip+':3000';
}
