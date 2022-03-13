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

const {width} = Dimensions.get('window');

const MemoForm = (props) => {

    const {navigation, userInfo} = props;

    const [memoTitle, setMemoTitle] = useState('');
    const memoChange = (title) => {
        setMemoTitle(title)
    }

    const [content, setContent] = useState('');
    const contentChange = (content) => {
        setContent(content);
    }

    const [member, setMember] = useState('');
    const memberChange = (member) => {
        setMember(member);
    }

    //정우성
    const [memberData, setMemberData] = useState([]);
    const [sendModal, setSendModal] = useState(false);

    const [memberName, setMemberName] = useState('');
    const [memberId, setMemberId] = useState('');

    const memberSelect = (name, idx) => {
        setMemberName(name);
        setMemberId(idx);
        setSendModal(false);
    }

    const memberSearch = () => {

        if(member == ''){
            Alert.alert('이름을 입력하세요.');
            return false;
        }

        Api.send('com_memberSearch', {'name':member}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
                //정우성
               // console.log('커뮤니케이션 회원검색: ', arrItems);
                setMemberData(arrItems);
              
            }else{
                console.log('커뮤니케이션 회원검색 실패!', resultItem);

            }
        });
    }

    const memoSend = () => {
        Api.send('com_memoForm', {'title':memoTitle, 'content':content, 'send_id':memberName, 'send_idx':memberId, 'id':userInfo.mb_id, 'names':userInfo.mb_name}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
                console.log('커뮤니케이션 메모리스트: ', resultItem);
                //setMemoData(arrItems);
                ToastMessage(resultItem.message);

            }else{
                console.log('커뮤니케이션 메모 실패!', resultItem);
                ToastMessage(resultItem.message);
            }
        });
    }

    return (
        <Box flex={1} backgroundColor='#fff'>
            <HeaderDef headerTitle='쪽지 보내기' navigation={navigation} />
            <ScrollView>
                <Box p='20px'>
                    <Box>
                        <DefText text='제목' style={[styles.labelTitle]} />
                        <DefInput 
                            placeholderText='제목을 입력해주세요.'
                            inputValue={memoTitle}
                            onChangeText={memoChange}
                        />
                    </Box>
                    <Box mt='30px'>
                        <DefText text='받는 사람' style={[styles.labelTitle]} />
                        <HStack justifyContent={'space-between'}>
                            <Box width='63%' height="40px" justifyContent={'center'} borderWidth={1} borderColor='#999999' borderRadius={5} pl='15px'>
                                {
                                    memberName != '' ?
                                    <DefText text={memberName} style={{fontSize:fsize.fs12, color:'#333'}} />
                                    :
                                    <DefText text={'받는사람을 입력해 주세요.'} style={{fontSize:fsize.fs12, color:'#999999'}} />
                                }
                            </Box>
                            <Box width='35%'>
                                <TouchableOpacity style={[styles.buttons]} onPress={()=>setSendModal(true)}>
                                    <DefText text='검색' style={[styles.buttonsText]} />
                                </TouchableOpacity>
                            </Box>
                        </HStack>
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
                        <TouchableOpacity style={[styles.fileupload]}>
                            <HStack alignItems={'center'} justifyContent='space-between'>
                                <DefText text='첨부하실 파일을 업로드하세요.' style={[styles.buttonsText, {color:'#999'}]} />
                                <Image source={require('../images/fileUpload.png')} alt='파일업로드' style={{width:12, height:12, resizeMode:'contain'}} />
                            </HStack>
                        </TouchableOpacity>
                    </Box>
                </Box>
            </ScrollView>
            <SubmitButtons 
                btnText='보내기'
                onPress={()=>memoSend()}
            />
            <Modal isOpen={sendModal} onClose={() => setSendModal(false)}>
                
                <Modal.Content>
                    <Modal.Body>
                        <DefText text='회원 찾기' style={[{fontSize:fsize.fs16}, fweight.eb]} />
                        <HStack mt='15px'>
                            <DefText text='같은 지사(지점) 내' style={{color:colorSelect.orange}} />
                            <DefText text='에서만 쪽지를 보내실 수 있습니다.' />
                        </HStack>
                        <HStack justifyContent={'space-between'} mt='15px'>
                            <Box width='72%'>
                                <DefInput
                                    placeholderText={'이름을 입력해주세요.'}
                                    inputValue={member}
                                    onChangeText={memberChange}
                                    onPress={memberSearch}
                                />
                            </Box>
                            <Box width='25%'>
                                <TouchableOpacity onPress={memberSearch} style={{height:40, backgroundColor:colorSelect.blue, borderRadius:5, justifyContent:'center', alignItems:'center'}}>
                                    <DefText text='검색' style={[styles.buttonsText]}  />
                                </TouchableOpacity>
                            </Box>
                        </HStack>
                        <Box mt='30px'>
                            <DefText text='결과 내역' style={[{fontSize:fsize.fs16, marginBottom:15}, fweight.eb]} />
                            {
                                memberData != '' &&
                                memberData.length > 0 ?
                                memberData.map((item, index)=>{
                                    return(
                                        <Box key={index} p='15px' borderRadius={5} borderWidth={1} borderColor='#999'>
                                            <DefText text={item.mb_name} style={[styles.memberTitle]} />
                                            <HStack mt='10px'>
                                                <Box width='25%'>
                                                    <DefText text={'사번'} style={[styles.memberTitle]} />
                                                </Box>
                                                <Box width='73%'>
                                                    <DefText text={item.mb_id} />
                                                </Box>
                                            </HStack>
                                            <HStack mt='10px'>
                                                <Box width='25%'>
                                                    <DefText text={'전화번호'} style={[styles.memberTitle]} />
                                                </Box>
                                                <Box width='73%'>
                                                    <DefText text={item.mb_hp} />
                                                </Box>
                                            </HStack>
                                            <Box position={'absolute'} top='15px' right='15px'>
                                                <TouchableOpacity onPress={()=>memberSelect(item.mb_name, item.mb_no)} style={{paddingHorizontal:15, paddingVertical:5, backgroundColor:colorSelect.blue, borderRadius:5}}>
                                                    <DefText text='선택' style={[styles.buttonsText]} />
                                                </TouchableOpacity>
                                            </Box>
                                        </Box>
                                    )
                                })
                                :
                                <Box py='40px' justifyContent={'center'} alignItems='center'>
                                    <DefText text='검색된 회원정보가 없습니다.' />
                                </Box>
                            }
                        </Box>
                    </Modal.Body>
                </Modal.Content>
            </Modal>
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
)(MemoForm);