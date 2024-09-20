import React from 'react';
import {
  TouchableOpacity,
  TextInput,
  Platform,
  Dimensions,
  StyleSheet,
} from 'react-native';
import {Box, Text, Image, Input, HStack} from 'native-base';
import Font from '../common/Font';
import {colorSelect, fsize, fweight} from './StyleDef';

const {width} = Dimensions.get('window');

export const DefText = ({text, style, textDecoration, textDecorationColor}) => {
  return (
    <Text
      textDecoration={textDecoration ? textDecoration : 'none'}
      textDecorationColor={textDecorationColor ? textDecorationColor : '#000'}
      style={[
        {fontSize: fsize.fs14, color: colorSelect.black2},
        fweight.r,
        style,
      ]}>
      {text}
    </Text>
  );
};

export const Button = ({disabled, onPress, text, buttonStyle, textStyle}) => {
  return (
    <TouchableOpacity
      style={[
        {
          width: '100%',
          height: 50,
          backgroundColor: '#696968',
          alignItems: 'center',
          justifyContent: 'center',
        },
        buttonStyle,
      ]}
      onPress={onPress}
      disabled={disabled}>
      <DefText text={text} style={[{color: '#fff'}, textStyle]} />
    </TouchableOpacity>
  );
};

export const Button2 = ({
  disabled,
  onPress,
  text,
  buttonStyle,
  textStyle,
  imgSource,
  imgAlt,
  imgStyle,
}) => {
  return (
    <TouchableOpacity
      style={[
        {
          width: '100%',
          height: 50,
          backgroundColor: '#696968',
          alignItems: 'center',
          justifyContent: 'center',
        },
        buttonStyle,
      ]}
      onPress={onPress}
      disabled={disabled}>
      <HStack alignItems="center">
        <Image source={imgSource} alt={imgAlt} style={[imgStyle]} />
        <DefText text={text} style={[{color: '#fff'}, textStyle]} />
      </HStack>
    </TouchableOpacity>
  );
};

export const DefInput = ({
  placeholderText,
  keyboardType,
  inputValue,
  onChangeText,
  multiline,
  maxLength,
  inputStyle,
  secureTextEntry,
  onPressOut,
  disabled,
  textAlignVertical,
  onPress,
}) => {
  return (
    <Input
      placeholder={placeholderText}
      placeholderTextColor="#999999"
      _focus="transparent"
      backgroundColor="#FFFFFF"
      keyboardType={keyboardType ? keyboardType : 'default'}
      height="40px"
      value={inputValue}
      onChangeText={onChangeText}
      multiline={multiline ? multiline : false}
      maxLength={maxLength}
      secureTextEntry={secureTextEntry}
      borderRadius={5}
      style={[{fontSize: fsize.fs12, borderColor: '#999999'}, inputStyle]}
      onPressOut={onPressOut}
      isDisabled={disabled}
      textAlignVertical={textAlignVertical ? textAlignVertical : 'center'}
      onSubmitEditing={onPress}
    />
  );
};

export const ShadowInput = ({
  placeholder,
  style,
  value,
  onChangeText,
  secureTextEntry,
}) => {
  return (
    // <Input
    //   _focus={'transparent'}
    //   placeholder={placeholder ? placeholder : '사번을 입력하세요.'}
    //   placeholderTextColor={'#D0DAE1'}
    //   height="54px"
    //   style={[styles.textInput, style]}
    //   value={value}
    //   onChangeText={onChangeText}
    //   secureTextEntry={secureTextEntry}
    // />
    <TextInput
      focusable={'transparent'}
      placeholder={placeholder ? placeholder : '사번을 입력하세요.'}
      placeholderTextColor={'#D0DAE1'}
      style={[styles.textInput, style]}
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
    />
  );
};

export const MainButton = ({onPress, buttonStyle, style, buttonText}) => {
  return (
    <TouchableOpacity style={[styles.DefButton, buttonStyle]} onPress={onPress}>
      <DefText text={buttonText} style={[styles.DefButtonText, style]} />
    </TouchableOpacity>
  );
};

export const SearchInput = ({
  placeholder,
  style,
  value,
  onChangeText,
  secureTextEntry,
  onPress,
}) => {
  return (
    <Box>
      <TextInput
        placeholder={placeholder ? placeholder : '사번을 입력하세요.'}
        placeholderTextColor={'#999999'}
        style={[styles.searchInput, style]}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        onSubmitEditing={onPress}
      />
      <Box
        style={{
          width: 40,
          height: 40,
          position: 'absolute',
          right: 0,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <TouchableOpacity onPress={onPress}>
          <Image
            source={require('../images/schIcons.png')}
            alt="검색"
            style={{width: 15, height: 15, resizeMode: 'contain'}}
          />
        </TouchableOpacity>
      </Box>
    </Box>
  );
};

export const SubmitButtons = ({
  buttonStyle,
  onPress,
  btnText,
  btnTextStyle,
  activeOpacity,
  disabled,
}) => {
  return (
    <TouchableOpacity
      style={[
        {
          width: width,
          height: 60,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: colorSelect.blue,
        },
        buttonStyle,
      ]}
      onPress={onPress}
      activeOpacity={activeOpacity}
      disabled={disabled}>
      <DefText
        text={btnText}
        style={[
          {fontSize: fsize.fs16, color: colorSelect.white},
          fweight.b,
          btnTextStyle,
        ]}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  textInput: {
    width: '100%',
    height: 54,
    paddingTop: 5,
    paddingBottom: 5,
    backgroundColor: '#ffffff',
    shadowColor: '#004375',
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.13,
    shadowRadius: 3.84,
    elevation: 13,
    paddingLeft: 20,
    borderRadius: 20,
    fontSize: 14,
    borderWidth: 0,
  },
  DefButton: {
    height: 54,
    width: width - 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: '#4473B8',
  },
  DefButtonText: {
    fontSize: 16,
    color: '#fff',
  },
  searchInput: {
    width: '100%',
    height: 42,
    paddingVertical: 10,
    paddingLeft: 15,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#999999',
    fontSize: fsize.fs12,
    backgroundColor: '#fff',
  },
});
