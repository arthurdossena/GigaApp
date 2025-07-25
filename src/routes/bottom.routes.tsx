import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from '../pages/home';
import User from '../pages/user';
import CustomTabBar from '../components/CustomTabBar';
import { AuthProviderList } from "../context/authContext_list";

const Tab = createBottomTabNavigator();

export default function BottomRoutes({route}: any) {
  //const { email } = route?.params || {};

  return (
    //<AuthProviderList initialEmail={email}>
      <Tab.Navigator
          screenOptions={{
              headerShown: false
          }}
          tabBar={props=><CustomTabBar {...props} /> }
          initialRouteName="Home"
      >

          <Tab.Screen name="Home" component={Home} />
          <Tab.Screen name="User" component={User} />

      </Tab.Navigator>
    //</AuthProviderList>
  );
}