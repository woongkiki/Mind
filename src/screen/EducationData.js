import React, {useState, useEffect} from 'react';
import { ScrollView, Platform, Dimensions, StyleSheet, Alert, View, TouchableOpacity, FlatList, ActivityIndicator, Linking, PermissionsAndroid } from 'react-native';
import { Box, VStack, HStack, Image, Input, Select } from 'native-base';
import { DefText, SearchInput } from '../common/BOOTSTRAP';
import HeaderDef from '../components/HeaderDef';
import {fsize, fweight, colorSelect, textStyle} from '../common/StyleDef';
import { videoEdu, eduData } from '../Utils/DummyData';
import { textLengthOverCut } from '../common/dataFunction';

import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import { StackActions } from '@react-navigation/native';
import Api from '../Api';

import { BASE_URL } from '../Utils/APIConstant';

import RNFetchBlob from 'rn-fetch-blob'
import ToastMessage from '../components/ToastMessage';

const {width} = Dimensions.get('window');

const EducationData = (props) => {

    const {navigation, userInfo} = props;

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

    const [category, setCategory] = useState('');

    const [searchText, setSearchText] = useState('');

    const schTextChange = (text) => {
        setSearchText(text);
    }

    const schHandler = () => {
        dataHandler();
    }

    const [dataLoading, setDataLoading] = useState(true);
    const [dataCategory, setDataCategory] = useState([]);
    const [dataBoard, setDataBoard] = useState([]);
    const dataHandler = async () => {
        await setDataLoading(true);
        await Api.send('com_dataCategory', {'category':category, 'schText':searchText}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
              // console.log('동영상 교육자료 카테고리 내역 결과: ', arrItems, resultItem); 
               //setDataBoard(arrItems);
               setDataCategory(arrItems);
            }else{
                console.log('동영상 교육자료 카테고리 내역 실패!', resultItem);

            }
        });
        await Api.send('com_dataAll', {'category':category, 'schText':searchText}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
               console.log('동영상 교육자료 내역 결과: ', arrItems, resultItem); 
               setDataBoard(arrItems);
            }else{
                console.log('동영상 교육자료 내역 실패!', resultItem);

            }
        });
        await setDataLoading(false);
    }

    useEffect(()=>{
        dataHandler();
    }, [category]);


    const dataDownload = (board, wr_id, no, title) => {
        Api.send('com_download', {'id':userInfo.mb_id, 'midx':userInfo.mb_no, 'names':userInfo.mb_name, 'didx':wr_id, 'title':title}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
              // console.log('동영상 교육자료 다운로드 결과: ', arrItems, resultItem); 
               
            }else{
                console.log('동영상 교육자료 다운로드 실패!', resultItem);

            }
        });
        Linking.openURL(BASE_URL+ `/bbs/download.php?bo_table=` + board +`&wr_id=` + wr_id + `&no=` + no);
    }


    const _renderItem = ({item, index}) => {

        let fileDown;
        if(item.file_down != ''){
            fileDown = BASE_URL + '/data/file/education_data/' + item.file_down;
        }

        return(
            <Box  px='20px' key={index} mb='15px'>
                <Box shadow={9} backgroundColor='#fff' borderRadius={10}>
                    <HStack alignItems={'center'} p='20px' justifyContent='space-between'>
                        <Box width='80%'>
                            <DefText text={ textLengthOverCut('[' + item.wr_1 + '] ' + item.wr_subject, 20)} style={[styles.videoTitle]} />
                            <DefText text={item.wr_datetime.substring(0, 10)} style={[{color:colorSelect.gray, marginTop:10}]} />
                        </Box>
                        <TouchableOpacity onPress={()=>checkPermission(fileDown, item.file_name)}>
                            <Image source={require('../images/downIcons.png')} alt='다운로드' style={{width:27, height:27, resizeMode:'contain'}} />
                        </TouchableOpacity>
                    </HStack>
                </Box>
            </Box>
        )
    };

    return (
        <Box flex={1} backgroundColor='#fff'>
            <HeaderDef navigation={navigation} headerTitle='교육 자료' />
            {
                dataLoading ?
                <Box flex={1} alignItems='center' justifyContent={'center'}>
                    <ActivityIndicator size='large' color='#333' />
                </Box>
                :
                <FlatList 
                    ListHeaderComponent={
                        <Box p='20px' pb='0' mb='30px'>
                            <HStack alignItems={'center'} justifyContent='space-between'>
                                <Box width='34%'>
                                    <Select
                                        selectedValue={category}
                                        width='100%'
                                        height='42px'
                                        fontSize={fsize.fs12}
                                        style={fweight.r}
                                        backgroundColor='#fff'
                                        borderWidth={1}
                                        borderColor='#999999'
                                        onValueChange={(itemValue) => setCategory(itemValue)}
                                    >
                                        <Select.Item label='구분' value='' />
                                        {
                                            dataCategory.map((item, index)=> {
                                                return(
                                                    <Select.Item label={item.wr_subject} value={item.wr_subject} key={index} />
                                                )
                                            })
                                        }
                                    </Select>
                                </Box>
                                <Box width='64%'>
                                    <SearchInput 
                                        placeholder='검색어를 입력해 주세요.'
                                        value={searchText}
                                        onChangeText={schTextChange}
                                        onPress={schHandler}
                                    />
                                </Box>
                            </HStack>
                        </Box>
                    }
                    data={dataBoard}
                    renderItem={_renderItem}
                    keyExtractor={(item, index)=>index.toString()}
                    ListEmptyComponent={
                        <Box py={10} alignItems='center'>
                            <DefText text='등록된 교육 자료가 없습니다.' style={{color:colorSelect.black666}} />
                        </Box>                
                    }
                />
            }
        </Box>
    );
};

const styles = StyleSheet.create({
    newBox: {
        width:16,
        height:16,
        borderRadius:16,
        backgroundColor:colorSelect.orange,
        alignItems:'center',
        justifyContent:'center',
        marginLeft:5
    },
    newBoxText: {
        fontSize:10,
        color:colorSelect.white
    },
    videoTitle: {
        fontSize:15,
        ...fweight.eb
    },
    videoText1: {
        fontSize:13,
    },
})

export default connect(
    ({ User }) => ({
        userInfo: User.userInfo, //회원정보
    }),
    (dispatch) => ({
        member_login: (user) => dispatch(UserAction.member_login(user)), //로그인
        member_info: (user) => dispatch(UserAction.member_info(user)), //회원 정보 조회
        
    })
)(EducationData);