import React, {useState, useEffect} from 'react';
import { ScrollView, Platform, Dimensions, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { Box, VStack, HStack, Image, Input } from 'native-base';
import { DefText } from '../common/BOOTSTRAP';
import Font from '../common/Font';

import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import { StackActions } from '@react-navigation/native';
import Api from '../Api';

//고정 헤더 높이
const headerHeight = 55;

const HeaderMain = (props) => {

    const {navigation, headerTitle, userInfo} = props;

    const [dbNotice, setDBNotice] = useState(0);
    const [comNotice, setComNotice] = useState(0);
    const AlarmNumber = () => {
        Api.send('notice_list', {'idx':userInfo.mb_no, 'recName':userInfo.mb_name}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
                console.log('알람 출력: ', resultItem, arrItems);
                setDBNotice(arrItems.dbnotice)
                setComNotice(arrItems.comnotice)
            }else{
                console.log('알람 출력 실패!', resultItem);

            }
        });
    }

    useEffect(()=>{
        AlarmNumber();
    }, []);

    const dbMove = () => {
        navigation.navigate('Tab_Navigation', {
            screen: 'Db',
        });
    }

    const communicationMove = () => {
        navigation.navigate('Tab_Navigation', {
            screen: 'Comunication',
        });
    }

    return (
        <Box height={headerHeight + 'px'}  alignItems={'center'} justifyContent='center' backgroundColor={'#fff'}>
            <DefText text={headerTitle} style={[styles.headerTitle, Platform.OS === 'ios' ? {fontWeight:'700'} : {fontFamily:Font.NanumSquareRoundEB}]} />
            <Box style={[styles.homeIconWrap]}>
                <HStack alignItems={'center'}>
                    <TouchableOpacity onPress={dbMove} style={{marginRight:15}}>
                        <Image source={require('../images/homeAlarmIcon.png')} alt='DB 미완료 알람' style={{width:21, height:21, resizeMode:'contain'}} />
                        <Box style={[styles.alarmCount]} >
                            <DefText text={dbNotice != 0 ? dbNotice : 0} style={[{color:'#fff', fontSize:13}]} />
                        </Box>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={communicationMove}>
                        <Image source={require('../images/homeMsgIcon.png')} alt='공지 및 쪽지 미확인 알람' style={{width:24, height:19, resizeMode:'contain'}} />
                        <Box style={[styles.alarmCount]} >
                            <DefText text={comNotice != 0 ? comNotice : 0} style={[{color:'#fff', fontSize:13}]} />
                        </Box>
                    </TouchableOpacity>
                </HStack>
            </Box>
        </Box>
    );
};

const styles = StyleSheet.create({
    headerTitle: {
        fontSize:18,
    },
    homeIconWrap: {
        height:headerHeight,
        position:'absolute',
        right: 25,
        justifyContent:'center'
    },
    alarmCount: {
        backgroundColor:'#F99600',
        overflow: 'hidden',
        width:21,
        height:21,
        borderRadius:21,
        alignItems:'center',
        justifyContent:'center',
        position: 'absolute',
        top:-10,
        right:-10
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
)(HeaderMain);