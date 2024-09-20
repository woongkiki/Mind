import React from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import UserApi from '../api/UserApi';
export const MEBMER_LOGIN = 'user/MEBMER_LOGIN';
export const MEMBER_COMMENT = 'user/MEMBER_COMMENT';
export const MEMBER_INFO = 'user/MEMBER_INFO';
export const MEMBER_OTHER_INFO = 'user/MEMBER_OTHER_INFO';
export const MEMBER_JOIN = 'user/MEMBER_JOIN';
export const WISH_LIST = 'user/WISH_LIST';
export const WISH_LIST_FLEX = 'user/WISH_LIST_FLEX';
export const MEMBER_PUSH_LIST = 'user/MEMBER_PUSH_LIST';
export const MEMBER_KEYWORD_LIST = 'user/MEMBER_KEYWORD_LIST';
export const MEMBER_LOGOUT = 'user/MEMBER_LOGOUT';
export const MEMBER_HOSPITAL = 'user/MEMBER_HOSPITAL';

export const actionCreators = {
  //회원권 정보
  member_hospital: (user) => async (dispatch) => {
    try {
      const response = await UserApi.member_hospital(user);
      // console.log('member_info ::: ', response);

      if (response.result) {
        await dispatch({
          type: MEMBER_HOSPITAL,
          payload: response.data,
        });
        return { state: true, result: response.data, msg:response.msg };
      } else {
        await dispatch({
          type: MEMBER_HOSPITAL,
          payload: null,
        });
        return { state: false, msg: response.msg, nick: '' };
      }
    } catch (error) {
      return { state: false, msg: '', nick: '' };
    }
  },
  //회원 로그인
  member_login: (user) => async (dispatch) => {
    try {
      const response = await UserApi.member_login(user);
       //console.log('member_login ::: ', response);

      if (response.result) {
        await dispatch({
          type: MEBMER_LOGIN,
          payload: response.data,
        });

        console.log('받아오기:::', response.data);
        if(response.data.idSave){
            AsyncStorage.setItem('save_id', response.data.mb_id);
        }else{
           AsyncStorage.removeItem('save_id');
        }

        if(response.data.auto == "Y"){
            AsyncStorage.setItem('autoLogin', "Y");
        }else{
            AsyncStorage.setItem('autoLogin', "N");
        }
        //console.log('저장', response.data.auto_logins);

        // const saves = await response.data.auto_logins;

         AsyncStorage.setItem('mb_id', response.data.mb_id);
       
        return {
          state: true,
          result : response.data,
          msg : response.msg
          //pwds : response.data.mb_password
        };
      } else {
        
        await dispatch({
          type: MEBMER_LOGIN,
          payload: null,
        });
        return { state: false, msg: response.msg, ids: '' };
      }
    } catch (error) {
      return { state: false, msg: error, ids: '' };

    }
  },
  member_comment: (user) => async (dispatch) => {
    try {
      const response = await UserApi.member_comment(user);
      // console.log('member_login ::: ', response);

      if (response.result) {
        await dispatch({
          type: MEMBER_COMMENT,
          payload: response.data,
        });

        
       // AsyncStorage.setItem('flex_id', response.data.id);
       
       return { state: true, msg: response.msg };
       
       /*
        return {
          state: true,
          id: response.data.mb_id,
          //pwds : response.data.mb_password
        };*/
      } else {
        
        await dispatch({
          type: MEMBER_COMMENT,
          payload: null,
        });
        return { state: false, msg: response.msg, ids: '' };
      }
    } catch (error) {
      return { state: false, msg: '', id: '' };

    }
  },
  //회원 정보확인
  member_info: (user) => async (dispatch) => {
    try {
      const response = await UserApi.member_info(user);
//       console.log('member_info ::: ', response);

      if (response.result) {
        await dispatch({
          type: MEBMER_LOGIN,
          payload: response.data,
        });
        return { state: true, result: response.data, msg:response.msg };
      } else {
        await dispatch({
          type: MEBMER_LOGIN,
          payload: null,
        });
        return { state: false, msg: response.msg, nick: '' };
      }
    } catch (error) {
      return { state: false, msg: '', nick: '' };
    }
  },
  //다른 회원 정보확인
  member_other_info: (user) => async (dispatch) => {
    try {
      const response = await UserApi.member_profile(user);
      // console.log('member_other_info ::: ', response);

      if (response.result) {
        await dispatch({
          type: MEMBER_OTHER_INFO,
          payload: response.data,
        });
        return { state: true, nick: response.data.nick };
      } else {
        await dispatch({
          type: MEMBER_OTHER_INFO,
          payload: null,
        });
        return { state: false, msg: response.msg, nick: '' };
      }
    } catch (error) {
      return { state: false, msg: '', nick: '' };
    }
  },
  //회원가입
  member_join: (user) => async (dispatch) => {
    try {
      const response = await UserApi.member_join(user);
      // console.log('member_join ::: ', response);

      if (response.result) {
       // AsyncStorage.setItem('flex_id', response.data.id);
        await dispatch({
          type: MEMBER_JOIN,
          payload: response.data,
        });
        return { state: true, msg: response.msg };
      } else {
        await dispatch({
          type: MEMBER_JOIN,
          payload: null,
        });
        return { state: false, msg: response.msg};
      }
    } catch (error) {
      // console.log('member_join Error : ', error);
      return { state: false, msg: response.msg, nick: '' };
    }
  },

  //관심 목록 리스트
  wish_set: (data, count) => async (dispatch) => {
    try {
      const response = await UserApi.market_list(data);
      if (response.result) {
        await dispatch({
          type: MARKET_UESR_LIST,
          payload: response.data,
          count: count,
        });

        return { state: true };
      } else {
        return { state: false, msg: response.msg };
      }
    } catch (error) {
      // console.log('market_list Error : ', error);
      return { state: false, msg: '' };
    }
  },


  //관심목록 리스트
  wish_list: (data, count, type) => async (dispatch) => {
    try {
      const response = await UserApi.wish_list(data);
      console.log('wish_list :::: ', data);
      if (response.result) {
        await dispatch({
          type: type === 1 ? WISH_LIST : WISH_LIST_FLEX,
          payload: response.data,
          count: count,
        });
        return { state: true };
      } else {
        return { state: false, msg: response.msg };
      }
    } catch (error) {
      // console.log('wish_list Error : ', error);
      return { state: false, msg: '' };
    }
  },
  //회원 정보 변경
  member_update: (user) => async (dispatch) => {
    try {
      const response = await UserApi.member_update(user);
      // console.log('member_update ::', response);
      return response;
    } catch (error) {
      console.log('member_info Error : ', error);
      return { result: false };
    }
  },
  //푸시정보 리스트
  member_push_list: (data) => async (dispatch) => {
    try {
      const response = await UserApi.member_push(data);
      // console.log('member_push_list :::', response);
      if (response.result) {
        await dispatch({
          type: MEMBER_PUSH_LIST,
          payload: response.data,
        });

        return { state: true };
      } else {
        return { state: false, msg: response.msg };
      }
    } catch (error) {
      // console.log('member_push_list Error : ', error);
      return { state: false, msg: '' };
    }
  },
  //푸시 업데이트
  member_push_update: (data) => async (dispatch) => {
    try {
      const response = await UserApi.member_push(data);
      // console.log('member_push_update :::', response);
      if (response.result) {
        await dispatch({
          type: MEMBER_PUSH_LIST,
          payload: response.data,
        });

        return { state: true };
      } else {
        return { state: false, msg: response.msg };
      }
    } catch (error) {
      // console.log('member_push_list Error : ', error);
      return { state: false, msg: '' };
    }
  },
  //키워드 정보 조회 key(list)
  member_keyword: (data) => async (dispatch) => {
    try {
      const response = await UserApi.member_keyword(data);
      // console.log('member_keyword_update :::', response);
      if (response.result) {
        await dispatch({
          type: MEMBER_KEYWORD_LIST,
          payload: response.data,
        });

        return { state: true };
      } else {
        return { state: false, msg: response.msg };
      }
    } catch (error) {
      // console.log('member_keyword_list Error : ', error);
      return { state: false, msg: '' };
    }
  },
  //로그아웃
  member_logout: (data) => async (dispatch) => {
    try {
      const response = await UserApi.member_logout(data);
      // console.log('member_logout :::', response);
      AsyncStorage.removeItem('mb_id');
      AsyncStorage.removeItem('save_id');
      AsyncStorage.removeItem('autoLogin');

      await dispatch({
        type: MEMBER_LOGOUT,
      });
      return response;
    } catch (error) {
      // console.log('member_logout Error : ', error);
      return { state: false, msg: '' };
    }
  },
  //탈퇴하기
  member_out: (data) => async (dispatch) => {
    try {
      const response = await UserApi.member_out(data);
      // console.log('member_out :::', response);
      AsyncStorage.removeItem('mb_id');
      AsyncStorage.removeItem('save_id');
      AsyncStorage.removeItem('autoLogin');

      await dispatch({
        type: MEMBER_LOGOUT,
      });
      return response;
    } catch (error) {
      // console.log('member_out Error : ', error);
      return { state: false, msg: '' };
    }
  },
  //판매신청
  member_sellerReg: (data) => async (dispatch) => {
    try {
      const response = await UserApi.member_sellerReg(data);
      // console.log('member_sellerReg :::', response);

      return response;
    } catch (error) {
      // console.log('member_sellerReg Error : ', error);
      return { state: false, msg: '' };
    }
  },
};