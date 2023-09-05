import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import MainView from './views/MainView';
import Settings from './views/Settings';
import {StatusBar, View} from "react-native";

const Stack = createStackNavigator();

const App = () => {
  return (
      <View style={{flex:1}}>
      <StatusBar
          backgroundColor='#5ebce8'
          barStyle="light-content"
      />
      <NavigationContainer>
        <Stack.Navigator initialRouteName="MainView">
          <Stack.Screen name="MainView" component={MainView} options={{headerShown: false}} />
          <Stack.Screen name="Settings" component={Settings} options={{headerShown: false}}/>
        </Stack.Navigator>
      </NavigationContainer>
      </View>
  );
};

export default App;
