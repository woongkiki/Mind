import React, {useState, useEffect} from 'react';
import { ScrollView, Platform, Dimensions, StyleSheet, Alert, View, TouchableOpacity, FlatList, RefreshControl, ActivityIndicator } from 'react-native';
import { Box, VStack, HStack, Image, Input, Select } from 'native-base';
import { DefText, SearchInput } from '../common/BOOTSTRAP';
import HeaderDef from '../components/HeaderDef';
import {fsize, fweight, colorSelect, textStyle} from '../common/StyleDef';
import { videoEdu } from '../Utils/DummyData';
import { textLengthOverCut } from '../common/dataFunction';

import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import { StackActions } from '@react-navigation/native';
import Api from '../Api';

import { useFocusEffect, useIsFocused } from '@react-navigation/native';

const {width} = Dimensions.get('window');
const thumbWidth = (width - 40) * 0.3;
const contentWidth = (width-40) - thumbWidth;
const thumbHeight = thumbWidth / 1.34;

const EducationVideo = (props) => {

    const {navigation, userInfo} = props;

    const [category, setCategory] = useState('');

    const [searchText, setSearchText] = useState('');

    const schTextChange = (text) => {
        setSearchText(text);
    }

    const schHandler = () => {
        videoRec();
    }

    const [refreshing, setRefreshing] = useState(false);

    const refreshList = () => {
        videoRec();
    }

    const [videoLoading, setVideoLoading] = useState(true);
    const [videoCategortData, setVideoCategoryData] = useState([]);
    const [videoData, setVideoData] = useState([]);
    const videoRec = async () => {
        await setVideoLoading(true);
        await Api.send('com_videoCategory', {}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               console.log('동영상 교육 카테고리 결과: ', arrItems, resultItem);
               //setVideoData(arrItems);
               setVideoCategoryData(arrItems);
            }else{
                console.log('동영상 교육 카테고리 실패!', resultItem);

            }
        });

        await Api.send('com_videoAll', {'category':category, 'schText':searchText}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               console.log('동영상 교육 내역 결과: ', arrItems, resultItem); 
               setVideoData(arrItems);
            }else{
                console.log('동영상 교육 내역 실패!', resultItem);

            }
        });
        await setVideoLoading(false);
    }

    useEffect(()=>{
        videoRec();
    }, [category]);


    const isFocused = useIsFocused();
    useEffect(()=>{
        if(isFocused){

            videoRec();
        }
    }, [isFocused])

    const _renderItem = ({item, index}) => {
        return(
            <TouchableOpacity key={index} style={{paddingHorizontal:20, marginTop:20}} onPress={()=>navigation.navigate('EducationVideoView', {'idx':item.wr_id})}>
                <HStack alignItems={'center'}>
                    <Box width={thumbWidth + 'px'}>
                        <Image source={{uri:item.thumb}} alt={item.wr_subject} style={{width:thumbWidth, height:thumbHeight, resizeMode:'stretch', borderRadius:12}}/>
                    </Box>
                    <Box width={contentWidth + 'px'} pl='15px'>
                        <DefText text={ textLengthOverCut('[' + item.wr_1 + '] ' + item.wr_subject, 18)} style={[styles.videoTitle]} />
                        {/* <DefText text={ textLengthOverCut(item.wr_content, 18)} style={[{marginTop:7, marginBottom:10}, styles.videoText1]}/> */}
                        <HStack alignItems={'center'} justifyContent='space-between' mt='20px'>
                            <DefText text={item.wr_datetime} style={[styles.videoText1]} />
                            {
                                item.wr_9 == 1 ?
                                <DefText text={'교육완료'} style={[styles.videoText1, {color:'#FF4D4D'}]} />
                                :
                                <DefText text={'미완료'} style={[styles.videoText1, {color:'#B4B4B3'}]} />
                            }
                        </HStack>
                    </Box>
                </HStack>
            </TouchableOpacity>
        )
    };

    return (
        <Box flex={1} backgroundColor='#fff'>
            <HeaderDef headerTitle='동영상 교육' navigation={navigation} />
            {
                videoLoading ?
                <Box flex={1} justifyContent='center' alignItems={'center'}>
                    <ActivityIndicator size={'large'} color='#333' />
                </Box>
                :
                <FlatList 
                    ListHeaderComponent={
                        <Box p='20px' pb='0'>
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
                                        <Select.Item label='종류' value='' />
                                        {
                                            videoCategortData.map((item, index) => {
                                                return(
                                                    <Select.Item label={item.wr_subject} value={item.wr_subject} key={index} />
                                                )
                                            })
                                        }
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
                    data={videoData}
                    renderItem={_renderItem}
                    keyExtractor={(item, index)=>index.toString()}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={refreshList} />
                    }
                    ListEmptyComponent={
                        <Box py={10} alignItems='center'>
                            <DefText text='등록된 동영상 교육이 없습니다.' style={{color:colorSelect.black666}} />
                        </Box>                
                    }
                />
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
        fontSize:fsize.fs16,
        ...fweight.eb
    },
    videoText1: {
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
)(EducationVideo);