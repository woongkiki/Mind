import React, { useState } from 'react';
import { Dimensions, TouchableOpacity, StyleSheet } from 'react-native';
import { Box, Image } from 'native-base';
import { DefText } from '../common/BOOTSTRAP';
import { DrawerContentScrollView } from '@react-navigation/drawer'
import { fweight } from '../common/StyleDef';

const {width, height} = Dimensions.get('window');

const Menu = (props) => {

    const {navigation} = props;


    //console.log(navigation);
    const menuCloseHandler = () => {
        navigation.closeDrawer();
    }

    const dbMove = () => {
        navigation.navigate('Tab_Navigation', {
            screen: 'Db',
        });
    }

    const ScheduleMove = () => {
        navigation.navigate('Tab_Navigation', {
            screen: 'Schedule',
        });
    }

    const CommnutiyMove = () => {
        navigation.navigate('Tab_Navigation', {
            screen: 'Comunication',
        });
    }

    return (
        <DrawerContentScrollView {...props} contentContainerStyle={{paddingTop:0, marginTop:0}}>
            <Box px='20px' py='60px'>
                <TouchableOpacity  onPress={()=>menuCloseHandler()}>
                    <Image source={require('../images/sideBarClose.png')} alt='메뉴열기' style={{width:14, height:14, resizeMode:'contain'}} />
                </TouchableOpacity>
                <Box mt='35px' borderTopWidth={1} borderTopColor='#f2f2f2'>
                    <Box>
                        <TouchableOpacity style={[styles.menuBtn1]} onPress={dbMove}>
                            <DefText text='DB' style={[styles.menuBtn1Text]} />
                        </TouchableOpacity>
                    </Box>
                    <Box>
                        <TouchableOpacity style={[styles.menuBtn1]} onPress={ScheduleMove}>
                            <DefText text='스케줄' style={[styles.menuBtn1Text]} />
                        </TouchableOpacity>
                    </Box>
                    <Box>
                        <TouchableOpacity style={[styles.menuBtn1]} onPress={CommnutiyMove}>
                            <DefText text='커뮤니케이션' style={[styles.menuBtn1Text]} />
                        </TouchableOpacity>
                        <Box pl='20px'>
                            <TouchableOpacity style={[styles.menuBtn1]} onPress={()=>navigation.navigate('OfficeBoard')}>
                                <DefText text='본사 게시판' style={[styles.menuBtn1Text2]} />
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.menuBtn1]} onPress={()=>navigation.navigate('BrandBoard')}>
                                <DefText text='지사 / 지점 게시판' style={[styles.menuBtn1Text2]} />
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.menuBtn1]} onPress={()=>navigation.navigate('MemoBoard')}>
                                <DefText text='쪽지함' style={[styles.menuBtn1Text2]} />
                            </TouchableOpacity>
                        </Box>
                    </Box>
                    <Box>
                        <TouchableOpacity style={[styles.menuBtn1]} onPress={()=>navigation.navigate('Education')}>
                            <DefText text='교육' style={[styles.menuBtn1Text]} />
                        </TouchableOpacity>
                        <Box pl='20px'>
                            <TouchableOpacity style={[styles.menuBtn1]} onPress={()=>navigation.navigate('EducationVideo')}>
                                <DefText text='동영상 교육' style={[styles.menuBtn1Text2]} />
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.menuBtn1]} onPress={()=>navigation.navigate('EducationData')}>
                                <DefText text='교육 자료' style={[styles.menuBtn1Text2]} />
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.menuBtn1]} onPress={()=>navigation.navigate('MyEducation')}>
                                <DefText text='MY 교육' style={[styles.menuBtn1Text2]} />
                            </TouchableOpacity>
                        </Box>
                    </Box>
                    <Box>
                        <TouchableOpacity style={[styles.menuBtn1]} onPress={()=>navigation.navigate('Statistics')}>
                            <DefText text='통계 및 분석' style={[styles.menuBtn1Text]} />
                        </TouchableOpacity>
                    </Box>
                    <Box>
                        <TouchableOpacity style={[styles.menuBtn1]} onPress={()=>navigation.navigate('Calculate')}>
                            <DefText text='정산' style={[styles.menuBtn1Text]} />
                        </TouchableOpacity>
                    </Box>
                    <Box>
                        <TouchableOpacity style={[styles.menuBtn1]} onPress={()=>navigation.navigate('Setting')}>
                            <DefText text='설정' style={[styles.menuBtn1Text]} />
                        </TouchableOpacity>
                    </Box>
                </Box>
            </Box>
        </DrawerContentScrollView>
    );
};

const styles = StyleSheet.create({
    menuBtn1: {
        paddingVertical:25,
        borderBottomWidth:1,
        borderBottomColor:'#F2F2F2'
    },
    menuBtn1Text: {
        fontSize:15,
        ...fweight.b
    },
    menuBtn1Text2 : {
        color:'#858A90',
        fontSize:15,
    }
})

export default Menu;