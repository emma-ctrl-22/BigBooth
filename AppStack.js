import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Tabs from './UserTabs/layout';
import DriverTabs from './DriverTabs/layout';

const Stack = createNativeStackNavigator();

const AppStack = ({ initialRouteName }) => {
  return (
    <Stack.Navigator initialRouteName={initialRouteName}>
      <Stack.Screen options={{ headerShown: false }} name="Tabs" component={Tabs} />
      <Stack.Screen options={{ headerShown: false }} name="DriverTabs" component={DriverTabs} />
    </Stack.Navigator>
  );
};

export default AppStack;
