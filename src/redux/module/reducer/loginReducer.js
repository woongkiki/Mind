import types from '../actions/type';

const defaultState = {
    mt_id: null,
    mt_idx: null,
    mt_level: 2,
    mt_name: null,
    mt_nickname: null,
    mt_email: null,
    mt_hp: null,
    mt_image1: null,
    mt_app_token: null,
    mt_point: 0,
    cart_cnt: null,
    mt_is_info1: null,
    mt_is_info2: null,
    mt_grade: null,
    point_percent: null,
    updateTime: null,
}

export default login = (state = defaultState, action) => {
    // For Debugger
    // console.log(state);

    switch (action.type) {
        case types.UPDATE_LOGIN_CK:
            return {
                mt_id: action.mt_id,
                mt_idx: action.mt_idx,
                mt_level: action.mt_level,
                mt_name: action.mt_name,
                mt_nickname: action.mt_nickname,
                mt_email: action.mt_email,
                mt_hp: action.mt_hp,
                mt_image1: action.mt_image1,
                mt_app_token: action.mt_app_token,
                mt_point: action.mt_point,
                cart_cnt: action.cart_cnt,
                mt_is_info1: action.mt_is_info1,
                mt_is_info2: action.mt_is_info2,
                mt_grade: action.mt_grade,
                point_percent: action.point_percent,
                updateTime: action.updateTime,
            };
        default:
          return state;
    }
};