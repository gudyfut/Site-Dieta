'use client';

import { useState } from 'react';
import { z } from 'zod'; // Validações com Zod
import toast from 'react-hot-toast'; // Exibição de notificações
import { LoginCredentials } from '@/back/utils/credential';
import { login } from "@/back/utils/credential";

// Esquema de validação com Zod
const LoginSchema = z.object({
  email: z.string().trim().email('Email com formato incorreto'),
  password: z.string().trim().min(1, { message: 'Senha não pode ser vazia' }),
});

export default function Login() {
  // Mock para função de login
  const loginClientAction = async (formData: FormData) => {
    // Validação com Zod

    console.log(formData.get('email') as string + '--- email');

    const loginData: LoginCredentials = {
      email: formData.get('email') as string,
      password: formData.get('password') as string
    }

    const result = LoginSchema.safeParse(loginData);

    if (!result.success) {
      // Exibe as mensagens de erro
      const errorMsg = result.error.issues.map((issue) => issue.message).join('. ');
      toast.error('Nao deu certo o login');
      console.log('erro login');
      return;
    }
    //Chama o Server Action (nesse local é permitido)
    const retorno = await login(loginData);
    console.log(retorno?.error);
    console.log('retorno - 1');
    if (retorno) {
      console.log('retorno alguma coisa');
      toast.error(retorno.error);
    }
    // Salvando em uma variavel para um cookie qual o email que foi logado
    const emailLogado = loginData.email; // Linha 44
    document.cookie = `emailLogado=${emailLogado}; path=/; max-age=3600`; // Armazena o email em um cookie com duração de 1 hora
    
    console.log('sucesso login')
    // Simulação de envio para backend
    toast.success('Login válido. Processando...');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-green-600 mb-4 text-center">Bem-vindo de volta!</h1>
        <p className="text-gray-700 text-center mb-6">
          Faça login para continuar explorando sua dieta saudável.
        </p>

        <form action={loginClientAction}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-gray-600 mb-1 font-medium">
                Email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                placeholder="Digite seu email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-gray-600 mb-1 font-medium">
                Senha
              </label>
              <input
                id="password"
                type="password"
                name="password"
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 bg-white"
                placeholder="Digite sua senha"
              />
            </div>

            <button
              className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors"
            >
              Entrar
            </button>
          </div>
        </form>
        <p className="mt-4 text-gray-500 text-sm text-center">
          Não tem uma conta?{' '}
          <a href="/registrar" className="text-green-600 hover:underline">
            Cadastre-se
          </a>
        </p>
      </div>
    </div>
  );
}
