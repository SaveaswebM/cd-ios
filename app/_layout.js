// import { Stack } from "expo-router/stack";

// export default function Layout() {
//   return (
//     <Stack
//       screenOptions={{
//         headerShown: false // This hides the header
//       }}
//     />
//   );
// }
import { Stack } from 'expo-router/stack';
import * as Linking from 'expo-linking';
import React from 'react';
import store from './redux/store';
import { Provider } from 'react-redux';

import { StatusBar } from 'expo-status-bar';// Define your linking configuration
const linking = {
  prefixes: ['compliance-diary://'],
  config: {
    screens: {
      Home: 'home', // Only define the routes you actually have
    },
  },
};

export default function Layout() {
  return (
    <>
      <Provider store={store}>
        <Stack
          screenOptions={{
            headerShown: false, // This hides the header
          }}
          linking={linking}
        />
      </Provider>
      <StatusBar style="light" backgroundColor='#000' />

    </>

  );
}
