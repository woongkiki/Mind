import React, {useState, useEffect} from 'react';
import {
  ScrollView,
  Platform,
  Dimensions,
  StyleSheet,
  Alert,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {Box, VStack, HStack, Image, Input} from 'native-base';
import {DefText} from '../common/BOOTSTRAP';
import Font from '../common/Font';
import HeaderHome from '../components/HeaderHome';
import {fsize, fweight, colorSelect, textStyle} from '../common/StyleDef';
import {officeBoard, brandBoard, memoBoard} from '../Utils/DummyData';
import {textLengthOverCut} from '../common/dataFunction';
import {
  Calendar,
  CalendarList,
  Agenda,
  LocaleConfig,
} from 'react-native-calendars';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';

import {connect} from 'react-redux';
import {actionCreators as UserAction} from '../redux/module/action/UserAction';
import {StackActions} from '@react-navigation/native';
import Api from '../Api';
import _ from 'lodash';
import XDate from 'xdate';

const {width} = Dimensions.get('window');

Date.prototype.format = function (f) {
  if (!this.valueOf()) return ' ';

  var weekName = [
    '일요일',
    '월요일',
    '화요일',
    '수요일',
    '목요일',
    '금요일',
    '토요일',
  ];
  var d = this;

  return f.replace(/(yyyy|yy|MM|dd|E|hh|mm|ss|a\/p)/gi, function ($1) {
    switch ($1) {
      case 'yyyy':
        return d.getFullYear();
      case 'yy':
        return (d.getFullYear() % 1000).zf(2);
      case 'MM':
        return (d.getMonth() + 1).zf(2);
      case 'dd':
        return d.getDate().zf(2);
      case 'E':
        return weekName[d.getDay()];
      case 'HH':
        return d.getHours().zf(2);
      case 'hh':
        return ((h = d.getHours() % 12) ? h : 12).zf(2);
      case 'mm':
        return d.getMinutes().zf(2);
      case 'ss':
        return d.getSeconds().zf(2);
      case 'a/p':
        return d.getHours() < 12 ? '오전' : '오후';
      default:
        return $1;
    }
  });
};

String.prototype.string = function (len) {
  var s = '',
    i = 0;
  while (i++ < len) {
    s += this;
  }
  return s;
};
String.prototype.zf = function (len) {
  return '0'.string(len - this.length) + this;
};
Number.prototype.zf = function (len) {
  return this.toString().zf(len);
};

let today = new Date();
let todayText = today.format('yyyy-MM-dd');
let times = today.format('HH:mm');
let oneYearLater = new Date(today.setFullYear(today.getFullYear() + 1));
let twoYearBefore = new Date(today.setFullYear(today.getFullYear() - 2));
let oneAfter = oneYearLater.format('yyyy-MM-dd');
let twoBefore = twoYearBefore.format('yyyy-MM-dd');

let count = 0;

// 두개의 날짜를 비교하여 차이를 알려준다.
function dateDiff(_date1, _date2) {
  var diffDate_1 = _date1 instanceof Date ? _date1 : new Date(_date1);
  var diffDate_2 = _date2 instanceof Date ? _date2 : new Date(_date2);

  diffDate_1 = new Date(
    diffDate_1.getFullYear(),
    diffDate_1.getMonth() + 1,
    diffDate_1.getDate(),
  );
  diffDate_2 = new Date(
    diffDate_2.getFullYear(),
    diffDate_2.getMonth() + 1,
    diffDate_2.getDate(),
  );

  var diff = Math.abs(diffDate_2.getTime() - diffDate_1.getTime());
  diff = Math.ceil(diff / (1000 * 3600 * 24));

  return diff;
}

const Schedule = props => {
  const {navigation, userInfo, route} = props;
  const {params} = route;

  console.log(params);

  LocaleConfig.locales['ko'] = {
    monthNames: [
      '1월',
      '2월',
      '3월',
      '4월',
      '5월',
      '6월',
      '7월',
      '8월',
      '9월',
      '10월',
      '11월',
      '12월',
    ],
    monthNamesShort: [
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      '10',
      '11',
      '12',
    ],
    dayNames: [
      '일요일',
      '월요일',
      '화요일',
      '수요일',
      '목요일',
      '금요일',
      '토요일',
    ],
    dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
    today: '오늘',
  };
  LocaleConfig.defaultLocale = 'ko';

  const [date, setDate] = useState(todayText);

  const scheduleAdd = dates => {
    //console.log('dates' ,dates);
    navigation.navigate('ScheduleAdd', {startDate: dates});
  };

  //주말 휴일 설정
  const getDisabledWeeks = (startDate, endDate, daysToDisable) => {
    const disabledDates = {};
    const start = new XDate(startDate).addDays(1);
    const end = new XDate(endDate).addDays(1);

    for (let m = new XDate(start); 0 <= m.diffDays(end); m.addDays(1)) {
      if (_.includes(daysToDisable, m.getDay())) {
        disabledDates[m.toString('yyyy-MM-dd')] = {
          customStyles: {
            text: {
              color: 'rgba(255,0,0,0.4)',
            },
          },
          disabled: true,
          disableTouchEvent: true,
        };
      }
    }

    return disabledDates;
  };

  const [scheduleLoading, setScheduleLoading] = useState(true);
  const [scheduleData, setScheduleData] = useState([]);
  const [scheduleAllData, setScheduleAllData] = useState([]);
  const ScheduleReceive = async () => {
    await setScheduleLoading(true);

    await Api.send(
      'schedule_list',
      {idx: userInfo.mb_no, time: times, today: todayText},
      args => {
        let resultItem = args.resultItem;
        let arrItems = args.arrItems;

        if (resultItem.result === 'Y' && arrItems) {
          console.log('스케줄 리스트 결과: ', arrItems);

          setScheduleData(arrItems);
        } else {
          console.log('스케줄 리스트 결과 출력 실패!', resultItem);
        }
      },
    );

    await Api.send(
      'schedule_allList',
      {idx: userInfo.mb_no, wm: params?.wm},
      args => {
        let resultItem = args.resultItem;
        let arrItems = args.arrItems;

        if (resultItem.result === 'Y' && arrItems) {
          console.log('스케줄 전체 리스트 결과: ', resultItem);
          setScheduleAllData(arrItems);
        } else {
          console.log('스케줄 리스트 결과 출력 실패!', resultItem);
        }
      },
    );

    await setScheduleLoading(false);
  };

  useEffect(() => {
    ScheduleReceive();
  }, []);

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      ScheduleReceive();
    }
  }, [isFocused]);

  let textToday = todayText.toString('yyyy-MM-dd');

  const [dateTime, setDateTime] = useState(todayText.toString('yyyy-MM-dd'));
  const [nowDates, setNowDates] = useState({});

  useEffect(() => {
    nowDates[todayText.toString('yyyy-MM-dd')] = {
      selected: true,
      selectedColor: 'blue',
    };
  }, []);

  const [datew, setDateW] = useState('');
  const [selectedDates, setSelectedDates] = useState('');
  const selectDate = date => {
    const dates = {};
    const nowDate = new XDate(date);

    dates[nowDate.toString('yyyy-MM-dd')] = {
      selected: true,
      selectedColor: '#000',
    };

    setDateTime(nowDate.toString('yyyy-MM-dd'));
    //setNowDates(dates);
    setSelectedDates(dates);

    Api.send(
      'scheduleApi_check',
      {
        idx: userInfo.mb_no,
        date: nowDate.toString('yyyy-MM-dd'),
        wm: params?.wm,
      },
      args => {
        let resultItem = args.resultItem;
        let arrItems = args.arrItems;

        if (resultItem.result === 'Y' && arrItems) {
          console.log('스케줄 리스트 결과: ', resultItem);

          // setScheduleData(arrItems);
          setScheduleData(arrItems);
        } else {
          console.log('스케줄 리스트 결과 출력 실패!', resultItem);
          setScheduleData([]);
        }
      },
    );
  };

  const appConnectConfirm = () => {
    Api.send(
      'app_connect',
      {id: userInfo.mb_id, name: userInfo.mb_name},
      args => {
        let resultItem = args.resultItem;
        let arrItems = args.arrItems;

        if (resultItem.result === 'Y' && arrItems) {
          console.log('앱 접속내역 성공: ', resultItem);
        } else {
          console.log('앱 접속내역 실패', resultItem);
        }
      },
    );
  };

  useEffect(() => {
    appConnectConfirm();
  }, [isFocused]);

  return (
    <Box flex={1} backgroundColor="#fff">
      <HeaderHome headerTitle={params?.wm == 'Y' ? 'WM 스케줄' : '스케줄'} />
      {scheduleLoading ? (
        <Box
          flex={1}
          backgroundColor="#fff"
          justifyContent={'center'}
          alignItems="center">
          <ActivityIndicator size={'large'} color="#333" />
        </Box>
      ) : (
        <ScrollView>
          <Box px="20px" pb="20px">
            <Box backgroundColor={'#fff'} borderRadius={6} shadow={9} mt="20px">
              <Calendar
                style={{borderRadius: 15}}
                current={todayText}
                minDate={twoBefore}
                maxDate={oneAfter}
                onDayPress={day => selectDate(day.dateString)}
                markingType={'custom'}
                markedDates={{
                  //[date] : {selected: true, selectedColor: '#4473B8'},
                  ...nowDates,
                  ...scheduleAllData,
                  ...selectedDates,
                  //...getDisabledWeeks(twoYearBefore, oneYearLater, [0]),

                  //'2022-03-17': {marked: true},
                  //'2022-03-18': {marked: true, dotColor: 'red', activeOpacity: 0},
                  //'2022-03-19': {disabled: true, disableTouchEvent: true}
                }}
                monthFormat={'yyyy년 MMMM'}
                theme={{
                  selectedDayBackgroundColor: '#4473B8',
                  selectedDayTextColor: '#fff',
                  arrowColor: '#000',
                  dayTextColor: '#000',
                  textSectionTitleColor: '#191919',
                  textSectionTitleDisabledColor: '#000',
                  todayTextColor: '#000',
                  textDayFontFamily: Font.NanumSquareRoundR,
                  textMonthFontFamily: Font.NanumSquareRoundR,
                  textDayHeaderFontFamily: Font.NanumSquareRoundR,
                  textDayFontWeight: '400',
                  textMonthFontWeight: 'bold',
                  textDayHeaderFontWeight: 'bold',
                  textDayFontSize: 14,
                  textMonthFontSize: 14,
                  textDayHeaderFontSize: 14,
                  'stylesheet.calendar.header': {
                    week: {
                      marginTop: 30,
                      marginHorizontal: 12,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    },
                  },
                }}
              />
            </Box>
            <Box mt="25px">
              <HStack
                alignItems={'center'}
                justifyContent={'space-between'}
                mb="15px">
                {todayText == dateTime ? (
                  <DefText
                    text={'오늘의 할 일'}
                    style={[styles.labelTitle, {marginBottom: 0}]}
                  />
                ) : (
                  <DefText
                    text={dateTime + ' 일정'}
                    style={[styles.labelTitle, {marginBottom: 0}]}
                  />
                )}
                {todayText <= dateTime && params.wm == '' && (
                  <TouchableOpacity onPress={() => scheduleAdd(dateTime)}>
                    <Image
                      source={require('../images/memoAdd.png')}
                      alt="설계사 메모 추가"
                      style={[{width: 18, height: 18, resizeMode: 'contain'}]}
                    />
                  </TouchableOpacity>
                )}
              </HStack>

              {scheduleData != '' && scheduleData.length > 0 ? (
                scheduleData.map((item, index) => {
                  return (
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate('ScheduleInfo', {idx: item.wr_id})
                      }
                      key={index}
                      style={
                        scheduleData.length != index + 1
                          ? {marginBottom: 15}
                          : {marginBottom: 0}
                      }>
                      <Box
                        p="15px"
                        shadow={9}
                        backgroundColor="#fff"
                        borderRadius={10}>
                        <Box width="90%">
                          <DefText
                            text={
                              item.wr_1 +
                              ' ' +
                              item.wr_2 +
                              ' (' +
                              item.categorys +
                              ')'
                            }
                          />
                          <DefText
                            text={item.wr_subject}
                            style={{marginTop: 10}}
                          />
                          {item.wr_addr1 != '' && (
                            <HStack>
                              <DefText
                                text={item.wr_addr1}
                                style={{marginTop: 10}}
                              />
                              {item.wr_addr2 != '' && (
                                <DefText
                                  text={' ' + item.wr_addr2}
                                  style={{marginTop: 10}}
                                />
                              )}
                            </HStack>
                          )}
                        </Box>
                      </Box>
                      <Box
                        position={'absolute'}
                        top="50%"
                        right="20px"
                        marginTop="-5px">
                        <Image
                          source={require('../images/memberInfoArr.png')}
                          alt="회원정보 화살표"
                          style={{width: 6, height: 10, resizeMode: 'contain'}}
                        />
                      </Box>
                    </TouchableOpacity>
                  );
                })
              ) : (
                <Box alignItems={'center'} py="40px">
                  <DefText text="등록된 스케줄이 없습니다." />
                </Box>
              )}
            </Box>
          </Box>
        </ScrollView>
      )}
    </Box>
  );
};

const styles = StyleSheet.create({
  labelTitle: {
    fontSize: fsize.fs16,
    ...fweight.eb,
    marginBottom: 15,
  },
});

export default connect(
  ({User}) => ({
    userInfo: User.userInfo, //회원정보
  }),
  dispatch => ({
    member_login: user => dispatch(UserAction.member_login(user)), //로그인
    member_info: user => dispatch(UserAction.member_info(user)), //회원 정보 조회
  }),
)(Schedule);
