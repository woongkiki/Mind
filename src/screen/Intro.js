import React, {useEffect, useState} from 'react';
import { Box, VStack, Image } from 'native-base';
import { ActivityIndicator } from 'react-native';
import { DefText } from '../common/BOOTSTRAP';
import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import AsyncStorage from '@react-native-community/async-storage';
import messaging from '@react-native-firebase/messaging';
import ToastMessage from '../components/ToastMessage';

const Intro = (props) => {

    const {navigation, member_login, member_info} = props;


    const LoginHandler = async (id) => {
       
         const token = await messaging().getToken();

         console.log("token", token);
        // console.log("token::",token);

        const formData = new FormData();
        formData.append('id', id);
        //formData.apeend('token', token);
        formData.append('appToken', token);
        formData.append('method', 'login_auto');

        const login = await member_info(formData);

        console.log("login", login);

        if(login.state){ //로그인 완료되면..
            
            ToastMessage(login.msg);
            navigation.reset({
                routes: [{ name: 'Tab_Navigation', screen: 'Home' }],
            });
            //console.log('login::',login);

        }else{ //로그인 실패..
           console.log(login.msg);
            ToastMessage(login.msg);
            navigation.replace('Login', {'id':''});
        }
        
    }

    useEffect(()=>{
        AsyncStorage.getItem('autoLogin').then(async (responseauto) => {
            if(responseauto == "Y"){
                AsyncStorage.getItem('mb_id').then(async (responsed) => {
                    if(responsed == null){
                        AsyncStorage.getItem('save_id').then(async (response) => {
                    
                            console.log('response', response);
                            if(response == null){
                                setTimeout(() => {
                                    navigation.replace('Login', {'id':''});
                                }, 2000);
                            }else{
                                console.log('response', response);
                                setTimeout(() => {
                                    navigation.replace('Login', {'id':response});
                                }, 2000);
                            }
                        });
                    }else{
                        console.log("gogo", responsed);
                        LoginHandler(responsed);
                    }
                })
            }else{
                AsyncStorage.getItem('save_id').then(async (response) => {
                    
                    console.log('response', response);
                    if(response == null){
                        setTimeout(() => {
                            navigation.replace('Login', {'id':''});
                        }, 2000);
                    }else{
                        console.log('response', response);
                        setTimeout(() => {
                            navigation.replace('Login', {'id':response});
                        }, 2000);
                    }
                });
            }
        })
       
       
    }, [])

    return (
        <Box flex={1} backgroundColor='#fff' justifyContent={'center'} alignItems='center'>
            <Image source={require('../images/introLogoNew1103.png')} alt='마음 FC' style={{width:136, resizeMode:'contain'}} />
        </Box>
    );
};

export default connect(
    ({ User }) => ({
        userInfo: User.userInfo, //회원정보
    }),
    (dispatch) => ({
        member_login: (user) => dispatch(UserAction.member_login(user)), //로그인
        member_info: (user) => dispatch(UserAction.member_info(user)), //회원 정보 조회
        
    })
)(Intro);