import { useEffect, useState } from "react";

const Home = () => {
  const [text, setText] = useState("");
  const fullText = "Welcome to ChatterBox 💬";
  const [index, setIndex] = useState(0);

  // Typewriter effect
  useEffect(() => {
    if (index < fullText.length) {
      const timeout = setTimeout(() => {
        setText((prev) => prev + fullText.charAt(index));
        setIndex(index + 1);
      }, 70);
      return () => clearTimeout(timeout);
    }
  }, [index]);

  return (
    <div
      className="h-[90vh] bg-cover bg-center flex items-center justify-center px-4 animate-fade-in"
      style={{
        backgroundImage: "url('/chatBG.jpg')",
      }}
    >
      <div className="bg-black/40 backdrop-blur-lg p-10 rounded-2xl shadow-2xl max-w-2xl text-center text-white border border-white/20 animate-slide-up">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-blue-400 drop-shadow">
          {text}
        </h1>
        <p className="text-lg md:text-xl text-gray-200">
          Connect, chat, and collaborate with your friends and classmates in real-time.
        </p>
        <div className="mt-6">
          <a
            href="/register"
            className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 hover:from-purple-600 hover:to-blue-500 text-white font-semibold py-2 px-6 rounded-full transition duration-300 shadow-lg"
          >
            Get Started
          </a>
        </div>
      </div>
    </div>
  );
};

export default Home;
