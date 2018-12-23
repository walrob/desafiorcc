'use strict';
import React, { Component } from 'react';
import { Text, View, ActivityIndicator, FlatList, AsyncStorage } from 'react-native';
import styles from './Styles';


type Props = {};
class CashedTable extends Component<Props> {
  static navigationOptions = {
    title: 'Lista de Pagos',
    drawerLabel: 'Pagos',
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      message: '',
      url: 'https://my-json-server.typicode.com/thedarsideofit/demo/clientes',
      cashed: []
    };
  };

  //Consulta a la BD interna, ya que solo se puede hacer un get de deudores a la API
  componentDidMount() {
    this._retrieveData();
  }

  //realiza un GET a la BD interna
  _retrieveData = async () => {
    const value = await AsyncStorage.getItem('cashed')
      .then(req => JSON.parse(req))
      .then(json => {
        console.log(json);
        this.setState({ 'cashed': value });
      })
      .catch(error => console.log('error!'));
  }

  render() {
    if (this.state.isLoading) {
      //Spinner y texto mientras se realiza la petición
      return (
        <View style={styles.container}>
          <Text style={styles.description}>Descargando personas</Text>
          <ActivityIndicator size='large' />
        </View>
      );
    }
    return (
      <View>
        <View style={styles.container}>
          <Text style={styles.description}>
            Lista de pagos realizados:
        </Text>

          <FlatList
            data={this.state.person}
            renderItem={({ item }) => <Text style={styles.item}>{item.nameClient} -- {item.date} -- {item.latitude} -- {item.longitude} -- {item.amount}</Text>}
            keyExtractor={(item, index) => index.toString()}
          />

          <Text style={styles.error}>{this.state.message}</Text>
        </View>
      </View>
    );
  }
}

export default CashedTable;
