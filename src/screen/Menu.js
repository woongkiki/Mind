import React, {useState} from 'react';
import {Dimensions, TouchableOpacity, StyleSheet} from 'react-native';
import {Box, Image} from 'native-base';
import {DefText} from '../common/BOOTSTRAP';
import {DrawerContentScrollView} from '@react-navigation/drawer';
import {fweight} from '../common/StyleDef';
import {connect} from 'react-redux';
import {actionCreators as UserAction} from '../redux/module/action/UserAction';

const {width, height} = Dimensions.get('window');

const Menu = props => {
  const {navigation, userInfo} = props;

  //console.log(navigation);
  const menuCloseHandler = () => {
    navigation.closeDrawer();
  };

  const dbMove = () => {
    navigation.navigate('Tab_Navigation', {
      screen: 'Db',
    });
  };

  const ScheduleMove = () => {
    navigation.navigate('Tab_Navigation', {
      screen: 'Schedule',
      params: {wm: ''},
    });
  };

  const CommnutiyMove = () => {
    navigation.navigate('Tab_Navigation', {
      screen: 'Comunication',
    });
  };

  const [educationOn, setEducationOn] = useState(false);
  const [wmOn, setWmOn] = useState(false);

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={{paddingTop: 0, marginTop: 0}}>
      <Box px="20px" py="30px">
        <TouchableOpacity onPress={() => menuCloseHandler()}>
          <Image
            source={require('../images/sideBarClose.png')}
            alt="메뉴닫기"
            style={{width: 14, height: 14, resizeMode: 'contain'}}
          />
        </TouchableOpacity>

        {userInfo?.mb_4 > 1 && (
          <Box mt="35px" borderTopWidth={1} borderTopColor="#f2f2f2">
            <TouchableOpacity
              onPress={() => navigation.navigate('DBstatistics')}
              style={[styles.menuBtn1]}>
              <DefText text="DB배정현황 조회" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('DBuse')}
              style={[styles.menuBtn1]}>
              <DefText text="DB사용현황 조회" />
            </TouchableOpacity>
          </Box>
        )}
        <Box
          mt={userInfo?.mb_4 > 1 ? 0 : '35px'}
          borderTopWidth={userInfo?.mb_4 > 1 ? 0 : 1}
          borderTopColor="#f2f2f2">
          <Box>
            <TouchableOpacity style={[styles.menuBtn1]} onPress={dbMove}>
              <DefText text="가망고객" style={[styles.menuBtn1Text]} />
            </TouchableOpacity>
          </Box>
          <Box>
            <TouchableOpacity style={[styles.menuBtn1]} onPress={ScheduleMove}>
              <DefText text="스케줄" style={[styles.menuBtn1Text]} />
            </TouchableOpacity>
          </Box>
          {/* <Box>
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
                            <TouchableOpacity style={[styles.menuBtn1]} onPress={()=>navigation.navigate('OfficeBusiness')}>
                                <DefText text='본사업무' style={[styles.menuBtn1Text2]} />
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.menuBtn1]} onPress={()=>navigation.navigate('SalesList')}>
                                <DefText text='Sales Hot-line' style={[styles.menuBtn1Text2]} />
                            </TouchableOpacity>
                        </Box>
                    </Box> */}
          <Box>
            <TouchableOpacity style={[styles.menuBtn1]} onPress={CommnutiyMove}>
              <DefText text="Hot line" style={[styles.menuBtn1Text]} />
            </TouchableOpacity>
            <Box pl="20px">
              {/* <TouchableOpacity style={[styles.menuBtn1]} onPress={()=>navigation.navigate('OfficeBoard')}>
                                <DefText text='본사 게시판' style={[styles.menuBtn1Text2]} />
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.menuBtn1]} onPress={()=>navigation.navigate('BrandBoard')}>
                                <DefText text='지사 / 지점 게시판' style={[styles.menuBtn1Text2]} />
                            </TouchableOpacity> */}

              <TouchableOpacity
                style={[styles.menuBtn1]}
                onPress={() => navigation.navigate('SalesList')}>
                <DefText text="Hot-line" style={[styles.menuBtn1Text2]} />
              </TouchableOpacity>
            </Box>
          </Box>
          <Box>
            <TouchableOpacity
              style={[styles.menuBtn1]}
              onPress={() => setEducationOn(!educationOn)}>
              <DefText text="교육" style={[styles.menuBtn1Text]} />
            </TouchableOpacity>
            {/* {
                            educationOn &&
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
                        } */}
            {educationOn && (
              <Box pl="20px">
                <TouchableOpacity
                  style={[styles.menuBtn1]}
                  onPress={() => navigation.navigate('EducationList')}>
                  <DefText text="교육 신청" style={[styles.menuBtn1Text2]} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.menuBtn1]}
                  onPress={() => navigation.navigate('EducationDataNew')}>
                  <DefText text="교육 자료" style={[styles.menuBtn1Text2]} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.menuBtn1]}
                  onPress={() => navigation.navigate('EducationVideo')}>
                  <DefText text="교육 영상" style={[styles.menuBtn1Text2]} />
                </TouchableOpacity>
              </Box>
            )}
            {/* <Box pl='20px'>
                            <TouchableOpacity style={[styles.menuBtn1]} onPress={()=>navigation.navigate('EducationVideo')}>
                                <DefText text='동영상 교육' style={[styles.menuBtn1Text2]} />
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.menuBtn1]} onPress={()=>navigation.navigate('EducationData')}>
                                <DefText text='교육 자료' style={[styles.menuBtn1Text2]} />
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.menuBtn1]} onPress={()=>navigation.navigate('MyEducation')}>
                                <DefText text='MY 교육' style={[styles.menuBtn1Text2]} />
                            </TouchableOpacity>
                        </Box> */}
          </Box>
          <Box>
            <TouchableOpacity
              style={[styles.menuBtn1]}
              onPress={() => setWmOn(!wmOn)}>
              <DefText text="WM 서비스" style={[styles.menuBtn1Text]} />
            </TouchableOpacity>
            {wmOn && (
              <Box pl="20px">
                <TouchableOpacity
                  style={[styles.menuBtn1]}
                  onPress={() => navigation.navigate('WMService')}>
                  <DefText text="WM 신청" style={[styles.menuBtn1Text2]} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.menuBtn1]}
                  onPress={() => navigation.navigate('WMBest')}>
                  <DefText text="WM 우수 사례" style={[styles.menuBtn1Text2]} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.menuBtn1]}
                  onPress={() => navigation.navigate('WMCunsult')}>
                  <DefText
                    text="WM 컨설팅 자료"
                    style={[styles.menuBtn1Text2]}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.menuBtn1]}
                  onPress={() => navigation.navigate('WMVideo')}>
                  <DefText text="WM 교육 영상" style={[styles.menuBtn1Text2]} />
                </TouchableOpacity>
              </Box>
            )}
          </Box>
          <Box>
            <TouchableOpacity
              style={[styles.menuBtn1]}
              onPress={() => navigation.navigate('Statistics')}>
              <DefText text="통계 및 분석" style={[styles.menuBtn1Text]} />
            </TouchableOpacity>
          </Box>
          <Box>
            <TouchableOpacity
              style={[styles.menuBtn1]}
              onPress={() => navigation.navigate('DBRequestList')}>
              <DefText text="가망고객 신청" style={[styles.menuBtn1Text]} />
            </TouchableOpacity>
          </Box>
          <Box>
            <TouchableOpacity
              style={[styles.menuBtn1]}
              onPress={() => navigation.navigate('Calculate')}>
              <DefText text="정산" style={[styles.menuBtn1Text]} />
            </TouchableOpacity>
          </Box>
          {/* <Box>
                        <TouchableOpacity style={[styles.menuBtn1]} >
                            <DefText text='보유고객관리' style={[styles.menuBtn1Text]} />
                        </TouchableOpacity>
                    </Box> */}
          <Box>
            <TouchableOpacity
              style={[styles.menuBtn1]}
              onPress={() => navigation.navigate('OfficeBusinessForm')}>
              <DefText text="본사담당자" style={[styles.menuBtn1Text]} />
            </TouchableOpacity>
          </Box>
          <Box>
            <TouchableOpacity
              style={[styles.menuBtn1]}
              onPress={() => navigation.navigate('Setting')}>
              <DefText text="설정" style={[styles.menuBtn1Text]} />
            </TouchableOpacity>
          </Box>
        </Box>
      </Box>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  menuBtn1: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F2',
  },
  menuBtn1Text: {
    fontSize: 14,
    ...fweight.b,
  },
  menuBtn1Text2: {
    color: '#858A90',
    fontSize: 14,
  },
});

export default connect(
  ({User}) => ({
    userInfo: User.userInfo, //회원정보
  }),
  dispatch => ({
    member_login: user => dispatch(UserAction.member_login(user)), //로그인
    member_info: user => dispatch(UserAction.member_info(user)), //회원 정보 조회
  }),
)(Menu);
