import React, {useState, useEffect} from 'react';
import { ScrollView, Platform, Dimensions, StyleSheet, Alert, View, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { Box, VStack, HStack, Image, Input, Select, Modal } from 'native-base';
import { DefText, SearchInput, SubmitButtons } from '../common/BOOTSTRAP';
import HeaderDef from '../components/HeaderDef';
import {fsize, fweight, colorSelect, textStyle} from '../common/StyleDef';
import { videoEdu } from '../Utils/DummyData';
import { textLengthOverCut } from '../common/dataFunction';
import YouTube from 'react-native-youtube';
import ToastMessage from '../components/ToastMessage';
import HTML from 'react-native-render-html';
import StyleHtml from '../common/StyleHtml';

import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import { StackActions } from '@react-navigation/native';
import Api from '../Api';

import { useFocusEffect, useIsFocused } from '@react-navigation/native';


const {width} = Dimensions.get('window');

const buttonWidth = (width - 80) * 0.47;

const EducationVideoView = (props) => {

    const {navigation, route, userInfo} = props;

    const { params } = route;

    console.log(params);

    

    const [compleModal, setCompleModal] = useState(false);

    const [buttonDisable, setButtonDisable] = useState(false);
    const compleHandler = () => {

        Api.send('com_videoCom', {'idx':params.idx, 'midx':userInfo.mb_no, 'names':userInfo.mb_name, 'id':userInfo.mb_id, 'title':videoViewData.wr_subject}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               console.log('동영상 교육완료 결과: ', arrItems, resultItem);

               setCompleModal(false);
               setButtonDisable(true);
               ToastMessage(resultItem.message);
               videoViewRec();
               //setVideoViewData(arrItems);
              // setVideoData(arrItems);
            }else{
                console.log('동영상 교육 완료 실패!', resultItem);

            }
        });
       
    }
    //console.log(params);

    const [videoLoading, setVideoLoading] = useState(true);
    const [videoViewData, setVideoViewData] = useState('');
    const videoViewRec =  async () => {

        await setVideoLoading(true);
        await Api.send('com_videoView', {'idx':params.idx}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               console.log('동영상 교육 내역 결과: ', arrItems, resultItem);
               setVideoViewData(arrItems);

               if(arrItems.wr_9 == 0){
                    setButtonDisable(false);
               }else{
                    setButtonDisable(true);
               }
              // setVideoData(arrItems);
            }else{
                console.log('동영상 교육 내역 실패!', resultItem);

            }
        });
        await setVideoLoading(false);
    }

    useEffect(()=>{
        videoViewRec();
    }, [])

    return (
        <Box flex={1} backgroundColor='#fff'>
            <HeaderDef headerTitle='동영상 교육' navigation={navigation} />
            {
                videoLoading ? 
                <Box flex={1} justifyContent='center' alignItems={'center'}>
                    <ActivityIndicator size={'large'} color='#333' />
                </Box>
                :
                <ScrollView>
                    <YouTube
                        videoId={videoViewData.wr_2}
                        apiKey="AIzaSyAiRHxKjYayEw9rpMwL8D64EDZ3fTX67aU"
                        play={false}
                        fullscreen={false}
                        loop={false}
                        onReady={(e) => console.log('onReady')}
                        onChangeState={(e) => console.log('onChangeState:', e.state)}
                        onChangeQuality={(e) => console.log('onChangeQuality: ', e.quality)}
                        onError={(e) => console.log('onError: ', e.error)}
                        style={{width: width, height: width / 1.77}}
                    />
                    <Box p='20px'>
                        <DefText text={'[' + videoViewData.wr_1 + '] ' + videoViewData.wr_subject} style={[styles.titles]} />
                        <Box my='20px'>
                            <HTML 
                                ignoredStyles={[ 'width', 'height', 'margin', 'padding', 'fontFamily', 'lineHeight', 'fontSize', 'br']}
                                ignoredTags={['head', 'script', 'src']}
                                imagesMaxWidth={Dimensions.get('window').width - 40}
                                source={{html: videoViewData.wr_content}} 
                                tagsStyles={StyleHtml}
                                containerStyle={{ flex: 1, }}
                                contentWidth={Dimensions.get('window').width}  
                            />
                        </Box>
                        <HStack justifyContent={'flex-end'}>
                            <DefText text={videoViewData.wr_datetime} style={[styles.texts]} />
                        </HStack>
                    </Box>
                </ScrollView>
            }
            {
                !videoLoading &&
                <SubmitButtons 
                    btnText = '동영상 교육 완료하기'
                    onPress={()=>setCompleModal(true)}
                    disabled={ videoViewData.wr_9 == 0 ? false : true}
                    buttonStyle = { videoViewData.wr_9 != 0 && {backgroundColor:colorSelect.gray}}
                />
            }
            <Modal isOpen={compleModal} onClose={() => setCompleModal(false)}>
                
                <Modal.Content>
                    <Modal.Body>
                        <DefText text='동영상 교육을 완료하시겠습니까?' style={[{fontSize:fsize.fs16}, fweight.b]} />
                        <HStack justifyContent={'space-between'} mt='20px'>
                            <TouchableOpacity onPress={compleHandler} style={[styles.buttonWidth, {backgroundColor:colorSelect.blue}]}>
                                <DefText text='완료' style={[styles.buttonText]} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={()=>setCompleModal(false)} style={[styles.buttonWidth, {backgroundColor:colorSelect.gray}]}>
                                <DefText text='취소' style={[styles.buttonText]} />
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
        fontSize:15,
        ...fweight.eb
    },
    texts: {
        fontSize:13
    },
    buttonWidth: {
        width:buttonWidth,
        height: 45,
        borderRadius:10,
        alignItems:'center',
        justifyContent:'center'
    },
    buttonText: {
        ...fweight.b,
        color:colorSelect.white
    }
})

export default connect(
    ({ User }) => ({
        userInfo: User.userInfo, //회원정보
    }),
    (dispatch) => ({
        member_login: (user) => dispatch(UserAction.member_login(user)), //로그인
        member_info: (user) => dispatch(UserAction.member_info(user)), //회원 정보 조회
        
    })
)(EducationVideoView);