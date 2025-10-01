import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Recipes({ navigation }) {
  const [view, setView] = useState('lista');
  const [recipes, setRecipes] = useState([]);
  const [title, setTitle] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [preparation, setPreparation] = useState('');
  const [editingRecipeId, setEditingRecipeId] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [recipeToDelete, setRecipeToDelete] = useState(null);

  useEffect(() => {
    const loadRecipes = async () => {
      try {
        const stored = await AsyncStorage.getItem('@recipes');
        if (stored) {
          setRecipes(JSON.parse(stored));
        }
      } catch (e) {
        console.error('Falha ao carregar receitas.', e);
      }
    };
    loadRecipes();
  }, []);

  useEffect(() => {
    const save = async () => {
      try {
        await AsyncStorage.setItem('@recipes', JSON.stringify(recipes));
      } catch (e) {
        console.error('Falha ao salvar receitas.', e);
      }
    };
    save();
  }, [recipes]);

  const handleDeleteRecipe = (id) => {
    setRecipes((current) => current.filter((r) => r.id !== id));
    closeModal();
  };

  const confirmDeleteRecipe = (id) => {
    setRecipeToDelete(id);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setRecipeToDelete(null);
  };

  const handleEditRecipe = (recipe) => {
    setTitle(recipe.title);
    setIngredients(recipe.ingredients);
    setPreparation(recipe.preparation);
    setEditingRecipeId(recipe.id);
    setView('formulario');
  };

  const handleSave = () => {
    if (!title.trim()) {
      return;
    }
    if (editingRecipeId) {
      setRecipes((current) =>
        current.map((r) =>
          r.id === editingRecipeId
            ? {
                ...r,
                title: title.trim(),
                ingredients: ingredients.trim(),
                preparation: preparation.trim(),
              }
            : r
        )
      );
    } else {
      const newRecipe = {
        id: Date.now().toString(),
        title: title.trim(),
        ingredients: ingredients.trim(),
        preparation: preparation.trim(),
      };
      setRecipes((current) => [...current, newRecipe]);
    }
    setTitle('');
    setIngredients('');
    setPreparation('');
    setEditingRecipeId(null);
    setView('lista');
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.headerContainer}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Text style={styles.backButtonText}>Voltar</Text>
          </TouchableOpacity>
          <Text style={styles.header}>Meu Livro de Receitas</Text>
        </View>

        {view === 'lista' ? (
          <View>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setView('formulario')}
            >
              <Text style={styles.buttonText}>Adicionar Nova Receita</Text>
            </TouchableOpacity>

            {recipes.length === 0 ? (
              <Text style={styles.emptyText}>Nenhuma receita cadastrada.</Text>
            ) : (
              recipes.map((item) => (
                <View key={item.id} style={styles.recipeItem}>
                  <View style={styles.recipeTextContainer}>
                    <Text style={styles.recipeTitle}>{item.title}</Text>
                    <Text style={styles.recipeIngredients}>
                      {item.ingredients}
                    </Text>
                    <Text style={styles.recipePreparation}>
                      {item.preparation}
                    </Text>
                  </View>
                  <View style={styles.actionsRow}>
                    <TouchableOpacity
                      style={[styles.smallButton, styles.editButton]}
                      onPress={() => handleEditRecipe(item)}
                    >
                      <Text style={styles.buttonText}>Editar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.smallButton, styles.deleteButton]}
                      onPress={() => confirmDeleteRecipe(item.id)}
                    >
                      <Text style={styles.buttonText}>Excluir</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </View>
        ) : (
          <View style={styles.formContainer}>
            <Text style={styles.formHeader}>
              {editingRecipeId ? 'Editar Receita' : 'Adicionar Receita'}
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Título da Receita"
              value={title}
              onChangeText={setTitle}
            />
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Ingredientes"
              value={ingredients}
              onChangeText={setIngredients}
              multiline
            />
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Modo de preparo"
              value={preparation}
              onChangeText={setPreparation}
              multiline
            />
            <View style={styles.formActions}>
              <TouchableOpacity
                style={[styles.formButton, styles.cancelButton]}
                onPress={() => {
                  setView('lista');
                  setEditingRecipeId(null);
                  setTitle('');
                  setIngredients('');
                  setPreparation('');
                }}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.formButton, styles.saveButton]}
                onPress={handleSave}
              >
                <Text style={styles.buttonText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>

      <Modal
        animationType="fade"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Deseja realmente excluir esta receita?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={closeModal}
              >
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => handleDeleteRecipe(recipeToDelete)}
              >
                <Text style={styles.modalButtonText}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    marginRight: 10,
    padding: 5,
  },
  backButtonText: {
    color: '#007bff',
    fontSize: 16,
  },
  header: {
    flex: 1,
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#e67e22',
  },
  addButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  recipeItem: {
    backgroundColor: '#fff',
    padding: 20,
    marginVertical: 8,
    borderRadius: 10,
  },
  recipeTextContainer: {
    marginBottom: 10,
  },
  recipeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  recipeIngredients: {
    fontSize: 16,
    color: '#7f8c8d',
    marginTop: 5,
  },
  recipePreparation: {
    fontSize: 16,
    color: '#34495e',
    marginTop: 5,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  smallButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginLeft: 8,
  },
  editButton: {
    backgroundColor: '#2980b9',
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
  },
  formContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
  },
  formHeader: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    borderColor: '#bdc3c7',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  formButton: {
    flex: 1,
    padding: 12,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#95a5a6',
  },
  saveButton: {
    backgroundColor: '#27ae60',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 30,
    fontSize: 18,
    color: '#95a5a6',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:
  {}}})