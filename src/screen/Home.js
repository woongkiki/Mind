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
  Linking,
} from 'react-native';
import {Box, VStack, HStack, Image, Input, Modal} from 'native-base';
import {DefText, SubmitButtons} from '../common/BOOTSTRAP';
import Font from '../common/Font';
import HeaderMain from '../components/HeaderMain';
import {Shadow, Neomorph, NeomorphBlur} from 'react-native-neomorph-shadows';
import {fsize, fweight, colorSelect, textStyle} from '../common/StyleDef';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import {menus} from '../Utils/DummyData';
import {connect} from 'react-redux';
import {actionCreators as UserAction} from '../redux/module/action/UserAction';
import {StackActions} from '@react-navigation/native';
import Api from '../Api';
import ToastMessage from '../components/ToastMessage';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import VersionCheck from 'react-native-version-check';

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
let todayTime = today.format('HH:mm');

const {width} = Dimensions.get('window');

//console.log('123',todayText2);

const Home = props => {
  const {navigation, userInfo} = props;

  const isFocused = useIsFocused();

  //console.log(userInfo);
  const [updateModal, setUpdateModal] = useState(false);
  const [storeVesion, setStoreVersion] = useState('');
  const [appVersion, setAppVersion] = useState('');

  const versionCheckHandler = () => {
    //스토어 버전
    VersionCheck.getLatestVersion({
      provider: Platform.OS === 'ios' ? 'appStore' : 'playStore', // for iOS
    }).then(latestVersion => {
      console.log(Platform.OS + 'latestVersion::::', latestVersion); // 0.1.2

      if (latestVersion != undefined) setStoreVersion(latestVersion);
    });

    //앱 버전
    console.log(VersionCheck.getCurrentVersion());
    setAppVersion(VersionCheck.getCurrentVersion());
  };

  // useEffect(() => {
  //   if (isFocused) {
  //     versionCheckHandler();
  //   }
  // }, [isFocused]);

  useEffect(() => {
    if (storeVesion != '' && appVersion != '') {
      console.log('appVersion', appVersion);
      console.log('storeVesion', storeVesion);
      if (appVersion != storeVesion) {
        setUpdateModal(true);
      }
    }
    //console.log('getCurrentVersion:::', VersionCheck.getCurrentVersion());
  }, [isFocused, storeVesion, appVersion]);

  const appUpdateHandler = () => {
    Api.send('url_list', {}, args => {
      let resultItem = args.resultItem;
      let arrItems = args.arrItems;

      if (resultItem.result === 'Y' && arrItems) {
        console.log('앱 업데이트 url: ', arrItems);

        if (arrItems != '') {
          Linking.openURL(
            Platform.OS === 'ios' ? arrItems.ios : arrItems.android,
          );
        }
      } else {
        console.log('앱 업데이트 url 실패', resultItem);
      }
    });
  };

  const dbMove = () => {
    navigation.navigate('Tab_Navigation', {
      screen: 'Db',
    });
  };

  const scheduleMove = () => {
    navigation.navigate('Tab_Navigation', {
      screen: 'Schedule',
      params: {wm: ''},
    });
  };

  const communicationMove = () => {
    navigation.navigate('Tab_Navigation', {
      screen: 'Comunication',
    });
  };

  const [allDB, setAllDB] = useState('');
  const [useDB, setUseDB] = useState('');
  const [dbPercent, setDBPercent] = useState('');

  const [meetingCnt, setMeetingCnt] = useState('');
  const [contractCnt, setContractCnt] = useState('');

  const [alram, setAlram] = useState([]);
  const [allAlram, setAllAlram] = useState(0); //총 카운트 수
  const [alarmCnt, setAlarmCnt] = useState(4);

  const [dbHomeLoading, setDBHomeLoading] = useState(true);
  const [selectMenu, setSelectMenu] = useState([]);

  const [nowDates, setNowDates] = useState('');
  const [dateOnes, setDateOnes] = useState('');

  const homeApi = async () => {
    await Api.send(
      'dbNew_useLists',
      {idx: userInfo.mb_no, date1: dateOnes, date2: nowDates},
      args => {
        let resultItem = args.resultItem;
        let arrItems = args.arrItems;

        if (resultItem.result === 'Y' && arrItems) {
          //console.log('api 결과: ', resultItem);

          setAllDB(arrItems.total); //DB 총 개수
          setUseDB(arrItems.totalno); // 사용 DB
          setDBPercent(arrItems.dbPercent); //퍼센트
          //console.log('totals:::::',arrItems.totalno)
          //setDbUseData()
        } else {
          //console.log('db 카운트 및 사용 결과 출력 실패!', resultItem);
        }
      },
    );

    //미팅완료 정보
    await Api.send(
      'dbNew_meetingCom',
      {idx: userInfo.mb_no, date1: dateOnes, date2: nowDates},
      args => {
        let resultItem = args.resultItem;
        let arrItems = args.arrItems;

        if (resultItem.result === 'Y' && arrItems) {
          //console.log('미팅완료 수 결과: ', arrItems, resultItem);
          setMeetingCnt(arrItems);
        } else {
          //console.log('미팅완료 결과 출력 실패!', resultItem);
          setMeetingCnt('');
        }
      },
    );

    //청약완료 정보
    await Api.send(
      'dbNew_contractCom',
      {idx: userInfo.mb_no, date1: dateOnes, date2: nowDates},
      args => {
        let resultItem = args.resultItem;
        let arrItems = args.arrItems;

        if (resultItem.result === 'Y' && arrItems) {
          //console.log('청약완료 수 결과: ', resultItem);
          //setMeetingCnt(arrItems);
          setContractCnt(arrItems);
        } else {
          // console.log('청약완료 결과 출력 실패!', resultItem);
          setContractCnt('');
        }
      },
    );

    Api.send(
      'db_alarm',
      {idx: userInfo.mb_no, date: todayText, time: todayTime, limit: alarmCnt},
      args => {
        let resultItem = args.resultItem;
        let arrItems = args.arrItems;

        if (resultItem.result === 'Y' && arrItems) {
          //console.log('알림 결과: ', resultItem, arrItems);
          setAlram(arrItems);
        } else {
          // console.log('알림 결과 출력 실패!', resultItem);
        }
      },
    );

    //알림
    await Api.send(
      'db_alarmCnt',
      {idx: userInfo.mb_no, date: todayText, time: todayTime},
      args => {
        let resultItem = args.resultItem;
        let arrItems = args.arrItems;

        if (resultItem.result === 'Y' && arrItems) {
          //console.log('알림 카운트 결과: ', resultItem, arrItems);
          setAllAlram(arrItems);
        } else {
          //console.log('알림 카운트 결과 출력 실패!', resultItem);
        }
      },
    );
  };

  const dbuse = async () => {
    await setDBHomeLoading(true);

    await Api.send('dbNew_nowDate', {idx: userInfo.mb_no}, args => {
      let resultItem = args.resultItem;
      let arrItems = args.arrItems;

      if (resultItem.result === 'Y' && arrItems) {
        //console.log('현재 시간 출력: ', arrItems);

        setNowDates(arrItems.dateNow);
        setDateOnes(arrItems.dateOne);

        // if(arrItems != ""){
        //     homeApi();
        // }
      } else {
        //console.log('현재 시간 출력 출력 실패!', resultItem);
      }
    });

    //알림
    //await alarmHandler();

    await Api.send('menu_list', {idx: userInfo.mb_no}, args => {
      let resultItem = args.resultItem;
      let arrItems = args.arrItems;

      if (resultItem.result === 'Y' && arrItems) {
        // console.log('자주사용하는 메뉴 결과: ', resultItem, arrItems);
        setSelectMenu(arrItems);
        setMenuSelectArr(arrItems.menu);
        setMenuScreenArr(arrItems.screen);
      } else {
        // console.log('자주사용하는 메뉴 실패!', resultItem);
      }
    });

    await setDBHomeLoading(false);
  };

  const limitHandler = () => {
    setAlarmCnt(alarmCnt * 1 + allAlram * 1);
  };

  useEffect(() => {
    //console.log('123123', alarmCnt);
    dbuse();
  }, [alarmCnt]);

  useEffect(() => {
    if (isFocused) {
      if (nowDates != '' && dateOnes != '') {
        homeApi();
      }
    }
  }, [nowDates, dateOnes, isFocused]);

  // useEffect(()=>{
  //     if(isFocused){
  //         dbuse();
  //     }
  // }, [isFocused]);

  const [useMenu, setUseMenu] = useState(false);
  const [menuSelectArr, setMenuSelectArr] = useState([]);
  const [menuScreenArr, setMenuScreenArr] = useState([]);
  const menuSelect = (cate, screen) => {
    if (!menuSelectArr.includes(cate)) {
      if (menuSelectArr.length == 4) {
        Alert.alert('메뉴는 4개까지 선택가능합니다.');
        return false;
      }

      setMenuSelectArr([...menuSelectArr, cate]);
    } else {
      const categoryFilter = menuSelectArr.filter((e, index) => {
        return e !== cate;
      });
      setMenuSelectArr(categoryFilter);
    }

    if (!menuScreenArr.includes(screen)) {
      if (menuScreenArr.length == 4) {
        Alert.alert('메뉴는 4개까지 선택가능합니다.');
        return false;
      }

      setMenuScreenArr([...menuScreenArr, screen]);
    } else {
      const categoryFilterSc = menuScreenArr.filter((e, index) => {
        return e !== screen;
      });
      setMenuScreenArr(categoryFilterSc);
    }
  };

  // useEffect(()=>{
  //     console.log('선택된 메뉴', menuSelectArr);
  //     console.log('선택된 메뉴스크린', menuScreenArr);
  // }, [menuSelectArr, menuScreenArr]);

  const useMemuSend = () => {
    let menus = menuSelectArr.join('^');
    let menusScreen = menuScreenArr.join('^');

    Api.send(
      'menu_send',
      {
        midx: userInfo.mb_no,
        mb_id: userInfo.mb_id,
        menus: menus,
        screen: menusScreen,
      },
      args => {
        let resultItem = args.resultItem;
        let arrItems = args.arrItems;

        if (resultItem.result === 'Y' && arrItems) {
          console.log('자주 사용하는 메뉴 등록: ', resultItem);
          setUseMenu(false);
          ToastMessage(resultItem.message);
          dbuse();
        } else {
          console.log('자주 사용하는 메뉴 등록 오류!', resultItem);
        }
      },
    );
  };

  const [dateSettingModal, setDateSettingModal] = useState(false);
  //시작일
  const [startDateModal, setStartDateModal] = useState(false);
  const [startDate, setStartDate] = useState('');
  const startDateHandler = date => {
    startDataModalClose();
    console.log('시작일 선택 날짜', date.format('yyyy-MM-dd'));
    setStartDate(date.format('yyyy-MM-dd'));
  };

  const startDataModalClose = () => {
    setStartDateModal(false);
  };

  //마지막 일
  const [endDateModal, setEndDateModal] = useState(false);
  const [endDate, setEndDate] = useState('');
  const endDateHandler = date => {
    endDateModalClose();
    setEndDate(date.format('yyyy-MM-dd'));
  };
  const endDateModalClose = () => {
    setEndDateModal(false);
  };

  const dateChange = () => {
    console.log(startDate);
    if (startDate == '') {
      Alert.alert('시작일을 선택하세요.');
      return false;
    }

    if (endDate == '') {
      Alert.alert('마지막일을 선택하세요.');
      return false;
    }

    setDateOnes(startDate);
    setNowDates(endDate);

    setDateSettingModal(false);
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

  useEffect(() => {
    //console.log("dateOnes, nowDates",dateOnes, nowDates);
    homeApi();
  }, [dateOnes, nowDates]);

  return (
    <Box flex={1} backgroundColor="#fff">
      <HeaderMain headerTitle="홈" navigation={navigation} />
      {dbHomeLoading ? (
        <Box flex={1} justifyContent="center" alignItems={'center'}>
          <ActivityIndicator size="large" color="#333" />
        </Box>
      ) : (
        <ScrollView>
          <Box pb="20px">
            <Shadow
              style={{
                shadowOffset: {width: 0, height: 15},
                shadowOpacity: 0.16,
                shadowColor: '#4473B8',
                shadowRadius: 10,
                borderRadius: 0,
                backgroundColor: '#fff',
                width: width,
                height: 150,
                justifyContent: 'center',
                // ...include most of View/Layout styles
              }}>
              <Box px="20px" justifyContent={'space-between'}>
                <HStack alignItems={'center'} mb="15px">
                  {/* <DefText text={ nowDates != '' ? nowDates : '-'} style={[styles.dateText]} /> */}
                  {nowDates != '' && (
                    <HStack alignItems={'center'}>
                      <DefText text={dateOnes} style={[styles.dateText]} />
                      <DefText text={' ~ '} style={[styles.dateText]} />
                      <DefText text={nowDates} style={[styles.dateText]} />
                    </HStack>
                  )}

                  <TouchableOpacity onPress={() => setDateSettingModal(true)}>
                    <Image
                      source={require('../images/refreshIcon.png')}
                      alt="새로고침"
                      style={{
                        width: 20,
                        height: 20,
                        resizeMode: 'contain',
                        marginLeft: 10,
                      }}
                    />
                  </TouchableOpacity>
                </HStack>
                <Box mb="15px">
                  <HStack
                    alignItems={'center'}
                    justifyContent="space-between"
                    flexWrap={'wrap'}>
                    <Box width={'20%'}>
                      <DefText text="사용 고객" style={[styles.alarmText]} />
                    </Box>
                    <HStack width={'80%'}>
                      <Box
                        justifyContent={'center'}
                        backgroundColor={'#EFEFEF'}
                        borderRadius={3}
                        width="80%">
                        <Box
                          width={dbPercent != 0 ? dbPercent + '%' : '0%'}
                          height="15px"
                          backgroundColor={'#4473B8'}
                          justifyContent="center"
                          alignItems={'center'}
                          style={[styles.alarmGage]}>
                          <DefText
                            text={dbPercent != 0 ? dbPercent + '%' : '0%'}
                            style={{fontSize: 12, color: '#fff'}}
                          />
                        </Box>
                      </Box>
                      <Box alignItems={'flex-end'} width="20%">
                        <HStack>
                          <DefText
                            text={useDB != '' ? useDB : 0}
                            style={[styles.alarmNumber, {color: '#4473B8'}]}
                          />
                          <DefText text=" / " style={[styles.alarmNumber]} />
                          <DefText
                            text={allDB != '' ? allDB : 0}
                            style={[styles.alarmNumber]}
                          />
                        </HStack>
                      </Box>
                    </HStack>
                  </HStack>
                </Box>
                <Box mb="15px">
                  <HStack
                    alignItems={'center'}
                    justifyContent="space-between"
                    flexWrap={'wrap'}>
                    <Box width={'20%'}>
                      <DefText text="미팅 완료" style={[styles.alarmText]} />
                    </Box>
                    <HStack width={'80%'}>
                      <Box justifyContent={'center'} width="80%">
                        <HStack justifyContent={'space-between'}>
                          <Box
                            width="8%"
                            backgroundColor={
                              meetingCnt >= 1 ? colorSelect.blue : '#efefef'
                            }
                            borderRadius={3}
                            height="15px"
                          />
                          <Box
                            width="8%"
                            backgroundColor={
                              meetingCnt >= 2 ? colorSelect.blue : '#efefef'
                            }
                            borderRadius={3}
                            height="15px"
                          />
                          <Box
                            width="8%"
                            backgroundColor={
                              meetingCnt >= 3 ? colorSelect.blue : '#efefef'
                            }
                            borderRadius={3}
                            height="15px"
                          />
                          <Box
                            width="8%"
                            backgroundColor={
                              meetingCnt >= 4 ? colorSelect.blue : '#efefef'
                            }
                            borderRadius={3}
                            height="15px"
                          />
                          <Box
                            width="8%"
                            backgroundColor={
                              meetingCnt >= 5 ? colorSelect.blue : '#efefef'
                            }
                            borderRadius={3}
                            height="15px"
                          />
                          <Box
                            width="8%"
                            backgroundColor={
                              meetingCnt >= 6 ? colorSelect.blue : '#efefef'
                            }
                            borderRadius={3}
                            height="15px"
                          />
                          <Box
                            width="8%"
                            backgroundColor={
                              meetingCnt >= 7 ? colorSelect.blue : '#efefef'
                            }
                            borderRadius={3}
                            height="15px"
                          />
                          <Box
                            width="8%"
                            backgroundColor={
                              meetingCnt >= 8 ? colorSelect.blue : '#efefef'
                            }
                            borderRadius={3}
                            height="15px"
                          />
                          <Box
                            width="8%"
                            backgroundColor={
                              meetingCnt >= 9 ? colorSelect.blue : '#efefef'
                            }
                            borderRadius={3}
                            height="15px"
                          />
                          <Box
                            width="8%"
                            backgroundColor={
                              meetingCnt == 10 ? colorSelect.blue : '#efefef'
                            }
                            borderRadius={3}
                            height="15px"
                          />
                        </HStack>
                      </Box>
                      <Box alignItems={'flex-end'} width="20%">
                        <HStack>
                          <DefText
                            text={meetingCnt != '' ? meetingCnt : 0}
                            style={[styles.alarmNumber, {color: '#4473B8'}]}
                          />
                          <DefText text=" / " style={[styles.alarmNumber]} />
                          <DefText
                            text={allDB ? allDB : 0}
                            style={[styles.alarmNumber]}
                          />
                        </HStack>
                      </Box>
                    </HStack>
                  </HStack>
                </Box>
                <Box>
                  <HStack
                    alignItems={'center'}
                    justifyContent="space-between"
                    flexWrap={'wrap'}>
                    <Box width={'20%'}>
                      <DefText text="청약 완료" style={[styles.alarmText]} />
                    </Box>
                    <HStack width={'80%'}>
                      <Box justifyContent={'center'} width="80%">
                        <HStack justifyContent={'space-between'}>
                          <Box
                            width="8%"
                            backgroundColor={
                              contractCnt >= 1 ? colorSelect.blue : '#efefef'
                            }
                            borderRadius={3}
                            height="15px"
                          />
                          <Box
                            width="8%"
                            backgroundColor={
                              contractCnt >= 2 ? colorSelect.blue : '#efefef'
                            }
                            borderRadius={3}
                            height="15px"
                          />
                          <Box
                            width="8%"
                            backgroundColor={
                              contractCnt >= 3 ? colorSelect.blue : '#efefef'
                            }
                            borderRadius={3}
                            height="15px"
                          />
                          <Box
                            width="8%"
                            backgroundColor={
                              contractCnt >= 4 ? colorSelect.blue : '#efefef'
                            }
                            borderRadius={3}
                            height="15px"
                          />
                          <Box
                            width="8%"
                            backgroundColor={
                              contractCnt >= 5 ? colorSelect.blue : '#efefef'
                            }
                            borderRadius={3}
                            height="15px"
                          />
                          <Box
                            width="8%"
                            backgroundColor={
                              contractCnt >= 6 ? colorSelect.blue : '#efefef'
                            }
                            borderRadius={3}
                            height="15px"
                          />
                          <Box
                            width="8%"
                            backgroundColor={
                              contractCnt >= 7 ? colorSelect.blue : '#efefef'
                            }
                            borderRadius={3}
                            height="15px"
                          />
                          <Box
                            width="8%"
                            backgroundColor={
                              contractCnt >= 8 ? colorSelect.blue : '#efefef'
                            }
                            borderRadius={3}
                            height="15px"
                          />
                          <Box
                            width="8%"
                            backgroundColor={
                              contractCnt >= 9 ? colorSelect.blue : '#efefef'
                            }
                            borderRadius={3}
                            height="15px"
                          />
                          <Box
                            width="8%"
                            backgroundColor={
                              contractCnt == 10 ? colorSelect.blue : '#efefef'
                            }
                            borderRadius={3}
                            height="15px"
                          />
                        </HStack>
                      </Box>
                      <Box alignItems={'flex-end'} width="20%">
                        <HStack>
                          <DefText
                            text={contractCnt != '' ? contractCnt : 0}
                            style={[styles.alarmNumber, {color: '#4473B8'}]}
                          />
                          <DefText text=" / " style={[styles.alarmNumber]} />
                          <DefText
                            text={allDB ? allDB : 0}
                            style={[styles.alarmNumber]}
                          />
                        </HStack>
                      </Box>
                    </HStack>
                  </HStack>
                </Box>
              </Box>
            </Shadow>
            <Box px="20px">
              <Box mt="30px">
                <DefText
                  text="알림"
                  style={[textStyle.labelTitle, fweight.b, {marginBottom: 15}]}
                />
                <VStack>
                  {alram != '' && alram.length > 0 ? (
                    alram.map((item, index) => {
                      function navigateGoGo() {
                        if (item.screen == 'AllClient') {
                          navigation.navigate('AllClient', {
                            startDate: '',
                            endDate: '',
                            progressStatus: [],
                            category: '미열람',
                          });
                        }

                        if (item.screen == 'Scehdule') {
                          navigation.navigate('Tab_Navigation', {
                            screen: 'Schedule',
                          });
                        }
                      }

                      return (
                        <TouchableOpacity
                          style={{marginBottom: 10}}
                          key={index}
                          onPress={() => navigateGoGo()}>
                          <HStack
                            alignItems={'center'}
                            p="15px"
                            borderRadius={5}
                            borderWidth={1}
                            borderColor="#D0DAE1"
                            flexWrap={'wrap'}>
                            <Box width="90%">
                              <DefText
                                text={item.text}
                                style={[styles.noticeText]}
                              />
                            </Box>
                          </HStack>
                        </TouchableOpacity>
                      );
                    })
                  ) : (
                    <Box py="40px" alignItems={'center'}>
                      <DefText text="알림이 없습니다." />
                    </Box>
                  )}
                </VStack>
                {alarmCnt < allAlram && (
                  <TouchableOpacity
                    onPress={() => limitHandler()}
                    style={[
                      {
                        height: 20,
                        backgroundColor: '#D0DAE1',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderBottomLeftRadius: 5,
                        borderBottomRightRadius: 5,
                      },
                    ]}>
                    <Image
                      source={require('../images/noticeMore.png')}
                      alt="더보기"
                      style={{width: 15, height: 9, resizeMode: 'contain'}}
                    />
                  </TouchableOpacity>
                )}
              </Box>
              <HStack py="30px" justifyContent={'space-around'}>
                <HStack>
                  <TouchableOpacity
                    style={[styles.menuButton]}
                    onPress={dbMove}
                    // onPress={() =>
                    //   navigation.navigate('ClientInfo', {idx: '20610'})
                    // }
                  >
                    <Image
                      source={require('../images/homeDBIcon.png')}
                      alt="가망고객"
                      style={{width: 34, height: 34, resizeMode: 'contain'}}
                    />
                    <DefText text="가망고객" style={[styles.menuButtonText]} />
                  </TouchableOpacity>
                </HStack>
                <HStack>
                  <TouchableOpacity
                    style={[styles.menuButton]}
                    onPress={scheduleMove}>
                    <Image
                      source={require('../images/homeScheduleIcon.png')}
                      alt="스케줄"
                      style={{width: 34, height: 34, resizeMode: 'contain'}}
                    />
                    <DefText text="스케줄" style={[styles.menuButtonText]} />
                  </TouchableOpacity>
                </HStack>
                <HStack>
                  <TouchableOpacity
                    style={[styles.menuButton]}
                    onPress={communicationMove}>
                    <Image
                      source={require('../images/homeComuIcon.png')}
                      alt="커뮤니케이션"
                      style={{width: 34, height: 34, resizeMode: 'contain'}}
                    />
                    <DefText text="hot line" style={[styles.menuButtonText]} />
                  </TouchableOpacity>
                </HStack>
                <HStack>
                  <TouchableOpacity
                    style={[styles.menuButton]}
                    onPress={() => navigation.navigate('EducationList')}>
                    <Image
                      source={require('../images/homeEducationIcon.png')}
                      alt="교육"
                      style={{width: 34, height: 34, resizeMode: 'contain'}}
                    />
                    <DefText text="교육" style={[styles.menuButtonText]} />
                  </TouchableOpacity>
                </HStack>
              </HStack>
              <Box>
                <HStack
                  alignItems={'center'}
                  justifyContent="space-between"
                  mb="15px">
                  <DefText
                    text="자주 사용하는 메뉴"
                    style={[textStyle.labelTitle, fweight.b]}
                  />
                  <TouchableOpacity
                    onPress={() => setUseMenu(true)}
                    style={[
                      {
                        paddingHorizontal: 10,
                        paddingVertical: 5,
                        backgroundColor: colorSelect.blue,
                        borderRadius: 5,
                      },
                    ]}>
                    <DefText text={'변경'} style={[{color: '#fff'}]} />
                  </TouchableOpacity>
                </HStack>
                <HStack flexWrap={'wrap'} justifyContent="space-between">
                  {selectMenu != '' && selectMenu.menu[0] ? (
                    <TouchableOpacity
                      onPress={() => navigation.navigate(selectMenu.screen[0])}
                      //onLongPress={()=>setUseMenu(true)}
                      style={[
                        styles.useButton,
                        {
                          backgroundColor: colorSelect.orange,
                          borderStyle: 'solid',
                          borderWidth: 0,
                        },
                      ]}>
                      <DefText
                        text={selectMenu.menu[0]}
                        style={{color: colorSelect.white}}
                      />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      onPress={() => setUseMenu(true)}
                      style={[styles.useButton]}>
                      <Image
                        source={require('../images/useMenuIcon.png')}
                        alt="메뉴 추가"
                        style={{width: 14, height: 14, resizeMode: 'contain'}}
                      />
                    </TouchableOpacity>
                  )}
                  {selectMenu != '' && selectMenu.menu[1] ? (
                    <TouchableOpacity
                      onPress={() => navigation.navigate(selectMenu.screen[1])}
                      //onLongPress={()=>setUseMenu(true)}
                      style={[
                        styles.useButton,
                        {
                          backgroundColor: colorSelect.orange,
                          borderStyle: 'solid',
                          borderWidth: 0,
                        },
                      ]}>
                      <DefText
                        text={selectMenu.menu[1]}
                        style={{color: colorSelect.white}}
                      />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      onPress={() => setUseMenu(true)}
                      style={[styles.useButton]}>
                      <Image
                        source={require('../images/useMenuIcon.png')}
                        alt="메뉴 추가"
                        style={{width: 14, height: 14, resizeMode: 'contain'}}
                      />
                    </TouchableOpacity>
                  )}
                  {selectMenu != '' && selectMenu.menu[2] ? (
                    <TouchableOpacity
                      onPress={() => navigation.navigate(selectMenu.screen[2])}
                      //onLongPress={()=>setUseMenu(true)}
                      style={[
                        styles.useButton,
                        {
                          backgroundColor: colorSelect.orange,
                          borderStyle: 'solid',
                          borderWidth: 0,
                        },
                      ]}>
                      <DefText
                        text={selectMenu.menu[2]}
                        style={{color: colorSelect.white}}
                      />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      onPress={() => setUseMenu(true)}
                      style={[styles.useButton]}>
                      <Image
                        source={require('../images/useMenuIcon.png')}
                        alt="메뉴 추가"
                        style={{width: 14, height: 14, resizeMode: 'contain'}}
                      />
                    </TouchableOpacity>
                  )}
                  {selectMenu != '' && selectMenu.menu[3] ? (
                    <TouchableOpacity
                      onPress={() => navigation.navigate(selectMenu.screen[3])}
                      //onLongPress={()=>setUseMenu(true)}
                      style={[
                        styles.useButton,
                        {
                          backgroundColor: colorSelect.orange,
                          borderStyle: 'solid',
                          borderWidth: 0,
                        },
                      ]}>
                      <DefText
                        text={selectMenu.menu[3]}
                        style={{color: colorSelect.white}}
                      />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      onPress={() => setUseMenu(true)}
                      style={[styles.useButton]}>
                      <Image
                        source={require('../images/useMenuIcon.png')}
                        alt="메뉴 추가"
                        style={{width: 14, height: 14, resizeMode: 'contain'}}
                      />
                    </TouchableOpacity>
                  )}
                </HStack>
              </Box>
            </Box>
          </Box>
        </ScrollView>
      )}
      <Modal
        isOpen={dateSettingModal}
        onClose={() => setDateSettingModal(false)}>
        <Modal.Content
          style={{
            width: Dimensions.get('screen').width - 40,
            minWidth: Dimensions.get('screen').width - 40,
            maxWidth: Dimensions.get('screen').width - 40,
          }}
          p="20px">
          <Modal.Body p="0">
            <HStack justifyContent={'space-between'}>
              <Box style={[styles.dateBox]}>
                <DefText text="시작일" />
                <TouchableOpacity
                  style={[styles.dateButton]}
                  onPress={() => setStartDateModal(true)}>
                  <HStack justifyContent={'space-between'} alignItems="center">
                    <DefText
                      text={
                        startDate != '' ? startDate : '날짜를 선택해주세요.'
                      }
                      style={[{fontSize: fsize.fs12}]}
                    />
                    <Image
                      source={require('../images/dateInputArr.png')}
                      alt="날짜 화살표"
                      style={{width: 10, resizeMode: 'contain'}}
                    />
                  </HStack>
                </TouchableOpacity>
              </Box>
              <Box style={[styles.dateBox]}>
                <DefText text="마지막일" />
                <TouchableOpacity
                  style={[styles.dateButton]}
                  onPress={() => setEndDateModal(true)}>
                  <HStack justifyContent={'space-between'} alignItems="center">
                    <DefText
                      text={endDate != '' ? endDate : '날짜를 선택해주세요.'}
                      style={[{fontSize: fsize.fs12}]}
                    />
                    <Image
                      source={require('../images/dateInputArr.png')}
                      alt="날짜 화살표"
                      style={{width: 10, resizeMode: 'contain'}}
                    />
                  </HStack>
                </TouchableOpacity>
              </Box>
            </HStack>
            <TouchableOpacity
              onPress={dateChange}
              style={[
                {
                  width: width - 80,
                  height: 40,
                  backgroundColor: colorSelect.blue,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 5,
                  marginTop: 15,
                },
              ]}>
              <DefText text="시간설정" style={{color: '#fff'}} />
            </TouchableOpacity>
          </Modal.Body>
        </Modal.Content>
      </Modal>
      <DateTimePickerModal
        isVisible={startDateModal}
        mode="date"
        onConfirm={startDateHandler}
        onCancel={startDataModalClose}
      />
      <DateTimePickerModal
        isVisible={endDateModal}
        mode="date"
        onConfirm={endDateHandler}
        onCancel={endDateModalClose}
        maximumDate={new Date()}
      />
      <Modal isOpen={useMenu} onClose={() => setUseMenu(false)}>
        <Modal.Content
          style={{
            width: Dimensions.get('screen').width - 40,
            minWidth: Dimensions.get('screen').width - 40,
            maxWidth: Dimensions.get('screen').width - 40,
          }}>
          <Modal.Body>
            <DefText
              text="메뉴를 선택하세요."
              style={[styles.infoTitle, {color: colorSelect.black}, fweight.eb]}
            />
            <HStack flexWrap={'wrap'}>
              {menus.map((item, index) => {
                return (
                  <TouchableOpacity
                    onPress={() => menuSelect(item.name, item.screen)}
                    key={index}
                    style={[
                      {
                        width: (width - 80) * 0.3,
                        backgroundColor: colorSelect.gray,
                        marginRight: (width - 80) * 0.03,
                        marginTop: 15,
                        height: 40,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 5,
                      },
                      menuSelectArr.includes(item.name) && {
                        backgroundColor: colorSelect.orange,
                      },
                      (index + 1) % 3 == 0 && {marginRight: 0},
                    ]}>
                    <DefText
                      text={item.name}
                      style={[
                        menuSelectArr.includes(item.name) && {
                          color: colorSelect.white,
                        },
                      ]}
                    />
                  </TouchableOpacity>
                );
              })}
            </HStack>
            <HStack justifyContent={'space-between'}>
              <SubmitButtons
                btnText={'확인'}
                buttonStyle={{
                  width: (width - 80) * 0.47,
                  height: 40,
                  borderRadius: 5,
                  marginTop: 15,
                }}
                btnTextStyle={{fontSize: fsize.fs14}}
                onPress={useMemuSend}
              />
              <SubmitButtons
                btnText={'취소'}
                buttonStyle={{
                  width: (width - 80) * 0.47,
                  height: 40,
                  borderRadius: 5,
                  marginTop: 15,
                  backgroundColor: colorSelect.gray,
                }}
                btnTextStyle={{fontSize: fsize.fs14}}
                onPress={() => setUseMenu(false)}
              />
            </HStack>
          </Modal.Body>
        </Modal.Content>
      </Modal>
      <Modal isOpen={updateModal}>
        <Modal.Content
          p="0"
          style={{
            width: Dimensions.get('screen').width - 40,
            minWidth: Dimensions.get('screen').width - 40,
            maxWidth: Dimensions.get('screen').width - 40,
          }}
          backgroundColor={'#fff'}>
          <Modal.Body p="20px">
            <DefText
              text={
                '최신버전이 출시되었습니다.\n지금 바로 업데이트 하시겠습니까?'
              }
              style={[
                fweight.b,
                {fontSize: fsize.fs16, textAlign: 'center', lineHeight: 24},
              ]}
            />
            <HStack justifyContent={'space-between'}>
              <TouchableOpacity
                onPress={() => setUpdateModal(false)}
                style={[
                  styles.updateButton,
                  {width: (width - 80) * 0.25, backgroundColor: '#fff'},
                ]}>
                <DefText
                  text={'취소'}
                  style={[styles.updateButtonText, {color: colorSelect.gray}]}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={appUpdateHandler}
                style={[styles.updateButton]}>
                <DefText text={'확인'} style={[styles.updateButtonText]} />
              </TouchableOpacity>
            </HStack>
          </Modal.Body>
        </Modal.Content>
      </Modal>
    </Box>
  );
};

const styles = StyleSheet.create({
  updateButton: {
    width: (width - 80) * 0.7,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colorSelect.blue,
    marginTop: 20,
    borderRadius: 5,
  },
  updateButtonText: {
    fontSize: fsize.fs16,
    color: '#fff',
  },
  dateText: {
    fontSize: fsize.fs16,
    color: colorSelect.blue,
    ...fweight.eb,
  },
  alarmText: {
    color: colorSelect.black2,
    ...fweight.eb,
  },
  alarmNumber: {
    ...fweight.b,
  },
  alarmGage: {
    borderRadius: 3,
  },
  newBox: {
    backgroundColor: '#F99600',
    borderRadius: 3,
    fontSize: fsize.fs12,
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  newBoxText: {
    fontSize: fsize.fs12,
    color: '#fff',
  },
  noticeText: {
    color: colorSelect.black2,
    ...fweight.b,
  },
  menuButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuButtonText: {
    fontSize: fsize.fs12,
    marginTop: 10,
    ...fweight.b,
  },
  useButton: {
    width: (width - 40) * 0.23,
    height: 33,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  dateBox: {
    width: (width - 80) * 0.47,
  },
  dateButton: {
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#DFDFDF',
    paddingRight: 10,
    marginTop: 15,
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
)(Home);
