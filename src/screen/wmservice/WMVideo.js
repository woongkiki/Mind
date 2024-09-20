import React, { useState, useEffect } from 'react';
import { Box, HStack, Modal, Select } from 'native-base'
import { ScrollView, TouchableOpacity, StyleSheet, Dimensions, ActivityIndicator, FlatList, RefreshControl, Alert, Image } from 'react-native';
import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../../redux/module/action/UserAction';
import HeaderDef from '../../components/HeaderDef';
import Api from '../../Api';
import { colorSelect, fsize, fweight } from '../../common/StyleDef';
import { DefInput, DefText, SearchInput } from '../../common/BOOTSTRAP';
import { useIsFocused } from '@react-navigation/native';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from 'moment';
import ToastMessage from '../../components/ToastMessage';
import { textLengthOverCut } from '../../common/dataFunction';

const {width} = Dimensions.get("window");

const WMVideo = (props) => {

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
        await Api.send('wm_eduCate', {}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               console.log('동영상 교육 카테고리 결과: ', arrItems, resultItem);
               setVideoData(arrItems);
               setVideoCategoryData(arrItems);
            }else{
                console.log('동영상 교육 카테고리 실패!', resultItem);

            }
        });

        await Api.send('wm_eduList', {'cate':category, 'schText':searchText}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               //console.log('동영상 교육 내역 결과: ', arrItems, resultItem); 
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
            <TouchableOpacity key={index} style={{paddingHorizontal:20, marginTop:20}} onPress={()=>navigation.navigate('WMVideoView', {'idx':item.wr_id})}>
                <Box borderBottomWidth={1} borderBottomColor='#dfdfdf' pb='20px'>
                    <Box>
                        <Image source={{uri:item.thumb}} alt={item.wr_subject} style={{width:width - 40, height:200, resizeMode:'stretch', borderRadius:12}}/>
                    </Box>
                    <Box mt='20px'>
                        <DefText text={ textLengthOverCut(item.wr_subject, 40)} style={[styles.videoTitle]} />
                        {/* <DefText text={ textLengthOverCut(item.wr_content, 18)} style={[{marginTop:7, marginBottom:10}, styles.videoText1]}/> */}
                        <HStack alignItems={'center'} mt='10px'>
                            <DefText text={item.wcatename} />
                            <Box 
                                width={'1px'}
                                height='10px'
                                backgroundColor={'#999'}
                                mx='10px'
                            />
                            <DefText text={item.wr_datetime.substring(0, 10)} style={[styles.videoText1]} />
                            <Box 
                                width={'1px'}
                                height='10px'
                                backgroundColor={'#999'}
                                mx='10px'
                            />
                            <DefText text={"조회수 " + item.wr_hit} />
                            {/* {
                                item.wr_9 == 1 ?
                                <DefText text={'교육완료'} style={[styles.videoText1, {color:'#FF4D4D'}]} />
                                :
                                <DefText text={'미완료'} style={[styles.videoText1, {color:'#B4B4B3'}]} />
                            } */}
                        </HStack>
                    </Box>
                </Box>
            </TouchableOpacity>
        )
    };

    return (
        <Box flex={1} backgroundColor='#fff'>
            <HeaderDef headerTitle='WM 교육 영상' navigation={navigation} />
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
                                        <Select.Item label='전체' value='' />
                                        {
                                            videoCategortData.map((item, index) => {
                                                return(
                                                    <Select.Item label={item.wcate} value={item.idx} key={index} />
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
                            <DefText text='등록된 WM 교육 영상이 없습니다.' style={{color:colorSelect.black666}} />
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
)(WMVideo);