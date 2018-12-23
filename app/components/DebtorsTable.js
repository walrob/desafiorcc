'use strict';
import React, { Component } from 'react';
import { Text, View, TouchableOpacity, ActivityIndicator, FlatList, AsyncStorage, NetInfo } from 'react-native';
import OfflineConection from './OfflineConection';
import styles from './Styles';


type Props = {};
class DebtorsTable extends Component<Props> {
  static navigationOptions = {
    title: 'Lista de Deudores',
    drawerLabel: 'Deudores',
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      message: '',
      url: 'https://my-json-server.typicode.com/thedarsideofit/demo/clientes',
      person: []
    };
  };

  //Consulta si tiene conexión. Según rta consume API o carga con AsyncStorage
  componentDidMount() {
    NetInfo.isConnected.fetch().then(isConnected => {
      if (isConnected) {
        this._getPerson();
      } else {
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

  //Se consume la API, obentiendo en person la lista de deudores
  _getPerson = () => {
    this.setState({ isLoading: true });
    fetch(this.state.url)
      .then(res => res.json())
      .then(data => {
        this.setState({ person: data, isLoading: false });
        this._storeData();
      })
      .catch(error =>
        this.setState({
          isLoading: false,
          message: `Ocurrió un error: ${error}`
        }));
  }

  render() {
    if (this.state.isLoading) {
      //Spinner y texto mientras se realiza la petición
      return (
        <View>
          <OfflineConection />
          <View style={styles.container}>
            <Text style={styles.description}>Descargando personas</Text>
            <ActivityIndicator size='large' />
          </View>
        </View>
      );
    }
    return (
      <View>
        <OfflineConection />
        <View style={styles.container}>
          <FlatList
            data={this.state.person}
            renderItem={
              ({ item }) => (
                <TouchableOpacity
                  onPress={() => this.props.navigation.navigate('Payment', {
                    name: item.nombre_apellido,
                    debt: parseFloat(item.deuda)
                  })}>
                  <View>
                    <View style={styles.rowContainer}>
                      <Text style={styles.titleList}>{item.nombre_apellido}</Text>
                      <Text style={styles.price}>$ {item.deuda}</Text>
                    </View>
                    <View style={styles.separator} />
                  </View>
                </TouchableOpacity>
              )}
            keyExtractor={(item, index) => index.toString()}
          />

          <Text style={styles.error}>{this.state.message}</Text>
        </View>
      </View>
    );
  }
}


export default DebtorsTable;
