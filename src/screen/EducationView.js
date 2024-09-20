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
import {DefText, SearchInput, DefInput} from '../common/BOOTSTRAP';
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
var RNFetchBlob = require('rn-fetch-blob').default;

const {width, height} = Dimensions.get('window');

const EducationView = props => {
  const {navigation, route} = props;
  const {params} = route;

  const [loading, setLoading] = useState(true);
  const [eduData, setEduData] = useState('');
  const [fileUrls, setFileUrls] = useState('');

  const educationDataApi = async () => {
    await setLoading(true);
    await Api.send('education_data', {idx: params.idx}, args => {
      let resultItem = args.resultItem;
      let arrItems = args.arrItems;

      if (resultItem.result === 'Y' && arrItems) {
        console.log('교육자료 상세: ', arrItems);
        setEduData(arrItems);
        if (arrItems.file_down != '') {
          setFileUrls(BASE_URL + '/data/file/' + arrItems.file_down);
        }
      } else {
        console.log('교육자료 실패!', resultItem);
      }
    });
    await setLoading(false);
  };

  useEffect(() => {
    educationDataApi();
  }, []);

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
      //   try {
      //     const granted = await PermissionsAndroid.request(
      //       PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      //       {
      //         title: 'Storage Permission Required',
      //         message:
      //           'Application needs access to your storage to download File',
      //       }
      //     );
      //     if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      //       // Start downloading
      //       downloadFile(fileUrl, fileName);
      //       console.log('Storage Permission Granted.');
      //     } else {
      //       // If permission denied then show alert
      //       Alert.alert('Error','Storage Permission Not Granted');
      //     }
      //   } catch (err) {
      //     // To handle permission related exception
      //     console.log("++++"+err);
      //   }
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
        console.log(dirs.DocumentDir);
      });
  };

  const getFileExtention = fileUrl => {
    // To get the file extension
    return /[.]/.exec(fileUrl) ? /[^.]+$/.exec(fileUrl) : undefined;
  };

  return (
    <Box flex={1} backgroundColor="#fff">
      <HeaderDef headerTitle="교육자료" navigation={navigation} />
      {loading ? (
        <Box
          flex={1}
          backgroundColor="#fff"
          alignItems={'center'}
          justifyContent="center">
          <ActivityIndicator size="large" color="#333" />
        </Box>
      ) : (
        <ScrollView>
          <Box p="20px">
            <DefText
              text={'[' + eduData.wr_1 + '] ' + eduData.wr_subject}
              style={[styles.borderTitle]}
            />
            <Box mt="10px">
              <DefText text={eduData.datetime} style={{fontSize: 13}} />
            </Box>
            <Box style={[styles.contentBox]}>
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
                source={{html: eduData.wr_content && eduData.wr_content}}
                tagsStyles={StyleHtml}
                containerStyle={{flex: 1}}
                contentWidth={Dimensions.get('window').width}
              />
              {eduData.file_down && (
                <HStack mt="20px">
                  <TouchableOpacity
                    onPress={() => checkPermission(fileUrls, eduData.file_name)}
                    style={[
                      styles.scheduleButton,
                      {backgroundColor: colorSelect.blue},
                    ]}>
                    <DefText
                      text="첨부 파일 다운로드"
                      style={[styles.scheduleButtonText]}
                    />
                  </TouchableOpacity>
                </HStack>
              )}
            </Box>
            <Box justifyContent={'center'} alignItems="center" mt="20px">
              <TouchableOpacity
                onPress={() => navigation.navigate('EducationData')}
                style={[styles.listButton]}>
                <DefText text="목록보기" style={[styles.listButtonText]} />
              </TouchableOpacity>
            </Box>
          </Box>
        </ScrollView>
      )}
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
  modalButton: {
    width: (width - 80) * 0.47,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 10,
  },
});

export default EducationView;
