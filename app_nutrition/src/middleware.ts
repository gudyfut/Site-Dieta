//Esse arquivo precisa ter esse nome "middleware" e deve ficar no diretório "src/"
//Todas as requisições passam por aqui. Caso a session seja válida ou rota pública, o redirecionamento segue normalmente
//Caso a session seja inválida (buscamos no cookie) o user é redirecionado para a página de login

import { NextRequest, NextResponse } from "next/server";
import { isSessionValid } from "./back/utils/auth";

//Esse "matcher" se encontra na própria documentação do next e serve para filtrar arquivos que não devem ser afetados
export const config = {
    matcher: '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)'
}

const publicRoutes = [
    '/',
    '/login',
    '/registrar'
];

export async function middleware(req: NextRequest) {
    const pathname = req.nextUrl.pathname;

    if (publicRoutes.includes(pathname)) {
        return NextResponse.next();
    }

    const session = await isSessionValid();
    if (!session) {
        return NextResponse.redirect(new URL('/login', req.url));
    }
    return NextResponse.next();
}