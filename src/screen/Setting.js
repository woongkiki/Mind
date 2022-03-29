import React, {useState, useEffect} from 'react';
import { ScrollView, Platform, Dimensions, StyleSheet, Alert, View, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { Box, VStack, HStack, Image, Input, Select, Modal } from 'native-base';
import { DefInput, DefText, SearchInput, SubmitButtons } from '../common/BOOTSTRAP';
import HeaderDef from '../components/HeaderDef';
import {fsize, fweight, colorSelect, textStyle} from '../common/StyleDef';
import { pointRequest } from '../Utils/DummyData';
import { numberFormat, textLengthOverCut } from '../common/dataFunction';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';

import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import { StackActions } from '@react-navigation/native';
import Api from '../Api';

import ToastMessage from '../components/ToastMessage';

const {width} = Dimensions.get('window');
const buttonWidth = (width - 40) * 0.48;

const Setting = (props) => {

    const {navigation, userInfo, member_logout} = props;

    const [logOutModal, setLogOutModal] = useState(false);

    const [member, setMember] = useState('');
    const [memberLoading, setMemberLoading] = useState(true);
    const memberInfos = async () => {
        await setMemberLoading(true);
        await Api.send('member_info', {'id':userInfo.mb_id}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               console.log('회원정보 출력 결과: ', arrItems, resultItem);
               setMember(arrItems)
            }else{
                console.log('회원정보 출력 실패!', resultItem);

            }
        });
        await setMemberLoading(false);
    }

    const isFocused = useIsFocused();
    useEffect(()=>{
        if(isFocused){

            memberInfos();
        }
    }, [isFocused])



    const LogoutHandler = async() => {

        const formData = new FormData();
        formData.append('method', 'member_logout');
   
        const logout =  await member_logout(formData);

        ToastMessage('로그아웃 합니다.');


        navigation.reset({
            routes: [{ name: 'Login' }],
        });

    }

    return (
        <Box flex={1} backgroundColor='#fff'>
            <HeaderDef headerTitle='설정' navigation={navigation} />
            {
                memberLoading ?
                <Box flex={1} justifyContent={'center'} alignItems='center'>
                    <ActivityIndicator size={'large'} color='#333' />
                </Box>
                :
                <ScrollView>
                    <Box p='20px'>
                        <Box backgroundColor={'#fff'} borderRadius={10} shadow={9} p='15px'>
                            <HStack mb='10px' alignItems={'center'}>
                                <Box style={[styles.leftLabel]}>
                                    <DefText text='이름' style={[styles.leftLabelText]} />
                                </Box>
                                <Box style={[styles.rightLabel]}>
                                    <DefText text={member != '' && member.mb_name} />
                                </Box>
                            </HStack>
                            <HStack mb='10px' alignItems={'center'}>
                                <Box style={[styles.leftLabel]}>
                                    <DefText text='아이디 (사번)' style={[styles.leftLabelText]} />
                                </Box>
                                <Box style={[styles.rightLabel]}>
                                    <DefText text={member != '' && member.mb_id} />
                                </Box>
                            </HStack>
                            <HStack mb='10px' alignItems={'center'}>
                                <Box style={[styles.leftLabel]}>
                                    <DefText text='소속' style={[styles.leftLabelText]} />
                                </Box>
                                <Box style={[styles.rightLabel]}>
                                    <DefText text={member != '' && member.brands} />
                                </Box>
                            </HStack>
                            <HStack mb='10px' alignItems={'center'}>
                                <Box style={[styles.leftLabel]}>
                                    <DefText text='자격' style={[styles.leftLabelText]} />
                                </Box>
                                <Box style={[styles.rightLabel]}>
                                    <DefText text='설계사' />
                                </Box>
                            </HStack>
                            <HStack mb='10px' alignItems={'center'}>
                                <Box style={[styles.leftLabel]}>
                                    <DefText text='연락처' style={[styles.leftLabelText]} />
                                </Box>
                                <Box style={[styles.rightLabel]}>
                                    <DefText text={member != '' && member.mb_hp} />
                                </Box>
                            </HStack>
                            <HStack alignItems={'center'}> 
                                <Box style={[styles.leftLabel]}>
                                    <DefText text='이메일' style={[styles.leftLabelText]} />
                                </Box>
                                <Box style={[styles.rightLabel]}>
                                    <DefText text={member != '' && member.mb_email} />
                                </Box>
                            </HStack>
                        </Box>
                        <HStack justifyContent={'space-between'} mt='15px'>
                            <TouchableOpacity onPress={()=>navigation.navigate('MemberSetting', member)} style={[styles.settingButton, {backgroundColor:colorSelect.blue}]}>
                                <DefText text='회원 정보 수정' style={[styles.settingButtonText]} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={()=>setLogOutModal(true)} style={[styles.settingButton, {backgroundColor:colorSelect.gray}]}>
                                <DefText text='로그아웃' style={[styles.settingButtonText]} />
                            </TouchableOpacity>
                        </HStack>
                    </Box>
                </ScrollView>
            }
            
            <Modal isOpen={logOutModal} onClose={() => setLogOutModal(false)}>
                <Modal.Content borderRadius={0} p='0px'>
                    <Modal.Body p='0px'>
                        <Box py='30px'>
                            <DefText text={'로그아웃 시 DB 확인 및 기타 설정 된\n알림을 받지 못할 수 있습니다.'}  style={[{textAlign:'center', lineHeight:23}, fweight.eb]}/>
                            <DefText text={'로그아웃 하시겠습니까?'}  style={[{textAlign:'center', marginTop:30}, fweight.eb]}/>
                        </Box>
                        <HStack>
                            <TouchableOpacity onPress={LogoutHandler} style={[styles.modalButton, {backgroundColor:colorSelect.blue}]}>
                                <DefText text='확인' style={[styles.modalButtonText]} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={()=>setLogOutModal(false)} style={[styles.modalButton, {backgroundColor:colorSelect.gray}]}>
                                <DefText text='취소' style={[styles.modalButtonText]} />
                            </TouchableOpacity>
                        </HStack>
                    </Modal.Body>
                </Modal.Content>
            </Modal>
        </Box>
    );
};

const styles = StyleSheet.create({
    leftLabel : {
        width:'28%'
    },
    rightLabel : {
        width:'70%'
    },
    leftLabelText: {
        ...fweight.b
    },
    settingButton: {
        width:buttonWidth,
        height:40,
        borderRadius:5,
        alignItems:'center',
        justifyContent:'center'
    },
    settingButtonText: {
        ...fweight.eb,
        color:colorSelect.white
    },
    modalButton: {
        width:(width-40) * 0.502,
        height:57,
        alignItems:'center',
        justifyContent:'center'
    },
    modalButtonText: {
        fontSize:15,
        ...fweight.eb,
        color:colorSelect.white
    }
})

export default connect(
    ({ User }) => ({
        userInfo: User.userInfo, //회원정보
    }),
    (dispatch) => ({
        member_login: (user) => dispatch(UserAction.member_login(user)), //로그인
        member_info: (user) => dispatch(UserAction.member_info(user)), //회원 정보 조회
        member_logout: (user) => dispatch(UserAction.member_logout(user)), //로그아웃
    })
)(Setting);