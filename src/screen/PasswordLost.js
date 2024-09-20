import React, {useState, useEffect} from 'react';
import { ScrollView, Platform, Dimensions, StyleSheet, Alert, View, TouchableOpacity, FlatList } from 'react-native';
import { Box, VStack, HStack, Image, Input, Select, Modal } from 'native-base';
import { DefInput, DefText, SearchInput, SubmitButtons } from '../common/BOOTSTRAP';
import HeaderDef from '../components/HeaderDef';
import {fsize, fweight, colorSelect, textStyle} from '../common/StyleDef';
import { pointRequest } from '../Utils/DummyData';
import { numberFormat, textLengthOverCut, phoneFormat } from '../common/dataFunction';

import Api from '../Api';
import ToastMessage from '../components/ToastMessage';

const {width} = Dimensions.get('window');

const buttonWidth = (width - 80) * 0.47;

const PasswordLost = (props) => {

    const {navigation} = props;

    const [id, setId] = useState('');
    const idChange = (id) => {
        setId(id);
    }

    //휴대폰 번호
    const [phoneNumber, setPhonenumber] = useState('');
    const phoneChange = (phone) => {
        setPhonenumber(phoneFormat(phone));
    }

    const [page, setPage] = useState(1);
    const idSubmit = () => {
        Api.send('member_idSubmit', {'id':id, 'pNumber':phoneNumber}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               console.log('아이디 찾기: ', arrItems);
               setPage(2);
       
            }else{
                console.log('아이디 찾기 오류!', resultItem);
                ToastMessage(resultItem.message);
            }
        });
    }
    //r123456!
    const [password, setPassword] = useState('');
    const passwordChange = (pwd) => {
        setPassword(pwd);
    }

    const [repassword, setRePassword] = useState('');
    const repasswordChange = (pwd) => {
        setRePassword(pwd);
    }

    const passwordChw = () => {
        Api.send('member_firstLogin', {'password':password, 'rePassword':repassword, 'id':id}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               console.log('아이디 찾기: ', arrItems);
               ToastMessage(resultItem.message);
               navigation.reset({
                routes: [{ name: 'Login' }],
            });
       
            }else{
                console.log('아이디 찾기 오류!', resultItem);
                ToastMessage(resultItem.message);
            }
        });
    }

    return (
        <Box flex={1} backgroundColor='#fff'> 
            <HeaderDef headerTitle='비밀번호 찾기' navigation={navigation} />
            <ScrollView>
                {
                    page == 1 &&
                    <Box p='20px'>
                        <Box>
                            <DefText text='아이디 (사번)' style={[styles.labelTitle]} />
                            <DefInput 
                                placeholderText='사번을 입력하세요.'
                                inputValue={id}
                                onChangeText={idChange}
                            />
                        </Box>
                        <Box mt='30px'>
                            <DefText text='연락처' style={[styles.labelTitle]} />
                            <DefInput 
                                placeholderText='연락처를 입력하세요. (-를 빼고 입력하세요)'
                                inputValue={phoneNumber}
                                onChangeText={phoneChange}
                                maxLength={13}
                                keyboardType='number-pad'
                            />
                        </Box>
                    </Box>
                }
                {
                    page == 2 &&
                    <Box p='20px'>
                        <DefText text='회원확인이 완료되었습니다.' style={[styles.loginText]}  />
                        <HStack mt='5px' alignItems={'center'}>
                            <DefText text='비밀번호를 변경' style={[styles.loginText, fweight.eb]} />
                            <DefText text='하세요.' style={[styles.loginText]} />
                        </HStack>
                        <Box mt='30px'>
                            {/* <DefText text='비밀번호' style={[styles.labelTitle]} /> */}
                            <DefInput 
                                placeholderText='변경하실 비밀번호를 입력해 주세요.'
                                inputValue={password}
                                onChangeText={passwordChange}
                                secureTextEntry={true}
                            />
                            <DefInput 
                                placeholderText='변경하실 비밀번호를 다시한번 입력해 주세요.'
                                inputValue={repassword}
                                onChangeText={repasswordChange}
                                secureTextEntry={true}
                                inputStyle={{marginTop:15}}
                            />
                        </Box>
                        <Box mt='20px'>
                            <HStack alignItems={'center'} flexWrap='wrap'>
                                <Image source={require('../images/alertIcon.png')} alt='경고' style={{marginRight:10}} />
                                <DefText text='영소문자, 숫자, 특수기호를 혼합하여 8글자 이상' />
                            </HStack>
                        </Box>
                    </Box>
                }
            </ScrollView>
            {
                page == 1 &&
                <SubmitButtons 
                    btnText='다음'
                    onPress={idSubmit}
                />
            }
            {
                page == 2 &&
                <SubmitButtons 
                    btnText='비밀번호 변경'
                    onPress={passwordChw}
                />
            }
        </Box>
    );
};

const styles = StyleSheet.create({
    labelTitle: {
        fontSize:fsize.fs16,
        ...fweight.eb,
        marginBottom: 15
    },
    buttonWidth: {
        width:buttonWidth,
        height: 45,
        borderRadius:10,
        alignItems:'center',
        justifyContent:'center'
    },
    buttonText: {
        ...fweight.b,
        color:colorSelect.white
    },
    loginText: {
        fontSize:22,
    }
})

export default PasswordLost;