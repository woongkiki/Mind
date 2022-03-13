import React, {useState, useEffect} from 'react';
import { ScrollView, Platform, Dimensions, StyleSheet, Alert, View, TouchableOpacity } from 'react-native';
import { Box, VStack, HStack, Image, Input } from 'native-base';
import { DefText } from '../common/BOOTSTRAP';
import Font from '../common/Font';
import HeaderMain from '../components/HeaderMain';
import { Shadow, Neomorph, NeomorphBlur } from 'react-native-neomorph-shadows';
import {fsize, fweight, colorSelect, textStyle} from '../common/StyleDef';

import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import { StackActions } from '@react-navigation/native';
import Api from '../Api';

const {width} = Dimensions.get('window');

console.log(Platform.OS, width);

const Home = (props) => {

    const {navigation, userInfo} = props;

    const dbMove = () => {
        navigation.navigate('Tab_Navigation', {
            screen: 'Db',
        });
    }

    const scheduleMove = () => {
        navigation.navigate('Tab_Navigation', {
            screen: 'Schedule',
        });
    }

    const communicationMove = () => {
        navigation.navigate('Tab_Navigation', {
            screen: 'Comunication',
        });
    }

    const [allDB, setAllDB] = useState('');
    const [useDB, setUseDB] = useState('');
    const [dbPercent, setDBPercent] = useState('');

    const dbuse = () => {
        Api.send('db_use', {'idx':userInfo.mb_no}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
                console.log('api 결과: ', arrItems);

                setAllDB(arrItems.total);
                setUseDB(arrItems.totalno);
                setDBPercent(arrItems.dbPercent)
                console.log('totals:::::',arrItems.totalno)
                //setDbUseData()

            }else{
                console.log('결과 출력 실패!', resultItem);

            }
        });
    }

    useEffect( ()=> {
        dbuse();
    }, [])

    return (
        <Box flex={1} backgroundColor='#fff'>
            <HeaderMain headerTitle='홈' />
            <ScrollView>
                <Box pb='20px'>
                    <Shadow
                    
                    style={{
                        shadowOffset: {width: 0, height: 15},
                        shadowOpacity: 0.16,
                        shadowColor: "#4473B8",
                        shadowRadius: 10,
                        borderRadius: 0,
                        backgroundColor: '#fff',
                        width: width,
                        height: 150,
                        justifyContent:'center'
                        // ...include most of View/Layout styles
                    }}
                    >
                        <Box px='20px' justifyContent={'space-between'}>
                            <HStack alignItems={'center'} mb='15px'>
                                <DefText text='2021.12.31 오후 12:00' style={[styles.dateText]} />
                                <TouchableOpacity>
                                    <Image source={require('../images/refreshIcon.png')} alt='새로고침' style={{width:20, height:20, resizeMode:'contain', marginLeft:10}} />
                                </TouchableOpacity>
                            </HStack>
                            <Box mb='15px'>
                                <HStack alignItems={'center'} justifyContent='space-between' flexWrap={'wrap'}>
                                    <Box width={'20%'} >
                                        <DefText text='사용 DB' style={[styles.alarmText]} />
                                    </Box>
                                    <HStack width={'80%'} >
                                        <Box justifyContent={'center'} backgroundColor={'#EFEFEF'} borderRadius={3} width='80%'>
                                            <Box width={ dbPercent != '' ? dbPercent +'%' : '0%' } height='15px' backgroundColor={'#4473B8'} justifyContent='center' alignItems={'center'} style={[styles.alarmGage]}>
                                                <DefText text={ dbPercent != '' ? dbPercent +'%' : '0%' } style={{fontSize:12, color:'#fff'}} />
                                            </Box>
                                        </Box>
                                        <Box alignItems={'flex-end'} width='20%'>
                                            <HStack>
                                                <DefText text={useDB != '' ? useDB : 0} style={[styles.alarmNumber, {color:'#4473B8'}]} />
                                                <DefText text=' / ' style={[styles.alarmNumber]} />
                                                <DefText text={allDB != '' ? allDB : 0} style={[styles.alarmNumber]} />
                                            </HStack>
                                        </Box>
                                    </HStack>
                                    
                                </HStack>
                            </Box>
                            <Box mb='15px'>
                                <HStack alignItems={'center'} justifyContent='space-between' flexWrap={'wrap'}>
                                    <Box width={'20%'} >
                                        <DefText text='미팅 완료' style={[styles.alarmText]} />
                                    </Box>
                                    <HStack width={'80%'} >
                                        <Box justifyContent={'center'}  width='80%'>
                                           <HStack justifyContent={'space-between'}>
                                               <Box width='8%' backgroundColor={colorSelect.blue} borderRadius={3} height='15px' />
                                               <Box width='8%' backgroundColor={colorSelect.blue} borderRadius={3} height='15px' />
                                               <Box width='8%' backgroundColor={colorSelect.blue} borderRadius={3} height='15px' />
                                               <Box width='8%' backgroundColor={colorSelect.blue} borderRadius={3} height='15px' />
                                               <Box width='8%' backgroundColor={colorSelect.blue} borderRadius={3} height='15px' />
                                               <Box width='8%' backgroundColor={'#EFEFEF'} borderRadius={3} height='15px' />
                                               <Box width='8%' backgroundColor={'#EFEFEF'} borderRadius={3} height='15px' />
                                               <Box width='8%' backgroundColor={'#EFEFEF'} borderRadius={3} height='15px' />
                                               <Box width='8%' backgroundColor={'#EFEFEF'} borderRadius={3} height='15px' />
                                               <Box width='8%' backgroundColor={'#EFEFEF'} borderRadius={3} height='15px' />
                                           </HStack>
                                        </Box>
                                        <Box alignItems={'flex-end'} width='20%'>
                                            <HStack>
                                                <DefText text='5' style={[styles.alarmNumber, {color:'#4473B8'}]} />
                                                <DefText text=' / ' style={[styles.alarmNumber]} />
                                                <DefText text='10' style={[styles.alarmNumber]} />
                                            </HStack>
                                        </Box>
                                    </HStack>
                                    
                                </HStack>
                            </Box>
                            <Box>
                                <HStack alignItems={'center'} justifyContent='space-between' flexWrap={'wrap'}>
                                    <Box width={'20%'} >
                                        <DefText text='계약 완료' style={[styles.alarmText]} />
                                    </Box>
                                    <HStack width={'80%'} >
                                        <Box justifyContent={'center'}  width='80%'>
                                           <HStack justifyContent={'space-between'}>
                                               <Box width='8%' backgroundColor={ colorSelect.blue } borderRadius={3} height='15px' />
                                               <Box width='8%' backgroundColor={ colorSelect.blue } borderRadius={3} height='15px' />
                                               <Box width='8%' backgroundColor={ colorSelect.blue } borderRadius={3} height='15px' />
                                               <Box width='8%' backgroundColor={ colorSelect.blue } borderRadius={3} height='15px' />
                                               <Box width='8%' backgroundColor={ colorSelect.blue } borderRadius={3} height='15px' />
                                               <Box width='8%' backgroundColor={'#EFEFEF'} borderRadius={3} height='15px' />
                                               <Box width='8%' backgroundColor={'#EFEFEF'} borderRadius={3} height='15px' />
                                               <Box width='8%' backgroundColor={'#EFEFEF'} borderRadius={3} height='15px' />
                                               <Box width='8%' backgroundColor={'#EFEFEF'} borderRadius={3} height='15px' />
                                               <Box width='8%' backgroundColor={'#EFEFEF'} borderRadius={3} height='15px' />
                                           </HStack>
                                        </Box>
                                        <Box alignItems={'flex-end'} width='20%'>
                                            <HStack>
                                                <DefText text='5' style={[styles.alarmNumber, {color:'#4473B8'}]} />
                                                <DefText text=' / ' style={[styles.alarmNumber]} />
                                                <DefText text='10' style={[styles.alarmNumber]} />
                                            </HStack>
                                        </Box>
                                    </HStack>
                                </HStack>
                            </Box>

                        </Box>
                    </Shadow>
                    <Box px='20px'>
                        <Box mt='30px'>
                            <DefText text='알림' style={[textStyle.labelTitle, fweight.b, {marginBottom:15}]} />
                            <VStack>
                                <TouchableOpacity style={{marginBottom:10}}>
                                    <HStack alignItems={'center'} p='15px' borderRadius={5} borderWidth={1} borderColor='#D0DAE1' flexWrap={'wrap'}>
                                        <Box width='9%'>
                                            <Box style={[styles.newBox]} >
                                                <DefText text='N' style={[styles.newBoxText]}/>
                                            </Box>
                                        </Box>
                                        <Box width='90%'>
                                            <DefText text='미 열람하신 DB가 2건 있습니다.' style={[styles.noticeText]} />
                                        </Box>
                                    </HStack>
                                </TouchableOpacity>
                                <TouchableOpacity style={{marginBottom:10}}>
                                    <HStack alignItems={'center'} p='15px' borderRadius={5} borderWidth={1} borderColor='#D0DAE1' flexWrap={'wrap'}>
                                        <Box width='9%'>
                                            <Box style={[styles.newBox]} >
                                                <DefText text='N' style={[styles.newBoxText]}/>
                                            </Box>
                                        </Box>
                                        <Box width='90%'>
                                            <DefText text='홍길동 고객님과 통화 스케줄이 있습니다.' style={[styles.noticeText]} />
                                        </Box>
                                    </HStack>
                                </TouchableOpacity>
                                <TouchableOpacity style={{marginBottom:10}}>
                                    <HStack alignItems={'center'} p='15px' borderRadius={5} borderWidth={1} borderColor='#D0DAE1' flexWrap={'wrap'}>
                                        <Box width='9%'>
                                            <Box style={[styles.newBox]} >
                                                <DefText text='N' style={[styles.newBoxText]}/>
                                            </Box>
                                        </Box>
                                        <Box width='90%'>
                                            <DefText text='14시 홍길동 고객님과 미팅이 예정되어 있습니다.' style={[styles.noticeText]} />
                                        </Box>
                                    </HStack>
                                </TouchableOpacity>
                                <TouchableOpacity style={{marginBottom:10}}>
                                    <HStack alignItems={'center'} p='15px' borderRadius={5} borderWidth={1} borderColor='#D0DAE1' flexWrap={'wrap'}>
                                        <Box width='9%'>
                                            <Box style={[styles.newBox]} >
                                                <DefText text='N' style={[styles.newBoxText]}/>
                                            </Box>
                                        </Box>
                                        <Box width='90%'>
                                            <DefText text='14시 홍길동 고객님과 미팅이 예정되어 있습니다.' style={[styles.noticeText]} />
                                        </Box>
                                    </HStack>
                                </TouchableOpacity>
                                <TouchableOpacity>
                                    <HStack alignItems={'center'} p='15px' borderRadius={5} borderWidth={1} borderColor='#D0DAE1' flexWrap={'wrap'}>
                                        <Box width='9%'>
                                            <Box style={[styles.newBox]} >
                                                <DefText text='N' style={[styles.newBoxText]}/>
                                            </Box>
                                        </Box>
                                        <Box width='90%'>
                                            <DefText text='14시 홍길동 고객님과 미팅이 예정되어 있습니다.' style={[styles.noticeText]} />
                                        </Box>
                                    </HStack>
                                </TouchableOpacity>
                            </VStack>
                            <TouchableOpacity style={[{height:20, backgroundColor:'#D0DAE1', justifyContent:'center', alignItems:'center', borderBottomLeftRadius:5, borderBottomRightRadius:5}]}>
                                <Image source={require('../images/noticeMore.png')} alt='더보기' style={{width:15, height:9, resizeMode:'contain'}} />
                            </TouchableOpacity>
                        </Box>
                        <HStack py='30px' justifyContent={'space-around'}>
                            <HStack>
                                <TouchableOpacity style={[styles.menuButton]} onPress={dbMove}>
                                    <Image source={require('../images/homeDBIcon.png')} alt='DB 리스트' style={{width:34, height:34, resizeMode:'contain'}} />
                                    <DefText text='DB 리스트' style={[styles.menuButtonText]} />
                                </TouchableOpacity>
                            </HStack>
                            <HStack>
                                <TouchableOpacity style={[styles.menuButton]} onPress={scheduleMove}>
                                    <Image source={require('../images/homeScheduleIcon.png')} alt='스케줄' style={{width:34, height:34, resizeMode:'contain'}} />
                                    <DefText text='스케줄' style={[styles.menuButtonText]} />
                                </TouchableOpacity>
                            </HStack>
                            <HStack>
                                <TouchableOpacity style={[styles.menuButton]} onPress={communicationMove}>
                                    <Image source={require('../images/homeComuIcon.png')} alt='커뮤니케이션' style={{width:34, height:34, resizeMode:'contain'}} />
                                    <DefText text='커뮤니케이션' style={[styles.menuButtonText]} />
                                </TouchableOpacity>
                            </HStack>
                            <HStack>
                                <TouchableOpacity style={[styles.menuButton]} onPress={()=>navigation.navigate('Education')}>
                                    <Image source={require('../images/homeEducationIcon.png')} alt='교육' style={{width:34, height:34, resizeMode:'contain'}} />
                                    <DefText text='교육' style={[styles.menuButtonText]} />
                                </TouchableOpacity>
                            </HStack>
                        </HStack>
                        <Box>
                            <DefText text='자주 사용하는 메뉴' style={[textStyle.labelTitle, fweight.b, {marginBottom:15}]} />
                            <HStack flexWrap={'wrap'} justifyContent='space-between'>
                                <TouchableOpacity style={[styles.useButton]}>
                                    <Image source={require('../images/useMenuIcon.png')} alt='메뉴 추가' style={{width:14, height:14, resizeMode:'contain'}} />
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.useButton]}>
                                    <Image source={require('../images/useMenuIcon.png')} alt='메뉴 추가' style={{width:14, height:14, resizeMode:'contain'}} />
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.useButton]}>
                                    <Image source={require('../images/useMenuIcon.png')} alt='메뉴 추가' style={{width:14, height:14, resizeMode:'contain'}} />
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.useButton]}>
                                    <Image source={require('../images/useMenuIcon.png')} alt='메뉴 추가' style={{width:14, height:14, resizeMode:'contain'}} />
                                </TouchableOpacity>
                            </HStack>
                        </Box>
                    </Box>
                    
                </Box>
               
            </ScrollView>
        </Box>
    );
};

const styles = StyleSheet.create({
    dateText: {
        fontSize:fsize.fs16,
        color:colorSelect.blue,
        ...fweight.eb
    },
    alarmText: {
        color:colorSelect.black2,
        ...fweight.eb
    },
    alarmNumber : {
        ...fweight.b
    },
    alarmGage: {
        borderRadius:3
    },
    newBox: {
        backgroundColor:'#F99600',
        borderRadius:3,
        fontSize:fsize.fs12,
        width:18,
        height:18,
        alignItems:'center',
        justifyContent:'center',
        marginRight:10
    },
    newBoxText: {
        fontSize:fsize.fs12,
        color:'#fff'
    },
    noticeText: {
        color:colorSelect.black2,
        ...fweight.b
    },
    menuButton: {
        justifyContent:'center',
        alignItems:'center'
    },
    menuButtonText: {
        fontSize:fsize.fs12,
        marginTop:10,
        ...fweight.b
    },
    useButton: {
        width:(width - 40) * 0.2,
        height:33,
        borderRadius:5,
        borderWidth:1,
        borderColor:'#DDDDDD',
        borderStyle:'dashed',
        justifyContent:'center',
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
)(Home);