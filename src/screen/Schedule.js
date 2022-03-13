import React, {useState, useEffect} from 'react';
import { ScrollView, Platform, Dimensions, StyleSheet, Alert, View, TouchableOpacity } from 'react-native';
import { Box, VStack, HStack, Image, Input } from 'native-base';
import { DefText } from '../common/BOOTSTRAP';
import Font from '../common/Font';
import HeaderHome from '../components/HeaderHome';
import {fsize, fweight, colorSelect, textStyle} from '../common/StyleDef';
import { officeBoard, brandBoard, memoBoard } from '../Utils/DummyData';
import { textLengthOverCut } from '../common/dataFunction';
import {Calendar, CalendarList, Agenda, LocaleConfig} from 'react-native-calendars';

const {width} = Dimensions.get('window');

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
let todayText = today.format('yyyy-MM-dd');
let oneYearLater = new Date(today.setFullYear(today.getFullYear() + 1));
let oneAfter = oneYearLater.format('yyyy-MM-dd');

let count = 0;

// 두개의 날짜를 비교하여 차이를 알려준다.
function dateDiff(_date1, _date2) {
    var diffDate_1 = _date1 instanceof Date ? _date1 : new Date(_date1);
    var diffDate_2 = _date2 instanceof Date ? _date2 : new Date(_date2);
 
    diffDate_1 =new Date(diffDate_1.getFullYear(), diffDate_1.getMonth()+1, diffDate_1.getDate());
    diffDate_2 =new Date(diffDate_2.getFullYear(), diffDate_2.getMonth()+1, diffDate_2.getDate());
 
    var diff = Math.abs(diffDate_2.getTime() - diffDate_1.getTime());
    diff = Math.ceil(diff / (1000 * 3600 * 24));
 
    return diff;
}

const Schedule = (props) => {

    const {navigation} = props;

    LocaleConfig.locales['ko'] = {
        monthNames: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
        monthNamesShort: ['1','2','3','4','5','6','7','8','9','10','11','12'],
        dayNames: ['일요일','월요일', '화요일','수요일','목요일','금요일','토요일'],
        dayNamesShort: ['일', '월','화','수','목','금','토'],
        today: '오늘'
      };
    LocaleConfig.defaultLocale  =  'ko' ;

    const [date, setDate] = useState(todayText);

    const scheduleAdd = (dates) => {
        //console.log('dates' ,dates);
        navigation.navigate('ScheduleAdd', {'startDate' : dates});
    }

    useEffect(()=>{
        console.log('12312312', dateDiff(today, oneYearLater));
    }, [])

    return (
        <Box flex={1} backgroundColor='#fff'>
            <HeaderHome headerTitle='스케줄' />
            <ScrollView>
                <Box px='20px' pb='20px'>
                    <Box backgroundColor={'#fff'} borderRadius={6} shadow={9} mt='20px'>
                        <Calendar
                            style={{borderRadius:15}}
                            current={todayText}
                            minDate={todayText}
                            maxDate={oneAfter}
                            onDayPress={ day => scheduleAdd(day.dateString)}
                            markedDates={{
                                [date] : {selected: true, marked:false, selectedColor: '#4473B8'},
                                //'2022-03-17': {marked: true},
                                //'2022-03-18': {marked: true, dotColor: 'red', activeOpacity: 0},
                                //'2022-03-19': {disabled: true, disableTouchEvent: true}
                            }}
                            monthFormat={'yyyy년 MMMM'}
                            theme = {{
                                selectedDayBackgroundColor : '#4473B8' , 
                                selectedDayTextColor : '#fff',
                                arrowColor: '#000',
                                dayTextColor: '#000',
                                textSectionTitleColor:'#191919',
                                textSectionTitleDisabledColor:'#000',
                                todayTextColor: '#000',
                                textDayFontFamily : Font.NanumSquareRoundR,
                                textMonthFontFamily: Font.NanumSquareRoundR,
                                textDayHeaderFontFamily : Font.NanumSquareRoundR , 
                                textDayFontWeight : '400',
                                textMonthFontWeight: 'bold',
                                textDayHeaderFontWeight : 'bold' , 
                                textDayFontSize : 14 , 
                                textMonthFontSize : 14 , 
                                textDayHeaderFontSize : 14,
                                'stylesheet.calendar.header': {
                                    dayTextAtIndex0: {
                                      color: 'red'
                                    },
                                    dayTextAtIndex6: {
                                      color: 'blue'
                                    }
                                  }

                            }}
                        />
                    </Box>
                    <Box mt='25px'>
                        <DefText text='오늘의 할 일' style={styles.labelTitle} />
                        <TouchableOpacity>
                            <Box p='15px' shadow={9} backgroundColor='#fff' borderRadius={10}>
                                <DefText text='2022.02.08 오전 11시' />
                                <DefText text='홍길동님과 미팅' style={{marginTop:10}} />
                                <DefText text='서울특별시 구로구 구로동 스타벅스' style={{marginTop:10}} />
                            </Box>
                            <Box position={'absolute'} top='50%' right='20px' marginTop='-5px'>
                                <Image source={require('../images/memberInfoArr.png')} alt='회원정보 화살표' style={{width:6, height:10, resizeMode:'contain'}} />
                            </Box>
                        </TouchableOpacity>
                    </Box>
                </Box>
            </ScrollView>
        </Box>
    );
};

const styles = StyleSheet.create({
    labelTitle: {
        fontSize:fsize.fs16,
        ...fweight.eb,
        marginBottom: 15
    }
})

export default Schedule;