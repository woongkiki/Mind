import React, {useEffect, useState} from 'react';
import {extendTheme, NativeBaseProvider, Box, Text, Image} from 'native-base';
import Theme from '../common/Theme';
import {NavigationContainer} from '@react-navigation/native';
import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createDrawerNavigator, DrawerActions} from '@react-navigation/drawer';
import store from '../redux/configureStore';
import {Provider} from 'react-redux';
import {Provider as PaperProvider} from 'react-native-paper';
import {
  SafeAreaView,
  View,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';

import Home from './Home';
import Db from './Db';
import Schedule from './Schedule';
import Comunication from './Comunication';
import Menu from './Menu';
import Login from './Login';
import FirstLogin from './FirstLogin';
import PossibleClient from './PossibleClient';
import ProgressClient from './ProgressClient';
import AllClient from './AllClient';
import SearchSetting from './SearchSetting';
import ClientInfo from './ClientInfo';
import MapView from './MapView';
import OfficeBoard from './OfficeBoard';
import BrandBoard from './BrandBoard';
import Education from './Education';

import Toast from 'react-native-toast-message';
import {DefText} from '../common/BOOTSTRAP';
import Font from '../common/Font';
import {colorSelect} from '../common/StyleDef';
import MemoBoard from './MemoBoard';
import BoardView from './BoardView';
import EducationVideo from './EducationVideo';
import EducationVideoView from './EducationVideoView';
import EducationData from './EducationData';
import MyEducation from './MyEducation';
import Calculate from './Calculate';
import PointList from './PointList';
import PointRequest from './PointRequest';
import Setting from './Setting';
import MemberSetting from './MemberSetting';
import ScheduleAdd from './ScheduleAdd';
import Intro from './Intro';
import MemoForm from './MemoForm';
import PointUseList from './PointUseList';
import Statistics from './Statistics';
import Dashboard from './Dashboard';
import IdLost from './IdLost';
import PasswordLost from './PasswordLost';
import ScheduleInfo from './ScheduleInfo';
import DBRequest from './DBRequest';
import DBRequestList from './DBRequestList';
import EndClient from './EndClient';
import AsDBList from './AsDBList';
import SalesView from './SalesView';
import SalesList from './SalesList';
import SalesForm from './SalesForm';
import OfficeBusinessForm from './OfficeBusinessForm';
import OfficeBusiness from './OfficeBusiness';
import OfficeBusinessView from './OfficeBusinessView';
import OfficeForm from './OfficeForm';
import BrandForm from './BrandForm';
import EducationView from './EducationView';
import Register from './Register';
import DBstatistics from './db/DBstatistics';
import DBuse from './db/DBuse';
import EducationList from './EducationList';
import EducationInfo from './EducationInfo';
import EducationRequestList from './EducationRequestList';
import EducationDataNew from './EducationDataNew';
import EducationDataView from './EducationDataView';
import WMService from './wmservice/WMService';
import WMServiceRequest from './wmservice/WMServiceRequest';
import WMBest from './wmservice/WMBest';
import WMBestView from './wmservice/WMBestView';
import WMCunsult from './wmservice/WMCunsult';
import WMCunsultView from './wmservice/WMCunsultView';
import WMVideo from './wmservice/WMVideo';
import WMVideoView from './wmservice/WMVideoView';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

const theme = extendTheme({Theme});

const {width: screenWidth, height: screenHeight} = Dimensions.get('window');
const tabBarWidth = screenWidth / 5;

const tabHeight = 70;

/* 바텀 탭바 커스텀 */
function CustomTabBar(props) {
  const {state, navigation, optionsNum} = props;

  // console.log('메인::::',props.state.routes[1]);
  //const focusedOptions = descriptors[state.routes[state.index].key];

  const screenName = state.routes[state.index].name;

  //console.log('스크린:::', screenName);

  const MoveHome = () => {
    navigation.navigate('Tab_Navigation', {
      screen: 'Home',
    });
  };

  const MoveDb = () => {
    navigation.navigate('Tab_Navigation', {
      screen: 'Db',
    });
  };

  const MoveSchedule = () => {
    navigation.navigate('Tab_Navigation', {
      screen: 'Schedule',
      params: {wm: ''},
    });
  };

  const MoveCommunication = () => {
    navigation.navigate('Tab_Navigation', {
      screen: 'Comunication',
    });
  };

  const MoveMenu = () => {
    // navigation.navigate('Tab_Navigation', {
    //     screen: 'Menu',
    // });

    navigation.openDrawer();
  };

  return (
    <View style={[styles.TabBarMainContainer]}>
      <TouchableOpacity
        activeOpacity={0.8}
        style={[
          styles.button,
          {
            borderLeftWidth: 1,
            borderLeftColor: '#E3E2E3',
            borderTopLeftRadius: 20,
          },
        ]}
        onPress={MoveDb}>
        {screenName == 'Db' ? (
          <>
            <Image
              source={require('../images/tabIconDbOn.png')}
              alt="가망고객"
              style={{width: 21, height: 21, resizeMode: 'contain'}}
            />
            <DefText
              text="가망고객"
              style={[styles.tabText, {color: '#F99600'}]}
            />
          </>
        ) : (
          <>
            <Image
              source={require('../images/tabIconDb.png')}
              alt="가망고객"
              style={{width: 21, height: 21, resizeMode: 'contain'}}
            />
            <DefText text="가망고객" style={[styles.tabText]} />
          </>
        )}
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.button}
        onPress={MoveSchedule}>
        {screenName == 'Schedule' ? (
          <>
            <Image
              source={require('../images/tabIconScheduleOn.png')}
              alt="스케줄"
              style={{width: 21, height: 21, resizeMode: 'contain'}}
            />
            <DefText
              text="스케줄"
              style={[styles.tabText, {color: '#F99600'}]}
            />
          </>
        ) : (
          <>
            <Image
              source={require('../images/tabIconSchedule.png')}
              alt="스케줄"
              style={{width: 21, height: 21, resizeMode: 'contain'}}
            />
            <DefText text="스케줄" style={[styles.tabText]} />
          </>
        )}
      </TouchableOpacity>
      <TouchableOpacity
        onPress={MoveHome}
        activeOpacity={0.8}
        style={[styles.button]}>
        {screenName == 'Home' ? (
          <>
            <Image
              source={require('../images/tabIconHomeOn.png')}
              alt="홈"
              style={{width: 21, height: 21, resizeMode: 'contain'}}
            />
            <DefText text="홈" style={[styles.tabText, {color: '#F99600'}]} />
          </>
        ) : (
          <>
            <Image
              source={require('../images/tabIconHome.png')}
              alt="홈"
              style={{width: 21, height: 21, resizeMode: 'contain'}}
            />
            <DefText text="홈" style={[styles.tabText]} />
          </>
        )}
      </TouchableOpacity>
      <TouchableOpacity
        onPress={MoveCommunication}
        activeOpacity={0.8}
        style={[styles.button]}>
        {screenName == 'Comunication' ? (
          <>
            <Image
              source={require('../images/tabIconComOn.png')}
              alt="hot line"
              style={{width: 21, height: 21, resizeMode: 'contain'}}
            />
            <DefText
              text="hot line"
              style={[styles.tabText, {color: '#F99600'}]}
            />
          </>
        ) : (
          <>
            <Image
              source={require('../images/tabIconCom.png')}
              alt="hot line"
              style={{width: 21, height: 21, resizeMode: 'contain'}}
            />
            <DefText text="hot line" style={[styles.tabText]} />
          </>
        )}
      </TouchableOpacity>
      <TouchableOpacity
        onPress={MoveMenu}
        activeOpacity={0.8}
        style={[
          styles.button,
          {
            borderRightWidth: 1,
            borderRightColor: '#E3E2E3',
            borderTopRightRadius: 20,
          },
        ]}>
        {screenName == 'Menu' ? (
          <>
            <Image
              source={require('../images/tabIconMenuOn.png')}
              alt="전체 메뉴"
              style={{width: 21, height: 21, resizeMode: 'contain'}}
            />
            <DefText
              text="전체 메뉴"
              style={[styles.tabText, {color: '#F99600'}]}
            />
          </>
        ) : (
          <>
            <Image
              source={require('../images/tabIconMenu.png')}
              alt="전체 메뉴"
              style={{width: 21, height: 21, resizeMode: 'contain'}}
            />
            <DefText text="전체 메뉴" style={[styles.tabText]} />
          </>
        )}
      </TouchableOpacity>
    </View>
  );
}

