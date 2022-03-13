import React, {useState, useEffect} from 'react';
import { ScrollView, Platform, Dimensions, StyleSheet, Alert } from 'react-native';
import { Box, VStack, HStack, Image, Input } from 'native-base';
import { DefText, MainButton, ShadowInput } from '../common/BOOTSTRAP';
import Font from '../common/Font';
import AsyncStorage from '@react-native-community/async-storage';

import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import { StackActions } from '@react-navigation/native';
import ToastMessage from '../components/ToastMessage';

const {width} = Dimensions.get('window');

const FirstLogin = (props) => {

    const {navigation, userInfo, member_update, member_info} = props;

    //console.log('userInfo:::', userInfo);

    //비밀번호 입력
    const [password, setPassword] = useState('');
    const passwordSubmit = (password) => {
        setPassword(password);
    }

    //비밀번호 재입력
    const [rePassword, setRePassword] = useState('');
    const RePasswordSubmit = (password) => {
        setRePassword(password);
    }

    //첫 로그인 비밀번호 변경 후 홈화면 이동
    const FirstLoginHandler = async () => {
        
        // navigation.navigate('Tab_Navigation', {
        //     screen: 'Home',
        // });

        const formData = new FormData();
        formData.append('id', userInfo.mb_id);
        formData.append('password', password);
        formData.append('rePassword', rePassword);
        formData.append('method', 'member_firstLogin');

        const pwdChange = await member_update(formData);

        if(pwdChange.result){
            memberInfoSubmit();

            navigation.reset({
                routes: [{ name: 'Tab_Navigation', screen: 'Home' }],
            });
            //console.log(pwdChange) r1234567!
        }else{
            ToastMessage(pwdChange.msg);
        }
        //console.log('비밀번호를 변경!', pwdChange);
        
    }

    const memberInfoSubmit = () => {
        AsyncStorage.getItem('mb_id').then(async (response) => {
           // console.log('response', response);
            const formData = new FormData();
            formData.append('method', 'member_info');
            formData.append('id', response);
            await member_info(formData);
        });
    }

    return (
        <Box flex={1} backgroundColor='#fff'>
            <ScrollView>
                <Box p={'20px'}>
                    <VStack mt='60px'>
                        <DefText text='개인 정보를 위해 첫 로그인 시' style={[styles.loginText]} />
                        <HStack mt='5px' alignItems={'center'}>
                            <DefText text='비밀번호를 변경' style={[styles.loginText, {fontFamily:Font.NanumSquareRoundEB}, Platform.OS === 'ios' && {fontWeight:'700'}]} />
                            <DefText text=' 하셔야합니다.' style={[styles.loginText]} />
                        </HStack>
                    </VStack>
                    <VStack mt='40px'>
                        <ShadowInput 
                             placeholder='사용하실 비밀번호를 입력해 주세요.'
                             placeholderTextColor={'#D0DAE1'}
                             value={password}
                             onChangeText={passwordSubmit}
                             secureTextEntry={true}
                        />
                        <ShadowInput 
                             placeholder='비밀번호를 다시 한 번 입력해 주세요.'
                             placeholderTextColor={'#D0DAE1'}
                             value={rePassword}
                             onChangeText={RePasswordSubmit}
                             secureTextEntry={true}
                             style={{marginTop:20}}
                        />
                    </VStack>
                    <Box mt='20px'>
                        <HStack alignItems={'center'} flexWrap='wrap'>
                            <Image source={require('../images/alertIcon.png')} alt='경고' style={{marginRight:10}} />
                            <DefText text='영소문자, 숫자, 특수기호를 혼합하여 8글자 이상' />
                        </HStack>
                    </Box>
                    <Box mt='50px'>
                        <MainButton buttonText={'확인'} onPress={FirstLoginHandler} />
                    </Box>
                </Box>
            </ScrollView>
        </Box>
    );
};

const styles = StyleSheet.create({
    loginText: {
        fontSize:22,
    }
})

export default connect(
    ({ User }) => ({
        userInfo: User.userInfo, //회원정보
    }),
    (dispatch) => ({
        member_login: (user) => dispatch(UserAction.member_login(user)), //로그인
        member_update: (user) => dispatch(UserAction.member_update(user)), //회원정보 변경
        member_info: (user) => dispatch(UserAction.member_info(user)), //회원 정보 조회
        
    })
)(FirstLogin);