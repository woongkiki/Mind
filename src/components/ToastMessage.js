import React, { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import Toast from 'react-native-toast-message';
import { getStatusBarHeight } from 'react-native-status-bar-height';

const ToastMessage = ( message, duration, position, offset, message2 = '') => {
  Toast.show({
    type    : 'custom_type', //success | error | info
    position: 'bottom',
    text1   : message,
    text2   : message2,
    visibilityTime: duration ? duration : 1000,
    autoHide: true,
    topOffset: (Platform.OS === 'ios' ? 10 : 10),
    bottomOffset: offset ? offset + 100 : 100,
    onShow: () => {},
    onHide: () => {}
  });
}

export default ToastMessage;