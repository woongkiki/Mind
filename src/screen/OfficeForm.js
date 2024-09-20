import React, {useState, useEffect} from 'react';
import { ScrollView, Platform, Dimensions, StyleSheet, Alert, View, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { Box, VStack, HStack, Image, Input, Select, Modal } from 'native-base';
import { DefText, SearchInput, SubmitButtons, DefInput } from '../common/BOOTSTRAP';
import HeaderDef from '../components/HeaderDef';
import {fsize, fweight, colorSelect, textStyle} from '../common/StyleDef';
import { officeBoard, brandBoard, memoBoard } from '../Utils/DummyData';
import { textLengthOverCut } from '../common/dataFunction';
import ToastMessage from '../components/ToastMessage';
import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import { StackActions } from '@react-navigation/native';
import Api from '../Api';
import DocumentPicker from 'react-native-document-picker';

const {width} = Dimensions.get("window");

const OfficeForm = (props) => {

    const {navigation, userInfo} = props;

    const [loading, setLoading] = useState(true);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [categoryList, setCategoryList] = useState([]);
    const [category, setCategory] = useState('');
    const [singleFile, setSingleFile] = useState(''); //파일첨부용
    const [fileNames, setFileNames] = useState(''); //파일 이름


    const titleChange = (titles) => {
        setTitle(titles);
    }

    const contentChange = (contents) => {
        setContent(contents);
    }

    const categoryHandler = async () => {
        await setLoading(true);
        await Api.send('com_officeCategory', {}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
                console.log('커뮤니케이션 본사게시판 카테고리: ', arrItems, resultItem);
                setCategoryList(arrItems);
                //setSalesCont(arrItems);
            }else{
                console.log('커뮤니케이션 본사게시판 실패!', resultItem);

            }
        });
        await setLoading(false);
    }


    //파일첨부 이벤트
    const selectOneFile = async () => {
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
          console.log('URI : ' + res[0].uri);
          console.log('Type : ' + res[0].type);
          console.log('File Name : ' + res[0].name);
          console.log('File Size : ' + res[0].size);
          //Setting the state to show single file attributes
          setSingleFile(res);
          setFileNames(res[0].name);
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

      
    const officeWriteHandler = () => {
        let filess = '';

        if(singleFile != ''){
            filess = {"uri":singleFile[0].uri, 'type':singleFile[0].type, 'name':singleFile[0].name};
        }else{
            filess = '';
        }

        Api.send('com_officeWrite', {'category':category, 'title':title, 'content':content, 'mb_id':userInfo.mb_id, 'wr_name':userInfo.mb_name, 'files':filess}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
                console.log('본사게시판 작성하기: ', resultItem);
                //setCategoryList(arrItems);
                ToastMessage(resultItem.message);
                navigation.goBack();
                setCategory('');
                setTitle('');
                setContent('');
                setFileNames('');
                setSingleFile('');

            }else{
                console.log('본사게시판 작성하기 실패!', resultItem);
                ToastMessage(resultItem.message)
            }
        });
    }

    useEffect(()=>{
        categoryHandler()
    }, []);

    return (
        <Box flex={1} backgroundColor='#fff'>
            <HeaderDef headerTitle='본사게시판' navigation={navigation} />
            {
                loading ? 
                <Box flex={1} justifyContent='center' alignItems={'center'}>
                    <ActivityIndicator size='large' color='#333' />
                </Box>
                :
                <ScrollView>
                    <Box p='20px'>
                        <Box>
                            <DefText text='카테고리' style={[styles.labelTitle]} />
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
                                <Select.Item label='선택하세요' value='' />
                                {
                                    categoryList != "" &&
                                    categoryList.map((item, index) => {
                                        return(
                                            <Select.Item key={index} label={item.wr_subject} value={item.wr_subject}/>
                                        )
                                    })
                                }

                            </Select>
                        </Box>
                        <Box mt='30px'>
                            <DefText text='제목' style={[styles.labelTitle]} />
                            <DefInput 
                                placeholderText='제목을 입력해주세요.'
                                inputValue={title}
                                onChangeText={titleChange}
                            />
                        </Box>
                        <Box mt='30px'>
                            <DefText text='내용' style={[styles.labelTitle]} />
                            <DefInput 
                                placeholderText={'내용을 입력해주세요.'}
                                inputValue={content}
                                onChangeText={contentChange}
                                multiline={true}
                                textAlignVertical='top'
                                inputStyle={{height:200}}
                            />
                        </Box>
                        <Box mt='30px'>
                            <DefText text='파일첨부' style={[styles.labelTitle]} />
                            <TouchableOpacity onPress={selectOneFile} style={[styles.fileupload]}>
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
                        </Box>
                    </Box>
                </ScrollView>
            }
            <SubmitButtons 
                btnText='작성완료'
                onPress={officeWriteHandler}
            />
        </Box>
    );
};


const styles = StyleSheet.create({
    labelTitle: {
        fontSize:fsize.fs16,
        ...fweight.eb,
        marginBottom: 15
    },
    dateBox : {
        width:(width - 40) * 0.47
    },
    dateButton: {
        paddingBottom:10,
        borderBottomWidth:1,
        borderBottomColor:'#DFDFDF',
        paddingRight:10,
        marginTop:15,
    },
    buttons : {
        width: '100%',
        height:40,
        backgroundColor:colorSelect.blue,
        alignItems:'center',
        justifyContent:'center',
        borderRadius:5,
    },
    buttonsText: {
        color:colorSelect.white,
        fontSize:fsize.fs12
    },
    fileupload:{
        borderRadius:5,
        borderWidth:1,
        borderColor:'#999',
        height:40,
        justifyContent:'center',
        paddingHorizontal:15
    },
    memberTitle: {
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
)(OfficeForm);