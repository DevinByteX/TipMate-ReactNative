import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const AboutMeScreen = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>About Me</Text>
      <Text style={styles.description}>
        Welcome to TipMate! My name is Devin DeeKay, and I am a passionate developer dedicated to
        creating intuitive and user-friendly applications. This app is designed to make your life
        easier by helping you calculate tips effortlessly. Thank you for using TipMate, and I hope
        you enjoy the experience!
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#555',
  },
});

export default AboutMeScreen;
