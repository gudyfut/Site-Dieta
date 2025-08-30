'use server';
import * as bcrypt from 'bcrypt';
import { redirect } from "next/navigation";
//Para ler arquivos com nextjs
import {promises as fs} from 'fs';
import path from "path";
import {createSessionToken, deleteSessionToken} from "@/back/utils/auth";

const arquivo = '/usuarios-db.json';

export interface LoginCredentials{
    email: string,
    password: string
}

export async function createUser(data: LoginCredentials){   

    const email = (data.email as string).trim();
    const password = data.password as string;

    console.log(data);

    const passwordCrypt = await bcrypt.hash(password,10);
    
    const novoUser = {
        id: crypto.randomUUID(),
        email,
        password: passwordCrypt
    }

    //Busca a base de usuários
    const usuariosBD = await retornaBD(arquivo);
    //Verifica se usuário já existe
    for (const user of usuariosBD) {
        //Aqui usamos o for..of pois é sequencial
        if(user.email === email){
            return {error: 'Usuário ou senha incorretos'}; //Ao invés de informar "usuário já encontrado"
        }
    }
    //Nenhum user encontrado. Pode adicionar o novo no banco
    usuariosBD.push(novoUser);
    await armazenaBD(arquivo,usuariosBD);
    redirect('/login');//redireciona para a página de login
}

export async function login(data: LoginCredentials) {
    
    console.log('funcion login');
    const email = data.email;
    const password = data.password;

    //Manipula BD
    const usuariosBD = await retornaBD(arquivo);
    
    const user = usuariosBD.find(user => user.email === email);

    if(!user)
    {   console.log('registrar');
        redirect('/registrar');
        return {error: 'Usuário não encontrado'};

    }
    const isMatch = await bcrypt.compare(password, user.password);

    if(isMatch)
    {
       await createSessionToken({sub: user.id, email: user.email});
       redirect('/dieta'); 
    }else{
        return {error: 'Usuário ou senhas incorretos'}
    }
}

export async function logout() {
    await deleteSessionToken();
    redirect('/login');
}

async function retornaBD(arquivo: string): Promise<Array<any>>
{
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

async function armazenaBD(arquivo: string, dados: any)
{
    const dbPath = path.join(process.cwd(),'src','db',arquivo);
    await fs.writeFile(dbPath, JSON.stringify(dados,null,2));
}

