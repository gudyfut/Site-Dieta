"use client";

import Head from 'next/head';
import { z } from "zod"; // Import do zod para apoio nas validações do front: npm i zod 
import toast from 'react-hot-toast'; // Import do react-hot-toast: npm i react-hot-toast
import { createUser, LoginCredentials } from "@/back/utils/credential";


// Esquema de validação para criação de usuário
const CreateUserSchema = z.object({
  email: z.string().trim().email('Email com formato incorreto'),
  password: z.string({ message: 'Insira uma senha' }).trim().min(4, { message: 'Senha precisa no mínimo 4 caracteres' }),
  confPassword: z.string({ message: 'Insira uma confirmação de senha' }).trim().min(1, { message: 'Confirmar Senha não pode ser vazia' }),
}).refine((data) => data.password === data.confPassword, {
  message: "Senhas não conferem",
  path: ["confPassword"]
});

export default function CreateUserForm() {

  // Função para criar usuário no cliente
  const createUserClient = async (formData: FormData) => {
    const createUserData = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      confPassword: formData.get('conf-password') as string
    }
    
    // Validação dos dados do usuário
    const result = CreateUserSchema.safeParse(createUserData);

    if (!result.success) {
      let errorMsg = "";

      // Acumulando todas as mensagens de erro
      // Retirado da documentação do zod: https://www.zod.dev
      result.error.issues.forEach((issue) => {
        errorMsg = errorMsg + issue.message + '. ';
      })
      // Passa a mensagem de erro para o "toast" mostrar para o usuário
      toast.error(errorMsg);
      return;
    }
    
    // Chama o Server Action. Nesse local do componente "cliente" é permitido.
    const retorno = await createUser(createUserData as LoginCredentials); // Forçando o cast para o tipo "LoginCredentials"

    if (retorno) {
      toast.error(retorno.error);
      return;
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Head>
        <title>Criar Usuário</title>
        <meta name="description" content="Página para criar novos usuários." />
      </Head>

      <main className="flex-grow flex flex-col items-center p-4">
        <h1 className="text-3xl font-bold text-green-600 mb-4">Criar Usuário</h1>

        <form   
          action={createUserClient}       
          className="w-full max-w-md bg-white p-6 rounded-lg shadow-md"
        >
          
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-600 mb-1 font-medium">
              Email
            </label>
            <input
              type="email"
              id="email"
              name='email'              
              required
              className="mt-1 p-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none text-gray-900"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-600 mb-1 font-medium">
              Senha
            </label>
            <input
              type="password"
              id="password"
              name='password'              
              required
              className="mt-1 p-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none text-gray-900"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-600 mb-1 font-medium">
              Repetir senha
            </label>
            <input
              type="password"
              id="conf-password"
              name='conf-password'              
              required
              className="mt-1 p-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none text-gray-900"
            />
          </div>

          <button                        
            className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 disabled:opacity-50"
          >   
          Criar Usuário         
          </button>    
        </form>
      </main>
    </div>
  );
}
