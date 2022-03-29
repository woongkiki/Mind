import React, { useEffect, useState } from 'react';
import { TouchableOpacity, Platform, Dimensions, ScrollView, StyleSheet } from 'react-native';
import { Box, HStack, VStack, Input, Image, CheckIcon } from 'native-base';
import { DefText, MainButton, ShadowInput } from '../common/BOOTSTRAP';
import ToastMessage from '../components/ToastMessage';
import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import { StackActions } from '@react-navigation/native';

//디바이스 크기
const {width} = Dimensions.get('window');

const Login = (props) => {

    const {navigation, member_login, userInfo, route} = props;

    const {params} = route;
    
    useEffect( ()=> {
        if(params?.id != ''){
            setId(params?.id);
            setChecked(true);
        }
    }, [])

    //아이디(사번)
    const [id, setId] = useState('');
    const idHandler = (text) => {
        setId(text);
    }

    //비밀번호
    const [password, setPassword] = useState('');
    //const [password, setPassword] = useState('r123456@');
    const pwdHandler = (pwd) => {
        setPassword(pwd);
    }

    //사번저장 체크박스
    const [checked, setChecked] = useState(false);

    const LoginHandler = async () => {

        if(!id){
            ToastMessage('사번을 입력하세요.');
            return false;
        }

        if(!password){
            ToastMessage('비밀번호를 입력하세요.');
            return false;
        }

        const formData = new FormData();
        formData.append('id', id);
        formData.append('password', password);
        formData.append('idSave', checked);
        formData.append('method', 'member_login');

        const login = await member_login(formData);

        if(login.state){ //로그인 완료되면..

            //console.log('로그인 완료', login);
            if(login.result.mb_10 == 0){
                // navigation.reset({
                //     routes: [{ name: 'FirstLogin' }],
                // });
                navigation.navigate('FirstLogin')
            }else{
                ToastMessage(login.msg);
                navigation.reset({
                    routes: [{ name: 'Tab_Navigation', screen: 'Home' }],
                });
            }

        }else{ //로그인 실패..
           
            ToastMessage(login.msg);
        }

        //navigation.navigate('FirstLogin');
        
    }

    return (
        <Box flex={1} backgroundColor={'#fff'} alignItems='center' >
            <ScrollView>
                <Box px={'20px'} py='15px' flex={1}>
                    <Box mb='70px'>
                        <Image source={require('../images/loginLogoTop2.png')} alt='마이금융파트너' style={{width:130, height:46, resizeMode:'contain'}} />
                    </Box>
                    <Box alignItems={'center'}>
                        <Image source={require('../images/mindLogo.png')} alt='마음 FC' style={{width:122, height:153, resizeMode:'contain'}} />
                    </Box>
                    <Box mt='25px'>
                        <ShadowInput
                            placeholder='사번을 입력하세요.'
                            placeholderTextColor={'#D0DAE1'}
                            value={id}
                            onChangeText={idHandler}
                        />
                    </Box>
                    <Box mt='20px'>
                        <ShadowInput
                            placeholder='비밀번호를 입력하세요.'
                            placeholderTextColor={'#D0DAE1'}                            
                            value={password}
                            onChangeText={pwdHandler}
                            secureTextEntry={true}
                        />
                    </Box>
                    <Box mt='20px'>
                        <HStack alignItems={'center'}>
                            <Image source={require('../images/alertIcon.png')} alt='경고' style={{marginRight:10}} />
                            <DefText text='최초 비밀번호는 ' />
                            <DefText text='주민등록번호 뒤 7자리' style={{color:'#F99600'}} />
                            <DefText text=' 입니다.' />
                        </HStack>
                    </Box>
                    <Box mt='40px'>
                        <HStack justifyContent={'space-between'}>
                            <TouchableOpacity onPress={()=>setChecked(!checked)} activeOpacity={0.9}>
                                <HStack>
                                    <Box style={[{width:21, height:21, borderRadius:21, borderWidth:1, borderColor:'#004375', justifyContent:'center', alignItems:'center', marginRight:10}, checked && {backgroundColor:'#004375'}]}>
                                        {
                                            checked &&
                                           <Image source={require('../images/checkIcons.png')} alt='체크아이콘' style={{width:9, height:6, resizeMode:'contain'}} />
                                        }
                                    </Box>
                                    <DefText text='사번저장' style={[Platform.OS === 'ios' && {marginTop:2}]} />
                                </HStack>
                            </TouchableOpacity>
                            <HStack alignItems={'center'}>
                                <TouchableOpacity onPress={()=>navigation.navigate('IdLost')} style={{borderBottomWidth:1, borderBottomColor:'#000'}}>
                                    <DefText text='아이디 찾기' />
                                </TouchableOpacity>
                                <Box style={{width:1, height:'90%', backgroundColor:'#000', marginHorizontal:10}} />
                                <TouchableOpacity onPress={()=>navigation.navigate('PasswordLost')} style={{borderBottomWidth:1, borderBottomColor:'#000'}}>
                                    <DefText text='비밀번호 찾기' />
                                </TouchableOpacity>
                            </HStack>
                        </HStack>
                    </Box>
                    <Box mt='40px'>
                        <MainButton buttonText='로그인' onPress={LoginHandler} />
                    </Box>
                </Box>
            </ScrollView>

        </Box>
    );
};

const styles = StyleSheet.create({
    DefButton: {
        height:54,
        width:(width-40),
        alignItems:'center',
        justifyContent:'center',
        borderRadius:20,
        backgroundColor:"#4473B8"
    },
    DefButtonText: {
        fontSize:16,
        color:'#fff'
    },
})

export default connect(
    ({ User }) => ({
        userInfo: User.userInfo, //회원정보
    }),
    (dispatch) => ({
        member_login: (user) => dispatch(UserAction.member_login(user)), //로그인
        member_info: (user) => dispatch(UserAction.member_info(user)), //회원 정보 조회
        
    })
)(Login);