import React, {useState, useEffect} from 'react';
import { Box, HStack } from 'native-base';
import { ActivityIndicator, Dimensions, FlatList, ScrollView } from 'react-native';
import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import ToastMessage from '../components/ToastMessage';
import { useIsFocused } from '@react-navigation/native';
import Api from '../Api';
import HeaderDef from '../components/HeaderDef';
import { DefText } from '../common/BOOTSTRAP';
import { colorSelect, fweight } from '../common/StyleDef';

const {width} = Dimensions.get("window");

const EducationRequestList = (props) => {

    const {navigation, route, userInfo} = props;
    const {params} = route;

    //console.log("params", params);
    const isFocused = useIsFocused();

    const [loading, setLoading] = useState(true);
    const [reqList, setReqList] = useState([]);

    const requestListApi = async () => {
        await setLoading(true);
        await Api.send('educations_requestList', {'idx':params.idx, 'id':userInfo.mb_id, 'appLevel':userInfo.mb_4, 'mb_1':userInfo.mb_1, 'mb_3':userInfo.mb_3}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result == 'Y'){
                console.log('교육과정 신청 리스트 불러오기 성공', resultItem);
                setReqList(arrItems);
            }else{
                console.log('교육과정 신청 리스트 불러오기 실패', resultItem);
            }
        });
        await setLoading(false);
    }

    const _renderItem = ({item, index}) => {
        return(
            <HStack borderBottomColor={'#E8E8E8'} borderBottomWidth={1} py='20px' px='20px' alignItems={'center'}>
                <Box width={ (width - 40) * 0.1 + "px" } alignItems='center'>
                    <DefText text={index + 1} style={[{fontSize:13}, fweight.r]} />
                </Box>
                <Box width={ (width - 40) * 0.25 + "px" } alignItems='center'>
                    <DefText text={item.rname} style={[{fontSize:13}, fweight.r]} />
                </Box>
                <Box width={ (width - 40) * 0.2 + "px" } alignItems='center'>
                    <DefText text={"본부"} style={[{fontSize:13}, fweight.r]} />
                </Box>
                <Box width={ (width - 40) * 0.2 + "px" } alignItems='center'>
                    <DefText text={item.distributor} style={[{fontSize:13}, fweight.r]} />
                </Box>
                <Box width={ (width - 40) * 0.25 + "px" } alignItems='center'>
                    <DefText text={item.rdatetime.substring(0, 10)} style={[{fontSize:13}, fweight.r]} />
                </Box>
            </HStack>
        )
    }

    useEffect(() => {
        if(isFocused){
            requestListApi();
        }
    }, [isFocused])

    return (
        <Box flex={1} backgroundColor='#fff'>
            <HeaderDef 
                headerTitle="교육신청현황"
                navigation={navigation}
            />
            {
                loading ?
                <Box 
                    flex={1}
                    alignItems='center'
                    justifyContent='center'
                >
                    <ActivityIndicator size={'large'} color='#333' />
                </Box>
                :
                <FlatList 
                    ListHeaderComponent={
                        <HStack borderBottomColor={'#E8E8E8'} borderBottomWidth={1} py='20px' px='20px' alignItems={'center'}>
                            <Box width={ (width - 40) * 0.1 + "px" } alignItems='center'>
                                <DefText text={"No"} style={[{fontSize:13}, fweight.b]} />
                            </Box>
                            <Box width={ (width - 40) * 0.25 + "px" } alignItems='center'>
                                <DefText text={"FP명"} style={[{fontSize:13}, fweight.b]} />
                            </Box>
                            <Box width={ (width - 40) * 0.2 + "px" } alignItems='center'>
                                <DefText text={"본부"} style={[{fontSize:13}, fweight.b]} />
                            </Box>
                            <Box width={ (width - 40) * 0.2 + "px" } alignItems='center'>
                                <DefText text={"지점"} style={[{fontSize:13}, fweight.b]} />
                            </Box>
                            <Box width={ (width - 40) * 0.25 + "px" } alignItems='center'>
                                <DefText text={"신청일"} style={[{fontSize:13}, fweight.b]} />
                            </Box>
                        </HStack>
                    }   
                    data={reqList}
                    renderItem={_renderItem}
                    keyExtractor={(item, index)=>index.toString()}
                    ListEmptyComponent={
                        <Box py={10} alignItems='center'>
                            {
                                userInfo.mb_4 == 4 &&
                                <DefText text='등록된 신청이 없습니다.' style={{color:colorSelect.black666}} />
                            }
                            {
                                userInfo.mb_4 == 3 &&
                                <DefText text='지점내 등록된 신청이 없습니다.' style={{color:colorSelect.black666}} />
                            }
                            {
                                userInfo.mb_4 < 3 &&
                                <DefText text='내가 등록된 신청이 없습니다.' style={{color:colorSelect.black666}} />
                            }
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
    })
)(EducationRequestList);