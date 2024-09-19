import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { Card } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';

export default function HomeScreen({ navigation }) {
  const mostrarMensagem = () => {
    Alert.alert(
      'Bem-vindo!',
      'Obrigado pelo seu trabalho dedicado na tanatopraxia. Sua profissão faz toda a diferença!',
      [{ text: 'OK' }]
    );
  };

  return (
    <LinearGradient
      colors={['#003366', '#3399ff']}
      style={styles.gradientContainer}
    >
      <View style={styles.container}>
        <Image
          source={require('../../assets/laboratorio.png')} // Caminho correto para a imagem
          style={styles.image}
        />

        <Text style={styles.quote}>
          "A dedicação e o cuidado com que tratamos nossos clientes refletem a importância do nosso trabalho."
        </Text>

        <View style={styles.buttonContainer}>
          <Card style={styles.card}>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Registro')}>
              <Text style={styles.buttonText}>Registrar Novo Corpo</Text>
            </TouchableOpacity>
          </Card>

          <Card style={styles.card}>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ListaCorpos')}>
              <Text style={styles.buttonText}>Ver Corpos Recebidos</Text>
            </TouchableOpacity>
          </Card>
        </View>

        <TouchableOpacity style={styles.messageButton} onPress={mostrarMensagem}>
          <Text style={styles.messageButtonText}>Mensagem para Tanatopraxistas</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
    padding: 16,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  image: {
    width: 150,
    height: 150,
    resizeMode: 'cover',
    borderRadius: 75,
    borderWidth: 2,
    borderColor: '#fff',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  quote: {
    fontSize: 18,
    fontStyle: 'italic',
    marginBottom: 20,
    textAlign: 'center',
    color: '#fff',
    fontFamily: 'Roboto',
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 20,
  },
  card: {
    marginVertical: 10,
    borderRadius: 12,
    elevation: 8,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#ff6600',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Roboto',
  },
  messageButton: {
    marginTop: 20,
    backgroundColor: '#28a745',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    width: '80%',
  },
  messageButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Roboto',
  },
});
