import React, { Component } from 'react';
import { AppRegistry } from 'react-native';

import { StackNavigator } from 'react-navigation';

import AboutScene from './scenes/aboutScene';
import VisitorsScene from './scenes/visitorsScene';
import ServicesScene from './scenes/servicesScene';
import GameScene from './scenes/gameScene';
import EventsScene from './scenes/eventsScene';
import MenuScene from './scenes/menuScene';
import AnimalListScene from './scenes/animalListScene';
import AnimalScene from './containers/animalScene';
import QRScene from './scenes/qrScene';
//import * as scenes from './scenes.js';

const zobro2 = StackNavigator({
  MAIN_MENU: { screen: MenuScene },
  ANIMAL_DETAIL: { screen: AnimalScene },
  ANIMAL_LIST: { screen: AnimalListScene },
  ABOUT: { screen: AboutScene },
  EVENTS: { screen: EventsScene },
  SERVICES: { screen: ServicesScene },
  GAME: { screen: GameScene },
  VISITORS: { screen: VisitorsScene },
  QR_READER: { screen: QRScene},
}, {
  initialRouteName: 'MAIN_MENU',
  mode: 'modal'
});

export default zobro2;
