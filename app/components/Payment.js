'use strict';
import React, { Component } from 'react';
import { AsyncStorage, Text, TextInput, View, Button, ActivityIndicator, PermissionsAndroid, Linking } from 'react-native';
import OfflineConection from './OfflineConection';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import styles from './Styles';


type Props = {};
class Payment extends Component<Props> {
  static navigationOptions = {
    title: 'Pago',
    drawerLabel: 'Pago',
  };

  constructor(props) {
    super(props);
    this.state = {
      name: '',
      debt: '',
      isLoading: false,
      amount: '',
      message: '',
      date: '',
      rest: '0',
      cashed: [],
      latitude: null,
      longitude: null,
      error: null,
    };
  };

  //Acualizada el estado con los valores pasados a través de la navegación
  componentDidMount() {
    const { navigation } = this.props;
    const debt = navigation.getParam('debt');
    const name = navigation.getParam('name');
    this.setState({ amount: JSON.stringify(debt), debt: JSON.stringify(debt), name: name });
    this._retrieveData();
  }

  //Almacena en BD interna la lista de pagos
  _storeData = async () => {
    await AsyncStorage.setItem('cashed', JSON.stringify(this.state.person))
      .then(json => console.log('success!'))
      .catch(error => console.log('error!'));
  }

  //Realiza un GET a la BD interna
  _retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem('cashed');
      if (value !== null) {
        console.log(value);
        this.setState({ cashed: value });
      }
    } catch (error) {
      console.log('error!');
    }
  }
  /*_retrieveData = async () => {
    const value = await AsyncStorage.getItem('cashed')
      .then(req => JSON.parse(req))
      .then(json => {
        console.log(json);
        this.setState({ cashed: json });
      })
      .catch(error => console.log('error!'));
  }*/

  //Actualiza el estado con el importe ingresado
  _onRefreshRest(text) {
    const temp = (parseFloat(this.state.debt) - parseFloat(text))
    this.setState({ amount: text, rest: String(temp) });
  }

  //Genera el recibo
  _onButtonPressed = () => {
    this._geolocation();
    const tempCashed = this.state.cashed;
    const dat = new Date();
    tempCashed.push({
      nameClient: this.state.name,
      amount: this.state.amount,
      latitude: this.state.latitude,
      longitude: this.state.longitude,
      date: dat
    });
    this.setState({ date: dat, cashed: tempCashed });
    this._storeData();
    this.createPDF();
    //this.props.navigation.goBack();
  };

  _geolocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null,
        });
      },
      (error) => this.setState({ error: error.message }),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
    );
  }

  async createPDF() {
    let options = {
      html: `<h1 style="text-align: center;">Recibo Cuenta Corriente</h1>
      <p><h6>Cliente: </h6>${this.state.name}</p>
      <p><h6>Importe: </h6>${this.state.amount}</p>
      <p><h6>Fecha: </h6>${this.state.date}</p>`,
      fileName: `Recibo ${this.state.name} - ${this.state.date}`,
      directory: 'Documents',
    };

    let file = await RNHTMLtoPDF.convert(options)
    alert(`Latitud: ${parseFloat(this.state.latitude).toFixed(2)} - Longitud ${parseFloat(this.state.longitude).toFixed(2)}.\nEl archivo se descargó en: "${file.filePath}"`);

    //Vuelve a la vista anterior. Lo coloco aquí así me aseguro que termine de crear el archivo.
    this.props.navigation.goBack();
  }

  render() {
    const spinner = this.state.isLoading ? <ActivityIndicator size='large' /> : null;
    return (
      <View>
        <OfflineConection />
        <View style={styles.container}>
          <Text style={styles.description}>
            Generar Recibo para "{this.state.name}"
          </Text>

          <View style={styles.flowRight}>
            <Text style={styles.inputText}>Deuda:    </Text>
            <TextInput
              underlineColorAndroid={'transparent'}
              style={styles.input}
              value={this.state.debt}
              editable={false}
              selectTextOnFocus={false}
            />
          </View>
          <View style={styles.flowRight}>
            <Text style={styles.inputText}>Importe:  </Text>
            <TextInput
              underlineColorAndroid={'transparent'}
              style={styles.input}
              value={this.state.amount}
              onChangeText={(text) => this._onRefreshRest(text)}
              keyboardType={'number-pad'}
            />
          </View>
          <View style={styles.flowRight}>
            <Text style={styles.inputText}>Restante: </Text>
            <TextInput
              underlineColorAndroid={'transparent'}
              style={styles.input}
              value={this.state.rest}
              editable={false}
              selectTextOnFocus={false}
            />
          </View>

          <Button onPress={this._onButtonPressed} color='#48BBEC' title='Generar' />

          {spinner}
          <Text style={styles.error}>{this.state.message}</Text>
        </View>
      </View>
    );
  }
}

export default Payment;
