import React, {useState, useEffect} from 'react';
import { ScrollView, Platform, Dimensions, StyleSheet, Alert, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Box, VStack, HStack, Image, Input } from 'native-base';
import { DefText } from '../common/BOOTSTRAP';
import Font from '../common/Font';
import HeaderHome from '../components/HeaderHome';
import {fsize, fweight, colorSelect, textStyle} from '../common/StyleDef';
import { officeBoard, brandBoard, memoBoard } from '../Utils/DummyData';
import { textLengthOverCut } from '../common/dataFunction';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';

import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import { StackActions } from '@react-navigation/native';
import Api from '../Api';

const {width} = Dimensions.get('window');
const commuBoxWidth = width * 0.43;

const Comunication = (props) => {

    const {navigation, userInfo} = props;

    //console.log('userInfo', userInfo);

    const [comLoading, setComLoading] = useState(true);

    //본사게시판용
    const [homeOffice, setHomeOffice] = useState([]);
    const [homeOfficeCnt, setHomeOfficeCnt] = useState(0);
 
    //지사,지점게시판용
    const [homeBrand, setHomeBrand] = useState([]);
    const [homeBrandCnt, setHomeBrandCnt] = useState(0);

    //쪽지함
    //본사업무로 변경
    const [homeMemo, setHomeMemo] = useState([]);
    const [homeMemoCnt, setHomeMemoCnt] = useState(0);

    //sales hot-line
    const [sales, setSales] = useState([]);
    const [salesCnt, setSalesCnt] = useState("0");

    const communicationRec = async () => {

        await setComLoading(true);
        //본사게시판용
        await Api.send('com_homeOffice', {}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               // console.log('커뮤니케이션 본사게시판 리스트: ', arrItems, resultItem);
                setHomeOffice(arrItems.office);
                setHomeOfficeCnt(arrItems.cnt)

            }else{
                console.log('커뮤니케이션 본사게시판 실패!', resultItem);

            }
        });

        //지사,지점게시판용
        await Api.send('com_homeBrand', {'brandIdx':userInfo.mb_1}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
                //console.log('커뮤니케이션 지사/지점게시판 리스트: ', resultItem);
                setHomeBrand(arrItems.brand);
                setHomeBrandCnt(arrItems.cnt);
            }else{
                console.log('커뮤니케이션 지사/지점게시판 실패!', resultItem);

            }
        });

        //쪽지함
        await Api.send('com_homeMemo', {'recName':userInfo.mb_name}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
                console.log('커뮤니케이션 쪽지함 리스트: ', resultItem);
                setHomeMemo(arrItems.memo);
                setHomeMemoCnt(arrItems.cnt)
            }else{
                console.log('커뮤니케이션 쪽지함 실패!', resultItem);

            }
        });


        //쪽지함
        await Api.send('com_sales', {'recName':userInfo.mb_name}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               console.log('커뮤니케이션 sales 리스트: ',  resultItem);
                setSales(arrItems.sales);
                setSalesCnt(arrItems.salesCnt)
            }else{
                console.log('커뮤니케이션 sales 실패!', resultItem);

            }
        });

        await setComLoading(false);
    }

    const appConnectConfirm = () => {
        Api.send('app_connect', {'id':userInfo.mb_id, 'name':userInfo.mb_name}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
                console.log('앱 접속내역 성공: ', resultItem);

                
            }else{
                console.log('앱 접속내역 실패', resultItem);

            }
        });
    }

    useEffect( ()=> {
        communicationRec();
    }, []);


    const isFocused = useIsFocused();

    useEffect(()=>{

        communicationRec();

        appConnectConfirm();

    }, [isFocused]);

    return (
        <Box flex={1} backgroundColor='#fff'>
            <HeaderHome headerTitle='hot line' />
            {
                comLoading ?
                <Box flex={1} backgroundColor='#fff' justifyContent={'center'} alignItems='center'>
                    <ActivityIndicator size='large' color='#333' />
                </Box>
                :
                <ScrollView>
                    <Box p='20px'>
                        <HStack alignItems={'center'} justifyContent='space-between'>
                            {/* <Box>
                                <HStack>
                                    <DefText text='새로운 알림' style={[{fontSize:fsize.fs22}, fweight.eb]} />
                                    <DefText text='을' style={[{fontSize:fsize.fs22}]} />
                                </HStack>
                                <DefText text='확인하세요!' style={[{fontSize:fsize.fs22, marginTop:5}]}  />
                            </Box> */}
                            {/* <TouchableOpacity onPress={()=>navigation.navigate('OfficeBoard')} style={[styles.commuTopBox,  {backgroundColor:colorSelect.blue}]}>
                                <HStack alignItems={'center'} justifyContent='space-between'>
                                    <HStack alignItems={'center'}>
                                        <Image source={require('../images/officeIcons.png')} alt='본사' style={{width:23, height:22, resizeMode:'contain', marginRight:10}} />
                                        <DefText text='본사 게시판' style={[{fontSize:fsize.fs14, color:colorSelect.white}]} />
                                    </HStack>
                                    <DefText text={homeOfficeCnt} style={[{color:colorSelect.white}, fweight.eb]} />
                                </HStack>
                            </TouchableOpacity> */}
                            <TouchableOpacity onPress={()=>navigation.navigate('SalesList')}  style={[styles.commuTopBox]}>
                                <HStack alignItems={'center'} justifyContent='space-between' >
                                    <HStack alignItems={'center'}>
                                        <Image source={require('../images/saleIcons.png')} alt='쪽지' style={{width:23, height:21, resizeMode:'contain', marginRight:10}} />
                                        <DefText text='hot line' style={[{fontSize:fsize.fs14, color:colorSelect.white}]} />
                                    </HStack>
                                    <DefText text={salesCnt} style={[{color:colorSelect.white}, fweight.eb]} />
                                </HStack>
                            </TouchableOpacity>
                            {/* <TouchableOpacity onPress={()=>navigation.navigate('OfficeBusiness')} style={[styles.commuTopBox]}>
                                <HStack alignItems={'center'} justifyContent='space-between' >
                                    <HStack alignItems={'center'}>
                                        <Image source={require('../images/memoIcons.png')} alt='쪽지' style={{width:23, height:20, resizeMode:'contain', marginRight:10}} />
                                        <DefText text='본사 업무' style={[{fontSize:fsize.fs14, color:colorSelect.white}]} />
                                    </HStack>
                                    <DefText text={homeMemoCnt} style={[{color:colorSelect.white}, fweight.eb]} />
                                </HStack>
                            </TouchableOpacity> */}
                        </HStack>
                        <HStack justifyContent='space-between' alignItems={'center'} mt='15px'>
                            {/* <TouchableOpacity onPress={()=>navigation.navigate('BrandBoard')} style={[styles.commuTopBox,  {backgroundColor:'#5893EA'}]}>
                                <HStack alignItems={'center'} justifyContent='space-between'>
                                    <HStack alignItems={'center'}>
                                        <Image source={require('../images/branchIcons.png')} alt='지사' style={{width:23, height:23, resizeMode:'contain', marginRight:10}} />
                                        <DefText text='지사 게시판' style={[{fontSize:fsize.fs14, color:colorSelect.white}]} />
                                    </HStack>
                                    <DefText text={homeBrandCnt} style={[{color:colorSelect.white}, fweight.eb]} />
                                </HStack>
                            </TouchableOpacity> */}
                            
                        </HStack>

                        {/* <Box mt='30px' backgroundColor={'#fff'} shadow={9} borderRadius={10}>
                            <Box style={[styles.listBoxTitleWrap]} backgroundColor={colorSelect.blue}>
                                <TouchableOpacity onPress={()=>navigation.navigate('OfficeBoard')}>
                                    <HStack alignItems={'center'} justifyContent='space-between' width={width - 40} height='35px'  borderTopLeftRadius={10} borderTopRightRadius={10} px='15px'>
                                        <DefText text='본사 게시판' style={[styles.listBoxTitle]} />
                                    
                                        <Image source={require('../images/commuMoreBtn.png')} alt='더보기' style={[styles.listBoxTitleArr]} />
                                    </HStack>
                                </TouchableOpacity>
                            </Box>
                            <Box p='15px'>
                                {
                                    homeOffice != '' &&
                                    homeOffice.length > 0 ?
                                    homeOffice.map((item, index)=> {
                                        return(
                                            <Box key={index} style={{ marginTop: index == '0' ? 0 : 15}}>
                                                <HStack alignItems={'center'} justifyContent='space-between'>
                                                    <HStack   width='85%'>
                                                        <Box width='32%' >
                                                            <DefText text={'[' + textLengthOverCut(item.wr_1, 5) + ']'} style={[styles.boardText]} />
                                                        </Box>
                                                        <Box width='64%' >
                                                            
                                                            <TouchableOpacity onPress={()=>navigation.navigate('BoardView', {'item':item, 'screen':'OfficeBoard', 'idx':item.wr_id})}>
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
                                                        <DefText text={ item.datetime } style={{fontSize:fsize.fs12, color:'#B4B4B3'}} />
                                                    </Box>
                                                </HStack>
                                            </Box>
                                        )
                                    })
                                    :
                                    <Box>
                                        <DefText text='등록된 게시물이 없습니다.' />
                                    </Box>
                                }
                                
                            </Box>
                        </Box>
                        <Box mt='30px' backgroundColor={'#fff'} shadow={9} borderRadius={10}>
                            <Box style={[styles.listBoxTitleWrap]} backgroundColor={'#5893EA'}>
                                <TouchableOpacity onPress={()=>navigation.navigate('BrandBoard')} >
                                    <HStack alignItems={'center'} justifyContent='space-between' px='15px'>
                                        <DefText text='지사 / 지점 게시판' style={[styles.listBoxTitle]} />
                                    
                                        <Image source={require('../images/commuMoreBtn.png')} alt='더보기' style={[styles.listBoxTitleArr]} />
                                    </HStack>
                                </TouchableOpacity>
                            </Box>
                            <Box p='15px'>
                                {
                                    homeBrand != '' && 
                                    homeBrand.length > 0 ?
                                    homeBrand.map((item, index)=> {
                                        return(
                                            <Box key={index} style={{ marginTop: index == '0' ? 0 : 15}}>
                                                <HStack alignItems={'center'} justifyContent='space-between'>
                                                    <HStack alignItems={'center'}  width='85%'>
                                                        <Box width='32%' >
                                                            <DefText text={'[' + textLengthOverCut(item.wr_1, 5) + ']'} style={[styles.boardText]} />
                                                        </Box>
                                                        <Box width='64%'>
                                                            <TouchableOpacity onPress={()=>navigation.navigate('BoardView', {'item':item, 'screen':'BrandBoard', 'idx':item.wr_id})}>
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
                                                        <DefText text={ item.datetime } style={{fontSize:fsize.fs12, color:'#B4B4B3'}} />
                                                    </Box>
                                                </HStack>
                                            </Box>
                                        )
                                    })
                                    :
                                    <Box>
                                        <DefText text='등록된 게시물이 없습니다.' />
                                    </Box>
                                }
                                
                            </Box>
                        </Box> */}
                        {/* <Box mt='20px' backgroundColor={'#fff'} shadow={9} borderRadius={10}>
                            <Box style={[styles.listBoxTitleWrap]} backgroundColor={colorSelect.orange}>
                                <TouchableOpacity onPress={()=>navigation.navigate('OfficeBusiness')} >
                                    <HStack alignItems={'center'} justifyContent='space-between' px='15px'>
                                        <DefText text='본사 업무' style={[styles.listBoxTitle]} />
                                        <Image source={require('../images/commuMoreBtn.png')} alt='더보기' style={[styles.listBoxTitleArr]} />
                                    </HStack>
                                </TouchableOpacity>
                            </Box>
                            <Box p='15px'>
                                {
                                    homeMemo != '' &&
                                    homeMemo.length > 0 ?
                                    homeMemo.map((item, index)=> {
                                        return(
                                            <Box key={index} style={{ marginTop: index == '0' ? 0 : 15}}>
                                                <HStack alignItems={'center'} justifyContent='space-between'>
                                                    <HStack width='85%' alignItems={'center'}>
                                                        <Box width='32%' >
                                                            <DefText text={ textLengthOverCut(item.wr_name, 5) } style={[styles.boardText]} />
                                                        </Box>
                                                        <Box width='64%'>
                                                            <TouchableOpacity onPress={()=>navigation.navigate('BoardView', {'item':item, 'screen':'MemoBoard', 'idx':item.wr_id})}>
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
                                                        <DefText text={ item.datetime } style={{fontSize:fsize.fs12, color:'#B4B4B3'}} />
                                                    </Box>
                                                </HStack>
                                            </Box>
                                        )
                                    })
                                    :
                                    <Box>
                                        <DefText text='등록된 자료가 없습니다.' />
                                    </Box>
                                }
                            </Box>
                        </Box> */}
                        <Box backgroundColor={'#fff'} shadow={9} borderRadius={10}>
                            <Box style={[styles.listBoxTitleWrap]} backgroundColor={colorSelect.orange}>
                                <TouchableOpacity onPress={()=>navigation.navigate("SalesList")}>
                                    <HStack alignItems={'center'} justifyContent='space-between' px='15px'>
                                        <DefText text='Hot-line' style={[styles.listBoxTitle]} />
                                        <Image source={require('../images/commuMoreBtn.png')} alt='더보기' style={[styles.listBoxTitleArr]} />
                                    </HStack>
                                </TouchableOpacity>
                            </Box>
                            <Box p='15px'>
                                {
                                    sales != "" ?
                                    sales.map((item, index) => {
                                        return(
                                            <Box key={index} style={[ index != 0 && {marginTop:15}]}>
                                                <HStack alignItems={'center'} justifyContent='space-between'>
                                                    <HStack alignItems={'center'}  width='85%'>
                                                        <Box width='32%'  >
                                                            <DefText text={'['+ item.wr_1 +']'} />
                                                        </Box>
                                                        <Box width='45%' >
                                                            <TouchableOpacity
                                                                onPress={ ()=> navigation.navigate("SalesView", {'idx':item.wr_id})}
                                                            >
                                                                <HStack>
                                                                    {
                                                                        item.wr_10 == 0 &&
                                                                        <Box style={[styles.newBox]}>
                                                                            <DefText text='N' style={[styles.newBoxText]} />
                                                                        </Box>
                                                                    }
                                                                    <DefText text={ textLengthOverCut(item.wr_subject, 9)} style={[styles.boardText]} />
                                                                </HStack>
                                                            </TouchableOpacity>
                                                        </Box>
                                                        <Box width='20%' alignItems={'flex-end'} >
                                                            <DefText text={item.comment_cnt} />
                                                        </Box>
                                                    </HStack>
                                                    <Box width='12%' alignItems={'flex-end'}>
                                                        <DefText text={ item.datetime } style={{fontSize:fsize.fs12, color:'#B4B4B3'}} />
                                                    </Box>
                                                </HStack>
                                            </Box>
                                        )
                                    })
                                    :
                                    <Box>
                                        <DefText text='등록된 자료가 없습니다.' />
                                    </Box>
                                }
                                
                            </Box>
                        </Box>
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
        color: colorSelect.white,
        ...fweight.eb
    },
    listBoxTitleWrap : {
        height: 35,
        borderTopLeftRadius:10,
        borderTopRightRadius:10,
        justifyContent:'center',
        // paddingLeft:15
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
)(Comunication);