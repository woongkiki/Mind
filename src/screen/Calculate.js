import React, {useState, useEffect} from 'react';
import { ScrollView, Platform, Dimensions, StyleSheet, Alert, View, TouchableOpacity, FlatList } from 'react-native';
import { Box, VStack, HStack, Image, Input, Select } from 'native-base';
import { DefText, SearchInput } from '../common/BOOTSTRAP';
import HeaderDef from '../components/HeaderDef';
import {fsize, fweight, colorSelect, textStyle} from '../common/StyleDef';
import { calculateData } from '../Utils/DummyData';
import { numberFormat, textLengthOverCut } from '../common/dataFunction';
import DateTimePickerModal from "react-native-modal-datetime-picker";

import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import { StackActions } from '@react-navigation/native';
import Api from '../Api';

const {width} = Dimensions.get('window');
const theadWidth = width * 1.5;

Date.prototype.format = function(f) {
    if (!this.valueOf()) return " ";
 
    var weekName = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
    var d = this;
     
    return f.replace(/(yyyy|yy|MM|dd|E|hh|mm|ss|a\/p)/gi, function($1) {
        switch ($1) {
            case "yyyy": return d.getFullYear();
            case "yy": return (d.getFullYear() % 1000).zf(2);
            case "MM": return (d.getMonth() + 1).zf(2);
            case "dd": return d.getDate().zf(2);
            case "E": return weekName[d.getDay()];
            case "HH": return d.getHours().zf(2);
            case "hh": return ((h = d.getHours() % 12) ? h : 12).zf(2);
            case "mm": return d.getMinutes().zf(2);
            case "ss": return d.getSeconds().zf(2);
            case "a/p": return d.getHours() < 12 ? "오전" : "오후";
            default: return $1;
        }
    });
};

String.prototype.string = function(len){var s = '', i = 0; while (i++ < len) { s += this; } return s;};
String.prototype.zf = function(len){return "0".string(len - this.length) + this;};
Number.prototype.zf = function(len){return this.toString().zf(len);};

let today = new Date();
let todayText = today.format('yyyy-MM');

