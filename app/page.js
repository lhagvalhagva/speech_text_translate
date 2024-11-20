import Header from "./components/Header";
import SpeechToText from "./components/SpeechToText";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-50 py-8">
        <SpeechToText />
      </main>
      <Footer />
    </div>
  );
}
