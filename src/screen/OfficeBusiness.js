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
import { useFocusEffect, useIsFocused } from '@react-navigation/native';

const {width} = Dimensions.get('window');

const datas = [];

const OfficeBusiness = (props) => {

    const {navigation, userInfo} = props;

    const isFocused = useIsFocused();

    const [loading, setLoading] = useState(true);
    const [categoryList, setCategoryList] = useState([]);
    const [selectCategory, setSelectCategory] = useState('');
    const [searchText, setSearchText] = useState('');
    const [officeList, setOfficeList] = useState([]);

    //검색어 입력
    const schHandler = (text) => {
        setSearchText(text);
    }

    const categoryApi = async () => {
        await setLoading(true);
        await Api.send('office_category', {}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
                //console.log('본사업무 카테고리리스트: ', arrItems);
                setCategoryList(arrItems);
            }else{
                console.log('본사업무 카테고리리스트 불러오기 실패!!!', resultItem);
                //ToastMessage(resultItem.message);
            }
        });
        await Api.send('office_list', {'mb_id':userInfo.mb_id, 'mb_name':userInfo.mb_name}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
                console.log('본사업무 게시글 리스트: ', resultItem);
                setOfficeList(arrItems);
            }else{
                console.log('본사업무 게시글 리스트 불러오기 실패!!!', resultItem);
                //ToastMessage(resultItem.message);
            }
        });
        await setLoading(false);
    }

    const _renderItem = ({item, index}) => {
        return(
            <TouchableOpacity key={index} style={{paddingHorizontal:20}} onPress={()=>navigation.navigate('OfficeBusinessView', {'idx':item.wr_id})}>
                <HStack borderBottomColor={'#E8E8E8'} borderBottomWidth={1} py='25px' alignItems={'center'} flexWrap='wrap'>
                    <Box width='25%' >
                        <DefText text={item.wr_3} style={[fweight.eb]} />
                    </Box>
                    <Box width='15%'>
                        <DefText text={item.datetime} style={{fontSize:14, color:'#909090'}} />
                    </Box>
                    <Box width='20%' alignItems='center'>
                        <DefText text={textLengthOverCut(item.wr_name, 5)} style={{color:'#333'}} />
                    </Box>
                    <Box width='25%' alignItems='center'>
                        <DefText text={textLengthOverCut(item.wr_subject, 7)} />
                    </Box>
                    <Box width='15%' alignItems='center'>
                        <DefText text={item.comment_cnt} />
                    </Box>
                </HStack>
            </TouchableOpacity>
        )
    };

    useEffect(()=> {
        if(isFocused){
            categoryApi();
        }
    }, [isFocused])

    return (
        <Box flex={1} backgroundColor='#fff'>
            <HeaderDef headerTitle='본사 업무 담당' navigation={navigation} />
            {
                loading ?
                <Box flex={1}  justifyContent={'center'} alignItems='center'>
                    <ActivityIndicator size='large' color='#333' />
                </Box>
                :
                <FlatList 
                    ListHeaderComponent={
                        <Box p='20px' pb='0'>
                            <HStack alignItems={'center'} justifyContent='space-between'>
                                <Box width='34%'>
                                    <Select
                                        selectedValue={selectCategory}
                                        width='100%'
                                        height='42px'
                                        fontSize={fsize.fs12}
                                        style={fweight.r}
                                        backgroundColor='#fff'
                                        borderWidth={1}
                                        borderColor='#999999'
                                        onValueChange={(itemValue) => setSelectCategory(itemValue)}
                                    >
                                        <Select.Item label='구분' value='' />
                                       {
                                            categoryList != "" &&
                                            categoryList.map((item, index) => {
                                                return(
                                                    <Select.Item key={index} label={item.wr_subject} value={item.wr_subject} />
                                                )
                                            })
                                       }
                                    </Select>
                                </Box>
                                <Box width='64%'>
                                    <SearchInput 
                                        placeholder='검색어를 입력해 주세요.'
                                        value={searchText}
                                        onChangeText={schHandler}
                                        //onPress={schHandler}
                                    />
                                </Box>
                            </HStack>
                        </Box>
                    }
                    data={officeList}
                    renderItem={_renderItem}
                    keyExtractor={(item, index)=>index.toString()}
                    ListEmptyComponent={
                        <Box py={10} alignItems='center'>
                            <DefText text='등록된 자료가 없습니다.' style={{color:colorSelect.black666}} />
                        </Box>                
                    }
                />
            }
            <SubmitButtons
                btnText='작성하기'
                onPress={()=>navigation.navigate('OfficeBusinessForm')}
            />
        </Box>
    );
};

const styles = StyleSheet.create({
    labelTitle: {
        fontSize:fsize.fs16,
        ...fweight.eb,
        marginBottom: 15
    },
    dateBox : {
        width:(width - 40) * 0.47
    },
    dateButton: {
        paddingBottom:10,
        borderBottomWidth:1,
        borderBottomColor:'#DFDFDF',
        paddingRight:10,
        marginTop:15,
    },
    buttons : {
        width: '100%',
        height:40,
        backgroundColor:colorSelect.blue,
        alignItems:'center',
        justifyContent:'center',
        borderRadius:5,
    },
    buttonsText: {
        color:colorSelect.white,
        fontSize:fsize.fs12
    },
    fileupload:{
        borderRadius:5,
        borderWidth:1,
        borderColor:'#999',
        height:40,
        justifyContent:'center',
        paddingHorizontal:15
    },
    memberTitle: {
        ...fweight.b
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
)(OfficeBusiness);