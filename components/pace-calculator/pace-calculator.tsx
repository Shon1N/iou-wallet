import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { useState } from 'react';

export default function PaceCalculator() {
  const [distance, setDistance] = useState('');
  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('');
  const [seconds, setSeconds] = useState('');
  const [pace, setPace] = useState('');

  const calculatePace = () => {
    const distanceNum = parseFloat(distance);
    const totalSeconds = 
      (parseInt(hours || '0') * 3600) + 
      (parseInt(minutes || '0') * 60) + 
      parseInt(seconds || '0');

    if (distanceNum && totalSeconds) {
      const paceInSeconds = totalSeconds / distanceNum;
      const paceMinutes = Math.floor(paceInSeconds / 60);
      const paceSeconds = Math.round(paceInSeconds % 60);
      setPace(`${paceMinutes}:${paceSeconds.toString().padStart(2, '0')} /km`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pace Calculator </Text>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Distance (km) </Text>
        <TextInput
          style={styles.input}
          value={distance}
          onChangeText={setDistance}
          keyboardType="numeric"
          placeholder="Enter distance"
        />
      </View>

      <Text style={styles.label}>Time </Text>
      <View style={styles.timeContainer}>
        <TextInput
          style={[styles.input, styles.timeInput]}
          value={hours}
          onChangeText={setHours}
          keyboardType="numeric"
          placeholder="HH"
        />
        <Text style={styles.timeSeparator}>:</Text>
        <TextInput
          style={[styles.input, styles.timeInput]}
          value={minutes}
          onChangeText={setMinutes}
          keyboardType="numeric"
          placeholder="MM"
        />
        <Text style={styles.timeSeparator}>:</Text>
        <TextInput
          style={[styles.input, styles.timeInput]}
          value={seconds}
          onChangeText={setSeconds}
          keyboardType="numeric"
          placeholder="SS"
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={calculatePace}>
        <Text style={styles.buttonText}>Calculate Pace </Text>
      </TouchableOpacity>

      {pace ? (
        <View style={styles.resultContainer}>
          <Text style={styles.label}>Your Pace: </Text>
          <Text style={styles.paceText}>{pace}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: '#ccd6db',
    borderRadius: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#666',
  },
  input: {
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  timeInput: {
    width: 60,
    textAlign: 'center',
    borderColor: '#000',
  },
  timeSeparator: {
    fontSize: 20,
    marginHorizontal: 5,
  },
  button: {
    backgroundColor: '#088395',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  resultContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  paceText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#088395',
  },
}); 