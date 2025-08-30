import Image from "next/image";
import Head from 'next/head';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Head>
        <title>Nutrição Saudável</title>
        <meta name="description" content="Descubra como começar sua dieta hoje!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex-grow flex flex-col items-center justify-center p-4">
        <h1 className="text-4xl font-bold text-green-600 mb-4">
          Gostaria de começar sua <span className="text-green-800">Dieta</span>?
        </h1>
        <p className="text-lg text-gray-700 text-center mb-8">
          Explore nossas receitas, dicas e planos personalizados para uma vida mais saudável.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl">

          <a
            href="/dicas"
            className="block p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow text-center"
          >
            <h2 className="text-2xl font-semibold text-green-700">Dicas de Nutrição &rarr;</h2>
            <p className="mt-2 text-gray-600">
              Descubra as melhores práticas para uma alimentação saudável.
            </p>
          </a>

          <a
           href="/dieta"
           className="block p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow text-center"
          >
            <h2 className="text-2xl font-semibold text-green-700">Monte sua Dieta &rarr;</h2>
            <p className="mt-2 text-gray-600">
              Comece a criar sua própria dieta personalizada.
            </p>
          </a>

        </div>
      </main>
    </div>
  );
}
