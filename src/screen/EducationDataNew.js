import React, {useState, useEffect} from 'react';
import {
  ScrollView,
  Platform,
  Dimensions,
  StyleSheet,
  Alert,
  View,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Linking,
  PermissionsAndroid,
} from 'react-native';
import {Box, VStack, HStack, Image, Input, Select} from 'native-base';
import {DefText, SearchInput} from '../common/BOOTSTRAP';
import HeaderDef from '../components/HeaderDef';
import {fsize, fweight, colorSelect, textStyle} from '../common/StyleDef';
import {videoEdu, eduData} from '../Utils/DummyData';
import {textLengthOverCut} from '../common/dataFunction';

import {connect} from 'react-redux';
import {actionCreators as UserAction} from '../redux/module/action/UserAction';
import {StackActions, useIsFocused} from '@react-navigation/native';
import Api from '../Api';

import {BASE_URL} from '../Utils/APIConstant';

import RNFetchBlob from 'rn-fetch-blob';
import ToastMessage from '../components/ToastMessage';

const {width} = Dimensions.get('window');

const EducationDataNew = props => {
  const {navigation, userInfo} = props;

  const isFocused = useIsFocused();

  const [loading, setLoading] = useState(true);
  const [dataList, setDataList] = useState([]);
  const [depth1, setDepth1] = useState([]); //대분류리스트
  const [depth1Value, setDepth1Value] = useState(''); //대분류선택
  const [depth2, setDepth2] = useState([]);
  const [depth2Value, setDepth2Value] = useState('');
  const [depth3, setDepth3] = useState([]);
  const [depth3Value, setDepth3Value] = useState('');
  const [searchText, setSearchText] = useState('');

  const schTextChange = text => {
    setSearchText(text);
  };

  const schHandler = () => {
    // if(searchText == ""){
    //     ToastMessage("검색어를 한글자 이상 입력하세요.");
    //     return false;
    // }

    educationDataAPI();
  };

  const educationDataAPI = async () => {
    await setLoading(true);
    await Api.send(
      'education_dataList',
      {
        depth1: depth1Value,
        depth2: depth2Value,
        depth3: depth3Value,
        schText: searchText,
      },
      args => {
        let resultItem = args.resultItem;
        let arrItems = args.arrItems;

        if (resultItem.result === 'Y' && arrItems) {
          console.log('동영상 교육자료 리스트 결과: ', arrItems);
          setDataList(arrItems);
        } else {
          console.log('동영상 교육자료 리스트 실패!', resultItem);
        }
      },
    );
    await Api.send('education_dataCate1', {}, args => {
      let resultItem = args.resultItem;
      let arrItems = args.arrItems;

      if (resultItem.result === 'Y' && arrItems) {
        //console.log(' 교육자료 카테고리1 결과: ', arrItems, resultItem);
        setDepth1(arrItems);
      } else {
        console.log(' 교육자료 카테고리1 실패!', resultItem);
      }
    });
    await setLoading(false);
  };

  const depth2MenuAPI = () => {
    Api.send('education_dataCate2', {depth1_idx: depth1Value}, args => {
      let resultItem = args.resultItem;
      let arrItems = args.arrItems;

      if (resultItem.result === 'Y' && arrItems) {
        //console.log('동영상 교육자료 중분류 카테고리 결과: ', arrItems, resultItem);
        setDepth2(arrItems);
      } else {
        console.log('동영상 교육자료 중분류 카테고리 실패!', resultItem);
      }
    });
  };

  const depth3MenuAPI = () => {
    Api.send(
      'education_dataCate3',
      {depth1_idx: depth1Value, depth2_idx: depth2Value},
      args => {
        let resultItem = args.resultItem;
        let arrItems = args.arrItems;

        if (resultItem.result === 'Y' && arrItems) {
          // console.log('동영상 교육자료 소분류 카테고리 결과: ', arrItems, resultItem);
          setDepth3(arrItems);
        } else {
          console.log('동영상 교육자료 소분류 카테고리 실패!', resultItem);
        }
      },
    );
  };

  const select1Change = value => {
    setDepth1Value(value);
    setDepth2Value('');
    setDepth3Value('');
  };

  useEffect(() => {
    if (isFocused) {
      educationDataAPI();
    }
  }, [isFocused, depth1Value, depth2Value, depth3Value]);

  useEffect(() => {
    if (depth1Value != '') {
      depth2MenuAPI();
    }

    if (depth1Value != '' && depth2Value != '') {
      depth3MenuAPI();
    }
  }, [depth1Value, depth2Value]);

  //렌더링
  const _renderItem = ({item, index}) => {
    return (
      <Box px="20px" mb="20px">
        <Box p="20px" borderWidth={1} borderColor="#999" borderRadius={10}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('EducationDataView', {wr_id: item.wr_id})
            }>
            <DefText
              text={item.wr_subject}
              style={[fweight.b, {fontSize: fsize.fs18}]}
            />
            <HStack mt="10px" justifyContent={'space-between'}>
              <HStack alignItems={'center'}>
                <DefText
                  text={
                    depth3Value != ''
                      ? item.depth3
                      : depth2Value != ''
                      ? item.depth2
                      : depth1Value != ''
                      ? item.depth1
                      : item.depth1
                  }
                />
                <Box
                  width="1px"
                  height="10px"
                  backgroundColor={'#999'}
                  mx="10px"
                />
                <DefText text={'조회수 ' + item.wr_hit} />
              </HStack>
              <Box>
                <DefText text={item.wr_datetime.substring(0, 10)} />
              </Box>
            </HStack>
          </TouchableOpacity>
        </Box>
      </Box>
    );
  };

  return (
    <Box flex={1} backgroundColor="#fff">
      <HeaderDef navigation={navigation} headerTitle="교육 자료" />
      {loading ? (
        <Box>
          <ActivityIndicator size="large" color="#333" />
        </Box>
      ) : (
        <FlatList
          ListHeaderComponent={
            <Box px="20px" mb="20px">
              <HStack>
                <Select
                  selectedValue={depth1Value}
                  width={(width - 40) * 0.32}
                  height="42px"
                  fontSize={fsize.fs12}
                  style={fweight.r}
                  backgroundColor="#fff"
                  borderWidth={1}
                  borderColor="#999999"
                  onValueChange={itemValue => select1Change(itemValue)}>
                  <Select.Item label="구분" value="" />
                  {depth1 != '' &&
                    depth1.map((item, index) => {
                      return (
                        <Select.Item
                          key={index}
                          label={item.depth1}
                          value={item.idx}
                        />
                      );
                    })}
                </Select>
                <Select
                  placeholder="중분류"
                  selectedValue={depth2Value}
                  width={(width - 40) * 0.32}
                  height="42px"
                  fontSize={fsize.fs12}
                  style={[fweight.r]}
                  backgroundColor="#fff"
                  borderWidth={1}
                  borderColor="#999999"
                  marginLeft={(width - 40) * 0.02 + 'px'}
                  onValueChange={itemValue => setDepth2Value(itemValue)}>
                  {depth2 != '' ? (
                    depth2.map((item, index) => {
                      return (
                        <Select.Item
                          key={index}
                          label={item.depth2}
                          value={item.idx}
                        />
                      );
                    })
                  ) : (
                    <Select.Item label="" value="" />
                  )}
                </Select>
                <Select
                  placeholder="소분류"
                  selectedValue={depth3Value}
                  width={(width - 40) * 0.32}
                  height="42px"
                  fontSize={fsize.fs12}
                  style={[fweight.r]}
                  backgroundColor="#fff"
                  borderWidth={1}
                  borderColor="#999999"
                  marginLeft={(width - 40) * 0.02 + 'px'}
                  onValueChange={itemValue => setDepth3Value(itemValue)}>
                  {depth3 != '' ? (
                    depth3.map((item, index) => {
                      return (
                        <Select.Item
                          key={index}
                          label={item.depth3}
                          value={item.idx}
                        />
                      );
                    })
                  ) : (
                    <Select.Item label="" value="" />
                  )}
                </Select>
              </HStack>
              <Box mt="10px">
                <SearchInput
                  placeholder="검색어를 입력해 주세요."
                  value={searchText}
                  onChangeText={schTextChange}
                  onPress={schHandler}
                />
              </Box>
            </Box>
          }
          data={dataList}
          renderItem={_renderItem}
          keyExtractor={(item, index) => index.toString()}
          ListEmptyComponent={
            <Box py="40px" alignItems={'center'}>
              <DefText text="등록된 교육자료가 없습니다." />
            </Box>
          }
        />
      )}
    </Box>
  );
};

const styles = StyleSheet.create({
  categoryBtn: {
    width: (width - 40) * 0.23,
    height: 40,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#999',
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryBtnText: {
    fontSize: fsize.fs14,
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
)(EducationDataNew);
