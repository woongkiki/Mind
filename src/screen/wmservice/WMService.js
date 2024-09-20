import React, {useState, useEffect} from 'react';
import {Box, HStack, Modal, Select} from 'native-base';
import {
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Alert,
} from 'react-native';
import {connect} from 'react-redux';
import {actionCreators as UserAction} from '../../redux/module/action/UserAction';
import HeaderDef from '../../components/HeaderDef';
import Api from '../../Api';
import {colorSelect, fsize, fweight} from '../../common/StyleDef';
import {DefInput, DefText} from '../../common/BOOTSTRAP';
import {useIsFocused} from '@react-navigation/native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import ToastMessage from '../../components/ToastMessage';

const {width, height} = Dimensions.get('window');

const WMService = props => {
  const {navigation, userInfo} = props;

  const isFocused = useIsFocused();

  const [loading, setLoading] = useState(true);
  const [wmService, setWmService] = useState([]);
  const [serviceModal, setServiceModal] = useState(false);
  const [serviceResultModal, setServiceResultModal] = useState(false);
  const [serviceResult, setServiceResult] = useState('');

  //확정일자
  const [confirmDateAdm, setConfirmDateAdm] = useState('');
  const [confirmDateModal, setConfirmDateModal] = useState(false);

  const confirmDateSelect = date => {
    if (date == '다른 날짜 선택') {
      setConfirmDateModal(true);
    } else {
      setConfirmDateAdm(date);
    }
  };

  //확정일자 날짜선택 모달열기
  const confirmDateModalHandler = date => {
    confirmDateModalClose();

    console.log('date', date);
    setConfirmDateAdm(moment(date).format('yyyy-MM-DD'));
  };

  //확정일자 날짜선택 모달 닫기
  const confirmDateModalClose = () => {
    setConfirmDateModal(false);
  };

  //확정일자 시간
  const [confirmTime1, setConfirmTime1] = useState('');
  const [confirmTimeModal1, setConfirmTimeModal1] = useState(false);

  const confirmTimeModalHandler = time => {
    confirmTimeModalClose();
    setConfirmTime1(moment(time).format('H:mm'));
  };

  const confirmTimeModalClose = () => {
    setConfirmTimeModal1(false);
  };

  //확정일자 시간
  const [confirmTime2, setConfirmTime2] = useState('');
  const [confirmTimeModal2, setConfirmTimeModal2] = useState(false);

  const confirmTime2ModalHandler = time => {
    confirmTime2ModalClose();
    setConfirmTime2(moment(time).format('H:mm'));
  };

  const confirmTime2ModalClose = () => {
    setConfirmTimeModal2(false);
  };

  const wmservieApi = async () => {
    await setLoading(true);
    await Api.send(
      'wm_list',
      {level: userInfo.mb_level, fpidx: userInfo.mb_no},
      args => {
        let resultItem = args.resultItem;
        let arrItems = args.arrItems;

        if (resultItem.result === 'Y' && arrItems) {
          console.log('wm 진행현황 가져오기 성공: ', arrItems[2], resultItem);
          setWmService(arrItems);
        } else {
          console.log('wm 진행현황 가져오기 실패!!', resultItem);
        }
      },
    );
    await setLoading(false);
  };

  useEffect(() => {
    if (isFocused) {
      wmservieApi();
    }
  }, [isFocused]);

  const [checkService, setCheckService] = useState('');
  const [checkCategory, setCheckCategory] = useState('');

  const [cscontent, setCsContent] = useState('');
  const [fpcont, setFpCont] = useState('');

  //1차희망일 데이트피커
  const [hdate1Modal, setHdate1Modal] = useState(false);
  const [checkhdate1, setCheckHdate] = useState('');

  const hdate1Handler = date => {
    hdateClose();
    setCheckHdate(moment(date).format('yyyy-MM-DD'));
  };

  const hdateClose = () => {
    setHdate1Modal(false);
  };

  //1차 희망시간
  const [htime1Modal, setHtime1Modal] = useState(false);
  const [checkhstime1, setCheckHstime1] = useState('');

  const htime1Handler = time => {
    htime1Close();
    setCheckHstime1(moment(time).format('H:mm'));
  };

  const htime1Close = () => {
    setHtime1Modal(false);
  };

  //1차희망시간
  const [etime1Modal, setEtime1Modal] = useState(false);
  const [checkhetime1, setCheckHetime1] = useState('');

  const etime1Handler = time => {
    etime1Close();
    setCheckHetime1(moment(time).format('H:mm'));
  };

  const etime1Close = () => {
    setEtime1Modal(false);
  };

  //2차 희망일
  const [hdate2Modal, setHdate2Modal] = useState(false);
  const [checkhdate2, setCheckHdate2] = useState('');

  const hdate2Handler = date => {
    hdate2Close();
    setCheckHdate2(moment(date).format('yyyy-MM-DD'));
  };

  const hdate2Close = () => {
    setHdate2Modal(false);
  };

  //2차 희망시간
  const [htime2Modal, setHtime2Modal] = useState(false);
  const [checkhstime2, setCheckHstime2] = useState('');

  const htime2Handler = time => {
    htime2Close();
    setCheckHstime2(moment(time).format('H:mm'));
  };

  const htime2Close = () => {
    setHtime2Modal(false);
  };

  //2차 희망시간
  const [etime2Modal, setEtime2Modal] = useState(false);
  const [checkhetime2, setCheckHetime2] = useState('');

  const etime2Handler = time => {
    etime2Close();
    setCheckHetime2(moment(time).format('H:mm'));
  };

  const etime2Close = () => {
    setEtime2Modal(false);
  };

  const [sidxVal, setSidxVal] = useState('');

  const [resultContent, setResultContent] = useState('');

  const [wmCategory, setWmCategory] = useState([]);
  const wmCategoryListApi = () => {
    Api.send('wm_category', {}, args => {
      let resultItem = args.resultItem;
      let arrItems = args.arrItems;

      if (resultItem.result === 'Y' && arrItems) {
        console.log('wm 서비스 카테고리 성공: ', arrItems, resultItem);

        setWmCategory(arrItems);
      } else {
        console.log('wm 서비스 카테고리 실패!!', resultItem);
      }
    });
  };

  useEffect(() => {
    wmCategoryListApi();
  }, []);

  const [cstatus, setcstatus] = useState('');
  const [checkCate, setCheckCate] = useState('');

  //카테고리 2
  const [customerNumber, setCustomerNumber] = useState(''); //고객 수
  const [fpNumber, setFpNumber] = useState(''); //설계사 수
  const [areaValue, setAreaValue] = useState(''); //장소
  const [seminarTitle, setSeminarTitle] = useState(''); //주제
  const [seminarContent, setSeminarContent] = useState('');

  const customerNumChange = num => {
    setCustomerNumber(num);
  };

  const fpNumChange = num => {
    setFpNumber(num);
  };

  const areaChange = area => {
    setAreaValue(area);
  };

  const seminarChange = text => {
    setSeminarTitle(text);
  };

  const seminarContentChange = text => {
    setSeminarContent(text);
  };

  //카테고리 재무컨설팅 코치
  const [coachingContent, setCoachingContent] = useState('');
  const cochingContentChange = text => {
    setCoachingContent(text);
  };

  const [appInsert, setAppInsert] = useState(false);
  const [adminInsert, setAdminIsert] = useState(false);

  const [mb0, setMb0] = useState('');
  const [mb1, setMb1] = useState('');
  const [mb3, setMb3] = useState('');

  const [serviceModalLoading, setServiceModalLoading] = useState(true);

  const serviceCheckApi = async (
    sidx,
    cstatus,
    wcate,
    fpidx,
    brand1,
    brand2,
    brand3,
  ) => {
    setAppInsert(fpidx == userInfo.mb_no);
    if (
      brand1 === userInfo?.mb_0 &&
      brand2 === userInfo?.mb_1 &&
      brand3 === userInfo?.mb_3
    ) {
      setAdminIsert(true);
    }

    setSidxVal(sidx);
    setcstatus(cstatus);
    setCheckCate(wcate);

    //지사 및 팀
    setMb0(brand1);
    setMb1(brand2);
    setMb3(brand3);

    await setServiceModal(true);
    await setServiceModalLoading(true);
    await Api.send('wm_check', {idx: sidx}, args => {
      let resultItem = args.resultItem;
      let arrItems = args.arrItems;

      if (resultItem.result === 'Y' && arrItems) {
        console.log('wm 서비스 진행내용 성공: ', arrItems, resultItem);

        //setCheckService(arrItems);
        setCheckCategory(arrItems.wcate);
        setCheckHdate(arrItems.hdate1);
        setCheckHstime1(arrItems.hstime1);
        setCheckHetime1(arrItems.hetime1);
        setCheckHdate2(arrItems.hdate2);
        setCheckHstime2(arrItems.hstime2);
        setCheckHetime2(arrItems.hetime2);
        setCsContent(arrItems.ccont);
        setFpCont(arrItems.fpcont);
        setCoachingContent(arrItems.cocont);
        setCustomerNumber(arrItems.cnumber);
        setFpNumber(arrItems.fpnumber);
        setAreaValue(arrItems.saminarArea);
        setSeminarTitle(arrItems.seminarTitle);
        setSeminarContent(arrItems.seminarContent);

        if (arrItems.confirmStatus == 1) {
          setConfirmDateAdm(arrItems.confirmDate);
          setConfirmTime1(arrItems.confirmTime1);
          setConfirmTime2(arrItems.confirmTime2);
        }
      } else {
        console.log('wm 진행내용 실패!!', resultItem);
      }
    });
    await setServiceModalLoading(false);
  };

  const serviceModalClose = () => {
    setServiceModal(false);
    setCheckCategory('');
    setCheckHdate('');
    setCheckHstime1('');
    setCheckHetime1('');
    setCheckHdate2('');
    setCheckHstime2('');
    setCheckHetime2('');
    setCsContent('');
    setFpCont('');
    setCoachingContent('');
    setCustomerNumber('');
    setFpNumber('');
    setAreaValue('');
    setSeminarTitle('');
    setSeminarContent('');

    setConfirmDateAdm('');
    setConfirmTime1('');
    setConfirmTime2('');
  };

  const wmServiceUpdateHandler = () => {
    Api.send(
      'wm_updates',
      {
        widx: sidxVal,
        wcate: checkCategory,
        hdate1: checkhdate1,
        hstime1: checkhstime1,
        hetime1: checkhetime1,
        hdate2: checkhdate2,
        hstime2: checkhstime2,
        hetime2: checkhetime2,
        ccont: cscontent,
        fpcont: fpcont,
        cocont: coachingContent,
        cnumber: customerNumber,
        fpnumber: fpNumber,
        saminarArea: areaValue,
        seminarTitle: seminarTitle,
        seminarContent: seminarContent,
      },
      args => {
        let resultItem = args.resultItem;
        let arrItems = args.arrItems;

        if (resultItem.result === 'Y' && arrItems) {
          console.log('wm 서비스 수정 성공: ', arrItems, resultItem);
          //setCheckService(arrItems);
          ToastMessage(resultItem.message);
          setServiceModal(false);
          wmservieApi();
        } else {
          console.log('wm 서비스 수정 실패!!', resultItem);
          ToastMessage(resultItem.message);
          setServiceModal(false);
        }
      },
    );
  };

  const [wmCateName, setWmCateName] = useState('');
  const select1Change = cate => {
    //console.log("cate", wmCategory[cate-1].wcate);
    setWmCateName(wmCategory[cate - 1].wcate);
    setCheckCategory(cate);
  };

  const cscontentChange = text => {
    setCsContent(text);
  };

  const fpcontentChange = text => {
    setFpCont(text);
  };

  const _renderItem = ({item, index}) => {
    return (
      <HStack px="20px">
        <Box style={[styles.wmBoxBody]}>
          <DefText text="본부" style={[styles.wmBoxBodyText]} />
        </Box>
        <Box style={[styles.wmBoxBody]}>
          <DefText text={item.dist} style={[styles.wmBoxBodyText]} />
        </Box>
        <Box style={[styles.wmBoxBody]}>
          <DefText text={item.fpname} style={[styles.wmBoxBodyText]} />
        </Box>
        <Box style={[styles.wmBoxBody, {width: (width - 40) * 0.2}]}>
          <TouchableOpacity
            onPress={() =>
              serviceCheckApi(
                item.idx,
                item.contract_status,
                item.wcate,
                item.fpidx,
                item.brand1,
                item.brand2,
                item.brand3,
              )
            }>
            <DefText
              text={item.wcatename}
              style={[
                styles.wmBoxBodyText,
                {color: colorSelect.blue, ...fweight.eb},
              ]}
              textDecoration={'underline'}
              textDecorationColor={colorSelect.blue}
            />
          </TouchableOpacity>
        </Box>
        <Box style={[styles.wmBoxBody]}>
          <DefText
            text={item.confirmStatus == 1 ? item.confirmDate : '-'}
            style={[styles.wmBoxBodyText]}
          />
        </Box>
        <Box style={[styles.wmBoxBody]}>
          <DefText
            text={item.pstatus == 1 ? '확정' : '미확정'}
            style={[styles.wmBoxBodyText]}
          />
        </Box>
        <Box style={[styles.wmBoxBody]}>
          <DefText
            text={item.contract_status == 1 ? 'Y' : 'N'}
            style={[styles.wmBoxBodyText]}
          />
        </Box>
        <Box style={[styles.wmBoxBody]}>
          <DefText
            text={item.untact == 1 ? 'Y' : 'N'}
            style={[styles.wmBoxBodyText]}
          />
        </Box>
        <Box style={[styles.wmBoxBody]}>
          <TouchableOpacity onPress={() => serviceContentModalApi(item.idx)}>
            <DefText
              text={'결과\n입력'}
              style={[
                styles.wmBoxBodyText,
                {color: colorSelect.blue, ...fweight.eb},
              ]}
              textDecoration={'underline'}
              textDecorationColor={colorSelect.blue}
            />
          </TouchableOpacity>
        </Box>
      </HStack>
    );
  };

  const serviceContentCancle = () => {
    Api.send('wm_remove', {widx: sidxVal, mb_no: userInfo?.mb_no}, args => {
      let resultItem = args.resultItem;
      let arrItems = args.arrItems;

      if (resultItem.result === 'Y' && arrItems) {
        console.log('wm 서비스 취소 성공: ', arrItems, resultItem);

        ToastMessage(resultItem.message);
        setServiceModal(false);
        wmservieApi();
      } else {
        console.log('wm 서비스 취소 실패!!', resultItem);

        ToastMessage(resultItem.message);
        setServiceModal(false);
        wmservieApi();
      }
    });
  };

  //결과입력모달 상세
  const [resIdx, setResIdx] = useState('');
  const serviceContentModalApi = idx => {
    setResIdx(idx);
    Api.send('wm_results', {idx: idx}, args => {
      let resultItem = args.resultItem;
      let arrItems = args.arrItems;

      if (resultItem.result === 'Y' && arrItems) {
        console.log('wm 서비스 결과 모달 성공: ', arrItems, resultItem);

        setResultContent(arrItems);
        setServiceResult(arrItems.wm_result);
        if (arrItems != '') {
          setServiceResultModal(true);
        }
      } else {
        console.log('wm 서비스 결과 모달 실패!!', resultItem);
      }
    });
  };

  //결과입력하기
  const serviceResultHandler = () => {
    console.log('resIdx', resIdx);
    if (serviceResult == '') {
      Alert.alert('변경하실 상태를 선택하세요.');
    }

    Api.send('wm_resultConfirm', {widx: resIdx, sres: serviceResult}, args => {
      let resultItem = args.resultItem;
      let arrItems = args.arrItems;

      if (resultItem.result === 'Y' && arrItems) {
        console.log('wm 서비스 결과 변경 성공: ', arrItems, resultItem);

        ToastMessage('서비스가 결과 입력되었습니다.');
        setServiceResultModal(false);
        wmservieApi();
        setServiceResult('');
      } else {
        console.log('wm 서비스 결과 변경 실패!!', resultItem);
        ToastMessage(resultItem.message);
        setServiceResultModal(false);
        setServiceResult('');
      }
    });
  };

  //서비스 확정
  const serviceConfirmApi = () => {
    console.log('sidxVal', sidxVal);

    if (confirmDateAdm == '') {
      Alert.alert('확정일시를 선택하세요.');
      return false;
    }

    if (confirmTime1 == '') {
      Alert.alert('확정시간을 선택하세요.1');
      return false;
    }

    if (confirmTime2 == '') {
      Alert.alert('확정시간을 선택하세요.2');
      return false;
    }

    Api.send(
      'wm_confirm',
      {
        widx: sidxVal,
        confirmDate: confirmDateAdm,
        confirmTime1: confirmTime1,
        confirmTime2: confirmTime2,
      },
      args => {
        let resultItem = args.resultItem;
        let arrItems = args.arrItems;

        if (resultItem.result === 'Y' && arrItems) {
          console.log('wm 서비스 확정 성공: ', arrItems, resultItem);
          ToastMessage('WM 서비스가 확정되었습니다.');
          setServiceModal(false);
          wmservieApi();
        } else {
          console.log('wm 서비스 확정 실패!!', resultItem);
          ToastMessage(resultItem.message);
          setServiceModal(false);
        }
      },
    );
  };

  const serviceConfirmUpdate = () => {
    if (confirmDateAdm == '') {
      Alert.alert('확정일시를 선택하세요.');
      return false;
    }

    if (confirmTime1 == '') {
      Alert.alert('확정시간을 선택하세요.');
      return false;
    }

    if (confirmTime2 == '') {
      Alert.alert('확정시간을 선택하세요.');
      return false;
    }

    Api.send(
      'wm_confirmUpdate',
      {
        widx: sidxVal,
        confirmDate: confirmDateAdm,
        confirmTime1: confirmTime1,
        confirmTime2: confirmTime2,
      },
      args => {
        let resultItem = args.resultItem;
        let arrItems = args.arrItems;

        if (resultItem.result === 'Y' && arrItems) {
          console.log('wm 서비스 확정일시 변경: ', arrItems, resultItem);
          ToastMessage('확정일시가 변경되었습니다.');
          setServiceModal(false);
          wmservieApi();
        } else {
          console.log('확정일시 변경 실패!!', resultItem);
          ToastMessage(resultItem.message);
          setServiceModal(false);
        }
      },
    );
  };

  //리플레쉬
  const [refreshing, setRefreshing] = useState(false);

  const refreshList = () => {
    wmservieApi();
  };

  const MoveSchedule = () => {
    navigation.navigate('Tab_Navigation', {
      screen: 'Schedule',
      params: {wm: 'Y'},
    });
  };

  return (
    <Box flex={1} backgroundColor="#fff">
      <HeaderDef headerTitle="WM 서비스 진행현황" navigation={navigation} />
      {loading ? (
        <Box>
          <ActivityIndicator size="large" color="#333" />
        </Box>
      ) : (
        <FlatList
          ListHeaderComponent={
            <Box px="20px">
              <HStack flexWrap={'wrap'} justifyContent="space-between">
                <TouchableOpacity
                  style={[styles.wmButton]}
                  onPress={MoveSchedule}>
                  <DefText
                    text="WM서비스 일정확인"
                    style={[styles.wmButtonText]}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.wmButton]}
                  onPress={() => navigation.navigate('WMServiceRequest')}>
                  <DefText text="WM서비스 신청" style={[styles.wmButtonText]} />
                </TouchableOpacity>
              </HStack>
              <HStack
                flexWrap={'wrap'}
                justifyContent="space-between"
                mt="15px">
                {/* <Box style={[styles.wmBoxHead]}>
                                    <DefText text="No" style={[styles.wmBoxHeadText]} />
                                </Box> */}
                <Box style={[styles.wmBoxHead]}>
                  <DefText text="본부" style={[styles.wmBoxHeadText]} />
                </Box>
                <Box style={[styles.wmBoxHead]}>
                  <DefText text="지점" style={[styles.wmBoxHeadText]} />
                </Box>
                <Box style={[styles.wmBoxHead]}>
                  <DefText text="FP명" style={[styles.wmBoxHeadText]} />
                </Box>
                <Box style={[styles.wmBoxHead, {width: (width - 40) * 0.2}]}>
                  <DefText text={'신청 구분'} style={[styles.wmBoxHeadText]} />
                </Box>
                <Box style={[styles.wmBoxHead]}>
                  <DefText text={'확정\n일시'} style={[styles.wmBoxHeadText]} />
                </Box>
                <Box style={[styles.wmBoxHead]}>
                  <DefText text={'처리\n상태'} style={[styles.wmBoxHeadText]} />
                </Box>
                <Box style={[styles.wmBoxHead]}>
                  <DefText text={'체결\n여부'} style={[styles.wmBoxHeadText]} />
                </Box>
                <Box style={[styles.wmBoxHead]}>
                  <DefText text={'대면\n여부'} style={[styles.wmBoxHeadText]} />
                </Box>
                <Box style={[styles.wmBoxHead]}>
                  <DefText text={'결과\n입력'} style={[styles.wmBoxHeadText]} />
                </Box>
              </HStack>
            </Box>
          }
          data={wmService}
          renderItem={_renderItem}
          keyExtractor={(item, index) => index.toString()}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={refreshList} />
          }
          ListEmptyComponent={
            <Box px="21px">
              <Box
                py={'80px'}
                alignItems="center"
                borderWidth={1}
                borderColor="#aaa"
                borderTopWidth={0}>
                <DefText
                  text="등록된 서비스가 없습니다."
                  style={{color: colorSelect.black666}}
                />
              </Box>
            </Box>
          }
        />
      )}
      <Modal isOpen={serviceModal} onClose={serviceModalClose}>
        <Modal.Content
          p="0"
          style={{
            width: Dimensions.get('screen').width - 40,
            minWidth: Dimensions.get('screen').width - 40,
            maxWidth: Dimensions.get('screen').width - 40,
          }}>
          <Modal.Body p="0">
            {serviceModalLoading ? (
              <Box p="20px">
                <DefText
                  text="해당 WM 신청정보를 불러오는 중입니다."
                  style={{textAlign: 'center', marginBottom: 20}}
                />
                <ActivityIndicator size="large" color="#333" />
              </Box>
            ) : (
              <Box>
                <Box p="20px">
                  <DefText
                    text={'WM' + wmCateName + ' 신청 수정 및 취소'}
                    style={{
                      fontSize: fsize.fs16,
                      ...fweight.eb,
                    }}
                  />
                </Box>
                <Box px="20px" pb="20px">
                  <Box>
                    <DefText
                      text="신청구분"
                      style={[fweight.b, {marginBottom: 10}]}
                    />
                    <Select
                      selectedValue={checkCategory}
                      width={width - 80}
                      height="40px"
                      fontSize={fsize.fs12}
                      style={fweight.r}
                      backgroundColor="#fff"
                      borderWidth={1}
                      borderColor="#999999"
                      onValueChange={itemValue => select1Change(itemValue)}
                      isDisabled={userInfo?.mb_level != 2 ? true : false}>
                      {wmCategory != '' ? (
                        wmCategory.map((item, index) => {
                          return (
                            <Select.Item
                              label={item.wcate}
                              value={item.idx}
                              key={index}
                            />
                          );
                        })
                      ) : (
                        <Select.Item label="신청구분" value="" />
                      )}
                    </Select>
                  </Box>
                  {checkCate == 1 && (
                    <Box>
                      <Box mt="20px">
                        <DefText
                          text="1차 희망일"
                          style={[fweight.b, {marginBottom: 10}]}
                        />
                        <HStack
                          justifyContent={'space-between'}
                          alignItems="center">
                          <TouchableOpacity
                            style={[
                              styles.timeButton,
                              {width: (width - 80) * 0.34},
                            ]}
                            onPress={() => setHdate1Modal(true)}>
                            {checkhdate1 != '' ? (
                              <DefText
                                text={checkhdate1}
                                style={[styles.timeButtonText]}
                              />
                            ) : (
                              <DefText
                                text={'-'}
                                style={[
                                  styles.timeButtonText,
                                  {color: colorSelect.gray},
                                ]}
                              />
                            )}
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={[styles.timeButton]}
                            onPress={() => setHtime1Modal(true)}>
                            {checkhstime1 != '' ? (
                              <DefText
                                text={checkhstime1}
                                style={[styles.timeButtonText]}
                              />
                            ) : (
                              <DefText
                                text={'-'}
                                style={[
                                  styles.timeButtonText,
                                  {color: colorSelect.gray},
                                ]}
                              />
                            )}
                          </TouchableOpacity>
                          <DefText text={'~'} />
                          <TouchableOpacity
                            style={[styles.timeButton]}
                            onPress={() => setEtime1Modal(true)}>
                            {checkhetime1 != '' ? (
                              <DefText
                                text={checkhetime1}
                                style={[styles.timeButtonText]}
                              />
                            ) : (
                              <DefText
                                text={'-'}
                                style={[
                                  styles.timeButtonText,
                                  {color: colorSelect.gray},
                                ]}
                              />
                            )}
                          </TouchableOpacity>
                        </HStack>
                      </Box>
                      <Box mt="20px">
                        <DefText
                          text="2차 희망일"
                          style={[fweight.b, {marginBottom: 10}]}
                        />
                        <HStack
                          justifyContent={'space-between'}
                          alignItems="center">
                          <TouchableOpacity
                            style={[
                              styles.timeButton,
                              {width: (width - 80) * 0.34},
                            ]}
                            onPress={() => setHdate2Modal(true)}>
                            {checkhdate2 != '' ? (
                              <DefText
                                text={checkhdate2}
                                style={[styles.timeButtonText]}
                              />
                            ) : (
                              <DefText
                                text={'-'}
                                style={[
                                  styles.timeButtonText,
                                  {color: colorSelect.gray},
                                ]}
                              />
                            )}
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => setHtime2Modal(true)}
                            style={[styles.timeButton]}>
                            {checkhstime2 != '' ? (
                              <DefText
                                text={checkhstime2}
                                style={[styles.timeButtonText]}
                              />
                            ) : (
                              <DefText
                                text={'-'}
                                style={[
                                  styles.timeButtonText,
                                  {color: colorSelect.gray},
                                ]}
                              />
                            )}
                          </TouchableOpacity>
                          <DefText text={'~'} />
                          <TouchableOpacity
                            onPress={() => setEtime2Modal(true)}
                            style={[styles.timeButton]}>
                            {checkhetime2 != '' ? (
                              <DefText
                                text={checkhetime2}
                                style={[styles.timeButtonText]}
                              />
                            ) : (
                              <DefText
                                text={'-'}
                                style={[
                                  styles.timeButtonText,
                                  {color: colorSelect.gray},
                                ]}
                              />
                            )}
                          </TouchableOpacity>
                        </HStack>
                      </Box>
                      <Box mt="20px">
                        <DefText
                          text="고객의 자문요청내용"
                          style={[fweight.b, {marginBottom: 10}]}
                        />
                        <Box>
                          <DefInput
                            inputValue={cscontent}
                            onChangeText={cscontentChange}
                            inputStyle={{
                              width: width - 80,
                              height: 100,
                              borderRadius: 5,
                              borderColor: '#999',
                            }}
                            multiline={true}
                            textAlignVertical="top"
                          />
                        </Box>
                      </Box>
                      <Box mt="20px">
                        <DefText
                          text="상담을 통해 FP님이 원하는 내용"
                          style={[fweight.b, {marginBottom: 10}]}
                        />
                        <Box>
                          <DefInput
                            inputValue={fpcont}
                            onChangeText={fpcontentChange}
                            inputStyle={{
                              width: width - 80,
                              height: 100,
                              borderRadius: 5,
                              borderColor: '#999',
                            }}
                            multiline={true}
                            textAlignVertical="top"
                          />
                        </Box>
                      </Box>
                    </Box>
                  )}
                  {(checkCate == 2 || checkCate == 5) && (
                    <Box>
                      <Box mt="20px">
                        <DefText
                          text="참석인원"
                          style={[
                            fweight.eb,
                            {fontSize: fsize.fs16, marginBottom: 15},
                          ]}
                        />
                        <HStack justifyContent={'space-between'}>
                          {checkCate == 2 && (
                            <HStack alignItems={'center'}>
                              <DefInput
                                inputValue={customerNumber}
                                onChangeText={customerNumChange}
                                placeholderText="고객 인원"
                                inputStyle={{
                                  marginRight: 10,
                                  width: (width - 80) * 0.4,
                                }}
                                keyboardType={'number-pad'}
                              />
                              <DefText text="명" />
                            </HStack>
                          )}

                          <HStack alignItems={'center'}>
                            <DefInput
                              inputValue={fpNumber}
                              onChangeText={fpNumChange}
                              placeholderText="fp 인원"
                              inputStyle={{
                                marginRight: 10,
                                width: (width - 80) * 0.4,
                              }}
                              keyboardType={'number-pad'}
                            />
                            <DefText text="명" />
                          </HStack>
                        </HStack>
                      </Box>
                      <Box mt="20px">
                        <DefText
                          text="장소"
                          style={[
                            fweight.eb,
                            {fontSize: fsize.fs16, marginBottom: 15},
                          ]}
                        />
                        <Box>
                          <DefInput
                            inputValue={areaValue}
                            onChangeText={areaChange}
                            placeholderText="장소를 입력하세요."
                          />
                        </Box>
                      </Box>
                      <Box mt="20px">
                        <DefText
                          text="희망주제"
                          style={[
                            fweight.eb,
                            {fontSize: fsize.fs16, marginBottom: 15},
                          ]}
                        />
                        <Box>
                          <DefInput
                            inputValue={seminarTitle}
                            onChangeText={seminarChange}
                            placeholderText="희망주제를 입력하세요."
                          />
                        </Box>
                      </Box>
                      <Box mt="20px">
                        <DefText
                          text="1차 희망일"
                          style={[fweight.b, {marginBottom: 10}]}
                        />
                        <HStack
                          justifyContent={'space-between'}
                          alignItems="center">
                          <TouchableOpacity
                            style={[
                              styles.timeButton,
                              {width: (width - 80) * 0.34},
                            ]}
                            onPress={() => setHdate1Modal(true)}>
                            {checkhdate1 != '' ? (
                              <DefText
                                text={checkhdate1}
                                style={[styles.timeButtonText]}
                              />
                            ) : (
                              <DefText
                                text={'-'}
                                style={[
                                  styles.timeButtonText,
                                  {color: colorSelect.gray},
                                ]}
                              />
                            )}
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={[styles.timeButton]}
                            onPress={() => setHtime1Modal(true)}>
                            {checkhstime1 != '' ? (
                              <DefText
                                text={checkhstime1}
                                style={[styles.timeButtonText]}
                              />
                            ) : (
                              <DefText
                                text={'-'}
                                style={[
                                  styles.timeButtonText,
                                  {color: colorSelect.gray},
                                ]}
                              />
                            )}
                          </TouchableOpacity>
                          <DefText text={'~'} />
                          <TouchableOpacity
                            style={[styles.timeButton]}
                            onPress={() => setEtime1Modal(true)}>
                            {checkhetime1 != '' ? (
                              <DefText
                                text={checkhetime1}
                                style={[styles.timeButtonText]}
                              />
                            ) : (
                              <DefText
                                text={'-'}
                                style={[
                                  styles.timeButtonText,
                                  {color: colorSelect.gray},
                                ]}
                              />
                            )}
                          </TouchableOpacity>
                        </HStack>
                      </Box>
                      <Box mt="20px">
                        <DefText
                          text="2차 희망일"
                          style={[fweight.b, {marginBottom: 10}]}
                        />
                        <HStack
                          justifyContent={'space-between'}
                          alignItems="center">
                          <TouchableOpacity
                            style={[
                              styles.timeButton,
                              {width: (width - 80) * 0.34},
                            ]}
                            onPress={() => setHdate2Modal(true)}>
                            {checkhdate2 != '' ? (
                              <DefText
                                text={checkhdate2}
                                style={[styles.timeButtonText]}
                              />
                            ) : (
                              <DefText
                                text={'-'}
                                style={[
                                  styles.timeButtonText,
                                  {color: colorSelect.gray},
                                ]}
                              />
                            )}
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => setHtime2Modal(true)}
                            style={[styles.timeButton]}>
                            {checkhstime2 != '' ? (
                              <DefText
                                text={checkhstime2}
                                style={[styles.timeButtonText]}
                              />
                            ) : (
                              <DefText
                                text={'-'}
                                style={[
                                  styles.timeButtonText,
                                  {color: colorSelect.gray},
                                ]}
                              />
                            )}
                          </TouchableOpacity>
                          <DefText text={'~'} />
                          <TouchableOpacity
                            onPress={() => setEtime2Modal(true)}
                            style={[styles.timeButton]}>
                            {checkhetime2 != '' ? (
                              <DefText
                                text={checkhetime2}
                                style={[styles.timeButtonText]}
                              />
                            ) : (
                              <DefText
                                text={'-'}
                                style={[
                                  styles.timeButtonText,
                                  {color: colorSelect.gray},
                                ]}
                              />
                            )}
                          </TouchableOpacity>
                        </HStack>
                      </Box>
                      <Box mt="20px">
                        <DefText
                          text="기타"
                          style={[
                            fweight.eb,
                            {fontSize: fsize.fs16, marginBottom: 15},
                          ]}
                        />
                        <Box>
                          <DefInput
                            inputValue={seminarContent}
                            onChangeText={seminarContentChange}
                            placeholderText="대상자, 진행순서, 요청사항등 추가사항을 입력하세요."
                            inputStyle={{height: 150}}
                            multiline={true}
                            textAlignVertical={'top'}
                          />
                        </Box>
                      </Box>
                    </Box>
                  )}

                  {checkCate == 4 && (
                    <Box>
                      <Box mt="20px">
                        <DefText
                          text="1차 희망일"
                          style={[fweight.b, {marginBottom: 10}]}
                        />
                        <HStack
                          justifyContent={'space-between'}
                          alignItems="center">
                          <TouchableOpacity
                            style={[
                              styles.timeButton,
                              {width: (width - 80) * 0.34},
                            ]}
                            onPress={() => setHdate1Modal(true)}>
                            {checkhdate1 != '' ? (
                              <DefText
                                text={checkhdate1}
                                style={[styles.timeButtonText]}
                              />
                            ) : (
                              <DefText
                                text={'-'}
                                style={[
                                  styles.timeButtonText,
                                  {color: colorSelect.gray},
                                ]}
                              />
                            )}
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={[styles.timeButton]}
                            onPress={() => setHtime1Modal(true)}>
                            {checkhstime1 != '' ? (
                              <DefText
                                text={checkhstime1}
                                style={[styles.timeButtonText]}
                              />
                            ) : (
                              <DefText
                                text={'-'}
                                style={[
                                  styles.timeButtonText,
                                  {color: colorSelect.gray},
                                ]}
                              />
                            )}
                          </TouchableOpacity>
                          <DefText text={'~'} />
                          <TouchableOpacity
                            style={[styles.timeButton]}
                            onPress={() => setEtime1Modal(true)}>
                            {checkhetime1 != '' ? (
                              <DefText
                                text={checkhetime1}
                                style={[styles.timeButtonText]}
                              />
                            ) : (
                              <DefText
                                text={'-'}
                                style={[
                                  styles.timeButtonText,
                                  {color: colorSelect.gray},
                                ]}
                              />
                            )}
                          </TouchableOpacity>
                        </HStack>
                      </Box>
                      <Box mt="20px">
                        <DefText
                          text="2차 희망일"
                          style={[fweight.b, {marginBottom: 10}]}
                        />
                        <HStack
                          justifyContent={'space-between'}
                          alignItems="center">
                          <TouchableOpacity
                            style={[
                              styles.timeButton,
                              {width: (width - 80) * 0.34},
                            ]}
                            onPress={() => setHdate2Modal(true)}>
                            {checkhdate2 != '' ? (
                              <DefText
                                text={checkhdate2}
                                style={[styles.timeButtonText]}
                              />
                            ) : (
                              <DefText
                                text={'-'}
                                style={[
                                  styles.timeButtonText,
                                  {color: colorSelect.gray},
                                ]}
                              />
                            )}
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => setHtime2Modal(true)}
                            style={[styles.timeButton]}>
                            {checkhstime2 != '' ? (
                              <DefText
                                text={checkhstime2}
                                style={[styles.timeButtonText]}
                              />
                            ) : (
                              <DefText
                                text={'-'}
                                style={[
                                  styles.timeButtonText,
                                  {color: colorSelect.gray},
                                ]}
                              />
                            )}
                          </TouchableOpacity>
                          <DefText text={'~'} />
                          <TouchableOpacity
                            onPress={() => setEtime2Modal(true)}
                            style={[styles.timeButton]}>
                            {checkhetime2 != '' ? (
                              <DefText
                                text={checkhetime2}
                                style={[styles.timeButtonText]}
                              />
                            ) : (
                              <DefText
                                text={'-'}
                                style={[
                                  styles.timeButtonText,
                                  {color: colorSelect.gray},
                                ]}
                              />
                            )}
                          </TouchableOpacity>
                        </HStack>
                      </Box>
                      <Box mt="20px">
                        <DefText
                          text="고객의 자문요청내용"
                          style={[fweight.b, {marginBottom: 10}]}
                        />
                        <Box>
                          <DefInput
                            inputValue={cscontent}
                            onChangeText={cscontentChange}
                            inputStyle={{
                              width: width - 80,
                              height: 100,
                              borderRadius: 5,
                              borderColor: '#999',
                            }}
                            multiline={true}
                            textAlignVertical="top"
                          />
                        </Box>
                      </Box>
                      <Box mt="20px">
                        <DefText
                          text="코칭요청 세부내용"
                          style={[fweight.b, {marginBottom: 10}]}
                        />
                        <Box>
                          <DefInput
                            inputValue={coachingContent}
                            onChangeText={cochingContentChange}
                            inputStyle={{
                              width: width - 80,
                              height: 100,
                              borderRadius: 5,
                              borderColor: '#999',
                            }}
                            multiline={true}
                            textAlignVertical="top"
                          />
                        </Box>
                      </Box>
                    </Box>
                  )}
                  {userInfo.mb_4 > 1 && (
                    <Box mt="20px">
                      <DefText
                        text="확정일시"
                        style={[fweight.b, {marginBottom: 10}]}
                      />
                      <HStack
                        justifyContent={'space-between'}
                        alignItems="center">
                        {cstatus == 1 ? (
                          <TouchableOpacity
                            style={[
                              styles.timeButton,
                              {width: (width - 80) * 0.34, height: 40},
                            ]}
                            onPress={() => setConfirmDateModal(true)}>
                            {confirmDateAdm != '' ? (
                              <DefText
                                text={confirmDateAdm}
                                style={[styles.timeButtonText]}
                              />
                            ) : (
                              <DefText
                                text={'확정일시'}
                                style={[
                                  styles.timeButtonText,
                                  {color: colorSelect.gray},
                                ]}
                              />
                            )}
                          </TouchableOpacity>
                        ) : (
                          <Select
                            selectedValue={confirmDateAdm}
                            width={(width - 80) * 0.34}
                            height="41px"
                            fontSize={fsize.fs12}
                            style={fweight.r}
                            backgroundColor="#fff"
                            borderWidth={1}
                            borderColor="#999999"
                            onValueChange={itemValue =>
                              confirmDateSelect(itemValue)
                            }
                            placeholder="확정일시"
                            dropdownIcon={true}>
                            <Select.Item
                              label={checkhdate1}
                              value={checkhdate1}
                            />
                            <Select.Item
                              label={checkhdate2}
                              value={checkhdate2}
                            />
                          </Select>
                        )}
                        <TouchableOpacity
                          style={[styles.timeButton]}
                          onPress={() => setConfirmTimeModal1(true)}>
                          {confirmTime1 != '' ? (
                            <DefText
                              text={confirmTime1}
                              style={[styles.timeButtonText]}
                            />
                          ) : (
                            <DefText
                              text={'시간선택'}
                              style={[
                                styles.timeButtonText,
                                {color: colorSelect.gray},
                              ]}
                            />
                          )}
                        </TouchableOpacity>
                        <DefText text={'~'} />
                        <TouchableOpacity
                          style={[styles.timeButton]}
                          onPress={() => setConfirmTimeModal2(true)}>
                          {confirmTime2 != '' ? (
                            <DefText
                              text={confirmTime2}
                              style={[styles.timeButtonText]}
                            />
                          ) : (
                            <DefText
                              text={'시간선택'}
                              style={[
                                styles.timeButtonText,
                                {color: colorSelect.gray},
                              ]}
                            />
                          )}
                        </TouchableOpacity>
                      </HStack>
                    </Box>
                  )}
                  {userInfo?.mb_4 >= 3 &&
                  userInfo?.mb_0 == mb0 &&
                  userInfo?.mb_1 == mb1 &&
                  userInfo?.mb_3 == mb3 ? (
                    <HStack
                      alignItems={'center'}
                      justifyContent="center"
                      mt="20px">
                      {cstatus == 1 ? (
                        <TouchableOpacity
                          style={[styles.modalConfirmButton, {marginRight: 15}]}
                          onPress={serviceConfirmUpdate}
                          disabled={false}>
                          <DefText
                            text={'확정일자 변경'}
                            style={[{color: '#fff'}, fweight.b]}
                          />
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          style={[
                            styles.modalConfirmButton,
                            {marginRight: 15},
                            cstatus == 1 && {backgroundColor: '#999'},
                          ]}
                          onPress={serviceConfirmApi}
                          disabled={cstatus == 1 ? true : false}>
                          <DefText
                            text={'승인'}
                            style={[{color: '#fff'}, fweight.b]}
                          />
                        </TouchableOpacity>
                      )}

                      {cstatus == 1 ? (
                        <TouchableOpacity
                          style={[
                            styles.modalConfirmButton,
                            {backgroundColor: '#999'},
                          ]}
                          onPress={wmServiceUpdateHandler}
                          disabled={true}>
                          <DefText
                            text={'수정불가'}
                            style={[{color: '#fff'}, fweight.b]}
                          />
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          style={[
                            styles.modalConfirmButton,
                            !adminInsert && {backgroundColor: '#999'},
                          ]}
                          onPress={wmServiceUpdateHandler}
                          disabled={!adminInsert ? true : false}>
                          <DefText
                            text={!adminInsert ? '수정불가' : '수정'}
                            style={[{color: '#fff'}, fweight.b]}
                          />
                        </TouchableOpacity>
                      )}
                    </HStack>
                  ) : (
                    <HStack
                      alignItems={'center'}
                      justifyContent="center"
                      mt="20px">
                      {cstatus == 1 ? (
                        <TouchableOpacity
                          style={[
                            styles.modalConfirmButton,
                            {backgroundColor: '#999', marginRight: 15},
                          ]}
                          onPress={wmServiceUpdateHandler}
                          disabled={true}>
                          <DefText
                            text={'수정불가'}
                            style={[{color: '#fff'}, fweight.b]}
                          />
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          style={[
                            styles.modalConfirmButton,
                            {marginRight: 15},
                            !adminInsert && {backgroundColor: '#999'},
                          ]}
                          onPress={wmServiceUpdateHandler}
                          disabled={!adminInsert ? true : false}>
                          <DefText
                            text={!adminInsert ? '수정불가' : '수정'}
                            style={[{color: '#fff'}, fweight.b]}
                          />
                        </TouchableOpacity>
                      )}
                      {appInsert && (
                        <TouchableOpacity
                          style={[
                            styles.modalConfirmButton,
                            {backgroundColor: colorSelect.gray},
                          ]}
                          onPress={serviceContentCancle}>
                          <DefText
                            text="신청 취소"
                            style={[{color: '#fff'}, fweight.b]}
                          />
                        </TouchableOpacity>
                      )}
                    </HStack>
                  )}
                </Box>
              </Box>
            )}
          </Modal.Body>
        </Modal.Content>
      </Modal>
      <Modal
        isOpen={serviceResultModal}
        onClose={() => setServiceResultModal(false)}>
        <Modal.Content
          p="0"
          style={{
            width: Dimensions.get('screen').width - 40,
            minWidth: Dimensions.get('screen').width - 40,
            maxWidth: Dimensions.get('screen').width - 40,
          }}>
          <Modal.Body p="20px">
            <Box>
              <DefText text="고객명" style={[fweight.b, {marginBottom: 10}]} />
              <Box>
                <DefText text={resultContent.wname} />
              </Box>
            </Box>
            <Box mt="20px">
              <DefText
                text="신청구분"
                style={[fweight.b, {marginBottom: 10}]}
              />
              <Box>
                <DefText text={resultContent.wcatename} />
              </Box>
            </Box>
            <Box mt="20px">
              <DefText
                text="확정일시"
                style={[fweight.b, {marginBottom: 10}]}
              />
              <Box>
                <DefText
                  text={
                    resultContent.confirmStatus == 1
                      ? resultContent.confirmDate
                      : '-'
                  }
                />
              </Box>
            </Box>
            <Box mt="20px">
              <DefText text="상태" style={[fweight.b, {marginBottom: 10}]} />
              <Select
                selectedValue={serviceResult}
                width={width - 80}
                height="40px"
                fontSize={fsize.fs12}
                style={fweight.r}
                backgroundColor="#fff"
                borderWidth={1}
                borderColor="#999999"
                onValueChange={itemValue => setServiceResult(itemValue)}
                placeholder="선택하세요."
                isDisabled={userInfo.mb_level > 2 ? false : true}>
                <Select.Item label="코칭중" value="코칭중" />
                <Select.Item label="1차 상담" value="1차 상담" />
                <Select.Item label="제안서설계상담" value="제안서설계상담" />
                <Select.Item label="2차 상담" value="2차 상담" />
                <Select.Item label="계약체결" value="계약체결" />
                <Select.Item label="미체결 상담종료" value="미체결 상담종료" />
              </Select>
            </Box>
            {userInfo.mb_level != 2 && (
              <Box alignItems={'center'} mt="20px">
                <HStack>
                  <TouchableOpacity
                    style={[styles.modalConfirmButton]}
                    onPress={serviceResultHandler}>
                    <DefText text="등록" style={{color: colorSelect.white}} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setServiceResultModal(false)}
                    style={[
                      styles.modalConfirmButton,
                      {marginLeft: 10, backgroundColor: colorSelect.gray},
                    ]}>
                    <DefText text="닫기" style={{color: colorSelect.white}} />
                  </TouchableOpacity>
                </HStack>
              </Box>
            )}
          </Modal.Body>
        </Modal.Content>
      </Modal>
      {/* 1차희망일 */}
      <DateTimePickerModal
        isVisible={hdate1Modal}
        mode="date"
        onConfirm={hdate1Handler}
        onCancel={hdateClose}
        display={'spinner'}
        minimumDate={new Date()}
      />
      <DateTimePickerModal
        isVisible={htime1Modal}
        mode="time"
        onConfirm={htime1Handler}
        onCancel={htime1Close}
        display={'spinner'}
      />
      <DateTimePickerModal
        isVisible={etime1Modal}
        mode="time"
        onConfirm={etime1Handler}
        onCancel={etime1Close}
        display={'spinner'}
      />

      {/* 2차희망일 */}
      <DateTimePickerModal
        isVisible={hdate2Modal}
        mode="date"
        onConfirm={hdate2Handler}
        onCancel={hdate2Close}
        display={'spinner'}
        minimumDate={new Date()}
      />
      <DateTimePickerModal
        isVisible={htime2Modal}
        mode="time"
        onConfirm={htime2Handler}
        onCancel={htime2Close}
        display={'spinner'}
      />
      <DateTimePickerModal
        isVisible={etime2Modal}
        mode="time"
        onConfirm={etime2Handler}
        onCancel={etime2Close}
        display={'spinner'}
      />

      {/* 확정일시 */}
      <DateTimePickerModal
        isVisible={confirmDateModal}
        mode="date"
        onConfirm={confirmDateModalHandler}
        onCancel={confirmDateModalClose}
        display={'spinner'}
        minimumDate={new Date()}
      />
      <DateTimePickerModal
        isVisible={confirmTimeModal1}
        mode="time"
        onConfirm={confirmTimeModalHandler}
        onCancel={confirmTimeModalClose}
        display={'spinner'}
      />
      <DateTimePickerModal
        isVisible={confirmTimeModal2}
        mode="time"
        onConfirm={confirmTime2ModalHandler}
        onCancel={confirmTime2ModalClose}
        display={'spinner'}
      />
    </Box>
  );
};

const styles = StyleSheet.create({
  wmButton: {
    //width: (width - 40) * 0.32,
    height: 35,
    paddingHorizontal: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
  },
  wmButtonText: {
    fontSize: fsize.fs12,
  },
  wmBoxHead: {
    width: (width - 40) * 0.1,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#aaa',
    borderWidth: 1,
    borderColor: colorSelect.white,
  },
  wmBoxHeadText: {
    fontSize: fsize.fs12,
    color: colorSelect.white,
    ...fweight.b,
  },
  wmBoxBody: {
    width: (width - 40) * 0.1,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colorSelect.black666,
    paddingVertical: 10,
    paddingHorizontal: 0,
  },
  wmBoxBodyText: {
    fontSize: fsize.fs12,
    color: colorSelect.black1,
  },
  timeButton: {
    width: (width - 80) * 0.27,
    height: 40,
    borderWidth: 1,
    borderColor: '#999999',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeButtonText: {
    fontSize: fsize.fs12,
  },
  modalConfirmButton: {
    width: (width - 80) * 0.45,
    height: 40,
    backgroundColor: colorSelect.blue,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
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
)(WMService);
