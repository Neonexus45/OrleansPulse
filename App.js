import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import MainView from './views/MainView';
import Settings from './views/Settings';

const Stack = createStackNavigator();

const App = () => {
  return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="MainView">
          <Stack.Screen name="MainView" component={MainView} options={{headerShown: false}} />
          <Stack.Screen name="Settings" component={Settings} options={{headerShown: false}}/>
        </Stack.Navigator>
      </NavigationContainer>
  );
};

export default App;
