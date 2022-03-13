import React, {useState, useEffect} from 'react';
import { ScrollView, Platform, Dimensions, StyleSheet, Alert, View, TouchableOpacity } from 'react-native';
import { Box, VStack, HStack, Image, Input } from 'native-base';
import { DefText, SearchInput } from '../common/BOOTSTRAP';
import Font from '../common/Font';
import HeaderDef from '../components/HeaderDef';
import {fsize, fweight, colorSelect, textStyle} from '../common/StyleDef';
import {allClient, allClientYes, allClientNo} from '../Utils/DummyData';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import WebView from 'react-native-webview';

const {width, height} = Dimensions.get('window');

const MapView = ( props ) => {

    const {navigation, route} = props;

    const {params} = route;

    return (
        <Box flex={1} backgroundColor='#fff'>
            <HeaderDef headerTitle='스케줄 정보' navigation={navigation} />
            <Box height={ height - 55 }>
                <WebView
                    source={{
                        uri:'https://cnj02.cafe24.com/scheduleMap.php?address=서울특별시 구로구 구로동&clientlName=홍길동'
                    }}
                    style={{width:width}}
                />
            </Box>
        </Box>
    );
};

export default MapView;