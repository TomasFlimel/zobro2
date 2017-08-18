import React from 'react';
import { TabNavigator, StackNavigator } from 'react-navigation';
import Camera from 'react-native-camera';
import { NavigationActions } from 'react-navigation'
import { scenes, sceneTitles } from '../scenes';
import {HEADER_STYLE} from '../styles/styles';
import HeaderBackButton from 'react-navigation/src/views/Header/HeaderBackButton';

import Dimensions from 'Dimensions';
import styles from '../styles/styles';
import AnimalNeighbourScene from '../components/animalNeighbourScene';

import {
  View,
  ScrollView,
  Image,
  Text,
  Alert,
  TouchableHighlight,
  StyleSheet,
  Switch,
} from 'react-native';

import animals from '../animals';

class TextTab extends React.Component {
  constructor(props) {
    super(props);
  }

  static navigationOptions = (navigation) =>
    ({
      title: 'Text',
    tabBarIcon: ({tintColor}) => (
      <Image
          source={require('../images/tab-icons/icon-text.png')}
          style={[styles.tabIcons, {
            backgroundColor: tintColor
          }]}
      />
    )
  })

  render() {
    let AnimalDetail;
    const animalName = this.props.screenProps.animal;

    if (!(animalName in animals)) {
        return (
          <Text>Neznámý QR kód načten: {animalName}</Text>
        );
    }

    if (this.props.screenProps.readerLevel === "adult") {
      AnimalDetail = animals[animalName].contentAdult;
    } else {
      AnimalDetail = animals[animalName].contentChild;
    }

    return (
      <ScrollView>
        <AnimalDetail animal = {animalName} />
      </ScrollView>
    );
  }
}

class QRTab extends React.Component {
  constructor(props) {
    super(props);
  }

  static navigationOptions = {
    title: 'QR tab',
    tabBarIcon: ({tintColor}) => (
      <Image
          source={require('../images/tab-icons/icon-qr.png')}
          style={[styles.tabIcons, {backgroundColor: tintColor}]}
      />
    )
  }

  onBarCodeRead(barcode) {
    this.props.screenProps.setCameraReady(false);

    // We want to prevent state when camera is reloaded with back-button
    // This scenarios points back-button to main menu what is fine (and work-around)
    // Look at https://stackoverflow.com/questions/44034430/react-navigation-and-component-lifecycle
    const resetAction = NavigationActions.reset({
      index: 1,
      actions: [
        NavigationActions.navigate({
          routeName: sceneTitles[scenes.MAIN_MENU].name,
        }),
        NavigationActions.navigate({
          routeName: sceneTitles[scenes.ANIMAL_DETAIL].name,
          params: {animal: barcode.data},
        })
      ]
    });

    this.props.screenProps.setAnimalTab('Text');
    this.props.screenProps.parentNavigation.dispatch(resetAction);
  }

  render() {
    const PADDING = 20;
    const WIDTH = Dimensions.get('window').width - PADDING;

    if (this.props.screenProps.cameraReady) {
      return (
        <View style={localStyles.container}>
          <Camera
            style={localStyles.preview}
            onBarCodeRead={(barcode) => this.onBarCodeRead(barcode)}
            aspect={Camera.constants.Aspect.fill}>
          </Camera>
        </View>
      );
    } else {
      return (
        <Text>Loading</Text>
      );
    }
  }
}

class NeighbourTab extends React.Component {
  constructor(props) {
    super(props);
  }

  static navigationOptions = {
    title: 'Sousedi',
    tabBarIcon: ({tintColor}) => (
      <Image
          source={require('../images/tab-icons/icon-neigh.png')}
          style={[styles.tabIcons, {backgroundColor: tintColor}]}
      />
    )
  }

  render() {
    const animalName = this.props.screenProps.animal;

    if (!(animalName in animals)) {
        return (
          <Text>Neznámý QR kód načten: {animalName}</Text>
        );
    }

    return (
      <AnimalNeighbourScene
        navigation={this.props.screenProps.parentNavigation}
        setAnimalTab={this.props.screenProps.setAnimalTab}
        animal={animalName} />
    );
  }
}

export default class AnimalMainScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let animalName;
    let adultImage;
    let childImage;

    if ((this.props.animal in animals)) {
      animalName = animals[this.props.animal].name;
    } else {
      animalName = 'Chybný QR kód';
    }

      if ( this.props.readerLevel === 'adult') {
        adultImage = require('../images/tab-icons/adult-active.png');
        childImage = require('../images/tab-icons/child-inactive.png');
      } else {
        adultImage = require('../images/tab-icons/adult-inactive.png');
        childImage = require('../images/tab-icons/child-active.png');
      }

      const MainScreenNavigator = TabNavigator({
        Text: { screen: TextTab },
        QR: { screen: QRTab },
        Neighbour: { screen: NeighbourTab }
      }, {
        initialRouteName: this.props.tabName,
        tabBarOptions: {
          activeTintColor: 'black',
        }
      });

    const MainStack = StackNavigator({
      Main: { screen: MainScreenNavigator },
    }, {
      navigationOptions: {
        title: animalName,
        ...HEADER_STYLE,
        headerLeft: <HeaderBackButton tintColor='#DEDEDE' onPress={ () => {
          return this.props.navigation.goBack();
        }} />,
        headerRight: (
          <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end'}}>
            <Image style={{marginRight: -5}}
            source={childImage} />
            <Switch
              onTintColor = '#3CAC54'
              style={{transform: [{scaleX: 0.7}, {scaleY: 0.7}]}}
              value = { this.props.readerLevel === 'adult' }
              onValueChange = { (value) => {
                if (value) {
                  this.props.setReaderLevel('adult');
                } else {
                  this.props.setReaderLevel('child');
                }
              }}
            />
            <Image style={{marginLeft: -5, marginRight: 5}} source={adultImage} />
          </View>
        ),
      }
    });

    const p = {};
    p.animal = this.props.animal;
    p.readerLevel = this.props.readerLevel;
    p.cameraReady = this.props.cameraReady;
    p.setCameraReady = this.props.setCameraReady;
    p.setReaderLevel = this.props.setReaderLevel;
    p.setAnimalTab = this.props.setAnimalTab;
    p.parentNavigation = this.props.navigation;
    return (
      <MainStack
        screenProps={p}
        onNavigationStateChange={(prevState, currentState) => {
          p.setCameraReady(true);
          p.setAnimalTab(currentState.routes[0].routes[currentState.routes[0].index].key);
        }}
      />
    );
  }
}

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
});
