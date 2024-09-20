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
var RNFetchBlob = require('rn-fetch-blob').default;

const {width} = Dimensions.get('window');

const OfficeBusinessView = props => {
  const {navigation, route, userInfo} = props;
  const {params} = route;

  const [loading, setLoading] = useState(true);
  const [officeContent, setOfficeContent] = useState(''); //상세내용
  const [fileUrls, setFileUrls] = useState('');
  const [commentCount, setCommentCount] = useState('');
  const [commentList, setCommentList] = useState([]);
  const [commentWriteModal, setCommentWriteModal] = useState(false);
  const [commentTitle, setCommentTitle] = useState('');
  const [commentDelIdx, setCommentDelIdx] = useState('');
  const [commentDelModal, setCommentDelModal] = useState(false);

  const commentTitleChange = text => {
    setCommentTitle(text);
  };

  const officeContentApi = async () => {
    await setLoading(true);
    await Api.send('office_view', {idx: params.idx}, args => {
      let resultItem = args.resultItem;
      let arrItems = args.arrItems;

      if (resultItem.result === 'Y' && arrItems) {
        console.log('본사업무 상세: ', arrItems, resultItem);
        setOfficeContent(arrItems);
        if (arrItems.file != '') {
          setFileUrls(
            BASE_URL + '/data/file/office_busines/' + arrItems.file.bf_file,
          );
        }
      } else {
        console.log('본사업무 실패!', resultItem);
      }
    });
    await Api.send('office_commentList', {idx: params.idx}, args => {
      let resultItem = args.resultItem;
      let arrItems = args.arrItems;

      if (resultItem.result === 'Y' && arrItems) {
        console.log('본사업무 답변 글: ', arrItems, resultItem);
        setCommentCount(arrItems.commentCnt);
        setCommentList(arrItems.commentList);
      } else {
        console.log('본사업무 답변 글 실패!', resultItem);
      }
    });
    await setLoading(false);
  };

  const CommentWriteApi = () => {
    Api.send(
      'office_commentWrite',
      {
        idx: params.idx,
        comment_content: commentTitle,
        wr_num: officeContent.wr_num,
        wr_id: officeContent.wr_id,
        mb_id: userInfo.mb_id,
        wr_name: userInfo.mb_name,
      },
      args => {
        let resultItem = args.resultItem;
        let arrItems = args.arrItems;

        if (resultItem.result === 'Y' && arrItems) {
          console.log('본사업무 답변 글: ', arrItems, resultItem);
          ToastMessage(resultItem.message);
          setCommentWriteModal(false);
          setCommentTitle('');
          officeContentApi();
        } else {
          console.log('본사업무 답변 글 실패!', resultItem);
        }
      },
    );
  };

  const commentDelModalHandler = idx => {
    setCommentDelIdx(idx);
    setCommentDelModal(true);
  };

  const commentDel = () => {
    Api.send(
      'office_commentDel',
      {
        idx: commentDelIdx,
        wr_id: officeContent.wr_id,
        mb_id: userInfo.mb_id,
        wr_name: userInfo.mb_name,
      },
      args => {
        let resultItem = args.resultItem;

        if (resultItem.result == 'Y') {
          console.log('삭제 성공', resultItem);

          setCommentDelModal(false);
          officeContentApi();
          ToastMessage(resultItem.message);
        } else {
          //console.log('삭제 실패', resultItem);
          Alert.alert(resultItem.message);
        }
      },
    );
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
      });
  };

  const getFileExtention = fileUrl => {
    // To get the file extension
    return /[.]/.exec(fileUrl) ? /[^.]+$/.exec(fileUrl) : undefined;
  };

  useEffect(() => {
    officeContentApi();
  }, []);

  return (
    <Box flex={1} backgroundColor="#fff">
      <HeaderDef headerTitle="본사 업무 담당" navigation={navigation} />
      {loading ? (
        <Box flex={1} justifyContent="center" alignItems={'center'}>
          <ActivityIndicator size="large" color="#333" />
        </Box>
      ) : (
        <ScrollView>
          <Box p="20px">
            <Box>
              <HStack alignItems={'center'}>
                <DefText
                  text={'[' + officeContent.wr_3 + ']'}
                  style={[styles.borderTitle, {marginRight: 10}]}
                />
                <DefText
                  text={officeContent.wr_subject}
                  style={[styles.borderTitle]}
                />
              </HStack>
            </Box>
            <Box mt="10px">
              <DefText text={officeContent.datetime} style={{fontSize: 13}} />
            </Box>
            <Box style={[styles.contentBox]}>
              <DefText text={officeContent.wr_content} />
              {officeContent.file != '' && (
                <TouchableOpacity
                  onPress={() =>
                    checkPermission(fileUrls, officeContent.file.bf_source)
                  }
                  style={[styles.downloadBtn]}>
                  <DefText
                    text="파일 다운로드"
                    style={[styles.downloadBtnText]}
                  />
                </TouchableOpacity>
              )}
            </Box>
            {commentCount != '0' && (
              <Box mt="30px">
                <HStack
                  alignItems={'center'}
                  borderBottomWidth={1}
                  borderBottomColor="#eee"
                  pb="10px">
                  <DefText text="답변" />
                  <DefText text={commentCount} style={[{marginLeft: 10}]} />
                </HStack>
                {commentList != '' &&
                  commentList.map((item, index) => {
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
                              onPress={() => commentDelModalHandler(item.wr_id)}
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
              <HStack
                alignItems={'center'}
                justifyContent={
                  officeContent.wr_name != userInfo.mb_name
                    ? 'space-between'
                    : 'center'
                }>
                {officeContent.wr_name != userInfo.mb_name && (
                  <TouchableOpacity
                    onPress={() => setCommentWriteModal(true)}
                    style={[styles.listButton]}>
                    <DefText text="답변하기" style={[styles.listButtonText]} />
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  onPress={() => navigation.navigate('OfficeBusiness')}
                  style={[styles.listButton]}>
                  <DefText text="목록보기" style={[styles.listButtonText]} />
                </TouchableOpacity>
              </HStack>
            </Box>
          </Box>
        </ScrollView>
      )}
      <Modal
        isOpen={commentWriteModal}
        onClose={() => setCommentWriteModal(false)}>
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
              inputValue={commentTitle}
              onChangeText={commentTitleChange}
              multiline={true}
              textAlignVertical="top"
              inputStyle={{height: 150}}
            />
            <HStack justifyContent={'space-between'} mt="15px">
              <TouchableOpacity
                onPress={CommentWriteApi}
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
                onPress={() => setCommentWriteModal(false)}
                style={[styles.modalButton]}>
                <DefText text="취소" />
              </TouchableOpacity>
            </HStack>
          </Modal.Body>
        </Modal.Content>
      </Modal>
      <Modal isOpen={commentDelModal} onClose={() => setCommentDelModal(false)}>
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
                onPress={() => setCommentDelModal(false)}
                style={[styles.modalButton]}>
                <DefText text="취소" />
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
)(OfficeBusinessView);
