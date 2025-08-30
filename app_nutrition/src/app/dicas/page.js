"use client";

import Head from 'next/head';
import { useState, useEffect } from 'react';

export default function Dicas() {
  const [dicas, setDicas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDicas = async () => {
      try {
        const response = await fetch(
          `https://api.spoonacular.com/recipes/random?number=5&apiKey=f8b216e42cb04029bc69b27ac832c887`
        );
        const data = await response.json();
        setDicas(data.recipes);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao buscar dicas:', error);
        setLoading(false);
      }
    };

    fetchDicas();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Head>
        <title>Dicas de Nutrição</title>
        <meta name="description" content="Explore dicas saudáveis para melhorar sua dieta." />
      </Head>

      <main className="flex-grow flex flex-col items-center p-4">
        <h1 className="text-3xl font-bold text-green-600 mb-4">Dicas de Nutrição</h1>

        {loading ? (
          <p className="text-lg text-gray-600">Carregando dicas...</p>
        ) : dicas.length > 0 ? (
          <ul className="w-full max-w-3xl space-y-4">
            {dicas.map((dica, index) => (
              <li
                key={index}
                className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <h2 className="text-xl font-semibold text-green-700">{dica.title}</h2>
                <p className="text-gray-600">
                  {dica.summary.replace(/<[^>]*>/g, '') /* Remove tags HTML */}
                </p>
                <a
                  href={dica.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-500 hover:text-green-700"
                >
                  Ver Receita Completa &rarr;
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-lg text-gray-600">Não há dicas disponíveis no momento.</p>
        )}
      </main>
    </div>
  );
}
