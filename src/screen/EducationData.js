import React, {useState, useEffect} from 'react';
import { ScrollView, Platform, Dimensions, StyleSheet, Alert, View, TouchableOpacity, FlatList } from 'react-native';
import { Box, VStack, HStack, Image, Input, Select } from 'native-base';
import { DefText, SearchInput } from '../common/BOOTSTRAP';
import HeaderDef from '../components/HeaderDef';
import {fsize, fweight, colorSelect, textStyle} from '../common/StyleDef';
import { videoEdu, eduData } from '../Utils/DummyData';
import { textLengthOverCut } from '../common/dataFunction';

const {width} = Dimensions.get('window');

const EducationData = (props) => {

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
            <Box  px='20px' key={index} mb='15px'>
                <Box shadow={9} backgroundColor='#fff' borderRadius={10}>
                    <HStack alignItems={'center'} p='20px' justifyContent='space-between'>
                        <Box width='80%'>
                            <DefText text={ textLengthOverCut('[' + item.category + '] ' + item.title, 20)} style={[styles.videoTitle]} />
                            <DefText text={item.date} style={[{color:colorSelect.gray, marginTop:10}]} />
                        </Box>
                        <TouchableOpacity>
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
                                    <Select.Item label='생명보험' value='생명보험' />
                                    <Select.Item label='손해보험' value='손해보험' />
                                    <Select.Item label='기타' value='기타' />
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
                data={eduData}
                renderItem={_renderItem}
                keyExtractor={(item, index)=>index.toString()}
                ListEmptyComponent={
                    <Box py={10} alignItems='center'>
                        <DefText text='등록된 교육 자료가 없습니다.' style={{color:colorSelect.black666}} />
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
        fontSize:15,
        ...fweight.eb
    },
    videoText1: {
        fontSize:13,
    },
})

export default EducationData;