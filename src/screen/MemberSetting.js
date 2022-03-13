import React, {useState, useEffect} from 'react';
import { ScrollView, Platform, Dimensions, StyleSheet, Alert, View, TouchableOpacity, FlatList } from 'react-native';
import { Box, VStack, HStack, Image, Input, Select, Modal } from 'native-base';
import { DefInput, DefText, SearchInput, SubmitButtons } from '../common/BOOTSTRAP';
import HeaderDef from '../components/HeaderDef';
import {fsize, fweight, colorSelect, textStyle} from '../common/StyleDef';
import { pointRequest } from '../Utils/DummyData';
import { numberFormat, textLengthOverCut, phoneFormat } from '../common/dataFunction';

const MemberSetting = (props) => {

    const {navigation} = props;

    //이름
    const [name, setName] = useState('홍길동');
    const nameChange = (text) => {
        setName(text)
    }

    //아이디
    const [id, setId] = useState('MP00001');
    const idChange = (id) => {
        setId(id);
    }

    //비밀번호
    const [password, setPassword] = useState('');
    const pwdChange = (pwd) => {
        setPassword(pwd);
    }

    //소속
    const [company, setCompany] = useState('영등포 직영지점');
    const companyChange = (cmp) => {
        setCompany(cmp);
    }

    //자격
    const [qualifi, setQualifi] = useState('설계사');
    const qualifiChange = (qu) => {
        setQualifi(qu);
    }

    //연락처
    const [phoneNumber, setPhonenumber] = useState('');
    const phoneChange = (phone) => {
        setPhonenumber(phoneFormat(phone));
    }

    //이메일 
    const [email, setEmail] = useState('');
    const emailChange = (email) => {
        setEmail(email);
    }

    return (
        <Box flex={1} backgroundColor='#fff'>
            <HeaderDef headerTitle='회원 정보 변경' navigation={navigation} />
            <ScrollView>
                <Box p='20px'>
                    <Box>
                        <DefText text='이름' style={[styles.labelTitle]} />
                        <DefInput 
                            placeholderText='이름을 입력하세요.'
                            inputValue={name}
                            onChangeText={nameChange}
                            disabled={true}
                            inputStyle={name != '' && {backgroundColor:'#999', color:colorSelect.white, borderColor:'transparent'}}
                        />
                    </Box>
                    <Box mt='30px'>
                        <DefText text='아이디 (사번)' style={[styles.labelTitle]} />
                        <DefInput 
                            placeholderText='아이디를 입력하세요.'
                            inputValue={id}
                            onChangeText={idChange}
                            disabled={true}
                            inputStyle={id != '' && {backgroundColor:'#999', color:colorSelect.white, borderColor:'transparent'}}
                        />
                    </Box>
                    <Box mt='30px'>
                        <DefText text='비밀번호' style={[styles.labelTitle]} />
                        <DefInput 
                            placeholderText='변경하실 비밀번호를 입력해 주세요.'
                            inputValue={password}
                            onChangeText={pwdChange}
                            secureTextEntry={true}
                        />
                    </Box>
                    <Box mt='30px'>
                        <DefText text='소속' style={[styles.labelTitle]} />
                        <DefInput 
                            placeholderText='소속을 입력하세요.'
                            inputValue={company}
                            onChangeText={companyChange}
                            disabled={true}
                            inputStyle={company != '' && {backgroundColor:'#999', color:colorSelect.white, borderColor:'transparent'}}
                        />
                    </Box>
                    <Box mt='30px'>
                        <DefText text='자격' style={[styles.labelTitle]} />
                        <DefInput 
                            placeholderText='자격을 입력하세요.'
                            inputValue={qualifi}
                            onChangeText={qualifiChange}
                            disabled={true}
                            inputStyle={qualifi != '' && {backgroundColor:'#999', color:colorSelect.white, borderColor:'transparent'}}
                        />
                    </Box>
                    <Box mt='30px'>
                        <DefText text='연락처' style={[styles.labelTitle]} />
                        <DefInput 
                            placeholderText='연락처를 입력하세요. (-를 빼고 입력하세요)'
                            inputValue={phoneNumber}
                            onChangeText={phoneChange}
                            maxLength={13}
                            keyboardType='number-pad'
                        />
                    </Box>
                    <Box mt='30px'>
                        <DefText text='이메일' style={[styles.labelTitle]} />
                        <DefInput 
                            placeholderText='이메일을 입력하세요.'
                            inputValue={email}
                            onChangeText={emailChange}
                            //keyboardType='number-pad'
                        />
                    </Box>
                </Box>
            </ScrollView>
            <SubmitButtons
                btnText='저장'
            />
        </Box>
    );
};

const styles = StyleSheet.create({
    labelTitle: {
        fontSize:fsize.fs16,
        ...fweight.eb,
        marginBottom: 15
    }
})

export default MemberSetting;