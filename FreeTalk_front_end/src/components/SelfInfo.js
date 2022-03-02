import React from "react";
import { NativeAppEventEmitter, Text, View,ToastAndroid} from "react-native";
import AsyncStorage from '@react-native-community/async-storage';
import {Avatar, Button, Icon} from "react-native-elements";
import {localhost} from "../../App";

export class SelfInfo extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            image:'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gJASUNDX1BST0ZJTEUAAQEAAAIwAAAAAAIQAABtbnRyUkdCIFhZWiAAAAAAAAAAAA' +
                'AAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTL' +
                'QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA' +
                'AAAAAAlkZXNjAAAA8AAAAHRyWFlaAAABZAAAABRnWFlaAAABeAAAABRiWFlaAAABj' +
                'AAAABRyVFJDAAABoAAAAChnVFJDAAABoAAAAChiVFJDAAABoAAAACh3dHB0AAABy' +
                'AAAABRjcHJ0AAAB3AAAAFRtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAFgAAAAcAHMAUgB' +
                'HAEIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA' +
                'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFhZWiAAAAAAAABvogAAOPUAAAOQW' +
                'FlaIAAAAAAAAGKZAAC3hQAAGNpYWVogAAAAAAAAJKAAAA+EAAC2z3BhcmEAAAAAAAQAAAACZ' +
                'mYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABYWVogAAAAAAAA9tYAAQAAAADTLW1sdWMAAAAAAA' +
                'AAAQAAAAxlblVTAAAAOAAAABwARwBvAG8AZwBsAGUAIABJAG4AYwAuACAAMgAwADEANgAAAAAA' +
                'AAAAAAAAAAAAAAAAAAAAAAAAAP/bAEMAAwICAwICAwMDAwQDAwQFCAUFBAQFCgcHBggMCgwMCw' +
                'oLCw0OEhANDhEOCwsQFhARExQVFRUMDxcYFhQYEhQVFP/bAEMBAwQEBQQFCQUFCRQNCw0UFBQUF' +
                'BQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFP/AABEIAIQAhAMB' +
                'IgACEQEDEQH/xAAdAAABBAMBAQAAAAAAAAAAAAAAAwUGBwECBAgJ/8QAOBAAAgEDAgQEBAUDAgcA' +
                'AAAAAQIDAAQRBSEGEjFBBxNRYQgicYEUIzKRwTNCsVKhFhhygtHh8P/EABoBAAIDAQEAAAAAAAA' +
                'AAAAAAAADAQIEBQb/xAAlEQACAgICAQQCAwAAAAAAAAAAAQIRAyEEMRITIjJBFFEFQmH/2gAMAw' +
                'EAAhEDEQA/APbtFFFbQCj0oooF+LD0orHMKVit5rj+nE7/AEFBFCdFdh0a7IB5Me2TSEtnLAfmjI' +
                '+lRaCqEqKMjPX0oqQCiiigAooooAKKKKACiij0oAKKKKCUFYb9PTNZpW1VXuFDYx6VDdIYdWmaas' +
                'h8yUZx0Wn1JFReVV5cdhTU90sbBQeX0pYXqYzze9ZG2+yKHCRxvjv39K4bi9jhIVyGz1pCe9wMZ3' +
                'qvvEPxC0rg2K3m1a/hsIJGK+ZM4QZ2xuKraRPix54utdZtFjvtCW2vEG81ncZUsM/2MOh+oIpLSOI' +
                'ItSHlSobS/VQ0lpIwLpn6dR7mjh7ieLUwDDMssbDmUg5GMdKbtZ4P0ptcXXY7d31RV5UkWQrkde23' +
                '7VdTcQUfJ2SYHNFR/SeJhNdizv4/wd226Kxyr+wPTNP/ADYOK0xkpK0UlFxdMzRRRViKCiiiggKKK' +
                'KACig7Vp5o96AN6jnC+qnWOLtblV2a0swtrHgYBbq5Hrvt9qf5WJiYr1Heob4deZBb6iZZYZJJbiS' +
                'TNvsBzHPT19+9JyOkhpLLy7HmH8zkUevem3SOP9C1e9uLC11K2uLq1OJoo5AWjO+MjqOhpu4ngubh' +
                'AsEnI52YgbkV428MPhd4+4R+ILUOJJbvm0VZriZbwT8z3ayD9Dr1zk5Pugx61mlb6LR72ezuMfEjS' +
                'uDrdZ766jgiLBS7MAAScD9zVA/EFwZJ8Q3DVnaaXq66TqNtcLdWd2qeaObkYYIB6FXO4po8YPDXxA4' +
                '7vba10+zt7bToZRK80sxWTnCkAjAOBuffptUy8FvBG94QY3+r6pPd30hBNusreSmOygn+KWrtDbXZLf' +
                'AHw41jw58P9J0nX9Qi1XUrZWR7qBCqFSxKqAeyggdulWnLCtxARzIu3XvScNzGkaoRnHUN1rYXKICIw' +
                'futaGk0JTp0RXX+Fbi8MLwTqixNzliMb+2MU86Nr9vdSfgZLmI38S5aMOMkeuK7H1JXUoE5iRiqS8X/' +
                'C3WdVv7bXOGUkg1CzZZYls7mOOTnHrlV5l33BY+wzS4r03aLuTmvFl/KcqKzUc4A4hvOJOGLa61G1Wz' +
                '1JcxXUCMCokGxIx2PX26dqkdbk7VCNhRRRUgFFFFBFgdxSflY3zSlB6GggQkHNGw65GKjWhRC0VYVHM' +
                'SSGcAAM2dyQOlScnAydhXDb6atmrBTlWYv9ycn/AHNZs26QzHpuxSSIfqIBx6UpDGkBZsfN79qw0pU4xk' +
                'etISygLyg9eppZYzM6FeYY5c03fiB5jBdiKUeTAKk7VwvOiSNnc470tsYla2dEl8HUDHLIB1JwK0Oopy/K3' +
                'LKPfO9NF1dyRuChBT+4GuOfUIpGKsvKxGObG2alSoo1R3X+rxTMyzQeaT6HArs0m9ZMKY+VOwO/81Brv' +
                'VIoph5hIY/p/wDGR/NPGk6xzkKVkJ7b5olMvFIdbTVb7QeOIbadw2j6kvlxKsIXyp+oHMB0IBG/cip7T' +
                'Dot+jskcvKT1AODUhkTl+YZKnfIp2HIpe0pNVs0oorUPk9K1CjaiiigAoPQ0UHoKComoyemaRmkZ2xsM' +
                'd66Iz+W5zjamWe7WAnckk1kyvaHY1di73BLEL0zt7Vz3EnMCy9BSccheMyE4wNhSMs2UKgbdzS70XrYhd' +
                'yH5T2pukBeZiDnuB7V03suMqN+UZrmT9e/XOQaU+hiOa8cxY5t1amW7l+blLfKThSeuKeNZblTyz22qN' +
                'TGPVbGR45MOpxgHuOtUv8AZbsQEtuZDFOChOxJ6Z/iknuW0+5VWk/Kf9Lr+4/xSc0qvZrKeYyIN2HXHr' +
                'UdvdSKTPZy87qWDRS8n6SDnBx2OKq3otGDki0+HtYeVFUsrlCOU43wasrTbg3FkAwztnrVEcLTvDdeXk' +
                'kbgEHqKurg9iYiGyRy96rjye5F8mOo7HGkx1FKnqaSHUV2zmMUooooJCsN+k/Ss1hjgGgqaqfym96jWqQc' +
                'sg5v0g5xUlAxGaZtft/yDIM471lzrVodhkroahfqAEG2PftWr3qlS2eUDfamqVgDk9DSEkuIGyxIIxmsa' +
                'kaGjsuLlTEzqcnofakbe6824jUgDmBP0NM8F1hXTJx23pXS7sCUZPN6EipvyCqHHX42MGf7zsCKhpdrbL' +
                'j5eZzz+/YGpjq1wJ4CM7VFbhFkuihI5c96q4kr9jNfSSQs0eQUPNysvUEnb+aaJ5FmlDEq8iKDkfeu28k' +
                'f8QSWyq/pX0pktJmF2zsuTncqOv8A91pMjXjJrwhEGl8tiys+49hV28GxtHbAt/p6VTXhtJba7fyrazJ' +
                'MbVgkqIcmM4zg+nWr006IWcHKOuKtjhckU5EtUhQ9aSUZNKVgADfpXbOSzNFa84+9FBJtketYYZFJ1nmPrQ' +
                'LToxk9KTnhE8LRncMKUoGxqGk1TIWnaIXrekyWZYqvOnaofLqohV1c8oBwc9quNoklyHUMp7Gohr3h9bXp' +
                'laP5PMB/eufPE47j0boZPLTKyv8AWobWJpHbC4O/qKa7HjS2kXMdwrr2yarX4yoNc4D8OLCbTbtbW+lv1i' +
                'MYCkyxlHPfoAQB9WFefPBXxysbjQ0tuJLm7bULYsTLEhla4UtkegBGcbnfFZpPxVGiK8nSPbD8ZxleRXzX' +
                'E2pveyBkDErvyr3NURD4/aVBEW03hq+1FuivfTLAB74UN/kVx/8AMDxnqjGLTrew0dOgazt1ldd+7ScwP1' +
                'AHvWV54/TNC48z0FFpl3eTBmjdcnbIpk8T9R0bh3w74hiOu6dY6tLZSQwJNcqHV2XlBCg822c7DNeadc47' +
                '1nWb2ytNc1+/uZZWaQpLIxUe6oDyqN/2B2reDSOeK4tVjWV/MIbnTLEA4wMYwM/4o9S1aGRxuLpkV8P/AB' +
                'H4n8PPGCfW0uor+4t7iO2ivY4XEF7GrBC3KcNiRObsCWOTvmvaOofFzqhum/C6TY2kLgGOK6LySqPchlBP0' +
                'G1eQNd0C/h1PSrpIEndZhEIFyccw5UfGR0crv0BNSe54Y1GV1W5vQzyAfokyAenp2xjp2pcuRNL2uhkOPBy92' +
                'z0Jf8AxO6/OpePULS2QMBIsMQJXfB2OT6io9qPxCajegq+s3pds8iqzqH6+gA7VT9rwPePbykRtcTIwVoomy5H' +
                '+vHXAHatE4EnuHPkwzOFGc/2jbfJrJLLmm9ybNcceGPUUWQ3ind3LF1u+Reg/EyYZsd/mYHFFQWfgrStOESX+uWm' +
                'lXLxhzBcSFWwejfQ4oqtZP8AS9wPpLSN3dR2NpPczNyRQo0jseygZJqitZ+Jdw/l2NhFbMc/18yEDGc7YHT7e9VZ' +
                'rvjff8XJOvnT6gj4WWGSUxwcuRt5Q2yQD2PbJOa9HPn4Y/F2eZhwcr29FtaD8TqazeSSHQjDpfMVSVrgCTA6kgj0xtS' +
                '198UelxymCz0qSe45S3LJcKoH7A15e4i4rkluC0duUJA5THIchvcfz7iowuo3FzqBuSrRcuNhIwBxgY6/f7Vysn8jOO' +
                'kzp4+FjSXkj0XrXxRcTz3Mz20Fno8MYaNVlj5uc52YFvodsY3qrOJfG3iniS5kgu+LdREYOJY7N/JUHGeUqmAev0/a' +
                'opLa3d/cyFY3QhvkQ/MwHLhsn/3sfpt0T8Im5lkmHMZJMNJGY8Fmzvvv/uemKwz5ObJe2b4YcOLaiiveOoY9U0bULt' +
                'GZrmNfNDTyFi5U8w+m61UnAi/gNQMtk7PFJO8IDKN1yro2fXBzj2+1eprHgqLm8qaMMHDZjcfqG4/mkfBz4W9Y/wCJ' +
                'dW0mWJJLn8u8i86IxwiHojjI9fl/7TjIBxp4/nLFKLVmbO4QyxmuiHTafc3z45SgA5RzkhsH1A26U6aDpEmnyNKIw6' +
                'uCGUDP3Jr13oHwooiodX1ZevM0drFzHP8A1Nj/ABVU/EvwjqHhXeaTb8Llpre9Zt3tonkDYHy55cDoO2etK/Bz2pPR' +
                'b8zE3SK/j4KbiKeKaLMUkIDc5TIG5JUgt3yfTfFTvhPwo1biC0W20nzb5VJDXNrIiBD6M3N7966fAbwA1fxFabUOOj' +
                'ffgh/Stp3ZVJ9l6AfavTHh34L6L4YG4GivcRRTtzPEz5X9q6uHhSrbMOXmxT0tlLSfDdqelWSXlxbW88itFB5SSlpC' +
                'HkVCwAUqAA2T7LU80X4ZdD0x/wA+7eaPGCkUSpn03Jb3q6iTjHpSeN66UeHhg+rML5eWa0iG6X4N8JWAHNpKXLqOUP' +
                'OxJx6EDAP3FSXTuF9H0kEWemWtsM835cQG+AP4FOLgkCsISNhWlYYR6RjlkyS7ZGdd8LuE+JdSk1DVNCtL29kADzSq' +
                'SxAGB/tRUpoqvo43/Uos2RaUmfNm0uZL6a3jlbd4XZnAHMcAvWlvfPFIvKkY50SViE6kqDv7DO1FFeHl9Hso/FDvr+' +
                'mwxvMwB/qhACdgPp9qdrDh60S7tlIZwWU/Ng/q+2+++9FFCVyLLo9J8EeA3CtxpVteXkdzfzPGoPnyAA7Y/sVfSrF0' +
                '/gHhzSlxa6JYx7YyYVY/ucmiivW8eEPG7PPZ5y8mrOqPhPRIZmmTSLFZW6uLZOY/fFOMVnAl4boQoLhoxEZQPmKAkh' +
                'c+gJJ+4oorUkl2ZZNtbZ098UzahwxpesX0F1e2UVzPAT5bSDPLn0oopkuikPiOkaLCiqihQBgACt1csaKKEJfyZseh' +
                'pKiirkw+xUdKKKKaMCiiilmc/9k=',
            username:"",
            oldPassword:"",
            email:"",
            description:"",
            userId:props.userId,
            navigation:props.navigation,
            fans:0,
            follows:0,
        }
    }

    getData=()=>{

        AsyncStorage.getItem('userid', (error, result) => {

            fetch('http://'+localhost+'/getUserInfo?userId='+result, {
            }).then(response => response.json())
                .then(data => {
                    this.setState({
                        image:data.image,
                        username:data.username,
                        oldPassword:data.password,
                        email:data.email,
                        description:data.description,
                        userId:data.userId,
                        follows:data.follows,
                        fans:data.fans,
                    })
                }).catch(function (e) {
                ToastAndroid.show("error:" + e,1);
            })

        });

    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            userId:nextProps.userId
        })
    }

    componentWillMount() {
        this.getData()
        this.listener1=NativeAppEventEmitter.addListener("HostPageRefresh",()=>{
            this.getData()
        })
        this.listener=NativeAppEventEmitter.addListener("userInfoRefresh",()=>{
            this.getData()
        })

    }

    componentWillUnmount() {
        this.listener.remove()
        this.listener1.remove()
    }

    render=()=>{
        return(
            <View
                style={{
                    flex: 0.2,
                    backgroundColor: 'F0F0F0',
                    alignItems: 'center',
                    borderBottomWidth: 1,
                    borderBottomColor: '#B7B7B7',
                    flexDirection: 'row',
                    paddingLeft:5,
                    paddingRight:5,
                }}>
                <Avatar
                    size="large"
                    rounded
                    source={{uri:this.state.image}}
                    activeOpacity={0.9}
                    placeholderStyle={'#FFFFFF'}
                />
                <View style={{
                    flexDirection: 'column',
                    flex: 1,
                    paddingLeft: 8,
                }}>
                    <Text h4 style={{fontSize:20}}>{this.state.username}</Text>
                    <Text
                        style={{
                            color:'#666',
                        }}
                    >
                        {this.state.fans+"粉丝  "+this.state.follows+"关注"}
                    </Text>
                    <Text>{this.state.description}</Text>
                </View>
                <Button
                    buttonStyle={{
                        backgroundColor:'white',
                        padding:4,
                    }}
                    containerStyle={{
                        alignSelf:'flex-start',
                        marginTop:3,
                        marginRight:-3,
                        height:33,
                    }}
                    titleStyle={{
                        fontSize:14,
                        color:'#444'
                    }}
                    icon={<Icon type={'antdesign'} iconStyle={{color:'#444'}} style={{paddingTop:1}} size={15} name={'right'}/>}
                    iconRight={true}
                    onPress={() => this.state.navigation.navigate('Edit')}
                    title="设置"
                />
            </View>
        )
    }
}
