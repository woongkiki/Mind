import React, {useState, useEffect} from 'react';
import { ScrollView, Platform, Dimensions, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { Box, VStack, HStack, Image, Input } from 'native-base';
import { DefText } from '../common/BOOTSTRAP';
import Font from '../common/Font';

const headerHeight = 55;

const HeaderDef = (props) => {

    const {navigation, headerTitle} = props;

    return (
        <Box height={headerHeight + 'px'}  alignItems={'center'} justifyContent='center' backgroundColor={'#fff'}>
            <Box style={[styles.homeIconWrap]}>
                <TouchableOpacity style={[styles.backButton]} onPress={()=>{navigation.goBack()}}>
                    <Image source={require('../images/headerArr.png')} alt='뒤로가기' style={{width:9, height:14, resizeMode:'contain'}} />
                </TouchableOpacity>
            </Box>
            <DefText text={headerTitle} style={[styles.headerTitle, Platform.OS === 'ios' ? {fontWeight:'700'} : {fontFamily:Font.NanumSquareRoundEB}]} />
        </Box>
    );
};

const styles = StyleSheet.create({
    headerTitle: {
        fontSize:18,
    },
    homeIconWrap: {
        height:headerHeight,
        position:'absolute',
        left: 25,
        justifyContent:'center'
    },
    backButton: {
        height:headerHeight,
        justifyContent:'center'
    }
})

export default HeaderDef;