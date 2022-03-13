import React, {useState, useEffect} from 'react';
import { ScrollView, Platform, Dimensions, StyleSheet, Alert, View, TouchableOpacity, FlatList } from 'react-native';
import { Box, VStack, HStack, Image, Input, Select } from 'native-base';
import { DefText, SearchInput, SubmitButtons } from '../common/BOOTSTRAP';
import HeaderDef from '../components/HeaderDef';
import {fsize, fweight, colorSelect, textStyle} from '../common/StyleDef';
import { pointList } from '../Utils/DummyData';
import { numberFormat, textLengthOverCut } from '../common/dataFunction';

const {width} = Dimensions.get('window');
const tabButtonWidth = (width - 40) * 0.333;

const PointList = (props) => {

    const {navigation} = props;

    const [category, setCategory] = useState('전체');

    const CategoryHandler = (category) => {
        setCategory(category);
    }

    const _renderItem = ({item, index}) => {
        return(
            <Box px='20px' mt={index != 0 && '20px' }>
                <Box key={index} p='15px' backgroundColor={'#fff'} borderRadius={10} shadow={9}>
                    {
                        item.charge ?
                        <Box>
                            <HStack mb='10px'>
                                <Box style={[styles.pointLeft]}>
                                    <DefText text='충전 요청일' style={[styles.pointLabel]} />
                                </Box>
                                <Box>
                                    <DefText text={item.chargeReq} />
                                </Box>
                            </HStack>
                            <HStack mb='10px'>
                                <Box style={[styles.pointLeft]}>
                                    <DefText text='충전 승인일' style={[styles.pointLabel]}  />
                                </Box>
                                <Box>
                                    <DefText text={item.chargeSubmit} />
                                </Box>
                            </HStack>
                            <HStack mb='10px'>
                                <Box style={[styles.pointLeft]}>
                                    <DefText text='요청 포인트' style={[styles.pointLabel]} />
                                </Box>
                                <Box>
                                    <DefText text={ numberFormat(item.reqPoint) + 'P'} style={[{color:colorSelect.blue}]}/>
                                </Box>
                            </HStack>
                        </Box>
                        :
                        <Box>
                            <HStack mb='10px'>
                                <Box style={[styles.pointLeft]}>
                                    <DefText text='포인트 사용' style={[styles.pointLabel]} />
                                </Box>
                                <Box>
                                    <DefText text={item.usePointDate} />
                                </Box>
                            </HStack>
                            <HStack mb='10px'>
                                <Box style={[styles.pointLeft]}>
                                    <DefText text='포인트 사용' style={[styles.pointLabel]} />
                                </Box>
                                <Box>
                                    <DefText text={numberFormat(item.usePoint) + 'P'} style={[{color:colorSelect.blue}]}  />
                                </Box>
                            </HStack>
                        </Box>
                    }
                    <HStack>
                        <Box style={[styles.pointLeft]}>
                            <DefText text='잔여 포인트' />
                        </Box>
                        <Box>
                            <DefText text={numberFormat(item.nowPoint) + 'P'} style={[{color:colorSelect.orange}]} />
                        </Box>
                    </HStack>
                </Box>
            </Box>
        )
    }

    return (
        <Box flex={1} backgroundColor='#fff'> 
            <HeaderDef headerTitle='포인트 내역' navigation={navigation} />
            
            <FlatList 
                ListHeaderComponent={
                    <Box p='20px'>
                        <Box>
                            <DefText text='보유포인트' style={[styles.pointTitle]} />
                            <DefText text={ numberFormat(50000) + 'P' } style={[styles.point]} />
                        </Box>
                        <HStack backgroundColor={'#F0F0F0'} borderRadius={10} mt='20px'>
                            <TouchableOpacity onPress={()=>CategoryHandler('전체')} style={[styles.tabWidth, category == '전체' && {backgroundColor:colorSelect.blue}]}>
                                <DefText text='전체' style={category == '전체' && [ {color:colorSelect.white}, fweight.eb ]} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={()=>CategoryHandler('1개월')} style={[styles.tabWidth, category == '1개월' && {backgroundColor:colorSelect.blue}]}>
                                <DefText text='1개월' style={ category == '1개월' && [ {color:colorSelect.white} ]} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={()=>CategoryHandler('3개월')} style={[styles.tabWidth, category == '3개월' && {backgroundColor:colorSelect.blue}]}>
                                <DefText text='3개월' style={ category == '3개월' && [ {color:colorSelect.white} ]} />
                            </TouchableOpacity>
                        </HStack>
                    </Box>
                }
                data={pointList}
                renderItem={_renderItem}
                keyExtractor={(item, index)=>index.toString()}
                ListEmptyComponent={
                    <Box py={10} alignItems='center' mt='10px'>
                        <DefText text='포인트 내역이 없습니다.' style={{color:colorSelect.black666}} />
                    </Box>                
                }
            />
            <SubmitButtons 
                btnText = '포인트 신청하기'
                onPress={()=>navigation.navigate('PointRequest')}
            />
        </Box>
    );
};

const styles = StyleSheet.create({
    pointTitle : {
        fontSize:fsize.fs20,
        ...fweight.b
    },
    point : {
        fontSize:fsize.fs16,
        color:colorSelect.orange,
        marginTop:15
    },
    tabWidth: {
        width : tabButtonWidth,
        height : 40,
        alignItems:'center',
        justifyContent:'center',
        borderRadius:10
    },
    pointLeft: {
        width: '27%'
    },
    pointLabel : {
        ...fweight.b
    },
    pointRight: {
        width: '70%'
    }
})

export default PointList;