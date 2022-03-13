import React, {useState, useEffect} from 'react';
import { ScrollView, Platform, Dimensions, StyleSheet, Alert, View, TouchableOpacity, FlatList } from 'react-native';
import { Box, VStack, HStack, Image, Input, Select, Modal } from 'native-base';
import { DefInput, DefText, SearchInput, SubmitButtons } from '../common/BOOTSTRAP';
import HeaderDef from '../components/HeaderDef';
import {fsize, fweight, colorSelect, textStyle} from '../common/StyleDef';
import { pointRequest } from '../Utils/DummyData';
import { numberFormat, textLengthOverCut } from '../common/dataFunction';

const {width} = Dimensions.get('window');
const buttonWidth = (width - 40) * 0.48;

const Setting = (props) => {

    const {navigation} = props;

    const [logOutModal, setLogOutModal] = useState(false);

    return (
        <Box flex={1} backgroundColor='#fff'>
            <HeaderDef headerTitle='설정' navigation={navigation} />
            <ScrollView>
                <Box p='20px'>
                    <Box backgroundColor={'#fff'} borderRadius={10} shadow={9} p='15px'>
                        <HStack mb='10px' alignItems={'center'}>
                            <Box style={[styles.leftLabel]}>
                                <DefText text='이름' style={[styles.leftLabelText]} />
                            </Box>
                            <Box style={[styles.rightLabel]}>
                                <DefText text='홍길동' />
                            </Box>
                        </HStack>
                        <HStack mb='10px' alignItems={'center'}>
                            <Box style={[styles.leftLabel]}>
                                <DefText text='아이디 (사번)' style={[styles.leftLabelText]} />
                            </Box>
                            <Box style={[styles.rightLabel]}>
                                <DefText text='MP00001' />
                            </Box>
                        </HStack>
                        <HStack mb='10px' alignItems={'center'}>
                            <Box style={[styles.leftLabel]}>
                                <DefText text='소속' style={[styles.leftLabelText]} />
                            </Box>
                            <Box style={[styles.rightLabel]}>
                                <DefText text='영등포직영지점' />
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
                                <DefText text='010-1234-5678' />
                            </Box>
                        </HStack>
                        <HStack alignItems={'center'}> 
                            <Box style={[styles.leftLabel]}>
                                <DefText text='이메일' style={[styles.leftLabelText]} />
                            </Box>
                            <Box style={[styles.rightLabel]}>
                                <DefText text='test@test.com' />
                            </Box>
                        </HStack>
                    </Box>
                    <HStack justifyContent={'space-between'} mt='15px'>
                        <TouchableOpacity onPress={()=>navigation.navigate('MemberSetting')} style={[styles.settingButton, {backgroundColor:colorSelect.blue}]}>
                            <DefText text='회원 정보 수정' style={[styles.settingButtonText]} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>setLogOutModal(true)} style={[styles.settingButton, {backgroundColor:colorSelect.gray}]}>
                            <DefText text='로그아웃' style={[styles.settingButtonText]} />
                        </TouchableOpacity>
                    </HStack>
                </Box>
            </ScrollView>
            <Modal isOpen={logOutModal} onClose={() => setLogOutModal(false)}>
                <Modal.Content borderRadius={0} p='0px'>
                    <Modal.Body p='0px'>
                        <Box py='30px'>
                            <DefText text={'로그아웃 시 DB 확인 및 기타 설정 된\n알림을 받지 못할 수 있습니다.'}  style={[{textAlign:'center', lineHeight:23}, fweight.eb]}/>
                            <DefText text={'로그아웃 하시겠습니까?'}  style={[{textAlign:'center', marginTop:30}, fweight.eb]}/>
                        </Box>
                        <HStack>
                            <TouchableOpacity style={[styles.modalButton, {backgroundColor:colorSelect.blue}]}>
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

export default Setting;