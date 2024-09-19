import React, { useState } from 'react';
import { ScrollView, Text, TextInput, Switch, Alert, View, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker as PickerComponent } from '@react-native-picker/picker'; // Importando o Picker

export default function RegistroScreen({ navigation }) {
  const [nomeEmpresa, setNomeEmpresa] = useState('');
  const [nomeFalecido, setNomeFalecido] = useState('');
  const [dataFalecimento, setDataFalecimento] = useState('');
  const [horaFalecimento, setHoraFalecimento] = useState('');
  const [sexoFalecido, setSexoFalecido] = useState('');
  const [procedimento, setProcedimento] = useState('Tanatopraxia');
  const [nomeTecnico, setNomeTecnico] = useState('');
  const [dataRecebimento, setDataRecebimento] = useState('');
  const [horaRecebimento, setHoraRecebimento] = useState('');
  const [barbear, setBarbear] = useState(false);
  const [detalhesBarbear, setDetalhesBarbear] = useState('');
  const [maquiar, setMaquiar] = useState('Não');
  const [tipoMaquiagem, setTipoMaquiagem] = useState('');
  const [vestir, setVestir] = useState('');
  const [valorRecebido, setValorRecebido] = useState('');

  const salvarRegistro = async () => {
    try {
      const corpo = {
        nomeEmpresa,
        nomeFalecido,
        dataHoraFalecimento: `${dataFalecimento} ${horaFalecimento}`, // Combine data e hora
        sexoFalecido,
        procedimento,
        nomeTecnico,
        dataHoraRecebimento: `${dataRecebimento} ${horaRecebimento}`, // Combine data e hora
        barbear,
        detalhesBarbear: barbear ? detalhesBarbear : 'Não especificado',
        maquiar,
        tipoMaquiagem: maquiar === 'Sim, específico' ? tipoMaquiagem : 'Não especificado',
        vestir,
        valorRecebido,
      };

      const jsonValue = JSON.stringify(corpo);
      await AsyncStorage.setItem(`corpo-${nomeFalecido}`, jsonValue);
      Alert.alert('Registro salvo!', 'O corpo foi registrado com sucesso.');
      navigation.goBack();
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível salvar o registro.');
    }
  };

  // Função para formatar a data
  const formatarData = (valor) => {
    const data = valor.replace(/\D/g, ''); // Remove caracteres não numéricos
    if (data.length <= 2) return data;
    if (data.length <= 4) return `${data.slice(0, 2)}/${data.slice(2, 4)}`;
    return `${data.slice(0, 2)}/${data.slice(2, 4)}/${data.slice(4, 8)}`;
  };

  // Função para formatar a hora
  const formatarHora = (valor) => {
    const hora = valor.replace(/\D/g, ''); // Remove caracteres não numéricos
    if (hora.length <= 2) return hora;
    return `${hora.slice(0, 2)}:${hora.slice(2, 4)}`;
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Nome da Empresa</Text>
      <TextInput style={styles.input} value={nomeEmpresa} onChangeText={setNomeEmpresa} />

      <Text style={styles.label}>Nome do Falecido</Text>
      <TextInput style={styles.input} value={nomeFalecido} onChangeText={setNomeFalecido} />

      <Text style={styles.label}>Data do Falecimento (DD/MM/AAAA)</Text>
      <TextInput
        style={styles.input}
        value={dataFalecimento}
        onChangeText={(value) => setDataFalecimento(formatarData(value))}
        placeholder="Ex: 25/06/1998"
        keyboardType="numeric"
        maxLength={10}
      />

      <Text style={styles.label}>Hora do Falecimento (HH:MM)</Text>
      <TextInput
        style={styles.input}
        value={horaFalecimento}
        onChangeText={(value) => setHoraFalecimento(formatarHora(value))}
        placeholder="Ex: 23:11"
        keyboardType="numeric"
        maxLength={5}
      />

      <Text style={styles.label}>Sexo do Falecido</Text>
      <View style={styles.pickerContainer}>
        <PickerComponent
          selectedValue={sexoFalecido}
          onValueChange={(itemValue) => setSexoFalecido(itemValue)}
        >
          <PickerComponent.Item label="Selecione o sexo" value="" />
          <PickerComponent.Item label="Masculino" value="Masculino" />
          <PickerComponent.Item label="Feminino" value="Feminino" />
        </PickerComponent>
      </View>

      <Text style={styles.label}>Procedimento</Text>
      <View style={styles.pickerContainer}>
        <PickerComponent
          selectedValue={procedimento}
          onValueChange={(itemValue) => setProcedimento(itemValue)}
        >
          <PickerComponent.Item label="Tanatopraxia" value="Tanatopraxia" />
          <PickerComponent.Item label="Embalsamamento" value="Embalsamamento" />
          <PickerComponent.Item label="Higienização" value="Higienização" />
        </PickerComponent>
      </View>

      <Text style={styles.label}>Nome do Técnico que Recebeu</Text>
      <TextInput style={styles.input} value={nomeTecnico} onChangeText={setNomeTecnico} />

      <Text style={styles.label}>Data de Recebimento (DD/MM/AAAA)</Text>
      <TextInput
        style={styles.input}
        value={dataRecebimento}
        onChangeText={(value) => setDataRecebimento(formatarData(value))}
        placeholder="Ex: 25/06/1998"
        keyboardType="numeric"
        maxLength={10}
      />

      <Text style={styles.label}>Hora de Recebimento (HH:MM)</Text>
      <TextInput
        style={styles.input}
        value={horaRecebimento}
        onChangeText={(value) => setHoraRecebimento(formatarHora(value))}
        placeholder="Ex: 23:11"
        keyboardType="numeric"
        maxLength={5}
      />

      <View style={styles.switchRow}>
        <Text>Barbear?</Text>
        <Switch value={barbear} onValueChange={value => {
          setBarbear(value);
          if (!value) setDetalhesBarbear(''); // Limpa os detalhes se desmarcado
        }} />
      </View>

      {barbear && (
        <TextInput
          style={styles.input}
          value={detalhesBarbear}
          onChangeText={setDetalhesBarbear}
          placeholder="Detalhes sobre o barbear"
        />
      )}

      <Text style={styles.label}>Maquiar?</Text>
      <View style={styles.pickerContainer}>
        <PickerComponent
          selectedValue={maquiar}
          onValueChange={(itemValue) => {
            setMaquiar(itemValue);
            if (itemValue !== 'Sim, específico') {
              setTipoMaquiagem(''); // Limpa o tipo de maquiagem se não for específico
            }
          }}
        >
          <PickerComponent.Item label="Não" value="Não" />
          <PickerComponent.Item label="Sim, simples" value="Sim, simples" />
          <PickerComponent.Item label="Sim, específico" value="Sim, específico" />
        </PickerComponent>
      </View>

      {maquiar === 'Sim, específico' && (
        <TextInput
          style={styles.input}
          value={tipoMaquiagem}
          onChangeText={setTipoMaquiagem}
          placeholder="Tipo de maquiagem"
        />
      )}

      <Text style={styles.label}>Vestir</Text>
      <TextInput
        style={styles.input}
        value={vestir}
        onChangeText={setVestir}
        placeholder="Vestir"
      />

      <Text style={styles.label}>Valor Recebido</Text>
      <TextInput
        style={styles.input}
        value={valorRecebido}
        onChangeText={setValorRecebido}
        placeholder="Valor recebido"
        keyboardType="numeric"
      />

      <TouchableOpacity style={styles.cardButton} onPress={salvarRegistro}>
        <Text style={styles.cardButtonText}>Salvar Registro</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: 'bold',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 10,
  },
  cardButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10,
  },
  cardButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
