import React, {useState, useEffect} from 'react';
import {
  ScrollView,
  Platform,
  Dimensions,
  StyleSheet,
  Alert,
  View,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
  PermissionsAndroid,
} from 'react-native';
import {Box, VStack, HStack, Image, Modal, Select} from 'native-base';
import {
  DefInput,
  DefText,
  SearchInput,
  SubmitButtons,
} from '../common/BOOTSTRAP';
import Font from '../common/Font';
import HeaderDef from '../components/HeaderDef';
import {fsize, fweight, colorSelect, textStyle} from '../common/StyleDef';
import {
  allClient,
  allClientYes,
  allClientNo,
  searchSettingCategory,
} from '../Utils/DummyData';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import WebView from 'react-native-webview';

import {connect} from 'react-redux';
import {actionCreators as UserAction} from '../redux/module/action/UserAction';
import {StackActions} from '@react-navigation/native';
import Api from '../Api';
import ToastMessage from '../components/ToastMessage';

import {BASE_URL} from '../Utils/APIConstant';

import DocumentPicker from 'react-native-document-picker';
import {PERMISSIONS, request, RESULTS} from 'react-native-permissions';
import {CALL_PERMISSIONS_NOTI, usePermissions} from '../hooks/usePermissions';
var RNFetchBlob = require('rn-fetch-blob').default;

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

const {width} = Dimensions.get('window');
const categoryBtn = (width - 40) * 0.32;
const categoryPadding = (width - 40) * 0.02;

const platformPermissions =
  Platform.OS === 'ios'
    ? PERMISSIONS.IOS.PHOTO_LIBRARY
    : PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE;

const settingNavigation = async () => {
  await ToastMessage('앱 설정 -> 파일 다운로드 권한을 허용해주세요.');
  await setTimeout(() => {
    Linking.openSettings();
  }, 2000);
};

