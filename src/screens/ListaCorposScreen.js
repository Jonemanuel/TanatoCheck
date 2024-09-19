import React, { useState, useEffect } from 'react';
import { ScrollView, Text, Alert, StyleSheet, View, TextInput, Clipboard, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Card, IconButton, Paragraph, Checkbox } from 'react-native-paper';
import { MaterialCommunityIcons } from 'react-native-vector-icons';
import { printToFileAsync } from 'expo-print';
import { shareAsync } from 'expo-sharing';

export default function ListaCorposScreen() {
  const [corpos, setCorpos] = useState([]);
  const [corposFiltrados, setCorposFiltrados] = useState([]);
  const [termoBusca, setTermoBusca] = useState('');

  useEffect(() => {
    const carregarCorpos = async () => {
      try {
        const keys = await AsyncStorage.getAllKeys();
        const result = await AsyncStorage.multiGet(keys);
        const registros = result.map((item) => JSON.parse(item[1]));
        setCorpos(registros);
        setCorposFiltrados(registros);
      } catch (e) {
        Alert.alert('Erro', 'Erro ao carregar corpos.');
      }
    };

    carregarCorpos();
  }, []);

  useEffect(() => {
    const resultados = corpos.filter((corpo) =>
      corpo.nomeFalecido.toLowerCase().includes(termoBusca.toLowerCase())
    );
    setCorposFiltrados(resultados);
  }, [termoBusca, corpos]);

  const excluirCorpo = async (nomeFalecido) => {
    try {
      await AsyncStorage.removeItem(`corpo-${nomeFalecido}`);
      setCorpos((prev) => prev.filter((corpo) => corpo.nomeFalecido !== nomeFalecido));
      setCorposFiltrados((prev) => prev.filter((corpo) => corpo.nomeFalecido !== nomeFalecido));
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível excluir o corpo.');
    }
  };

  const copiarDados = (corpo) => {
    const dados = `
      Nome da Empresa: ${corpo.nomeEmpresa || 'Não informado'}
      Nome do Falecido: ${corpo.nomeFalecido || 'Não informado'}
      Data e Hora do Falecimento: ${corpo.dataHoraFalecimento || 'Não informado'}
      Sexo: ${corpo.sexoFalecido || 'Não informado'}
      Procedimento: ${corpo.procedimento || 'Não informado'}
      Técnico: ${corpo.nomeTecnico || 'Não informado'}
      Data e Hora de Recebimento: ${corpo.dataHoraRecebimento || 'Não informado'}
      Barbear: ${corpo.barbar ? `Sim, ${corpo.detalhesBarbear || 'Não especificado'}` : 'Não'}
      Maquiar: ${corpo.maquiar ? `Sim, ${corpo.tipoMaquiagem || 'Não especificado'}` : 'Não'}
      Vestir: ${corpo.vestir || 'Não informado'}
      Valor Recebido: ${corpo.valorRecebido || 'Não informado'}
    `;
    Clipboard.setString(dados);
    Alert.alert('Sucesso', 'Dados copiados para a área de transferência!');
  };

  const gerarPDF = async (corpo) => {
    try {
      const html = `
        <h1>Registro de Corpo</h1>
        <p><strong>Nome da Empresa:</strong> ${corpo.nomeEmpresa || 'Não informado'}</p>
        <p><strong>Nome do Falecido:</strong> ${corpo.nomeFalecido || 'Não informado'}</p>
        <p><strong>Data e Hora do Falecimento:</strong> ${corpo.dataHoraFalecimento || 'Não informado'}</p>
        <p><strong>Sexo:</strong> ${corpo.sexoFalecido || 'Não informado'}</p>
        <p><strong>Procedimento:</strong> ${corpo.procedimento || 'Não informado'}</p>
        <p><strong>Técnico:</strong> ${corpo.nomeTecnico || 'Não informado'}</p>
        <p><strong>Data e Hora de Recebimento:</strong> ${corpo.dataHoraRecebimento || 'Não informado'}</p>
        <p><strong>Barbear:</strong> ${corpo.barbar ? `Sim, ${corpo.detalhesBarbear || 'Não especificado'}` : 'Não'}</p>
        <p><strong>Maquiar:</strong> ${corpo.maquiar ? `Sim, ${corpo.tipoMaquiagem || 'Não especificado'}` : 'Não'}</p>
        <p><strong>Vestir:</strong> ${corpo.vestir || 'Não informado'}</p>
        <p><strong>Valor Recebido:</strong> ${corpo.valorRecebido || 'Não informado'}</p>
      `;

      const file = await printToFileAsync({
        html: html,
        base64: false
      });

      await shareAsync(file.uri);
      Alert.alert('Sucesso', `PDF gerado e pronto para compartilhamento: ${file.uri}`);
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível gerar o PDF.');
    }
  };

  const renderForm = (corpo) => {
    return (
      <View style={styles.formContainer}>
        <TextInput
          placeholder="Nome da Empresa"
          style={styles.textInput}
          value={corpo.nomeEmpresa || ''}
          onChangeText={(text) => corpo.nomeEmpresa = text}
        />
        <TextInput
          placeholder="Nome do Falecido"
          style={styles.textInput}
          value={corpo.nomeFalecido || ''}
          onChangeText={(text) => corpo.nomeFalecido = text}
        />
        <TextInput
          placeholder="Data e Hora do Falecimento"
          style={styles.textInput}
          value={corpo.dataHoraFalecimento || ''}
          onChangeText={(text) => corpo.dataHoraFalecimento = text}
        />
        <TextInput
          placeholder="Sexo"
          style={styles.textInput}
          value={corpo.sexoFalecido || ''}
          onChangeText={(text) => corpo.sexoFalecido = text}
        />
        <TextInput
          placeholder="Procedimento"
          style={styles.textInput}
          value={corpo.procedimento || ''}
          onChangeText={(text) => corpo.procedimento = text}
        />
        <TextInput
          placeholder="Nome do Técnico"
          style={styles.textInput}
          value={corpo.nomeTecnico || ''}
          onChangeText={(text) => corpo.nomeTecnico = text}
        />
        <TextInput
          placeholder="Data e Hora de Recebimento"
          style={styles.textInput}
          value={corpo.dataHoraRecebimento || ''}
          onChangeText={(text) => corpo.dataHoraRecebimento = text}
        />
        <View style={styles.checkboxContainer}>
          <Checkbox
            status={corpo.barbar ? 'checked' : 'unchecked'}
            onPress={() => {
              corpo.barbar = !corpo.barbar;
              if (!corpo.barbar) corpo.detalhesBarbear = ''; // Clear details if unselected
            }}
          />
          <Text>Barbear</Text>
        </View>
        {corpo.barbar && (
          <TextInput
            placeholder="Detalhes do Barbear"
            style={styles.textInput}
            value={corpo.detalhesBarbear || ''}
            onChangeText={(text) => corpo.detalhesBarbear = text}
          />
        )}
        <TextInput
          placeholder="Maquiar"
          style={styles.textInput}
          value={corpo.tipoMaquiagem || ''}
          onChangeText={(text) => corpo.tipoMaquiagem = text}
        />
        <TextInput
          placeholder="Vestir"
          style={styles.textInput}
          value={corpo.vestir || ''}
          onChangeText={(text) => corpo.vestir = text}
        />
        <TextInput
          placeholder="Valor Recebido"
          style={styles.textInput}
          value={corpo.valorRecebido || ''}
          onChangeText={(text) => corpo.valorRecebido = text}
        />
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          value={termoBusca}
          placeholder="Buscar por nome do falecido"
          style={styles.textInput}
          onChangeText={(value) => setTermoBusca(value)}
        />
      </View>

      {corposFiltrados.map((corpo, index) => (
        <Card key={index} style={styles.card}>
          <Card.Content>
            <Text style={styles.title}>{corpo.nomeFalecido || 'Não informado'}</Text>
            <Paragraph>
              Nome da Empresa: {corpo.nomeEmpresa || 'Não informado'}
              {'\n'}Data e Hora do Falecimento: {corpo.dataHoraFalecimento || 'Não informado'}
              {'\n'}Sexo: {corpo.sexoFalecido || 'Não informado'}
              {'\n'}Procedimento: {corpo.procedimento || 'Não informado'}
              {'\n'}Técnico: {corpo.nomeTecnico || 'Não informado'}
              {'\n'}Data e Hora de Recebimento: {corpo.dataHoraRecebimento || 'Não informado'}
              {'\n'}Barbear: {corpo.barbar ? `Sim, ${corpo.detalhesBarbear || 'Não especificado'}` : 'Não'}
              {'\n'}Maquiar: {corpo.maquiar ? `Sim, ${corpo.tipoMaquiagem || 'Não especificado'}` : 'Não'}
              {'\n'}Vestir: {corpo.vestir || 'Não informado'}
              {'\n'}Valor Recebido: {corpo.valorRecebido || 'Não informado'}
            </Paragraph>
          </Card.Content>
          <Card.Actions>
            <IconButton
              icon="content-copy"
              color="black"
              onPress={() => copiarDados(corpo)}
            />
            <IconButton
              icon="file-pdf"
              color="black"
              onPress={() => gerarPDF(corpo)}
            />
            <IconButton
              icon="delete"
              color="black"
              onPress={() => excluirCorpo(corpo.nomeFalecido)}
            />
          </Card.Actions>
        </Card>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f8f8',
  },
  inputContainer: {
    marginBottom: 16,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
  },
  card: {
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  formContainer: {
    marginBottom: 16,
  },
});
