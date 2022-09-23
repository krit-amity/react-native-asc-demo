import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {RootStackNavigation} from './navigation/RootStack';
import './client';
import {navigationRef} from './navigation/navigation';

const App = () => {
  return (
    <NavigationContainer ref={navigationRef}>
      <RootStackNavigation />
    </NavigationContainer>
  );
};

export default App;
