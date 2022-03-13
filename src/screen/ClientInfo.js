import React, {useState, useEffect} from 'react';
import { ScrollView, Platform, Dimensions, StyleSheet, Alert, View, TouchableOpacity, Linking, ActivityIndicator } from 'react-native';
import { Box, VStack, HStack, Image, Modal } from 'native-base';
import { DefText, SearchInput, SubmitButtons } from '../common/BOOTSTRAP';
import Font from '../common/Font';
import HeaderDef from '../components/HeaderDef';
import {fsize, fweight, colorSelect, textStyle} from '../common/StyleDef';
import {allClient, allClientYes, allClientNo, searchSettingCategory} from '../Utils/DummyData';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import WebView from 'react-native-webview';

import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import { StackActions } from '@react-navigation/native';
import Api from '../Api';
import ToastMessage from '../components/ToastMessage';

const {width} = Dimensions.get('window');
const categoryBtn = (width - 40) * 0.32;
const categoryPadding = (width - 40) * 0.02;

const ClientInfo = (props) => {

    const {navigation, route, userInfo} = props;

    const {params} = route;

    //console.log('params', params);

    //진행상태변경 모달
    const [statusModal, setStatusModal] = useState(false);
    const statusModalClose = () => {
        setStatusModal(false);
    }

    const [selectStatus, setSelectStatus] = useState('');
    const StatusChange = (category) => {
        setSelectStatus(category);
    }


    const [statusList, setStatusList] = useState([]);
    const statusListReceive = () => {
        Api.send('db_statusList', {}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
                console.log('진행상태리스트: ', arrItems, resultItem);
                setStatusList(arrItems);
            }else{
                console.log('진행상태리스트 API 통신 오류!', resultItem);
            }
        });
    }

    const statusChanges = () => {
        Api.send('db_statusChange', {'idx':params.idx, 'status':selectStatus, 'id':userInfo.mb_id}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
                //console.log('진행상태변경: ', arrItems, resultItem);
                ClientInfoReceive();
                ToastMessage(resultItem.message);
                setStatusModal(false);
            }else{
                console.log('진행상태변경 API 통신 오류!', resultItem);
                setStatusModal(false);
            }
        });
    }

    const [DBLoading, setDBLoading] = useState(true);
    const [DBInfo, setDBInfo] = useState('');
    const ClientInfoReceive = async () => {
        await setDBLoading(true);
        await Api.send('db_info', {'idx':params.idx}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
                //console.log('db 상세: ', arrItems, resultItem);
                setDBInfo(arrItems)
            }else{
                console.log('API 통신 오류!', resultItem);

            }
        });
        await setDBLoading(false);
    }

    useEffect(()=>{
        statusListReceive();
        ClientInfoReceive();
    }, [])

    return (
        <Box flex={1} backgroundColor='#F4F6F6'>
            <HeaderDef headerTitle='고객 상세 정보' navigation={navigation} />
            {
                DBLoading ?
                <Box flex={1} alignItems='center' justifyContent={'center'} backgroundColor='#fff'>
                    <ActivityIndicator size='large' color='#333' />
                </Box>
                :
                <ScrollView>
                    <Box p='20px' pb='30px' backgroundColor={'#fff'}>
                        <Box>
                            <Box p='20px' backgroundColor={colorSelect.blue} borderRadius={5}>
                                <HStack alignItems={'center'} justifyContent='space-between'>
                                    <DefText text='등록일시' style={[{color:colorSelect.white}, fweight.b]} />
                                    <DefText text={DBInfo?.wr_1 && DBInfo.wr_1} style={[{color:colorSelect.white}, fweight.eb]} />
                                </HStack>
                            </Box>
                            <Box p='20px' backgroundColor={'#D0DAE1'} borderRadius={5} mt='15px'>
                                <HStack alignItems={'center'} justifyContent='space-between'>
                                    <DefText text='진행 상태' style={[fweight.b]} />
                                    <DefText text={DBInfo?.wr_4 && DBInfo.wr_4} style={[{color:'#FF4D4D'}, fweight.eb]} />
                                </HStack>
                            </Box>
                            <HStack alignItems={'center'} justifyContent='space-between' mt='15px'>
                                <Box style={[
                                    styles.infoBox,
                                    DBInfo?.family_check == '1' ? {backgroundColor:colorSelect.orange} : {backgroundColor:'#F3F3F3'}
                                ]}    
                                >
                                    {
                                        DBInfo?.family_check == '1' ?
                                        <Image source={require('../images/familyIconW.png')} alt='가족상담 여부' style={{width:24, height:26, resizeMode:'contain'}} />
                                        :
                                        <Image source={require('../images/familyIconB.png')} alt='가족상담 여부' style={{width:24, height:26, resizeMode:'contain'}} />
                                    }
                                    <DefText
                                        text='가족상담'
                                        style={[
                                            fweight.b, {marginTop:5}, 
                                            DBInfo?.family_check == '1' ? {color:colorSelect.white} : {color:colorSelect.black1}
                                        ]} 
                                    />
                                </Box>
                                <Box style={[styles.infoBox, {backgroundColor:'#004375'}]}>
                                    <HStack alignItems={'center'}>
                                        <DefText text='100만' style={{color:colorSelect.white}} />
                                        <Image source={require('../images/bohumUp.png')} alt='이상' style={{width:9, height:8, resizeMode:'contain', marginLeft:10}} />
                                    </HStack>
                                    <DefText text='보험료' style={[fweight.b, {color:colorSelect.white, marginTop:5}]} />
                                </Box>
                        
                                <TouchableOpacity style={[styles.infoBox, {backgroundColor:colorSelect.orange}]}>
                                    <Image source={require('../images/audioIconW.png')} alt='녹음재생' style={{width:30, height:26, resizeMode:'contain'}} />
                                    <DefText text='녹음재생' style={[fweight.b, {color:colorSelect.white, marginTop:5}]}  />
                                </TouchableOpacity>
                    
                            </HStack>
                        </Box>
                    </Box>
                    <Box backgroundColor={'#fff'} shadow={9} p='20px'>
                        <HStack mb='15px'>
                            <Box style={[styles.infoTitleBox, {backgroundColor:colorSelect.blue}]}>
                                <DefText text='고객 정보' style={[styles.infoTitle]} />
                            </Box>
                        </HStack>
                        <HStack alignItems={'center'} justifyContent='space-between'>
                            <Box>
                                <DefText text={ DBInfo?.wr_subject && DBInfo.wr_subject} style={[{color:'#004375', fontSize:22}, fweight.b]} />
                                <DefText text={ DBInfo?.wr_10 && DBInfo.wr_10} style={{marginTop:10}} />
                            </Box>
                            {
                                DBInfo != '' &&
                                <TouchableOpacity onPress={()=>Linking.openURL(`tel:` + DBInfo.wr_10)}>
                                    <Image source={require('../images/clienInfoCall.png')} alt='전화걸기' style={{width:29, height:29, resizeMode:'contain'}} />
                                </TouchableOpacity>
                            }
                        </HStack>
                        <Box>
                            <HStack flexWrap={'wrap'} mt='15px'>
                                <Box width='25%' >
                                    <DefText text='주소' />
                                </Box>
                                <Box width='70%' >
                                    <HStack alignItems={'center'}>
                                        <Box width='8px' height='8px' backgroundColor={'#004375'} mr='10px' />
                                        <DefText text={DBInfo?.wr_addr1 && DBInfo.wr_addr1 + DBInfo.wr_addr2 + DBInfo.wr_addr3} />
                                    </HStack>
                                </Box>
                            </HStack>
                            <HStack flexWrap={'wrap'} mt='15px'>
                                <Box width='25%' >
                                    <DefText text='나이' />
                                </Box>
                                <Box width='70%' >
                                    <HStack alignItems={'center'}>
                                        <Box width='8px' height='8px' backgroundColor={'#004375'} mr='10px' />
                                        <DefText text={DBInfo?.age && DBInfo.age} />
                                    </HStack>
                                </Box>
                            </HStack>
                            <HStack flexWrap={'wrap'} mt='15px'>
                                <Box width='25%' >
                                    <DefText text='직업' />
                                </Box>
                                <Box width='70%' >
                                    <HStack alignItems={'center'}>
                                        <Box width='8px' height='8px' backgroundColor={'#004375'} mr='10px' />
                                        <DefText text={DBInfo?.wr_9 && DBInfo.wr_9} />
                                    </HStack>
                                </Box>
                            </HStack>
                        </Box>
                        
                    </Box>
                    <Box backgroundColor={'#fff'}  borderTopWidth={1} borderTopColor='#EFEFF1' p='20px'>
                        <HStack flexWrap={'wrap'} >
                            <Box width='25%' >
                                <DefText text='DB 종류' />
                            </Box>
                            <Box width='70%' >
                                <HStack alignItems={'center'}>
                                    <Box width='8px' height='8px' backgroundColor={'#004375'} mr='10px' />
                                    <DefText text={DBInfo?.category1Name && DBInfo.category1Name} />
                                    {
                                        DBInfo.category2Name &&
                                        <DefText text={' > ' + DBInfo.category2Name} />
                                    }
                                    {
                                        DBInfo.category3Name &&
                                        <DefText text={' > ' + DBInfo.category3Name} />
                                    }
                                </HStack>
                            </Box>
                        </HStack>
                        <HStack flexWrap={'wrap'} mt='15px'>
                            <Box width='25%' >
                                <DefText text='상담사' />
                            </Box>
                            <Box width='70%' >
                                <HStack alignItems={'center'}>
                                    <Box width='8px' height='8px' backgroundColor={'#004375'} mr='10px' />
                                    <DefText text={DBInfo?.manage_name && DBInfo.manage_name} />
                                </HStack>
                            </Box>
                        </HStack>
                        <HStack flexWrap={'wrap'} mt='15px'>
                            <Box width='25%' >
                                <DefText text='통화희망' />
                            </Box>
                            <Box width='70%' >
                                <HStack alignItems={'center'}>
                                    <Box width='8px' height='8px' backgroundColor={'#004375'} mr='10px' />
                                    <HStack alignItems={'center'}>
                                        <DefText text={DBInfo?.wr_2 && DBInfo.wr_2} />
                                        <DefText text={DBInfo?.wr_3 && ' ' + DBInfo.wr_3} />
                                    </HStack>
                                </HStack>
                            </Box>
                        </HStack>
                    </Box>
                    <Box mt='15px' backgroundColor={'#fff'} shadow={9} p='20px'>
                        <HStack mb='15px'>
                            <Box style={[styles.infoTitleBox, {backgroundColor:'#004375'}]}>
                                <DefText text='상담사 메모' style={[styles.infoTitle]} />
                            </Box>
                        </HStack>
                        <Box>
                            <DefText text={DBInfo?.admin_memo && DBInfo.admin_memo} style={{lineHeight:23}} />
                        </Box>
                    </Box>
                    <Box mt='15px' backgroundColor={'#fff'} shadow={9}>
                        <Box p='20px'>
                            <HStack mb='15px' alignItems={'center'}>
                                <Box style={[styles.infoTitleBox, {backgroundColor:colorSelect.orange}]}>
                                    <DefText text='설계사 메모' style={[styles.infoTitle]}  />
                                </Box>
                                <TouchableOpacity style={{marginLeft:10}}>
                                    <Image source={require('../images/memoAdd.png')} alt='설계사 메모 추가' style={[{width:18, height:18, resizeMode:'contain'}]} />
                                </TouchableOpacity>
                            </HStack>
                            <Box>
                                <DefText text={'홍길동\n770723\n010-1324-5678\n서울 특별시 구로구 구로동 (직장 근처 상담 요청)\n★상담요청시간 : 다음주 / 상시 통화 가능 / 매니저 님과 일정\n조율 / 직장인 / 월 납입 100만원대 / 가족 점검 요청★'} style={{lineHeight:23}} />
                                <DefText text='2020. 02. 02 오후 1시' style={[{marginTop:20, fontSize:fsize.fs12}]} />
                            </Box>
                        </Box>
                        <HStack>
                            <TouchableOpacity style={[styles.memoButton, {backgroundColor:'#004375'}]}>
                                <DefText text='수정' style={[styles.memoButtonText]} />
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.memoButton, {backgroundColor:'#333'}]}>
                                <DefText text='삭제' style={[styles.memoButtonText]} />
                            </TouchableOpacity>
                        </HStack>
                    </Box>

                    <Box mt='15px' backgroundColor={'#fff'} shadow={9} p='20px'>
                        <HStack mb='15px' alignItems={'center'}>
                            <Box style={[styles.infoTitleBox, {backgroundColor:colorSelect.blue}]}>
                                <DefText text='스케줄 정보' style={[styles.infoTitle]}  />
                            </Box>
                            <TouchableOpacity style={{marginLeft:10}}>
                                <Image source={require('../images/memoAdd.png')} alt='스케줄 추가' style={[{width:18, height:18, resizeMode:'contain'}]} />
                            </TouchableOpacity>
                        </HStack>
                        <HStack flexWrap={'wrap'}>
                            <Box width='25%' >
                                <DefText text='일정' />
                            </Box>
                            <Box width='75%' >
                                <HStack alignItems={'center'}>
                                    <Box width='8px' height='8px' backgroundColor={colorSelect.blue} mr='10px' />
                                    <DefText text='2020.01.05 오후 3시' />
                                </HStack>
                            </Box>
                        </HStack>
                        <HStack flexWrap={'wrap'} mt='15px'>
                            <Box width='25%' >
                                <DefText text='내용' />
                            </Box>
                            <Box width='75%' >
                                <HStack alignItems={'center'}>
                                    <Box width='8px' height='8px' backgroundColor={colorSelect.blue} mr='10px' />
                                    <DefText text='홍길동 고객님과 보험 설계 미팅' />
                                </HStack>
                            </Box>
                        </HStack>
                        <HStack flexWrap={'wrap'} mt='15px'>
                            <Box width='25%' >
                                <DefText text='주소' />
                            </Box>
                            <Box width='75%' >
                                <HStack alignItems={'center'}>
                                    <Box width='8px' height='8px' backgroundColor={colorSelect.blue} mr='10px' />
                                    <DefText text='서울특별시 구로구 구로동' />
                                </HStack>
                            </Box>
                        </HStack>
                        <Box height='170px' mt='15px' >
                            <WebView
                                source={{
                                    uri:'https://cnj02.cafe24.com/scheduleMap.php?address=서울특별시 구로구 구로동&'
                                }}
                                style={{width:width}}
                            />
                            <TouchableOpacity 
                                style={{position:'absolute', top:0, left:0, width:width - 40, height:170, backgroundColor:'transparent'}} 
                                onPress={()=>navigation.navigate('MapView')}
                            />
                        </Box>
                    </Box>

                </ScrollView>
            }
            
            <Modal isOpen={statusModal} onClose={()=>setStatusModal(false)}>
                 <Box position={'absolute'} bottom='0' zIndex={10}>
                    <Box p='15px'  width={width} backgroundColor={colorSelect.white} borderTopLeftRadius={15} borderTopRightRadius={15}>
                        <Box alignItems={'center'}>
                            <Image source={require('../images/modalLine.png')} alt='팝업 라인' style={{width:41, height:4, resizeMode:'contain'}} />
                        </Box>
                        <Box>
                            {
                                statusList != '' &&
                                statusList.length > 0 &&
                                statusList.map((item, index) => {
                                    return(
                                        <TouchableOpacity key={index} style={{alignItems:'center', marginTop:15}} onPress={ ()=> StatusChange(item.wr_subject)}>
                                            <DefText text={item.wr_subject} style={[{fontSize:fsize.fs16}, fweight.b]} />
                                            {
                                                selectStatus === item.wr_subject &&
                                                <Box position={'absolute'} top='50%' left='10px' mt='-7.5px'>
                                                    <Image source={require('../images/statusCheck.png')} alt='체크' style={{width:16, height:15, resizeMode:'contain'}} />
                                                </Box>
                                            }
                                        </TouchableOpacity>
                                    )
                                })
                            }
                        </Box>
                    </Box>

                    <SubmitButtons 
                        btnText = '저장'
                        onPress={statusChanges}
                        activeOpacity={1}
                    />

                </Box>
             </Modal>
             {
                 !statusModal &&
                 <SubmitButtons 
                    btnText = '진행 상태 변경'
                    onPress={()=>setStatusModal(true)}
                />
             }
            
             
        </Box>
    );
};

const styles = StyleSheet.create({
    infoBox : {
        width:categoryBtn,
        height : 54,
        borderRadius:5,
        alignItems:'center',
        justifyContent:'center'
    },
    infoTitleBox: {
        paddingHorizontal:10,
        paddingVertical:5,
        borderRadius:4
    },
    infoTitle: {
        ...fweight.b,
        color:colorSelect.white
    },
    memoButton: {
        width: width * 0.5,
        height: 50,
        alignItems:'center',
        justifyContent: 'center'
    },
    memoButtonText: {
        fontSize:fsize.fs16,
        color: colorSelect.white,
        ...fweight.b
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
)(ClientInfo);