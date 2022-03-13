import {
    MEMBER_LOGOUT,
    MEBMER_LOGIN,
    MEMBER_COMMENT,
    MEMBER_INFO,
    MEMBER_JOIN,
    WISH_LIST,
    MEMBER_OTHER_INFO,
    MEMBER_PUSH_LIST,
    MEMBER_KEYWORD_LIST,
    WISH_LIST_FLEX,
    MEMBER_HOSPITAL
  } from '../action/UserAction.js';
  const initialState = {
    userInfo: null, // user
    other_member: null, // 다른 사용자 정보
    user_wish_list: [], // 회원 관신목록 리스트
    user_wish_list_flex: [], // 회원 관신목록 리스트 FLEX
    user_push_info: null, //푸시정보 리스트
    user_keyword_info: null, //키워드 정보
    user_hospital : null // 병원 회원권 정보
  };
  
  export default (
    state = initialState,
    { type, payload, code = '', count = 1 }
  ) => {
    switch (type) {
      case MEMBER_HOSPITAL:
        return {
          ...state,
          user_hospital: payload,
        };
      case MEBMER_LOGIN:
        return {
          ...state,
          userInfo: payload,
        };
      case MEMBER_COMMENT:
        return {
          ...state,
          commentInfo: payload,
        };
      case MEMBER_INFO:
        return {
          ...state,
          userInfo: payload,
        };
      case MEMBER_JOIN:
        return {
          ...state,
          userInfoRegister: payload,
        };
      case MEMBER_OTHER_INFO:
        return {
          ...state,
          other_member: payload,
        };
      
      case WISH_LIST:
        let user_wish_list = '';
        if (count > 1) {
          user_wish_list =
            payload.length !== 0
              ? state.user_wish_list.concat(payload)
              : state.user_wish_list;
        } else {
          user_wish_list = payload;
        }
        return {
          ...state,
          user_wish_list: user_wish_list,
        };
      case WISH_LIST_FLEX:
        let user_wish_list_flex = '';
        if (count > 1) {
          user_wish_list_flex =
            payload.length !== 0
              ? state.user_wish_list_flex.concat(payload)
              : state.user_wish_list_flex;
        } else {
          user_wish_list_flex = payload;
        }
        return {
          ...state,
          user_wish_list_flex: user_wish_list_flex,
        };
      case MEMBER_PUSH_LIST:
        return {
          ...state,
          user_push_info: payload,
        };
      case MEMBER_KEYWORD_LIST:
        return {
          ...state,
          user_keyword_info: payload,
        };
      case MEMBER_LOGOUT:
        return {
          userInfo: null, // user
        };
      case "change_hcode":
        let copy = {...state};
        let copy_userInfo = {...copy.userInfo};
        copy_userInfo.m_hcode = payload;

      return {
          ...state,
          userInfo: copy_userInfo, // user
        };
      default:
        return state;
    }
  };