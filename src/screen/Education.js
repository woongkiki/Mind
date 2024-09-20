import React, {useState, useEffect} from 'react';
import { ScrollView, Platform, Dimensions, StyleSheet, Alert, View, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { Box, VStack, HStack, Image, Input, Select } from 'native-base';
import { DefText, SearchInput } from '../common/BOOTSTRAP';
import HeaderDef from '../components/HeaderDef';
import {fsize, fweight, colorSelect, textStyle} from '../common/StyleDef';
import { videoEdu, brandBoard, memoBoard, eduData } from '../Utils/DummyData';
import { textLengthOverCut } from '../common/dataFunction';

import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import { StackActions, useIsFocused } from '@react-navigation/native';
import Api from '../Api';

const {width} = Dimensions.get('window');
const commuBoxWidth = width * 0.43;

const Education = (props) => {

    const {navigation, userInfo} = props;

    const isFocused = useIsFocused();

    const [category, setCategory] = useState('전체');

    const [searchText, setSearchText] = useState('');

    const schTextChange = (text) => {
        setSearchText(text);
    }

    const schHandler = () => {
        if(searchText == ''){
            Alert.alert('검색어를 입력해주세요.');
            return false;
        }

        Alert.alert(searchText);
    }

    const [eduLoading, setEduLoading] = useState(true);
    const [videoData, setVideoData] = useState([]);
    const [dataBoardList, setDataBoardList] = useState([]);
    const [wmBestList, setWmBestList] = useState([]);
    const [wmConsultList, setWmConsultList] = useState([]);
    const [wmEduList, setWmEduList] = useState([]);

    const educationRec = async () => {
        await setEduLoading(true);
        await Api.send('com_video', {}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               //console.log('동영상 교육 내역 결과: ', arrItems, resultItem);
               setVideoData(arrItems);
            }else{
                console.log('동영상 교육 내역 실패!', resultItem);

            }
        });
        await Api.send('education_dataList', {"limit":"Y"}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               //console.log('교육 자료 내역 결과: ', arrItems, resultItem);
               setDataBoardList(arrItems);
            }else{
                console.log('교육 자료 내역 실패!', resultItem);

            }
        });
        await Api.send('wm_bestList', {"limit":"Y"}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               console.log('wm 우수 사례 결과: ', arrItems, resultItem);
               setWmBestList(arrItems);
            }else{
                console.log('wm 우수 사례 실패!', resultItem);

            }
        });
        await Api.send('wm_consultList', {"limit":"Y"}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               console.log('wm 우수 사례 결과: ', arrItems, resultItem);
               setWmConsultList(arrItems);
            }else{
                console.log('wm 우수 사례 실패!', resultItem);

            }
        });

        await Api.send('wm_consultList', {"limit":"Y"}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               console.log('wm 우수 사례 결과: ', arrItems, resultItem);
               setWmConsultList(arrItems);
            }else{
                console.log('wm 우수 사례 실패!', resultItem);

            }
        });
        await Api.send('wm_eduList', {"limit":"Y"}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               console.log('wm 우수 사례 결과: ', arrItems, resultItem);
               setWmEduList(arrItems);
            }else{
                console.log('wm 우수 사례 실패!', resultItem);

            }
        });
        await setEduLoading(false);
    }

    useEffect(()=>{
        if(isFocused){
            educationRec();
        }
    }, [isFocused])

    return (
        <Box flex={1} backgroundColor='#fff'>
            <HeaderDef headerTitle='교육&WM' navigation={navigation} />
            {
                eduLoading ?
                <Box flex={1} justifyContent='center' alignItems={'center'}>
                    <ActivityIndicator size='large' color={'#333'} />
                </Box>
                :
                <ScrollView>
                    <Box p='20px'>
                        {/* <HStack alignItems={'center'} justifyContent='space-between' mb='30px'>
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
                                    <Select.Item label='전체' value='전체' />
                                    <Select.Item label='동영상' value='동영상' />
                                    <Select.Item label='교육자료' value='교육자료' />
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
                        </HStack> */}
                         <Box>
                            <HStack alignItems={'center'} justifyContent='space-between'>
                                <DefText text='교육 자료' style={[styles.listBoxTitle]} />
                                <TouchableOpacity onPress={()=>navigation.navigate('EducationDataNew')} style={styles.listBoxTitleArrButton}>
                                    <Image source={require('../images/moreBtnBlack.png')} alt='더보기' style={[styles.listBoxTitleArr]} />
                                </TouchableOpacity>
                            </HStack>
                            <Box p='15px' backgroundColor={'#fff'} shadow={9} borderRadius={10} mt='10px'>
                                {
                                    dataBoardList != '' &&
                                    dataBoardList.length > 0 ?
                                    dataBoardList.map((item, index)=> {
                                        return(
                                            <Box key={index} style={{ marginTop: index == '0' ? 0 : 15}}>
                                                <HStack alignItems={'center'} justifyContent='space-between'>
                                                    <HStack alignItems={'center'}  width='85%'>
                                                        <Box width='32%' >
                                                            <DefText text={ textLengthOverCut('[' + item.depth3 + ']', 6)} style={[styles.boardText]} />
                                                        </Box>
                                                        <Box width='64%' >
                                                            
                                                            <TouchableOpacity onPress={()=>navigation.navigate("EducationDataView", {"wr_id":item.wr_id})}>
                                                                <HStack>
                                                                    {/* {
                                                                        item.wr_10 == 0 &&
                                                                        <Box style={[styles.newBox]}>
                                                                            <DefText text='N' style={[styles.newBoxText]} />
                                                                        </Box>
                                                                    } */}
                                                                    <DefText text={ textLengthOverCut(item.wr_subject, 15)} style={[styles.boardText]} />
                                                                </HStack>
                                                            </TouchableOpacity>
                                                        </Box>
                                                    </HStack>
                                                    <Box width='12%' alignItems={'flex-end'}>
                                                        <DefText text={ item.wr_datetime.substring(5,10) } style={{fontSize:fsize.fs12, color:'#B4B4B3'}} />
                                                    </Box>
                                                </HStack>
                                            </Box>
                                        )
                                    })
                                    :
                                    <Box alignItems={'center'} py='20px'>
                                        <DefText text='등록된 교육자료가 없습니다.' />
                                    </Box>
                                }
                            </Box>
                        </Box>
                        <Box mt='30px'>
                            <HStack alignItems={'center'} justifyContent='space-between'>
                                <DefText text='교육 영상' style={[styles.listBoxTitle]} />
                                <TouchableOpacity onPress={()=>navigation.navigate('EducationVideo')} style={styles.listBoxTitleArrButton}>
                                    <Image source={require('../images/moreBtnBlack.png')} alt='더보기' style={[styles.listBoxTitleArr]} />
                                </TouchableOpacity>
                            </HStack>
                            <Box p='15px' backgroundColor={'#fff'} shadow={9} borderRadius={10} mt='10px'>
                                {
                                    videoData != '' &&
                                    videoData.length > 0 ?
                                    videoData.map((item, index)=> {
                                        return(
                                            <Box key={index} style={{ marginTop: index == '0' ? 0 : 15}}>
                                                <HStack alignItems={'center'} justifyContent='space-between'>
                                                    <HStack  alignItems={'center'} width='85%'>
                                                        <Box width='32%' >
                                                            <DefText text={ textLengthOverCut('[' + item.wr_1 + ']', 6)} style={[styles.boardText]} />
                                                        </Box>
                                                        <Box width='64%' >
                                                            
                                                            <TouchableOpacity onPress={()=>navigation.navigate('EducationVideoView', {'idx':item.wr_id})}>
                                                                <HStack>
                                                                    {
                                                                        item.wr_10 == 0 &&
                                                                        <Box style={[styles.newBox]}>
                                                                            <DefText text='N' style={[styles.newBoxText]} />
                                                                        </Box>
                                                                    }
                                                                    <DefText text={ textLengthOverCut(item.wr_subject, 15)} style={[styles.boardText]} />
                                                                </HStack>
                                                            </TouchableOpacity>
                                                        </Box>
                                                    </HStack>
                                                    <Box width='12%' alignItems={'flex-end'}>
                                                        <DefText text={ item.wr_datetime.substring(5, 10) } style={{fontSize:fsize.fs12, color:'#B4B4B3'}} />
                                                    </Box>
                                                </HStack>
                                            </Box>
                                        )
                                    })
                                    :
                                    <Box alignItems={'center'} py='20px'>
                                        <DefText text='등록된 교육이 없습니다.' />
                                    </Box>
                                }
                            
                            </Box>
                        </Box>
                        <Box mt='30px'>
                            <HStack alignItems={'center'} justifyContent='space-between'>
                                <DefText text='WM 우수사례' style={[styles.listBoxTitle]} />
                                <TouchableOpacity onPress={()=>navigation.navigate('WMBest')} style={styles.listBoxTitleArrButton}>
                                    <Image source={require('../images/moreBtnBlack.png')} alt='더보기' style={[styles.listBoxTitleArr]} />
                                </TouchableOpacity>
                            </HStack>
                            <Box p='15px' backgroundColor={'#fff'} shadow={9} borderRadius={10} mt='10px'>
                                {
                                    wmBestList != '' &&
                                    wmBestList.length > 0 ?
                                    wmBestList.map((item, index)=> {
                                        return(
                                            <Box key={index} style={{ marginTop: index == '0' ? 0 : 15}}>
                                                <HStack alignItems={'center'} justifyContent='space-between'>
                                                    <HStack  alignItems={'center'} width='85%'>
                                                        <Box width='32%' >
                                                            <DefText text={ textLengthOverCut('[' + item.wcatename + ']', 6)} style={[styles.boardText]} />
                                                        </Box>
                                                        <Box width='64%' >
                                                            
                                                            <TouchableOpacity onPress={()=>navigation.navigate('WMBestView', {'idx':item.wr_id})}>
                                                                <HStack>
                                                                    {/* {
                                                                        item.wr_10 == 0 &&
                                                                        <Box style={[styles.newBox]}>
                                                                            <DefText text='N' style={[styles.newBoxText]} />
                                                                        </Box>
                                                                    } */}
                                                                    <DefText text={ textLengthOverCut(item.wr_subject, 15)} style={[styles.boardText]} />
                                                                </HStack>
                                                            </TouchableOpacity>
                                                        </Box>
                                                    </HStack>
                                                    <Box width='12%' alignItems={'flex-end'}>
                                                        <DefText text={ item.wr_datetime.substring(5, 10) } style={{fontSize:fsize.fs12, color:'#B4B4B3'}} />
                                                    </Box>
                                                </HStack>
                                            </Box>
                                        )
                                    })
                                    :
                                    <Box alignItems={'center'} py='20px'>
                                        <DefText text='등록된 WM우수사례가 없습니다.' />
                                    </Box>
                                }
                            
                            </Box>
                        </Box>
                        <Box mt='30px'>
                            <HStack alignItems={'center'} justifyContent='space-between'>
                                <DefText text='WM 컨설팅 자료' style={[styles.listBoxTitle]} />
                                <TouchableOpacity onPress={()=>navigation.navigate('WMCunsult')} style={styles.listBoxTitleArrButton}>
                                    <Image source={require('../images/moreBtnBlack.png')} alt='더보기' style={[styles.listBoxTitleArr]} />
                                </TouchableOpacity>
                            </HStack>
                            <Box p='15px' backgroundColor={'#fff'} shadow={9} borderRadius={10} mt='10px'>
                                {
                                    wmConsultList != '' &&
                                    wmConsultList.length > 0 ?
                                    wmConsultList.map((item, index)=> {
                                        return(
                                            <Box key={index} style={{ marginTop: index == '0' ? 0 : 15}}>
                                                <HStack alignItems={'center'} justifyContent='space-between'>
                                                    <HStack  alignItems={'center'} width='85%'>
                                                        <Box width='32%' >
                                                            <DefText text={ textLengthOverCut('[' + item.wcatename + ']', 6)} style={[styles.boardText]} />
                                                        </Box>
                                                        <Box width='64%' >
                                                            
                                                            <TouchableOpacity onPress={()=>navigation.navigate('WMCunsultView', {'idx':item.wr_id})}>
                                                                <HStack>
                                                                    {/* {
                                                                        item.wr_10 == 0 &&
                                                                        <Box style={[styles.newBox]}>
                                                                            <DefText text='N' style={[styles.newBoxText]} />
                                                                        </Box>
                                                                    } */}
                                                                    <DefText text={ textLengthOverCut(item.wr_subject, 15)} style={[styles.boardText]} />
                                                                </HStack>
                                                            </TouchableOpacity>
                                                        </Box>
                                                    </HStack>
                                                    <Box width='12%' alignItems={'flex-end'}>
                                                        <DefText text={ item.wr_datetime.substring(5, 10) } style={{fontSize:fsize.fs12, color:'#B4B4B3'}} />
                                                    </Box>
                                                </HStack>
                                            </Box>
                                        )
                                    })
                                    :
                                    <Box alignItems={'center'} py='20px'>
                                        <DefText text='등록된 WM우수사례가 없습니다.' />
                                    </Box>
                                }
                            
                            </Box>
                        </Box>
                        <Box mt='30px'>
                            <HStack alignItems={'center'} justifyContent='space-between'>
                                <DefText text='WM 교육영상' style={[styles.listBoxTitle]} />
                                <TouchableOpacity onPress={()=>navigation.navigate('WMVideo')} style={styles.listBoxTitleArrButton}>
                                    <Image source={require('../images/moreBtnBlack.png')} alt='더보기' style={[styles.listBoxTitleArr]} />
                                </TouchableOpacity>
                            </HStack>
                            <Box p='15px' backgroundColor={'#fff'} shadow={9} borderRadius={10} mt='10px'>
                                {
                                    wmEduList != '' &&
                                    wmEduList.length > 0 ?
                                    wmEduList.map((item, index)=> {
                                        return(
                                            <Box key={index} style={{ marginTop: index == '0' ? 0 : 15}}>
                                                <HStack alignItems={'center'} justifyContent='space-between'>
                                                    <HStack  alignItems={'center'} width='85%'>
                                                        <Box width='32%' >
                                                            <DefText text={ textLengthOverCut('[' + item.wcatename + ']', 6)} style={[styles.boardText]} />
                                                        </Box>
                                                        <Box width='64%' >
                                                            
                                                            <TouchableOpacity onPress={()=>navigation.navigate('WMVideoView', {'idx':item.wr_id})}>
                                                                <HStack>
                                                                    {/* {
                                                                        item.wr_10 == 0 &&
                                                                        <Box style={[styles.newBox]}>
                                                                            <DefText text='N' style={[styles.newBoxText]} />
                                                                        </Box>
                                                                    } */}
                                                                    <DefText text={ textLengthOverCut(item.wr_subject, 15)} style={[styles.boardText]} />
                                                                </HStack>
                                                            </TouchableOpacity>
                                                        </Box>
                                                    </HStack>
                                                    <Box width='12%' alignItems={'flex-end'}>
                                                        <DefText text={ item.wr_datetime.substring(5, 10) } style={{fontSize:fsize.fs12, color:'#B4B4B3'}} />
                                                    </Box>
                                                </HStack>
                                            </Box>
                                        )
                                    })
                                    :
                                    <Box alignItems={'center'} py='20px'>
                                        <DefText text='등록된 WM우수사례가 없습니다.' />
                                    </Box>
                                }
                            
                            </Box>
                        </Box>
                       
                        {/* <HStack mt='30px' justifyContent={'flex-end'}>
                            <TouchableOpacity style={[styles.myeduBtn]} onPress={()=>navigation.navigate('MyEducation')}>
                                <DefText text='MY 교육' style={[styles.myeduBtnText]} />
                            </TouchableOpacity>
                        </HStack> */}
                    </Box>
                </ScrollView>
            }
        </Box>
    );
};

