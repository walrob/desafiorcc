'use strict';
import React, { Component } from 'react';
import { AsyncStorage, Text, TextInput, View, Button, ActivityIndicator, NetInfo } from 'react-native';
import OfflineConection from './OfflineConection';
import styles from './Styles';


type Props = {};
class Home extends Component<Props> {
  static navigationOptions = {
    title: 'Gestión de Cobranza',
    drawerLabel: 'Inicio',
  };

  constructor(props) {
    super(props);
    this.state = {
      searchName: '',
      debt: '',
      isLoading: false,
      message: '',
      url: 'https://my-json-server.typicode.com/thedarsideofit/demo/clientes',
      person: [],
    };
  };

  //Consulta si tiene conexión. Según rta consume API o carga con AsyncStorage
  componentDidMount() {
    this.setState({ message: 'Hola' });
    NetInfo.isConnected.fetch().then(isConnected => {
      this.setState({ message: 'Holaaaaaa' });
      if (isConnected) {
        this.setState({ message: 'Actualizando' });
        this._getPerson();
      } else {
        this.setState({ message: 'Sin Conexión' });
        this._retrieveData();
      }
    });
  }

  //Almacena en BD interna la lista de personas
  _storeData = async () => {
    await AsyncStorage.setItem('person', JSON.stringify(this.state.person))
      .then(json => console.log('success!'))
      .catch(error => console.log('error!'));
  }

  //realiza un GET a la BD interna
  _retrieveData = async () => {
    const value = await AsyncStorage.getItem('person')
      .then(req => JSON.parse(req))
      .then(json => {
        console.log(json);
        this.setState({ 'person': value });
      })
      .catch(error => console.log('error!'));
  }

  //Actualiza el estado con el texto ingresado
  _onSearchTextChanged = (event) => {
    this.setState({ searchName: event.nativeEvent.text });
  };

  //Busca la persona
  _onSearchPressed = () => {
    let num = null;
    this.state.person.map(pers => {
      if (pers.nombre_apellido === this.state.searchName) {
        num = pers.deuda;
        return;
      }
    });
    if (num === null) {
      this.setState({ debt: '', message: `No se encontró a "${this.state.searchName}"` });
    } else {
      this.setState({ debt: num, message: '' });

      //navegar a la otra vista y pasar parámetros
      this.props.navigation.navigate('Payment', {
        name: this.state.searchName,
        debt: parseFloat(num)
      });
    };
  };

  //Se consume la API, obentiendo en person la lista de deudores
  _getPerson = () => {
    this.setState({ isLoading: true });
    fetch(this.state.url)
      .then(res => res.json())
      .then(data => {
        this.setState({ person: data, isLoading: false, message: '' });
        this._storeData();
      })
      .catch(error =>
        this.setState({
          isLoading: false,
          message: `Ocurrió un error: ${error}`
        })
      );
  }

  render() {
    const spinner = this.state.isLoading ? <ActivityIndicator size='large' /> : null;
    return (
      <View>
        <OfflineConection />
        <View style={styles.container}>

          <Text style={styles.title}>
            ¡Bienvenido!
          </Text>
          <Text style={styles.description}>
            Ingrese el nombre de la persona a cobrar:
          </Text>

          <View style={styles.flowRight}>
            <TextInput
              underlineColorAndroid={'transparent'}
              style={styles.input}
              value={this.state.searchName}
              onChange={this._onSearchTextChanged}
              placeholder='Nombre' />

            <Button onPress={this._onSearchPressed} color='#48BBEC' title='Buscar' />
          </View>
          {spinner}
          <Text style={styles.error}>{this.state.message}</Text>

        </View>
      </View>
    );
  }

}


export default Home;
