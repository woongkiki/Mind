import React, {useState, useEffect} from 'react';
import { ScrollView, Platform, Dimensions, StyleSheet, Alert, View, TouchableOpacity } from 'react-native';
import { Box, VStack, HStack, Image, Input } from 'native-base';
import { DefText, SearchInput, SubmitButtons } from '../common/BOOTSTRAP';
import Font from '../common/Font';
import HeaderDef from '../components/HeaderDef';
import {fsize, fweight, colorSelect, textStyle} from '../common/StyleDef';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import ToastMessage from '../components/ToastMessage';
import {searchSettingCategory} from '../Utils/DummyData';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';

import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import { StackActions } from '@react-navigation/native';
import Api from '../Api';

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

const {width} = Dimensions.get('window');
const categoryBtn = (width - 40) * 0.32;
const categoryPadding = (width - 40) * 0.019;

let today = new Date();
let todayText = today.format('yyyy.MM.dd');

const SearchSetting = (props) => {

    const {navigation, route, userInfo} = props;

    const {params} = route;

   // console.log('route:::',route);손

   const [statusList, setStatusList] = useState([]);
   const statusListReceive = () => {
       Api.send('db_statusList', {}, (args)=>{
           let resultItem = args.resultItem;
           let arrItems = args.arrItems;
   
           if(resultItem.result === 'Y' && arrItems) {
               console.log('진행상태리스트: ',  resultItem);
               setStatusList(arrItems);
           }else{
               console.log('진행상태리스트 API 통신 오류!', resultItem);
           }
       });
   }


    const [categorys, setCategorys] = useState('');
    const isFocused = useIsFocused();

    useEffect(()=>{

        statusListReceive();

        if(isFocused){
            if(params.startDate != ''){
                //Alert.alert(params.startDate);
                setStartDate(params.startDate);
            }
            if(params.endDate != ''){
                //Alert.alert(params.endDate);
                setEndDate(params.endDate);
            }
            if(params.progressStatus != ''){
                setCategoryData(params.progressStatus);
            }

            if(params.category != ''){
                setCategorys(params.category)
            }
        }

    }, [isFocused]);

    //시작일
    const [startDateModal, setStartDateModal] = useState(false);
    const [startDate, setStartDate] = useState('');

    const startDateHandler = (date) => {
        startDataModalClose();
        setStartDate(date.format("yyyy.MM.dd"))
    }

    const startDataModalClose = () => {
        setStartDateModal(false)
    }

    //마지막일
    const [endDataModal, setEndDataModal] = useState(false);
    const [endDate, setEndDate] = useState('');
    const endDateHandler = (date) => {
        endDataModalClose();

        if(date.format("yyyy.MM.dd") < startDate){
            ToastMessage('시작일 이후의 날짜를 선택해주세요.');
            return false;
        }

        setEndDate(date.format("yyyy.MM.dd"));
        
    }

    const endDataModalClose = () => {
        setEndDataModal(false)
    }
    

    
    //진행상태 카테고리
    const [categoryData, setCategoryData] = useState([]);
    const categoryHandler = (cate) => {

        if(!categoryData.includes(cate)){
            setCategoryData([...categoryData, cate]);
        }else{
            const categoryFilter = categoryData.filter((e, index)=>{
                return e !== cate;
            });
            setCategoryData(categoryFilter);
        }

        
    }
    const category = searchSettingCategory.map((item, index)=> {
        return(
            <TouchableOpacity 
                key={index} 
                style={[
                    styles.categoryBtn,
                    (index + 1) % 3 === 0 && {marginRight:0},
                    categoryData.includes(item.category) && {backgroundColor:'#4473B8'}
                ]}
                onPress={()=>categoryHandler(item.category)}
            >
                <DefText text={item.category} style={[categoryData.includes(item.category) && {color:colorSelect.white}]} />
            </TouchableOpacity>
        )
    })


    // useEffect(()=>{
    //     console.log('선택한 진행상태:::', categoryData);
    // }, [categoryData])


    return (
        <Box flex={1} backgroundColor='#fff'>
            <HeaderDef headerTitle='검색 설정' navigation={navigation} />
            <ScrollView>
                <Box p='20px'>
                    <Box>
                        <DefText text='기간 설정' style={[textStyle.labelTitle, fweight.eb]}/>
                        <HStack justifyContent={'space-between'} mt='15px' alignItems='center'>
                            <Box style={[styles.dateBox]}>
                                 <DefText text='시작일' />
                                 <TouchableOpacity style={[styles.dateButton]} onPress={()=>setStartDateModal(true)}>
                                     <HStack justifyContent={'space-between'} alignItems='center'>
                                         {
                                             startDate != '' ?
                                             <DefText text={startDate} style={[{fontSize:fsize.fs12, color:colorSelect.black2}]}  />
                                             :
                                             <DefText text={'날짜를 선택해 주세요.'} style={[{fontSize:fsize.fs12, color:colorSelect.black666}]}  />
                                         }
                                        
                                         <Image source={require('../images/dateInputArr.png')} alt='날짜 화살표' style={{width:10, resizeMode:'contain'}} />
                                     </HStack>
                                 </TouchableOpacity>
                            </Box>
                            <Box style={[styles.dateBox]}>
                                 <DefText text='마지막 일' />
                                 <TouchableOpacity style={[styles.dateButton]} onPress={()=>setEndDataModal(true)}>
                                     <HStack justifyContent={'space-between'} alignItems='center'>
                                         {
                                             endDate != '' ?
                                             <DefText text={endDate} style={[{fontSize:fsize.fs12, color:colorSelect.black2}]} />
                                             :
                                             <DefText text='날짜를 선택해 주세요.' style={[{fontSize:fsize.fs12, color:colorSelect.black666}]} />
                                         }
                                         <Image source={require('../images/dateInputArr.png')} alt='날짜 화살표' style={{width:10, resizeMode:'contain'}} />
                                     </HStack>
                                 </TouchableOpacity>
                            </Box>
                        </HStack>
                    </Box>
                    <Box mt='60px'>
                        <DefText text='진행 상태' style={[textStyle.labelTitle, fweight.eb]}/>
                        <HStack flexWrap={'wrap'} mt='15px'>
                            {
                                statusList != '' &&
                                statusList.length > 0 ?
                                statusList.map((item, index)=>{
                                    return(
                                        <TouchableOpacity 
                                            key={index} 
                                            style={[
                                                styles.categoryBtn,
                                                (index + 1) % 3 === 0 && {marginRight:0},
                                                categoryData.includes(item.wr_subject) && {backgroundColor:'#4473B8'}
                                            ]}
                                            onPress={()=>categoryHandler(item.wr_subject)}
                                        >
                                            <DefText text={item.wr_subject} style={[categoryData.includes(item.wr_subject) && {color:colorSelect.white}]} />
                                        </TouchableOpacity>
                                    )
                                })
                                :
                                <Box alignItems={'center'} py='40px'>
                                    <DefText text='등록된 진행상태가 없습니다.' />
                                </Box>
                            }
                         
                        </HStack>
                    </Box>
                </Box>
            </ScrollView>
            <Box>

                <SubmitButtons 
                    btnText = '완료'
                    onPress={()=>navigation.navigate('AllClient', {'startDate':startDate, 'endDate':endDate, 'progressStatus': categoryData, 'category': categorys})}
                />
            </Box>
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
    categoryBtn: {
        width:categoryBtn,
        height:50,
        borderRadius:5, 
        borderWidth:1, 
        marginRight:categoryPadding, 
        marginBottom:10,
        borderWidth:1,
        borderColor:'#F0F0F0',
        justifyContent:'center',
        alignItems:'center'
    },

})

export default connect(
    ({ User }) => ({
        userInfo: User.userInfo, //회원정보
    }),
    (dispatch) => ({
        member_login: (user) => dispatch(UserAction.member_login(user)), //로그인
        member_info: (user) => dispatch(UserAction.member_info(user)), //회원 정보 조회
        
    })
)(SearchSetting);