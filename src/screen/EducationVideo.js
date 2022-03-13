import React, {useState, useEffect} from 'react';
import { ScrollView, Platform, Dimensions, StyleSheet, Alert, View, TouchableOpacity, FlatList } from 'react-native';
import { Box, VStack, HStack, Image, Input, Select } from 'native-base';
import { DefText, SearchInput } from '../common/BOOTSTRAP';
import HeaderDef from '../components/HeaderDef';
import {fsize, fweight, colorSelect, textStyle} from '../common/StyleDef';
import { videoEdu } from '../Utils/DummyData';
import { textLengthOverCut } from '../common/dataFunction';

const {width} = Dimensions.get('window');
const thumbWidth = (width - 40) * 0.3;
const contentWidth = (width-40) - thumbWidth;
const thumbHeight = thumbWidth / 1.34;

const EducationVideo = (props) => {

    const {navigation} = props;

    const [category, setCategory] = useState('');

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

    const _renderItem = ({item, index}) => {
        return(
            <TouchableOpacity key={index} style={{paddingHorizontal:20, marginTop:20}} onPress={()=>navigation.navigate('EducationVideoView', item)}>
                <HStack alignItems={'center'}>
                    <Box width={thumbWidth}>
                        <Image source={{uri:item.youtubeThumb}} alt={item.title} style={{width:thumbWidth, height:thumbHeight, resizeMode:'stretch', borderRadius:12}}/>
                    </Box>
                    <Box width={contentWidth} pl='15px'>
                        <DefText text={ textLengthOverCut('[' + item.category + '] ' + item.title, 18)} style={[styles.videoTitle]} />
                        <DefText text={ textLengthOverCut(item.content, 18)} style={[{marginTop:7, marginBottom:10}, styles.videoText1]}/>
                        <HStack alignItems={'center'} justifyContent='space-between'>
                            <DefText text={item.date} style={[styles.videoText1]} />
                            {
                                item.eduCompl === 'Y' ?
                                <DefText text={'교육완료'} style={[styles.videoText1, {color:'#FF4D4D'}]} />
                                :
                                <DefText text={'미완료'} style={[styles.videoText1, {color:'#B4B4B3'}]} />
                            }
                        </HStack>
                    </Box>
                </HStack>
            </TouchableOpacity>
        )
    };

    return (
        <Box flex={1} backgroundColor='#fff'>
            <HeaderDef headerTitle='동영상 교육' navigation={navigation} />
            <FlatList 
                ListHeaderComponent={
                    <Box p='20px' pb='0'>
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
                                    <Select.Item label='종류' value='' />
                                    <Select.Item label='생명보험' value='생명보험' />
                                    <Select.Item label='손해보험' value='손해보험' />
                                    <Select.Item label='커뮤니케이션' value='커뮤니케이션' />
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
                data={videoEdu}
                renderItem={_renderItem}
                keyExtractor={(item, index)=>index.toString()}
                ListEmptyComponent={
                    <Box py={10} alignItems='center'>
                        <DefText text='등록된 동영상 교육이 없습니다.' style={{color:colorSelect.black666}} />
                    </Box>                
                }
            />
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
        fontSize:fsize.fs16,
        ...fweight.eb
    },
    videoText1: {
        fontSize:13,
    },
})

export default EducationVideo;