import React, {useState, useEffect} from 'react';
import { ScrollView, Platform, Dimensions, StyleSheet, Alert, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Box, VStack, HStack, Image, Input } from 'native-base';
import { DefText, SearchInput } from '../common/BOOTSTRAP';
import Font from '../common/Font';
import HeaderDef from '../components/HeaderDef';
import {fsize, fweight, colorSelect, textStyle} from '../common/StyleDef';
import { Shadow } from 'react-native-neomorph-shadows';
import {meetingMember, callMember, contractMember, consultingtMember} from '../Utils/DummyData';

import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import { StackActions } from '@react-navigation/native';
import Api from '../Api';
import ToastMessage from '../components/ToastMessage';

const {width} = Dimensions.get('window');

const AsDBList = (props) => {

    const {navigation, userInfo, route} = props;
    const {params} = route;
    
    const [loading, setLoading] = useState(true); //앱 페이지 로딩
    const [selectTag, setSelectTag] = useState(params.cate);
    const [asRequest, setASRequest] = useState("");
    const [asNo, setASNo] = useState("");
    const [asYes, setASYes] = useState("");
    const [asList, setAsList] = useState([]);

    //카테고리 변경
    const selectTagHandler = (tag) => {
        setSelectTag(tag);
    }

    const asApiRec = async () => {
        await setLoading(true);
        await Api.send('dbApi_ASListView', {'idx':userInfo.mb_no, 'cate':selectTag}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
                console.log('AS 요청 출력123: ', resultItem, arrItems);
                setASRequest(arrItems.asRequest);
                setASYes(arrItems.asYes);
                setASNo(arrItems.asNo);
                setAsList(arrItems.asList);
               //setNotWork(arrItems);
            }else{
                console.log('AS 요청 출력 실패!', resultItem);

            }
        });
        await setLoading(false);
    }

    useEffect(()=> {
        asApiRec();
    }, [selectTag])

    return (
        <Box flex={1} backgroundColor='#fff'>
            <HeaderDef headerTitle='AS 요청' navigation={navigation} />
            {
                loading ?
                <Box flex={1} justifyContent='center' alignItems={'center'}>
                    <ActivityIndicator size='large' color='#333' />
                </Box>
                :
                <ScrollView>
                    <Box p='20px'>
                        <HStack backgroundColor={'#F0F0F0'} borderRadius={10}>
                            <TouchableOpacity 
                                style={[styles.tagButton, selectTag === 'AS요청' && { backgroundColor: colorSelect.blue }]}
                                onPress={()=>selectTagHandler('AS요청')}
                            >
                                <HStack alignItems={'center'}>
                                    <DefText text='AS요청' style={[ {fontSize:fsize.fs12}, selectTag === 'AS요청' && {color: colorSelect.white}, fweight.eb]}  />
                                    <DefText text={asRequest ? ' (' + asRequest + ')' : '(0)'} style={[ {fontSize:fsize.fs12},selectTag === 'AS요청' && {color: colorSelect.white}, fweight.eb]} />
                                </HStack>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={[styles.tagButton, selectTag === 'AS 완료 승인' && { backgroundColor: colorSelect.blue }]}
                                onPress={()=>selectTagHandler('AS 완료 승인')}
                            >
                                <HStack alignItems={'center'}>
                                    <DefText text='AS 완료 승인' style={[ {fontSize:fsize.fs12}, selectTag === 'AS 완료 승인' && {color: colorSelect.white}, fweight.eb]}  />
                                    <DefText text={asYes ? ' (' + asYes + ')' : '(0)'} style={[ {fontSize:fsize.fs12},selectTag === 'AS 완료 승인' && {color: colorSelect.white}, fweight.eb]} />
                                </HStack>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={[styles.tagButton, selectTag === 'AS 완료 거절' && { backgroundColor: colorSelect.blue }]}
                                onPress={()=>selectTagHandler('AS 완료 거절')}
                            >
                                <HStack alignItems={'center'}>
                                    <DefText text='AS 완료 거절' style={[ {fontSize:fsize.fs12}, selectTag === 'AS 완료 거절' && {color: colorSelect.white}, fweight.eb]}  />
                                    <DefText text={asNo ? ' (' + asNo + ')' : '(0)'} style={[ {fontSize:fsize.fs12},selectTag === 'AS 완료 거절' && {color: colorSelect.white}, fweight.eb]} />
                                </HStack>
                            </TouchableOpacity>
                        </HStack>
                        {
                            asList != "" ?
                            asList.map((item, index)=> {
                                return(
                                    <Box key={index}  backgroundColor={'#fff'} borderRadius={10} shadow={9} mt={'15px'}>
                                        <TouchableOpacity style={{padding:15}} onPress={()=>navigation.navigate('ClientInfo', {'idx':item.wr_id})}>
                                            <HStack alignItems={'center'}  mb='10px'>
                                                <Box width='20%' >
                                                    <DefText text={'고객명'} style={[fweight.b]}  />
                                                </Box>
                                                <Box width='62%' >
                                                    <DefText text={item.wr_subject} />
                                                </Box>
                                            </HStack>
                                            
                                            <HStack alignItems={'center'} >
                                                <Box width='20%' >
                                                    <DefText text={'일시'} style={[fweight.b]}  />
                                                </Box>
                                                <Box width='62%' >
                                                    <DefText text={item?.s_dates ? item.s_dates : '-'} />
                                                </Box>
                                            </HStack>
                                            <Box position={'absolute'} top='65%' right='20px'>
                                                <Image source={require('../images/memberInfoArr.png')} alt='회원정보 화살표' style={{width:6, height:10, resizeMode:'contain'}} />
                                            </Box>
                                        </TouchableOpacity>
                                    </Box>
                                )
                            })
                            :
                            <Box justifyContent={'center'} alignItems='center' py='40px'>
                                <DefText text={'현재 ' + selectTag + ' 상태인 고객 정보가 없습니다.'} />
                            </Box>
                        }
                    </Box>
                </ScrollView>
            }
        </Box>
    );
};

const styles = StyleSheet.create({
    tagButton: {
        width: (width - 40) * 0.33,
        height:40,
        backgroundColor:'#F0F0F0',
        alignItems:'center',
        justifyContent:'center',
        borderRadius:10
    }
})

export default connect(
    ({ User }) => ({
        userInfo: User.userInfo, //회원정보
    }),
    (dispatch) => ({
        member_login: (user) => dispatch(UserAction.member_login(user)), //로그인
        member_info: (user) => dispatch(UserAction.member_info(user)), //회원 정보 조회
        
    })
)(AsDBList);