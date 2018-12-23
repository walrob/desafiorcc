import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    description: {
      marginBottom: 20,
      fontSize: 18,
      textAlign: 'justify',
      color: '#656565'
    },
    title: {
      marginBottom: 20,
      textAlign: 'center',
      color: '#656565',
      fontSize: 25,
      fontWeight: 'bold'
    },
    container: {
      padding: 30,
      marginTop: 20,
      alignItems: 'center'
    },
    flowRight: {
      marginBottom: 15,
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'stretch',
    },
    input: {
      height: 36,
      padding: 4,
      marginRight: 5,
      flexGrow: 1,
      fontSize: 18,
      borderWidth: 1,
      borderColor: '#3D9BC3',
      borderRadius: 8,
      color: '#48BBEC',
    },
    item: {
      padding: 10,
      fontSize: 18,
      height: 44,
    },
    inputText: {
      fontSize: 15,
      textAlign: 'left',
      color: '#656565'
    },
    error: {
      marginBottom: 20,
      fontSize: 15,
      textAlign: 'left',
      color: '#E73F3F'
    },
    separator: {
      height: 1,
      backgroundColor: '#dddddd'
    },
    titleList: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#656565',
      marginRight: 50,
      textAlign: 'center',
    },
    price: {
      fontSize: 20,
      color: '#656565',
      textAlign: 'center',
    },
    rowContainer: {
      flex: 1,
      flexDirection: 'row',
      padding: 15,
      alignItems: 'center',
    },
  });

export default styles;