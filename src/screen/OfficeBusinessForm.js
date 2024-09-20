import React, {useState, useEffect} from 'react';
import { ScrollView, Platform, Dimensions, StyleSheet, Alert, View, TouchableOpacity, FlatList, ActivityIndicator, Linking } from 'react-native';
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

const {width} = Dimensions.get('window');

const OfficeBusinessForm = (props) => {

    const {navigation, userInfo} = props;

    const [loading, setLoading] = useState(true);
    const [title, setTitle] = useState(''); //제목
    const [content, setContent] = useState(''); //내용
    const [categoryList, setCategoryList] = useState([]); //카테고리 리스트
    const [selectCategory, setSelectCategory] = useState([]); //선택한 카테고리
    const [managerName, setManagerName] = useState(''); //담당자명
    const [managerIdx, setManagerIdx] = useState(''); //담당자명
    const [singleFile, setSingleFile] = useState(''); //파일저장
    const [fileNames, setFileNames] = useState(''); //파일명 가져오기
    const [phoneHp, setPhoneHp] = useState('');
    const [mem, setMem] = useState('');

    //제목입력 핸들러
    const titleChange = (text) => {
        setTitle(text);
    }

    //내용입력 핸들러
    const contentChange = (text) => {
        setContent(text);
    }

    //카테고리 가져오기..
    const categoryHandler = async () => {
        await setLoading(true);
        await Api.send('office_category', {}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
                console.log('본사업무 카테고리리스트: ', arrItems);
                setCategoryList(arrItems);
            }else{
                console.log('본사업무 카테고리리스트 불러오기 실패!!!', resultItem);
                //ToastMessage(resultItem.message);
            }
        });
        await setLoading(false);
    }

    //카테고리 선택하기
    // const categorySelectEvent = (memberName, memberIdx, categoryName) => {

    //     console.log(memberName, memberIdx, categoryName);

    //     setManagerName(memberName);
    //     setManagerIdx(memberIdx);
    //     setSelectCategory(categoryName);
    // }
    const categorySelectEvent = (hp, idx) => {

        console.log(hp);
        setPhoneHp(hp);
        setMem(idx);
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

    const call = () => {

        if(phoneHp == ""){
            ToastMessage("등록된 관리자 연락처가 없습니다.");
            return false;
        }

         let phoneNumber = '';
         if (Platform.OS === 'ios') phoneNumber = `telprompt:${phoneHp}`;
         else                       phoneNumber = `tel:${phoneHp}`;

         Linking.openURL(phoneNumber);
    }
    
    const WriteHandler = () => {
        let filess = '';

        if(singleFile != ''){
            filess = {"uri":singleFile[0].uri, 'type':singleFile[0].type, 'name':singleFile[0].name};
        }else{
            filess = '';
        }

        //console.log('filess', filess);
        //홍길동

        Api.send('office_write', {'title':title, 'content':content, 'manager':managerName, 'managerIdx':managerIdx, "category":selectCategory, 'mb_id':userInfo.mb_id, 'wr_name':userInfo.mb_name, 'files':filess}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
                console.log('커뮤니케이션 메모리스트: ', resultItem);
                //setMemoData(arrItems);
                ToastMessage(resultItem.message);
                navigation.goBack();

            }else{
                console.log('커뮤니케이션 메모 실패!', resultItem);
                ToastMessage(resultItem.message);
            }
        });
    }

    useEffect(()=>{
        categoryHandler();
    }, [])

    return (
        <Box flex={1} backgroundColor='#fff'>
            <HeaderDef headerTitle='본사 업무 담당' navigation={navigation} />
            {
                loading ?
                <Box flex={1} backgroundColor='#fff' alignItems={'center'} justifyContent='center'>
                    <ActivityIndicator size='large' color='#333' />
                </Box>
                :
                <ScrollView>
                    <Box p='20px'>
                        {/* <Box>
                            <DefText text='제목' style={[styles.labelTitle]} />
                            <DefInput 
                                placeholderText='제목을 입력해주세요.'
                                inputValue={title}
                                onChangeText={titleChange}
                            />
                        </Box> */}
                        <Box>
                            <DefText text='받는 사람' style={[styles.labelTitle]} />
                            {/* <Box  height="40px" justifyContent={'center'} borderWidth={1} borderColor='#999999' borderRadius={5} pl='15px'>
                                {
                                    managerName != '' ?
                                    <DefText text={managerName + ' 담당자'} style={{fontSize:fsize.fs12, color:'#333'}} />
                                    :
                                    <DefText text={'받는사람을 입력해 주세요.'} style={{fontSize:fsize.fs12, color:'#999999'}} />
                                }
                            </Box> */}
                            {
                                categoryList != "" &&
                                <HStack flexWrap='wrap'>
                                {
                                    categoryList.map((item, index) => {
                                        return(
                                            <TouchableOpacity 
                                                key={index} 
                                                style={[
                                                    styles.categoryButton,
                                                    (index + 1) % 4 == 0 ? {marginRight:0} : {marginRight: (width - 40) * 0.026},
                                                    mem === item.wr_id && {backgroundColor:colorSelect.blue, borderColor:colorSelect.blue}
                                                ]}
                                                onPress={()=>categorySelectEvent(item.wr_5, item.wr_id)}
                                                >
                                                <DefText 
                                                    text={item.wr_subject} 
                                                    style={[{fontSize:fsize.fs12, textAlign:'center'}, mem === item.wr_id && {color:colorSelect.white}]} 
                                                />
                                            </TouchableOpacity>
                                        )
                                    })
                                }
                                </HStack>
                            }
                        </Box>
                        {/* <Box mt='30px'>
                            <DefText text='내용' style={[styles.labelTitle]} />
                            <DefInput 
                                placeholderText={'내용을 입력해주세요.'}
                                inputValue={content}
                                onChangeText={contentChange}
                                multiline={true}
                                textAlignVertical='top'
                                inputStyle={{height:100}}
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
                        </Box> */}
                    </Box>
                </ScrollView>
            }
            {/* <SubmitButtons 
                btnText='작성하기'
                onPress={WriteHandler}
            /> */}
            <SubmitButtons 
                btnText='연결하기'
                onPress={call}
            />
        </Box>
    );
};

const styles = StyleSheet.create({
    labelTitle: {
        fontSize:fsize.fs16,
        ...fweight.eb,
        marginBottom: 0
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
    },
    categoryButton: {
        width: (width - 40) * 0.23,
        height:40,
        borderWidth:1,
        borderColor:'#f0f0f0',
        alignItems:'center',
        justifyContent:'center',
        borderRadius:5,
        marginTop:(width - 40) * 0.026,
        paddingHorizontal:10
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
)(OfficeBusinessForm);