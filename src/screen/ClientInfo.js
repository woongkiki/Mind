import React, {useState, useEffect} from 'react';
import { ScrollView, Platform, Dimensions, StyleSheet, Alert, View, TouchableOpacity, Linking, ActivityIndicator, PermissionsAndroid } from 'react-native';
import { Box, VStack, HStack, Image, Modal } from 'native-base';
import { DefInput, DefText, SearchInput, SubmitButtons } from '../common/BOOTSTRAP';
import Font from '../common/Font';
import HeaderDef from '../components/HeaderDef';
import {fsize, fweight, colorSelect, textStyle} from '../common/StyleDef';
import {allClient, allClientYes, allClientNo, searchSettingCategory} from '../Utils/DummyData';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import WebView from 'react-native-webview';

import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import { StackActions } from '@react-navigation/native';
import Api from '../Api';
import ToastMessage from '../components/ToastMessage';

import { BASE_URL } from '../Utils/APIConstant';
import RNFetchBlob from 'rn-fetch-blob'

const {width} = Dimensions.get('window');
const categoryBtn = (width - 40) * 0.32;
const categoryPadding = (width - 40) * 0.02;

const ClientInfo = (props) => {

    const {navigation, route, userInfo} = props;

    const {params} = route;

    //파일 다운로드
    //퍼미션 체크
    const checkPermission = async (files, fileName) => {
        
        let fileUrl = files;
        // Function to check the platform
        // If Platform is Android then check for permissions.
    
        if (Platform.OS === 'ios') {
          downloadFile(fileUrl, fileName);
        } else {
          try {
            const granted = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
              {
                title: 'Storage Permission Required',
                message:
                  'Application needs access to your storage to download File',
              }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
              // Start downloading
              downloadFile(fileUrl, fileName);
              console.log('Storage Permission Granted.');
            } else {
              // If permission denied then show alert
              Alert.alert('Error','Storage Permission Not Granted');
            }
          } catch (err) {
            // To handle permission related exception
            console.log("++++"+err);
          }
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
        const { config, fs } = RNFetchBlob;
        let RootDir = Platform.OS === 'ios' ? fs.dirs.DocumentDir : fs.dirs.DownloadDir;
        let options = {
          fileCache: true,
          addAndroidDownloads: {
            path:
              RootDir+
              '/' + fileName +
              file_ext,
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
        return /[.]/.exec(fileUrl) ?
                 /[^.]+$/.exec(fileUrl) : undefined;
      };

    //진행상태변경 모달
    const [statusModal, setStatusModal] = useState(false);
    const statusModalClose = () => {
        setStatusModal(false);
    }

    const [selectStatus, setSelectStatus] = useState('');
    const StatusChange = (category) => {
        setSelectStatus(category);
    }


    const [statusList, setStatusList] = useState([]);
    const statusListReceive = () => {
        Api.send('db_statusList', {}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
                //console.log('진행상태리스트: ', arrItems, resultItem);
                setStatusList(arrItems);
            }else{
                console.log('진행상태리스트 API 통신 오류!', resultItem);
            }
        });
    }

    const statusChanges = () => {
        Api.send('db_statusChange', {'idx':params.idx, 'status':selectStatus, 'id':userInfo.mb_id}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
                //console.log('진행상태변경: ', arrItems, resultItem);
                ClientInfoReceive();
                ToastMessage(resultItem.message);
                setStatusModal(false);
            }else{
                console.log('진행상태변경 API 통신 오류!', resultItem);
                setStatusModal(false);
            }
        });
    }

    const [DBLoading, setDBLoading] = useState(true);
    const [DBInfo, setDBInfo] = useState('');
    //설계사 메모 추가
    const [fpMemoStatus, setFpMemoStatus] = useState('c');
    const [fpMemoidx, setFpMemoIdx] = useState('');
    const [fpMemoAdd, setFpMemoAdd] = useState(false);
    const [fpMemo, setFpMemo] = useState('');
    const fpMemoChange = (text) => {
        setFpMemo(text);
    }

    const [fpMemoListData, setFpMemoData] = useState([]);

    const [fpScheduleList, setFpScheduleList] = useState([]); // 스케줄 리스트
    const [fileUrls, setFileUrls] = useState('');
    const ClientInfoReceive = async () => {
        await setDBLoading(true);
        await Api.send('db_info', {'idx':params.idx}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
                console.log('db 상세: ', arrItems, resultItem);
                setDBInfo(arrItems);
                if(arrItems.file_down != ''){
                    setFileUrls(BASE_URL + '/data/file/prfrm/' + arrItems.file_down);
                }
            }else{
                console.log('API 통신 오류!', resultItem);

            }
        });
        await Api.send('db_fpMemo', {'idx':params.idx}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               // console.log('fp 메모 리스트: ', arrItems);
                
                setFpMemoData(arrItems);
               // setDBInfo(arrItems)
            }else{
                console.log('API 통신 오류!', resultItem);

            }
        });

        await Api.send('db_fpSchedule', {'idx':params.idx, 'midx':userInfo.mb_no}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               //console.log('fp 스케줄 리스트: ', arrItems);
               setFpScheduleList(arrItems);
            }else{
                console.log('API 통신 오류!', resultItem);

            }
        });
        await setDBLoading(false);
    }
   
    //메모 수정 및 추가
    const fpMemoForm = () => {
        Api.send('db_fpMemoInsert', {'idx':params.idx, 'mb_id':userInfo.mb_id,'m_status':fpMemoStatus, 'fpMemo':fpMemo, 'midx':fpMemoidx}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               // console.log('fp 메모 수정 하기: ', resultItem);
                setFpMemoAdd(false);
                ClientInfoReceive();
                ToastMessage(resultItem.message);
            }else{
                console.log('fp 메모 수정 통신 오류!', resultItem);

            }
        });
    }

    const [fpMemoDelStatus, setFpMemoDelStatus] = useState(false);
    const fpMemoDel = () => {
        Api.send('db_fpMemoDel', {'idx':params.idx, 'cidx':fpMemoidx}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
                console.log('fp 메모 삭제: ', resultItem);
                ToastMessage(resultItem.message);
                setFpMemoDelStatus(false);
                ClientInfoReceive();
            }else{
                console.log('fp 메모 삭제 오류!', resultItem);

            }
        });
    }

    //메모 수정
    const memoInsert = async (p, midx) => {
        await setFpMemo(p);
        await setFpMemoIdx(midx);
        await setFpMemoStatus('cu');
        await setFpMemoAdd(true);
    }

    //메모 추가
    const fpMemoAddHandler = async () => {
        await setFpMemo('');
        await setFpMemoIdx('');
        await setFpMemoStatus('c');
        await setFpMemoAdd(true);
    }

    //메모 삭제
    const fpMemoDelHandler = async (idx) => {
        await setFpMemoIdx(idx);
        await setFpMemoDelStatus(true)
    }

    useEffect(()=>{
        statusListReceive(); //진행상태변경
        ClientInfoReceive(); //고객상세정보
    }, [])

    return (
        <Box flex={1} backgroundColor='#F4F6F6'>
            <HeaderDef headerTitle='고객 상세 정보' navigation={navigation} />
            {
                DBLoading ?
                <Box flex={1} alignItems='center' justifyContent={'center'} backgroundColor='#fff'>
                    <ActivityIndicator size='large' color='#333' />
                </Box>
                :
                <ScrollView>
                    <Box p='20px' pb='30px' backgroundColor={'#fff'}>
                        <Box>
                            <Box p='20px' backgroundColor={colorSelect.blue} borderRadius={5}>
                                <HStack alignItems={'center'} justifyContent='space-between'>
                                    <DefText text='등록일시' style={[{color:colorSelect.white}, fweight.b]} />
                                    <DefText text={DBInfo?.wr_1 && DBInfo.wr_1} style={[{color:colorSelect.white}, fweight.eb]} />
                                </HStack>
                            </Box>
                            <Box p='20px' backgroundColor={'#D0DAE1'} borderRadius={5} mt='15px'>
                                <HStack alignItems={'center'} justifyContent='space-between'>
                                    <DefText text='진행 상태' style={[fweight.b]} />
                                    <DefText text={DBInfo?.wr_4 && DBInfo.wr_4} style={[{color:'#FF4D4D'}, fweight.eb]} />
                                </HStack>
                            </Box>
                            <HStack alignItems={'center'} justifyContent='space-between' mt='15px'>
                                <Box style={[
                                    styles.infoBox,
                                    DBInfo?.family_check == '1' ? {backgroundColor:colorSelect.orange} : {backgroundColor:'#F3F3F3'}
                                ]}    
                                >
                                    {
                                        DBInfo?.family_check == '1' ?
                                        <Image source={require('../images/familyIconW.png')} alt='가족상담 여부' style={{width:24, height:26, resizeMode:'contain'}} />
                                        :
                                        <Image source={require('../images/familyIconB.png')} alt='가족상담 여부' style={{width:24, height:26, resizeMode:'contain'}} />
                                    }
                                    <DefText
                                        text='가족상담'
                                        style={[
                                            fweight.b, {marginTop:5}, 
                                            DBInfo?.family_check == '1' ? {color:colorSelect.white} : {color:colorSelect.black1}
                                        ]} 
                                    />
                                </Box>
                                <Box style={[styles.infoBox, {backgroundColor:'#004375'}]}>
                                    <HStack alignItems={'center'}>
                                        <DefText text={DBInfo?.wr_5 ? DBInfo.wr_5 : '-'} style={{color:colorSelect.white}} />
                                        <Image source={require('../images/bohumUp.png')} alt='이상' style={{width:9, height:8, resizeMode:'contain', marginLeft:10}} />
                                    </HStack>
                                    <DefText text='보험료' style={[fweight.b, {color:colorSelect.white, marginTop:5}]} />
                                </Box>
                                
                                <TouchableOpacity onPress={ DBInfo.file_name != '' ? () => checkPermission(fileUrls, DBInfo.file_name) : () => ToastMessage('등록된 녹취파일이 없습니다.')} style={[styles.infoBox, {backgroundColor:colorSelect.orange}]}>
                                    <Image source={require('../images/audioIconW.png')} alt='녹음재생' style={{width:30, height:26, resizeMode:'contain'}} />
                                    <DefText text='녹음재생' style={[fweight.b, {color:colorSelect.white, marginTop:5}]}  />
                                </TouchableOpacity>
                    
                            </HStack>
                        </Box>
                    </Box>
                    <Box backgroundColor={'#fff'} shadow={9} p='20px'>
                        <HStack mb='15px'>
                            <Box style={[styles.infoTitleBox, {backgroundColor:colorSelect.blue}]}>
                                <DefText text='고객 정보' style={[styles.infoTitle]} />
                            </Box>
                        </HStack>
                        <HStack alignItems={'center'} justifyContent='space-between'>
                            <Box>
                                <DefText text={ DBInfo?.wr_subject && DBInfo.wr_subject} style={[{color:'#004375', fontSize:22}, fweight.b]} />
                                <DefText text={ DBInfo?.wr_10 && DBInfo.wr_10} style={{marginTop:10}} />
                            </Box>
                            {
                                DBInfo != '' &&
                                <TouchableOpacity onPress={()=>Linking.openURL(`tel:` + DBInfo.wr_10)}>
                                    <Image source={require('../images/clienInfoCall.png')} alt='전화걸기' style={{width:29, height:29, resizeMode:'contain'}} />
                                </TouchableOpacity>
                            }
                        </HStack>
                        <Box>
                            <HStack flexWrap={'wrap'} mt='15px' alignItems={'center'}>
                                <Box width='25%' >
                                    <DefText text='주소' />
                                </Box>
                                <Box width='70%' >
                                    <HStack alignItems={'center'}>
                                        <Box width='8px' height='8px' backgroundColor={'#004375'} mr='10px' />
                                        <DefText text={DBInfo?.wr_addr1 && DBInfo.wr_addr1 + DBInfo.wr_addr2 + DBInfo.wr_addr3} />
                                    </HStack>
                                </Box>
                            </HStack>
                            <HStack flexWrap={'wrap'} mt='15px'>
                                <Box width='25%' >
                                    <DefText text='나이' />
                                </Box>
                                <Box width='70%' >
                                    <HStack alignItems={'center'}>
                                        <Box width='8px' height='8px' backgroundColor={'#004375'} mr='10px' />
                                        <DefText text={DBInfo?.age && DBInfo.age} />
                                    </HStack>
                                </Box>
                            </HStack>
                            <HStack flexWrap={'wrap'} mt='15px'>
                                <Box width='25%' >
                                    <DefText text='직업' />
                                </Box>
                                <Box width='70%' >
                                    <HStack alignItems={'center'}>
                                        <Box width='8px' height='8px' backgroundColor={'#004375'} mr='10px' />
                                        <DefText text={DBInfo?.wr_9 && DBInfo.wr_9} />
                                    </HStack>
                                </Box>
                            </HStack>
                        </Box>
                        
                    </Box>
                    <Box backgroundColor={'#fff'}  borderTopWidth={1} borderTopColor='#EFEFF1' p='20px'>
                        <HStack flexWrap={'wrap'} >
                            <Box width='25%' >
                                <DefText text='DB 종류' />
                            </Box>
                            <Box width='70%' >
                                <HStack alignItems={'center'}>
                                    <Box width='8px' height='8px' backgroundColor={'#004375'} mr='10px' />
                                    <DefText text={DBInfo?.category1Name && DBInfo.category1Name} />
                                    {
                                        DBInfo.category2Name &&
                                        <DefText text={' > ' + DBInfo.category2Name} />
                                    }
                                    {
                                        DBInfo.category3Name &&
                                        <DefText text={' > ' + DBInfo.category3Name} />
                                    }
                                </HStack>
                            </Box>
                        </HStack>
                        <HStack flexWrap={'wrap'} mt='15px'>
                            <Box width='25%' >
                                <DefText text='상담사' />
                            </Box>
                            <Box width='70%' >
                                <HStack alignItems={'center'}>
                                    <Box width='8px' height='8px' backgroundColor={'#004375'} mr='10px' />
                                    <DefText text={DBInfo?.manage_name && DBInfo.manage_name} />
                                </HStack>
                            </Box>
                        </HStack>
                        <HStack flexWrap={'wrap'} mt='15px'>
                            <Box width='25%' >
                                <DefText text='통화희망' />
                            </Box>
                            <Box width='70%' >
                                <HStack alignItems={'center'}>
                                    <Box width='8px' height='8px' backgroundColor={'#004375'} mr='10px' />
                                    <HStack alignItems={'center'}>
                                        <DefText text={DBInfo?.wr_2 && DBInfo.wr_2} />
                                        <DefText text={DBInfo?.wr_3 && ' ' + DBInfo.wr_3} />
                                    </HStack>
                                </HStack>
                            </Box>
                        </HStack>
                    </Box>
                    <Box mt='15px' backgroundColor={'#fff'} shadow={9} p='20px'>
                        <HStack mb='15px'>
                            <Box style={[styles.infoTitleBox, {backgroundColor:'#004375'}]}>
                                <DefText text='상담사 메모' style={[styles.infoTitle]} />
                            </Box>
                        </HStack>
                        <Box>
                            <DefText text={DBInfo?.admin_memo && DBInfo.admin_memo} style={{lineHeight:23}} />
                        </Box>
                    </Box>
                    <Box mt='15px' backgroundColor={'#fff'} shadow={9}>
                        <Box px='20px' pt='20px'>
                            <HStack alignItems={'center'}>
                                <Box style={[styles.infoTitleBox, {backgroundColor:colorSelect.orange}]}>
                                    <DefText text='설계사 메모' style={[styles.infoTitle]}  />
                                </Box>
                                <TouchableOpacity style={{marginLeft:10}} onPress={()=>fpMemoAddHandler()}>
                                    <Image source={require('../images/memoAdd.png')} alt='설계사 메모 추가' style={[{width:18, height:18, resizeMode:'contain'}]} />
                                </TouchableOpacity>
                            </HStack>
                            
                        </Box>
                        {
                            fpMemoListData != '' &&
                            fpMemoListData.length > 0 ?
                            fpMemoListData.map((item, index)=> {
                                return(
                                    <Box key={index}>
                                        <Box px='20px' pt='20px' pb='20px'>
                                            <Box>
                                                <DefText text={item.wr_content} style={{lineHeight:23}} />
                                                <DefText text={item.wr_datetime} style={[{marginTop:10, fontSize:fsize.fs12}]} />
                                            </Box>
                                        </Box>
                                        <HStack>
                                            <TouchableOpacity onPress={()=>memoInsert(item.wr_content, item.wr_id)} style={[styles.memoButton, {backgroundColor:'#004375'}]}>
                                                <DefText text='수정' style={[styles.memoButtonText]} />
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={()=>fpMemoDelHandler(item.wr_id)} style={[styles.memoButton, {backgroundColor:'#333'}]}>
                                                <DefText text='삭제' style={[styles.memoButtonText]} />
                                            </TouchableOpacity>
                                        </HStack>
                                    </Box>
                                )
                            })
                            :
                            <Box p='40px' alignItems={'center'} >
                                <DefText text='등록된 메모가 없습니다.' />
                            </Box>
                        }
                        
                    </Box>

                    <Box mt='15px' backgroundColor={'#fff'} shadow={9} p='20px'>
                        <HStack alignItems={'center'}>
                            <Box style={[styles.infoTitleBox, {backgroundColor:colorSelect.blue}]}>
                                <DefText text='스케줄 정보' style={[styles.infoTitle]}  />
                            </Box>
                            {/* <TouchableOpacity style={{marginLeft:10}}>
                                <Image source={require('../images/memoAdd.png')} alt='스케줄 추가' style={[{width:18, height:18, resizeMode:'contain'}]} />
                            </TouchableOpacity> */}
                        </HStack>
                        {
                            fpScheduleList != '' && 
                            fpScheduleList.length > 0 ?
                            fpScheduleList.map((item, index) => {
                                return(
                                    <Box key={index} mt='15px'>
                                        <HStack flexWrap={'wrap'}>
                                            <Box width='25%' >
                                                <DefText text='일정' />
                                            </Box>
                                            <Box width='75%' >
                                                <HStack alignItems={'center'}>
                                                    <Box width='8px' height='8px' backgroundColor={colorSelect.blue} mr='10px' />
                                                    <DefText text={item.wr_1 + ' ' + item.wr_2} />
                                                </HStack>
                                            </Box>
                                        </HStack>
                                        <HStack flexWrap={'wrap'} mt='15px'>
                                            <Box width='25%' >
                                                <DefText text='내용' />
                                            </Box>
                                            <Box width='75%' >
                                                <HStack alignItems={'center'}>
                                                    <Box width='8px' height='8px' backgroundColor={colorSelect.blue} mr='10px' />
                                                    <DefText text={item.wr_subject} />
                                                </HStack>
                                            </Box>
                                        </HStack>
                                        <HStack alignItems={'center'} flexWrap={'wrap'} mt='15px'>
                                            <Box width='25%' >
                                                <DefText text='주소' />
                                            </Box>
                                            <Box width='75%' >
                                                <HStack alignItems={'center'}>
                                                    <Box width='8px' height='8px' backgroundColor={colorSelect.blue} mr='10px' />
                                                    <HStack flexWrap={'wrap'}>
                                                        <DefText text={item.wr_addr1} />
                                                        {
                                                            item.wr_addr2 != '' &&
                                                            <DefText text={item.wr_addr2 + item.wr_addr3} />
                                                        }
                                                    </HStack>
                                                </HStack>
                                            </Box>
                                        </HStack>
                                        {
                                            item.wr_addr1 != '' ?
                                            <Box height='170px' mt='15px' >
                                                <WebView
                                                    source={{
                                                        uri:'https://cnj02.cafe24.com/scheduleMap.php?address='+item.wr_addr1
                                                    }}
                                                    style={{
                                                        opacity:0.99,
                                                        minHeight:1,
                                                    }}
                                                />
                                                <TouchableOpacity 
                                                    style={{position:'absolute', top:0, left:0, width:width - 40, height:170, backgroundColor:'transparent'}} 
                                                    onPress={()=>navigation.navigate('MapView', {'url':item.wr_addr1})}
                                                />
                                            </Box>
                                            :
                                            <Box>
                                            </Box>
                                        }
                                        
                                    </Box>
                                )
                            })
                            :
                            <Box alignItems={'center'} py='40px'>
                                <DefText text='등록된 스케줄이 없습니다.' />
                            </Box>
                        }
                        
                    </Box>

                </ScrollView>
            }
            
            <Modal isOpen={statusModal} onClose={()=>setStatusModal(false)}>
                 <Box position={'absolute'} bottom='0' zIndex={10}>
                    <Box p='15px'  width={width} backgroundColor={colorSelect.white} borderTopLeftRadius={15} borderTopRightRadius={15}>
                        <Box alignItems={'center'}>
                            <Image source={require('../images/modalLine.png')} alt='팝업 라인' style={{width:41, height:4, resizeMode:'contain'}} />
                        </Box>
                        <Box>
                            {
                                statusList != '' &&
                                statusList.length > 0 &&
                                statusList.map((item, index) => {
                                    return(
                                        <TouchableOpacity key={index} style={{alignItems:'center', marginTop:15}} onPress={ ()=> StatusChange(item.wr_subject)}>
                                            <DefText text={item.wr_subject} style={[{fontSize:fsize.fs16}, fweight.b]} />
                                            {
                                                selectStatus === item.wr_subject &&
                                                <Box position={'absolute'} top='50%' left='10px' mt='-7.5px'>
                                                    <Image source={require('../images/statusCheck.png')} alt='체크' style={{width:16, height:15, resizeMode:'contain'}} />
                                                </Box>
                                            }
                                        </TouchableOpacity>
                                    )
                                })
                            }
                        </Box>
                    </Box>

                    <SubmitButtons 
                        btnText = '저장'
                        onPress={statusChanges}
                        activeOpacity={1}
                    />

                </Box>
             </Modal>
             <Modal isOpen={fpMemoAdd} onClose={()=>setFpMemoAdd(false)}>                
                <Modal.Content>
                    <Modal.Body>
                        <DefText text='상담사 메모 입력' style={[styles.infoTitle, {color:colorSelect.black, marginBottom:15}]} />
                        <DefInput
                            placeholderText={'메모사항을 입력하세요.'}
                            multiline={true}
                            inputValue={fpMemo}
                            onChangeText={fpMemoChange}
                            inputStyle={{height:150}}
                            textAlignVertical={'top'}
                        />
                        <SubmitButtons
                            btnText={'메모입력'}
                            buttonStyle={{width:width-86, height:40, borderRadius:5, marginTop:15}}
                            btnTextStyle={{fontSize:fsize.fs14}}
                            onPress={()=>fpMemoForm()}
                        />
                    </Modal.Body>

                </Modal.Content>
             </Modal>
             <Modal isOpen={fpMemoDelStatus} onClose={()=>setFpMemoDelStatus(false)}>                
                <Modal.Content>
                    <Modal.Body>
                        <Box justifyContent={'center'} alignItems='center'>
                            <DefText text={'등록된 메모를 정말 삭제하시겠습니까?\n메모는 복구가 불가능합니다.'} style={[styles.infoTitle, {color:colorSelect.black, marginBottom:15, textAlign:'center'}]} />
                        </Box>
                        <HStack justifyContent={'space-between'}>
                            <SubmitButtons
                                btnText={'예'}
                                buttonStyle={{width:(width-86) * 0.47, height:40, borderRadius:5, marginTop:15}}
                                btnTextStyle={{fontSize:fsize.fs14}}
                                onPress={()=>fpMemoDel()}
                            />
                            <SubmitButtons
                                btnText={'아니오'}
                                buttonStyle={{width:(width-86) * 0.47, height:40, borderRadius:5, marginTop:15, backgroundColor:colorSelect.gray}}
                                btnTextStyle={{fontSize:fsize.fs14}}
                                onPress={()=>setFpMemoDelStatus(false)}
                            />
                        </HStack>
                    </Modal.Body>

                </Modal.Content>
             </Modal>
             {
                 !statusModal &&
                 <SubmitButtons 
                    btnText = '진행 상태 변경'
                    onPress={()=>setStatusModal(true)}
                />
             }
            
             
        </Box>
    );
};

const styles = StyleSheet.create({
    infoBox : {
        width:categoryBtn,
        height : 54,
        borderRadius:5,
        alignItems:'center',
        justifyContent:'center'
    },
    infoTitleBox: {
        paddingHorizontal:10,
        paddingVertical:5,
        borderRadius:4
    },
    infoTitle: {
        ...fweight.b,
        color:colorSelect.white
    },
    memoButton: {
        width: width * 0.5,
        height: 50,
        alignItems:'center',
        justifyContent: 'center'
    },
    memoButtonText: {
        fontSize:fsize.fs16,
        color: colorSelect.white,
        ...fweight.b
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
)(ClientInfo);