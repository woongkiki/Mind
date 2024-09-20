import React, {useState, useEffect} from 'react';
import { ScrollView, Platform, Dimensions, StyleSheet, Alert, View, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { Box, VStack, HStack, Image, Input, Select } from 'native-base';
import { DefText, SearchInput } from '../common/BOOTSTRAP';
import HeaderDef from '../components/HeaderDef';
import {fsize, fweight, colorSelect, textStyle} from '../common/StyleDef';
import { videoEdu, eduData, myEducation } from '../Utils/DummyData';
import { textLengthOverCut } from '../common/dataFunction';

import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import { StackActions } from '@react-navigation/native';
import Api from '../Api';

const {width} = Dimensions.get('window');

const MyEducation = (props) => {

    const { navigation, userInfo } = props;

    const [category, setCategory] = useState('');

    const [searchText, setSearchText] = useState('');

    const schTextChange = (text) => {
        setSearchText(text);
    }

    const schHandler = () => {
        myEduRec();
    }

    const [myEduLoading, setMyEduLoading] = useState(true);
    const [myEduData, setMyEduData] = useState([]);
    const myEduRec = async () => {
        await setMyEduLoading(true);
        await Api.send('com_myEdu', {'category':category, 'schText':searchText}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               console.log('MY 교육자료 결과: ', arrItems, resultItem);
               //setVideoData(arrItems);
               setMyEduData(arrItems);
            }else{
                console.log('MY 교육자료 실패!', resultItem);

            }
        });
        await setMyEduLoading(false);
    }

    useEffect(()=>{
        myEduRec();
    }, [category])

    const _renderItem = ({item, index}) => {
        return(
            <Box  px='20px' key={index} mb='15px'>
                <Box shadow={9} backgroundColor='#fff' borderRadius={10}>
                    <TouchableOpacity onPress={()=>navigation.navigate('EducationVideoView', {'idx':item.wr_id})} disabled={ item.wr_10 == 'download' ? true : false}>
                        <HStack alignItems={'center'} p='20px' justifyContent='space-between'>
                            <Box width='80%'>
                                <DefText text={ textLengthOverCut('[' + item.categoryName + '] ' + item.boardName, 20)} style={[styles.videoTitle]} />
                                <DefText text={item.wr_datetime} style={[{color:colorSelect.gray, marginTop:10}]} />
                            </Box>
                            {
                                item.wr_10 == 'download' && 
                                <TouchableOpacity>
                                    <Image source={require('../images/downIcons.png')} alt='다운로드' style={{width:27, height:27, resizeMode:'contain'}} />
                                </TouchableOpacity>
                            }
                        </HStack>
                    </TouchableOpacity>
                </Box>
            </Box>
        )
    };

    return (
        <Box flex={1} backgroundColor='#fff'>
            <HeaderDef headerTitle='MY 교육자료' navigation={navigation} />
            {
                !myEduLoading ?
                <FlatList 
                    ListHeaderComponent={
                        <Box p='20px' pb='0' mb='30px'>
                            <HStack alignItems={'center'} justifyContent='space-between'>
                                <Box width='34%'>
                                    <Select
                                        selectedValue={category}
                                        width='100%'
                                        height='42px'
                                        fontSize={fsize.fs12}
                                        style={fweight.r}
                                        backgroundColor='#fff'
                                        borderWidth={1}
                                        borderColor='#999999'
                                        onValueChange={(itemValue) => setCategory(itemValue)}
                                    >
                                        <Select.Item label='전체' value='' />
                                        <Select.Item label='교육자료' value='교육자료' />
                                        <Select.Item label='동영상교육' value='동영상교육' />
                                    </Select>
                                </Box>
                                <Box width='64%'>
                                    <SearchInput 
                                        placeholder='검색어를 입력해 주세요.'
                                        value={searchText}
                                        onChangeText={schTextChange}
                                        onPress={schHandler}
                                    />
                                </Box>
                            </HStack>
                        </Box>
                    }
                    data={myEduData}
                    renderItem={_renderItem}
                    keyExtractor={(item, index)=>index.toString()}
                    ListEmptyComponent={
                        <Box py={10} alignItems='center'>
                            <DefText text='등록된 교육 자료가 없습니다.' style={{color:colorSelect.black666}} />
                        </Box>                
                    }
                />
                :
                <Box flex={1} justifyContent='center' alignItems={'center'}>
                    <ActivityIndicator size={'large'} color='#333' />
                </Box>
            }
        </Box>
    );
};

const styles = StyleSheet.create({
    newBox: {
        width:16,
        height:16,
        borderRadius:16,
        backgroundColor:colorSelect.orange,
        alignItems:'center',
        justifyContent:'center',
        marginLeft:5
    },
    newBoxText: {
        fontSize:10,
        color:colorSelect.white
    },
    videoTitle: {
        fontSize:15,
        ...fweight.eb
    },
    videoText1: {
        fontSize:13,
    },
});

export default connect(
    ({ User }) => ({
        userInfo: User.userInfo, //회원정보
    }),
    (dispatch) => ({
        member_login: (user) => dispatch(UserAction.member_login(user)), //로그인
        member_info: (user) => dispatch(UserAction.member_info(user)), //회원 정보 조회
        
    })
)(MyEducation);