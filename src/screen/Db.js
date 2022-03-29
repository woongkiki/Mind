import React, {useState, useEffect} from 'react';
import { ScrollView, Platform, Dimensions, StyleSheet, Alert, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Box, VStack, HStack, Image, Input } from 'native-base';
import { DefText } from '../common/BOOTSTRAP';
import Font from '../common/Font';
import HeaderHome from '../components/HeaderHome';
import {fsize, fweight, colorSelect, textStyle} from '../common/StyleDef';
import { Shadow } from 'react-native-neomorph-shadows';
import {changeMemberList} from '../Utils/DummyData';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import { StackActions } from '@react-navigation/native';
import Api from '../Api';
import ToastMessage from '../components/ToastMessage';

const {width} = Dimensions.get('window');

/*임시 카운트*/
const meeting = 3;
const call = 0;
const nothing = 1;

const Db = (props) => {

    const {navigation, userInfo} = props;

    // const isFocused = useIsFocused();

    // useEffect(()=>{

    //     if(isFocused){
    //         dbuse();
          
    //     }

    // }, [isFocused]);


    //DB 진행률
    const [allDB, setAllDB] = useState('');
    const [useDB, setUseDB] = useState('');
    const [dbPercent, setDBPercent] = useState('');

    const [dbLoading, setDBLoading] = useState(true);

    const [nowDates, setNowDates] = useState('');
    //DB사용량
    const dbuse = async () => {
        await setDBLoading(true);
        await Api.send('db_use', {'idx':userInfo.mb_no}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
                //console.log('api 결과: ', arrItems);

                setAllDB(arrItems.total);
                setUseDB(arrItems.totalno);
                setDBPercent(arrItems.dbPercent)
                //console.log('totals:::::',arrItems.totalno)
                //setDbUseData()

            }else{
                console.log('api 결과 출력 실패!', resultItem);

            }
        });

        await Api.send('db_meeting', {'idx':userInfo.mb_no}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
                console.log('미팅 진행률 결과: ', resultItem);
                setMeetingCnt(arrItems.meetCnt);
                setMeetingPercent(arrItems.meetPercent);
            }else{
                console.log('미팅 진행률 출력 실패!', resultItem);

            }
        });

        await Api.send('db_missed', {'idx':userInfo.mb_no}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
                //console.log('부재고객 결과: ', arrItems);
                setMissed(arrItems);
            }else{
                console.log('부재고객 출력 실패!', resultItem);

            }
        });

        await Api.send('db_call', {'idx':userInfo.mb_no}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
                console.log('통화 고객 결과: ', arrItems);
                setCall(arrItems);
                //setMissed(arrItems);
            }else{
                console.log('통화 고객 출력 실패!', resultItem);

            }
        });

        await Api.send('db_changelist', {'id':userInfo.mb_id, 'order':desc}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
                console.log('db 변경이력 상세: ', resultItem);

                setChangeData(arrItems);
                //setDBInfo(arrItems)
            }else{
                console.log('db 변경이력 통신 오류!', resultItem);

            }
        });

        await Api.send('db_nowDate', {'idx':userInfo.mb_no}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
                console.log('현재 시간 출력: ', arrItems);

                setNowDates(arrItems);
            }else{
                console.log('현재 시간 출력 출력 실패!', resultItem);

            }
        });

        await setDBLoading(false);
    }

    //미팅률
    const [meetingCnt, setMeetingCnt] = useState(0);
    const [meetingPercent, setMeetingPercent] = useState('');

    //부재 고객 확인
    const [missed, setMissed] = useState(0);
   
    //통화 관련 고객
    const [call, setCall] = useState(0);
    

    const [desc, setDesc] = useState(false);
    const descChange = () => {
        setDesc(!desc)
    }

    const [changeData, setChangeData] = useState([]);

    
    useEffect(()=>{
        dbuse();
     
    }, [desc])

    // useEffect(()=>{
    //     changeList();
    // }, [desc])

    const changeMember = changeMemberList.map((item, index) => {
        return(
            <Box key={index} borderBottomWidth={1} borderBottomColor='#FAFAFA' py='15px'>
                <HStack alignItems={'center'} justifyContent='space-between'>
                    <Box style={[styles.changeTableBox]}>
                        <DefText text={item.mb_name} style={[{color:colorSelect.black666}, fweight.b]} />
                    </Box>
                    <Box style={[styles.changeTableBox]}>
                        <DefText text={item.defStatus} style={[{color:colorSelect.black666}, fweight.b]} />
                    </Box>
                    <Box style={[styles.changeTableBox]}>
                        <DefText text={item.afterStatus} style={[{color:colorSelect.black666}, fweight.b]} />
                    </Box>
                </HStack>
            </Box>
        )
    })

    return (
        <Box flex={1} backgroundColor='#fff'>
            <HeaderHome headerTitle='DB 리스트' />
            {
                dbLoading ?
                <Box flex={1} alignItems='center' justifyContent={'center'}>
                    <ActivityIndicator size={'large'} color='#333' />
                </Box>
                :
                <ScrollView>
                    <Box p={'20px'}>
                        <Shadow
                            
                            style={{
                                shadowOffset: {width: 0, height: 7},
                                shadowOpacity: 0.16,
                                shadowColor: "#000000",
                                shadowRadius: 15,
                                borderRadius: 0,
                                backgroundColor: '#fff',
                                width: width - 40,
                                height: 127,
                                justifyContent:'center',
                                borderRadius:10
                                // ...include most of View/Layout styles
                            }}
                            >
                            <Box backgroundColor='#fff' borderRadius={20}>
                                <Box backgroundColor={'#4473B8'} p='10px' borderTopLeftRadius={10} borderTopRightRadius={10} borderWidth={1} borderColor={colorSelect.blue}>
                                    <HStack alignItems={'center'}>
                                        <DefText text={nowDates != '' ? nowDates : '-'} style={[styles.dateText, fweight.eb]} />
                                        <TouchableOpacity onPress={()=>dbuse()}>
                                            <Image source={require('../images/refreshIconBlack.png')} alt='시간 새로고침' style={{width:20, height:20, resizeMode:'contain', marginLeft:10}} />
                                        </TouchableOpacity>
                                    </HStack>
                                </Box>
                                <Box p='20px' borderLeftWidth={1} borderRightWidth={1} borderBottomWidth={1} borderColor={colorSelect.blue} borderBottomLeftRadius={10} borderBottomRightRadius={10}>
                                    <HStack justifyContent='space-between' alignItems={'center'} flexWrap={'wrap'}>
                                        <HStack alignItems={'center'} width='50%'>
                                            <Box width='77%'>
                                                <DefText text='현재 DB 진행률' style={[fweight.eb, {marginRight:10}]} />
                                            </Box>
                                            <HStack alignItems={'center'} width='23%'>
                                                <DefText text={useDB ? useDB : 0} style={[fweight.b, {color:colorSelect.blue}]} />
                                                <DefText text=' / ' style={[fweight.b]} />
                                                <DefText text={allDB ? allDB : 0} style={[fweight.b]} />
                                            </HStack>
                                        </HStack>
                                        <Box width='45%' backgroundColor={'#EFEFEF'} height='15px' borderRadius={3}>
                                            <Box width={dbPercent ? dbPercent + '%' : '0%'} backgroundColor={colorSelect.blue} borderRadius={3} justifyContent='center' alignItems={'center'}>
                                                <DefText text={dbPercent ? dbPercent + '%' : '0%'} style={[{color:colorSelect.white, fontSize:12}]} />
                                            </Box>
                                        </Box>
                                    </HStack>
                                    <HStack justifyContent='space-between' alignItems={'center'} flexWrap={'wrap'} mt='15px'>
                                        <HStack alignItems={'center'} width='50%'>
                                            <Box width='77%'>
                                                <DefText text='현재 미팅 진행률' style={[fweight.eb, {marginRight:10}]} />
                                            </Box>
                                            <HStack alignItems={'center'} width='23%'>
                                                <DefText text={meetingCnt ? meetingCnt : 0} style={[fweight.b, {color:colorSelect.blue}]} />
                                                <DefText text=' / ' style={[fweight.b]} />
                                                <DefText text={allDB ? allDB : 0} style={[fweight.b]} />
                                            </HStack>
                                        </HStack>
                                        <Box width='45%' backgroundColor={'#EFEFEF'} height='15px' borderRadius={3}>
                                            <Box width={meetingPercent ? meetingPercent + '%' : 0} backgroundColor={colorSelect.blue} borderRadius={3} justifyContent='center' alignItems={'center'}>
                                                <DefText text={meetingPercent ? meetingPercent + '%' : ''} style={[{color:colorSelect.white, fontSize:12}]} />
                                            </Box>
                                        </Box>
                                    </HStack>
                                </Box>
                            </Box>
                        </Shadow>
                        <Box mt='50px'>
                            <DefText text='현재 진행 중인 업무' style={[textStyle.labelTitle, fweight.eb]} />
                            <Box mt='20px' backgroundColor={'#fff'} shadow={9} borderRadius='10px'>
                                <HStack py='15px' alignItems={'center'}>
                                    <TouchableOpacity style={[styles.ingButton]} disabled={meetingCnt == 0 ? true : false}>
                                        <DefText text='미팅' style={[fweight.b, meetingCnt == 0 && {color:colorSelect.gray}]} />
                                        <DefText text={meetingCnt ? meetingCnt : 0} style={[{marginTop:15}, meetingCnt == 0 && {color:colorSelect.gray}]} />
                                    </TouchableOpacity>
                                    <Box style={styles.boxline} />
                                    <TouchableOpacity style={[styles.ingButton]} disabled={call == 0 ? true : false}>
                                        <DefText text='통화' style={[fweight.b, call == 0 && {color:colorSelect.gray}]} />
                                        <DefText text={call ? call: 0} style={[{marginTop:15}, call == 0 && {color:colorSelect.gray}]} />
                                    </TouchableOpacity>
                                    <Box style={styles.boxline} />
                                    <TouchableOpacity style={[styles.ingButton]} disabled={missed == 0 ? true : false}>
                                        <DefText text='부재' style={[fweight.b, missed == 0 && {color:colorSelect.gray}]} />
                                        <DefText text={missed ? missed : 0} style={[{marginTop:15}, missed == 0 && {color:colorSelect.gray}]} />
                                    </TouchableOpacity>
                                </HStack>
                            </Box>
                            <Box mt='15px'>
                                <HStack backgroundColor={'#F5F5F5'} borderRadius={20} borderWidth={1} borderColor='#EBEBEB'>
                                    <TouchableOpacity
                                        onPress={()=>navigation.navigate('PossibleClient')}
                                        style={[styles.customerButton, {backgroundColor:colorSelect.orange}]}
                                    >
                                        <DefText text='가망고객' style={[styles.customerButtonText, {color:colorSelect.white}]} />
                                    </TouchableOpacity>
                                    <TouchableOpacity 
                                        onPress={()=>navigation.navigate('ProgressClient')}
                                        style={[styles.customerButton]}
                                    >
                                        <DefText text='진행중 업무' style={[styles.customerButtonText]} />
                                    </TouchableOpacity>
                                    <TouchableOpacity 
                                        onPress={()=>navigation.navigate('AllClient', {'startDate':'', 'endDate':'', 'progressStatus': []})}
                                        style={[styles.customerButton]}
                                    >
                                        <DefText text='전체 고객' style={[styles.customerButtonText]} />
                                    </TouchableOpacity>
                                </HStack>
                            </Box>
                        </Box>
                        <Box mt='30px'>
                            <HStack alignItems={'center'} justifyContent='space-between'>
                                <DefText text='변경이력' style={[textStyle.labelTitle, fweight.eb]} />
                                <TouchableOpacity onPress={descChange}>
                                    <HStack alignItems={'center'}>
                                        <DefText text='최신순' style={[{fontSize:fsize.fs12, color:'#878787'}]} />
                                        {
                                            !desc ?
                                            <Image source={require('../images/orderArr.png')} alt='오름차순' style={[{width:9, height:6, resizeMode:'contain', marginLeft:7}]} />
                                            :
                                            <Image source={require('../images/orderArrUp.png')} alt='오름차순' style={[{width:9, height:6, resizeMode:'contain', marginLeft:7}]} />
                                        }
                                        
                                    </HStack>
                                </TouchableOpacity>
                            </HStack>
                            {
                                changeData != '' &&
                                changeData.length > 0 ?
                                <Box mt='15px'>
                                    <HStack py='10px' alignItems={'center'} backgroundColor={'#F9F9F9'} borderTopWidth={1} borderTopColor='#C9C9C9'>
                                        <Box style={[styles.changeTableBox]}>
                                            <DefText text='고객명' style={[{color:'#9A9A9A'}, fweight.b]} />
                                        </Box>
                                        <Box style={[styles.changeTableBox]}>
                                            <DefText text='기존이력' style={[{color:'#9A9A9A'}, fweight.b]}  />
                                        </Box>
                                        <Box style={[styles.changeTableBox]}>
                                            <DefText text='변경이력' style={[{color:'#9A9A9A'}, fweight.b]}  />
                                        </Box>
                                    </HStack>
                                    {
                                        changeData.map((item, index)=> {
                                            return(
                                                <Box key={index} borderBottomWidth={1} borderBottomColor='#FAFAFA' py='15px'>
                                                    <HStack alignItems={'center'} justifyContent='space-between'>
                                                        <Box style={[styles.changeTableBox]}>
                                                            <DefText text={item.wr_name} style={[{color:colorSelect.black666}, fweight.b]} />
                                                        </Box>
                                                        <Box style={[styles.changeTableBox]}>
                                                            <DefText text={item.wr_1} style={[{color:colorSelect.black666}, fweight.b]} />
                                                        </Box>
                                                        <Box style={[styles.changeTableBox]}>
                                                            <DefText text={item.wr_2} style={[{color:colorSelect.black666}, fweight.b]} />
                                                        </Box>
                                                    </HStack>
                                                </Box>
                                            )
                                        })
                                    }
                                </Box>
                                :
                                <Box justifyContent={'center'} alignItems='center' py='40px'>
                                    <ActivityIndicator size={'large'} color='#333' />
                                </Box>
                            }
                        
                        </Box>
                    </Box>
                </ScrollView>
            }
            
        </Box>
    );
};

const styles = StyleSheet.create({
    dateText: {
        fontSize:fsize.fs16,
        color:'#fff',
    },
    ingButton:{
        width: '32%',
        justifyContent:'center',
        alignItems:'center'
    },
    boxline: {
        width: 1,
        height: 37,
        backgroundColor : '#191919'
    },
    customerButton: {
        width:'33%',
        height:39,
        borderRadius:39,
        alignItems:'center',
        justifyContent:'center'
    },
    customerButtonText: {
        color:colorSelect.black2,
        ...fweight.b
    },
    changeTableBox: {
        width: '33.3333%',
        alignItems:'center'
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
)(Db);