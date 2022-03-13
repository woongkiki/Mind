import React, {useState, useEffect} from 'react';
import { ScrollView, Platform, Dimensions, StyleSheet, Alert, View, TouchableOpacity, FlatList } from 'react-native';
import { Box, VStack, HStack, Image, Input, Select } from 'native-base';
import { DefText, SearchInput } from '../common/BOOTSTRAP';
import HeaderDef from '../components/HeaderDef';
import {fsize, fweight, colorSelect, textStyle} from '../common/StyleDef';
import { videoEdu, brandBoard, memoBoard, eduData } from '../Utils/DummyData';
import { textLengthOverCut } from '../common/dataFunction';

const {width} = Dimensions.get('window');
const commuBoxWidth = width * 0.43;

const Education = (props) => {

    const {navigation} = props;

    const [category, setCategory] = useState('전체');

    const [searchText, setSearchText] = useState('');

    const schTextChange = (text) => {
        setSearchText(text);
    }

    const schHandler = () => {
        if(searchText == ''){
            Alert.alert('검색어를 입력해주세요.');
            return false;
        }

        Alert.alert(searchText);
    }

    return (
        <Box flex={1} backgroundColor='#fff'>
            <HeaderDef headerTitle='교육' navigation={navigation} />
            <ScrollView>
                <Box p='20px'>
                    <HStack alignItems={'center'} justifyContent='space-between' mb='30px'>
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
                                <Select.Item label='전체' value='전체' />
                                <Select.Item label='동영상' value='동영상' />
                                <Select.Item label='교육자료' value='교육자료' />
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
                    <Box>
                        <HStack alignItems={'center'} justifyContent='space-between'>
                            <DefText text='동영상 교육' style={[styles.listBoxTitle]} />
                            <TouchableOpacity onPress={()=>navigation.navigate('EducationVideo')} style={styles.listBoxTitleArrButton}>
                                <Image source={require('../images/moreBtnBlack.png')} alt='더보기' style={[styles.listBoxTitleArr]} />
                            </TouchableOpacity>
                        </HStack>
                        <Box p='15px' backgroundColor={'#fff'} shadow={9} borderRadius={10} mt='10px'>
                            {
                                videoEdu.map((item, index)=> {
                                    return(
                                        <Box key={index} style={{ marginTop: index == '0' ? 0 : 15}}>
                                            <HStack alignItems={'center'} justifyContent='space-between'>
                                                <HStack   width='85%'>
                                                    <Box width='32%' >
                                                        <DefText text={'[' + item.category + ']'} style={[styles.boardText]} />
                                                    </Box>
                                                    <Box width='64%' >
                                                        
                                                        <TouchableOpacity onPress={()=>navigation.navigate('EducationVideoView', item)}>
                                                            <HStack>
                                                                {
                                                                    item.new == 'Y' &&
                                                                    <Box style={[styles.newBox]}>
                                                                        <DefText text='N' style={[styles.newBoxText]} />
                                                                    </Box>
                                                                }
                                                                <DefText text={ textLengthOverCut(item.title, 15)} style={[styles.boardText]} />
                                                            </HStack>
                                                        </TouchableOpacity>
                                                    </Box>
                                                </HStack>
                                                <Box width='12%' alignItems={'flex-end'}>
                                                    <DefText text={ item.date.substring(5, 10) } style={{fontSize:fsize.fs12, color:'#B4B4B3'}} />
                                                </Box>
                                            </HStack>
                                        </Box>
                                    )
                                })
                            }
                        </Box>
                    </Box>
                    <Box mt='30px'>
                        <HStack alignItems={'center'} justifyContent='space-between'>
                            <DefText text='교육 자료' style={[styles.listBoxTitle]} />
                            <TouchableOpacity onPress={()=>navigation.navigate('EducationData')} style={styles.listBoxTitleArrButton}>
                                <Image source={require('../images/moreBtnBlack.png')} alt='더보기' style={[styles.listBoxTitleArr]} />
                            </TouchableOpacity>
                        </HStack>
                        <Box p='15px' backgroundColor={'#fff'} shadow={9} borderRadius={10} mt='10px'>
                            {
                                eduData.map((item, index)=> {
                                    return(
                                        <Box key={index} style={{ marginTop: index == '0' ? 0 : 15}}>
                                            <HStack alignItems={'center'} justifyContent='space-between'>
                                                <HStack   width='85%'>
                                                    <Box width='32%' >
                                                        <DefText text={'[' + item.category + ']'} style={[styles.boardText]} />
                                                    </Box>
                                                    <Box width='64%' >
                                                        
                                                        <TouchableOpacity>
                                                            <HStack>
                                                                {
                                                                    item.new == 'Y' &&
                                                                    <Box style={[styles.newBox]}>
                                                                        <DefText text='N' style={[styles.newBoxText]} />
                                                                    </Box>
                                                                }
                                                                <DefText text={ textLengthOverCut(item.title, 15)} style={[styles.boardText]} />
                                                            </HStack>
                                                        </TouchableOpacity>
                                                    </Box>
                                                </HStack>
                                                <Box width='12%' alignItems={'flex-end'}>
                                                    <DefText text={ item.date.substring(5,10) } style={{fontSize:fsize.fs12, color:'#B4B4B3'}} />
                                                </Box>
                                            </HStack>
                                        </Box>
                                    )
                                })
                            }
                        </Box>
                    </Box>
                    <HStack mt='30px' justifyContent={'flex-end'}>
                        <TouchableOpacity style={[styles.myeduBtn]} onPress={()=>navigation.navigate('MyEducation')}>
                            <DefText text='MY 교육' style={[styles.myeduBtnText]} />
                        </TouchableOpacity>
                    </HStack>
                </Box>
            </ScrollView>
        </Box>
    );
};

const styles = StyleSheet.create({
    commuTopBox : {
        borderRadius:10,
        backgroundColor:colorSelect.orange,
        width:commuBoxWidth,
        height:50,

        justifyContent:'center',
        paddingHorizontal:15,
    },
    listBoxTitle: {
        fontSize:fsize.fs16,
        ...fweight.eb
    },
    listBoxTitleWrap : {
        height: 35,
        borderTopLeftRadius:10,
        borderTopRightRadius:10,
        justifyContent:'center',
        paddingLeft:15
    },
    listBoxTitleArrButton: {
        width: 35,
        height:35,
        justifyContent:'center',
        alignItems:'center'
    },
    listBoxTitleArr: {
        width:6,
        height:10,
        resizeMode:'contain'
    },
    boardText: {
        fontSize:13,
        ...fweight.b
    },
    newBox: {
        width:16,
        height:16,
        borderRadius:16,
        backgroundColor:colorSelect.orange,
        justifyContent:'center',
        alignItems:'center',
        marginRight:10
    },
    newBoxText: {
        fontSize:9,
        color:colorSelect.white
    },
    myeduBtn: {
        paddingVertical:10,
        paddingHorizontal:20,
        borderRadius:5,
        backgroundColor:'#004375'
    },
    myeduBtnText: {
        color:colorSelect.white,
        ...fweight.b
    }
})

export default Education;