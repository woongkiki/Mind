import React, {useState, useEffect} from 'react';
import { ScrollView, Platform, Dimensions, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { Box, VStack, HStack, Image, Input } from 'native-base';
import { DefText } from '../common/BOOTSTRAP';
import Font from '../common/Font';


//고정 헤더 높이
const headerHeight = 55;

const HeaderMain = (props) => {

    const {navigation, headerTitle} = props;



    return (
        <Box height={headerHeight + 'px'}  alignItems={'center'} justifyContent='center' backgroundColor={'#fff'}>
            <DefText text={headerTitle} style={[styles.headerTitle, Platform.OS === 'ios' ? {fontWeight:'700'} : {fontFamily:Font.NanumSquareRoundEB}]} />
            <Box style={[styles.homeIconWrap]}>
                <HStack alignItems={'center'}>
                    <TouchableOpacity style={{marginRight:15}}>
                        <Image source={require('../images/homeAlarmIcon.png')} alt='DB 미완료 알람' style={{width:21, height:21, resizeMode:'contain'}} />
                        <Box style={[styles.alarmCount]} >
                            <DefText text='1' style={[{color:'#fff', fontSize:13}]} />
                        </Box>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Image source={require('../images/homeMsgIcon.png')} alt='공지 및 쪽지 미확인 알람' style={{width:24, height:19, resizeMode:'contain'}} />
                        <Box style={[styles.alarmCount]} >
                            <DefText text='1' style={[{color:'#fff', fontSize:13}]} />
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

export default HeaderMain;