import React, {useState, useEffect} from 'react';
import { ScrollView, Platform, Dimensions, StyleSheet, Alert, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Box, VStack, HStack, Image, Input } from 'native-base';
import { DefText } from '../common/BOOTSTRAP';
import Font from '../common/Font';
import HeaderHome from '../components/HeaderHome';
import {fsize, fweight, colorSelect, textStyle} from '../common/StyleDef';
import { Shadow } from 'react-native-neomorph-shadows';

import {changeMemberList} from '../Utils/DummyData';

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

    const [desc, setDesc] = useState(false);
    const descChange = () => {
        setDesc(!desc)
    }


    const [changeData, setChangeData] = useState([]);

    const changeList = () => {
        Api.send('db_changelist', {'id':userInfo.mb_id, 'order':desc}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
                //console.log('db 변경이력 상세: ', resultItem);

                setChangeData(arrItems);
                //setDBInfo(arrItems)
            }else{
                console.log('db 변경이력 통신 오류!', resultItem);

            }
        });
    }

    useEffect(()=>{
        changeList();
    }, [desc])

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
                                    <DefText text='2021.12.31 오후 12:00' style={[styles.dateText, fweight.eb]} />
                                    <TouchableOpacity>
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
                                            <DefText text='8' style={[fweight.b, {color:colorSelect.blue}]} />
                                            <DefText text=' / ' style={[fweight.b]} />
                                            <DefText text='10' style={[fweight.b]} />
                                        </HStack>
                                    </HStack>
                                    <Box width='45%' backgroundColor={'#EFEFEF'} height='15px' borderRadius={3}>
                                        <Box width='50%' backgroundColor={colorSelect.blue} borderRadius={3} justifyContent='center' alignItems={'center'}>
                                            <DefText text='50%' style={[{color:colorSelect.white, fontSize:12}]} />
                                        </Box>
                                    </Box>
                                </HStack>
                                <HStack justifyContent='space-between' alignItems={'center'} flexWrap={'wrap'} mt='15px'>
                                    <HStack alignItems={'center'} width='50%'>
                                        <Box width='77%'>
                                            <DefText text='현재 미팅 진행률' style={[fweight.eb, {marginRight:10}]} />
                                        </Box>
                                        <HStack alignItems={'center'} width='23%'>
                                            <DefText text='8' style={[fweight.b, {color:colorSelect.blue}]} />
                                            <DefText text=' / ' style={[fweight.b]} />
                                            <DefText text='10' style={[fweight.b]} />
                                        </HStack>
                                    </HStack>
                                    <Box width='45%' backgroundColor={'#EFEFEF'} height='15px' borderRadius={3}>
                                        <Box width='50%' backgroundColor={colorSelect.blue} borderRadius={3} justifyContent='center' alignItems={'center'}>
                                            <DefText text='50%' style={[{color:colorSelect.white, fontSize:12}]} />
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
                                <TouchableOpacity style={[styles.ingButton]} disabled={meeting == 0 ? true : false}>
                                    <DefText text='미팅' style={[fweight.b, meeting == 0 && {color:colorSelect.gray}]} />
                                    <DefText text='3' style={[{marginTop:15}, meeting == 0 && {color:colorSelect.gray}]} />
                                </TouchableOpacity>
                                <Box style={styles.boxline} />
                                <TouchableOpacity style={[styles.ingButton]} disabled={call == 0 ? true : false}>
                                    <DefText text='통화' style={[fweight.b, call == 0 && {color:colorSelect.gray}]} />
                                    <DefText text='0' style={[{marginTop:15}, call == 0 && {color:colorSelect.gray}]} />
                                </TouchableOpacity>
                                <Box style={styles.boxline} />
                                <TouchableOpacity style={[styles.ingButton]} disabled={nothing == 0 ? true : false}>
                                    <DefText text='부재' style={[fweight.b, nothing == 0 && {color:colorSelect.gray}]} />
                                    <DefText text='1' style={[{marginTop:15}, nothing == 0 && {color:colorSelect.gray}]} />
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