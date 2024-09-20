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

const progressTag = [
    {
        idx: 1,
        tag : '미팅',
        cnt : meetingMember.length
    },
    {
        idx: 2,
        tag : '통화',
        cnt : callMember.length
    },
    {
        idx: 3,
        tag : '계약',
        cnt : contractMember.length
    },
    {
        idx: 4,
        tag : '상담',
        cnt : consultingtMember.length
    },
];

const ProgressClient = (props) => {

    const {navigation, userInfo, route} = props;

    const {params} = route;

    const [selectTag, setSelectTag] = useState(params.cate);

    const selectTagHandler = (tag) => {
        setSelectTag(tag);
    }

    useEffect(()=>{
        if(params != ''){
            setSelectTag(params.cate);
        }
    }, [params])

    const [progressData, setProgressData] = useState([]);
    const [consultCnt, setConsultCnt] = useState("0"); //상담대기
    const [callCnt, setCallCnt] = useState("0"); //통화
    const [meetCnt, setMeetCnt] = useState("0"); //미팅
    const [subscripCnt, setSubscripCnt] = useState("0"); //청약진행
    const [ASCnt, setAScnt] = useState("0"); // AS요청

    const [progressLoading, setProgressLoading] = useState(true);
    const progressRec = async () => {
        await setProgressLoading(true);
        await Api.send('dbApi_progressList', {'idx':userInfo.mb_no, 'cate':selectTag, 'startdate':params.startdate, 'enddate':params.enddate}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
                console.log('진행중인 고객 결과1: ', resultItem);
                setProgressData(arrItems.progress);
                setConsultCnt(arrItems.consultingCnt);
                setCallCnt(arrItems.callCnt);
                setMeetCnt(arrItems.meetCnt);
                setSubscripCnt(arrItems.subscription);
                setAScnt(arrItems.ASCnt);
                
            }else{
                console.log('진행중인 고객 출력 실패!', resultItem);

            }
        });
        await setProgressLoading(false);
    }

    useEffect(()=>{
        progressRec();
    },[selectTag])

    return (
        <Box flex={1} backgroundColor='#fff'>
            <HeaderDef headerTitle='진행 중인 업무' navigation={navigation} />
            {
                progressLoading ?
                <Box flex={1} justifyContent='center' alignItems={'center'}>
                    <ActivityIndicator size='large' color='#333' />
                </Box>
                :
                <ScrollView>
                    <Box p='20px'>
                        <HStack backgroundColor={'#F0F0F0'} borderRadius={10}>
                            <TouchableOpacity 
                                
                                style={[styles.tagButton, selectTag === '상담대기' && { backgroundColor: colorSelect.blue }]}
                                onPress={()=>selectTagHandler('상담대기')}
                            >
                                <HStack alignItems={'center'}>
                                    <DefText text='상담대기' style={[ {fontSize:fsize.fs12}, selectTag === '상담대기' && {color: colorSelect.white}, fweight.eb]}  />
                                    <DefText text={consultCnt ? ' (' + consultCnt + ')' : '(0)'} style={[ {fontSize:fsize.fs12},selectTag === '상담대기' && {color: colorSelect.white}, fweight.eb]} />
                                </HStack>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                
                                style={[styles.tagButton, selectTag === '통화' && { backgroundColor: colorSelect.blue }]}
                                onPress={()=>selectTagHandler('통화')}
                            >
                                <HStack alignItems={'center'}>
                                    <DefText text='통화'  style={[ {fontSize:fsize.fs12}, selectTag === '통화' && {color: colorSelect.white}, fweight.eb]} />
                                    <DefText text={callCnt ? ' (' + callCnt + ')' : '(0)'} style={[ {fontSize:fsize.fs12},selectTag === '통화' && {color: colorSelect.white}, fweight.eb]} />
                                </HStack>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                
                                style={[styles.tagButton, selectTag === '미팅' && { backgroundColor: colorSelect.blue }]}
                                onPress={()=>selectTagHandler('미팅')}
                            >
                                <HStack alignItems={'center'}>
                                    <DefText text='미팅'  style={[ {fontSize:fsize.fs12}, selectTag === '미팅' && {color: colorSelect.white}, fweight.eb]}  />
                                    <DefText text={meetCnt ? ' (' + meetCnt + ')' : '(0)'} style={[ {fontSize:fsize.fs12},selectTag === '미팅' && {color: colorSelect.white}, fweight.eb]} />
                                </HStack>
                            </TouchableOpacity>
                            
                            <TouchableOpacity 
                                
                                style={[styles.tagButton, selectTag === '청약진행' && { backgroundColor: colorSelect.blue }]}
                                onPress={()=>selectTagHandler('청약진행')}
                            >
                                <HStack alignItems={'center'}>
                                    <DefText text='청약진행' style={[ {fontSize:fsize.fs12}, selectTag === '청약진행' && {color: colorSelect.white}, fweight.eb]}  />
                                    <DefText text={subscripCnt ? ' (' + subscripCnt + ')' : '(0)'} style={[ {fontSize:fsize.fs12},selectTag === '청약진행' && {color: colorSelect.white}, fweight.eb]} />
                                </HStack>
                            </TouchableOpacity>
                            
                            <TouchableOpacity 
                                
                                style={[styles.tagButton, selectTag === 'AS요청' && { backgroundColor: colorSelect.blue }]}
                                onPress={()=>selectTagHandler('AS요청')}
                            >
                                <HStack alignItems={'center'}>
                                    <DefText text='AS요청' style={[ {fontSize:fsize.fs12}, selectTag === 'AS요청' && {color: colorSelect.white}, fweight.eb]}  />
                                    <DefText text={ASCnt ? ' (' + ASCnt + ')' : '(0)'} style={[ {fontSize:fsize.fs12},selectTag === 'AS요청' && {color: colorSelect.white}, fweight.eb]} />
                                </HStack>
                            </TouchableOpacity>
                            
                            {/* {
                                progressTag.map((item, index)=> {
                                    return(
                                        <TouchableOpacity 
                                            key={index} 
                                            style={[styles.tagButton, selectTag === item.tag && { backgroundColor: colorSelect.blue }]}
                                            onPress={()=>selectTagHandler(item.tag)}
                                        >
                                            <DefText text={item.tag + ' (' + item.cnt + ')'} style={selectTag === item.tag && [{color: colorSelect.white}, fweight.eb]} />
                                        </TouchableOpacity>
                                    )
                                })
                            } */}
                        </HStack>
                        {
                            progressData != '' &&
                            progressData.length > 0 ?
                            progressData.map((item, index)=>{
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
                                            {
                                                item.s_addrs != '' &&
                                                <HStack alignItems={'center'} mb='10px'>
                                                    <Box width='20%' >
                                                        <DefText text={'주소'} style={[fweight.b]}  />
                                                    </Box>
                                                    <Box width='62%' >
                                                        <DefText text={item?.s_addrs ? item.s_addrs : '-'} />
                                                    </Box>
                                                </HStack>
                                            }
                                            
                                            <HStack alignItems={'center'} >
                                                <Box width='20%' >
                                                    <DefText text={'일시'} style={[fweight.b]}  />
                                                </Box>
                                                <Box width='62%' >
                                                    <DefText text={item?.wr_1 ? item.wr_1 : '-'} />
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
        width: (width - 40) * 0.2,
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
)(ProgressClient);