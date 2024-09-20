import React, { useEffect, useState } from 'react';
import { TouchableOpacity, Platform, Dimensions, ScrollView, StyleSheet, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { Box, HStack, VStack, Input, Image, CheckIcon, Select } from 'native-base';
import { DefText, MainButton, ShadowInput, DefInput, SubmitButtons } from '../common/BOOTSTRAP';
import ToastMessage from '../components/ToastMessage';
import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import { StackActions } from '@react-navigation/native';
import HeaderDef from '../components/HeaderDef';
import { colorSelect, fsize, fweight } from '../common/StyleDef';
import { numberFormat } from '../common/dataFunction';
import Api from '../Api';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';

const DBRequestList = (props) => {

    const {navigation, userInfo} = props;

    const [loading, setLoading] = useState(false);
    const [dbreqlist, setdbreqList] = useState([]);

    const dbrequestReceive = () => {
        Api.send('db_requestList', {'midx':userInfo.mb_no}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               console.log('db 요청 리스트 결과: ', arrItems, resultItem);
               setdbreqList(arrItems);
            }else{
                console.log('db 요청 리스트 실패!', resultItem);
               
            }
        });
    }

    useEffect(()=> {
        dbrequestReceive();
    }, []);

    const dbReqNav = () => {
        navigation.navigate('DBRequest');
    }


    const isFocused = useIsFocused();
    
    useEffect(()=>{
        if(isFocused){
            dbrequestReceive();
        }
    }, [isFocused]);


    const [refreshing, setRefreshing] = useState(false);

    const refreshList = () => {
        dbrequestReceive();
    }

    const _renderItem = ({item, index}) => {



        return(
            <Box px='20px' key={index} mt={index === 0 && '15px'} mb={'15px'}>
                <Box shadow={9} backgroundColor='#fff' borderRadius={10}>
                    <Box p='20px' pb='40px'>
                        <DefText text={item.fpname +'님의 DB신청내역 (' + item.db_insert_time.substring(0,10) + ')'} style={[styles.videoTitle, {marginBottom:5}]} />
                        <HStack mt='10px' alignItems={'center'}>
                            <Box width='35%' >
                                <DefText text={'희망 DB 수'} style={[styles.videoText1]} />
                            </Box>
                            <Box>
                                <DefText text={item.dbcount + '개'} style={[styles.videoText11]} />
                            </Box>
                        </HStack>
                        <HStack mt='10px' alignItems={'center'}>
                            <Box width='35%' >
                                <DefText text={'지역1'} style={[styles.videoText1]} />
                            </Box>
                            <Box>
                                <DefText text={item.dbarea1} style={[styles.videoText11]} />
                            </Box>
                        </HStack>
                        <HStack mt='10px' alignItems={'center'}>
                            <Box width='35%' >
                                <DefText text={'지역2'} style={[styles.videoText1]} />
                            </Box>
                            <Box>
                                <DefText text={item.dbarea2} style={[styles.videoText11]} />
                            </Box>
                        </HStack>
                        <HStack mt='10px' alignItems={'center'}>
                            <Box width='35%' >
                                <DefText text={'희망 나이'} style={[styles.videoText1]} />
                            </Box>
                            <Box>
                                <DefText text={item.dbage} style={[styles.videoText11]} />
                            </Box>
                        </HStack>
                        <HStack mt='10px' alignItems={'center'}>
                            <Box width='35%' >
                                <DefText text={'희망 성별'} style={[styles.videoText1]} />
                            </Box>
                            <Box>
                                <DefText text={item.dbgender == 1 ? '여자' : '남자'} style={[styles.videoText11]} />
                            </Box>
                        </HStack>
                        <HStack mt='10px' alignItems={'center'}>
                            <Box width='35%' >
                                <DefText text={'가족상담유무'} style={[styles.videoText1]} />
                            </Box>
                            <Box>
                                <DefText text={item.familys} style={[styles.videoText11]} />
                            </Box>
                        </HStack>
                    </Box>
                   
                    <Box position={'absolute'} bottom='20px' right='20px'>
                        <HStack alignItems={'center'}>
                            <DefText text={item.db_excess === '예' ? '승인' : '미승인'} style={[{marginRight:5},item.db_excess === '예' ? {color:colorSelect.blue} : {color:'#f00'}]} />
                        </HStack>
                    </Box>
                </Box>
            </Box>
        )
    };


    return (
        <Box flex={1} backgroundColor='#fff'>
            <HeaderDef headerTitle='가망고객 신청내역' navigation={navigation} />
            {
                loading ?
                <Box flex={1} alignItems='center' justifyContent={'center'}>
                    <ActivityIndicator size='large' color='#333' />
                </Box>
                :
                <FlatList 
  
                    data={dbreqlist}
                    renderItem={_renderItem}
                    keyExtractor={(item, index)=>index.toString()}
                    ListEmptyComponent={
                        <Box py={10} alignItems='center' flex={1}>
                            <DefText text='가망고객 요청목록이 없습니다.' style={{color:colorSelect.black666}} />
                        </Box>                
                    }
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={refreshList} />
                    }
                />
            }
            <SubmitButtons 
                btnText='가망고객 신청하기'
                onPress={dbReqNav}
            />
        </Box>
    );
};

const styles = StyleSheet.create({
    videoTitle: {
        fontSize:15,
        ...fweight.eb
    },
    videoText1: {
        fontSize:13,
        ...fweight.b
    },
    videoText11: {
        fontSize:13,
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
)(DBRequestList);