import React, { useState, useEffect } from 'react';
import { Box, HStack, Modal, Select } from 'native-base'
import { ScrollView, TouchableOpacity, StyleSheet, Dimensions, ActivityIndicator, FlatList, RefreshControl, Alert } from 'react-native';
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

const {width} = Dimensions.get("window");

const WMBest = (props) => {

    const {navigation, userInfo} = props;

    const isFocused = useIsFocused();

    const [loading, setLoading] = useState(true);
    const [itemList, setItemList] = useState([]);
    const [wmBestCateList, setWmBestCateList] = useState([]);
    const [wmBestCate, setWmBestCate] = useState("");
    const [searchText, setSearchText] = useState("");

    const schTextChange = (text) => {
        setSearchText(text);
    }

    //카테고리 리스트
    const renderApi = async () => {
        await setLoading(true);
        await Api.send('wm_bestCate', {}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
                //console.log('wm 우수사례 카테고리 결과: ', arrItems, resultItem); 
                setWmBestCateList(arrItems);
            }else{
                console.log('wm 우수사례 카테고리 실패!', resultItem);

            }
        });

        await Api.send('wm_bestList', {"cate":wmBestCate, "schText":searchText}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
                console.log('wm 우수사례 결과: ', arrItems, resultItem); 
                setItemList(arrItems);
            }else{
                console.log('wm 우수사례 실패!', resultItem);

            }
        });
        await setLoading(false);
    }

    const schHandler = () => {
        renderApi();
    }

    useEffect(() => {
        if(isFocused){
            renderApi();
        }
    }, [wmBestCate, isFocused])

    const _renderItem = ({item, index}) => {
        return(
            <Box px='20px' mb='20px'>
                <Box borderWidth={1} borderColor='#999' borderRadius={10}>
                    <TouchableOpacity style={{padding:20}} onPress={()=>navigation.navigate("WMBestView", {"idx":item.wr_id})}>
                        <DefText 
                            text={item.wr_subject} 
                            style={[fweight.b, {fontSize:fsize.fs18}]}
                        />
                        <HStack mt='10px' justifyContent={'space-between'}>
                            <HStack alignItems={'center'}>
                                <DefText 
                                    text={item.wcatename} 
                                />
                                <Box
                                    width='1px'
                                    height='10px'
                                    backgroundColor={'#999'}
                                    mx='10px'
                                />
                                <DefText text={"조회수 " + item.wr_hit}/>
                            </HStack>
                            <Box>
                                <DefText text={item.wr_datetime.substring(0, 10)} />
                            </Box>
                        </HStack>
                    </TouchableOpacity>
                </Box>
            </Box>
        )
    }

    return (
        <Box flex={1} backgroundColor='#fff'>
            <HeaderDef navigation={navigation} headerTitle='WM 우수사례' />
            {
                loading ?
                <Box flex={1} alignItems='center' justifyContent={'center'}>
                    <ActivityIndicator
                        size={'large'}
                        color='#333'
                    />
                </Box>
                :
                <FlatList
                    ListHeaderComponent={
                        <Box px='20px' pb='0' mb='15px'>
                            <HStack alignItems={'center'} justifyContent='space-between'>
                                <Box width='34%'>
                                    <Select
                                        selectedValue={wmBestCate}
                                        width='100%'
                                        height='42px'
                                        fontSize={fsize.fs12}
                                        style={fweight.r}
                                        backgroundColor='#fff'
                                        borderWidth={1}
                                        borderColor='#999999'
                                        onValueChange={(itemValue) => setWmBestCate(itemValue)}
                                    >
                                        <Select.Item label='전체' value='' />
                                        {
                                            wmBestCateList != "" &&
                                            wmBestCateList.map((item, index) => {
                                                return(
                                                    <Select.Item key={index} label={item.wcate} value={item.idx}/>
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
                    data={itemList}
                    renderItem={_renderItem}
                    keyExtractor={(item, index)=>index.toString()}
                    ListEmptyComponent={
                        <Box py='40px' alignItems={'center'}>
                            <DefText text="등록된 우수사례가 없습니다." />
                        </Box>
                    }
                />
            }
        </Box>
    );
};

const styles = StyleSheet.create({
    categoryBtn: {
        width: (width - 40) * 0.23,
        height: 40,
        borderRadius:5,
        borderWidth:1,
        borderColor:'#999',
        alignItems:'center',
        justifyContent:'center'
    },
    categoryBtnText: {
        fontSize:fsize.fs14
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
)(WMBest);