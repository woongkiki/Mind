import React, {useState, useEffect} from 'react';
import { ScrollView, Platform, Dimensions, StyleSheet, Alert, View, TouchableOpacity } from 'react-native';
import { Box, VStack, HStack, Image, Input } from 'native-base';
import { DefText, SearchInput } from '../common/BOOTSTRAP';
import Font from '../common/Font';
import HeaderDef from '../components/HeaderDef';
import {fsize, fweight, colorSelect, textStyle} from '../common/StyleDef';
import { Shadow } from 'react-native-neomorph-shadows';
import {meetingMember, callMember, contractMember, consultingtMember} from '../Utils/DummyData';

const {width} = Dimensions.get('window');

const progressTag = [
    {
        idx: 1,
        tag : '미팅',
        cnt : meetingMember.length
    },
    {
        idx: 2,
        tag : '통화',
        cnt : callMember.length
    },
    {
        idx: 3,
        tag : '계약',
        cnt : contractMember.length
    },
    {
        idx: 4,
        tag : '상담',
        cnt : consultingtMember.length
    },
];

const ProgressClient = (props) => {

    const {navigation} = props;

    const [selectTag, setSelectTag] = useState('미팅');

    const [selectData, setSelectData] = useState(meetingMember);

    const selectTagHandler = (tag) => {
        setSelectTag(tag);

        if(tag === '미팅'){
            setSelectData(meetingMember);
        }else if(tag === '통화'){
            setSelectData(callMember);
        }else if(tag === '계약'){
            setSelectData(contractMember);
        }else if(tag === '상담'){
            setSelectData(consultingtMember);
        }
    }

    const memberList = selectData.map((item, index)=> {
        return(
            <Box key={index}  backgroundColor={'#fff'} borderRadius={10} shadow={9} mt={'15px'}>
                <TouchableOpacity style={{padding:15}} onPress={()=>navigation.navigate('ClientInfo')}>
                    <HStack alignItems={'center'} justifyContent='space-between' mb='10px'>
                        <Box width='30%' >
                            <DefText text={'고객명'} style={[fweight.b]}  />
                        </Box>
                        <Box width='70%' >
                            <DefText text={item.name} />
                        </Box>
                    </HStack>
                    <HStack alignItems={'center'} justifyContent='space-between' mb='10px'>
                        <Box width='30%' >
                            <DefText text={'주소'} style={[fweight.b]}  />
                        </Box>
                        <Box width='70%' >
                            <DefText text={item.address} />
                        </Box>
                    </HStack>
                    <HStack alignItems={'center'} justifyContent='space-between'>
                        <Box width='30%' >
                            <DefText text={'미팅예정일시'} style={[fweight.b]}  />
                        </Box>
                        <Box width='70%' >
                            <DefText text={item.datetime} />
                        </Box>
                    </HStack>
                    <Box position={'absolute'} top='65%' right='20px'>
                        <Image source={require('../images/memberInfoArr.png')} alt='회원정보 화살표' style={{width:6, height:10, resizeMode:'contain'}} />
                    </Box>
                </TouchableOpacity>
            </Box>
        )
    })

    return (
        <Box flex={1} backgroundColor='#fff'>
            <HeaderDef headerTitle='진행 중인 업무' navigation={navigation} />
            <ScrollView>
                <Box p='20px'>
                    <HStack backgroundColor={'#F0F0F0'} borderRadius={10}>
                        {
                            progressTag.map((item, index)=> {
                                return(
                                    <TouchableOpacity 
                                        key={index} 
                                        style={[styles.tagButton, selectTag === item.tag && { backgroundColor: colorSelect.blue }]}
                                        onPress={()=>selectTagHandler(item.tag)}
                                    >
                                        <DefText text={item.tag + ' (' + item.cnt + ')'} style={selectTag === item.tag && [{color: colorSelect.white}, fweight.eb]} />
                                    </TouchableOpacity>
                                )
                            })
                        }
                    </HStack>
                    {
                        memberList.length > 0 ?
                        memberList
                        :
                        <Box justifyContent={'center'} alignItems='center' py='40px'>
                            <DefText text={'현재 ' + selectTag + ' 상태인 고객 정보가 없습니다.'} />
                        </Box>
                    }
                </Box>
            </ScrollView>
        </Box>
    );
};


const styles = StyleSheet.create({
    tagButton: {
        width: (width - 40) * 0.25,
        height:40,
        backgroundColor:'#F0F0F0',
        alignItems:'center',
        justifyContent:'center',
        borderRadius:10
    }
})

export default ProgressClient;