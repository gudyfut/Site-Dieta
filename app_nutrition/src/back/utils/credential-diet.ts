'use server';
import {promises as fs} from 'fs';
import path from "path";

const arquivo = 'diet-db.json';

// Função para ler o arquivo de banco de dados e retornar seu conteúdo
async function retornaBD(arquivo: string): Promise<Array<any>> {
    try {
        const dbPath = path.join(process.cwd(), 'src', 'db', arquivo);
        const dados = await fs.readFile(dbPath, 'utf-8');
        return JSON.parse(dados || '[]'); // Retorna um array vazio se o arquivo estiver vazio
    } catch (error: any) {
        if (error.code === 'ENOENT') {
            // Arquivo não encontrado, inicializa com um array vazio
            console.warn(`Arquivo não encontrado: ${arquivo}. Inicializando com um array vazio.`);
            return [];
        } else {
            throw error; // Repassa outros erros
        }
    }
}

// Função para escrever dados no arquivo de banco de dados
async function armazenaBD(arquivo: string, dados: any) {
    const dbPath = path.join(process.cwd(), 'src', 'db', arquivo);
    await fs.writeFile(dbPath, JSON.stringify(dados, null, 2));
}

// Função para carregar dietas de um usuário específico
export async function loadDiets(email: string): Promise<any> {
    const data = await retornaBD(arquivo);
    const user = data.find((user: any) => user.email === email);
    if (user) {
        return user;
    } else {
        const newUser = { email: email, diets: [] };
        data.push(newUser);
        await armazenaBD(arquivo, data);
        return newUser;
    }
}

// Função para salvar alterações no banco de dados
export async function saveChanges(email: string, userDiets: any): Promise<void> {
    const data = await retornaBD(arquivo);
    const updatedData = data.map((user: any) => user.email === email ? userDiets : user);
    await armazenaBD(arquivo, updatedData);
}

// Função para criar uma nova dieta
export async function createDiet(email: string, dietPlan: any, userDiets: any): Promise<any> {
    const newDiet = { id: Date.now(), name: dietPlan.name, meals: dietPlan.meals };
    const updatedUserDiets = { ...userDiets, diets: [...userDiets.diets, newDiet] };
    await saveChanges(email, updatedUserDiets);
    return updatedUserDiets;
}

// Função para atualizar uma dieta existente
export async function updateDiet(email: string, dietPlan: any, editingDietId: number | null, userDiets: any): Promise<any> {
    const updatedDiets = userDiets.diets.map((diet: any) => diet.id === editingDietId ? { ...diet, name: dietPlan.name, meals: dietPlan.meals } : diet);
    const updatedUserDiets = { ...userDiets, diets: updatedDiets };
    await saveChanges(email, updatedUserDiets);
    return updatedUserDiets;
}

// Função para excluir uma dieta
export async function deleteDiet(email: string, dietId: number, userDiets: any): Promise<any> {
    const updatedDiets = userDiets.diets.filter((diet: any) => diet.id !== dietId);
    const updatedUserDiets = { ...userDiets, diets: updatedDiets };
    await saveChanges(email, updatedUserDiets);
    return updatedUserDiets;
}

