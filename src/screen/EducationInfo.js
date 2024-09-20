import {Box, HStack, Modal} from 'native-base';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  PermissionsAndroid,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Api from '../Api';
import {DefText} from '../common/BOOTSTRAP';
import {colorSelect, fsize, fweight} from '../common/StyleDef';
import HeaderDef from '../components/HeaderDef';
import HTML from 'react-native-render-html';
import StyleHtml from '../common/StyleHtml';
import Font from '../common/Font';
import {connect} from 'react-redux';
import {actionCreators as UserAction} from '../redux/module/action/UserAction';
import ToastMessage from '../components/ToastMessage';
//import RNFetchBlob from 'rn-fetch-blob';
import FileViewer from 'react-native-file-viewer';
var RNFetchBlob = require('rn-fetch-blob').default;

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

const EducationInfo = props => {
  const {navigation, route, userInfo} = props;
  const {params} = route;

  //console.log("params", params);
  const [loading, setLoading] = useState(true);
  const [infoResult, setInfoResult] = useState('');
  const [infoFile, setInfoFile] = useState([]);
  const [requestModal, setRequestModal] = useState(false);
  const [cancleModal, setCancleModal] = useState(false);

  const [fileModal, setFileModal] = useState(false);
  const [fileUrl, setFileUrl] = useState('');
  const [fileSrc, setFileSrc] = useState('');
  const [fileOpenUrl, setFileOpenUrl] = useState('');

  const fileChecks = (urls, bf_source) => {
    setFileUrl(urls);
    setFileSrc(bf_source);
    setFileModal(true);
  };

  const fileViewHandler = urls => {
    FileViewer.open(urls)
      .then(() => {
        // Do whatever you want
        console.log(urls, 'Success');
      })
      .catch(_err => {
        // Do whatever you want
        console.log(_err);
      });
  };

  const fileViewerDownLoad = async (files, fileName) => {
    let fileUrl = files;
    // Function to check the platform
    // If Platform is Android then check for permissions.

    if (Platform.OS === 'ios') {
      downloadFileViewer(fileUrl, fileName);
    } else {
      downloadFileViewer(fileUrl, fileName);
      // try {
      //   const granted = await PermissionsAndroid.request(
      //     PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      //     {
      //       title: 'Storage Permission Required',
      //       message:
      //         'Application needs access to your storage to download File',
      //       buttonNeutral: 'Ask Me Later',
      //       buttonNegative: 'Cancel',
      //       buttonPositive: 'OK',
      //     },
      //   );
      //   if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      //     // Start downloading
      //     downloadFileViewer(fileUrl, fileName);
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

  const downloadFileViewer = (fileUrl, fileName) => {
    // Get today's date to add the time suffix in filename
    let date = new Date();
    // File URL which we want to download
    let FILE_URL = fileUrl;
    // Function to get extention of the file url
    let file_ext = getFileExtention(FILE_URL);

    console.log('file_ext', file_ext);
    file_ext = '.' + file_ext[0];

    // config: To get response by passing the downloading related options
    // fs: Root directory path to download
    const {config, fs} = RNFetchBlob;

    let RootDir =
      Platform.OS === 'ios' ? fs.dirs.DocumentDir : fs.dirs.DownloadDir;

    console.log('RootDir', RootDir);
    let options = {
      fileCache: true,
      path: RootDir + '/' + fileName,
      addAndroidDownloads: {
        path: RootDir + '/' + fileName,
        description: 'downloading file...',
        notification: true,
        // useDownloadManager works with Android only
        useDownloadManager: true,
      },
    };
    config(options)
      .fetch('GET', FILE_URL)
      .then(res => {
        // Alert after successful downloading
        console.log('file viewer res -> ', JSON.stringify(res.data));
        // let extS = file_ext.replace(".","");

        // if(extS == "pdf"){

        //     console.log("fileUrl", fileUrl);
        //     Linking.openURL(fileUrl);
        // }else{
        //     fileViewHandler(paths);
        //     setFileModal(false);
        // }
        fileViewHandler(res.data);
        setFileModal(false);
      });
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
      path: RootDir + '/' + fileName,
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
      .then(res => {
        // Alert after successful downloading
        console.log('res -> ', JSON.stringify(res));
        ToastMessage('파일 다운로드가 완료되었습니다.');
        setFileModal(false);
      });
  };

  const getFileExtention = fileUrl => {
    // To get the file extension
    return /[.]/.exec(fileUrl) ? /[^.]+$/.exec(fileUrl) : undefined;
  };

  const educationInfoApi = async () => {
    await setLoading(true);
    Api.send('educations_view', {idx: params.idx, id: userInfo.mb_id}, args => {
      let resultItem = args.resultItem;
      let arrItems = args.arrItems;

      if (resultItem.result == 'Y') {
        console.log('교육과정 상세 불러오기 성공', arrItems);
        setInfoResult(arrItems);
        setInfoFile(arrItems.file);
      } else {
        console.log('교육과정 상세 불러오기 실패', resultItem);
      }
    });
    await setLoading(false);
  };

  useEffect(() => {
    educationInfoApi();
  }, []);

  //교육신청하기
  const educationRequest = () => {
    Api.send(
      'educations_request',
      {
        idx: params.idx,
        id: userInfo?.mb_id,
        name: userInfo?.mb_name,
        midx: userInfo?.mb_no,
      },
      args => {
        let resultItem = args.resultItem;
        let arrItems = args.arrItems;

        if (resultItem.result == 'Y') {
          console.log('교육과정 신청하기 성공', resultItem);
          ToastMessage(resultItem.message);
          setRequestModal(false);
          navigation.goBack();
        } else {
          console.log('교육과정 신청하기 실패', resultItem);
          ToastMessage(resultItem.message);
        }
      },
    );
  };

  //교육신청 취소하기
  const educationRequestCancle = () => {
    Api.send(
      'educations_requestCancle',
      {idx: params.idx, id: userInfo.mb_id, name: userInfo.mb_name},
      args => {
        let resultItem = args.resultItem;
        let arrItems = args.arrItems;

        if (resultItem.result == 'Y') {
          console.log('교육과정 취소하기 성공', resultItem);
          ToastMessage(resultItem.message);
          setCancleModal(false);
          educationInfoApi();
        } else {
          console.log('교육과정 취소하기 실패', resultItem);
        }
      },
    );
  };

  return (
    <Box flex={1} backgroundColor="#fff">
      <HeaderDef headerTitle="교육과정" navigation={navigation} />
      {loading ? (
        <Box flex={1} justifyContent="center" alignItems={'center'}>
          <ActivityIndicator size="large" color="#333" />
        </Box>
      ) : (
        <ScrollView>
          <Box p="20px">
            <Box>
              <DefText
                text={'[' + infoResult.wr_1 + '] ' + infoResult.wr_subject}
                style={[styles.borderTitle]}
              />
            </Box>
            <Box mt="20px">
              <HStack justifyContent={'space-between'}>
                <HStack alignItems={'center'}>
                  <DefText text={'등록자'} style={[fweight.b]} />
                  <Box style={[styles.bar]} />
                  <DefText
                    text={
                      infoResult.write_name != ''
                        ? infoResult.write_name
                        : infoResult.wr_name
                    }
                  />
                </HStack>
                <HStack alignItems={'center'}>
                  <DefText text={'등록일'} style={[fweight.b]} />
                  <Box style={[styles.bar]} />
                  <DefText
                    text={
                      infoResult != ''
                        ? infoResult.wr_datetime.substring(0, 10)
                        : '-'
                    }
                  />
                </HStack>
              </HStack>
            </Box>
            <HStack mt="20px" alignItems={'center'} flexWrap="wrap">
              <Box width="20%">
                <DefText
                  text="첨부파일"
                  style={{fontSize: fsize.fs14, ...fweight.b}}
                />
              </Box>
              <Box width="80%">
                {infoFile != '' &&
                  infoFile.map((item, index) => {
                    return (
                      <Box key={index} mt={index != 0 ? '10px' : 0}>
                        <TouchableOpacity
                          onPress={() => fileChecks(item.urls, item.bf_source)}>
                          <HStack alignItems={'center'} flexWrap="wrap">
                            <Box width="10%">
                              <Image
                                source={require('../images/downIcons.png')}
                                alt="다운로드"
                                style={{
                                  width: 20,
                                  height: 20,
                                  resizeMode: 'contain',
                                }}
                              />
                            </Box>
                            <Box width="90%">
                              <DefText
                                text={item.bf_source}
                                style={{fontSize: fsize.fs12}}
                              />
                            </Box>
                          </HStack>
                        </TouchableOpacity>
                      </Box>
                    );
                  })}
              </Box>
            </HStack>
            <Box style={[styles.contentBox]}>
              {infoResult != '' && <WebRender html={infoResult.wr_content} />}
            </Box>
            <Box justifyContent={'center'} alignItems="center" mt="20px">
              <HStack>
                {/* {
                                    infoResult.req_status != "" ?
                                    <TouchableOpacity
                                        style={[styles.listButton, {backgroundColor:colorSelect.gray, borderColor:colorSelect.gray, marginRight:10}]}
                                        onPress={()=>setCancleModal(true)}
                                    >
                                        <DefText 
                                            text="신청취소"
                                            style={[styles.listButtonText, {color:colorSelect.white}]}
                                        />
                                    </TouchableOpacity>
                                    :
                                    <TouchableOpacity
                                        style={[styles.listButton, {backgroundColor:colorSelect.blue, borderColor:colorSelect.blue, marginRight:10}]}
                                        onPress={()=>setRequestModal(true)}
                                    >
                                        <DefText 
                                            text="신청"
                                            style={[styles.listButtonText, {color:colorSelect.white}]}
                                        />
                                    </TouchableOpacity>
                                } */}
                <TouchableOpacity
                  style={[
                    styles.listButton,
                    {
                      backgroundColor: colorSelect.blue,
                      borderColor: colorSelect.blue,
                      marginRight: 10,
                    },
                  ]}
                  onPress={() => setRequestModal(true)}
                  disabled={infoResult.req_status != '' && true}>
                  <DefText
                    text="신청"
                    style={[styles.listButtonText, {color: colorSelect.white}]}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.listButton,
                    {
                      backgroundColor: colorSelect.gray,
                      borderColor: colorSelect.gray,
                      marginRight: 10,
                    },
                  ]}
                  onPress={() => setCancleModal(true)}
                  disabled={infoResult.req_status == '' && true}>
                  <DefText
                    text="신청취소"
                    style={[styles.listButtonText, {color: colorSelect.white}]}
                  />
                </TouchableOpacity>
              </HStack>
              <Box height={'50px'} />
              <TouchableOpacity
                onPress={() => navigation.navigate('EducationList')}
                style={[styles.listButton]}>
                <DefText text="목록보기" style={[styles.listButtonText]} />
              </TouchableOpacity>
            </Box>
          </Box>
        </ScrollView>
      )}
      <Modal isOpen={requestModal} onClose={() => setRequestModal(false)}>
        <Modal.Content
          p="0"
          pb="20px"
          px="20px"
          style={{
            width: Dimensions.get('screen').width - 40,
            minWidth: Dimensions.get('screen').width - 40,
            maxWidth: Dimensions.get('screen').width - 40,
          }}>
          <Modal.Body p="0" px="20px" py="20px">
            <DefText
              text={'교육을 신청하시겠습니까?'}
              style={{
                fontSize: fsize.fs16,
                ...fweight.b,
                textAlign: 'center',
              }}
            />
            <HStack justifyContent={'space-between'} mt="20px">
              <TouchableOpacity
                style={[
                  styles.modalButtons,
                  {backgroundColor: colorSelect.blue},
                ]}
                onPress={educationRequest}>
                <DefText text="예" style={{color: colorSelect.white}} />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButtons, {backgroundColor: '#eee'}]}
                onPress={() => setRequestModal(false)}>
                <DefText text="아니오" />
              </TouchableOpacity>
            </HStack>
          </Modal.Body>
        </Modal.Content>
      </Modal>
      <Modal isOpen={cancleModal} onClose={() => setCancleModal(false)}>
        <Modal.Content
          p="0"
          pb="20px"
          px="20px"
          style={{
            width: Dimensions.get('screen').width - 40,
            minWidth: Dimensions.get('screen').width - 40,
            maxWidth: Dimensions.get('screen').width - 40,
          }}>
          <Modal.Body p="0" px="20px" py="20px">
            <DefText
              text={'교육 신청을 취소하시겠습니까?'}
              style={{
                fontSize: fsize.fs16,
                ...fweight.b,
                textAlign: 'center',
              }}
            />
            <HStack justifyContent={'space-between'} mt="20px">
              <TouchableOpacity
                style={[
                  styles.modalButtons,
                  {backgroundColor: colorSelect.blue},
                ]}
                onPress={educationRequestCancle}>
                <DefText text="예" style={{color: colorSelect.white}} />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButtons, {backgroundColor: '#eee'}]}
                onPress={() => setCancleModal(false)}>
                <DefText text="아니오" />
              </TouchableOpacity>
            </HStack>
          </Modal.Body>
        </Modal.Content>
      </Modal>
      <Modal isOpen={fileModal} onClose={() => setFileModal(false)}>
        <Modal.Content
          style={{
            width: Dimensions.get('screen').width - 40,
            minWidth: Dimensions.get('screen').width - 40,
            maxWidth: Dimensions.get('screen').width - 40,
          }}>
          <Modal.Body>
            <HStack alignItems={'center'} justifyContent={'space-between'}>
              <TouchableOpacity
                onPress={() => checkPermission(fileUrl, fileSrc)}
                style={[
                  styles.modalButton,
                  {backgroundColor: colorSelect.blue},
                ]}>
                <DefText
                  text={'다운로드'}
                  style={{color: colorSelect.white, ...fweight.b}}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton]}
                onPress={() => fileViewerDownLoad(fileUrl, fileSrc)}>
                <DefText text={'바로보기'} style={{...fweight.b}} />
              </TouchableOpacity>
            </HStack>
          </Modal.Body>
        </Modal.Content>
      </Modal>
    </Box>
  );
};

