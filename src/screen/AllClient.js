import React, {useState, useEffect} from 'react';
import { ScrollView, Platform, Dimensions, StyleSheet, Alert, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Box, VStack, HStack, Image, Input } from 'native-base';
import { DefText, SearchInput } from '../common/BOOTSTRAP';
import Font from '../common/Font';
import HeaderDef from '../components/HeaderDef';
import {fsize, fweight, colorSelect, textStyle} from '../common/StyleDef';
import {allClient, allClientYes, allClientNo} from '../Utils/DummyData';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';

import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import { StackActions } from '@react-navigation/native';
import Api from '../Api';

const {width} = Dimensions.get('window');

const AllClient = (props) => {

    const {navigation, route, userInfo} = props;

    const {params} = route;

    //console.log('props', params);

    const [searchText, setSearchText] = useState('');
    const schTextChange = (text) => {
        setSearchText(text);
    }

    const schHandler = () => {
        // if(searchText == ''){
        //     Alert.alert('검색어를 입력해주세요.');
        //     return false;
        // }

        allClientReceive();
    }

    const [selectTag, setSelectTag] = useState('전체');
    const selectTagHandler = (tag) => {
        setSelectTag(tag);
    }


    //시간 및 카테고리 설정 전달 받기
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [progressStatus, setProgressStatus] = useState([]);

    const isFocused = useIsFocused();

    useEffect(()=>{

        if(isFocused){

            allClientReceive();

            if(params.startDate != ''){
                //Alert.alert(params.startDate);
                setStartDate(params.startDate);
            }
            if(params.endDate != ''){
                //Alert.alert(params.endDate);
                setEndDate(params.endDate);
            }
            if(params.progressStatus != ''){
                setProgressStatus(params.progressStatus);
            }
        }

    }, [isFocused]);

    const dateDeleteHandler = () => {
        setStartDate('');
        setEndDate('');
    }

    const progressStatusDel = (cate) => {
        const categoryFilter = progressStatus.filter((e, index)=>{
            return e !== cate;
        });
        setProgressStatus(categoryFilter);
    }

    const [clientLoading, setClientLoading] = useState(true);
    const [allClients, setAllClient] = useState([]);
    const allClientReceive = async () => {
        await setClientLoading(true);
        await Api.send('db_list', {'idx':userInfo.mb_no, 'open':selectTag, 'schText': searchText,'startDate':startDate, 'endDate':endDate, 'progress':progressStatus.join('^')}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
                console.log('전체 고객 리스트 결과: ', arrItems, resultItem);
                setAllClient(arrItems);

            }else{
                console.log('결과 출력 실패!', resultItem);

            }
        });
        await setClientLoading(false);
    }

    useEffect(()=>{
        allClientReceive();
    },[selectTag, startDate, endDate, progressStatus]);

    return (
        <Box flex={1} backgroundColor='#fff'>
            <HeaderDef headerTitle='전체 고객 리스트' navigation={navigation} />
            <ScrollView>
                <Box p='20px'>
                    <HStack justifyContent={'space-between'} alignItems='center'>
                        
                        <Box width='90%'>
                            <SearchInput 
                                placeholder='검색어를 입력해 주세요. (고객명, 지역)'
                                value={searchText}
                                onChangeText={schTextChange}
                                onPress={schHandler}
                            />
                        </Box>
                        <TouchableOpacity
                            onPress={()=>navigation.navigate('SearchSetting', {'startDate':startDate, 'endDate':endDate, 'progressStatus': progressStatus})}
                            style={{alignItems:'center', justifyContent:'center'}}
                        >
                            <Image source={require('../images/allClientMenu.png')} alt='검색필터 설정' style={{width:16, height:13, resizeMode:'contain'}}/>
                        </TouchableOpacity>
                    </HStack>
                    <HStack backgroundColor={'#F0F0F0'} borderRadius={10} mt='15px'>
                        <TouchableOpacity 
                            style={[styles.tagButton, selectTag === '전체' && { backgroundColor: colorSelect.blue }]}
                            onPress={()=>selectTagHandler('전체')}
                        >
                            <DefText text={'전체'} style={selectTag === '전체' && [{color: colorSelect.white}, fweight.eb]} />
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={[styles.tagButton, selectTag === '열람' && { backgroundColor: colorSelect.blue }]}
                            onPress={()=>selectTagHandler('열람')}
                        >
                            <DefText text={'열람'} style={selectTag === '열람' && [{color: colorSelect.white}, fweight.eb]} />
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={[styles.tagButton, selectTag === '미열람' && { backgroundColor: colorSelect.blue }]}
                            onPress={()=>selectTagHandler('미열람')}
                        >
                            <DefText text={'미열람' + ' (' + allClientNo.length + ')'} style={selectTag === '미열람' && [{color: colorSelect.white}, fweight.eb]} />
                        </TouchableOpacity>
                    </HStack>
                    {
                        startDate != '' && endDate != '' &&
                        <HStack mt='15px' alignItems={'center'}>
                            <DefText text={'날짜설정 : ' + startDate + ' ~ ' + endDate} />
                            <TouchableOpacity onPress={dateDeleteHandler} style={{width:20, height:20, backgroundColor:'#333', borderRadius:15, alignItems:'center', justifyContent:'center', marginLeft:5}}>
                                <Image source={require('../images/categoryDel.png')} alt='카테고리 삭제' style={{width:7, resizeMode:'contain'}} />
                            </TouchableOpacity>
                        </HStack>
                    }
                    {
                        progressStatus != '' &&
                        <HStack flexWrap={'wrap'} mt='15px'>
                        {
                        progressStatus.map((item, index)=> {
                            return(
                                <Box key={index} borderRadius={5} backgroundColor='#333' py='5px' px='10px' mr='10px'>
                                    <HStack>
                                        <DefText text={item} style={[{color:colorSelect.white, fontSize:fsize.fs12}]} />
                                        <TouchableOpacity onPress={()=>progressStatusDel(item)}>
                                            <Image source={require('../images/categoryDel.png')} alt='카테고리 삭제' style={{width:7, resizeMode:'contain', marginLeft:10}} />
                                        </TouchableOpacity>
                                    </HStack>
                                </Box>
                            )
                        })
                        }
                        </HStack>
                    }
                    {
                        clientLoading ?
                        <Box justifyContent={'center'} alignItems='center' py='100px'>
                            <ActivityIndicator size={'large'} color='#333' />
                        </Box>
                        :
                        allClients != '' &&
                        allClients.length > 0 ?
                        allClients.map((item, index)=> {
                            return(
                                <Box key={index} backgroundColor={'#fff'} borderRadius={10} shadow={9} mt={'15px'}>
                                    <TouchableOpacity  style={{padding:15}} onPress={()=>navigation.navigate('ClientInfo', {'idx':item.wr_id})}>
                                        <HStack>
                                            <DefText text={item.wr_subject + ' 고객님'} style={[{marginRight:10}, fweight.b]} />
                                            <DefText text={'(' + item.age + '세 / ' + item.bigo + ')'} />
                                        </HStack>
                                        <DefText text={item.wr_addr1} style={[{marginTop:10}]} />
                                        <Box position={'absolute'} top='15px' right='20px'>
                                            <Image source={require('../images/memberInfoArr.png')} alt='회원정보 화살표' style={{width:6, height:10, resizeMode:'contain'}} />
                                        </Box>
                                        <Box position={'absolute'} bottom='15px' right='20px'>
                                            {
                                                item.dbcheck == '1' ?
                                                <DefText text='열람' style={[{color:colorSelect.blue}]} />
                                                :
                                                <DefText text='미열람' style={[{color:'#FF4D4D'}]} />
                                            }
                                            
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
)(AllClient);