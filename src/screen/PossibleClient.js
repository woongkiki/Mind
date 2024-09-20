import React, {useState, useEffect} from 'react';
import { ScrollView, Platform, Dimensions, StyleSheet, Alert, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Box, VStack, HStack, Image, Input } from 'native-base';
import { DefText, SearchInput } from '../common/BOOTSTRAP';
import Font from '../common/Font';
import HeaderDef from '../components/HeaderDef';
import {fsize, fweight, colorSelect, textStyle} from '../common/StyleDef';
import { Shadow } from 'react-native-neomorph-shadows';
import {possibleMeberList} from '../Utils/DummyData';

import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import { StackActions } from '@react-navigation/native';
import Api from '../Api';

const PossibleClient = (props) => {

    const {navigation, userInfo} = props;

    const [searchText, setSearchText] = useState('');
    const schTextChange = (text) => {
        setSearchText(text);
    }

    const schHandler = () => {
        if(searchText == ''){
            Alert.alert('검색어를 입력해주세요.');
            return false;
        }

        Alert.alert(searchText);
    }

    const [progressStatus, setProgressStatus] = useState(['가망고객']);

    const [clientLoading, setClientLoading] = useState(false);
    const [allClients, setAllClient] = useState([]);
    const allClientReceive = async () => {
        await setClientLoading(true);
        await Api.send('db_list', {'idx':userInfo.mb_no, 'open':'전체', 'schText': searchText,'startDate':'', 'endDate':'', 'progress':progressStatus.join('^')}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
                console.log('전체 고객 리스트 결과: ', resultItem);
                setAllClient(arrItems);

            }else{
                console.log('결과 출력 실패!', resultItem);

            }
        });
        await setClientLoading(false);
    }

    useEffect(()=>{
        allClientReceive();
    }, [])

    return (
        <Box flex={1} backgroundColor='#fff'>
            <HeaderDef headerTitle='가망 고객 리스트' navigation={navigation} />
            <ScrollView>
                <Box p='20px'>
                    <SearchInput
                        placeholder='검색어를 입력해 주세요. (고객명, 지역)'
                        value={searchText}
                        onChangeText={schTextChange}
                        onPress={schHandler}
                    />
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
                                <Box key={index} backgroundColor={ item.wr_4 == 'AS 완료 승인' ? '#eee' : '#fff'} borderRadius={10} shadow={9} mt={'15px'}>
                                    <TouchableOpacity disabled={ item.wr_4 == 'AS 완료 승인' ? true : false }   style={{padding:15}} onPress={()=>navigation.navigate('ClientInfo', {'idx':item.wr_id})}>
                                        <HStack>
                                            <DefText text={item.wr_subject + ' 고객님'} style={[{marginRight:10}, fweight.b]} />
                                            <DefText text={'(' + item.age + '세 / ' + item.bigo + ')'} />
                                        </HStack>
                                        <DefText text={item.wr_addr1} style={[{marginTop:10}]} />
                                        <Box position={'absolute'} top='15px' right='20px'>
                                            <Image source={require('../images/memberInfoArr.png')} alt='회원정보 화살표' style={{width:6, height:10, resizeMode:'contain'}} />
                                        </Box>
                                        
                                    </TouchableOpacity>
                                </Box>
                            )
                        })
                        :
                        <Box justifyContent={'center'} alignItems='center' py='40px'>
                            <DefText text={'현재 가망고객 상태인 고객 정보가 없습니다.'} />
                        </Box>
                    }
                </Box>
            </ScrollView>
        </Box>
    );
};

export default connect(
    ({ User }) => ({
        userInfo: User.userInfo, //회원정보
    }),
    (dispatch) => ({
        member_login: (user) => dispatch(UserAction.member_login(user)), //로그인
        member_info: (user) => dispatch(UserAction.member_info(user)), //회원 정보 조회
        
    })
)(PossibleClient);