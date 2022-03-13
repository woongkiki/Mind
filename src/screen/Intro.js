import React, {useEffect, useState} from 'react';
import { Box, VStack, Image } from 'native-base';
import { ActivityIndicator } from 'react-native';
import { DefText } from '../common/BOOTSTRAP';
import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import AsyncStorage from '@react-native-community/async-storage';

const Intro = (props) => {

    const {navigation, member_login, member_info} = props;

    useEffect(()=>{
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
    }, [])

    return (
        <Box flex={1} backgroundColor='#fff' justifyContent={'center'} alignItems='center'>
            <Image source={require('../images/introLofo.png')} alt='마음 로고' style={{width:144, height:180, resizeMode:'contain'}}  />
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