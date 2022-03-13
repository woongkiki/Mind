/**
 * Post API
 *
 */
 import { BASE_URL } from '../../../Utils/APIConstant';
 import ApiManager from '../../../Utils/ApiManager';
 const $http = new ApiManager();
 export default {
   //회원 로그인
   member_hospital: async (data) => {
    const url = `${BASE_URL}/adm/api/`;
    //method : member_sendSms
    return await $http.multipart(url, data);
  },
   //회원 로그인
   member_login: async (data) => {
     const url = `${BASE_URL}/adm/api/`;
     //method : member_sendSms
     return await $http.multipart(url, data);
   },
   //회원이 등록한 댓글 확인
   member_comment: async (data) => {
    const url = `${BASE_URL}/adm/api/`;
    //method : member_sendSms
    return await $http.multipart(url, data);
  },
   //회원 정보 확인
   member_info: async (data) => {
     const url = `${BASE_URL}/adm/api/`;
     //method : member_info
     return await $http.multipart(url, data);
   },
  
   //타유저 회원정보
   member_profile: async (data) => {
     const url = `${BASE_URL}/adm/api/`;
     //method : member_profile
     return await $http.multipart(url, data);
   },
   //회원가입
   member_join: async (data) => {
     const url = `${BASE_URL}/adm/api/`;
     //method : member_join
     return await $http.multipart(url, data);
   },
   //관심목록 등록
   wish_set: async (data) => {
     const url = `${BASE_URL}/adm/api/`;
     //method : wish_set
     return await $http.multipart(url, data);
   },
   //관심목록 리스트
   wish_list: async (data) => {
     const url = `${BASE_URL}/adm/api/`;
     //method : wish_list
     return await $http.multipart(url, data);
   },
   //회원정보 변경
   member_update: async (data) => {
     const url = `${BASE_URL}/adm/api/`;
     //method : member_update
     return await $http.multipart(url, data);
   },
   //푸시 정보조회 및 등록
   member_push: async (data) => {
     const url = `${BASE_URL}/adm/api/`;
     //method : member_push
     return await $http.multipart(url, data);
   },
   //키워드정보조회등록
   member_keyword: async (data) => {
     const url = `${BASE_URL}/adm/api/`;
     //method : member_keyword
     return await $http.multipart(url, data);
   },
   //로그아웃
   member_logout: async (data) => {
     const url = `${BASE_URL}/adm/api/`;
     //method : member_logout
     return await $http.multipart(url, data);
   },
   //탈퇴하기
   member_out: async (data) => {
     const url = `${BASE_URL}/adm/api/`;
     //method : member_out
     return await $http.multipart(url, data);
   },

 };