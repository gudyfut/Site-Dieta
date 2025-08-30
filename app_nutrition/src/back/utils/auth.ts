'use server'

import * as jose from 'jose'; //npm i jose. A lib é um wrapper do JWT. Também é necessário instala, npm i jsonwebtoken
import { cookies } from 'next/headers';

async function openSessionToken(token: string){
    const secret = new TextEncoder().encode(process.env.TOKEN);
    const {payload} = await jose.jwtVerify(token, secret);
    return payload;
}

export async function createSessionToken(payload = {}){
    const secret = new TextEncoder().encode(process.env.TOKEN); 
    const session = await new jose.SignJWT(payload).setProtectedHeader({
        alg: 'HS256'
    })
    .setExpirationTime('1h')
    .sign(secret);
    const {exp} = await openSessionToken(session);
    const cookieStore = await cookies();
    cookieStore.set('session', session, {
        expires: (exp as number) * 1000,
        path: '/',
        httpOnly: true
    });
}

export async function isSessionValid(){
    const sessionCookie = (await cookies()).get('session');

    if(sessionCookie)
    {
        const {value} = sessionCookie;
        const {exp} = await openSessionToken(value);
        const currentDate = new Date().getTime();

        return ((exp as number) * 1000) > currentDate;
    }

    return false;
}

export async function deleteSessionToken() {
    const cookieStore = await cookies();
    cookieStore.set('session', '', {
        expires: new Date(0),
        path: '/',
        httpOnly: true,
    });
}