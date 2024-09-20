import React, {useEffect, useMemo, useState} from 'react';
import {
  TouchableOpacity,
  Platform,
  Dimensions,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {
  Box,
  HStack,
  VStack,
  Input,
  Image,
  CheckIcon,
  Select,
  Modal,
} from 'native-base';
import {
  DefInput,
  DefText,
  MainButton,
  ShadowInput,
  SubmitButtons,
} from '../common/BOOTSTRAP';
import ToastMessage from '../components/ToastMessage';
import {connect} from 'react-redux';
import {actionCreators as UserAction} from '../redux/module/action/UserAction';
import {StackActions} from '@react-navigation/native';
import messaging from '@react-native-firebase/messaging';
import Api from '../Api';
import HeaderDef from '../components/HeaderDef';
import {colorSelect, fsize, fweight} from '../common/StyleDef';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {phoneFormat} from '../common/dataFunction';
import HTML from 'react-native-render-html';
import StyleHtml from '../common/StyleHtml';
import Font from '../common/Font';

const {width} = Dimensions.get('window');

const systemFonts = [...Font.NanumSquareRoundR, 'NanumSquareRoundR'];

const WebRender = React.memo(function WebRender({html}) {
  return (
    <HTML
      ignoredStyles={[
        'width',
        'height',
        'margin',
        'padding',
        'fontFamily',
        'lineHeight',
        'fontSize',
        'br',
      ]}
      ignoredTags={['head', 'script', 'src']}
      imagesMaxWidth={width - 40}
      source={{html: html}}
      tagsStyles={StyleHtml}
      containerStyle={{flex: 1}}
      contentWidth={width}
      systemFonts={systemFonts}
    />
  );
});

const Register = props => {
  const {navigation} = props;

  const [loading, setLoading] = useState(true);
  const [distributorList, setDistributorList] = useState('');

  const [id, setId] = useState(''); //아이디(사번)
  const [password, setPassword] = useState(''); //비밀번호
  const [passwordRe, setPasswordRe] = useState(''); //비밀번호
  const [distributorVal, setDistributorVal] = useState(''); //지사 선택
  const [name, setName] = useState(''); //이름
  const [email, setEmail] = useState(''); //이메일
  const [phoneNumber, setPhoneNumber] = useState(''); //휴대폰번호
  const [registerAgree, setRegisterAgree] = useState(false);
  const [registerAgree2, setRegisterAgree2] = useState(false);
  const [privacyModal, setPrivacyModal] = useState(false);
  const [privacyContent, setPrivacyContent] = useState('');
  const [provisitonModal, setProvisionModal] = useState(false);
  const [provisitonContent, setProvisionContent] = useState(false);

  const idChange = text => {
    setId(text);
  };

  const passwordChange = text => {
    setPassword(text);
  };

  const passwordReChange = text => {
    setPasswordRe(text);
  };

  const nameChange = text => {
    setName(text);
  };

  const emailChange = text => {
    setEmail(text);
  };

  const phoneNumberChange = phone => {
    setPhoneNumber(phoneFormat(phone));
  };

  //지사 리스트, 개인정보처리방침, 이용약관 가져오기..
  const distributorListHandler = async () => {
    await setLoading(true);
    await Api.send('register_distributor', {}, args => {
      let resultItem = args.resultItem;
      let arrItems = args.arrItems;

      if (resultItem.result === 'Y' && arrItems) {
        //console.log('지사 목록 가져오기 결과: ', arrItems, resultItem);
        setDistributorList(arrItems);
      } else {
        console.log('지사 목록 가져오기 실패!', resultItem);
      }
    });
    await Api.send('content_privacy', {}, args => {
      let resultItem = args.resultItem;
      let arrItems = args.arrItems;

      if (resultItem.result === 'Y' && arrItems) {
        //console.log('개인정보처리방침 결과: ', arrItems, resultItem);
        setPrivacyContent(arrItems);
      } else {
        console.log('개인정보처리방침 실패!', resultItem);
      }
    });
    await Api.send('content_provision', {}, args => {
      let resultItem = args.resultItem;
      let arrItems = args.arrItems;

      if (resultItem.result === 'Y' && arrItems) {
        //console.log('이용약관 결과: ', arrItems, resultItem);
        setProvisionContent(arrItems);
      } else {
        console.log('이용약관 실패!', resultItem);
      }
    });
    await setLoading(false);
  };

  const registerUpdate = () => {
    parameter = {
      mb_id: id,
      mb_name: name,
      mb_password: password,
      passwordRe: passwordRe,
      mb_email: email,
      mb_hp: phoneNumber,
      mb_1: distributorVal,
      registerAgree: registerAgree,
      registerAgree2: registerAgree2,
    };

    Api.send('register_insert', parameter, args => {
      let resultItem = args.resultItem;
      let arrItems = args.arrItems;

      if (resultItem.result === 'Y' && arrItems) {
        console.log('회원가입 완료 결과: ', arrItems, resultItem);
        ToastMessage(resultItem.message);
        navigation.goBack();
      } else {
        console.log('회원가입 완료 실패!', resultItem);
        ToastMessage(resultItem.message);
      }
    });
  };

  useEffect(() => {
    distributorListHandler();
  }, []);

  return (
    <Box flex={1} backgroundColor="#fff">
      <HeaderDef headerTitle="회원가입" navigation={navigation} />
      {loading ? (
        <Box flex={1} justifyContent="center" alignItems={'center'}>
          <ActivityIndicator size="large" color="#333" />
        </Box>
      ) : (
        <KeyboardAwareScrollView>
          <Box p="20px">
            <Box>
              <DefText text="이름" style={[styles.labelTitle]} />
              <DefInput
                value={name}
                onChangeText={nameChange}
                placeholderText="이름을 입력하세요."
              />
            </Box>
            <Box mt="30px">
              {/* <DefText text='아이디' style={[styles.labelTitle]} /> */}
              <DefText text="아이디 (사번)" style={[styles.labelTitle]} />
              <DefInput
                value={id}
                onChangeText={idChange}
                placeholderText="아이디를 입력하세요."
              />
            </Box>
            <Box mt="30px">
              <DefText text="비밀번호" style={[styles.labelTitle]} />
              <DefInput
                value={password}
                onChangeText={passwordChange}
                placeholderText="비밀번호를 입력하세요."
                secureTextEntry={true}
              />
            </Box>
            <Box mt="30px">
              <DefText text="비밀번호 확인" style={[styles.labelTitle]} />
              <DefInput
                value={passwordRe}
                onChangeText={passwordReChange}
                placeholderText="비밀번호를 한번 더 입력하세요."
                secureTextEntry={true}
              />
            </Box>
            {distributorList != '' && (
              <Box mt="30px">
                <DefText text="소속" style={[styles.labelTitle]} />
                <Select
                  selectedValue={distributorVal}
                  width="100%"
                  height="40px"
                  fontSize={fsize.fs12}
                  style={{borderRadius: 0}}
                  backgroundColor="#fff"
                  borderWidth={1}
                  borderColor="#999999"
                  onValueChange={itemValue => setDistributorVal(itemValue)}
                  placeholder="지사를 선택하세요.">
                  {distributorList != '' &&
                    distributorList.map((item, index) => {
                      return (
                        <Select.Item
                          label={item.wr_subject}
                          value={item.wr_id}
                          key={index}
                        />
                      );
                    })}
                </Select>
              </Box>
            )}

            <Box mt="30px">
              <DefText text="E-mail" style={[styles.labelTitle]} />
              <DefInput
                value={email}
                onChangeText={emailChange}
                placeholderText="이메일을 입력하세요."
              />
            </Box>
            <Box mt="30px">
              <DefText text="연락처" style={[styles.labelTitle]} />
              <DefInput
                value={phoneNumber}
                onChangeText={phoneNumberChange}
                placeholderText="연락처를 입력하세요."
                maxLength={13}
                keyboardType="number-pad"
              />
            </Box>
            <Box mt="30px">
              <DefText text="회원약관 동의" style={[styles.labelTitle]} />
              <HStack alignItems={'center'} justifyContent="space-between">
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => setRegisterAgree(!registerAgree)}>
                  <HStack alignItems={'center'}>
                    <Box
                      width="20px"
                      height="20px"
                      borderRadius={3}
                      overflow="hidden"
                      borderWidth={registerAgree ? 0 : 1}
                      borderColor="#dfdfdf"
                      alignItems={'center'}
                      justifyContent="center"
                      backgroundColor={
                        registerAgree ? colorSelect.blue : '#fff'
                      }>
                      <CheckIcon width="12px" color="#fff" />
                    </Box>
                    <DefText
                      text="개인정보처리방침 동의"
                      style={{marginLeft: 10}}
                    />
                  </HStack>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setPrivacyModal(true)}>
                  <Box
                    borderBottomWidth={1}
                    borderColor={colorSelect.blue}
                    paddingBottom={'3px'}>
                    <DefText
                      text="자세히보기"
                      style={{color: colorSelect.blue}}
                    />
                  </Box>
                </TouchableOpacity>
              </HStack>
              <HStack
                alignItems={'center'}
                justifyContent="space-between"
                mt="15px">
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => setRegisterAgree2(!registerAgree2)}>
                  <HStack alignItems={'center'}>
                    <Box
                      width="20px"
                      height="20px"
                      borderRadius={3}
                      overflow="hidden"
                      borderWidth={registerAgree2 ? 0 : 1}
                      borderColor="#dfdfdf"
                      alignItems={'center'}
                      justifyContent="center"
                      backgroundColor={
                        registerAgree2 ? colorSelect.blue : '#fff'
                      }>
                      <CheckIcon width="12px" color="#fff" />
                    </Box>
                    <DefText text="이용약관 동의" style={{marginLeft: 10}} />
                  </HStack>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setProvisionModal(true)}>
                  <Box
                    borderBottomWidth={1}
                    borderColor={colorSelect.blue}
                    paddingBottom={'3px'}>
                    <DefText
                      text="자세히보기"
                      style={{color: colorSelect.blue}}
                    />
                  </Box>
                </TouchableOpacity>
              </HStack>
            </Box>
          </Box>
        </KeyboardAwareScrollView>
      )}
      <SubmitButtons btnText="회원가입" onPress={registerUpdate} />
      <Modal isOpen={privacyModal} onClose={() => setPrivacyModal(false)}>
        <Modal.Content
          p="0"
          style={{
            width: Dimensions.get('screen').width - 40,
            minWidth: Dimensions.get('screen').width - 40,
            maxWidth: Dimensions.get('screen').width - 40,
          }}>
          <Modal.Body p="20px">
            <DefText
              text="개인정보처리방침"
              style={[fweight.b, {marginBottom: 20}]}
            />
            {privacyContent && <WebRender html={privacyContent} />}
          </Modal.Body>
        </Modal.Content>
      </Modal>
      <Modal isOpen={provisitonModal} onClose={() => setProvisionModal(false)}>
        <Modal.Content
          p="0"
          style={{
            width: Dimensions.get('screen').width - 40,
            minWidth: Dimensions.get('screen').width - 40,
            maxWidth: Dimensions.get('screen').width - 40,
          }}>
          <Modal.Body p="20px">
            <DefText text="이용약관" style={[fweight.b, {marginBottom: 20}]} />
            {provisitonContent && <WebRender html={provisitonContent} />}
          </Modal.Body>
        </Modal.Content>
      </Modal>
    </Box>
  );
};

const styles = StyleSheet.create({
  labelTitle: {
    fontSize: fsize.fs16,
    ...fweight.eb,
    marginBottom: 15,
  },
  dateBox: {
    width: (width - 40) * 0.47,
  },
  dateButton: {
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#DFDFDF',
    paddingRight: 10,
    marginTop: 15,
  },
  buttons: {
    width: '100%',
    height: 40,
    backgroundColor: colorSelect.blue,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
  buttonsText: {
    color: colorSelect.white,
    fontSize: fsize.fs12,
  },
  memberTitle: {
    ...fweight.b,
  },
});

export default Register;
