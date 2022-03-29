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

    const {navigation, userInfo} = props;

    const [selectTag, setSelectTag] = useState('미팅');


    const selectTagHandler = (tag) => {
        setSelectTag(tag);
    }

    const [progressData, setProgressData] = useState([]);
    const [meetingCnt, setMeetingCnt] = useState(0);
    const [callCnt, setCallCnt] = useState(0);
    const [contractCnt, setContractCnt] = useState(0);
    const [counselCnt, setCounselCnt] = useState(0);

    const [progressLoading, setProgressLoading] = useState(true);
    const progressRec = async () => {
        await setProgressLoading(true);
        await Api.send('db_progressList', {'idx':userInfo.mb_no, 'cate':selectTag}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
                console.log('진행중인 고객 결과: ', arrItems);
                setProgressData(arrItems.progress);
                setMeetingCnt(arrItems.meetCnt);
                setCallCnt(arrItems.callCnt);
                setContractCnt(arrItems.contractCnt);
                setCounselCnt(arrItems.caunselCnt)
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
                                
                                style={[styles.tagButton, selectTag === '미팅' && { backgroundColor: colorSelect.blue }]}
                                onPress={()=>selectTagHandler('미팅')}
                            >
                                <HStack alignItems={'center'}>
                                    <DefText text='미팅'  style={selectTag === '미팅' ? [{color: colorSelect.white}, fweight.eb] : [{color:'#333'}]} />
                                    <DefText text={meetingCnt ? ' (' + meetingCnt + ')' : '(0)'} style={selectTag === '미팅' ? [{color: colorSelect.white}, fweight.eb] : [{color:'#333'}]} />
                                </HStack>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                
                                style={[styles.tagButton, selectTag === '통화' && { backgroundColor: colorSelect.blue }]}
                                onPress={()=>selectTagHandler('통화')}
                            >
                                <HStack alignItems={'center'}>
                                    <DefText text='통화'  style={selectTag === '통화' ? [{color: colorSelect.white}, fweight.eb] : [{color:'#333'}]} />
                                    <DefText text={callCnt ? ' (' + callCnt + ')' : '(0)'} style={selectTag === '통화' ? [{color: colorSelect.white}, fweight.eb] : [{color:'#333'}]} />
                                </HStack>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                
                                style={[styles.tagButton, selectTag === '계약' && { backgroundColor: colorSelect.blue }]}
                                onPress={()=>selectTagHandler('계약')}
                            >
                                <HStack alignItems={'center'}>
                                    <DefText text='계약' style={selectTag === '계약' && [{color: colorSelect.white}, fweight.eb]}  />
                                    <DefText text={contractCnt ? ' (' + contractCnt + ')' : '(0)'} style={selectTag === '계약' && [{color: colorSelect.white}, fweight.eb]} />
                                </HStack>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                
                                style={[styles.tagButton, selectTag === '상담' && { backgroundColor: colorSelect.blue }]}
                                onPress={()=>selectTagHandler('상담')}
                            >
                                <HStack alignItems={'center'}>
                                    <DefText text='상담' style={selectTag === '상담' && [{color: colorSelect.white}, fweight.eb]} />
                                    <DefText text={counselCnt ? ' (' + counselCnt + ')' : '(0)'} style={selectTag === '상담' && [{color: colorSelect.white}, fweight.eb]} />
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
                                            <HStack alignItems={'center'} mb='10px'>
                                                <Box width='20%' >
                                                    <DefText text={'주소'} style={[fweight.b]}  />
                                                </Box>
                                                <Box width='62%' >
                                                    <DefText text={item?.s_addrs ? item.s_addrs : '-'} />
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
        width: (width - 40) * 0.25,
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