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
import {Box, VStack, HStack, Image, Input, Modal} from 'native-base';
import {DefText} from '../common/BOOTSTRAP';
import Font from '../common/Font';
import HeaderHome from '../components/HeaderHome';
import {fsize, fweight, colorSelect, textStyle} from '../common/StyleDef';
import {Shadow} from 'react-native-neomorph-shadows';
import {changeMemberList} from '../Utils/DummyData';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import {connect} from 'react-redux';
import {actionCreators as UserAction} from '../redux/module/action/UserAction';
import {StackActions} from '@react-navigation/native';
import Api from '../Api';
import ToastMessage from '../components/ToastMessage';
import {borderWidth, marginTop} from 'styled-system';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const {width} = Dimensions.get('window');

/*임시 카운트*/
const meeting = 3;
const call = 0;
const nothing = 1;

const Db = props => {
  const {navigation, userInfo} = props;

  const isFocused = useIsFocused();

  // useEffect(()=>{

  //     if(isFocused){
  //         dbuse();

  //     }

  // }, [isFocused]);

  //DB 진행률
  const [allDB, setAllDB] = useState('');
  const [useDB, setUseDB] = useState('');
  const [dbPercent, setDBPercent] = useState('');

  const [dbLoading, setDBLoading] = useState(true);

  const [nowDates, setNowDates] = useState('');
  const [dateOnes, setDateOnes] = useState('');

  const [consulting, setConsulting] = useState(''); //상담
  const [consults, setConsults] = useState('');
  const [subscription, setSubscription] = useState(''); //청약
  const [asCount, setASCount] = useState(''); //AS
  const [subsEnd, setSubsEnd] = useState(''); //청약완료
  const [possible, setPossible] = useState(''); //가망고객
  const [notWork, setNotWork] = useState(''); //진행불가

  const [asRequest, setASRequest] = useState('');
  const [asYes, setASYes] = useState('');
  const [asNo, setASNo] = useState('');
  const [asPercent, setASPercent] = useState('');

  const [meetingAllCnt, setMettingAllCnt] = useState('');

  const dbApi = async () => {
    await Api.send(
      'dbNew_useLists',
      {idx: userInfo.mb_no, date1: dateOnes, date2: nowDates},
      args => {
        let resultItem = args.resultItem;
        let arrItems = args.arrItems;

        if (resultItem.result === 'Y' && arrItems) {
          //console.log('api 결과: ', arrItems, resultItem);

          setAllDB(arrItems.total);
          setUseDB(arrItems.totalno);
          setDBPercent(arrItems.dbPercent);
          //console.log('totals:::::',arrItems.totalno)
          //setDbUseData()
        } else {
          //console.log('api 결과 출력 실패!', resultItem);
          setAllDB('');
          setUseDB('');
          setDBPercent('');
        }
      },
    );

    await Api.send(
      'dbNew_meeting',
      {idx: userInfo.mb_no, date1: dateOnes, date2: nowDates},
      args => {
        let resultItem = args.resultItem;
        let arrItems = args.arrItems;

        if (resultItem.result === 'Y' && arrItems) {
          //console.log('미팅 진행률 결과: ', resultItem, arrItems);
          setMeetingCnt(arrItems.meetCnt);
          setMeetingPercent(arrItems.meetPercent);
        } else {
          //console.log('미팅 진행률 출력 실패!', resultItem);
          setMeetingCnt('');
          setMeetingPercent('');
        }
      },
    );

    //상담대기자
    //상담대기
    await Api.send(
      'dbNew_consulting',
      {idx: userInfo.mb_no, date1: dateOnes, date2: nowDates},
      args => {
        let resultItem = args.resultItem;
        let arrItems = args.arrItems;

        if (resultItem.result === 'Y' && arrItems) {
          //console.log('상담대기 결과: ', resultItem, arrItems);
          setConsults(arrItems);
        } else {
          //console.log('상담대기 출력 실패!', resultItem);
          setConsults('0');
        }
      },
    );

    //통화
    await Api.send(
      'dbNew_call',
      {idx: userInfo.mb_no, date1: dateOnes, date2: nowDates},
      args => {
        let resultItem = args.resultItem;
        let arrItems = args.arrItems;

        if (resultItem.result === 'Y' && arrItems) {
          //console.log('통화 고객 결과: ', resultItem, arrItems);
          setCall(arrItems);
          //setMissed(arrItems);
        } else {
          //console.log('통화 고객 출력 실패!', resultItem);
          setCall('0');
        }
      },
    );

    //청약대기중
    await Api.send(
      'dbNew_subscription',
      {idx: userInfo.mb_no, date1: dateOnes, date2: nowDates},
      args => {
        let resultItem = args.resultItem;
        let arrItems = args.arrItems;

        if (resultItem.result === 'Y' && arrItems) {
          //console.log('청약대기중 결과: ', resultItem, arrItems);
          setSubscription(arrItems);
        } else {
          //console.log('청약대기중 출력 실패!', resultItem);
          setSubscription('');
        }
      },
    );

    //청약완료
    await Api.send(
      'dbNew_subsComple',
      {idx: userInfo.mb_no, date1: dateOnes, date2: nowDates},
      args => {
        let resultItem = args.resultItem;
        let arrItems = args.arrItems;

        if (resultItem.result === 'Y' && arrItems) {
          // console.log('청약완료 출력: ', resultItem, arrItems);

          setSubsEnd(arrItems);
        } else {
          //console.log('청약완료 실패!', resultItem);
          setSubsEnd('');
        }
      },
    );

    //가망고객
    await Api.send(
      'dbNew_possible',
      {idx: userInfo.mb_no, date1: dateOnes, date2: nowDates},
      args => {
        let resultItem = args.resultItem;
        let arrItems = args.arrItems;

        if (resultItem.result === 'Y' && arrItems) {
          //console.log('가망고객 출력: ', resultItem, arrItems);

          setPossible(arrItems);
        } else {
          //console.log('가망고객 실패!', resultItem);
          setPossible('');
        }
      },
    );

    //진행불가
    await Api.send(
      'dbNew_notwork',
      {idx: userInfo.mb_no, date1: dateOnes, date2: nowDates},
      args => {
        let resultItem = args.resultItem;
        let arrItems = args.arrItems;

        if (resultItem.result === 'Y' && arrItems) {
          //console.log('진행불가 출력: ', resultItem, arrItems);

          setNotWork(arrItems);
        } else {
          //console.log('진행불가 출력 실패!', resultItem);
          setNotWork('');
        }
      },
    );

    await Api.send('db_changelist', {id: userInfo.mb_id, order: desc}, args => {
      let resultItem = args.resultItem;
      let arrItems = args.arrItems;

      if (resultItem.result === 'Y' && arrItems) {
        //console.log('db 변경이력 상세: ', resultItem);

        setChangeData(arrItems);
        //setDBInfo(arrItems)
      } else {
        //console.log('db 변경이력 통신 오류!', resultItem);
      }
    });
  };
  //DB사용량
  const dbuse = async () => {
    await setDBLoading(true);

    await Api.send('dbNew_nowDate', {idx: userInfo.mb_no}, args => {
      let resultItem = args.resultItem;
      let arrItems = args.arrItems;

      if (resultItem.result === 'Y' && arrItems) {
        console.log('현재 시간 출력: ', arrItems);
        setNowDates(arrItems.dateNow);
        setDateOnes(arrItems.dateOne);

        //    if(arrItems != ""){
        //     dbApi();
        //    }
        //setNowDates(arrItems);
      } else {
        console.log('현재 시간 출력 출력 실패!', resultItem);
      }
    });

    await Api.send('dbNew_meetingAdd', {idx: userInfo.mb_no}, args => {
      let resultItem = args.resultItem;
      let arrItems = args.arrItems;

      if (resultItem.result === 'Y' && arrItems) {
        //console.log('미팅 전체카운트: ', arrItems);
        setMettingAllCnt(arrItems.cnt_m);
        //setMeetingPercent(arrItems.meetPercent);
      } else {
        //console.log('미팅 진행률 출력 실패!', resultItem);
      }
    });

    //AS
    await Api.send('dbNew_as', {idx: userInfo.mb_no}, args => {
      let resultItem = args.resultItem;
      let arrItems = args.arrItems;

      if (resultItem.result === 'Y' && arrItems) {
        //console.log('AS 고객 결과: ', resultItem, arrItems);
        setASCount(arrItems);
        //setMissed(arrItems);
      } else {
        //console.log('AS 고객 출력 실패!', resultItem);
        setASCount('');
      }
    });

    //교환 접수상황
    await Api.send('dbApi_ASList', {idx: userInfo.mb_no}, args => {
      let resultItem = args.resultItem;
      let arrItems = args.arrItems;

      if (resultItem.result === 'Y' && arrItems) {
        // console.log('AS 요청 출력: ', resultItem, arrItems);
        setASRequest(arrItems.asRequest);
        setASYes(arrItems.asYes);
        setASNo(arrItems.asNo);
        setASPercent(arrItems.asPercent);
        //setNotWork(arrItems);
      } else {
        //console.log('AS 요청 출력 실패!', resultItem);
        setASRequest('');
        setASYes('');
        setASNo('');
        setASPercent('');
      }
    });

    await setDBLoading(false);
  };

  //미팅률
  const [meetingCnt, setMeetingCnt] = useState(0);
  const [meetingPercent, setMeetingPercent] = useState('');

  //통화 관련 고객
  const [call, setCall] = useState(0);

  const [desc, setDesc] = useState(false);
  const descChange = () => {
    setDesc(!desc);
  };

  const [changeData, setChangeData] = useState([]);

  useEffect(() => {
    dbuse();
  }, [desc]);

  useEffect(() => {}, [nowDates]);

  const [dateSettingModal, setDateSettingModal] = useState(false);
  //시작일
  const [startDateModal, setStartDateModal] = useState(false);
  const [startDate, setStartDate] = useState('');
  const startDateHandler = date => {
    startDataModalClose();
    //console.log('시작일 선택 날짜',date.format("yyyy-MM-dd"))
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
    //console.log(startDate)
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
    //console.log("dateOnes, nowDates",dateOnes, nowDates);
    if (isFocused) {
      appConnectConfirm();

      if (dateOnes != '' && nowDates != '') {
        console.log('isFocused:::::', isFocused);
        dbApi();
      }
    }
  }, [dateOnes, nowDates, isFocused]);

  // useEffect(()=>{
  //     changeList();
  // }, [desc])

  const changeMember = changeMemberList.map((item, index) => {
    return (
      <Box
        key={index}
        borderBottomWidth={1}
        borderBottomColor="#FAFAFA"
        py="15px">
        <HStack alignItems={'center'} justifyContent="space-between">
          <Box style={[styles.changeTableBox]}>
            <DefText
              text={item.mb_name}
              style={[{color: colorSelect.black666}, fweight.b]}
            />
          </Box>
          <Box style={[styles.changeTableBox]}>
            <DefText
              text={item.defStatus}
              style={[{color: colorSelect.black666}, fweight.b]}
            />
          </Box>
          <Box style={[styles.changeTableBox]}>
            <DefText
              text={item.afterStatus}
              style={[{color: colorSelect.black666}, fweight.b]}
            />
          </Box>
        </HStack>
      </Box>
    );
  });

  return (
    <Box flex={1} backgroundColor="#fff">
      <HeaderHome headerTitle="고객" />
      {dbLoading ? (
        <Box flex={1} alignItems="center" justifyContent={'center'}>
          <ActivityIndicator size={'large'} color="#333" />
        </Box>
      ) : (
        <ScrollView>
          <Box p={'20px'} pt="0">
            <Box borderRadius={100} overflow="hidden">
              {/*backgroundColor={'#F5F5F5'} borderRadius={20} borderWidth={1} borderColor='#EBEBEB' */}
              <HStack borderRadius={20} justifyContent="space-between">
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('AllClient', {
                      startDate: '',
                      endDate: '',
                      progressStatus: [],
                      category: '전체',
                    })
                  }
                  style={[
                    styles.customerButton,
                    {backgroundColor: colorSelect.orange},
                  ]}>
                  <DefText
                    text="전체 고객"
                    style={[
                      styles.customerButtonText,
                      {color: colorSelect.white},
                    ]}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('ProgressClient', {
                      cate: '상담대기',
                      startdate: dateOnes,
                      enddate: nowDates,
                    })
                  }
                  style={[
                    styles.customerButton,
                    {backgroundColor: colorSelect.orange},
                  ]}>
                  <DefText
                    text="진행중 업무"
                    style={[
                      styles.customerButtonText,
                      {color: colorSelect.white},
                    ]}
                  />
                </TouchableOpacity>
                {/* <TouchableOpacity 
                                    onPress={()=>navigation.navigate('AsDBList', {'cate':'AS요청'})}
                                    style={[styles.customerButton]}
                                >
                                    <DefText text='AS 요청' style={[styles.customerButtonText]} />
                                </TouchableOpacity> */}

                <TouchableOpacity
                  onPress={() => navigation.navigate('PossibleClient')}
                  style={[
                    styles.customerButton,
                    {backgroundColor: colorSelect.orange},
                  ]}>
                  <DefText
                    text="가망고객"
                    style={[
                      styles.customerButtonText,
                      {color: colorSelect.white},
                    ]}
                  />
                </TouchableOpacity>
              </HStack>
            </Box>
            <Box mt="20px">
              <HStack alignItems={'center'} justifyContent="space-between">
                <DefText
                  text="변경이력"
                  style={[textStyle.labelTitle, fweight.eb]}
                />
                <TouchableOpacity onPress={descChange}>
                  <HStack alignItems={'center'}>
                    <DefText
                      text="최신순"
                      style={[{fontSize: fsize.fs12, color: '#878787'}]}
                    />
                    {!desc ? (
                      <Image
                        source={require('../images/orderArr.png')}
                        alt="오름차순"
                        style={[
                          {
                            width: 9,
                            height: 6,
                            resizeMode: 'contain',
                            marginLeft: 7,
                          },
                        ]}
                      />
                    ) : (
                      <Image
                        source={require('../images/orderArrUp.png')}
                        alt="오름차순"
                        style={[
                          {
                            width: 9,
                            height: 6,
                            resizeMode: 'contain',
                            marginLeft: 7,
                          },
                        ]}
                      />
                    )}
                  </HStack>
                </TouchableOpacity>
              </HStack>
              {changeData != '' ? (
                changeData.length > 0 ? (
                  <Box mt="15px">
                    <HStack
                      py="10px"
                      alignItems={'center'}
                      backgroundColor={'#F9F9F9'}
                      borderTopWidth={1}
                      borderTopColor="#C9C9C9">
                      <Box style={[styles.changeTableBox]}>
                        <DefText
                          text="고객명"
                          style={[{color: '#9A9A9A'}, fweight.b]}
                        />
                      </Box>
                      <Box style={[styles.changeTableBox]}>
                        <DefText
                          text="기존이력"
                          style={[{color: '#9A9A9A'}, fweight.b]}
                        />
                      </Box>
                      <Box style={[styles.changeTableBox]}>
                        <DefText
                          text="변경이력"
                          style={[{color: '#9A9A9A'}, fweight.b]}
                        />
                      </Box>
                    </HStack>
                    <Box height="150px" overflow={'hidden'}>
                      <ScrollView>
                        {changeData.map((item, index) => {
                          return (
                            <Box
                              key={index}
                              borderBottomWidth={1}
                              borderBottomColor="#FAFAFA"
                              py="15px">
                              <HStack
                                alignItems={'center'}
                                justifyContent="space-between">
                                <Box style={[styles.changeTableBox]}>
                                  <DefText
                                    text={item.wr_name}
                                    style={[
                                      {color: colorSelect.black666},
                                      fweight.b,
                                    ]}
                                  />
                                </Box>
                                <Box style={[styles.changeTableBox]}>
                                  <DefText
                                    text={item.wr_1}
                                    style={[
                                      {color: colorSelect.black666},
                                      fweight.b,
                                    ]}
                                  />
                                </Box>
                                <Box style={[styles.changeTableBox]}>
                                  <DefText
                                    text={item.wr_2}
                                    style={[
                                      {color: colorSelect.black666},
                                      fweight.b,
                                    ]}
                                  />
                                </Box>
                              </HStack>
                            </Box>
                          );
                        })}
                      </ScrollView>
                    </Box>
                  </Box>
                ) : (
                  <Box>
                    <DefText text="변경이력이 없습니다." />
                  </Box>
                )
              ) : (
                <Box py="40px" justifyContent={'center'} alignItems="center">
                  <DefText text="변경이력이 없습니다." />
                </Box>
              )}
            </Box>
            <Shadow
              style={{
                shadowOffset: {width: 0, height: 7},
                shadowOpacity: 0.16,
                shadowColor: '#000000',
                shadowRadius: 15,
                borderRadius: 0,
                backgroundColor: '#fff',
                width: width - 40,
                height: 127,
                justifyContent: 'center',
                borderRadius: 10,
                marginTop: 15,
                // ...include most of View/Layout styles
              }}>
              <Box backgroundColor="#fff" borderRadius={20}>
                <Box
                  backgroundColor={'#4473B8'}
                  p="10px"
                  borderTopLeftRadius={10}
                  borderTopRightRadius={10}
                  borderWidth={1}
                  borderColor={colorSelect.blue}>
                  <HStack alignItems={'center'}>
                    {nowDates != '' && (
                      <HStack alignItems={'center'}>
                        <DefText
                          text={dateOnes}
                          style={[styles.dateText, fweight.eb]}
                        />
                        <DefText
                          text={' ~ '}
                          style={[styles.dateText, fweight.eb]}
                        />
                        <DefText
                          text={nowDates}
                          style={[styles.dateText, fweight.eb]}
                        />
                      </HStack>
                    )}
                    <TouchableOpacity onPress={() => setDateSettingModal(true)}>
                      <Image
                        source={require('../images/refreshIconBlack.png')}
                        alt="시간 새로고침"
                        style={{
                          width: 20,
                          height: 20,
                          resizeMode: 'contain',
                          marginLeft: 10,
                        }}
                      />
                    </TouchableOpacity>
                  </HStack>
                </Box>
                <Box
                  p="20px"
                  borderLeftWidth={1}
                  borderRightWidth={1}
                  borderBottomWidth={1}
                  borderColor={colorSelect.blue}
                  borderBottomLeftRadius={10}
                  borderBottomRightRadius={10}>
                  <HStack
                    justifyContent="space-between"
                    alignItems={'center'}
                    flexWrap={'wrap'}>
                    <HStack alignItems={'center'} width="50%">
                      <Box width="77%">
                        <DefText
                          text="현재 진행률"
                          style={[fweight.eb, {marginRight: 10}]}
                        />
                      </Box>
                      <HStack alignItems={'center'} width="23%">
                        <DefText
                          text={useDB ? useDB : 0}
                          style={[fweight.b, {color: colorSelect.blue}]}
                        />
                        <DefText text=" / " style={[fweight.b]} />
                        <DefText text={allDB ? allDB : 0} style={[fweight.b]} />
                      </HStack>
                    </HStack>
                    <Box
                      width="45%"
                      backgroundColor={'#EFEFEF'}
                      height="15px"
                      borderRadius={3}>
                      <Box
                        width={dbPercent ? dbPercent + '%' : '0%'}
                        backgroundColor={colorSelect.blue}
                        borderRadius={3}
                        justifyContent="center"
                        alignItems={'center'}>
                        <DefText
                          text={dbPercent ? dbPercent + '%' : '0%'}
                          style={[{color: colorSelect.white, fontSize: 12}]}
                        />
                      </Box>
                    </Box>
                  </HStack>
                  <HStack
                    justifyContent="space-between"
                    alignItems={'center'}
                    flexWrap={'wrap'}
                    mt="15px">
                    <HStack alignItems={'center'} width="50%">
                      <Box width="77%">
                        <DefText
                          text="현재 미팅 진행률"
                          style={[fweight.eb, {marginRight: 10}]}
                        />
                      </Box>
                      <HStack alignItems={'center'} width="23%">
                        <DefText
                          text={meetingCnt != 0 ? meetingCnt : 0}
                          style={[fweight.b, {color: colorSelect.blue}]}
                        />
                        <DefText text=" / " style={[fweight.b]} />
                        <DefText text={allDB ? allDB : 0} style={[fweight.b]} />
                      </HStack>
                    </HStack>
                    <Box
                      width="45%"
                      backgroundColor={'#EFEFEF'}
                      height="15px"
                      borderRadius={3}>
                      <Box
                        width={meetingPercent ? meetingPercent + '%' : 0}
                        backgroundColor={colorSelect.blue}
                        borderRadius={3}
                        justifyContent="center"
                        alignItems={'center'}>
                        <DefText
                          text={meetingPercent ? meetingPercent + '%' : ''}
                          style={[{color: colorSelect.white, fontSize: 12}]}
                        />
                      </Box>
                    </Box>
                  </HStack>
                </Box>
              </Box>
            </Shadow>
            <Box mt="25px">
              <DefText
                text="현재 진행 중인 업무"
                style={[textStyle.labelTitle, fweight.eb]}
              />
              <Box
                mt="15px"
                backgroundColor={'#fff'}
                shadow={9}
                borderRadius="10px">
                <HStack
                  py="15px"
                  alignItems={'center'}
                  justifyContent="space-between">
                  <TouchableOpacity
                    style={[styles.progressButtons]}
                    disabled={consults == 0 ? true : false}
                    onPress={() =>
                      navigation.navigate('ProgressClient', {
                        cate: '상담대기',
                        startdate: dateOnes,
                        enddate: nowDates,
                      })
                    }>
                    <DefText
                      text="상담대기"
                      style={[
                        fweight.b,
                        {fontSize: fsize.fs12},
                        consults == 0 && {color: colorSelect.gray},
                      ]}
                    />
                    <DefText
                      text={consults != 0 ? consults : 0}
                      style={[
                        {marginTop: 15},
                        consults == 0 && {color: colorSelect.gray},
                      ]}
                    />
                  </TouchableOpacity>
                  <Box style={styles.boxline} />
                  <TouchableOpacity
                    style={[styles.progressButtons]}
                    disabled={call == 0 ? true : false}
                    onPress={() =>
                      navigation.navigate('ProgressClient', {
                        cate: '통화',
                        startdate: dateOnes,
                        enddate: nowDates,
                      })
                    }>
                    <DefText
                      text="통화"
                      style={[
                        fweight.b,
                        {fontSize: fsize.fs12},
                        call == 0 && {color: colorSelect.gray},
                      ]}
                    />
                    <DefText
                      text={call != 0 ? call : 0}
                      style={[
                        {marginTop: 15},
                        call == 0 && {color: colorSelect.gray},
                      ]}
                    />
                  </TouchableOpacity>
                  <Box style={styles.boxline} />
                  <TouchableOpacity
                    style={[styles.progressButtons]}
                    disabled={meetingCnt == 0 ? true : false}
                    onPress={() =>
                      navigation.navigate('ProgressClient', {
                        cate: '미팅',
                        startdate: dateOnes,
                        enddate: nowDates,
                      })
                    }>
                    <DefText
                      text="미팅"
                      style={[
                        fweight.b,
                        {fontSize: fsize.fs12},
                        meetingCnt == 0 && {color: colorSelect.gray},
                      ]}
                    />
                    <DefText
                      text={meetingCnt != 0 ? meetingCnt : 0}
                      style={[
                        {marginTop: 15},
                        meetingCnt == 0 && {color: colorSelect.gray},
                      ]}
                    />
                  </TouchableOpacity>
                  <Box style={styles.boxline} />
                  <TouchableOpacity
                    style={[styles.progressButtons]}
                    disabled={subscription == 0 ? true : false}
                    onPress={() =>
                      navigation.navigate('ProgressClient', {
                        cate: '청약진행',
                        startdate: dateOnes,
                        enddate: nowDates,
                      })
                    }>
                    <DefText
                      text="청약진행"
                      style={[
                        fweight.b,
                        {fontSize: fsize.fs12},
                        subscription == 0 && {color: colorSelect.gray},
                      ]}
                    />
                    <DefText
                      text={subscription != 0 ? subscription : 0}
                      style={[
                        {marginTop: 15},
                        subscription == 0 && {color: colorSelect.gray},
                      ]}
                    />
                  </TouchableOpacity>
                  {/* <Box style={styles.boxline} /> */}
                  {/* <TouchableOpacity  style={[styles.progressButtons]} disabled={asCount == 0 ? true : false} onPress={()=>navigation.navigate('ProgressClient', {'cate':'AS요청'})}>
                                        <DefText text='AS요청' style={[fweight.b, {fontSize:fsize.fs12}, asCount == 0 && {color:colorSelect.gray}]} />
                                        <DefText text={asCount != 0 ? asCount : 0} style={[{marginTop:15}, asCount == 0 && {color:colorSelect.gray}]} />
                                    </TouchableOpacity> */}
                </HStack>
              </Box>
              <DefText
                text="완료된 업무"
                style={[textStyle.labelTitle, fweight.eb, {marginTop: 25}]}
              />
              <Box
                mt="15px"
                backgroundColor={'#fff'}
                shadow={9}
                borderRadius="10px">
                <HStack
                  py="15px"
                  alignItems={'center'}
                  justifyContent="space-around">
                  <TouchableOpacity
                    style={[styles.compleButton]}
                    disabled={subsEnd == 0 ? true : false}
                    onPress={() =>
                      navigation.navigate('EndClient', {
                        cate: '청약완료',
                        startdate: dateOnes,
                        enddate: nowDates,
                      })
                    }>
                    <DefText
                      text="청약완료"
                      style={[
                        fweight.b,
                        {fontSize: fsize.fs12},
                        subsEnd == 0 && {color: colorSelect.gray},
                      ]}
                    />
                    <DefText
                      text={subsEnd ? subsEnd : 0}
                      style={[
                        {marginTop: 15},
                        subsEnd == 0 && {color: colorSelect.gray},
                      ]}
                    />
                  </TouchableOpacity>
                  <Box style={styles.boxline} />
                  <TouchableOpacity
                    style={[styles.compleButton]}
                    disabled={possible == 0 ? true : false}
                    onPress={() =>
                      navigation.navigate('EndClient', {
                        cate: '가망고객',
                        startdate: dateOnes,
                        enddate: nowDates,
                      })
                    }>
                    <DefText
                      text="가망고객"
                      style={[
                        fweight.b,
                        {fontSize: fsize.fs12},
                        possible == 0 && {color: colorSelect.gray},
                      ]}
                    />
                    <DefText
                      text={possible ? possible : 0}
                      style={[
                        {marginTop: 15},
                        possible == 0 && {color: colorSelect.gray},
                      ]}
                    />
                  </TouchableOpacity>
                  <Box style={styles.boxline} />
                  <TouchableOpacity
                    style={[styles.compleButton]}
                    disabled={notWork == 0 ? true : false}
                    onPress={() =>
                      navigation.navigate('EndClient', {
                        cate: '진행불가',
                        startdate: dateOnes,
                        enddate: nowDates,
                      })
                    }>
                    <DefText
                      text="진행불가"
                      style={[
                        fweight.b,
                        {fontSize: fsize.fs12},
                        notWork == 0 && {color: colorSelect.gray},
                      ]}
                    />
                    <DefText
                      text={notWork ? notWork : 0}
                      style={[
                        {marginTop: 15},
                        notWork == 0 && {color: colorSelect.gray},
                      ]}
                    />
                  </TouchableOpacity>
                </HStack>
              </Box>

              {/* <DefText text='교환(AS)접수 상황' style={[textStyle.labelTitle, fweight.eb, {marginTop:20}]} />
                            <Box mt='15px' backgroundColor={'#fff'} shadow={9} borderRadius='10px'>
                                <HStack py='15px' alignItems={'center'} justifyContent='space-around'>
                                    <TouchableOpacity style={[styles.asButton]} disabled={asRequest == 0 ? true : false} onPress={()=>navigation.navigate('AsDBList', {'cate':'AS요청'})}>
                                        <DefText text='AS 요청' style={[fweight.b, {fontSize:fsize.fs12}, asRequest == 0 && {color:colorSelect.gray}]} />
                                        <DefText text={asRequest ? asRequest : 0} style={[{marginTop:15}, asRequest == 0 && {color:colorSelect.gray}]} />
                                    </TouchableOpacity>
                                    <Box style={styles.boxline} />
                                    <TouchableOpacity style={[styles.asButton]} disabled={asYes == 0 ? true : false} onPress={()=>navigation.navigate('AsDBList', {'cate':'AS 완료 승인'})}>
                                        <DefText text='AS 완료승인' style={[fweight.b, {fontSize:fsize.fs12}, asYes == 0 && {color:colorSelect.gray}]} />
                                        <DefText text={asYes ? asYes: 0} style={[{marginTop:15}, asYes == 0 && {color:colorSelect.gray}]} />
                                    </TouchableOpacity>
                                    <Box style={styles.boxline} />
                                    <TouchableOpacity style={[styles.asButton]} disabled={asNo == 0 ? true : false} onPress={()=>navigation.navigate('AsDBList', {'cate':'AS 완료 거절'})}>
                                        <DefText text='AS 완료거절' style={[fweight.b, {fontSize:fsize.fs12}, asNo == 0 && {color:colorSelect.gray}]} />
                                        <DefText text={asNo ? asNo : 0} style={[{marginTop:15}, asNo == 0 && {color:colorSelect.gray}]} />
                                    </TouchableOpacity>
                                    <Box style={styles.boxline} />
                                    <Box style={[styles.asButton]}>
                                        <DefText text='교환신청비율' style={[fweight.b, {fontSize:fsize.fs12}]} />
                                        <DefText text={asPercent ? asPercent + '%' : 0 + '%'} style={[{marginTop:15}]} />
                                    </Box>
                                    
                                </HStack>
                            </Box> */}
            </Box>
          </Box>
        </ScrollView>
      )}
      <Modal
        isOpen={dateSettingModal}
        onClose={() => setDateSettingModal(false)}>
        <Modal.Content
          width={width - 40}
          p="20px"
          style={{
            width: Dimensions.get('screen').width - 40,
            minWidth: Dimensions.get('screen').width - 40,
            maxWidth: Dimensions.get('screen').width - 40,
          }}>
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
    </Box>
  );
};

const styles = StyleSheet.create({
  dateText: {
    fontSize: fsize.fs16,
    color: '#fff',
  },
  ingButton: {
    width: '32%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressButtons: {
    width: (width - 40) * 0.24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  compleButton: {
    width: (width - 40) * 0.32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  asButton: {
    width: (width - 40) * 0.24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  boxline: {
    width: 1,
    height: 30,
    backgroundColor: '#999',
  },
  customerButton: {
    //width: (width - 40) * 0.25,
    width: (width - 40) * 0.32,
    height: 39,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#F99300',
  },
  customerButtonText: {
    color: colorSelect.black2,
    fontSize: fsize.fs14,
    ...fweight.eb,
  },
  changeTableBox: {
    width: '33.3333%',
    alignItems: 'center',
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
)(Db);
