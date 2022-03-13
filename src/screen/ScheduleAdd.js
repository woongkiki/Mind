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

    const {navigation, route} = props;

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
        setStartDate(date.format("yyyy.MM.dd"))
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

    //중요도
    const [important, setImportant] = useState('');

    const [alarm, setAlarm] = useState('기본');

    return (
        <Box flex={1} backgroundColor='#fff'>
            <HeaderDef headerTitle='스케줄 추가' navigation={navigation} />
            <ScrollView>
                <Box p='20px'>
                    <Box>
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
                    <Box mt='30px'>
                        <DefText text='고객명' style={[styles.labelTitle]} />
                        <HStack justifyContent={'space-between'}>
                            <Box width='63%'>
                                <DefInput 
                                    placeholderText='고객명을 입력하세요.'
                                    inputValue={clientName}
                                    onChangeText={clientChange}
                                />
                            </Box>
                            <Box width='35%'>
                                <TouchableOpacity style={[styles.buttons]}>
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
                            <TouchableOpacity onPress={()=>setAlarm('기본')}>
                                <HStack alignItems={'center'}>
                                    <Box style={[{width:21, height:21, borderRadius:21, borderWidth:1, borderColor:'#004375', justifyContent:'center', alignItems:'center', marginRight:10}, alarm == '기본' && {backgroundColor:'#004375'}]}>
                                        {
                                            alarm == '기본' &&
                                           <Image source={require('../images/checkIcons.png')} alt='체크아이콘' style={{width:9, height:6, resizeMode:'contain'}} />
                                        }
                                    </Box>
                                    <DefText text='기본(2시간 전)' />
                                </HStack>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={()=>setAlarm('지정')} style={{marginLeft:20}}>
                                <HStack alignItems={'center'}>
                                    <Box style={[{width:21, height:21, borderRadius:21, borderWidth:1, borderColor:'#004375', justifyContent:'center', alignItems:'center', marginRight:10}, alarm == '지정' && {backgroundColor:'#004375'}]}>
                                        {
                                            alarm == '지정' &&
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
    }
})


export default ScheduleAdd;