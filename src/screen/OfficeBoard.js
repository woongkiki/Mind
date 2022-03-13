import React, {useState, useEffect} from 'react';
import { ScrollView, Platform, Dimensions, StyleSheet, Alert, View, TouchableOpacity, FlatList, RefreshControl, ActivityIndicator } from 'react-native';
import { Box, VStack, HStack, Image, Input, Select } from 'native-base';
import { DefText, SearchInput } from '../common/BOOTSTRAP';
import HeaderDef from '../components/HeaderDef';
import {fsize, fweight, colorSelect, textStyle} from '../common/StyleDef';
import { officeBoard, brandBoard, memoBoard } from '../Utils/DummyData';
import { textLengthOverCut } from '../common/dataFunction';

import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import { StackActions } from '@react-navigation/native';
import Api from '../Api';


const OfficeBoard = (props) => {

    const {navigation, userInfo} = props;

    const [category, setCategory] = useState('');

    const [searchText, setSearchText] = useState('');

    const [refreshing, setRefreshing] = useState(false);

    const refreshList = () => {
        officeReceive();
    }

    const schTextChange = (text) => {
        setSearchText(text);
    }

    const schHandler = () => {
        officeReceive();
    }

    const [officeLoading, setOfficeLoading] = useState(true);
    const [officeCategory, setOfficeCategory] = useState([]);
    const [officeData, setOfficeData] = useState([]);
    const officeReceive = async () => {
        await setOfficeLoading(true);
        await Api.send('com_office', {'category':category, 'schText':searchText}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
                console.log('커뮤니케이션 본사게시판 리스트: ', resultItem);
                setOfficeData(arrItems);

            }else{
                console.log('커뮤니케이션 본사게시판 실패!', resultItem);

            }
        });

        await Api.send('com_officeCategory', {}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
                //console.log('커뮤니케이션 본사게시판 분류: ', arrItems, resultItem);
                //삼성화재 메리츠
                setOfficeCategory(arrItems);

            }else{
                console.log('커뮤니케이션 본사게시판 실패!', resultItem);

            }
        });

        await setOfficeLoading(false);
    }

    useEffect(()=>{
        officeReceive();
    }, [category])

    const _renderItem = ({item, index}) => {
        return(
            <TouchableOpacity key={index} style={{paddingHorizontal:20}} onPress={()=>navigation.navigate('BoardView', {'item':item, 'screen':'OfficeBoard', 'idx':item.wr_id})}>
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
            <HeaderDef headerTitle='본사 게시판' navigation={navigation} />
            {
                officeLoading ?
                <Box flex={1} justifyContent='center' alignItems={'center'}>
                    <ActivityIndicator size='large' color='#333' />
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
                                        <Select.Item label={'구분'} value={''}  />
                                        
                                        {
                                            officeCategory.map((item, index)=>{
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
                    data={officeData}
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
)(OfficeBoard);