import React, {useState, useEffect} from 'react';
import { ScrollView, Platform, Dimensions, StyleSheet, Alert, View, TouchableOpacity, FlatList } from 'react-native';
import { Box, VStack, HStack, Image, Input, Select } from 'native-base';
import { DefInput, DefText, SearchInput, SubmitButtons } from '../common/BOOTSTRAP';
import HeaderDef from '../components/HeaderDef';
import {fsize, fweight, colorSelect, textStyle} from '../common/StyleDef';
import { pointRequest } from '../Utils/DummyData';
import { numberFormat, textLengthOverCut } from '../common/dataFunction';

import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import { StackActions } from '@react-navigation/native';
import Api from '../Api';
import ToastMessage from '../components/ToastMessage';


const {width} = Dimensions.get('window');

const PointRequest = (props) => {

    const {navigation, userInfo} = props;

    const [reqPoint, setReqPoint] = useState('');
    const pointChangeHandler = (point) => {
        setReqPoint(point)
    }

    const pointRequestSend = () => {
        if(reqPoint == ''){
            ToastMessage('요청하실 포인트를 입력하세요.');
            return false;
        }

        Api.send('price_pointRequest', {'idx':userInfo.mb_no, 'mb_name':userInfo.mb_name, 'mb_id':userInfo.mb_id,'reqPoint':reqPoint}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               console.log('포인트 요청 결과: ', arrItems, resultItem);
               //setPoints(arrItems);
               ToastMessage(resultItem.message);
               navigation.goBack();
            }else{
                console.log('포인트 요청 출력 실패!', resultItem);

            }
        });
    }


    

    const _renderItem = ({item, index}) => {
        return(
            <Box px='20px' mb={index + 1 === pointRequest.length && '20px'}>
                <HStack>
                    <Box style={[styles.tbody, {width:(width - 40) * 0.2}]}>
                        <DefText text={item.idx} style={[styles.thText, {color:colorSelect.black666}]} />
                    </Box>
                    <Box style={[styles.tbody, {width:(width - 40) * 0.4}]}>
                        <DefText text={item.chargeDate} style={[styles.thText, {color:colorSelect.black666}]} />
                    </Box>
                    <Box style={[styles.tbody, {width:(width - 40) * 0.4}]}>
                        <DefText text={ numberFormat(item.chargePrice)} style={[styles.thText, {color:colorSelect.black666}]} />
                    </Box>
                </HStack>
            </Box>
        )
    }

    return (
        <Box flex={1} backgroundColor='#fff'>
            <HeaderDef headerTitle='포인트 충전 신청' navigation={navigation} />
            <FlatList 
                ListHeaderComponent={
                    <Box p='20px' pb='0'>
                        <Box>
                            <DefText text='보유포인트' style={[styles.pointTitle]} />
                            <DefText text={ numberFormat(500000) + 'P' } style={[styles.point]} />
                        </Box>
                        <Box mt='30px'>
                            <DefText text='요청 포인트' style={[styles.pointTitle, {marginBottom:15}]} />
                            <DefInput
                                placeholderText = '요청하실 포인트를 입력해주세요.'
                                inputValue={reqPoint}
                                onChangeText={pointChangeHandler}
                                inputStyle={{height:40, borderColor:'#999999'}}
                                keyboardType='number-pad'
                            />
                            <SubmitButtons 
                                btnText = '신청'
                                buttonStyle={{width:width - 40, height:40, borderRadius:5, marginTop:10}}
                                btnTextStyle={[{fontSize:fsize.fs14}, fweight.eb]}
                                onPress={pointRequestSend}
                            />
                        </Box>
                        <Box mt='30px'>
                            <DefText text='포인트 신청 내역' style={[styles.pointTitle]} />
                            <HStack mt='15px'>
                                <Box style={[styles.thead, {width:(width - 40) * 0.2}]}>
                                    <DefText text='회차' style={[styles.thText]} />
                                </Box>
                                <Box style={[styles.thead, {width:(width - 40) * 0.4}]}>
                                    <DefText text='충전 시간' style={[styles.thText]} />
                                </Box>
                                <Box style={[styles.thead, {width:(width - 40) * 0.4}]}>
                                    <DefText text='충전 금액' style={[styles.thText]} />
                                </Box>
                            </HStack>
                        </Box>
                    </Box>
                }
                data={pointRequest}
                renderItem={_renderItem}
                keyExtractor={(item, index)=>index.toString()}
                ListEmptyComponent={
                    <Box py={10} alignItems='center' mt='10px'>
                        <DefText text='포인트 신청내역이 없습니다.' style={{color:colorSelect.black666}} />
                    </Box>                
                }
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
        marginTop:15
    },
    thead : {
        paddingVertical:10,
        backgroundColor:'#F9F9F9',
        justifyContent:'center',
        alignItems:'center',
        borderTopWidth:1,
        borderTopColor:'#C9C9C9'
    },
    thText: {
        fontSize:13,
        color:'#9A9A9A',
        ...fweight.b
    },
    tbody : {
        paddingVertical:10,
        backgroundColor:'#fff',
        justifyContent:'center',
        alignItems:'center',
        borderBottomWidth:1,
        borderBottomColor:'#FAFAFA'
    },
    
})

export default connect(
    ({ User }) => ({
        userInfo: User.userInfo, //회원정보
    }),
    (dispatch) => ({
        member_login: (user) => dispatch(UserAction.member_login(user)), //로그인
        member_info: (user) => dispatch(UserAction.member_info(user)), //회원 정보 조회
        
    })
)(PointRequest);