import React, { useEffect, useState } from 'react';
import {Text, ScrollView, StyleSheet, Dimensions, ActivityIndicator} from 'react-native';
import { Box, HStack } from 'native-base';
import { DefText } from '../common/BOOTSTRAP';
import { WebView } from 'react-native-webview';
import ToastMessage from '../components/ToastMessage';
import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import { StackActions } from '@react-navigation/native';
import HeaderDef from '../components/HeaderDef';
import { fsize, fweight } from '../common/StyleDef';


import Api from '../Api';

//디바이스 크기
const {width, height} = Dimensions.get('window');

const Statistics = (props) => {

    const {navigation, userInfo} = props;

    const [keyArr, setKeyArr] = useState([]);
    const [value, setValue] = useState([]);
    const [contents, setContents] = useState('');
    const [analLoading, setAnalLoading] = useState(true);
    const analyze = async () => {
        await setAnalLoading(true);
        await Api.send('analyze_list', {'idx':userInfo.mb_no}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
                console.log('분석 결과: ', arrItems, resultItem);
                let keys = Object.keys(arrItems);
                let values = Object.values(arrItems);

                setKeyArr(keys);
                setValue(values);
               
            }else{
                console.log('분석 결과 출력 실패!', resultItem);

            }
        });

        await Api.send('analyze_listContent', {'idx':userInfo.mb_no}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
                //console.log('분석 내용 결과: ', arrItems, resultItem);
                setContents(arrItems.wr_content)
               
            }else{
                console.log('분석 내용 결과 출력 실패!', resultItem);

            }
        });
        await setAnalLoading(false);
    }

    useEffect(()=>{
        analyze();
    }, [])

    //console.log('Home userinfo:::', userInfo);

    return (
        <Box flex={1} backgroundColor={'#fff'}>
            <HeaderDef headerTitle='통계 및 분석' navigation={navigation} />
            {
                analLoading ?
                <Box flex={1} justifyContent='center' alignItems={'center'}>
                    <ActivityIndicator size='large' color='#333' />
                </Box>
                :
                <ScrollView>
                    <Box p='20px'>
                        <DefText text='나의 능력' style={[{fontSize:fsize.fs20}, fweight.b]} />
                    </Box> 
                    <Box height={width} width={width}  px='20px'>
                        <WebView
                            source={{
                                uri:'https://cnj02.cafe24.com/chart2.php?idx='+userInfo.mb_no
                            }}
                        />
                        {/* <Box height={(width/2) + 60} width={(width/2) + 60} position={'absolute'} top={0} left={0} /> */}
                    </Box>
                    <Box height={width} width={width} backgroundColor='#00f'>
                        <WebView
                            source={{
                                uri:'https://cnj02.cafe24.com/chart.php?idx='+userInfo.mb_no
                            }}
                        />
                        {/* <Box height={(width/2) + 60} width={(width/2) + 60} position={'absolute'} top={0} left={0} /> */}
                    </Box>
                    <Box p='20px' mt='-40px'>
                        <Box backgroundColor={'#fff'} borderRadius={10} shadow={9} p='20px'>
                            <HStack flexWrap={'wrap'}>
                            {
                                keyArr.map((item, index)=> {
                                    return(
                                        <Box key={index} width='50%' mb={ keyArr.length == index + 1 ? 0 : '10px'}>
                                            <HStack alignItems={'center'}>
                                                <Box width='60%'>
                                                    <DefText text={item} style={[{fontSize:fsize.fs14}, fweight.b]}/>
                                                </Box>
                                                <Box width='30%' alignItems={'flex-end'}>
                                                   
                                                        <DefText text={value[index] + '점'} />
                                            
                                                    
                                                </Box>
                                            </HStack>
                                        </Box>
                                    )
                                })
                            }
                            </HStack>
                        </Box>
                        <DefText text='분석 결과' style={[{fontSize:fsize.fs20, marginTop:30}, fweight.b]} />
                        <Box mt='15px'>
                            <DefText text={contents != '' ? contents : '등록된 분석내용이 없습니다.'} style={[{fontSize:fsize.fs16, lineHeight:23}]} />
                        </Box>
                    </Box>
    

                </ScrollView>
            }
            
            
        </Box>
    );
};

const styles = StyleSheet.create({
    NoticeAlarmButton: {
        width:24,
        height: 24,
        backgroundColor:'#666',
        borderRadius:12,
        justifyContent:'center',
        alignItems:'center'
    },
    NoticeAlarmText: {
        color:'#fff'
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
)(Statistics);
