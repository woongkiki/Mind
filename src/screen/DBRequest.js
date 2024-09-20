import React, { useEffect, useState } from 'react';
import { TouchableOpacity, Platform, Dimensions, ScrollView, StyleSheet } from 'react-native';
import { Box, HStack, VStack, Input, Image, CheckIcon, Select, Switch } from 'native-base';
import { DefText, MainButton, ShadowInput, DefInput, SubmitButtons } from '../common/BOOTSTRAP';
import ToastMessage from '../components/ToastMessage';
import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import { StackActions } from '@react-navigation/native';
import HeaderDef from '../components/HeaderDef';
import { colorSelect, fsize, fweight } from '../common/StyleDef';
import { numberFormat } from '../common/dataFunction';
import Api from '../Api';


const {width} = Dimensions.get('window');


let today = new Date();
let nowMonth = today.getMonth() + 1;
console.log(nowMonth + 1);

const DBRequest = (props) => {

    const {navigation, userInfo} = props;


    const [dbcnt, setDBcnt]  = useState('');
    const dbcntChange = ( text ) => {
        setDBcnt(text);
    }

    //나이
    const [age, setAge] = useState('');
    const ageHandler = (age) => {
        setAge(age);
    }

    const [gender, setGender] = useState('');

    const [price, setPrice] = useState('');
    const priceHandler = (price) => {
        setPrice(price);
    }

    const [marriage, setMarriage] = useState('');

    const db_request_api = () => {
        Api.send('dbRequest_access', {'mb_no':userInfo.mb_no, 'name':userInfo.mb_name, 'branchidx':userInfo.mb_1, 'dbcnt':dbcnt, 'age':hage, 'gender':hgender, 'area1':area1, 'area2':area2, 'familys':familyCheck}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               console.log('db 요청 결과: ', arrItems, resultItem);
                ToastMessage(resultItem.message);
                navigation.goBack();
            }else{
                console.log('db 요청 실패!', resultItem);
                ToastMessage(resultItem.message);
            }
        });
    }


    const [dbCheck, setDBCheck] = useState(false);

    const [areaList, setAreaList] = useState([]);
    const [area1, setArea1] = useState("");
    const [areaList2, setAreaList2] = useState([]);
    const [area2, setArea2] = useState("");
    const [hage, setHage] = useState("");
    const [hgender, setHgender] = useState("");
    const [familyCheck, setFamilyCheck] = useState("");

    //지역 api
    const areaApi = () => {
        Api.send('dbRequest_area', {}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               //console.log('지역 리스트 결과: ', arrItems, resultItem);
               setAreaList(arrItems);
            }else{
                console.log('지역 리스트 실패!', resultItem);
            }
        });

        
    }

    const areaApi2 = () => {
        Api.send('dbRequest_area', {"area1":area1}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               //console.log('지역 리스트2 결과: ', arrItems, resultItem);
               setAreaList2(arrItems);
            }else{
                console.log('지역 리스트2 실패!', resultItem);
            }
        });
    }

    useEffect(() => {
        areaApi();
        areaApi2();
    }, [area1])
    
    return (
        <Box flex={1} backgroundColor='#fff'>
            <HeaderDef headerTitle='DB 신청' navigation={navigation} />
            <ScrollView>
                <Box p='20px'>
                    {/* <Box>
                        <HStack alignItems={'center'} justifyContent='space-between'>
                            <DefText text='DB 사용여부' style={[styles.labelTitle, {marginBottom:0}]} />
                            <HStack alignItems={'center'}>
                                <DefText text={nowMonth + 1 + '월 DB 사용여부'} />
                                <Switch size='sm' onTrackColor='#091073' isChecked={dbCheck} onToggle={()=>setDBCheck(!dbCheck)} />
                            </HStack>
                        </HStack>
                       

                        <DefInput 
                            placeholderText='신청할 DB 수를 입력해주세요.'
                            inputValue={dbcnt}
                            onChangeText={dbcntChange}
                            keyboardType='number-pad'
                        />
                    </Box> */}
                    <Box>
                        <DefText text='신청 DB 수 (월 단위)' style={[styles.labelTitle]} />
                        <DefInput 
                            placeholderText='신청할 DB 수를 입력해주세요.'
                            inputValue={dbcnt}
                            onChangeText={dbcntChange}
                            keyboardType='number-pad'
                        />
                    </Box>
                    <Box mt='30px'>
                        <DefText text='지역1' style={[styles.labelTitle]} />
                        {
                            areaList != "" &&
                            <Select
                                placeholder='지역을 선택하세요.'
                                selectedValue={area1}
                                width={(width - 40)}
                                height='42px'
                                fontSize={fsize.fs12}
                                style={fweight.r}
                                backgroundColor='#fff'
                                borderWidth={1}
                                borderColor='#999999'
                                onValueChange={(itemValue) => setArea1(itemValue)}
                            >
                                {
                                    areaList.map((item, index) => {
                                        return(
                                            <Select.Item label={item} value={item} key={index} />
                                        )
                                    })
                                }
                            </Select>
                        }
                        
                    </Box>
                    <Box mt='30px'>
                        <DefText text='지역2' style={[styles.labelTitle]} />
                        {
                            areaList2 != "" &&
                            <Select
                                placeholder='지역을 선택하세요.'
                                selectedValue={area2}
                                width={(width - 40)}
                                height='42px'
                                fontSize={fsize.fs12}
                                style={fweight.r}
                                backgroundColor='#fff'
                                borderWidth={1}
                                borderColor='#999999'
                                onValueChange={(itemValue) => setArea2(itemValue)}
                            >
                                {
                                    areaList2.map((item, index) => {
                                        return(
                                            <Select.Item label={item} value={item} key={index} />
                                        )
                                    })
                                }
                            </Select>
                        }
                        
                    </Box>
                    <Box mt='30px'>
                        <DefText text='희망 나이' style={[styles.labelTitle]} />
                        <Select
                            placeholder='희망 나이를 선택하세요.'
                            selectedValue={hage}
                            width={(width - 40)}
                            height='42px'
                            fontSize={fsize.fs12}
                            style={fweight.r}
                            backgroundColor='#fff'
                            borderWidth={1}
                            borderColor='#999999'
                            onValueChange={(itemValue) => setHage(itemValue)}
                        >
                            <Select.Item label={"30대"} value={"30"} />
                            <Select.Item label={"40대"} value={"40"} />
                            <Select.Item label={"50대이상"} value={"50"} />
                        </Select>
                    </Box>
                    <Box mt='30px'>
                        <DefText text='희망 성별' style={[styles.labelTitle]} />
                        <Select
                            placeholder='희망 나이를 선택하세요.'
                            selectedValue={hgender}
                            width={(width - 40)}
                            height='42px'
                            fontSize={fsize.fs12}
                            style={fweight.r}
                            backgroundColor='#fff'
                            borderWidth={1}
                            borderColor='#999999'
                            onValueChange={(itemValue) => setHgender(itemValue)}
                        >
                            <Select.Item label={"남"} value={"남"} />
                            <Select.Item label={"여"} value={"여"} />
                        </Select>
                    </Box>
                    <Box mt='30px'>
                        <DefText text='가족상담유무' style={[styles.labelTitle]} />
                        <Select
                            placeholder='가족상담유무를 선택하세요.'
                            selectedValue={familyCheck}
                            width={(width - 40)}
                            height='42px'
                            fontSize={fsize.fs12}
                            style={fweight.r}
                            backgroundColor='#fff'
                            borderWidth={1}
                            borderColor='#999999'
                            onValueChange={(itemValue) => setFamilyCheck(itemValue)}
                        >
                            <Select.Item label={"예"} value={"예"} />
                            <Select.Item label={"아니오"} value={"아니오"} />
                        </Select>
                    </Box>
                </Box>
            </ScrollView>
            <SubmitButtons 
                btnText='신청완료'
                onPress={db_request_api}
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

    typeBox: {
        width: (width-40) / 5,
        height:35,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:colorSelect.gray,
        borderRightWidth:1,
        borderRightColor:'#fff',
    },
    typeBoxText: {
        color: '#fff'
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
)(DBRequest);