import { Platform, StyleSheet } from 'react-native';
import Font from '../common/Font';

export const fsize = {
    fs12 : 12,
    fs14 : 14,
    fs16 : 16,
    fs18 : 18,
    fs20 : 20,
    fs22 : 22,
}

export const fweight = {
    eb : {
        ...Platform.select({
            ios:{
                fontFamily:Font.NanumSquareRoundEB,
                fontWeight:'900'
            },
            android: {
                fontFamily:Font.NanumSquareRoundEB
            }
        })
    },
    b : {
        ...Platform.select({
            ios:{
                fontFamily:Font.NanumSquareRoundB,
                fontWeight:'500'
            },
            android: {
                fontFamily:Font.NanumSquareRoundB
            }
        })
    },
    r : {
        ...Platform.select({
            ios:{
                fontWeight:'400'
            },
            android: {
                fontFamily:Font.NanumSquareRoundR
            }
        })
    },
    l : {
        ...Platform.select({
            ios:{
                fontWeight:'300'
            },
            android: {
                fontFamily:Font.NanumSquareRoundL
            }
        })
    }
}

export const colorSelect = {
    blue : '#4473B8',
    orange : '#F99600',
    white : '#fff',
    black1 : '#000',
    black2 : '#191919',
    black666: '#666',
    gray : '#B4B4B3',
}

export const textStyle = {
    labelTitle: {
        fontSize:fsize.fs16,
        color:colorSelect.black2,
    },
}