import React, { useState, useEffect } from 'react';
import {SafeAreaView, StyleSheet} from 'react-native'
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, ScrollView,} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function App() {
    const [view, setView] = useState('lista');
    const [recipes, setRecipes] = useState([]);
    const [title, setTitle] = useState('');
    const [ingredients, setIngredients] = useState('');
    return (
      <SafeAreaView>
        O conteúdo visual do nosso app virá aqui 
      </SafeAreaView>
    )};  
    useEffect(() => {
      const loadRecipes = async () => {
        try {
          if (storedRecipes !== null) {
            setRecipes(JSON.parse(storedRecipes));
          }
        } catch (e) {
          console.error("Falha ao carregar receitas.", e);
        }
      };
      loadRecipes();
    }, []); 
    const handleAddRecipe = () => {
      if (!title) {
        return; 
      }}
      const newRecipe = {
        id: Date.now().toString(), // Pega a data atual e transformar em string.
        title: title, // Pega a variável useState 
}
setRecipes(currentRecipes => [...currentRecipes, newRecipe]);
setTitle('');
    setIngredients('');
    setView('lista');
    setRecipes(currentRecipes => currentRecipes.filter(recipe => recipe.id !== id));
    


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
