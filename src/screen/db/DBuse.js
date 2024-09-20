import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {Box, HStack, Select, Image} from 'native-base';
import HeaderDef from '../../components/HeaderDef';
import {DefText} from '../../common/BOOTSTRAP';
import {fsize, fweight} from '../../common/StyleDef';
import moment from 'moment';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Api from '../../Api';
import {connect} from 'react-redux';
import {actionCreators as UserAction} from '../../redux/module/action/UserAction';

const {width, height} = Dimensions.get('window');

let today = new Date();
let onedays = moment(today).format('yyyy-MM');
let todays = moment(today).format('yyyy-MM-DD');

const level1 = [1];
const level2 = [
  {
    level: 1,
    label: 'FP',
  },
];
const level3 = [
  {
    level: 2,
    label: '지점장',
  },
  {
    level: 1,
    label: 'FP',
  },
];
const level4 = [
  {
    level: 3,
    label: '지사장, 단장',
  },
  {
    level: 2,
    label: '지점장',
  },
  {
    level: 1,
    label: 'FP',
  },
];

const DBuse = props => {
  const {navigation, userInfo} = props;

  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState(onedays + '-01');
  const [startDateModal, setStartDateModal] = useState(false);
  const [endDate, setEndDate] = useState(todays);
  const [endDateModal, setEndDateModal] = useState(false);

  const [level, setLevel] = useState([]);

  useEffect(() => {
    if (userInfo != undefined) {
      if (userInfo.mb_4 == 1) {
        setLevel(level1);
      } else if (userInfo.mb_4 == 2) {
        setLevel(level2);
      } else if (userInfo.mb_4 == 3) {
        setLevel(level3);
      } else if (userInfo.mb_4 == 4) {
        setLevel(level4);
      }
    }
  }, []);

  const startDateHandler = date => {
    startDataModalClose();
    setStartDate(moment(date).format('yyyy-MM-DD'));
  };

  const startDataModalClose = () => {
    setStartDateModal(false);
  };

  const endDateHandler = date => {
    endDataModalClose();
    setEndDate(moment(date).format('yyyy-MM-DD'));
  };

  const endDataModalClose = () => {
    setEndDateModal(false);
  };

  //하위레벨 선택
  const [selectLevel, setSelectLevel] = useState('');

  const [result, setResult] = useState([]);
  const [dbCnt, setDBCnt] = useState('');
  const [dbMeetCnt, setDBMeetCnt] = useState('');
  const [dbSubsCnt, setDBSubsCnt] = useState('');

  const useApi = async () => {
    await setLoading(true);
    await Api.send(
      'search_use',
      {
        startdate: startDate,
        enddate: endDate,
        selectLevel: selectLevel,
        mb_1: userInfo?.mb_1,
        levels: userInfo?.mb_4,
      },
      args => {
        let resultItem = args.resultItem;
        let arrItems = args.arrItems;

        if (resultItem.result === 'Y' && arrItems) {
          console.log('DB 사용현황 조회: ', resultItem);
          setResult(arrItems.data);
          setDBCnt(arrItems.dbAllCnt);
          setDBMeetCnt(arrItems.dbMeetCnt);
          setDBSubsCnt(arrItems.dbSubsCnt);
        } else {
          console.log('DB 사용현황 조회 실패!', resultItem);
        }
      },
    );
    await setLoading(false);
  };

  useEffect(() => {
    useApi();
  }, [startDate, endDate]);

  const schEventHandler = () => {
    useApi();
  };

  return (
    <Box flex={1} backgroundColor="#fff">
      <HeaderDef headerTitle="DB사용현황 조회" navigation={navigation} />
      {loading ? (
        <Box flex={1} justifyContent="center" alignItems={'center'}>
          <ActivityIndicator size="large" color="#333" />
        </Box>
      ) : (
        <ScrollView>
          <Box p="20px">
            <HStack alignItems={'center'} justifyContent="space-between">
              <TouchableOpacity
                onPress={() => setStartDateModal(true)}
                style={[styles.dateSelectButton]}>
                <DefText
                  text={startDate != '' ? startDate : '기간설정(년/월/일)'}
                  style={[
                    styles.dateSelectButtonText,
                    startDate != '' && {color: '#000'},
                  ]}
                />
              </TouchableOpacity>
              <DefText text={'~'} />
              <TouchableOpacity
                onPress={() => setEndDateModal(true)}
                style={[styles.dateSelectButton]}>
                <DefText
                  text={endDate != '' ? endDate : '기간설정(년/월/일)'}
                  style={[
                    styles.dateSelectButtonText,
                    endDate != '' && {color: '#000'},
                  ]}
                />
              </TouchableOpacity>
            </HStack>
            {userInfo?.mb_4 != 1 && (
              <HStack
                alignItems={'center'}
                justifyContent="space-between"
                mt="10px">
                {level != '' && (
                  <Select
                    selectedValue={selectLevel}
                    width={(width - 40) * 0.72}
                    placeholder="하위레벨 선택"
                    placeholderTextColor="#999"
                    style={{fontSize: 14, height: 40}}
                    onValueChange={val => setSelectLevel(val)}
                    borderColor="#999999">
                    <Select.Item label={'전체'} value={''} />
                    {level.map((item, index) => {
                      return (
                        <Select.Item
                          label={item.label}
                          value={item.level}
                          key={index}
                        />
                      );
                    })}
                  </Select>
                )}
                <TouchableOpacity
                  style={[styles.levelSchButton]}
                  onPress={schEventHandler}>
                  <Image
                    source={require('../../images/schIcons.png')}
                    alt="검색"
                    style={{width: 15, height: 15, resizeMode: 'contain'}}
                  />
                </TouchableOpacity>
              </HStack>
            )}
          </Box>
          <Box pb="20px">
            <HStack
              borderBottomColor={'#E8E8E8'}
              borderBottomWidth={1}
              pt="10px"
              pb="20px"
              px="20px"
              alignItems={'center'}>
              {/* <Box width={ (width - 40) * 0.2 } alignItems='center'>
                                <DefText text={'사업단'} style={[{fontSize:15}, fweight.b]} />
                            </Box> */}
              <Box width={(width - 40) * 0.2 + 'px'} alignItems="center">
                <DefText text={'지점'} style={[{fontSize: 15}, fweight.b]} />
              </Box>
              <Box width={(width - 40) * 0.2 + 'px'} alignItems="center">
                <DefText text={'FP'} style={[{fontSize: 15}, fweight.b]} />
              </Box>
              <Box width={(width - 40) * 0.15 + 'px'} alignItems="center">
                <DefText text={'배정'} style={[{fontSize: 15}, fweight.b]} />
              </Box>
              <Box width={(width - 40) * 0.225 + 'px'} alignItems="center">
                <DefText
                  text={'미팅완료'}
                  style={[{fontSize: 15}, fweight.b]}
                />
              </Box>
              <Box width={(width - 40) * 0.225 + 'px'} alignItems="center">
                <DefText
                  text={'청약완료'}
                  style={[{fontSize: 15}, fweight.b]}
                />
              </Box>
            </HStack>
            {result != '' ? (
              result.map((item, index) => {
                return (
                  <HStack
                    pt="15px"
                    pb="15px"
                    px="20px"
                    alignItems={'center'}
                    borderBottomWidth={1}
                    borderBottomColor={'#E8E8E8'}
                    key={index}>
                    {/* <Box width={ (width - 40) * 0.2 } alignItems='center'>
                                            <DefText text={'사업단'} style={[{fontSize:15}, fweight.b]} />
                                        </Box> */}
                    <Box width={(width - 40) * 0.2 + 'px'} alignItems="center">
                      <DefText
                        text={item.branch_name}
                        style={[{fontSize: 15}, fweight.b]}
                      />
                    </Box>
                    <Box width={(width - 40) * 0.2 + 'px'} alignItems="center">
                      <DefText
                        text={item.manage_name}
                        style={[{fontSize: 15}, fweight.b]}
                      />
                    </Box>
                    <Box width={(width - 40) * 0.15 + 'px'} alignItems="center">
                      <DefText
                        text={item.db_cnt}
                        style={[{fontSize: 15}, fweight.b]}
                      />
                    </Box>
                    <Box
                      width={(width - 40) * 0.225 + 'px'}
                      alignItems="center">
                      <DefText
                        text={item.db_meet_cnt}
                        style={[{fontSize: 15}, fweight.b]}
                      />
                    </Box>
                    <Box
                      width={(width - 40) * 0.225 + 'px'}
                      alignItems="center">
                      <DefText
                        text={item.db_subs_cnt}
                        style={[{fontSize: 15}, fweight.b]}
                      />
                    </Box>
                  </HStack>
                );
              })
            ) : (
              <Box
                flex={1}
                py="40px"
                alignItems={'center'}
                borderBottomWidth={1}
                borderBottomColor={'#E8E8E8'}>
                <DefText text="기간내 조회된 DB가 없습니다." />
              </Box>
            )}

            <HStack
              pt="15px"
              pb="15px"
              px="20px"
              alignItems={'center'}
              borderBottomWidth={1}
              borderBottomColor={'#E8E8E8'}>
              <Box width={(width - 40) * 0.4 + 'px'} alignItems="center">
                <DefText text={'합계'} style={[{fontSize: 15}, fweight.b]} />
              </Box>
              <Box width={(width - 40) * 0.15 + 'px'} alignItems="center">
                <DefText
                  text={dbCnt != '' ? dbCnt : 0}
                  style={[{fontSize: 15}, fweight.b]}
                />
              </Box>
              <Box width={(width - 40) * 0.225 + 'px'} alignItems="center">
                <DefText
                  text={dbMeetCnt != '' ? dbMeetCnt : 0}
                  style={[{fontSize: 15}, fweight.b]}
                />
              </Box>
              <Box width={(width - 40) * 0.225 + 'px'} alignItems="center">
                <DefText
                  text={dbSubsCnt != '' ? dbSubsCnt : 0}
                  style={[{fontSize: 15}, fweight.b]}
                />
              </Box>
            </HStack>
          </Box>
        </ScrollView>
      )}

      <DateTimePickerModal
        isVisible={startDateModal}
        mode="date"
        onConfirm={startDateHandler}
        onCancel={startDataModalClose}
        display={'spinner'}
        maximumDate={new Date()}
      />
      <DateTimePickerModal
        isVisible={endDateModal}
        mode="date"
        onConfirm={endDateHandler}
        onCancel={endDataModalClose}
        display={'spinner'}
        minimumDate={new Date(startDate)}
        maximumDate={new Date()}
      />
    </Box>
  );
};

const styles = StyleSheet.create({
  dateSelectButton: {
    width: (width - 40) * 0.47,
    height: 40,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#999999',
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
  dateSelectButtonText: {
    color: '#999999',
  },
  levelSchButton: {
    width: (width - 40) * 0.25,
    height: 42,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#999',
    alignItems: 'center',
    justifyContent: 'center',
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
)(DBuse);