function Tab_Navigation(props) {
  // console.log(props);

  const {navigation} = props;

  return (
    <Tab.Navigator
      initialRouteName={Home}
      screenOptions={{headerShown: false}}
      tabBar={props => <CustomTabBar {...props} />}>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Db" component={Db} />
      <Tab.Screen name="Schedule" component={Schedule} />
      <Tab.Screen name="Comunication" component={Comunication} />
      <Tab.Screen name="Menu" component={Menu} />
    </Tab.Navigator>
  );
}

function Stack_Navigation(props) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Intro" component={Intro} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="Tab_Navigation" component={Tab_Navigation} />
      <Stack.Screen name="FirstLogin" component={FirstLogin} />
      <Stack.Screen name="PossibleClient" component={PossibleClient} />
      <Stack.Screen name="ProgressClient" component={ProgressClient} />
      <Stack.Screen name="AllClient" component={AllClient} />
      <Stack.Screen name="SearchSetting" component={SearchSetting} />
      <Stack.Screen name="ClientInfo" component={ClientInfo} />
      <Stack.Screen name="MapView" component={MapView} />
      <Stack.Screen name="OfficeBoard" component={OfficeBoard} />
      <Stack.Screen name="BrandBoard" component={BrandBoard} />
      <Stack.Screen name="MemoBoard" component={MemoBoard} />
      <Stack.Screen name="MemoForm" component={MemoForm} />
      <Stack.Screen name="BoardView" component={BoardView} />
      <Stack.Screen name="Education" component={Education} />
      <Stack.Screen name="EducationVideo" component={EducationVideo} />
      <Stack.Screen name="EducationList" component={EducationList} />
      <Stack.Screen name="EducationVideoView" component={EducationVideoView} />
      <Stack.Screen name="EducationData" component={EducationData} />
      <Stack.Screen name="MyEducation" component={MyEducation} />
      <Stack.Screen name="Calculate" component={Calculate} />
      <Stack.Screen name="PointList" component={PointList} />
      <Stack.Screen name="PointUseList" component={PointUseList} />
      <Stack.Screen name="PointRequest" component={PointRequest} />
      <Stack.Screen name="Setting" component={Setting} />
      <Stack.Screen name="MemberSetting" component={MemberSetting} />
      <Stack.Screen name="ScheduleAdd" component={ScheduleAdd} />
      <Stack.Screen name="ScheduleInfo" component={ScheduleInfo} />
      <Stack.Screen name="Statistics" component={Statistics} />
      <Stack.Screen name="Dashboard" component={Dashboard} />
      <Stack.Screen name="IdLost" component={IdLost} />
      <Stack.Screen name="PasswordLost" component={PasswordLost} />
      <Stack.Screen name="DBRequestList" component={DBRequestList} />
      <Stack.Screen name="DBRequest" component={DBRequest} />
      <Stack.Screen name="EndClient" component={EndClient} />
      <Stack.Screen name="AsDBList" component={AsDBList} />
      <Stack.Screen name="SalesList" component={SalesList} />
      <Stack.Screen name="SalesView" component={SalesView} />
      <Stack.Screen name="SalesForm" component={SalesForm} />
      <Stack.Screen name="OfficeBusiness" component={OfficeBusiness} />
      <Stack.Screen name="OfficeBusinessForm" component={OfficeBusinessForm} />
      <Stack.Screen name="OfficeBusinessView" component={OfficeBusinessView} />
      <Stack.Screen name="OfficeForm" component={OfficeForm} />
      <Stack.Screen name="BrandForm" component={BrandForm} />
      <Stack.Screen name="EducationView" component={EducationView} />
      <Stack.Screen name="DBstatistics" component={DBstatistics} />
      <Stack.Screen name="DBuse" component={DBuse} />
      <Stack.Screen name="EducationInfo" component={EducationInfo} />
      <Stack.Screen
        name="EducationRequestList"
        component={EducationRequestList}
      />
      <Stack.Screen name="EducationDataNew" component={EducationDataNew} />
      <Stack.Screen name="EducationDataView" component={EducationDataView} />
      <Stack.Screen name="WMService" component={WMService} />
      <Stack.Screen name="WMServiceRequest" component={WMServiceRequest} />
      <Stack.Screen name="WMBest" component={WMBest} />
      <Stack.Screen name="WMBestView" component={WMBestView} />
      <Stack.Screen name="WMCunsult" component={WMCunsult} />
      <Stack.Screen name="WMCunsultView" component={WMCunsultView} />
      <Stack.Screen name="WMVideo" component={WMVideo} />
      <Stack.Screen name="WMVideoView" component={WMVideoView} />
    </Stack.Navigator>
  );
}