const Calculate = (props) => {

    const {navigation, userInfo} = props;

    const [category, setCategory] = useState('');

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

    const _renderItem = ({item, index})=> {
        return(
            <Box></Box>
        )
    }


    //시작일
    const [startDateModal, setStartDateModal] = useState(false);
    const [startDate, setStartDate] = useState(todayText);

    const startDateHandler = (date) => {
        startDataModalClose();
        setStartDate(date.format("yyyy-MM"))
    }

    const startDataModalClose = () => {
        setStartDateModal(false)
    }

    //마지막일
    const [endDataModal, setEndDataModal] = useState(false);
    const [endDate, setEndDate] = useState('');
    const endDateHandler = (date) => {
        endDataModalClose();

        if(date.format("yyyy-MM-dd") < startDate){
            ToastMessage('시작일 이후의 날짜를 선택해주세요.');
            return false;
        }

        setEndDate(date.format("yyyy-MM"));
        
    }

    const endDataModalClose = () => {
        setEndDataModal(false)
    }

    const [points, setPoints] = useState('');
    const [calList, setCalList] = useState([]);
    const [sumPrice, setSumPrice] = useState('');
    const calRec = async () => {
        await Api.send('price_point', {'idx':userInfo.mb_no}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               //console.log('포인트 출력 결과: ', arrItems, resultItem);
               setPoints(arrItems);
            }else{
                console.log('포인트 출력 실패!', resultItem);

            }
        });

        await Api.send('price_list', {'idx':userInfo.mb_no, 'date':startDate, 'edate':endDate}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               console.log('정산 리스트 결과: ', arrItems);
               setCalList(arrItems.adjust);
               setSumPrice(arrItems.sumPrice)
            }else{
                console.log('정산 리스트 결과 출력 실패!', resultItem);

            }
        });
    }

    useEffect(()=>{
        calRec();
    }, [startDate, endDate])

    return (
        <Box flex={1} backgroundColor='#fff'>
            <HeaderDef headerTitle='정산' navigation={navigation} />
            <ScrollView>
                <Box px='20px' mt='20px'>
                    <Box backgroundColor={'#fff'} borderRadius={10} shadow={9} py='20px'>
                        <HStack justifyContent={'space-between'} alignItems='center'>
                            <Box style={[styles.halfWidth]}>
                                <DefText text='보유 포인트' style={[fweight.b]}/>
                                <TouchableOpacity onPress={()=>navigation.navigate('PointList')}>
                                    <DefText text={ points != '' ? numberFormat(points) + 'P' : '0'} style={[styles.halfText, {color:colorSelect.orange}]} />
                                </TouchableOpacity>
                            </Box>
                            <Box style={{width:1, height:40, backgroundColor:'#191919'}} />
                            <Box style={[styles.halfWidth]}>
                                <DefText text='정산 예정 금액' style={[fweight.b]} />
                                <DefText text={ sumPrice != '' ? numberFormat(sumPrice) + 'P' : '0'} style={[styles.halfText, {color:colorSelect.blue}]} />
                            </Box>
                        </HStack>
                    </Box>
                    <HStack justifyContent={'space-between'} mt='30px'>
                        <TouchableOpacity style={[styles.dateButton]} onPress={()=>setStartDateModal(true)}>
                            <HStack alignItems={'center'} justifyContent='space-between'>
                                <DefText text={startDate} />
                                <Image source={require('../images/dateDowns.png')} style={{width:10, height:14, resizeMode:'contain'}} alt='다운' />
                            </HStack>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.dateButton]} onPress={()=>setEndDataModal(true)}>
                            <HStack alignItems={'center'} justifyContent='space-between'>
                            {
                                endDate != '' ?
                                <DefText text={endDate} />
                                :
                                <DefText text={'기간 설정'} style={{color:'#999999'}} />
                            }
                                <Image source={require('../images/dateDowns.png')} style={{width:10, height:14, resizeMode:'contain'}} alt='다운' />
                            </HStack>
                        </TouchableOpacity>
                    </HStack>
                </Box>
                {
                    calList != '' ?
                    <Box mt='20px'>
                        <ScrollView
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                        >  
                            <Box borderTopWidth={1} borderTopColor='#C9C9C9'>
                                <HStack alignItems={'center'} style={[styles.thead]}>
                                    <Box style={[styles.theadBox]} >
                                        <DefText text='NO' style={[{color:'#9A9A9A'}, fweight.b]} />
                                    </Box>
                                    <Box style={[styles.theadBox]}>
                                        <DefText text='일자' style={[{color:'#9A9A9A'}, fweight.b]}  />
                                    </Box>
                                    <Box style={[styles.theadBox]}>
                                        <DefText text='고객명' style={[{color:'#9A9A9A'}, fweight.b]}  />
                                    </Box>
                                    <Box style={[styles.theadBox]}>
                                        <DefText text='종류' style={[{color:'#9A9A9A'}, fweight.b]}  />
                                    </Box>
                                    <Box style={[styles.theadBox]}>
                                        <DefText text='처리' style={[{color:'#9A9A9A'}, fweight.b]}  />
                                    </Box>
                                    <Box style={[styles.theadBox]}>
                                        <DefText text='단가' style={[{color:'#9A9A9A'}, fweight.b]}  />
                                    </Box>
                                    <Box style={[styles.theadBox]}>
                                        <DefText text='할인' style={[{color:'#9A9A9A'}, fweight.b]}  />
                                    </Box>
                                </HStack>
                                <Box>
                                    {
                                        calList != '' &&
                                        calList.map((item, index)=> {
                                            return(
                                                <Box key={index} borderBottomWidth={1} borderBottomColor='#FAFAFA'>
                                                    <HStack>
                                                        <Box style={[styles.theadBox]} >
                                                            <DefText text={index + 1} style={[fweight.b, {color:'#666666'}]} />
                                                        </Box>
                                                        <Box style={[styles.theadBox]}>
                                                            <DefText text={item.date} style={[fweight.b, {color:'#666666'}]}  />
                                                        </Box>
                                                        <Box style={[styles.theadBox]}>
                                                            <DefText text={item.wr_5} style={[fweight.b, {color:'#666666'}]}  />
                                                        </Box>
                                                        <Box style={[styles.theadBox]}>
                                                            <DefText text={item.cname} style={[fweight.b, {color:'#666666'}]} />
                                                        </Box>
                                                        <Box style={[styles.theadBox]}>
                                                            <DefText text={item.type} style={[fweight.b, {color:'#666666'}]}  />
                                                        </Box>
                                                        <Box style={[styles.theadBox]}>
                                                            <DefText text={numberFormat(item.wr_1)} style={[fweight.b, {color:'#666666'}]}  />
                                                        </Box>
                                                        <Box style={[styles.theadBox]}>
                                                            <DefText text={item.wr_7 + '%'} style={[fweight.b, {color:'#666666'}]}  />
                                                        </Box>
                                                    </HStack>
                                                </Box>
                                            )
                                        })
                                    }
                                </Box>
                            </Box>
                        </ScrollView>
                    </Box>
                    :
                    <Box py='60px' alignItems={'center'}>
                        <DefText text='정산내역이 없습니다.' />
                    </Box>
                }
                
            </ScrollView>
  
            <DateTimePickerModal
                isVisible={startDateModal}
                mode="date"
                onConfirm={startDateHandler}
                onCancel={startDataModalClose}
            />
            <DateTimePickerModal
                isVisible={endDataModal}
                mode="date"
                onConfirm={endDateHandler}
                onCancel={endDataModalClose}
            />
        </Box>
    );
};

const styles = StyleSheet.create({
    halfWidth:{
        width:(width - 40) * 0.48,
        justifyContent:'center',
        alignItems:'center'
    },
    halfText: {
        marginTop:15,
    },
    dateButton : {
        width:(width - 40) * 0.47,
        height:40,
        borderRadius:5,
        borderWidth:1,
        borderColor:'#999999',
        paddingHorizontal:10,
        justifyContent:'center'
    },
    thead: {
        backgroundColor:'#F9F9F9',
        alignItems:'center',
    },
    theadBox: {
        width: 100,
        justifyContent:'center',
        alignItems:'center',
        paddingVertical:10
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
)(Calculate);