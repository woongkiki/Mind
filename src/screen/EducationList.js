import React, { useEffect, useState } from 'react';
import {Box, HStack, Select} from 'native-base';
import {ActivityIndicator, Alert, Dimensions, FlatList, RefreshControl, TouchableOpacity} from 'react-native';
import HeaderDef from '../components/HeaderDef';
import Api from '../Api';
import { colorSelect, fsize, fweight } from '../common/StyleDef';
import { DefText, SearchInput } from '../common/BOOTSTRAP';
import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import { useIsFocused } from '@react-navigation/native';

const {width, height} = Dimensions.get("window");

const EducationList = (props) => {

    const {navigation, userInfo} = props;

    const isFocused = useIsFocused();

    const [videoLoading, setVideoLoading] = useState(true);
    const [videoCategortData, setVideoCategoryData] = useState([]);
    const [videoData, setVideoData] = useState([]);

    const [category, setCategory] = useState('');

    const [searchText, setSearchText] = useState('');

    const schTextChange = (text) => {
        setSearchText(text);
    }

    const schHandler = () => {
        videoListApi();
    }

    const [refreshing, setRefreshing] = useState(false);

    const refreshList = () => {
        videoListApi();
    }

    const categoryApi = () => {
        Api.send('educations_category', {}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
              // console.log('동영상 교육 카테고리 결과: ', arrItems, resultItem);
               //setVideoData(arrItems);
               setVideoCategoryData(arrItems);
            }else{
                console.log('동영상 교육 카테고리 실패!', resultItem);

            }
        });
    }

    const videoListApi = async () => {
        await setVideoLoading(true);
        await Api.send('educations_lists', {'category':category, 'schText':searchText, 'id':userInfo.mb_id}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) { 
               console.log('교육과정 리스트 가져오기 성공: ', resultItem); 
               setVideoData(arrItems);
            }else{
                console.log('교육과정 리스트 가져오기 실패!', resultItem);

            }
        });
        await setVideoLoading(false);
    }

    useEffect(() => {
        categoryApi();
    }, [])

    useEffect(() => {
        if(isFocused){
            videoListApi();
        }
    }, [category, isFocused])

    const eduInfoGo = (status, wr_id, ingEnd) => {
        if(status == "Y"){
            Alert.alert("신청기한이 지났습니다.");
        }else{

            if(ingEnd == "Y"){
                Alert.alert("진행기간이 지났습니다.");
                return false;
            }

            navigation.navigate("EducationInfo", {"idx":wr_id})
        }
    }

    const _renderItem = ({item, index}) => {
        return(
            <HStack borderBottomColor={'#E8E8E8'} borderBottomWidth={1} py='20px' px='20px' alignItems={'center'}>
                <TouchableOpacity
                     onPress={() => eduInfoGo(item.reqEnd, item.wr_id, item.ingEnd)}
                >
                    <HStack alignItems={'center'}>
                        <Box width={ (width - 40) * 0.1 } alignItems='center'>
                            <DefText text={index + 1} style={[{fontSize:13}, fweight.b]} />
                        </Box>
                        <Box width={ (width - 40) * 0.25 } alignItems='center'>
                            <DefText text={item.wr_subject} style={[{fontSize:13}, fweight.b]} />
                        </Box>
                        <Box width={ (width - 40) * 0.25 } alignItems='center'>
                            {
                                item.wr_2 == item.wr_3 ?
                                <DefText text={item.wr_2 } style={[{fontSize:13}, fweight.b]} />
                                :
                                <DefText text={item.wr_2 + " ~ " + item.wr_3 } style={[{fontSize:13}, fweight.b]} />
                            }
                        </Box>
                        <Box width={ (width - 40) * 0.25 } alignItems='center'>
                                <DefText text={item.wr_4} style={[{fontSize:13}, fweight.b]} />
                        </Box>
                    </HStack>
                </TouchableOpacity>
                <Box width={ (width - 40) * 0.15 } alignItems='center'>
                    <TouchableOpacity
                        onPress={()=>navigation.navigate("EducationRequestList", {"idx":item.wr_id})}
                    >
                    {
                        item.wr_5 != "" ?
                        <DefText text={ item.reqCnt + " / " + item.wr_5} style={[{fontSize:13}, fweight.b]} />
                        :
                        <DefText text={ item.reqCnt } style={[{fontSize:13}, fweight.b]} />
                    }
                   </TouchableOpacity>
                </Box>
            </HStack>
        )
    }

    return (
        <Box flex={1} backgroundColor='#fff'>
            <HeaderDef headerTitle='교육과정 현황' navigation={navigation} />
            {
                videoLoading ? 
                <Box flex={1} justifyContent='center' alignItems={'center'}>
                    <ActivityIndicator size={'large'} color='#333' />
                </Box>
                :
                <FlatList 
                    ListHeaderComponent={
                        <>
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
                                            <Select.Item label='구분' value='' />
                                            {
                                                videoCategortData.map((item, index) => {
                                                    return(
                                                        <Select.Item label={item.wr_subject} value={item.wr_id} key={index} />
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
                            <HStack borderBottomColor={'#E8E8E8'} borderBottomWidth={1} py='25px' px='20px' alignItems={'center'}>
                                <Box width={ (width - 40) * 0.1 } alignItems='center'>
                                    <DefText text={'No'} style={[{fontSize:14}, fweight.b]} />
                                </Box>
                                <Box width={ (width - 40) * 0.25 } alignItems='center'>
                                    <DefText text={'과정명'} style={[{fontSize:14}, fweight.b]} />
                                </Box>
                                <Box width={ (width - 40) * 0.25 } alignItems='center'>
                                    <DefText text={'진행일시'} style={[{fontSize:14}, fweight.b]} />
                                </Box>
                                <Box width={ (width - 40) * 0.25 } alignItems='center'>
                                    <DefText text={'신청기한'} style={[{fontSize:14}, fweight.b]} />
                                </Box>
                                <Box width={ (width - 40) * 0.15 } alignItems='center'>
                                    <DefText text={'신청현황'} style={[{fontSize:14}, fweight.b]} />
                                </Box>
                            </HStack>
                        </>
                    }
                    data={videoData}
                    renderItem={_renderItem}
                    keyExtractor={(item, index)=>index.toString()}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={refreshList} />
                    }
                    ListEmptyComponent={
                        <Box py={10} alignItems='center'>
                            <DefText text='등록된 교육과정이 없습니다.' style={{color:colorSelect.black666}} />
                        </Box>                
                    }
                />
            }
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
)(EducationList);