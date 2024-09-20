import React, {useState, useEffect} from 'react';
import { ScrollView, Platform, Dimensions, StyleSheet, Alert, View, TouchableOpacity, FlatList, RefreshControl, ActivityIndicator } from 'react-native';
import { Box, VStack, HStack, Image, Input, Select } from 'native-base';
import { DefText, SearchInput, SubmitButtons } from '../common/BOOTSTRAP';
import HeaderDef from '../components/HeaderDef';
import {fsize, fweight, colorSelect, textStyle} from '../common/StyleDef';
import { officeBoard, brandBoard, memoBoard } from '../Utils/DummyData';
import { textLengthOverCut } from '../common/dataFunction';

import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import { StackAction, useIsFocused } from '@react-navigation/native';
import Api from '../Api';

const BrandBoard = (props) => {

    const {navigation, userInfo} = props;

    const isFocused = useIsFocused();

    const [category, setCategory] = useState('');

    const [searchText, setSearchText] = useState('');

    const schTextChange = (text) => {
        setSearchText(text);
    }

    const [refreshing, setRefreshing] = useState(false);

    const refreshList = () => {
        brandReceive();
    }

    const schHandler = () => {
        brandReceive();
    }

    const [brandLoading, setBrandLoading] = useState(true);
    const [brandDatas, setBrandDatas] = useState([]);
    const [brandCategory, setBrandCategory] = useState([]);
    const brandReceive = async () => {
        await setBrandLoading(true);

        await Api.send('com_brand', {'category':category, 'schText':searchText, 'brandIdx':userInfo.mb_1}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
                console.log('커뮤니케이션 지사/지점 리스트: ', resultItem);
               setBrandDatas(arrItems);

            }else{
                console.log('커뮤니케이션 지사/지점 실패!', resultItem);

            }
        });

        await Api.send('com_brandCategory', {}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
                //console.log('커뮤니케이션 지사/지점 분류: ', arrItems);
                //지사장 
                setBrandCategory(arrItems);

            }else{
                console.log('커뮤니케이션 본사게시판 실패!', resultItem);

            }
        });

        setBrandLoading(false);

    }

    useEffect(()=>{
        if(isFocused){
            brandReceive();
        }
    }, [category, isFocused])

    const _renderItem = ({item, index}) => {
        return(
            <TouchableOpacity key={index} style={{paddingHorizontal:20}} onPress={()=>navigation.navigate('BoardView', {'item':item, 'screen':'BrandBoard', 'idx':item.wr_id})}>
                <HStack borderBottomColor={'#E8E8E8'} borderBottomWidth={1} py='25px' alignItems={'center'}>
                    <Box width='15%'>
                        <DefText text={item.datetime} style={{fontSize:14, color:'#909090'}} />
                    </Box>
                    <HStack width='80%' flexWrap='wrap'>
                        <DefText text={'[' + item.wr_1 + '] '} style={[{fontSize:15}, fweight.b]} />
                        <DefText text={item.wr_subject} style={[{fontSize:15}, fweight.b]} />
                        {
                            item.wr_10 == 0 &&
                            <Box style={[styles.newBox]}>
                                <DefText text='N' style={[styles.newBoxText]} />
                            </Box>
                        }
                    </HStack>
                </HStack>
            </TouchableOpacity>
        )
    };

    return (
        <Box flex={1} backgroundColor='#fff'>
            <HeaderDef headerTitle='지사 / 지점 게시판' navigation={navigation} />
            {
                brandLoading ?
                <Box flex={1} alignItems='center' justifyContent={'center'}>
                    <ActivityIndicator size='large' color='#333'/>
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
                                        <Select.Item label='구분' value='' />
                                        {
                                            brandCategory.map((item, index)=> {
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
                    data={brandDatas}
                    renderItem={_renderItem}
                    keyExtractor={(item, index)=>index.toString()}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={refreshList} />
                    }
                    ListEmptyComponent={
                        <Box py={10} alignItems='center'>
                            <DefText text='등록된 게시글이 없습니다.' style={{color:colorSelect.black666}} />
                        </Box>                
                    }
                />
            }

            {
                userInfo?.rank2 == 1 &&
                <SubmitButtons
                    btnText='작성하기'
                    onPress={()=>navigation.navigate('BrandForm')}
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
)(BrandBoard);