"use client";

export default function Footer(){
    return(
        <footer className="text-center py-4" style={{ backgroundColor: '#c7c7c7' }}>
            <p className="text-sm text-black" style={{ padding: 15, fontSize: 20 }}>
                &copy; 2024 WEBDIET | Projeto feito com ❤ | <a style={{ color: 'green' }} href="https://github.com/joaopmsantos1995/nutrition_project.git" target='_blank' className="hover:underline">GIT</a>
            </p>
        </footer>
    );
}