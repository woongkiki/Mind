import React, {useState, useEffect} from 'react';
import { ScrollView, Platform, Dimensions, StyleSheet, Alert, View, TouchableOpacity, FlatList } from 'react-native';
import { Box, VStack, HStack, Image, Input, Select, Modal } from 'native-base';
import { DefText, SearchInput, SubmitButtons } from '../common/BOOTSTRAP';
import HeaderDef from '../components/HeaderDef';
import {fsize, fweight, colorSelect, textStyle} from '../common/StyleDef';
import { videoEdu } from '../Utils/DummyData';
import { textLengthOverCut } from '../common/dataFunction';
import YouTube from 'react-native-youtube';
import ToastMessage from '../components/ToastMessage';

const {width} = Dimensions.get('window');

const buttonWidth = (width - 80) * 0.47;

const EducationVideoView = (props) => {

    const {navigation, route} = props;

    const { params } = route;

    const { category, content, date, eduCompl, key, title} = params;

    const [compleModal, setCompleModal] = useState(false);

    const [buttonDisable, setButtonDisable] = useState(false);
    const compleHandler = () => {
        setCompleModal(false);
        setButtonDisable(true);
        ToastMessage('동영상 교육을 완료하였습니다.');
    }
    //console.log(params);

    return (
        <Box flex={1} backgroundColor='#fff'>
            <HeaderDef headerTitle='동영상 교육' navigation={navigation} />
            <ScrollView>
                <YouTube
                    videoId={key}
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
                    <DefText text={'[' + category + '] ' + title} style={[styles.titles]} />
                    <Box my='20px'>
                        <DefText text={ content } style={[styles.texts]} />
                    </Box>
                    <HStack justifyContent={'flex-end'}>
                        <DefText text={date} style={[styles.texts]} />
                    </HStack>
                </Box>
            </ScrollView>
            <SubmitButtons 
                btnText = '동영상 교육 완료하기'
                onPress={()=>setCompleModal(true)}
                disabled={buttonDisable}
                buttonStyle = { buttonDisable && {backgroundColor:colorSelect.gray}}
            />
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

export default EducationVideoView;