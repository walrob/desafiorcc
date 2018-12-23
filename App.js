'use strict';
import React, { Component } from 'react';
import { createStackNavigator, createAppContainer, createDrawerNavigator } from 'react-navigation';

import Home from './app/components/Home';
import DebtorsTable from './app/components/DebtorsTable';
import Payment from './app/components/Payment';
import CashedTable from './app/components/CashedTable';

const HomeStack = createStackNavigator(
  {
    Home: Home,
    Payment: Payment,
  },
  {
    initialRouteName: 'Home',
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: '#3D9BC3'
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    },
  }
);

const DebtorsStack = createStackNavigator(
  {
    Debtors: DebtorsTable,
    Payment: Payment,
  },
  {
    initialRouteName: 'Debtors',
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: '#3D9BC3',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    },
  }
);

const MyDrawerNavigator = createDrawerNavigator({
  Inicio: HomeStack,
  Deudores: DebtorsStack,
});

const AppContainer = createAppContainer(MyDrawerNavigator);

export default class App extends Component {
  render() {
    return (
      <AppContainer />
    );
  }
}