const styles = StyleSheet.create({
    commuTopBox : {
        borderRadius:10,
        backgroundColor:colorSelect.orange,
        width:commuBoxWidth,
        height:50,

        justifyContent:'center',
        paddingHorizontal:15,
    },
    listBoxTitle: {
        fontSize:fsize.fs16,
        ...fweight.eb
    },
    listBoxTitleWrap : {
        height: 35,
        borderTopLeftRadius:10,
        borderTopRightRadius:10,
        justifyContent:'center',
        paddingLeft:15
    },
    listBoxTitleArrButton: {
        width: 35,
        height:35,
        justifyContent:'center',
        alignItems:'center'
    },
    listBoxTitleArr: {
        width:6,
        height:10,
        resizeMode:'contain'
    },
    boardText: {
        fontSize:13,
        ...fweight.b
    },
    newBox: {
        width:16,
        height:16,
        borderRadius:16,
        backgroundColor:colorSelect.orange,
        justifyContent:'center',
        alignItems:'center',
        marginRight:10
    },
    newBoxText: {
        fontSize:9,
        color:colorSelect.white
    },
    myeduBtn: {
        paddingVertical:10,
        paddingHorizontal:20,
        borderRadius:5,
        backgroundColor:'#004375'
    },
    myeduBtnText: {
        color:colorSelect.white,
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
)(Education);