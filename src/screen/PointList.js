import React, {useState, useEffect} from 'react';
import { ScrollView, Platform, Dimensions, StyleSheet, Alert, View, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { Box, VStack, HStack, Image, Input, Select } from 'native-base';
import { DefText, SearchInput, SubmitButtons } from '../common/BOOTSTRAP';
import HeaderDef from '../components/HeaderDef';
import {fsize, fweight, colorSelect, textStyle} from '../common/StyleDef';
import { pointList } from '../Utils/DummyData';
import { numberFormat, textLengthOverCut } from '../common/dataFunction';

import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import { StackActions } from '@react-navigation/native';
import Api from '../Api';

import { useFocusEffect, useIsFocused } from '@react-navigation/native';

const {width} = Dimensions.get('window');
const tabButtonWidth = (width - 40) * 0.333;

const PointList = (props) => {

    const {navigation, userInfo} = props;

    const [category, setCategory] = useState('전체');

    const CategoryHandler = (category) => {
        setCategory(category);
    }

    const [pointLoading, setPointLoading] = useState(true);
    const [points, setPoints] = useState('');
    const [pointRequest, setPointRequest] = useState([]);
    const handlerSubmit = async () => {
        await setPointLoading(true);
       await Api.send('price_point', {'idx':userInfo.mb_no}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               //console.log('포인트 출력 결과: ', arrItems, resultItem);
               setPoints(arrItems);
            }else{
                console.log('포인트 출력 실패!', resultItem);

            }
        });

        await Api.send('price_pointList', {'idx':userInfo.mb_no, 'date':category}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               console.log('포인트 내역 결과: ', arrItems, resultItem);
               setPointRequest(arrItems);
            }else{
                console.log('포인트 내역 실패!', resultItem);

            }
        });
        await setPointLoading(false);
    }

    useEffect(()=>{
        handlerSubmit();
    }, [category])

    const isFocused = useIsFocused();
    useEffect(()=>{
        if(isFocused){

            handlerSubmit();
        }
    }, [isFocused])

    const _renderItem = ({item, index}) => {
        return(
            <Box px='20px' mb={'20px' }>
                <Box key={index} p='15px' backgroundColor={'#fff'} borderRadius={10} shadow={9}>
                    <HStack mb='10px'>
                        <Box style={[styles.pointLeft]}>
                            <DefText text='충전 요청일' style={[styles.pointLabel]} />
                        </Box>
                        <Box>
                            <DefText text={item.wr_datetime} />
                        </Box>
                    </HStack>
                    <HStack mb='10px'>
                        <Box style={[styles.pointLeft]}>
                            <DefText text='충전 승인일' style={[styles.pointLabel]}  />
                        </Box>
                        <Box>
                            {
                                item.wr_2 == 'N' ?
                                <DefText text={'-'} />
                                :
                                <DefText text={item.wr_last} />
                            }
                            
                        </Box>
                    </HStack>
                    <HStack mb='10px'>
                        <Box style={[styles.pointLeft]}>
                            <DefText text='요청 포인트' style={[styles.pointLabel]} />
                        </Box>
                        <Box>
                            <DefText text={ numberFormat(item.wr_1) + 'P'} style={[{color:colorSelect.blue}]}/>
                        </Box>
                    </HStack>
                    <HStack>
                        <Box style={[styles.pointLeft]}>
                            <DefText text='잔여 포인트' style={[styles.pointLabel]}  />
                        </Box>
                        <Box>
                            <DefText text={numberFormat(item.nowPoint) + 'P'} style={[{color:colorSelect.orange}]} />
                        </Box>
                    </HStack> 
                </Box>
            </Box>
        )
    }

    return (
        <Box flex={1} backgroundColor='#fff'> 
            <HeaderDef headerTitle='포인트 충전내역' navigation={navigation} />
            {
                !pointLoading ?
                <FlatList 
                    ListHeaderComponent={
                        <Box p='20px'>
                            <Box>
                                <DefText text='보유포인트' style={[styles.pointTitle]} />
                                <HStack mt='15px' alignItems={'center'} justifyContent='space-between'>
                                    <DefText text={ points != '' ? numberFormat(points) + 'P' : '0' } style={[styles.point]} />
                                    {/* <TouchableOpacity onPress={()=>navigation.navigate('PointUseList')} style={{padding:5, backgroundColor:colorSelect.blue, paddingHorizontal:10, borderRadius:5}}>
                                        <DefText text='포인트 사용내역' style={[{fontSize:fsize.fs12, color:colorSelect.white}]} />
                                    </TouchableOpacity> */}
                                </HStack>
                            </Box>
                            <HStack backgroundColor={'#F0F0F0'} borderRadius={10} mt='20px'>
                                <TouchableOpacity onPress={()=>CategoryHandler('전체')} style={[styles.tabWidth, category == '전체' && {backgroundColor:colorSelect.blue}]}>
                                    <DefText text='전체' style={category == '전체' && [ {color:colorSelect.white}, fweight.eb ]} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={()=>CategoryHandler('1개월')} style={[styles.tabWidth, category == '1개월' && {backgroundColor:colorSelect.blue}]}>
                                    <DefText text='1개월' style={ category == '1개월' && [ {color:colorSelect.white} ]} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={()=>CategoryHandler('3개월')} style={[styles.tabWidth, category == '3개월' && {backgroundColor:colorSelect.blue}]}>
                                    <DefText text='3개월' style={ category == '3개월' && [ {color:colorSelect.white} ]} />
                                </TouchableOpacity>
                            </HStack>
                        </Box>
                    }
                    data={pointRequest}
                    renderItem={_renderItem}
                    keyExtractor={(item, index)=>index.toString()}
                    ListEmptyComponent={
                        <Box py={10} alignItems='center' mt='10px'>
                            <DefText text='포인트 내역이 없습니다.' style={{color:colorSelect.black666}} />
                        </Box>                
                    }
                />
                :
                <Box flex={1} justifyContent='center'>
                    <ActivityIndicator size='large' color={'#333'} />
                </Box>
            }
            
            <SubmitButtons 
                btnText = '포인트 신청하기'
                onPress={()=>navigation.navigate('PointRequest')}
            />
        </Box>
    );
};

const styles = StyleSheet.create({
    pointTitle : {
        fontSize:fsize.fs20,
        ...fweight.b
    },
    point : {
        fontSize:fsize.fs16,
        color:colorSelect.orange,
        
    },
    tabWidth: {
        width : tabButtonWidth,
        height : 40,
        alignItems:'center',
        justifyContent:'center',
        borderRadius:10
    },
    pointLeft: {
        width: '27%'
    },
    pointLabel : {
        ...fweight.b
    },
    pointRight: {
        width: '70%'
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
)(PointList);