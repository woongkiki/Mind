import React, {useState, useEffect} from 'react';
import {
  ScrollView,
  Platform,
  Dimensions,
  StyleSheet,
  Alert,
  View,
  TouchableOpacity,
  FlatList,
  PermissionsAndroid,
  ActivityIndicator,
} from 'react-native';
import {Box, VStack, HStack, Image, Input, Select, Modal} from 'native-base';
import {DefInput, DefText, SearchInput} from '../common/BOOTSTRAP';
import HeaderDef from '../components/HeaderDef';
import {fsize, fweight, colorSelect, textStyle} from '../common/StyleDef';
import {officeBoard, brandBoard, memoBoard} from '../Utils/DummyData';
import {textLengthOverCut} from '../common/dataFunction';
import HTML from 'react-native-render-html';
import StyleHtml from '../common/StyleHtml';
import {connect} from 'react-redux';
import {actionCreators as UserAction} from '../redux/module/action/UserAction';
import {StackActions} from '@react-navigation/native';
import Api from '../Api';
import {BASE_URL} from '../Utils/APIConstant';
//import RNFetchBlob from 'rn-fetch-blob';
import ToastMessage from '../components/ToastMessage';
import Font from '../common/Font';
import FileViewer from 'react-native-file-viewer';
var RNFetchBlob = require('rn-fetch-blob').default;

const {width} = Dimensions.get('window');