const styles = StyleSheet.create({
  modalButtons: {
    width: (width - 80) * 0.48,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bar: {
    width: 1,
    height: 10,
    backgroundColor: '#999',
    marginHorizontal: 10,
  },
  borderTitle: {
    fontSize: fsize.fs20,
    ...fweight.b,
  },
  contentBox: {
    borderTopWidth: 2,
    borderTopColor: '#191919',
    paddingVertical: 40,
    paddingHorizontal: 20,
    backgroundColor: '#FAFAFA',
    borderBottomWidth: 1,
    borderBottomColor: '#ECECEC',
    marginTop: 20,
  },
  contentText: {
    lineHeight: 23,
    color: '#909090',
  },
  listButton: {
    width: (width - 40) * 0.4,
    height: 40,
    borderWidth: 1,
    borderColor: '#707070',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listButtonText: {
    fontSize: fsize.fs14,
    ...fweight.b,
  },
  scheduleButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    backgroundColor: colorSelect.orange,
  },
  scheduleButtonText: {
    color: colorSelect.white,
    fontSize: fsize.fs12,
  },
  modalButton: {
    width: (width - 80) * 0.47,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 10,
  },
  delBtn: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    backgroundColor: colorSelect.gray,
    borderRadius: 5,
  },
  downloadBtn: {
    width: '100%',
    height: 35,
    backgroundColor: colorSelect.blue,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  downloadBtnText: {
    color: colorSelect.white,
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
)(EducationInfo);