const ClientInfo = props => {
  const {navigation, route, userInfo} = props;

  const {params} = route;

  const isFocused = useIsFocused();

  if (Platform.OS === 'android') {
    usePermissions(CALL_PERMISSIONS_NOTI);
  }

  const filePermissioned = async (path, fileName) => {
    console.log(path);
    try {
      const result = await request(platformPermissions);
      console.log('result', result);
      console.log(RESULTS.GRANTED);
      result === RESULTS.GRANTED
        ? checkPermission(path, fileName)
        : settingNavigation();
    } catch (err) {
      ToastMessage(err);
    }
  };

  //파일 다운로드
  //퍼미션 체크
  const checkPermission = async (files, fileName) => {
    let fileUrl = files;
    // Function to check the platform
    // If Platform is Android then check for permissions.

    if (Platform.OS === 'ios') {
      downloadFile(fileUrl, fileName);
    } else {
      downloadFile(fileUrl, fileName);
      // try {
      //   const granted = await PermissionsAndroid.request(
      //     PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      //     {
      //       title: 'Storage Permission Required',
      //       message:
      //         'Application needs access to your storage to download File',
      //     },
      //   );
      //   if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      //     // Start downloading
      //     downloadFile(fileUrl, fileName);
      //     console.log('Storage Permission Granted.');
      //   } else {
      //     // If permission denied then show alert
      //     Alert.alert('Error', 'Storage Permission Not Granted');
      //   }
      // } catch (err) {
      //   // To handle permission related exception
      //   console.log('++++' + err);
      // }
    }
  };

  const getFileExtention = fileUrl => {
    // To get the file extension
    return /[.]/.exec(fileUrl) ? /[^.]+$/.exec(fileUrl) : undefined;
  };

  const downloadFile = (fileUrl, fileName) => {
    // Get today's date to add the time suffix in filename
    let date = new Date();
    // File URL which we want to download
    let FILE_URL = fileUrl;
    // Function to get extention of the file url
    let file_ext = getFileExtention(FILE_URL);

    file_ext = '.' + file_ext[0];

    // config: To get response by passing the downloading related options
    // fs: Root directory path to download
    const {config, fs} = RNFetchBlob;
    let RootDir =
      Platform.OS === 'ios' ? fs.dirs.DocumentDir : fs.dirs.DownloadDir;

    let options = {
      fileCache: true,
      path: RootDir + '/' + fileName + file_ext,
      addAndroidDownloads: {
        path: RootDir + '/' + fileName + file_ext,
        description: 'downloading file...',
        notification: true,
        // useDownloadManager works with Android only
        useDownloadManager: true,
      },
    };
    config(options)
      .fetch('GET', FILE_URL)
      .then(async res => {
        // Alert after successful downloading
        console.log('파일명 ㄱㄱㄱ', RootDir + '/' + fileName + file_ext);
        console.log('res -> ', JSON.stringify(res));
        ToastMessage('파일 다운로드가 완료되었습니다.');
        console.log(RootDir);
      });
  };

  //진행상태변경 모달
  const [statusModal, setStatusModal] = useState(false);
  const statusModalClose = () => {
    setStatusModal(false);
  };

  const [selectStatus, setSelectStatus] = useState('');
  const StatusChange = category => {
    setSelectStatus(category);
  };

  const [statusList, setStatusList] = useState([]);
  const statusListReceive = () => {
    Api.send('db_statusList', {}, args => {
      let resultItem = args.resultItem;
      let arrItems = args.arrItems;

      if (resultItem.result === 'Y' && arrItems) {
        //console.log('진행상태리스트: ', arrItems, resultItem);
        setStatusList(arrItems);
      } else {
        console.log('진행상태리스트 API 통신 오류!', resultItem);
      }
    });
  };

  const statusChanges = () => {
    Api.send(
      'db_statusChange',
      {idx: params.idx, status: selectStatus, id: userInfo.mb_id},
      args => {
        let resultItem = args.resultItem;
        let arrItems = args.arrItems;

        if (resultItem.result === 'Y' && arrItems) {
          //console.log('진행상태변경: ', arrItems, resultItem);
          ClientInfoReceive();
          ToastMessage(resultItem.message);
          setStatusModal(false);
        } else {
          console.log('진행상태변경 API 통신 오류!', resultItem);
          setStatusModal(false);
        }
      },
    );
  };

  const [DBLoading, setDBLoading] = useState(true);
  const [DBInfo, setDBInfo] = useState('');
  //설계사 메모 추가
  const [fpMemoStatus, setFpMemoStatus] = useState('c');
  const [fpMemoidx, setFpMemoIdx] = useState('');
  const [fpMemoAdd, setFpMemoAdd] = useState(false);
  const [fpMemo, setFpMemo] = useState('');
  const fpMemoChange = text => {
    setFpMemo(text);
  };

  const [fpMemoListData, setFpMemoData] = useState([]);

  const [fpScheduleList, setFpScheduleList] = useState([]); // 스케줄 리스트
  const [fileUrls, setFileUrls] = useState('');
  const ClientInfoReceive = async () => {
    await setDBLoading(true);
    await Api.send('db_info', {idx: params.idx}, args => {
      let resultItem = args.resultItem;
      let arrItems = args.arrItems;

      if (resultItem.result === 'Y' && arrItems) {
        console.log('db 상세: ', arrItems);
        setDBInfo(arrItems);
        if (arrItems.file_down != '') {
          setFileUrls(BASE_URL + '/data/file/prfrm/' + arrItems.file_down);
        }
      } else {
        console.log('API 통신 오류!', resultItem);
      }
    });
    await Api.send('db_fpMemo', {idx: params.idx}, args => {
      let resultItem = args.resultItem;
      let arrItems = args.arrItems;

      if (resultItem.result === 'Y' && arrItems) {
        // console.log('fp 메모 리스트: ', arrItems);

        setFpMemoData(arrItems);
        // setDBInfo(arrItems)
      } else {
        console.log('API 통신 오류!', resultItem);
      }
    });
    await Api.send(
      'db_fpSchedule',
      {idx: params.idx, midx: userInfo.mb_no},
      args => {
        let resultItem = args.resultItem;
        let arrItems = args.arrItems;

        if (resultItem.result === 'Y' && arrItems) {
          console.log('fp 스케줄 리스트: ', resultItem);
          setFpScheduleList(arrItems);
        } else {
          console.log('API 통신 오류!', resultItem);
        }
      },
    );

    await setDBLoading(false);
  };

  //메모 수정 및 추가
  const fpMemoForm = () => {
    Api.send(
      'db_fpMemoInsert',
      {
        idx: params.idx,
        mb_id: userInfo.mb_id,
        m_status: fpMemoStatus,
        fpMemo: fpMemo,
        midx: fpMemoidx,
      },
      args => {
        let resultItem = args.resultItem;
        let arrItems = args.arrItems;

        if (resultItem.result === 'Y' && arrItems) {
          // console.log('fp 메모 수정 하기: ', resultItem);
          setFpMemoAdd(false);
          ClientInfoReceive();
          ToastMessage(resultItem.message);
        } else {
          console.log('fp 메모 수정 통신 오류!', resultItem);
        }
      },
    );
  };

  const [fpMemoDelStatus, setFpMemoDelStatus] = useState(false);
  const fpMemoDel = () => {
    Api.send('db_fpMemoDel', {idx: params.idx, cidx: fpMemoidx}, args => {
      let resultItem = args.resultItem;
      let arrItems = args.arrItems;

      if (resultItem.result === 'Y' && arrItems) {
        console.log('fp 메모 삭제: ', resultItem);
        ToastMessage(resultItem.message);
        setFpMemoDelStatus(false);
        ClientInfoReceive();
      } else {
        console.log('fp 메모 삭제 오류!', resultItem);
      }
    });
  };

  //메모 수정
  const memoInsert = async (p, midx) => {
    await setFpMemo(p);
    await setFpMemoIdx(midx);
    await setFpMemoStatus('cu');
    await setFpMemoAdd(true);
  };

  //메모 추가
  const fpMemoAddHandler = async () => {
    await setFpMemo('');
    await setFpMemoIdx('');
    await setFpMemoStatus('c');
    await setFpMemoAdd(true);
  };

  //메모 삭제
  const fpMemoDelHandler = async idx => {
    await setFpMemoIdx(idx);
    await setFpMemoDelStatus(true);
  };

  useEffect(() => {
    if (isFocused) {
      statusListReceive(); //진행상태변경
      ClientInfoReceive(); //고객상세정보
    }
  }, [isFocused]);

  let today = new Date();

  //스케줄 추가 이동
  const scheduleAdd = dates => {
    // console.log('스케줄 추가...' ,dates, DBInfo.wr_subject, DBInfo.wr_id);
    navigation.navigate('ScheduleAdd', {
      startDate: dates,
      mb_name: DBInfo.wr_subject,
      mb_idx: DBInfo.wr_id,
    });
  };

  //AS요청

  const [asModal, setASModal] = useState(false);
  const [selectAS, setSelectAS] = useState('');
  const [asContent, setASContent] = useState('');

  const asContentChange = text => {
    setASContent(text);
  };

  const ASRequestSend = () => {
    if (selectAS == '') {
      ToastMessage('교환사유를 선택하세요');
      return false;
    }

    if (asContent == '') {
      ToastMessage('구체적인 사유를 입력해주세요.');
      return false;
    }

    setASModal(true);
  };

  const ASRequestHandler = async () => {
    const formData = new FormData();
    formData.append('method', 'as_request');
    formData.append('idx', params.idx);
    formData.append('mb_id', userInfo.mb_id);
    formData.append('selectAS', selectAS);
    formData.append('asContent', asContent);

    if (singleFile.length > 0) {
      singleFile.map((item, index) => {
        console.log(index, item.uri);
        return formData.append('bf_file[]', {
          uri: item.uri,
          name: item.name,
          size: item.size,
          type: item.type,
        });
      });
    }

    const upload = await Api.multipartRequest(formData);

    console.log('upload::::::', upload);
    if (upload.result) {
      setASModal(false);
      //ClientInfoReceive();
      navigation.goBack();
      ToastMessage(upload.msg);
      setSelectAS('');
      setASContent('');
    } else {
      console.log('as 요청하기 실패!!!', resultItem);
      ToastMessage(upload.msg);
    }
    // let filess = '';

    // if(singleFile != ''){
    //     filess = {"uri":singleFile[0].uri, 'type':singleFile[0].type, 'name':singleFile[0].name};
    // }else{
    //     filess = '';
    // }

    // Api.send('as_request', {'idx':params.idx, 'mb_id':userInfo.mb_id, 'selectAS':selectAS, 'asContent':asContent, 'files':filess}, (args)=>{
    //     let resultItem = args.resultItem;
    //     let arrItems = args.arrItems;

    //     if(resultItem.result === 'Y' && arrItems) {
    //        console.log('as 요청하기: ', resultItem);
    //         setASModal(false);
    //         ClientInfoReceive();
    //         ToastMessage(resultItem.message);
    //         setSelectAS("");
    //         setASContent("");
    //     }else{
    //         console.log('as 요청하기 실패!!!', resultItem);

    //     }
    // });
  };

  const [asResultStatus, setASResultStatus] = useState('');
  const [asResultContent, setASResultContent] = useState('');
  const asResult = () => {
    let statusAS;
    if (DBInfo?.wr_4) {
      statusAS = DBInfo.wr_4.substr(0, 2);
    }

    if (statusAS == 'AS') {
      Api.send('as_result', {idx: params.idx, mb_id: userInfo.mb_id}, args => {
        let resultItem = args.resultItem;
        let arrItems = args.arrItems;

        if (resultItem.result === 'Y' && arrItems) {
          console.log('as 결과,,: ', arrItems);
          setSelectAS(arrItems.wr_1);
          setASContent(arrItems.wr_content);

          setASResultStatus(arrItems.wr_9);
          setASResultContent(arrItems.wr_10);
        } else {
          console.log('as 결과 실패!!!', resultItem);
        }
      });
    }

    console.log('statusAS', statusAS);
  };

  useEffect(() => {
    if (DBInfo != '') {
      asResult();
    }
  }, [DBInfo]);

  const [fileNames, setFileNames] = useState(''); //파일 이름
  const [singleFile, setSingleFile] = useState(''); //파일첨부용

  //파일첨부 이벤트
  const selectOneFile = async index => {
    console.log('fileIndex', index);
    //Opening Document Picker for selection of one file
    try {
      const res = await DocumentPicker.pick({
        type: DocumentPicker.types.allFiles,
        //There can me more options as well
        // DocumentPicker.types.allFiles
        // DocumentPicker.types.images
        // DocumentPicker.types.plainText
        // DocumentPicker.types.audio
        // DocumentPicker.types.pdf
      });
      //Printing the log realted to the file
      console.log('res : ' + JSON.stringify(res));
      //   console.log('URI : ' + res[index].uri);
      //   console.log('Type : ' + res[index].type);
      //   console.log('File Name : ' + res[index].name);
      //   console.log('File Size : ' + res[index].size);
      //Setting the state to show single file attributes
      //setSingleFile(res);

      if (singleFile != '') {
        let fileUps = [...singleFile];
        fileUps.push(res[0]);
        setSingleFile(fileUps);

        let fileNameArr = [...fileNames];
        fileNameArr.push(res[0].name);
        setFileNames(fileNameArr);
      } else {
        setSingleFile(res);
        setFileNames([res[0].name]);
        console.log(singleFile);
      }
      console.log(singleFile);

      //setFileNames(res[0].name);
    } catch (err) {
      //Handling any exception (If any)
      if (DocumentPicker.isCancel(err)) {
        //If user canceled the document selection
        alert('파일첨부를 취소하셨습니다.');
      } else {
        //For Unknown Error
        alert('Unknown Error: ' + JSON.stringify(err));
        throw err;
      }
    }
  };

  useEffect(() => {
    if (singleFile != '') {
      console.log('singleFile 변화::', singleFile[0].name);
    }
    if (fileNames != '') {
      console.log('fileNames::', fileNames);
    }
  }, [singleFile, fileNames]);

  const [possibleStatus, setPossibleStatus] = useState('');

  const possibleApi = () => {
    Api.send(
      'possible_status',
      {idx: params.idx, possible_status: possibleStatus},
      args => {
        let resultItem = args.resultItem;
        let arrItems = args.arrItems;

        if (resultItem.result === 'Y' && arrItems) {
          console.log('가망고객 결과,,: ', resultItem);
          ClientInfoReceive();
          setPossibleStatus('');
        } else {
          console.log('가망고객 결과 실패!!!', resultItem);
          ToastMessage(resultItem.message);
        }
      },
    );
  };

  //스케줄 삭제
  const [delModal, setDelModal] = useState(false);
  const [delScheduleIdx, setScheduleIdx] = useState('');

  const scheduleDelApi = index => {
    console.log(index);
    setDelModal(true);
    setScheduleIdx(index);
  };

  const scheduleDel = () => {
    Api.send('scheduleApi_delete', {idx: delScheduleIdx}, args => {
      let resultItem = args.resultItem;
      let arrItems = args.arrItems;

      if (resultItem.result === 'Y' && arrItems) {
        //console.log(resultItem);
        setDelModal(false);
        setScheduleIdx('');
        ToastMessage(resultItem.message);
        ClientInfoReceive();
      } else {
        console.log('삭제 실페..', resultItem);
      }
    });
  };

  const fileS = ['0'];
  const [fileCnt, setFileCnt] = useState('0');
  const [fileUpCnt, setFileUpCnt] = useState(fileS);

  const fileAdd = () => {
    let fileSp = [...fileUpCnt];

    fileSp.push('0');

    setFileUpCnt(fileSp);

    console.log('fileSp', fileSp);
  };

  const fileDel = index => {
    let fileSp = [...fileUpCnt];

    var splicetResult = fileSp.splice(index, 1);
    setFileUpCnt(fileSp);
    //console.log(splicetResult);
  };

  return (
    <Box flex={1} backgroundColor="#F4F6F6">
      <HeaderDef headerTitle="고객 상세 정보" navigation={navigation} />
      {DBLoading ? (
        <Box
          flex={1}
          alignItems="center"
          justifyContent={'center'}
          backgroundColor="#fff">
          <ActivityIndicator size="large" color="#333" />
        </Box>
      ) : (
        <ScrollView>
          <Box p="20px" pb="30px" backgroundColor={'#fff'}>
            <Box>
              <Box p="20px" backgroundColor={colorSelect.blue} borderRadius={5}>
                <HStack alignItems={'center'} justifyContent="space-between">
                  <DefText
                    text="등록일시"
                    style={[{color: colorSelect.white}, fweight.b]}
                  />
                  <DefText
                    text={DBInfo?.wr_1 && DBInfo.wr_1}
                    style={[{color: colorSelect.white}, fweight.eb]}
                  />
                </HStack>
              </Box>
              <Box
                p="20px"
                backgroundColor={'#D0DAE1'}
                borderRadius={5}
                mt="15px">
                <HStack alignItems={'center'} justifyContent="space-between">
                  <DefText text="진행 상태" style={[fweight.b]} />
                  <DefText
                    text={DBInfo?.wr_4 && DBInfo.wr_4}
                    style={[{color: '#FF4D4D'}, fweight.eb]}
                  />
                </HStack>
              </Box>
              {DBInfo.possible_status != '' && (
                <Box
                  p="20px"
                  backgroundColor={'#E0FFDB'}
                  borderRadius={5}
                  mt="15px">
                  <HStack alignItems={'center'} justifyContent="space-between">
                    <DefText text="가망여부" style={[fweight.b]} />
                    <DefText
                      text={DBInfo?.possible_status && DBInfo.possible_status}
                      style={[{color: '#FF4D4D'}, fweight.eb]}
                    />
                  </HStack>
                </Box>
              )}
              <HStack
                alignItems={'center'}
                justifyContent="space-between"
                mt="15px">
                <Box
                  style={[
                    styles.infoBox,
                    DBInfo?.family_check == '1'
                      ? {backgroundColor: colorSelect.orange}
                      : {backgroundColor: '#F3F3F3'},
                  ]}>
                  {DBInfo?.family_check == '1' ? (
                    <Image
                      source={require('../images/familyIconW.png')}
                      alt="가족상담 여부"
                      style={{width: 24, height: 26, resizeMode: 'contain'}}
                    />
                  ) : (
                    <Image
                      source={require('../images/familyIconB.png')}
                      alt="가족상담 여부"
                      style={{width: 24, height: 26, resizeMode: 'contain'}}
                    />
                  )}
                  <DefText
                    text="가족상담"
                    style={[
                      fweight.b,
                      {marginTop: 5},
                      DBInfo?.family_check == '1'
                        ? {color: colorSelect.white}
                        : {color: colorSelect.black1},
                    ]}
                  />
                </Box>
                <Box style={[styles.infoBox, {backgroundColor: '#004375'}]}>
                  <HStack alignItems={'center'}>
                    <DefText
                      text={DBInfo?.wr_5 ? DBInfo.wr_5 : '-'}
                      style={{color: colorSelect.white}}
                    />
                    <Image
                      source={require('../images/bohumUp.png')}
                      alt="이상"
                      style={{
                        width: 9,
                        height: 8,
                        resizeMode: 'contain',
                        marginLeft: 10,
                      }}
                    />
                  </HStack>
                  <DefText
                    text="보험료"
                    style={[
                      fweight.b,
                      {color: colorSelect.white, marginTop: 5},
                    ]}
                  />
                </Box>

                <TouchableOpacity
                  onPress={
                    DBInfo.file_name != ''
                      ? () => checkPermission(fileUrls, DBInfo.file_name)
                      : () => ToastMessage('등록된 녹취파일이 없습니다.')
                  }
                  // onPress={
                  //   DBInfo.file_name != ''
                  //     ? () => filePermissioned(fileUrls, DBInfo.file_name)
                  //     : () => ToastMessage('등록된 녹취파일이 없습니다.')
                  // }
                  style={[
                    styles.infoBox,
                    {backgroundColor: colorSelect.orange},
                  ]}>
                  <Image
                    source={require('../images/audioIconW.png')}
                    alt="녹음재생"
                    style={{width: 30, height: 26, resizeMode: 'contain'}}
                  />
                  <DefText
                    text="녹음재생"
                    style={[
                      fweight.b,
                      {color: colorSelect.white, marginTop: 5},
                    ]}
                  />
                </TouchableOpacity>
              </HStack>
            </Box>
          </Box>
          <Box backgroundColor={'#fff'} shadow={9} p="20px">
            <HStack mb="15px">
              <Box
                style={[
                  styles.infoTitleBox,
                  {backgroundColor: colorSelect.blue},
                ]}>
                <DefText text="고객 정보" style={[styles.infoTitle]} />
              </Box>
            </HStack>
            <HStack alignItems={'center'} justifyContent="space-between">
              <Box>
                <DefText
                  text={DBInfo?.wr_subject && DBInfo.wr_subject}
                  style={[{color: '#004375', fontSize: 22}, fweight.b]}
                />
                <DefText
                  text={DBInfo?.wr_10 && DBInfo.wr_10}
                  style={{marginTop: 10}}
                />
              </Box>
              {DBInfo != '' && (
                <TouchableOpacity
                  onPress={() => Linking.openURL(`tel:` + DBInfo.wr_10)}>
                  <Image
                    source={require('../images/clienInfoCall.png')}
                    alt="전화걸기"
                    style={{width: 29, height: 29, resizeMode: 'contain'}}
                  />
                </TouchableOpacity>
              )}
            </HStack>
            <Box>
              <HStack flexWrap={'wrap'} mt="15px" alignItems={'center'}>
                <Box width="25%">
                  <DefText text="주소" />
                </Box>
                <Box width="70%">
                  <HStack alignItems={'center'}>
                    <Box
                      width="8px"
                      height="8px"
                      backgroundColor={'#004375'}
                      mr="10px"
                    />
                    <DefText
                      text={
                        DBInfo?.wr_addr1 &&
                        DBInfo.wr_addr1 + DBInfo.wr_addr2 + DBInfo.wr_addr3
                      }
                    />
                  </HStack>
                </Box>
              </HStack>
              <HStack flexWrap={'wrap'} mt="15px">
                <Box width="25%">
                  <DefText text="나이" />
                </Box>
                <Box width="70%">
                  <HStack alignItems={'center'}>
                    <Box
                      width="8px"
                      height="8px"
                      backgroundColor={'#004375'}
                      mr="10px"
                    />
                    <DefText text={DBInfo?.age && DBInfo.age} />
                  </HStack>
                </Box>
              </HStack>
              <HStack flexWrap={'wrap'} mt="15px">
                <Box width="25%">
                  <DefText text="직업" />
                </Box>
                <Box width="70%">
                  <HStack alignItems={'center'}>
                    <Box
                      width="8px"
                      height="8px"
                      backgroundColor={'#004375'}
                      mr="10px"
                    />
                    <DefText text={DBInfo?.wr_9 && DBInfo.wr_9} />
                  </HStack>
                </Box>
              </HStack>
            </Box>
          </Box>
          <Box
            backgroundColor={'#fff'}
            borderTopWidth={1}
            borderTopColor="#EFEFF1"
            p="20px">
            <HStack flexWrap={'wrap'}>
              <Box width="25%">
                <DefText text="DB 종류" />
              </Box>
              <Box width="70%">
                <HStack alignItems={'center'}>
                  <Box
                    width="8px"
                    height="8px"
                    backgroundColor={'#004375'}
                    mr="10px"
                  />
                  <DefText
                    text={DBInfo?.category1Name && DBInfo.category1Name}
                  />
                  {DBInfo.category2Name && (
                    <DefText text={' > ' + DBInfo.category2Name} />
                  )}
                  {DBInfo.category3Name && (
                    <DefText text={' > ' + DBInfo.category3Name} />
                  )}
                </HStack>
              </Box>
            </HStack>
            {/* <HStack flexWrap={'wrap'} mt='15px'>
                            <Box width='25%' >
                                <DefText text='상담사' />
                            </Box>
                            <Box width='70%' >
                                <HStack alignItems={'center'}>
                                    <Box width='8px' height='8px' backgroundColor={'#004375'} mr='10px' />
                                    <DefText text={DBInfo?.manage_name && DBInfo.manage_name} />
                                </HStack>
                            </Box>
                        </HStack> */}
            <HStack flexWrap={'wrap'} mt="15px">
              <Box width="25%">
                <DefText text="통화희망" />
              </Box>
              <Box width="70%">
                <HStack alignItems={'center'}>
                  <Box
                    width="8px"
                    height="8px"
                    backgroundColor={'#004375'}
                    mr="10px"
                  />
                  <HStack alignItems={'center'}>
                    <DefText text={DBInfo?.wr_2 && DBInfo.wr_2} />
                    <DefText text={DBInfo?.wr_3 && ' ' + DBInfo.wr_3} />
                  </HStack>
                </HStack>
              </Box>
            </HStack>
          </Box>
          {DBInfo.admin_memo != '' && (
            <Box mt="15px" backgroundColor={'#fff'} shadow={9} p="20px">
              <HStack mb="15px">
                <Box
                  style={[styles.infoTitleBox, {backgroundColor: '#004375'}]}>
                  <DefText text="DB제공자 메모" style={[styles.infoTitle]} />
                </Box>
              </HStack>
              <Box>
                <DefText
                  text={DBInfo?.admin_memo && DBInfo.admin_memo}
                  style={{lineHeight: 23}}
                />
              </Box>
            </Box>
          )}
          {(DBInfo.wr_4 != 'AS요청' || DBInfo.wr_4 != 'AS 완료 승인') && (
            <Box mt="15px" backgroundColor={'#fff'} shadow={9}>
              <Box p="20px">
                <HStack>
                  <Box
                    style={[
                      styles.infoTitleBox,
                      {backgroundColor: colorSelect.blue},
                    ]}>
                    <DefText text="AS신청" style={[styles.infoTitle]} />
                  </Box>
                </HStack>
                <HStack flexWrap={'wrap'} mt="15px" alignItems={'center'}>
                  <Box width="25%">
                    <DefText text="교환사유" />
                  </Box>
                  {DBInfo.wr_4 == 'AS요청' || DBInfo.wr_4 == 'AS 완료 승인' ? (
                    <DefText text={selectAS} />
                  ) : (
                    <Box width="70%">
                      <Select
                        selectedValue={selectAS}
                        width={(width - 20) * 0.7}
                        height="45px"
                        borderRadius={5}
                        borderWidth={1}
                        borderColor="#999"
                        onValueChange={itemValue => setSelectAS(itemValue)}
                        placeholder="교환사유를 선택해 주세요."
                        style={{fontSize: 14, borderColor: '#999'}}>
                        <Select.Item
                          label={'고객정보불일치'}
                          value="고객정보불일치"
                        />
                        <Select.Item label={'설계사'} value="설계사" />
                        <Select.Item
                          label={'대면상담미인지'}
                          value="대면상담미인지"
                        />
                        <Select.Item label={'입원중'} value="입원중" />
                        {/* <Select.Item  label={'장기부재'} value='장기부재' />
                                                <Select.Item  label={'단박거절'} value='단박거절' />
                                                <Select.Item  label={'기타'} value='기타' /> */}
                      </Select>
                    </Box>
                  )}
                </HStack>
                <HStack
                  flexWrap={'wrap'}
                  mt="15px"
                  alignItems={
                    DBInfo?.wr_4.substr(0, 2) == 'AS' ? 'center' : 'flex-start'
                  }>
                  <Box
                    width="25%"
                    pt={
                      DBInfo.wr_4 == 'AS요청' || DBInfo.wr_4 == 'AS 완료 승인'
                        ? 0
                        : '10px'
                    }>
                    <DefText text="구체적 기재" />
                  </Box>
                  <Box width="70%">
                    {DBInfo.wr_4 == 'AS요청' ||
                    DBInfo.wr_4 == 'AS 완료 승인' ? (
                      <DefText text={asContent} />
                    ) : (
                      <DefInput
                        placeholderText="구체적인 사유를 입력해주세요."
                        inputValue={asContent}
                        onChangeText={asContentChange}
                        inputStyle={{
                          height: 100,
                          borderColor: '#999999',
                          width: (width - 20) * 0.7,
                          fontSize: 14,
                        }}
                        multiline={true}
                        textAlignVertical="top"
                      />
                    )}
                  </Box>
                </HStack>
                <HStack
                  flexWrap={'wrap'}
                  mt="15px"
                  alignItems={
                    DBInfo.wr_4 == 'AS요청' || DBInfo.wr_4 == 'AS 완료 승인'
                      ? 'center'
                      : 'flex-start'
                  }>
                  <Box
                    width="25%"
                    pt={
                      DBInfo.wr_4 == 'AS요청' || DBInfo.wr_4 == 'AS 완료 승인'
                        ? 0
                        : '10px'
                    }>
                    <DefText text="첨부파일" />
                  </Box>
                  <Box width="70%">
                    {fileUpCnt != '' &&
                      fileUpCnt.map((item, index) => {
                        return (
                          <Box key={index} mt={index != 0 ? '10px' : 0}>
                            <HStack
                              width={(width - 20) * 0.7}
                              alignItems={'center'}
                              justifyContent="space-between">
                              <TouchableOpacity
                                disabled={
                                  DBInfo.wr_4 == 'AS요청' ||
                                  DBInfo.wr_4 == 'AS 완료 승인'
                                    ? true
                                    : false
                                }
                                onPress={() => selectOneFile(index)}
                                style={[
                                  styles.fileupload,
                                  {width: (width - 20) * 0.7 * 0.75},
                                ]}>
                                <HStack
                                  alignItems={'center'}
                                  justifyContent="space-between">
                                  {fileNames != '' ? (
                                    fileNames[index] != '' ? (
                                      <DefText
                                        text={fileNames[index]}
                                        style={[
                                          styles.buttonsText,
                                          {color: '#333'},
                                        ]}
                                      />
                                    ) : (
                                      <DefText
                                        text="첨부하실 파일을 업로드하세요."
                                        style={[
                                          styles.buttonsText,
                                          {color: '#999'},
                                        ]}
                                      />
                                    )
                                  ) : (
                                    <DefText
                                      text="첨부하실 파일을 업로드하세요."
                                      style={[
                                        styles.buttonsText,
                                        {color: '#999'},
                                      ]}
                                    />
                                  )}
                                  <Image
                                    source={require('../images/fileUpload.png')}
                                    alt="파일업로드"
                                    style={{
                                      width: 12,
                                      height: 12,
                                      resizeMode: 'contain',
                                    }}
                                  />
                                </HStack>
                              </TouchableOpacity>
                              {index == 0 ? (
                                <TouchableOpacity
                                  onPress={() => fileAdd()}
                                  style={[
                                    styles.fileupload,
                                    {
                                      width: (width - 20) * 0.7 * 0.2,
                                      backgroundColor: '#004375',
                                      paddingHorizontal: 0,
                                      borderWidth: 0,
                                      justifyContent: 'center',
                                      alignItems: 'center',
                                    },
                                  ]}>
                                  <DefText
                                    text="추가"
                                    style={[{color: '#fff'}]}
                                  />
                                </TouchableOpacity>
                              ) : (
                                <TouchableOpacity
                                  onPress={() => fileDel(index)}
                                  style={[
                                    styles.fileupload,
                                    {
                                      width: (width - 20) * 0.7 * 0.2,
                                      backgroundColor: '#f00',
                                      paddingHorizontal: 0,
                                      borderWidth: 0,
                                      justifyContent: 'center',
                                      alignItems: 'center',
                                    },
                                  ]}>
                                  <DefText
                                    text="삭제"
                                    style={[{color: '#fff'}]}
                                  />
                                </TouchableOpacity>
                              )}
                            </HStack>
                          </Box>
                        );
                      })}
                    {/* <HStack mt='40px' width={(width - 20) * 0.7} alignItems={'center'} justifyContent='space-between'>
                                            <TouchableOpacity disabled={(DBInfo.wr_4 == 'AS요청' || DBInfo.wr_4 == 'AS 완료 승인') ? true : false} onPress={selectOneFile} style={[styles.fileupload, {width:((width - 20) * 0.7) * 0.75}]}>
                                                <HStack alignItems={'center'} justifyContent='space-between'>
                                                    {
                                                        fileNames != '' ?
                                                        <DefText text={fileNames} style={[styles.buttonsText, {color:'#333'}]} />
                                                        :
                                                        <DefText text='첨부하실 파일을 업로드하세요.' style={[styles.buttonsText, {color:'#999'}]} />
                                                    }
                                                    <Image source={require('../images/fileUpload.png')} alt='파일업로드' style={{width:12, height:12, resizeMode:'contain'}} />
                                                </HStack>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={[styles.fileupload, {width:((width - 20) * 0.7) * 0.2,backgroundColor:'#004375', paddingHorizontal:0, borderWidth:0, justifyContent:'center', alignItems:'center'}]}>
                                                <DefText text="추가" style={[{color:'#fff'}]} />
                                            </TouchableOpacity>
                                        </HStack> */}
                  </Box>
                </HStack>
              </Box>
              <TouchableOpacity
                disabled={
                  DBInfo.wr_4 == 'AS요청' || DBInfo.wr_4 == 'AS 완료 승인'
                    ? true
                    : false
                }
                onPress={ASRequestSend}
                style={[
                  styles.memoButton,
                  {backgroundColor: '#004375', width: width},
                  (DBInfo.wr_4 == 'AS요청' ||
                    DBInfo.wr_4 == 'AS 완료 승인') && {backgroundColor: '#eee'},
                ]}>
                <DefText
                  text={
                    DBInfo.wr_4 == 'AS요청' || DBInfo.wr_4 == 'AS 완료 승인'
                      ? 'AS 신청완료'
                      : 'AS 신청하기'
                  }
                  style={[
                    styles.memoButtonText,
                    (DBInfo.wr_4 == 'AS요청' ||
                      DBInfo.wr_4 == 'AS 완료 승인') && {color: '#000'},
                  ]}
                />
              </TouchableOpacity>
            </Box>
          )}
          {DBInfo?.wr_4 == 'AS 완료 거절' && (
            <Box mt="15px" backgroundColor={'#fff'} shadow={9} p="20px">
              <HStack>
                <Box
                  style={[
                    styles.infoTitleBox,
                    {backgroundColor: colorSelect.blue},
                  ]}>
                  <DefText text="AS 본사피드백" style={[styles.infoTitle]} />
                </Box>
              </HStack>
              <HStack flexWrap={'wrap'} mt="15px" alignItems={'center'}>
                <Box width="25%">
                  <DefText text="결과처리" />
                </Box>
                <Box width="70%">
                  {asResultStatus != '' && <DefText text={asResultStatus} />}
                </Box>
              </HStack>
              <HStack flexWrap={'wrap'} mt="15px" alignItems={'center'}>
                <Box width="25%">
                  <DefText text="AS결과설명" />
                </Box>
                <Box width="70%">
                  {asResultContent != '' && <DefText text={asResultContent} />}
                </Box>
              </HStack>
            </Box>
          )}
          <Box mt="15px" backgroundColor={'#fff'} shadow={9}>
            <Box p="20px">
              <HStack>
                <Box
                  style={[
                    styles.infoTitleBox,
                    {backgroundColor: colorSelect.blue},
                  ]}>
                  <DefText text="가망고객 설정" style={[styles.infoTitle]} />
                </Box>
              </HStack>
              <HStack flexWrap={'wrap'} mt="15px" alignItems={'center'}>
                <Box width="25%">
                  <DefText text="가망여부" />
                </Box>
                <Box width="70%">
                  <Select
                    selectedValue={possibleStatus}
                    width={(width - 20) * 0.7}
                    height="45px"
                    borderRadius={5}
                    borderWidth={1}
                    borderColor="#999"
                    onValueChange={itemValue => setPossibleStatus(itemValue)}
                    placeholder="가망고객여부를 선택하세요."
                    style={{fontSize: 14, borderColor: '#999'}}>
                    <Select.Item label={'가망고객'} value="가망고객" />
                    <Select.Item label={'진행불가'} value="진행불가" />
                  </Select>
                </Box>
              </HStack>
            </Box>
            <TouchableOpacity
              onPress={possibleApi}
              style={[
                styles.memoButton,
                {backgroundColor: '#004375', width: width},
              ]}>
              <DefText
                text={'가망여부 선택하기'}
                style={[styles.memoButtonText]}
              />
            </TouchableOpacity>
          </Box>

          <Box mt="15px" backgroundColor={'#fff'} shadow={9}>
            <Box px="20px" pt="20px">
              <HStack alignItems={'center'}>
                <Box
                  style={[
                    styles.infoTitleBox,
                    {backgroundColor: colorSelect.orange},
                  ]}>
                  <DefText text="설계사 메모" style={[styles.infoTitle]} />
                </Box>
                <TouchableOpacity
                  style={{marginLeft: 10}}
                  onPress={() => fpMemoAddHandler()}>
                  <Image
                    source={require('../images/memoAdd.png')}
                    alt="설계사 메모 추가"
                    style={[{width: 18, height: 18, resizeMode: 'contain'}]}
                  />
                </TouchableOpacity>
              </HStack>
            </Box>
            {fpMemoListData != '' && fpMemoListData.length > 0 ? (
              fpMemoListData.map((item, index) => {
                return (
                  <Box key={index}>
                    <Box px="20px" pt="20px" pb="20px">
                      <Box>
                        <DefText
                          text={item.wr_content}
                          style={{lineHeight: 23}}
                        />
                        <DefText
                          text={item.wr_datetime}
                          style={[{marginTop: 10, fontSize: fsize.fs12}]}
                        />
                      </Box>
                    </Box>
                    <HStack>
                      <TouchableOpacity
                        onPress={() => memoInsert(item.wr_content, item.wr_id)}
                        style={[
                          styles.memoButton,
                          {backgroundColor: '#004375'},
                        ]}>
                        <DefText text="수정" style={[styles.memoButtonText]} />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => fpMemoDelHandler(item.wr_id)}
                        style={[styles.memoButton, {backgroundColor: '#333'}]}>
                        <DefText text="삭제" style={[styles.memoButtonText]} />
                      </TouchableOpacity>
                    </HStack>
                  </Box>
                );
              })
            ) : (
              <Box p="40px" alignItems={'center'}>
                <DefText text="등록된 메모가 없습니다." />
              </Box>
            )}
          </Box>

          <Box mt="15px" backgroundColor={'#fff'} shadow={9} pt="20px">
            <HStack alignItems={'center'} px="20px">
              <Box
                style={[
                  styles.infoTitleBox,
                  {backgroundColor: colorSelect.blue},
                ]}>
                <DefText text="스케줄 정보" style={[styles.infoTitle]} />
              </Box>
              <TouchableOpacity
                onPress={() => scheduleAdd(today.format('yyyy-MM-dd'))}
                style={{marginLeft: 10}}>
                <Image
                  source={require('../images/memoAdd.png')}
                  alt="스케줄 추가"
                  style={[{width: 18, height: 18, resizeMode: 'contain'}]}
                />
              </TouchableOpacity>
            </HStack>
            {fpScheduleList != '' && fpScheduleList.length > 0 ? (
              fpScheduleList.map((item, index) => {
                return (
                  <Box key={index}>
                    <Box py="20px" px="20px">
                      {/* <Box position={'absolute'} top='20px' right='20px'>
                                            <TouchableOpacity  style={{paddingHorizontal:10, height:24, backgroundColor:'#f00' ,justifyContent:'center', alignItems:'center', borderRadius:5}}>
                                                <DefText text='삭제' style={{color:colorSelect.white}} />
                                            </TouchableOpacity>
                                        </Box> */}
                      <HStack flexWrap={'wrap'}>
                        <Box width="25%">
                          <DefText text="일정" />
                        </Box>
                        <Box width="75%">
                          <HStack alignItems={'center'}>
                            <Box
                              width="8px"
                              height="8px"
                              backgroundColor={colorSelect.blue}
                              mr="10px"
                            />
                            <DefText text={item.wr_1 + ' ' + item.wr_2} />
                          </HStack>
                        </Box>
                      </HStack>
                      <HStack flexWrap={'wrap'} mt="15px">
                        <Box width="25%">
                          <DefText text="내용" />
                        </Box>
                        <Box width="75%">
                          <HStack alignItems={'center'}>
                            <Box
                              width="8px"
                              height="8px"
                              backgroundColor={colorSelect.blue}
                              mr="10px"
                            />
                            <DefText text={item.wr_subject} />
                          </HStack>
                        </Box>
                      </HStack>
                      <HStack alignItems={'center'} flexWrap={'wrap'} mt="15px">
                        <Box width="25%">
                          <DefText text="주소" />
                        </Box>
                        <Box width="75%">
                          <HStack alignItems={'center'}>
                            <Box
                              width="8px"
                              height="8px"
                              backgroundColor={colorSelect.blue}
                              mr="10px"
                            />
                            <HStack flexWrap={'wrap'} alignItems="center">
                              <DefText text={item.wr_addr1} />
                              {item.wr_addr2 != '' && (
                                <DefText
                                  text={
                                    ' ' + item.wr_addr2 + ' ' + item.wr_addr3
                                  }
                                />
                              )}
                            </HStack>
                          </HStack>
                        </Box>
                      </HStack>
                      {item.wr_addr1 != '' ? (
                        <Box height="170px" mt="15px">
                          <WebView
                            source={{
                              uri:
                                'https://maumapp.cafe24.com/scheduleMap.php?address=' +
                                item.wr_addr1,
                            }}
                            style={{
                              opacity: 0.99,
                              minHeight: 1,
                            }}
                          />
                          <TouchableOpacity
                            style={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              width: width - 40,
                              height: 170,
                              backgroundColor: 'transparent',
                            }}
                            onPress={() =>
                              navigation.navigate('MapView', {
                                url: item.wr_addr1,
                              })
                            }
                          />
                        </Box>
                      ) : (
                        <Box></Box>
                      )}
                    </Box>
                    <HStack>
                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate('ScheduleInfo', {idx: item.wr_id})
                        }
                        style={[
                          styles.memoButton,
                          {backgroundColor: '#004375'},
                        ]}>
                        <DefText text="수정" style={[styles.memoButtonText]} />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => scheduleDelApi(item.wr_id)}
                        style={[styles.memoButton, {backgroundColor: '#333'}]}>
                        <DefText text="삭제" style={[styles.memoButtonText]} />
                      </TouchableOpacity>
                    </HStack>
                  </Box>
                );
              })
            ) : (
              <Box alignItems={'center'} py="40px">
                <DefText text="등록된 스케줄이 없습니다." />
              </Box>
            )}
          </Box>
        </ScrollView>
      )}
      <Modal isOpen={delModal} onClose={() => setDelModal(false)}>
        <Modal.Content
          p={0}
          borderRadius={0}
          style={{
            width: Dimensions.get('screen').width - 40,
            minWidth: Dimensions.get('screen').width - 40,
            maxWidth: Dimensions.get('screen').width - 40,
          }}>
          <Modal.Body p={0}>
            <Box
              py="20px"
              style={{justifyContent: 'center', alignItems: 'center'}}>
              <DefText text="스케줄 삭제시 복구가 불가능합니다." />
              <DefText
                text={'현재 스케줄을 삭제하시겠습니까?.'}
                style={{marginTop: 10}}
              />
            </Box>
            <HStack>
              <SubmitButtons
                btnText={'예'}
                buttonStyle={{width: (width - 40) * 0.5, height: 45}}
                onPress={scheduleDel}
              />
              <SubmitButtons
                btnText={'아니오'}
                buttonStyle={{
                  width: (width - 40) * 0.51,
                  height: 45,
                  backgroundColor: colorSelect.gray,
                }}
                onPress={() => setDelModal(false)}
              />
            </HStack>
          </Modal.Body>
        </Modal.Content>
      </Modal>
      <Modal isOpen={statusModal} onClose={() => setStatusModal(false)}>
        <Box position={'absolute'} bottom="0" zIndex={10}>
          <Box
            p="15px"
            width={width}
            backgroundColor={colorSelect.white}
            borderTopLeftRadius={15}
            borderTopRightRadius={15}>
            <Box alignItems={'center'}>
              <Image
                source={require('../images/modalLine.png')}
                alt="팝업 라인"
                style={{width: 41, height: 4, resizeMode: 'contain'}}
              />
            </Box>
            <Box>
              {statusList != '' &&
                statusList.length > 0 &&
                statusList.map((item, index) => {
                  return (
                    <TouchableOpacity
                      key={index}
                      style={{alignItems: 'center', marginTop: 15}}
                      onPress={() => StatusChange(item.wr_subject)}>
                      <DefText
                        text={item.wr_subject}
                        style={[{fontSize: fsize.fs16}, fweight.b]}
                      />
                      {selectStatus === item.wr_subject && (
                        <Box
                          position={'absolute'}
                          top="50%"
                          left="10px"
                          mt="-7.5px">
                          <Image
                            source={require('../images/statusCheck.png')}
                            alt="체크"
                            style={{
                              width: 16,
                              height: 15,
                              resizeMode: 'contain',
                            }}
                          />
                        </Box>
                      )}
                    </TouchableOpacity>
                  );
                })}
            </Box>
          </Box>

          <SubmitButtons
            btnText="저장"
            onPress={statusChanges}
            activeOpacity={1}
          />
        </Box>
      </Modal>
      <Modal isOpen={fpMemoAdd} onClose={() => setFpMemoAdd(false)}>
        <Modal.Content
          style={{
            width: Dimensions.get('screen').width - 40,
            minWidth: Dimensions.get('screen').width - 40,
            maxWidth: Dimensions.get('screen').width - 40,
          }}>
          <Modal.Body>
            <DefText
              text="상담사 메모 입력"
              style={[
                styles.infoTitle,
                {color: colorSelect.black, marginBottom: 15},
              ]}
            />
            <DefInput
              placeholderText={'메모사항을 입력하세요.'}
              multiline={true}
              inputValue={fpMemo}
              onChangeText={fpMemoChange}
              inputStyle={{height: 150}}
              textAlignVertical={'top'}
            />
            <SubmitButtons
              btnText={'메모입력'}
              buttonStyle={{
                width: width - 86,
                height: 40,
                borderRadius: 5,
                marginTop: 15,
              }}
              btnTextStyle={{fontSize: fsize.fs14}}
              onPress={() => fpMemoForm()}
            />
          </Modal.Body>
        </Modal.Content>
      </Modal>
      <Modal isOpen={fpMemoDelStatus} onClose={() => setFpMemoDelStatus(false)}>
        <Modal.Content
          style={{
            width: Dimensions.get('screen').width - 40,
            minWidth: Dimensions.get('screen').width - 40,
            maxWidth: Dimensions.get('screen').width - 40,
          }}>
          <Modal.Body>
            <Box justifyContent={'center'} alignItems="center">
              <DefText
                text={
                  '등록된 메모를 정말 삭제하시겠습니까?\n메모는 복구가 불가능합니다.'
                }
                style={[
                  styles.infoTitle,
                  {
                    color: colorSelect.black,
                    marginBottom: 15,
                    textAlign: 'center',
                  },
                ]}
              />
            </Box>
            <HStack justifyContent={'space-between'}>
              <SubmitButtons
                btnText={'예'}
                buttonStyle={{
                  width: (width - 86) * 0.47,
                  height: 40,
                  borderRadius: 5,
                  marginTop: 15,
                }}
                btnTextStyle={{fontSize: fsize.fs14}}
                onPress={() => fpMemoDel()}
              />
              <SubmitButtons
                btnText={'아니오'}
                buttonStyle={{
                  width: (width - 86) * 0.47,
                  height: 40,
                  borderRadius: 5,
                  marginTop: 15,
                  backgroundColor: colorSelect.gray,
                }}
                btnTextStyle={{fontSize: fsize.fs14}}
                onPress={() => setFpMemoDelStatus(false)}
              />
            </HStack>
          </Modal.Body>
        </Modal.Content>
      </Modal>
      <Modal isOpen={asModal} onClose={() => setASModal(false)}>
        <Modal.Content
          style={{
            width: Dimensions.get('screen').width - 40,
            minWidth: Dimensions.get('screen').width - 40,
            maxWidth: Dimensions.get('screen').width - 40,
          }}>
          <Modal.Body>
            <Box justifyContent={'center'} alignItems="center">
              <DefText
                text={'현재 DB에 대하여 AS 요청하시겠습니까?'}
                style={[
                  styles.infoTitle,
                  {
                    color: colorSelect.black,
                    marginBottom: 15,
                    textAlign: 'center',
                    color: '#000',
                  },
                ]}
              />
            </Box>
            <HStack justifyContent={'space-between'}>
              <SubmitButtons
                btnText={'예'}
                buttonStyle={{
                  width: (width - 86) * 0.47,
                  height: 40,
                  borderRadius: 5,
                  marginTop: 15,
                }}
                btnTextStyle={{fontSize: fsize.fs14}}
                onPress={ASRequestHandler}
              />
              <SubmitButtons
                btnText={'아니오'}
                buttonStyle={{
                  width: (width - 86) * 0.47,
                  height: 40,
                  borderRadius: 5,
                  marginTop: 15,
                  backgroundColor: colorSelect.gray,
                }}
                btnTextStyle={{fontSize: fsize.fs14}}
                onPress={() => setASModal(false)}
              />
            </HStack>
          </Modal.Body>
        </Modal.Content>
      </Modal>
      {!statusModal && (
        <SubmitButtons
          btnText="진행 상태 변경"
          onPress={() => setStatusModal(true)}
        />
      )}
    </Box>
  );
};

const styles = StyleSheet.create({
  infoBox: {
    width: categoryBtn,
    height: 54,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoTitleBox: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 4,
  },
  infoTitle: {
    ...fweight.b,
    color: colorSelect.white,
  },
  memoButton: {
    width: width * 0.5,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  memoButtonText: {
    fontSize: fsize.fs16,
    color: colorSelect.white,
    ...fweight.b,
  },
  fileupload: {
    width: (width - 20) * 0.7,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#999',
    height: 40,
    justifyContent: 'center',
    paddingHorizontal: 15,
  },
  buttonsText: {
    color: colorSelect.white,
    fontSize: fsize.fs12,
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
)(ClientInfo);
