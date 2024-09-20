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

const EndClient = (props) => {

    const {navigation, userInfo, route} = props;
    const {params} = route;


    //console.log(params);
    const [loading, setLoading] = useState(true);
    const [selectTag, setSelectTag] = useState(params.cate);
    const [endClientList, setEndClientList] = useState([]);
    const [subsEndCnt, setSubsEndCnt] = useState('0'); //청약완료
    const [possibleCnt, setPossibleCnt] = useState("0"); //가망고객
    const [notWorkCnt, setNotWorkCnt] = useState("0"); //진행불가

    //카테고리 변경
    const selectTagHandler = (tag) => {
        setSelectTag(tag);
    }

    //API 연결
    const endClientApiRec = async () => {
        await setLoading(true);
        await Api.send('dbApi_endList', {'idx':userInfo.mb_no, 'cate':selectTag, 'startdate':params.startdate, 'enddate':params.enddate}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
                console.log('완료된 고객 결과1: ', resultItem);
                
                setEndClientList(arrItems.endList);
                setSubsEndCnt(arrItems.subsCnt);
                setPossibleCnt(arrItems.possibleCnt);
                setNotWorkCnt(arrItems.notWorkCnt);
                
            }else{
                console.log('진행중인 고객 출력 실패!', resultItem);

            }
        });
        await setLoading(false);
    }

    useEffect(()=>{
        //페이지 첫 진입시
        if(params.cate != ""){ 
            setSelectTag(params.cate);
        }
        
    }, []);


    useEffect(()=>{
        endClientApiRec();
    }, [selectTag])

    return (
        <Box flex={1} backgroundColor='#fff'>
            <HeaderDef headerTitle='완료된 업무' navigation={navigation} />
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
                                style={[styles.tagButton, selectTag === '청약완료' && { backgroundColor: colorSelect.blue }]}
                                onPress={()=>selectTagHandler('청약완료')}
                            >
                                <HStack alignItems={'center'}>
                                    <DefText text='청약완료' style={[ {fontSize:fsize.fs12}, selectTag === '청약완료' && {color: colorSelect.white}, fweight.eb]}  />
                                    <DefText text={subsEndCnt ? ' (' + subsEndCnt + ')' : '(0)'} style={[ {fontSize:fsize.fs12},selectTag === '청약완료' && {color: colorSelect.white}, fweight.eb]} />
                                </HStack>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={[styles.tagButton, selectTag === '가망고객' && { backgroundColor: colorSelect.blue }]}
                                onPress={()=>selectTagHandler('가망고객')}
                            >
                                <HStack alignItems={'center'}>
                                    <DefText text='가망고객' style={[ {fontSize:fsize.fs12}, selectTag === '가망고객' && {color: colorSelect.white}, fweight.eb]}  />
                                    <DefText text={possibleCnt ? ' (' + possibleCnt + ')' : '(0)'} style={[ {fontSize:fsize.fs12},selectTag === '가망고객' && {color: colorSelect.white}, fweight.eb]} />
                                </HStack>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={[styles.tagButton, selectTag === '진행불가' && { backgroundColor: colorSelect.blue }]}
                                onPress={()=>selectTagHandler('진행불가')}
                            >
                                <HStack alignItems={'center'}>
                                    <DefText text='진행불가' style={[ {fontSize:fsize.fs12}, selectTag === '진행불가' && {color: colorSelect.white}, fweight.eb]}  />
                                    <DefText text={notWorkCnt ? ' (' + notWorkCnt + ')' : '(0)'} style={[ {fontSize:fsize.fs12},selectTag === '진행불가' && {color: colorSelect.white}, fweight.eb]} />
                                </HStack>
                            </TouchableOpacity>
                        </HStack>
                        {
                            endClientList != "" ?
                            endClientList.map((item, index)=> {
                                return(
                                    <Box key={index}  backgroundColor={ item.wr_4 == 'AS 완료 승인' ? '#eee' : '#fff'} borderRadius={10} shadow={9} mt={'15px'}>
                                        <TouchableOpacity style={{padding:15}} disabled={ item.wr_4 == 'AS 완료 승인' ? true : false }  onPress={()=>navigation.navigate('ClientInfo', {'idx':item.wr_id})}>
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
)(EndClient);