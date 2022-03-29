import React, {useState, useEffect} from 'react';
import { ScrollView, Platform, Dimensions, StyleSheet, Alert, View, TouchableOpacity, SafeAreaView } from 'react-native';
import { Box, VStack, HStack, Image, Input, Modal, Select } from 'native-base';
import { DefText, SearchInput, DefInput, SubmitButtons } from '../common/BOOTSTRAP';
import Font from '../common/Font';
import HeaderDef from '../components/HeaderDef';
import {fsize, fweight, colorSelect, textStyle} from '../common/StyleDef';
import { Shadow } from 'react-native-neomorph-shadows';
import {possibleMeberList} from '../Utils/DummyData';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Postcode from '@actbase/react-daum-postcode';

import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import { StackActions } from '@react-navigation/native';
import Api from '../Api';
import ToastMessage from '../components/ToastMessage';

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

const ScheduleAdd = (props) => {

    const {navigation, route, userInfo} = props;

    const {params} = route;

    //console.log('params::::',params);

    //일정명
    const [scheduleName, setScheduleName] = useState('');
    const scheduleChange = (text) => {
        setScheduleName(text);
    }


    //시작일
    const [startDateModal, setStartDateModal] = useState(false);
    const [startDate, setStartDate] = useState(params.startDate);

    const startDateHandler = (date) => {
        startDataModalClose();
        setStartDate(date.format("yyyy-MM-dd"))
    }

    const startDataModalClose = () => {
        setStartDateModal(false)
    }

    //시간
    const [time, setTime] = useState('');
    const [timeModal, setTimeModal] = useState(false);
    const showTimePicker = () => {
        setTimeModal(true);
    };

    const hideTimePicker = () => {
        setTimeModal(false);
    };

    const handleConfirmTime = (date) => {
        //console.log("A date has been picked: ", date);
        hideTimePicker();
        setTime(date.format("HH:mm"))
    };


    const [addrModal, setAddrModal] = useState(false);
    const [addrText, setAddrText] = useState('');
    const [addr1, setAddr1]= useState('');
    const [addr2, setAddr2]= useState('');

    const addrSumits = (addr1, addr2) => {
        setAddrText(addr1);
        setAddr1(addr2);
    }

    //고객명
    const [clientName, setClientName] = useState('');
    const clientChange = (name) => {
        setClientName(name);
    }
    const [clientModal, setClientModal] = useState(false);
    const [clientListData, setClientListData] = useState([]);
    const clientSearch = () => {
        Api.send('db_search', {'idx':userInfo.mb_no, 'clientName':clientName}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
              // console.log('고객검색  결과: ', arrItems, resultItem);

               setClientListData(arrItems);
            }else{
                console.log('스케줄 고객검색 결과 출력 실패!', resultItem);

            }
        });
    }
    const [selectClient, setSelectClient] = useState('');
    const [selectClientIdx, setSelectClientIdx] = useState('');

    const selectClientHandler = (names, idx) => {
        setSelectClient(names);
        setSelectClientIdx(idx);
        setClientModal(false);
    }

    //중요도 홍길동
    const [important, setImportant] = useState('');

    const [alarm, setAlarm] = useState('기본(2시간 전)');

    const [categorys, setCategorys] = useState('');

    const scheduleAdd = () => {
        Api.send('schedule_insert', {'sName':scheduleName, 'startDate':startDate, 'time':time, 'zip':addrText, 'addr1':addr1, 'addr2':addr2, 'cname':selectClient, 'cidx':selectClientIdx, 'important':important, 'alarm':alarm, 'categorys':categorys, 'mb_id':userInfo.mb_name, 'mb_idx':userInfo.mb_no}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               console.log('스케줄 등록 결과: ', arrItems, resultItem);
               ToastMessage(resultItem.message);
               navigation.goBack();
               //setClientListData(arrItems);
            }else{
                console.log('스케줄 등록 출력 실패!', resultItem);
                ToastMessage(resultItem.message);
            }
        });
    }

    return (
        <Box flex={1} backgroundColor='#fff'>
            <HeaderDef headerTitle='스케줄 추가' navigation={navigation} />
            <ScrollView>
                <Box p='20px'>
                    <Box>
                        <DefText text='일정 카테고리' style={[styles.labelTitle]} />
                        <Select
                            selectedValue={categorys}
                            width='100%'
                            height='40px'
                            fontSize={fsize.fs12}
                            style={fweight.r}
                            backgroundColor='#fff'
                            borderWidth={1}
                            borderColor='#999999'
                            onValueChange={(itemValue) => setCategorys(itemValue)}
                            placeholder='일정 카테고리를 선택하세요.'
                            
                        >
                            <Select.Item label='미팅' value='미팅' />
                            <Select.Item label='통화' value='통화' />
                            <Select.Item label='계약' value='계약' />
                            <Select.Item label='상담' value='상담' />
                        </Select>
                    </Box>
                    <Box mt='30px'>
                        <DefText text='일정명' style={[styles.labelTitle]} />
                        <DefInput 
                            placeholderText='일정명을 입력해주세요.'
                            inputValue={scheduleName}
                            onChangeText={scheduleChange}
                        />
                    </Box>
                    <Box mt='30px'>
                        <DefText text='일시' style={[styles.labelTitle]} />
                        <HStack justifyContent={'space-between'} alignItems='center'>
                            <Box style={[styles.dateBox]}>
                                 <DefText text='날짜' />
                                 <TouchableOpacity style={[styles.dateButton]} onPress={()=>setStartDateModal(true)}>
                                     <HStack justifyContent={'space-between'} alignItems='center'>
                                        <DefText text={startDate} style={[{fontSize:fsize.fs12}]}  />
                                         <Image source={require('../images/dateInputArr.png')} alt='날짜 화살표' style={{width:10, resizeMode:'contain'}} />
                                     </HStack>
                                 </TouchableOpacity>
                            </Box>
                            <Box style={[styles.dateBox]}>
                                 <DefText text='시간' />
                                 <TouchableOpacity style={[styles.dateButton]} onPress={showTimePicker}>
                                     <HStack justifyContent={'space-between'} alignItems='center'>
                                         {
                                             time != '' ?
                                             <DefText text={time} style={[{fontSize:fsize.fs12, color:colorSelect.black2}]} />
                                             :
                                             <DefText text='시간을 선택해 주세요.' style={[{fontSize:fsize.fs12, color:colorSelect.black666}]} />
                                         }
                                         <Image source={require('../images/dateInputArr.png')} alt='날짜 화살표' style={{width:10, resizeMode:'contain'}} />
                                     </HStack>
                                 </TouchableOpacity>
                            </Box>
                        </HStack>
                    </Box>
                    {
                        categorys != '통화' && 
                        <Box mt='30px'>
                            <DefText text='주소' style={[styles.labelTitle]} />
                            <HStack justifyContent={'space-between'}>
                                <Box width='63%'>
                                    <DefInput 
                                        placeholderText='우편번호'
                                        inputValue={addrText}
                                    />
                                </Box>
                                <Box width='35%'>
                                    <TouchableOpacity style={[styles.buttons]} onPress={()=>setAddrModal(true)}>
                                        <DefText text='주소 검색' style={[styles.buttonsText]} />
                                    </TouchableOpacity>
                                </Box>
                            </HStack>
                            <Box mt='10px'>
                                <DefInput 
                                    placeholderText='상세 주소를 입력해 주세요.'
                                    inputValue={addr1}
                                />
                            </Box>
                            <Box mt='10px'>
                                <DefInput 
                                    placeholderText='추가 주소를 입력해 주세요.'
                                    inputValue={addr2}
                                />
                            </Box>
                        </Box>
                    }
                    <Box mt='30px'>
                        <DefText text='고객명' style={[styles.labelTitle]} />
                        <HStack justifyContent={'space-between'}>
                            <Box width='63%' height='40px' borderWidth={1} borderColor='#999' borderRadius={5} justifyContent='center' pl='15px'>
                                {/* <DefInput 
                                    placeholderText='고객명을 입력하세요.'
                                    inputValue={clientName}
                                    onChangeText={clientChange}
                                /> */}
                                {
                                    selectClient != '' ?
                                    <DefText text={selectClient} style={{fontSize:fsize.fs12}} />
                                    :
                                    <DefText text='고객명을 입력하세요.' style={{fontSize:fsize.fs12, color:'#999999'}} />
                                }
                            </Box>
                            <Box width='35%'>
                                <TouchableOpacity style={[styles.buttons]} onPress={()=>setClientModal(true)}>
                                    <DefText text='고객 검색' style={[styles.buttonsText]} />
                                </TouchableOpacity>
                            </Box>
                        </HStack>
                    </Box>
                    <Box mt='30px'>
                        <DefText text='중요도' style={[styles.labelTitle]} />
                        <Select
                            selectedValue={important}
                            width='100%'
                            height='40px'
                            fontSize={fsize.fs12}
                            style={fweight.r}
                            backgroundColor='#fff'
                            borderWidth={1}
                            borderColor='#999999'
                            onValueChange={(itemValue) => setImportant(itemValue)}
                            placeholder='중요도를 선택하세요.'
                            
                        >
                            <Select.Item label='매우 중요' value='매우 중요' />
                            <Select.Item label='중요' value='중요' />
                            <Select.Item label='약간 중요' value='약간 중요' />
                        </Select>
                    </Box>
                    <Box mt='30px'>
                        <DefText text='알림 설정' style={[styles.labelTitle]} />
                        <HStack>
                            <TouchableOpacity onPress={()=>setAlarm('기본(2시간 전)')}>
                                <HStack alignItems={'center'}>
                                    <Box style={[{width:21, height:21, borderRadius:21, borderWidth:1, borderColor:'#004375', justifyContent:'center', alignItems:'center', marginRight:10}, alarm == '기본(2시간 전)' && {backgroundColor:'#004375'}]}>
                                        {
                                            alarm == '기본(2시간 전)' &&
                                           <Image source={require('../images/checkIcons.png')} alt='체크아이콘' style={{width:9, height:6, resizeMode:'contain'}} />
                                        }
                                    </Box>
                                    <DefText text='기본(2시간 전)' />
                                </HStack>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={()=>setAlarm('시간지정')} style={{marginLeft:20}}>
                                <HStack alignItems={'center'}>
                                    <Box style={[{width:21, height:21, borderRadius:21, borderWidth:1, borderColor:'#004375', justifyContent:'center', alignItems:'center', marginRight:10}, alarm == '시간지정' && {backgroundColor:'#004375'}]}>
                                        {
                                            alarm == '시간지정' &&
                                           <Image source={require('../images/checkIcons.png')} alt='체크아이콘' style={{width:9, height:6, resizeMode:'contain'}} />
                                        }
                                    </Box>
                                    <DefText text='시간지정' />
                                </HStack>
                            </TouchableOpacity>
                        </HStack>
                    </Box>
                </Box>
            </ScrollView>
            <SubmitButtons 
                btnText='완료'
                onPress={scheduleAdd}
            />
            <DateTimePickerModal
                isVisible={startDateModal}
                mode="date"
                onConfirm={startDateHandler}
                onCancel={startDataModalClose}
            />
            <DateTimePickerModal
                isVisible={timeModal}
                mode="time"
                onConfirm={handleConfirmTime}
                onCancel={hideTimePicker}
            />
            <Modal isOpen={clientModal} onClose={() => setClientModal(false)}>
                
                <Modal.Content>
                    <Modal.Body>
                        <DefText text='고객명' style={[{fontSize:fsize.fs16}, fweight.eb]} />
                        <HStack justifyContent={'space-between'} mt='15px'>
                            <Box width='72%'>
                                <DefInput
                                    placeholderText={'고객명을 입력해주세요.'}
                                    inputValue={clientName}
                                    onChangeText={clientChange}
                                    onPress={clientSearch}
                                />
                                {/* 홍길동 */}
                            </Box>
                            <Box width='25%'>
                                <TouchableOpacity onPress={clientSearch} style={{height:40, backgroundColor:colorSelect.blue, borderRadius:5, justifyContent:'center', alignItems:'center'}}>
                                    <DefText text='검색' style={[styles.buttonsText]}  />
                                </TouchableOpacity>
                            </Box>
                        </HStack>
                        <Box mt='30px'>
                            <DefText text='결과 내역' style={[{fontSize:fsize.fs16, marginBottom:15}, fweight.eb]} />
                            {
                                clientListData != '' &&
                                clientListData.length > 0 ?
                                clientListData.map((item, index)=> {
                                    return(
                                        <Box key={index} p='15px' borderRadius={5} borderWidth={1} borderColor='#999'>
                                            <HStack >
                                                <Box width='25%'>
                                                    <DefText text={'고객명'} style={[styles.memberTitle]} />
                                                </Box>
                                                <Box width='73%'>
                                                    <DefText text={item.wr_subject} />
                                                </Box>
                                            </HStack>
                                            <HStack mt='10px'>
                                                <Box width='25%'>
                                                    <DefText text={'나이'} style={[styles.memberTitle]} />
                                                </Box>
                                                <Box width='73%'>
                                                    <DefText text={item.age} />
                                                </Box>
                                            </HStack>
                                            <HStack mt='10px'>
                                                <Box width='25%'>
                                                    <DefText text={'주소'} style={[styles.memberTitle]} />
                                                </Box>
                                                <Box width='73%'>
                                                    <HStack>
                                                        <DefText text={item.wr_addr1} />
                                                        {
                                                            item.wr_addr2 != '' &&
                                                            <DefText text={ ' ' + item.wr_addr2} />
                                                        }
                                                        <DefText text={item.wr_addr3} />
                                                    </HStack>
                                                </Box>
                                            </HStack>
                                            <Box position={'absolute'} top='15px' right='15px'>
                                                <TouchableOpacity onPress={()=>selectClientHandler(item.wr_subject, item.wr_id)} style={{paddingHorizontal:15, paddingVertical:5, backgroundColor:colorSelect.blue, borderRadius:5}}>
                                                    <DefText text='선택' style={[styles.buttonsText]} />
                                                </TouchableOpacity>
                                            </Box>
                                        </Box>
                                    )
                                })
                                :
                                <Box py='40px' justifyContent={'center'} alignItems='center'>
                                    <DefText text='검색된 회원정보가 없습니다.' />
                                </Box>
                            }
                        </Box>
                    </Modal.Body>
                </Modal.Content>
            </Modal>
            <Modal isOpen={addrModal} onClose={() => setAddrModal(false)} flex={1}>
                <SafeAreaView style={{width:width, flex:1}}>
                    <HStack justifyContent='space-between' height='55px' alignItems='center' style={{borderBottomWidth:1, borderBottomColor:'#e3e3e3', backgroundColor:'#fff'}} >
                        <TouchableOpacity style={{paddingLeft:20}} onPress={()=>{setAddrModal(false)}}>
                            <Image source={require('../images/sideBarClose.png')} alt='메뉴열기' style={{width:14, height:14, resizeMode:'contain'}} />
                        </TouchableOpacity>
                        <DefText text='다음주소찾기' style={{fontSize:18}} />
                        <DefText text='' style={{width:40}} />
                    </HStack>
                    <Postcode
                        style={{ width: width, height: 320, flex:1 }}
                        jsOptions={{ animation: true, hideMapBtn: true }}
                        onSelected={data => {
                            console.log(data);
                            addrSumits(data.zonecode, data.address)
                            setAddrModal(false);
                        }}
                        onError={e=>console.log(e)}
                    />
                </SafeAreaView>
            </Modal>
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
)(ScheduleAdd);