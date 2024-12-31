// app/page.jsx

"use client";


const Home = () => {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <a href="#" className="text-xl font-bold text-indigo-500">
                MonApp
              </a>
            </div>
            {/* Navigation Links */}
            <div className="hidden md:flex space-x-4">
              <a
                href="#features"
                className="text-gray-800 hover:text-indigo-500 transition"
              >
                Fonctionnalités
              </a>
              <a
                href="#about"
                className="text-gray-800 hover:text-indigo-500 transition"
              >
                À propos
              </a>
              <a
                href="#contact"
                className="text-gray-800 hover:text-indigo-500 transition"
              >
                Contact
              </a>
            </div>
            {/* Button */}
            <div>
              <a
                href="/register"
                className="px-4 py-2 bg-indigo-500 text-white rounded-lg shadow hover:bg-indigo-600 transition"
              >
                Inscription
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="text-center px-6 py-12 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white">
        <h1 className="text-4xl sm:text-6xl font-bold mb-6">
          Bienvenue sur <span className="text-yellow-300">MonApp</span>
        </h1>
        <p className="text-lg sm:text-2xl mb-8">
          Découvrez une nouvelle façon de simplifier votre quotidien avec notre application innovante.
        </p>
        <button className="px-8 py-3 bg-white text-indigo-500 rounded-full shadow-md hover:bg-gray-100 transition">
          En savoir plus
        </button>
      </section>

      {/* Features Section */}
      <section id="features" className="px-4 py-16 bg-white text-gray-800">
        <h2 className="text-3xl sm:text-4xl font-semibold text-center mb-12">
          Ce que notre application vous offre
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="p-6 bg-gray-100 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4">Feature 1</h3>
            <p className="text-gray-600">
              Une description concise de la première fonctionnalité clé qui change tout.
            </p>
          </div>
          <div className="p-6 bg-gray-100 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4">Feature 2</h3>
            <p className="text-gray-600">
              Voici pourquoi vous ne pourrez plus vous passer de cette fonctionnalité.
            </p>
          </div>
          <div className="p-6 bg-gray-100 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4">Feature 3</h3>
            <p className="text-gray-600">
              Transformez votre expérience utilisateur grâce à cette option unique.
            </p>
          </div>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section
        id="about"
        className="bg-indigo-500 text-white px-6 py-12 text-center"
      >
        <h2 className="text-3xl sm:text-4xl font-semibold mb-6">
          Rejoignez-nous dès aujourd'hui !
        </h2>
        <p className="text-lg sm:text-xl mb-8">
          Créez votre compte et commencez à profiter des avantages dès maintenant.
        </p>
        <button className="px-10 py-4 bg-yellow-300 text-indigo-800 rounded-full shadow-md hover:bg-yellow-400 transition">
          Inscrivez-vous
        </button>
      </section>

      {/* Footer */}
      <footer id="contact" className="py-6 bg-gray-800 text-white text-center">
        <p>© 2024 MonApp. Tous droits réservés.</p>
      </footer>
    </main>
  );
};

export default Home;
