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

const IdLost = (props) => {

    const {navigation} = props;

    //이름
    const [name, setName] = useState('');
    const nameChange = (text) => {
        setName(text)
    }

    //지사 지점
    const [branch, setBranch] = useState('');
    const [branchListData, setBranchListData] = useState([]);
    const branchList = () => {
        Api.send('member_branch', {}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               console.log('지사/지점 리스트: ', arrItems);
               setBranchListData(arrItems);
            }else{
                console.log('지사/지점 오류!', resultItem);

            }
        });
    }

    useEffect(()=>{
        branchList();
    }, [])

    //휴대폰 번호
    const [phoneNumber, setPhonenumber] = useState('');
    const phoneChange = (phone) => {
        setPhonenumber(phoneFormat(phone));
    }

    const [idInfo, setIdInfo] = useState('');
    //이광수
    //010-3333-7778
    const idSearch = () => {
        Api.send('member_idSearch', {'name':name, 'branch':branch, 'pNumber':phoneNumber}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               console.log('아이디 찾기: ', arrItems);
               setIdInfo(arrItems);
               setIdModal(true);
            }else{
                console.log('아이디 찾기 오류!', resultItem);
                ToastMessage(resultItem.message);
            }
        });
    }

    const [idModal, setIdModal] = useState(false);

    const loginMove = () => {
        navigation.navigate('Login');
        setIdModal(false);
    }
    
    return (
        <Box flex={1} backgroundColor='#fff'>
            <HeaderDef headerTitle='아이디 찾기' navigation={navigation} />
            <ScrollView>
                <Box p='20px'>
                    <Box>
                        <DefText text='이름' style={[styles.labelTitle]} />
                        <DefInput 
                            placeholderText='이름을 입력하세요.'
                            inputValue={name}
                            onChangeText={nameChange}
                        />
                    </Box>
                    <Box mt='30px'>
                        <DefText text='지사/지점 선택' style={[styles.labelTitle]} />
                        <Select
                            selectedValue={branch}
                            placeholder='지사/지점을 선택하세요.'
                            width='100%'
                            height='42px'
                            fontSize={fsize.fs12}
                            style={fweight.r}
                            backgroundColor='#fff'
                            borderWidth={1}
                            borderColor='#999999'
                            onValueChange={(itemValue) => setBranch(itemValue)}
                        >
                            {
                                branchListData.map((item, index)=> {
                                    return(
                                        <Select.Item label={item.wr_subject} value={item.wr_id} key={index} />
                                    )
                                })
                            }
                        </Select>
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
            </ScrollView>
            <SubmitButtons 
                btnText='아이디 찾기'
                onPress={idSearch}
            />
            <Modal isOpen={idModal} onClose={() => setIdModal(false)}>
                <Modal.Content>
                    <Modal.Body>
                        <HStack alignItems={'center'} justifyContent='center' mb='20px'>
                            <DefText text='설계사 님의 아이디는 ' style={[{fontSize:fsize.fs16}]} />
                            <DefText text={' '+ idInfo != '' && idInfo} style={[{fontSize:fsize.fs16}, fweight.eb]}  />
                            <DefText text={' 입니다.'} style={[{fontSize:fsize.fs16}]}  />
                        </HStack>
                        <SubmitButtons 
                            btnText='로그인 하기'
                            onPress={loginMove}
                            buttonStyle={{width:width-90, height:40, borderRadius:10}}
                        />
                    </Modal.Body>
                </Modal.Content>
            </Modal>
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
    }
})

export default IdLost;