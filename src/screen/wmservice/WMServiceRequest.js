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
} from 'react-native';
import {connect} from 'react-redux';
import {actionCreators as UserAction} from '../../redux/module/action/UserAction';
import HeaderDef from '../../components/HeaderDef';
import Api from '../../Api';
import {colorSelect, fsize, fweight} from '../../common/StyleDef';
import {DefInput, DefText} from '../../common/BOOTSTRAP';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import Font from '../../common/Font';
import HTML from 'react-native-render-html';
import StyleHtml from '../../common/StyleHtml';
import ToastMessage from '../../components/ToastMessage';

const {width, height} = Dimensions.get('window');

const systemFonts = [...Font.NanumSquareRoundR, 'NanumSquareRoundR'];

const WebRender = React.memo(function WebRender({html}) {
  return (
    <HTML
      source={{html: html}}
      ignoredStyles={['width', 'height', 'margin', 'padding']}
      ignoredTags={['head', 'script', 'src']}
      imagesMaxWidth={width - 40}
      contentWidth={width}
      tagsStyles={StyleHtml}
      systemFonts={systemFonts}
    />
  );
});

const WMServiceRequest = props => {
  const {navigation, userInfo} = props;

  const [serviceValue, setServiceValue] = useState('');
  const [wmCategory, setWmCategory] = useState([]); //카테고리
  const [customer, setCustomer] = useState(''); //고객명
  const [untact, setUntact] = useState(''); // 대면,비대면
  const [wpathValue, setWpathValue] = useState(''); //모집경로
  const [ctypeValue, setCtypeValue] = useState(''); //고객타입

  const [hdateModal, setHdateModal] = useState(false); //1차희망일 모달
  const [hdate1, setHdate1] = useState(''); //1차희망일
  const [htimeModal, setHtimeModal] = useState(false); //1차희망 시작시간 모달
  const [htime1, setHtime1] = useState(''); //1차희망 시작시간
  const [etimeModal, setEtimeModal] = useState(false); //1차희망 마감시간 모달
  const [etime1, setEtime1] = useState(''); //1차희망 마감시간

  const [hdateModal2, setHdateModal2] = useState(false); //2차희망일 모달
  const [hdate2, setHdate2] = useState(''); //2차희망일
  const [htimeModal2, setHtimeModal2] = useState(false); //2차희망 시작시간 모달
  const [htime2, setHtime2] = useState(''); //2차희망 시작시간
  const [etimeModal2, setEtimeModal2] = useState(false); //2차희망 마감시간 모달
  const [etime2, setEtime2] = useState(''); //2차희망 마감시간

  const [customerContent, setCustomerContent] = useState(''); //고객의 자문요청내용
  const [fpContent, setFpContent] = useState('');

  const [confirmModal, setConfirmModal] = useState(false);

  const [contentModal, setContentModal] = useState(false);
  const [contents, setContents] = useState('');

  //고객명 입력
  const customerChange = text => {
    setCustomer(text);
  };

  //1차희망일 날짜선택 모달열기
  const hdateModalHandler = date => {
    hdateModalPickerHide();
    setHdate1(moment(date).format('yyyy-MM-DD'));
  };

  //1차희망일 날짜선택 모달 닫기
  const hdateModalPickerHide = () => {
    setHdateModal(false);
  };

  //1차 희망일 시작시간 모달 열기
  const htimeModalHandler = time => {
    //console.log("htime1", moment(time).format("H:mm"));
    htimeModalPickerHide();
    setHtime1(moment(time).format('H:mm'));
  };

  //1차 희망일 시작시간 모달 닫기
  const htimeModalPickerHide = () => {
    setHtimeModal(false);
  };

  //1차 희망일 마감시간 모달 열기
  const etimeModalHandler = time => {
    etimeModalPickerHide();
    setEtime1(moment(time).format('H:mm'));
  };

  //1차 희망일 마감시간 모달 닫기
  const etimeModalPickerHide = () => {
    setEtimeModal(false);
  };

  //2차희망일 날짜선택 모달열기
  const hdateModalHandler2 = date => {
    hdateModalPickerHide2();
    setHdate2(moment(date).format('yyyy-MM-DD'));
  };

  //2차희망일 날짜선택 모달 닫기
  const hdateModalPickerHide2 = () => {
    setHdateModal2(false);
  };

  //2차 희망일 시작시간 모달열기
  const htimeModalHandler2 = time => {
    //console.log("htime1", moment(time).format("H:mm"));
    htimeModalPickerHide2();
    setHtime2(moment(time).format('H:mm'));
  };

  //2차 희망일 시작시간 모달 닫기
  const htimeModalPickerHide2 = () => {
    setHtimeModal2(false);
  };

  //2차 희망일 마감시간 모달 열기
  const etimeModalHandler2 = time => {
    etimeModalPickerHide2();
    setEtime2(moment(time).format('H:mm'));
  };

  //2차 희망일 마감시간 모달 닫기
  const etimeModalPickerHide2 = () => {
    setEtimeModal2(false);
  };

  const customerContentChange = text => {
    setCustomerContent(text);
  };

  const fpContentChange = text => {
    setFpContent(text);
  };

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

  const wmCategoryContentApi = () => {
    Api.send('wm_categoryContent', {cidx: serviceValue}, args => {
      let resultItem = args.resultItem;
      let arrItems = args.arrItems;

      if (resultItem.result === 'Y' && arrItems) {
        //console.log('wm 서비스 카테고리 모달띄우기: ', arrItems, resultItem);
        setContentModal(true);
        setContents(arrItems);
        //setWmCategory(arrItems);
      } else {
        console.log('wm 서비스 카테고리 모달띄우기 실패!!', resultItem);
      }
    });
  };

  const wmRequestApi = () => {
    let apiData;
    if (serviceValue == 1) {
      apiData = {
        wcate: serviceValue,
        wname: customer,
        untact: untact,
        wpath: wpathValue,
        ctype: ctypeValue,
        hdate1: hdate1,
        hstime1: htime1,
        hetime1: etime1,
        hdate2: hdate2,
        hstime2: htime2,
        hetime2: etime2,
        ccont: customerContent,
        fpcont: fpContent,
        fpidx: userInfo?.mb_no,
      };
    } else if (serviceValue == 2 || serviceValue == 5) {
      apiData = {
        wcate: serviceValue,
        customerNumber: customerNumber,
        fpNumber: fpNumber,
        areaValue: areaValue,
        seminarTitle: seminarTitle,
        hdate1: hdate1,
        hstime1: htime1,
        hetime1: etime1,
        hdate2: hdate2,
        hstime2: htime2,
        hetime2: etime2,
        seminarContent: seminarContent,
        fpidx: userInfo?.mb_no,
      };
    } else if (serviceValue == 4) {
      apiData = {
        wcate: serviceValue,
        hdate1: hdate1,
        hstime1: htime1,
        hetime1: etime1,
        hdate2: hdate2,
        hstime2: htime2,
        hetime2: etime2,
        ccont: customerContent,
        coachingContent: coachingContent,
        fpidx: userInfo?.mb_no,
      };
    }

    Api.send('wm_request', apiData, args => {
      let resultItem = args.resultItem;
      let arrItems = args.arrItems;

      if (resultItem.result === 'Y' && arrItems) {
        console.log('wm 서비스 신청하기 성공: ', arrItems, resultItem);
        ToastMessage(resultItem.message);
        navigation.goBack();
        setConfirmModal(false);
        //setWmCategory(arrItems);
      } else {
        console.log('wm 서비스 신청하기 실패!!', resultItem);
        setConfirmModal(false);
        ToastMessage(resultItem.message);
      }
    });
  };

  useEffect(() => {
    wmCategoryListApi();
  }, []);

  useEffect(() => {
    if (serviceValue != '') {
      wmCategoryContentApi();
    }
  }, [serviceValue]);

  return (
    <Box flex={1} backgroundColor="#fff">
      <HeaderDef headerTitle="WM서비스 신청" navigation={navigation} />
      <ScrollView>
        <Box p="20px">
          {/* <HStack>
                        <TouchableOpacity
                            style={[styles.wmButton]}
                        >
                            <DefText text="WM서비스 일정확인" style={[styles.wmButtonText]} />
                        </TouchableOpacity>
                    </HStack> */}
          <Box>
            <DefText
              text="신청구분"
              style={[fweight.eb, {fontSize: fsize.fs16, marginBottom: 15}]}
            />
            <Select
              placeholder="신청구분을 선택하세요."
              selectedValue={serviceValue}
              width={width - 40}
              height="40px"
              fontSize={fsize.fs12}
              style={fweight.r}
              backgroundColor="#fff"
              borderWidth={1}
              borderColor="#999999"
              onValueChange={itemValue => setServiceValue(itemValue)}>
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
          {serviceValue == 1 && (
            <Box>
              <Box mt="30px">
                <DefText
                  text="고객명"
                  style={[fweight.eb, {fontSize: fsize.fs16, marginBottom: 15}]}
                />
                <Box>
                  <DefInput
                    value={customer}
                    onChangeText={customerChange}
                    placeholderText="고객명을 입력하세요."
                  />
                </Box>
              </Box>
              <Box mt="30px">
                <DefText
                  text="대면여부"
                  style={[fweight.eb, {fontSize: fsize.fs16, marginBottom: 15}]}
                />
                <Box>
                  <HStack alignItems={'center'}>
                    <TouchableOpacity
                      onPress={() => setUntact('1')}
                      style={{marginRight: 15}}>
                      <HStack alignItems={'center'}>
                        <Box style={[styles.radioBox]}>
                          {untact === '1' && (
                            <Box style={[styles.radioCheck]} />
                          )}
                        </Box>
                        <DefText text="대면" />
                      </HStack>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setUntact('0')}>
                      <HStack alignItems={'center'}>
                        <Box style={[styles.radioBox]}>
                          {untact === '0' && (
                            <Box style={[styles.radioCheck]} />
                          )}
                        </Box>
                        <DefText text="비대면" />
                      </HStack>
                    </TouchableOpacity>
                  </HStack>
                </Box>
              </Box>
              <Box mt="30px">
                <DefText
                  text="모집경로"
                  style={[fweight.eb, {fontSize: fsize.fs16, marginBottom: 15}]}
                />
                <Select
                  placeholder="모집경로를 선택하세요."
                  selectedValue={wpathValue}
                  width={width - 40}
                  height="40px"
                  fontSize={fsize.fs12}
                  style={fweight.r}
                  backgroundColor="#fff"
                  borderWidth={1}
                  borderColor="#999999"
                  onValueChange={itemValue => setWpathValue(itemValue)}>
                  <Select.Item
                    label="지인/가족/자진청약"
                    value="지인/가족/자진청약"
                  />
                  <Select.Item label="소개/개척" value="소개/개척" />
                  <Select.Item label="기계약자" value="기계약자" />
                  <Select.Item
                    label="DB(본인 또는 가족)"
                    value="DB(본인 또는 가족)"
                  />
                  <Select.Item label="DB소개" value="DB소개" />
                </Select>
              </Box>
              <Box mt="30px">
                <DefText
                  text="고객타입"
                  style={[fweight.eb, {fontSize: fsize.fs16, marginBottom: 15}]}
                />
                <Select
                  placeholder="고객타입을 선택하세요."
                  selectedValue={ctypeValue}
                  width={width - 40}
                  height="40px"
                  fontSize={fsize.fs12}
                  style={fweight.r}
                  backgroundColor="#fff"
                  borderWidth={1}
                  borderColor="#999999"
                  onValueChange={itemValue => setCtypeValue(itemValue)}>
                  <Select.Item label="개인" value="개인" />
                  <Select.Item label="법인" value="법인" />
                  <Select.Item label="개인+법인" value="개인+법인" />
                </Select>
              </Box>
              <Box mt="30px">
                <DefText
                  text="1차 희망일"
                  style={[fweight.eb, {fontSize: fsize.fs16, marginBottom: 15}]}
                />
                <HStack justifyContent={'space-between'} alignItems="center">
                  <TouchableOpacity
                    onPress={() => setHdateModal(true)}
                    style={[styles.dateButton]}>
                    <DefText
                      text={hdate1 != '' ? hdate1 : '희망일 선택'}
                      style={[
                        hdate1 == '' && {color: '#999', fontSize: fsize.fs12},
                      ]}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setHtimeModal(true)}
                    style={[styles.timeButton]}>
                    <DefText
                      text={htime1 != '' ? htime1 : '희망시간'}
                      style={[
                        htime1 == '' && {color: '#999', fontSize: fsize.fs12},
                      ]}
                    />
                  </TouchableOpacity>
                  <Box>
                    <DefText text="~" />
                  </Box>
                  <TouchableOpacity
                    onPress={() => setEtimeModal(true)}
                    style={[styles.timeButton]}>
                    <DefText
                      text={etime1 != '' ? etime1 : '희망시간'}
                      style={[
                        etime1 == '' && {color: '#999', fontSize: fsize.fs12},
                      ]}
                    />
                  </TouchableOpacity>
                </HStack>
              </Box>
              <Box mt="30px">
                <DefText
                  text="2차 희망일"
                  style={[fweight.eb, {fontSize: fsize.fs16, marginBottom: 15}]}
                />
                <HStack justifyContent={'space-between'} alignItems="center">
                  <TouchableOpacity
                    onPress={() => setHdateModal2(true)}
                    style={[styles.dateButton]}>
                    <DefText
                      text={hdate2 != '' ? hdate2 : '희망일 선택'}
                      style={[
                        hdate2 == '' && {color: '#999', fontSize: fsize.fs12},
                      ]}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setHtimeModal2(true)}
                    style={[styles.timeButton]}>
                    <DefText
                      text={htime2 != '' ? htime2 : '희망시간'}
                      style={[
                        htime2 == '' && {color: '#999', fontSize: fsize.fs12},
                      ]}
                    />
                  </TouchableOpacity>
                  <Box>
                    <DefText text="~" />
                  </Box>
                  <TouchableOpacity
                    onPress={() => setEtimeModal2(true)}
                    style={[styles.timeButton]}>
                    <DefText
                      text={etime2 != '' ? etime2 : '희망시간'}
                      style={[
                        etime2 == '' && {color: '#999', fontSize: fsize.fs12},
                      ]}
                    />
                  </TouchableOpacity>
                </HStack>
              </Box>
              <Box mt="30px">
                <DefText
                  text="고객의 자문요청내용"
                  style={[fweight.eb, {fontSize: fsize.fs16, marginBottom: 15}]}
                />
                <Box>
                  <DefInput
                    value={customerContent}
                    placeholderText="고객의 자문요청내용을 입력하세요."
                    onChangeText={setCustomerContent}
                    inputStyle={{height: 100}}
                    multiline={true}
                    textAlignVertical="top"
                  />
                </Box>
              </Box>
              <Box mt="30px">
                <DefText
                  text="상담을 통해 FP님이 원하는 내용"
                  style={[fweight.eb, {fontSize: fsize.fs16, marginBottom: 15}]}
                />
                <Box>
                  <DefInput
                    value={fpContent}
                    placeholderText="상담을 통해 FP님이 원하는 내용을 입력하세요."
                    onChangeText={fpContentChange}
                    inputStyle={{height: 100}}
                    multiline={true}
                    textAlignVertical="top"
                  />
                </Box>
              </Box>
            </Box>
          )}
          {(serviceValue == 2 || serviceValue == 5) && (
            <Box>
              <Box mt="30px">
                <DefText
                  text="참석인원"
                  style={[fweight.eb, {fontSize: fsize.fs16, marginBottom: 15}]}
                />
                <HStack justifyContent={'space-between'}>
                  {serviceValue == 2 && (
                    <HStack alignItems={'center'}>
                      <DefInput
                        value={customerNumber}
                        onChangeText={customerNumChange}
                        placeholderText="고객 수를 입력하세요"
                        inputStyle={{
                          marginRight: 10,
                          width: (width - 40) * 0.4,
                        }}
                        keyboardType={'number-pad'}
                      />
                      <DefText text="명" />
                    </HStack>
                  )}

                  <HStack alignItems={'center'}>
                    <DefInput
                      value={fpNumber}
                      onChangeText={fpNumChange}
                      placeholderText="fp 수를 입력하세요."
                      inputStyle={{marginRight: 10, width: (width - 40) * 0.4}}
                      keyboardType={'number-pad'}
                    />
                    <DefText text="명" />
                  </HStack>
                </HStack>
              </Box>
              <Box mt="30px">
                <DefText
                  text="장소"
                  style={[fweight.eb, {fontSize: fsize.fs16, marginBottom: 15}]}
                />
                <Box>
                  <DefInput
                    value={areaValue}
                    onChangeText={areaChange}
                    placeholderText="장소를 입력하세요."
                  />
                </Box>
              </Box>
              <Box mt="30px">
                <DefText
                  text="희망주제"
                  style={[fweight.eb, {fontSize: fsize.fs16, marginBottom: 15}]}
                />
                <Box>
                  <DefInput
                    value={seminarTitle}
                    onChangeText={seminarChange}
                    placeholderText="희망주제를 입력하세요."
                  />
                </Box>
              </Box>
              <Box mt="30px">
                <DefText
                  text="1차 희망일"
                  style={[fweight.eb, {fontSize: fsize.fs16, marginBottom: 15}]}
                />
                <HStack justifyContent={'space-between'} alignItems="center">
                  <TouchableOpacity
                    onPress={() => setHdateModal(true)}
                    style={[styles.dateButton]}>
                    <DefText
                      text={hdate1 != '' ? hdate1 : '희망일 선택'}
                      style={[
                        hdate1 == '' && {color: '#999', fontSize: fsize.fs12},
                      ]}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setHtimeModal(true)}
                    style={[styles.timeButton]}>
                    <DefText
                      text={htime1 != '' ? htime1 : '희망시간'}
                      style={[
                        htime1 == '' && {color: '#999', fontSize: fsize.fs12},
                      ]}
                    />
                  </TouchableOpacity>
                  <Box>
                    <DefText text="~" />
                  </Box>
                  <TouchableOpacity
                    onPress={() => setEtimeModal(true)}
                    style={[styles.timeButton]}>
                    <DefText
                      text={etime1 != '' ? etime1 : '희망시간'}
                      style={[
                        etime1 == '' && {color: '#999', fontSize: fsize.fs12},
                      ]}
                    />
                  </TouchableOpacity>
                </HStack>
              </Box>
              <Box mt="30px">
                <DefText
                  text="2차 희망일"
                  style={[fweight.eb, {fontSize: fsize.fs16, marginBottom: 15}]}
                />
                <HStack justifyContent={'space-between'} alignItems="center">
                  <TouchableOpacity
                    onPress={() => setHdateModal2(true)}
                    style={[styles.dateButton]}>
                    <DefText
                      text={hdate2 != '' ? hdate2 : '희망일 선택'}
                      style={[
                        hdate2 == '' && {color: '#999', fontSize: fsize.fs12},
                      ]}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setHtimeModal2(true)}
                    style={[styles.timeButton]}>
                    <DefText
                      text={htime2 != '' ? htime2 : '희망시간'}
                      style={[
                        htime2 == '' && {color: '#999', fontSize: fsize.fs12},
                      ]}
                    />
                  </TouchableOpacity>
                  <Box>
                    <DefText text="~" />
                  </Box>
                  <TouchableOpacity
                    onPress={() => setEtimeModal2(true)}
                    style={[styles.timeButton]}>
                    <DefText
                      text={etime2 != '' ? etime2 : '희망시간'}
                      style={[
                        etime2 == '' && {color: '#999', fontSize: fsize.fs12},
                      ]}
                    />
                  </TouchableOpacity>
                </HStack>
              </Box>
              <Box mt="30px">
                <DefText
                  text="기타"
                  style={[fweight.eb, {fontSize: fsize.fs16, marginBottom: 15}]}
                />
                <Box>
                  <DefInput
                    value={seminarContent}
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
          {serviceValue == 4 && (
            <Box>
              <Box mt="30px">
                <DefText
                  text="1차 희망일"
                  style={[fweight.eb, {fontSize: fsize.fs16, marginBottom: 15}]}
                />
                <HStack justifyContent={'space-between'} alignItems="center">
                  <TouchableOpacity
                    onPress={() => setHdateModal(true)}
                    style={[styles.dateButton]}>
                    <DefText
                      text={hdate1 != '' ? hdate1 : '희망일 선택'}
                      style={[
                        hdate1 == '' && {color: '#999', fontSize: fsize.fs12},
                      ]}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setHtimeModal(true)}
                    style={[styles.timeButton]}>
                    <DefText
                      text={htime1 != '' ? htime1 : '희망시간'}
                      style={[
                        htime1 == '' && {color: '#999', fontSize: fsize.fs12},
                      ]}
                    />
                  </TouchableOpacity>
                  <Box>
                    <DefText text="~" />
                  </Box>
                  <TouchableOpacity
                    onPress={() => setEtimeModal(true)}
                    style={[styles.timeButton]}>
                    <DefText
                      text={etime1 != '' ? etime1 : '희망시간'}
                      style={[
                        etime1 == '' && {color: '#999', fontSize: fsize.fs12},
                      ]}
                    />
                  </TouchableOpacity>
                </HStack>
              </Box>
              <Box mt="30px">
                <DefText
                  text="2차 희망일"
                  style={[fweight.eb, {fontSize: fsize.fs16, marginBottom: 15}]}
                />
                <HStack justifyContent={'space-between'} alignItems="center">
                  <TouchableOpacity
                    onPress={() => setHdateModal2(true)}
                    style={[styles.dateButton]}>
                    <DefText
                      text={hdate2 != '' ? hdate2 : '희망일 선택'}
                      style={[
                        hdate2 == '' && {color: '#999', fontSize: fsize.fs12},
                      ]}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setHtimeModal2(true)}
                    style={[styles.timeButton]}>
                    <DefText
                      text={htime2 != '' ? htime2 : '희망시간'}
                      style={[
                        htime2 == '' && {color: '#999', fontSize: fsize.fs12},
                      ]}
                    />
                  </TouchableOpacity>
                  <Box>
                    <DefText text="~" />
                  </Box>
                  <TouchableOpacity
                    onPress={() => setEtimeModal2(true)}
                    style={[styles.timeButton]}>
                    <DefText
                      text={etime2 != '' ? etime2 : '희망시간'}
                      style={[
                        etime2 == '' && {color: '#999', fontSize: fsize.fs12},
                      ]}
                    />
                  </TouchableOpacity>
                </HStack>
              </Box>
              <Box mt="30px">
                <DefText
                  text="자문요청내용"
                  style={[fweight.eb, {fontSize: fsize.fs16, marginBottom: 15}]}
                />
                <Box>
                  <DefInput
                    value={customerContent}
                    placeholderText="자문요청내용을 입력하세요."
                    onChangeText={setCustomerContent}
                    inputStyle={{height: 100}}
                    multiline={true}
                    textAlignVertical="top"
                  />
                </Box>
              </Box>
              <Box mt="30px">
                <DefText
                  text="코칭요청 세부내용"
                  style={[fweight.eb, {fontSize: fsize.fs16, marginBottom: 15}]}
                />
                <Box>
                  <DefInput
                    value={coachingContent}
                    placeholderText="고객의 재무정보, 상담진행상황, 특이사항등을 입력하세요."
                    onChangeText={cochingContentChange}
                    inputStyle={{height: 100}}
                    multiline={true}
                    textAlignVertical="top"
                  />
                </Box>
              </Box>
            </Box>
          )}
        </Box>
      </ScrollView>
      <TouchableOpacity
        onPress={() => setConfirmModal(true)}
        style={[
          {
            width: width,
            height: 45,
            backgroundColor: colorSelect.blue,
            alignItems: 'center',
            justifyContent: 'center',
          },
        ]}>
        <DefText
          text="신청"
          style={{color: colorSelect.white, fontSize: fsize.fs16, ...fweight.b}}
        />
      </TouchableOpacity>
      <Modal isOpen={contentModal} onClose={() => setContentModal(false)}>
        <Modal.Content
          style={{
            width: Dimensions.get('screen').width - 40,
            minWidth: Dimensions.get('screen').width - 40,
            maxWidth: Dimensions.get('screen').width - 40,
          }}>
          <Modal.Body>
            {contents != '' && (
              <Box>
                <Box>
                  <DefText
                    text={contents.wcate + ' 운영지침'}
                    style={{fontSize: fsize.fs16, ...fweight.eb}}
                  />
                </Box>
                <Box mt="20px">
                  <WebRender html={contents.wcontent} />
                </Box>

                <Box alignItems={'center'} mt="15px">
                  <TouchableOpacity
                    style={[
                      styles.modalButton,
                      {backgroundColor: colorSelect.blue},
                    ]}
                    onPress={() => setContentModal(false)}>
                    <DefText text="확인" style={{color: colorSelect.white}} />
                  </TouchableOpacity>
                </Box>
              </Box>
            )}
          </Modal.Body>
        </Modal.Content>
      </Modal>
      <Modal isOpen={confirmModal} onClose={() => setConfirmModal(false)}>
        <Modal.Content
          p="20px"
          style={{
            width: Dimensions.get('screen').width - 40,
            minWidth: Dimensions.get('screen').width - 40,
            maxWidth: Dimensions.get('screen').width - 40,
          }}>
          <Modal.Body p="0">
            <DefText
              text="WM서비스를 신청하시겠습니까?"
              style={[fweight.b, {fontSize: fsize.fs16}]}
            />
            <HStack justifyContent={'space-between'} mt="15px">
              <TouchableOpacity
                style={[
                  styles.modalButton,
                  {backgroundColor: colorSelect.blue},
                ]}
                onPress={wmRequestApi}>
                <DefText text="신청" style={{color: colorSelect.white}} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setConfirmModal(false)}
                style={[
                  styles.modalButton,
                  {backgroundColor: colorSelect.gray},
                ]}>
                <DefText text="닫기" style={{color: colorSelect.white}} />
              </TouchableOpacity>
            </HStack>
          </Modal.Body>
        </Modal.Content>
      </Modal>
      <DateTimePickerModal
        isVisible={hdateModal}
        mode="date"
        onConfirm={hdateModalHandler}
        onCancel={hdateModalPickerHide}
        display={'spinner'}
        minimumDate={new Date()}
      />
      <DateTimePickerModal
        isVisible={htimeModal}
        mode="time"
        onConfirm={htimeModalHandler}
        onCancel={htimeModalPickerHide}
        display={'spinner'}
        //minimumDate={new Date()}
      />
      <DateTimePickerModal
        isVisible={etimeModal}
        mode="time"
        onConfirm={etimeModalHandler}
        onCancel={etimeModalPickerHide}
        display={'spinner'}
        //minimumDate={new Date()}
      />

      <DateTimePickerModal
        isVisible={hdateModal2}
        mode="date"
        onConfirm={hdateModalHandler2}
        onCancel={hdateModalPickerHide2}
        display={'spinner'}
        minimumDate={new Date()}
      />
      <DateTimePickerModal
        isVisible={htimeModal2}
        mode="time"
        onConfirm={htimeModalHandler2}
        onCancel={htimeModalPickerHide2}
        display={'spinner'}
        //minimumDate={new Date()}
      />
      <DateTimePickerModal
        isVisible={etimeModal2}
        mode="time"
        onConfirm={etimeModalHandler2}
        onCancel={etimeModalPickerHide2}
        display={'spinner'}
        //minimumDate={new Date()}
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
  radioBox: {
    width: 18,
    height: 18,
    borderRadius: 20,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5,
  },
  radioCheck: {
    width: 10,
    height: 10,
    borderRadius: 10,
    backgroundColor: colorSelect.blue,
  },
  dateButton: {
    width: (width - 40) * 0.34,
    height: 40,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#999',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeButton: {
    width: (width - 40) * 0.27,
    height: 40,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#999',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalButton: {
    width: (width - 80) * 0.47,
    height: 45,
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
)(WMServiceRequest);
