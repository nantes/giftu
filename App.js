import 'react-native-gesture-handler'; // Should be at the top
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import ContactListScreen from './src/screens/ContactListScreen';
import ContactDetailScreen from './src/screens/ContactDetailScreen';

const Stack = createStackNavigator();

import COLORS from './src/styles/colors'; // Import COLORS

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="ContactList"
        screenOptions={{
          headerStyle: {
            backgroundColor: COLORS.primary,
          },
          headerTintColor: COLORS.white, // For the back button and title
          headerTitleStyle: {
            fontWeight: 'bold', // Or use a style from TYPOGRAPHY if defined for headers
          },
        }}
      >
        <Stack.Screen 
          name="ContactList" 
          component={ContactListScreen} 
          options={{ title: 'Contacts' }} 
        />
        <Stack.Screen 
          name="ContactDetail" 
          component={ContactDetailScreen} 
          options={{ title: 'Contact Details' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
