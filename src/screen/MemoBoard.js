import React, {useState, useEffect} from 'react';
import { ScrollView, Platform, Dimensions, StyleSheet, Alert, View, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { Box, VStack, HStack, Image, Input, Select } from 'native-base';
import { DefText, SearchInput, SubmitButtons } from '../common/BOOTSTRAP';
import HeaderDef from '../components/HeaderDef';
import {fsize, fweight, colorSelect, textStyle} from '../common/StyleDef';
import { officeBoard, brandBoard, memoBoard } from '../Utils/DummyData';
import { textLengthOverCut } from '../common/dataFunction';

import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import { StackActions } from '@react-navigation/native';
import Api from '../Api';
import ToastMessage from '../components/ToastMessage';

const MemoBoard = (props) => {

    const {navigation, userInfo} = props;

    const [category, setCategory] = useState('');

    const [searchText, setSearchText] = useState('');

    const schTextChange = (text) => {
        setSearchText(text);
    }

    const schHandler = () => {
        memoDataRec();
    }

    const [memoLoading, setMemoLoading] = useState(true); 

    //최고 안녕
    const [memoData, setMemoData] = useState([]);
    const memoDataRec = async () => {
        await setMemoLoading(true);
        await Api.send('com_memo', {'category':category, 'schText':searchText, 'recName':userInfo.mb_name}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
                console.log('커뮤니케이션 메모리스트: ', resultItem);
                setMemoData(arrItems);

            }else{
                console.log('커뮤니케이션 메모 실패!', resultItem);
                ToastMessage(resultItem.message);
            }
        });
        await setMemoLoading(false);
    }

    useEffect(()=>{
        memoDataRec();
    }, []);



    const _renderItem = ({item, index}) => {
        return(
            <TouchableOpacity key={index} style={{paddingHorizontal:20}} onPress={()=>navigation.navigate('BoardView', {'item':item, 'screen':'MemoBoard', 'idx':item.wr_id})}>
                <HStack borderBottomColor={'#E8E8E8'} borderBottomWidth={1} py='25px' alignItems={'center'}>
                    <Box width='15%'>
                        <DefText text={item.datetime} style={{fontSize:14, color:'#909090'}} />
                    </Box>
                    <HStack width='80%' flexWrap='wrap'>
                        <Box>
                            <DefText text={item.wr_subject} style={[{fontSize:15}, fweight.b]} />
                            <DefText text={item.wr_name} style={[{marginTop:5, fontSize:14, color:'#aaa'}, fweight.b]} />
                        </Box>
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
            <HeaderDef headerTitle='쪽지함' navigation={navigation} />
            {
                !memoLoading ?
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
                                        <Select.Item label='보낸 사람' value='보낸 사람' />
                                        <Select.Item label='제목' value='제목' />
                                        <Select.Item label='날짜' value='날짜' />
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
                    data={memoData}
                    renderItem={_renderItem}
                    keyExtractor={(item, index)=>index.toString()}
                    ListEmptyComponent={
                        <Box py={10} alignItems='center'>
                            <DefText text='받은 쪽지가 없습니다.' style={{color:colorSelect.black666}} />
                        </Box>                
                    }
                />
                :
                <Box flex={1} alignItems='center' justifyContent={'center'}>
                    <ActivityIndicator size='large' color='#333'/>
                </Box>
            }
            
            <SubmitButtons
                btnText='쪽지보내기'
                onPress={()=>navigation.navigate('MemoForm')}
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
)(MemoBoard);