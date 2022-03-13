import axios from 'axios';
 export default class ApiManager {
   /**
    *
    */
   constructor() {
     if (!ApiManager.instance) {
       // 싱글톤 변수 할당
       ApiManager.instance = this;
     }
     return ApiManager.instance;
   }
 
   /**
    *
    */
   setHeaders = (headers = {}) => {
     this.headers = {
       ...this.headers,
       headers,
     };
   };
 
   /**
    *
    */
   getHeaders = () => {
     this.headers = {
       'Content-Type': 'application/json; charset=UTF-8',
     };
     return this.headers;
   };
 
   get = (url) => this.getRequest(url, 'GET');
   delete = (url, body = null, stringify = true) =>
     this.deleteRequest(url, body, stringify, 'DELETE');
   post = (url, body = null, stringify = true) => {
     return this.postRequest(url, body, stringify, 'POST');
   };
   put = (url, body = null, stringify = true) =>
     this.postRequest(url, body, stringify, 'PUT');
   multipart = (url, body = null) => this.multipartRequest(url, body);
   axios = (url, body = null) => this.axiosPost(url, body);
 
   /**
    * GET
    */
   getRequest = async (url, method = 'GET') => {
     try {
       const headers = this.getHeaders();
       const response = await fetch(url, {
         method,
         headers,
       });
       const responseJson = await response.json();
       return responseJson;
     } catch (error) {
       return {
         code: 500,
         message: error,
       };
     }
   };
 
   /**
    * POST & PUT
    */
   postRequest = async (url, body = null, stringify = true, method = 'POST') => {
     try {
       const bodyData = body ? (stringify ? JSON.stringify(body) : body) : {};
       const headers = this.getHeaders();
       // console.log('headers : ', headers);
       const response = await fetch(url, {
         method,
         headers,
         ...(body && { body: bodyData }),
         // body: JSON.stringify(body)
       });
       const responseJson = await response.json();
       // console.log('ERRO : ', responseJson);
       return responseJson;
     } catch (error) {
       return {
         code: 500,
         message: error,
       };
     }
   };
 
   /**
    * Multipart File
    */
   multipartRequest = async (
     url,
     body = null,
     stringify = true,
     method = 'POST'
   ) => {
     try {
       const response = await fetch(url, {
         method,
         headers: {
           Accept: '*/*',
           'Content-Type': 'multipart/form-data',
           'Cache-Control': 'no-cache',
           'Accept-Encoding': 'gzip, deflate',
           'cache-control': 'no-cache',
           'Access-Control-Allow-Origin': '*', // Required for CORS support to work
           'Access-Control-Allow-Credentials': true, // Required for cookies, authorization headers with HTTPS
         },
         processData: false,
         contentType: false,
         mimeType: 'multipart/form-data',
         body: body,
       });
       const responseJson = await response.json();
       // console.log('ERRO : ', responseJson);
       return responseJson;
     } catch (error) {
       return {
         code: 500,
         message: error,
       };
     }
   };
 
   /**
    * Delete Mapping
    */
 
   deleteRequest = async (
     url,
     body = null,
     stringify = true,
     method = 'DELETE'
   ) => {
     try {
       const bodyData = body ? (stringify ? JSON.stringify(body) : body) : {};
       const headers = this.getHeaders();
       // console.log('headers : ', headers);
 
       const response = await fetch(url, {
         method,
         headers,
         ...(body && { body: bodyData }),
         // body: JSON.stringify(body)
       });
       const responseJson = await response.json();
       // console.log('ERRO : ', responseJson);
       return responseJson;
     } catch (error) {
       return {
         code: 500,
         message: error,
       };
     }
   };
   /**
    * Axios poast Mapping
    */
   axiosPost = async (url, body, stringify = true, method = 'post') => {
     try {
       const response = await axios(url, {
         method,
         headers: {
           Accept: '*/*',
           'Content-Type': 'multipart/form-data',
           'Cache-Control': 'no-cache',
           'Accept-Encoding': 'gzip, deflate',
           'cache-control': 'no-cache',
           'Access-Control-Allow-Origin': '*', // Required for CORS support to work
           'Access-Control-Allow-Credentials': true, // Required for cookies, authorization headers with HTTPS
         },
         processData: false,
         contentType: false,
         mimeType: 'multipart/form-data',
         body: body,
       });
       const responseJson = await response.data;
       // console.log(responseJson);
       return responseJson;
     } catch (error) {
       return {
         code: 500,
         message: error,
       };
     }
   };
 }