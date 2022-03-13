import React, {useState, useEffect} from 'react';
import { ScrollView, Platform, Dimensions, StyleSheet, Alert, View, TouchableOpacity, FlatList } from 'react-native';
import { Box, VStack, HStack, Image, Input, Select } from 'native-base';
import { DefText, SearchInput } from '../common/BOOTSTRAP';
import HeaderDef from '../components/HeaderDef';
import {fsize, fweight, colorSelect, textStyle} from '../common/StyleDef';
import { officeBoard, brandBoard, memoBoard } from '../Utils/DummyData';
import { textLengthOverCut } from '../common/dataFunction';
import HTML from 'react-native-render-html';
import StyleHtml from '../common/StyleHtml';
import {connect} from 'react-redux';
import { actionCreators as UserAction } from '../redux/module/action/UserAction';
import { StackActions } from '@react-navigation/native';
import Api from '../Api';

const BoardView = (props) => {

    const {navigation, route, userInfo} = props;

    const {params} = route;

    const {item, screen} = params;

    //console.log(params.idx);

    const [boardData, setBoardData] = useState('');

    const boardViewHandler = () => {
        Api.send('com_view', {'bo_table':screen, 'idx':params.idx}, (args)=>{
            let resultItem = args.resultItem;
            let arrItems = args.arrItems;
    
            if(resultItem.result === 'Y' && arrItems) {
                console.log('커뮤니케이션 본사게시판 상세: ', resultItem);
                setBoardData(arrItems);

            }else{
                console.log('커뮤니케이션 본사게시판 상세 실패!', resultItem);

            }
        });
    }

    useEffect(()=>{
        boardViewHandler();
    }, [])

    return (
        <Box flex={1} backgroundColor='#fff'>
            {
                screen == 'MemoBoard' &&
                <HeaderDef headerTitle='쪽지함' navigation={navigation} />
            }
            {
                screen == 'OfficeBoard' &&
                <HeaderDef headerTitle='본사 게시판' navigation={navigation} />
            }
            {
                screen == 'BrandBoard' &&
                <HeaderDef headerTitle='지사 / 지점 게시판' navigation={navigation} />
            }
            
            <ScrollView>
                <Box p='20px'>
                    <Box>
                        {
                            screen == 'MemoBoard' ?
                            <DefText text={'['+ item.wr_name + '] ' + item.wr_subject} style={[styles.borderTitle]} />
                            :
                            <DefText text={'['+ item.wr_1 + '] ' + item.wr_subject} style={[styles.borderTitle]} />
                        }
                    </Box>
                    <Box mt='10px'>
                        <DefText text={item.datetime} style={{fontSize:13}} />
                    </Box>
                    <Box style={[styles.contentBox]}>
                        <HTML 
                            ignoredStyles={[ 'width', 'height', 'margin', 'padding', 'fontFamily', 'lineHeight', 'fontSize', 'br']}
                            ignoredTags={['head', 'script', 'src']}
                            imagesMaxWidth={Dimensions.get('window').width - 40}
                            source={{html: item.wr_content}} 
                            tagsStyles={StyleHtml}
                            containerStyle={{ flex: 1, }}
                            contentWidth={Dimensions.get('window').width}  
                        />
                        {
                            screen == 'OfficeBoard' &&
                            <HStack mt='20px'>
                                <TouchableOpacity style={[styles.scheduleButton]}>
                                    <DefText text='스케줄로 등록하기' style={[styles.scheduleButtonText]} />
                                </TouchableOpacity>
                            </HStack>
                        }
                        {
                            screen == 'BrandBoard' &&
                            <HStack mt='20px'>
                                <TouchableOpacity style={[styles.scheduleButton]}>
                                    <DefText text='스케줄로 등록하기' style={[styles.scheduleButtonText]} />
                                </TouchableOpacity>
                            </HStack>
                        }
                        {
                            screen == 'MemoBoard' &&
                            <HStack mt='20px'>
                                <TouchableOpacity style={[styles.scheduleButton, {backgroundColor:colorSelect.blue}]}>
                                    <DefText text='첨부 파일 다운로드' style={[styles.scheduleButtonText]} />
                                </TouchableOpacity>
                            </HStack>
                        }
                    </Box>
                    <Box mt='20px'>
                        <TouchableOpacity onPress={()=>navigation.navigate(screen)} style={[styles.listButton]}>
                            <DefText text='목록보기' style={[styles.listButtonText]} />
                        </TouchableOpacity>
                    </Box>
                </Box>
            </ScrollView>
        </Box>
    );
};

const styles = StyleSheet.create({
    borderTitle: {
        fontSize:fsize.fs20,
        ...fweight.b
    },
    contentBox:{
        borderTopWidth:2,
        borderTopColor:'#191919',
        paddingVertical:40,
        paddingHorizontal:20,
        backgroundColor:'#FAFAFA',
        borderBottomWidth:1,
        borderBottomColor:'#ECECEC',
        marginTop:20
    },
    contentText: {
        lineHeight:23,
        color:'#909090'
    },
    listButton: {
        height:45,
        borderWidth:1,
        borderColor:'#707070',
        borderRadius:45,
        justifyContent:'center',
        alignItems:'center'
    },
    listButtonText: {
        fontSize:fsize.fs16,
        ...fweight.b
    },
    scheduleButton: {
        paddingHorizontal:10,
        paddingVertical:5,
        borderRadius:5,
        backgroundColor:colorSelect.orange
    },
    scheduleButtonText: {
        color:colorSelect.white,
        fontSize:fsize.fs12
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
)(BoardView);