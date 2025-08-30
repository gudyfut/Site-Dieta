"use client";

import React, { useState, useEffect } from 'react';
import { loadDiets, createDiet, updateDiet, deleteDiet } from '../../back/utils/credential-diet';
import { getCookie } from '../../back/utils/cookies'; // Importe a função getCookie

// por enquanto ele salva a lista de dietas com o email "emailteste@gmail.com", e consulta as dietas com esse email também
// basta arranjar uma forma de substituir esse email por um email de usuário logado para fazer variar de acordo com o login

// Obtenha o valor do cookie emailLogado
const email = getCookie('emailLogado') || "emailteste@gmail.com"; // Use o valor do cookie ou um valor padrão

const FoodDiary = () => {
  // Variáveis de estado
  const [meals, setMeals] = useState([
    { name: 'Café da Manhã', foods: [] },
    { name: 'Lanche da Manhã', foods: [] },
    { name: 'Almoço', foods: [] },
    { name: 'Lanche da Tarde', foods: [] },
    { name: 'Jantar', foods: [] },
    { name: 'Ceia', foods: [] },
  ]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [dietPlan, setDietPlan] = useState({ name: '', meals: meals });
  const [userDiets, setUserDiets] = useState({ email: email, diets: [] });
  const [isEditing, setIsEditing] = useState(false);
  const [editingDietId, setEditingDietId] = useState(null);
  const [isViewing, setIsViewing] = useState(false);

  // Carregar dietas do usuário ao montar o componente
  useEffect(() => {
    const loadUserDiets = async () => {
      try {
        const user = await loadDiets(email);
        setUserDiets(user);
      } catch (error) {
        console.error('Erro ao carregar dietas:', error);
      }
    };

    loadUserDiets();
  }, []);

  // Manipular mudança no input de busca
  const handleInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.length > 2) {
      handleSearch(query);
    } else {
      setShowSuggestions(false);
    }
  };

  // Buscar resultados da API
  const handleSearch = async (query) => {
    try {
      const response = await fetch(`https://api.nal.usda.gov/fdc/v1/foods/search?api_key=0ohjRdLraoFKxwEZvQR4YPzZeGhGNAwN99uU47QY&query=${query}`);
      const data = await response.json();
      setSearchResults(data.foods);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Erro ao buscar alimentos:', error);
    }
  };

  // Adicionar alimento a uma refeição
  const addFoodToMeal = (mealIndex, food) => {
    const updatedMeals = [...meals];
    updatedMeals[mealIndex].foods.push(food);
    setMeals(updatedMeals);
    setDietPlan({ ...dietPlan, meals: updatedMeals });
    setShowSuggestions(false);
    setSearchQuery('');
  };

  // Remover alimento de uma refeição
  const removeFoodFromMeal = (mealIndex, foodIndex) => {
    const updatedMeals = [...meals];
    updatedMeals[mealIndex].foods.splice(foodIndex, 1);
    setMeals(updatedMeals);
    setDietPlan({ ...dietPlan, meals: updatedMeals });
  };

  // Salvar plano de dieta
  const handleSaveDietPlan = async () => {
    try {
      const updatedDietPlan = { ...dietPlan, meals: meals };
      const updatedUserDiets = await updateDiet(email, updatedDietPlan, editingDietId, userDiets);
      setUserDiets(updatedUserDiets);
      resetForm();
    } catch (error) {
      console.error('Erro ao salvar dieta:', error);
    }
  };

  // Selecionar uma dieta para visualização ou edição
  const selectDiet = async (dietId) => {
    try {
      const user = await loadDiets(email);
      const diet = user.diets.find(d => d.id === dietId);
      if (diet) {
        setMeals(diet.meals);
        setDietPlan(diet);
        setIsViewing(true);
        setIsEditing(false);
        setEditingDietId(diet.id);
      }
    } catch (error) {
      console.error('Erro ao carregar dieta:', error);
    }
  };

  // Excluir uma dieta
  const deleteDietHandler = async (dietId) => {
    try {
      const updatedUserDiets = await deleteDiet(email, dietId, userDiets);
      setUserDiets(updatedUserDiets);
      resetForm();
    } catch (error) {
      console.error('Erro ao excluir dieta:', error);
    }
  };

  // Resetar formulário para o estado inicial
  const resetForm = () => {
    setMeals([
      { name: 'Café da Manhã', foods: [] },
      { name: 'Lanche da Manhã', foods: [] },
      { name: 'Almoço', foods: [] },
      { name: 'Lanche da Tarde', foods: [] },
      { name: 'Jantar', foods: [] },
      { name: 'Ceia', foods: [] },
    ]);
    setDietPlan({ name: '', meals: meals });
    setIsEditing(false);
    setEditingDietId(null);
  };

  // Criar uma nova dieta
  const createNewDiet = async () => {
    setIsViewing(false); // Resetar estado de visualização
    setIsEditing(true); // Iniciar estado de edição
    resetForm(); // Garantir que o formulário seja resetado antes de criar uma nova dieta
    const savedDietsLength = userDiets.diets.length; // Nome de variável correto
    const newDiet = { id: Date.now(), name: `NOVA DIETA ${savedDietsLength + 1}`, meals: [
      { name: 'Café da Manhã', foods: [] },
      { name: 'Lanche da Manhã', foods: [] },
      { name: 'Almoço', foods: [] },
      { name: 'Lanche da Tarde', foods: [] },
      { name: 'Jantar', foods: [] },
      { name: 'Ceia', foods: [] },
    ]};
    try {
      const updatedUserDiets = await createDiet(email, newDiet, userDiets);
      setUserDiets(updatedUserDiets);
      selectDiet(newDiet.id);
    } catch (error) {
      console.error('Erro ao criar nova dieta:', error);
    }
  };

  // Visualizar uma dieta
  const viewDiet = (diet) => {
    setMeals(diet.meals);
    setDietPlan(diet);
    setIsViewing(true);
    setIsEditing(false);
    setEditingDietId(diet.id);
  };

  // Iniciar edição de uma dieta
  const startEditing = () => {
    setIsViewing(false);
    setIsEditing(true);
  };

  // Cancelar edição e sincronizar com o banco de dados
  const handleCancel = async () => {
    if (editingDietId) {
      try {
        const user = await loadDiets(email);
        const diet = user.diets.find(d => d.id === editingDietId);
        if (diet) {
          setMeals(diet.meals);
          setDietPlan(diet);
        }
      } catch (error) {
        console.error('Erro ao carregar dieta:', error);
      }
    }
    setIsEditing(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="flex-grow flex flex-col items-center p-4">
        <div className="w-full bg-white p-4 shadow-lg">
          <h1 className="text-xl font-bold text-green-600 mb-4">Minhas Dietas</h1>
          <button onClick={createNewDiet} className="mb-4 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors">
            CRIAR DIETA
          </button>
          <ul className="flex space-x-4 overflow-x-auto">
            {userDiets.diets.map((diet) => (
              <li key={diet.id} className="flex items-center space-x-2">
                <button onClick={() => selectDiet(diet.id)} className="bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-600 transition-colors">
                  {diet.name}
                </button>
                <button onClick={() => deleteDietHandler(diet.id)} className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600 transition-colors">
                  Excluir
                </button>
              </li>
            ))}
          </ul>
        </div>

        {isViewing && (
          <div className="max-w-4xl w-full bg-white p-6 rounded-lg shadow-lg mt-6">
            <h1 className="text-2xl font-bold text-green-600 mb-6 text-center">{dietPlan.name}</h1>
            {meals.map((meal, index) => (
              <div key={index} className="mb-6">
                <h2 className="text-lg font-semibold text-gray-700 mb-4">{meal.name}</h2>
                <ul className="mt-4">
                  {meal.foods.map((food, foodIndex) => (
                    <li key={foodIndex} className="flex justify-between items-center mb-2">
                      <span className="text-black">{food.description}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <button onClick={startEditing} className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors mt-4">
              Alterar Dieta
            </button>
          </div>
        )}

        {isEditing && (
          <div className="max-w-4xl w-full bg-white p-6 rounded-lg shadow-lg mt-6">
            <h1 className="text-2xl font-bold text-green-600 mb-6 text-center">Adicione sua Dieta</h1>
            <input
              type="text"
              value={dietPlan.name}
              onChange={(e) => setDietPlan({ ...dietPlan, name: e.target.value })}
              placeholder="Nome da Dieta"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 mb-4 text-black"
            />
            <div>
              <input
                type="text"
                value={searchQuery}
                onChange={handleInputChange}
                placeholder="Buscar alimentos"
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 mb-4 text-black"
              />
              {showSuggestions && (
                <ul className="border border-gray-300 rounded bg-white max-h-60 overflow-y-auto">
                  {searchResults.map((food) => (
                    <li key={food.fdcId} className="p-2 cursor-pointer hover:bg-gray-200 flex justify-between items-center">
                      <span className="text-black">{food.description}</span>
                      <select
                        onChange={(e) => addFoodToMeal(e.target.value, food)}
                        className="ml-2 p-1 border border-gray-300 rounded bg-blue-500 text-black"
                      >
                        <option value="" className="text-black">Adicionar a...</option>
                        {meals.map((meal, index) => (
                          <option key={index} value={index} className="text-black">{meal.name}</option>
                        ))}
                      </select>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {meals.map((meal, index) => (
              <div key={index} className="mb-6">
                <h2 className="text-lg font-semibold text-gray-700 mb-4">{meal.name}</h2>
                <ul className="mt-4">
                  {meal.foods.map((food, foodIndex) => (
                    <li key={foodIndex} className="flex justify-between items-center mb-2">
                      <span className="text-black">{food.description}</span>
                      <button onClick={() => removeFoodFromMeal(index, foodIndex)} className="ml-2 bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600 transition-colors">
                        Remover
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div className="flex space-x-4">
              <button onClick={handleSaveDietPlan} className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors mt-4">
                Salvar Dieta
              </button>
              <button onClick={handleCancel} className="w-full bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700 transition-colors mt-4">
                Cancelar
              </button>
              {isEditing && (
                <button onClick={() => deleteDietHandler(editingDietId)} className="w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition-colors mt-4">
                  Excluir Dieta
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FoodDiary;