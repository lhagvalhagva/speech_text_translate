import SpeechToText from "./components/SpeechToText";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <SpeechToText />
        </div>
      </main>
      <Footer />
    </div>
  );
}