const SalesView = props => {
  const {navigation, route, userInfo} = props;
  const {params} = route;

  //console.log(params);
  const [loading, setLoading] = useState(true);
  const [salesCont, setSalesCont] = useState(''); //게시글 내용
  const [salesCommentCount, setSalesCommentCount] = useState('0'); //댓글 카운트
  const [salesComment, setSalesComment] = useState([]); //댓글리스트
  const [salesWriteModal, setSalesWriteModal] = useState(false); //댓글 모달상태
  const [salesContent, setSalesContent] = useState(''); //댓글 내용
  const [salesDelIdx, setSalesDelIdx] = useState(''); // 삭제할 답변의 idx값
  const [salesDelModal, setSalesDelModal] = useState(false); // 삭제 모달
  const [fileUrls, setFileUrls] = useState('');
  const [fileNames, setFileNames] = useState('');
  const [fileExtends, setFileExtends] = useState('');

  const [fileModal, setFileModal] = useState(false);
  const [fileUrl, setFileUrl] = useState('');
  const [fileSrc, setFileSrc] = useState('');

  //댓글 입력하기
  const salesContentHandler = content => {
    setSalesContent(content);
  };

  //게시판 정보 불러오기
  const salesViewHandler = async () => {
    await setLoading(true);
    await Api.send('com_salesView', {idx: params.idx}, args => {
      let resultItem = args.resultItem;
      let arrItems = args.arrItems;

      if (resultItem.result === 'Y' && arrItems) {
        //console.log('커뮤니케이션 sales 상세: ', arrItems, resultItem);
        setSalesCont(arrItems);
        if (arrItems.file != '') {
          setFileUrls(
            BASE_URL + '/data/file/hot_line/' + arrItems.file.bf_file,
          );
          setFileNames(arrItems.file.bf_source);

          let fileExtend = arrItems.file.bf_source.split('.');
          let fileExtendCount = arrItems.file.bf_source.split('.').length;
          let fileExtendCountOr = fileExtendCount - 1;
          setFileExtends(fileExtend[fileExtendCountOr]);
        }
      } else {
        console.log('커뮤니케이션 sales 실패!', resultItem);
      }
    });
    await Api.send('com_salesViewCom', {idx: params.idx}, args => {
      let resultItem = args.resultItem;
      let arrItems = args.arrItems;

      if (resultItem.result === 'Y' && arrItems) {
        // console.log('커뮤니케이션 sales 답변 상세: ', arrItems, resultItem);
        setSalesCommentCount(arrItems.comment_cnt);
        setSalesComment(arrItems.comment);
      } else {
        console.log('커뮤니케이션 sales 실패!', resultItem);
      }
    });
    await setLoading(false);
  };

  //답변작성
  const CommentWriteHandler = () => {
    Api.send(
      'com_commentWrite',
      {
        idx: params.idx,
        comment_content: salesContent,
        wr_num: salesCont.wr_num,
        wr_id: salesCont.wr_id,
        mb_id: userInfo.mb_id,
        wr_name: userInfo.mb_name,
      },
      args => {
        let resultItem = args.resultItem;

        if (resultItem.result == 'Y') {
          setSalesWriteModal(false);
          salesViewHandler();
          ToastMessage(resultItem.message);
        } else {
          Alert.alert(resultItem.message);
        }
      },
    );
  };

  //삭제 모달창 오픈
  const commentDelModal = idx => {
    setSalesDelIdx(idx);
    setSalesDelModal(true);
  };

  //삭제 이벤트
  const commentDel = () => {
    Api.send(
      'com_commentDel',
      {
        idx: salesDelIdx,
        wr_id: salesCont.wr_id,
        mb_id: userInfo.mb_id,
        wr_name: userInfo.mb_name,
      },
      args => {
        let resultItem = args.resultItem;

        if (resultItem.result == 'Y') {
          console.log('삭제 성공', resultItem);

          setSalesDelModal(false);
          salesViewHandler();
          ToastMessage(resultItem.message);
        } else {
          //console.log('삭제 실패', resultItem);
          Alert.alert(resultItem.message);
        }
      },
    );
  };

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
        console.log('file viewer res -> ', JSON.stringify(res));
        //console.log('file download path ', RootDir + '/' + fileName + file_ext);

        setTimeout(() => {
          fileViewHandler(RootDir + '/' + fileName);
          setFileModal(false);
        }, 1000);

        // if(fileText == ""){
        //     ToastMessage('파일 다운로드가 완료되었습니다.');
        //     setFileModal(false);
        // }
      });
  };

  //파일다운로드
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
    console.log('fs', fs.dirs);
    let RootDir =
      Platform.OS === 'ios' ? fs.dirs.DocumentDir : fs.dirs.DownloadDir;
    let options = {
      fileCache: true,
      path: RootDir + '/' + fileName,
      addAndroidDownloads: {
        // path:
        //   RootDir+
        //   '/' + fileName +
        //   file_ext,
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
        console.log('res -> ', JSON.stringify(res));
        ToastMessage('파일 다운로드가 완료되었습니다.');
        setFileModal(false);
      });
  };

  const getFileExtention = fileUrl => {
    // To get the file extension
    return /[.]/.exec(fileUrl) ? /[^.]+$/.exec(fileUrl) : undefined;
  };

  //페이지 접속시 정보가져오기 실행
  useEffect(() => {
    salesViewHandler();
  }, []);

  useEffect(() => {
    if (fileExtends != '') {
      console.log('fileExtends', fileExtends);
      console.log('fileExtends', fileUrls);
    }
  }, [fileExtends]);

  return (
    <Box flex={1} backgroundColor="#fff">
      <HeaderDef headerTitle="Sales Hot-line" navigation={navigation} />
      {loading ? (
        <Box flex={1} alignItems="center" justifyContent={'center'}>
          <ActivityIndicator size="large" color="#333" />
        </Box>
      ) : (
        <ScrollView>
          <Box p="20px">
            <Box>
              <HStack alignItems={'center'}>
                <Box width={(width - 40) * 0.27}>
                  <DefText
                    text={'[' + salesCont.wr_1 + ']'}
                    style={[styles.borderTitle]}
                  />
                </Box>
                <Box width={(width - 40) * 0.7}>
                  <DefText
                    text={salesCont.wr_subject}
                    style={[styles.borderTitle]}
                  />
                </Box>
              </HStack>
            </Box>
            <Box mt="10px">
              <DefText text={salesCont.datetime} style={{fontSize: 13}} />
            </Box>
            {salesCont.file != '' && (
              <HStack mt="20px" alignItems={'center'} flexWrap="wrap">
                <Box width="20%">
                  <DefText
                    text="첨부파일"
                    style={{fontSize: fsize.fs14, ...fweight.b}}
                  />
                </Box>
                <Box width="80%">
                  <TouchableOpacity
                    //onPress={()=>checkPermission(fileUrls, salesCont.file.bf_source)}
                    onPress={() =>
                      fileChecks(fileUrls, salesCont.file.bf_source)
                    }>
                    <HStack alignItems={'center'} flexWrap="wrap">
                      <Box width="10%">
                        <Image
                          source={require('../images/downIcons.png')}
                          alt="다운로드"
                          style={{width: 20, height: 20, resizeMode: 'contain'}}
                        />
                      </Box>
                      <Box width="90%">
                        <DefText
                          text={fileNames}
                          style={{fontSize: fsize.fs12}}
                        />
                      </Box>
                    </HStack>
                  </TouchableOpacity>
                </Box>
              </HStack>
            )}
            <Box style={[styles.contentBox]}>
              {salesCont.wr_content != '' && (
                <HTML
                  ignoredStyles={[
                    'width',
                    'height',
                    'margin',
                    'padding',
                    'fontFamily',
                    'lineHeight',
                    'fontSize',
                    'br',
                  ]}
                  ignoredTags={['head', 'script', 'src']}
                  imagesMaxWidth={Dimensions.get('window').width - 40}
                  source={{html: salesCont.wr_content && salesCont.wr_content}}
                  tagsStyles={StyleHtml}
                  containerStyle={{flex: 1}}
                  contentWidth={Dimensions.get('window').width}
                />
              )}
              {fileExtends == 'jpg' && (
                <Image
                  source={{uri: fileUrls}}
                  alt="파일"
                  style={[
                    {
                      width: width - 80,
                      height: width - 80,
                      resizeMode: 'contain',
                      marginTop: 20,
                    },
                  ]}
                />
              )}
              {fileExtends == 'png' && (
                <Image
                  source={{uri: fileUrls}}
                  alt="파일"
                  style={[
                    {
                      width: width - 80,
                      height: width - 80,
                      resizeMode: 'contain',
                      marginTop: 20,
                    },
                  ]}
                />
              )}
            </Box>
            {salesCommentCount != '0' && (
              <Box mt="30px">
                <HStack
                  alignItems={'center'}
                  borderBottomWidth={1}
                  borderBottomColor="#eee"
                  pb="10px">
                  <DefText text="답변" />
                  <DefText
                    text={salesCommentCount}
                    style={[{marginLeft: 10}]}
                  />
                </HStack>
                {salesComment != '' &&
                  salesComment.map((item, index) => {
                    return (
                      <Box
                        key={index}
                        py="20px"
                        borderBottomWidth={1}
                        borderBottomColor="#eee">
                        <HStack
                          alignItems={'center'}
                          justifyContent="space-between">
                          <DefText
                            text={item.wr_name + '님의 답변내용'}
                            style={[fweight.eb]}
                          />
                          <DefText
                            text={item.wr_datetime.substr(5, 6)}
                            style={{color: '#666', fontSize: 13}}
                          />
                        </HStack>
                        <Box mt="15px">
                          <DefText text={item.wr_content} />
                        </Box>
                        {item.mb_id == userInfo.mb_id && (
                          <Box position={'absolute'} bottom="20px" right="0px">
                            <TouchableOpacity
                              onPress={() => commentDelModal(item.wr_id)}
                              style={[styles.delBtn]}>
                              <DefText
                                text="삭제"
                                style={{color: '#000', fontSize: fsize.fs12}}
                              />
                            </TouchableOpacity>
                          </Box>
                        )}
                      </Box>
                    );
                  })}
              </Box>
            )}
            <Box mt="20px">
              <HStack justifyContent={'space-between'}>
                <TouchableOpacity
                  onPress={() => setSalesWriteModal(true)}
                  style={[styles.listButton]}>
                  <DefText text="답변하기" style={[styles.listButtonText]} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => navigation.navigate('SalesList')}
                  style={[styles.listButton]}>
                  <DefText text="목록보기" style={[styles.listButtonText]} />
                </TouchableOpacity>
              </HStack>
            </Box>
          </Box>
        </ScrollView>
      )}
      <Modal isOpen={salesWriteModal} onClose={() => setSalesWriteModal(false)}>
        <Modal.Content
          style={{
            width: Dimensions.get('screen').width - 40,
            minWidth: Dimensions.get('screen').width - 40,
            maxWidth: Dimensions.get('screen').width - 40,
          }}>
          <Modal.Body>
            <DefText
              text="답변 입력"
              style={[fweight.eb, {marginBottom: 15}]}
            />
            <DefInput
              placeholderText={'답변을 입력해주세요.'}
              inputValue={salesContent}
              onChangeText={salesContentHandler}
              multiline={true}
              textAlignVertical="top"
              inputStyle={{height: 150}}
            />
            <HStack justifyContent={'space-between'} mt="15px">
              <TouchableOpacity
                onPress={CommentWriteHandler}
                style={[
                  styles.modalButton,
                  {
                    backgroundColor: colorSelect.blue,
                    borderColor: colorSelect.blue,
                  },
                ]}>
                <DefText text="확인" style={{color: '#fff'}} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setSalesWriteModal(false)}
                style={[styles.modalButton]}>
                <DefText text="취소" />
              </TouchableOpacity>
            </HStack>
          </Modal.Body>
        </Modal.Content>
      </Modal>
      <Modal isOpen={salesDelModal} onClose={() => setSalesDelModal(false)}>
        <Modal.Content
          style={{
            width: Dimensions.get('screen').width - 40,
            minWidth: Dimensions.get('screen').width - 40,
            maxWidth: Dimensions.get('screen').width - 40,
          }}>
          <Modal.Body>
            <DefText
              text={'답변을 삭제하시겠습니까?\n삭제 후 복구가 불가능합니다.'}
              style={{lineHeight: 24}}
            />
            <HStack justifyContent={'space-between'} mt="15px">
              <TouchableOpacity
                onPress={commentDel}
                style={[
                  styles.modalButton,
                  {
                    backgroundColor: colorSelect.gray,
                    borderColor: colorSelect.gray,
                  },
                ]}>
                <DefText text="삭제" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setSalesDelModal(false)}
                style={[styles.modalButton]}>
                <DefText text="취소" />
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
    width: (width - 40) * 0.48,
    height: 45,
    borderWidth: 1,
    borderColor: '#707070',
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listButtonText: {
    fontSize: fsize.fs16,
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
    width: '47%',
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
    paddingVertical: 10,
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
)(SalesView);
