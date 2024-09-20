import React, {useState, useEffect} from 'react';
import { ScrollView, Platform, Dimensions, StyleSheet, Alert, View, TouchableOpacity, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { Box, VStack, HStack, Image, Input, Select } from 'native-base';
import { DefText, SearchInput, SubmitButtons } from '../common/BOOTSTRAP';
import HeaderDef from '../components/HeaderDef';
import {fsize, fweight, colorSelect, textStyle} from '../common/StyleDef';
import { officeBoard, brandBoard, memoBoard } from '../Utils/DummyData';
import { textLengthOverCut } from '../common/dataFunction';

import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import { StackActions, useIsFocused } from '@react-navigation/native';
import Api from '../Api';
import ToastMessage from '../components/ToastMessage';

const Data = [];


const {width, height} = Dimensions.get("window");

const SalesList = (props) => {

    const {navigation, userInfo} = props;

    const isFocused = useIsFocused();

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [category, setCategory] = useState(''); // 카테고리
    const [categoryList, setCategoryList] = useState([]); //카테고리 리스트
    const [searchText, setSearchText] = useState(''); //검색어 입력
    const [saleList, setSaleList] = useState([]);

    //검색어 입력이벤트
    const schTextChange = (text) => {
        setSearchText(text);
    }

    //검색 실행 이벤트
    const schHandler = () => {
        //console.log('검색 ㄱㄱ');
        SalesListHandler();
    }

   

    const refreshList = () => {
        //brandReceive();
        SalesListHandler();
    }

    const SalesListHandler = async () => {
        await setLoading(true);
        await Api.send('com_salesList', {'category':category, 'schText':searchText}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
                console.log('커뮤니케이션 sales 상세: ', arrItems);
                //setSalesCont(arrItems);
                setSaleList(arrItems);
            }else{
                console.log('커뮤니케이션 sales 실패!', resultItem);

            }
        });
        await Api.send('com_salesCategory', {}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
                //console.log('커뮤니케이션 sales category 상세: ', arrItems, resultItem);
                setCategoryList(arrItems);
                //setSalesCont(arrItems);
            }else{
                console.log('커뮤니케이션 sales category 실패!', resultItem);

            }
        });
        await setLoading(false);
    }

    useEffect(()=> {
        if(isFocused){
            SalesListHandler();
        }
    }, [category, isFocused])


    //반복문
    const _renderItem = ({item, index}) => {
        return(
            <TouchableOpacity key={index} style={{paddingHorizontal:20}} onPress={()=>navigation.navigate('SalesView', {'idx':item.wr_id})}>
                <HStack borderBottomColor={'#E8E8E8'} borderBottomWidth={1} py='25px' alignItems={'center'}>
                    <Box width={ (width - 40) * 0.2 }>
                        <DefText text={'[' + item.wr_1 + '] '} style={[{fontSize:15}, fweight.b]} />
                    </Box>
                    <Box width={ (width - 40) * 0.15 } alignItems='center'>
                        <DefText text={item.datetime} style={{fontSize:14, color:'#909090'}} />
                    </Box>
                    <Box width={ (width - 40) * 0.2 } alignItems='center'>
                        <DefText text={item.wr_name} />
                    </Box>
                    <Box width={ (width - 40) * 0.35 } alignItems='flex-start' pl='10px'>
                        <DefText text={ textLengthOverCut(item.wr_subject, 20, '')} style={[{fontSize:15}, fweight.b]} />
                    </Box>
                    <Box width={ (width - 40) * 0.1 } alignItems='center'>
                        <DefText text={item.comment_cnt} />
                    </Box>
                </HStack>
            </TouchableOpacity>
        )
    };

    return (
        <Box flex={1} backgroundColor='#fff'>
            <HeaderDef headerTitle='Sales Hot-line' navigation={navigation} />
            {
                loading ?
                <Box justifyContent={'center'} alignItems='center' flex={1}>
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
                                        <Select.Item label='전체' value='' />
                                        {
                                            categoryList != "" &&
                                            categoryList.map((item, index) => {
                                                return(
                                                    <Select.Item key={index} label={item} value={item}/>
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
                            <Box width={ (width - 40) * 0.2 } alignItems='center'>
                                <DefText text={'분야'} style={[{fontSize:15}, fweight.b]} />
                            </Box>
                            <Box width={ (width - 40) * 0.15 } alignItems='center'>
                                <DefText text={'신청일'} style={[{fontSize:15}, fweight.b]} />
                            </Box>
                            <Box width={ (width - 40) * 0.2 } alignItems='center'>
                                <DefText text={'신청자'} style={[{fontSize:15}, fweight.b]} />
                            </Box>
                            <Box width={ (width - 40) * 0.35 } alignItems='center'>
                                <DefText text={'제목'} style={[{fontSize:15}, fweight.b]} />
                            </Box>
                            <Box width={ (width - 40) * 0.1 } alignItems='center'>
                                <DefText text={'답변'} style={[{fontSize:15}, fweight.b]} />
                            </Box>
                        </HStack>
                        </>
                    }
                    data={saleList}
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
            <SubmitButtons
                btnText='작성하기'
                onPress={()=>navigation.navigate('SalesForm')}
            />
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
)(SalesList);