const Main = props => {
  const toastConfig = {
    custom_type: internalState => (
      <View
        style={{
          backgroundColor: '#000000e0',
          borderRadius: 10,
          paddingVertical: 10,
          paddingHorizontal: 20,
          opacity: 0.8,
        }}>
        <Text
          style={{
            textAlign: 'center',
            color: '#FFFFFF',
            fontSize: 15,
            lineHeight: 22,
            letterSpacing: -0.38,
          }}>
          {internalState.text1}
        </Text>
      </View>
    ),
  };

  return (
    <Provider store={store}>
      <PaperProvider>
        <NativeBaseProvider theme={theme}>
          <NavigationContainer>
            <SafeAreaView style={{flex: 1}}>
              <Drawer.Navigator
                drawerContent={props => <Menu {...props} />}
                screenOptions={{
                  drawerType: 'front',
                  drawerPosition: 'right',
                }}>
                <Drawer.Screen
                  name="Stack_Navigation"
                  component={Stack_Navigation}
                  options={{headerShown: false}}
                />
              </Drawer.Navigator>
            </SafeAreaView>
          </NavigationContainer>
          <Toast config={toastConfig} ref={ref => Toast.setRef(ref)} />
        </NativeBaseProvider>
      </PaperProvider>
    </Provider>
  );
};

const styles = StyleSheet.create({
  TabBarMainContainer: {
    justifyContent: 'space-between',
    alignItems: 'center',
    height: tabHeight,
    flexDirection: 'row',
    width: '100%',
    backgroundColor: '#fff',
  },
  button: {
    width: tabBarWidth,
    height: tabHeight,
    justifyContent: 'center',

    alignItems: 'center',
    flexGrow: 1,
    borderTopWidth: 1,
    borderTopColor: '#E3E2E3',
    backgroundColor: 'transparent',
    //borderTopWidth:1,
    //borderTopColor:'#e3e3e3'
  },
  tabText: {
    fontSize: 12,
    marginTop: 10,
    ...Platform.select({
      ios: {fontWeight: '500'},
      android: {fontFamily: Font.NanumSquareRoundB},
    }),
  },
});

export default Main;
