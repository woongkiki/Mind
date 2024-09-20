import React, {useState, useEffect, useCallback} from 'react';
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
  PermissionsAndroid,
  Platform,
  Image,
} from 'react-native';
import {connect} from 'react-redux';
import {actionCreators as UserAction} from '../../redux/module/action/UserAction';
import HeaderDef from '../../components/HeaderDef';
import Api from '../../Api';
import {colorSelect, fsize, fweight} from '../../common/StyleDef';
import {DefInput, DefText, SearchInput} from '../../common/BOOTSTRAP';
import {useIsFocused} from '@react-navigation/native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import ToastMessage from '../../components/ToastMessage';
import HTML from 'react-native-render-html';
import StyleHtml from '../../common/StyleHtml';
import Font from '../../common/Font';
import RNFetchBlob from 'rn-fetch-blob';
import YoutubePlayer from 'react-native-youtube-iframe';
import YouTube from 'react-native-youtube';

const {width} = Dimensions.get('window');

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

const buttonWidth = (width - 80) * 0.47;

const WMVideoView = props => {
  const {navigation, route, userInfo} = props;

  const {params} = route;

  console.log(params);

  const [compleModal, setCompleModal] = useState(false);

  const [buttonDisable, setButtonDisable] = useState(false);
  const compleHandler = () => {
    Api.send(
      'com_videoCom',
      {
        idx: params.idx,
        midx: userInfo.mb_no,
        names: userInfo.mb_name,
        id: userInfo.mb_id,
        title: videoViewData.wr_subject,
      },
      args => {
        let resultItem = args.resultItem;
        let arrItems = args.arrItems;

        if (resultItem.result === 'Y' && arrItems) {
          console.log('동영상 교육완료 결과: ', arrItems, resultItem);

          setCompleModal(false);
          setButtonDisable(true);
          ToastMessage(resultItem.message);
          videoViewRec();
          //setVideoViewData(arrItems);
          // setVideoData(arrItems);
        } else {
          console.log('동영상 교육 완료 실패!', resultItem);
        }
      },
    );
  };
  //console.log(params);

  const [videoLoading, setVideoLoading] = useState(true);
  const [videoViewData, setVideoViewData] = useState('');
  const videoViewRec = async () => {
    await setVideoLoading(true);
    await Api.send(
      'wm_eduView',
      {idx: params.idx, id: userInfo?.mb_id},
      args => {
        let resultItem = args.resultItem;
        let arrItems = args.arrItems;

        if (resultItem.result === 'Y' && arrItems) {
          console.log('동영상 교육 내역 결과: ', arrItems, resultItem);
          setVideoViewData(arrItems);

          if (arrItems.wr_9 == 0) {
            setButtonDisable(false);
          } else {
            setButtonDisable(true);
          }
          // setVideoData(arrItems);
        } else {
          console.log('동영상 교육 내역 실패!', resultItem);
        }
      },
    );
    await setVideoLoading(false);
  };

  useEffect(() => {
    videoViewRec();
  }, []);

  const [heights, setHeights] = useState(width / 1.77);

  const [playing, setPlaying] = useState('play');

  const onStateChange = useCallback(state => {
    if (state === 'ended') {
      setPlaying('pause');
      //Alert.alert("video has finished playing!");
    }
  }, []);

  return (
    <Box flex={1} backgroundColor="#fff">
      <HeaderDef headerTitle="동영상 교육" navigation={navigation} />
      {videoLoading ? (
        <Box flex={1} justifyContent="center" alignItems={'center'}>
          <ActivityIndicator size={'large'} color="#333" />
        </Box>
      ) : (
        <ScrollView>
          {Platform.OS === 'ios' ? (
            <YouTube
              videoId={videoViewData.wr_2}
              apiKey="AIzaSyAiRHxKjYayEw9rpMwL8D64EDZ3fTX67aU"
              play={false}
              fullscreen={false}
              loop={false}
              //onReady={(e) => console.log('onReady')}
              onReady={e => setHeights(heights + 1)}
              onChangeState={e => console.log('onChangeState:', e.state)}
              onChangeQuality={e => console.log('onChangeQuality: ', e.quality)}
              onError={e => console.log('onError: ', e)}
              style={{width: width, height: heights}}
            />
          ) : (
            <YoutubePlayer
              height={heights}
              play={playing}
              videoId={videoViewData.wr_2}
              onChangeState={onStateChange}
            />
          )}

          <Box p="20px">
            <DefText
              text={'[' + videoViewData.wr_1 + '] ' + videoViewData.wr_subject}
              style={[styles.titles]}
            />
            {videoViewData.wr_content != '' && (
              <Box my="20px">
                <WebRender html={videoViewData.wr_content} />
              </Box>
            )}
            <HStack justifyContent={'flex-end'}>
              <DefText
                text={videoViewData.wr_datetime}
                style={[styles.texts]}
              />
            </HStack>
          </Box>
        </ScrollView>
      )}
      {/* {
                !videoLoading &&
                <SubmitButtons 
                    btnText = '동영상 교육 완료하기'
                    onPress={()=>setCompleModal(true)}
                    disabled={ videoViewData.wr_9 == 0 ? false : true}
                    buttonStyle = { videoViewData.wr_9 != 0 && {backgroundColor:colorSelect.gray}}
                />
            } */}
      <Modal isOpen={compleModal} onClose={() => setCompleModal(false)}>
        <Modal.Content
          style={{
            width: Dimensions.get('screen').width - 40,
            minWidth: Dimensions.get('screen').width - 40,
            maxWidth: Dimensions.get('screen').width - 40,
          }}>
          <Modal.Body>
            <DefText
              text="동영상 교육을 완료하시겠습니까?"
              style={[{fontSize: fsize.fs16}, fweight.b]}
            />
            <HStack justifyContent={'space-between'} mt="20px">
              <TouchableOpacity
                onPress={compleHandler}
                style={[
                  styles.buttonWidth,
                  {backgroundColor: colorSelect.blue},
                ]}>
                <DefText text="완료" style={[styles.buttonText]} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setCompleModal(false)}
                style={[
                  styles.buttonWidth,
                  {backgroundColor: colorSelect.gray},
                ]}>
                <DefText text="취소" style={[styles.buttonText]} />
              </TouchableOpacity>
            </HStack>
          </Modal.Body>
        </Modal.Content>
      </Modal>
    </Box>
  );
};

const styles = StyleSheet.create({
  titles: {
    fontSize: 15,
    ...fweight.eb,
  },
  texts: {
    fontSize: 13,
  },
  buttonWidth: {
    width: buttonWidth,
    height: 45,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    ...fweight.b,
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
)(WMVideoView);
