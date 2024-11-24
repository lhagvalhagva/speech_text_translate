import Footer from "../components/Footer";
import {
  Mic,
  FileText,
  AlertCircle,
  HelpCircle,
  Volume2,
  FileSearch,
  Brackets,
  Wifi,
  Chrome,
  Settings,
  Bot,
  Upload,
  MessageSquare,
  Lightbulb,
  Check,
  X,
  User,
  ArrowUpToLine,
  FileUp,
  FileQuestion,
  MessageCircle,
  BrainCircuit,
} from "lucide-react";

export default function GuidePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-8">
            <FileText className="inline-block mr-2 h-8 w-8" />
            Заавар
          </h1>

          <div className="space-y-8 bg-white p-8 rounded-lg shadow-sm">
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
                <Mic className="h-6 w-6 text-purple-600" />
                Яаж ашиглах вэ?
              </h2>
              <div className="space-y-4 text-gray-600">
                <p className="flex items-center gap-2">
                  <Volume2 className="h-4 w-4 text-blue-500" />
                  1. Микрофон товчийг дарж яриагаа эхлүүлнэ
                </p>
                <p className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-blue-500" />
                  2. Таны ярьсан үг шууд текст болж гарч ирнэ
                </p>
              </div>
            </section>
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
                <Bot className="h-6 w-6 text-purple-600" />
                AI Туслах ашиглах
              </h2>
              <div className="space-y-4 text-gray-600">
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                  <h3 className="font-medium text-purple-800 mb-2 flex items-center gap-2">
                    <BrainCircuit className="h-5 w-5 text-purple-600" />
                    AI-тай яаж ярилцах вэ:
                  </h3>
                  <ul className="space-y-2 text-sm text-purple-700">
                    <li className="flex items-center gap-2">
                      <Upload className="h-4 w-4" />
                      1. Эхлээд өөрийн мэдээллийн файлыг оруулах
                    </li>
                    <li className="flex items-center gap-2">
                      <MessageCircle className="h-4 w-4" />
                      2. Асуултаа англи хэл дээр асуух
                    </li>
                    <li className="flex items-center gap-2">
                      <Bot className="h-4 w-4" />
                      3. AI таны файлын мэдээлэлд үндэслэн хариулна
                    </li>
                  </ul>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mt-4">
                  <h3 className="font-medium text-blue-800 mb-2">
                    Жишээ яриа:
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex gap-2">
                      <User className="h-4 w-4 text-blue-600" />
                      <p>"What's your name?"</p>
                    </div>
                    <div className="flex gap-2">
                      <Bot className="h-4 w-4 text-purple-600" />
                      <p>
                        "Based on your information, your name is [Name from
                        file]"
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <User className="h-4 w-4 text-blue-600" />
                      <p>"Why do you want to participate in WAT?"</p>
                    </div>
                    <div className="flex gap-2">
                      <Bot className="h-4 w-4 text-purple-600" />
                      <p>
                        "According to your file, you want to participate because
                        [Reason from file]"
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
                <Lightbulb className="h-6 w-6 text-purple-600" />
                Ашиглах зөвлөмж
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                  <h3 className="font-medium text-green-800 mb-2">
                    Хийх зүйлс:
                  </h3>
                  <ul className="space-y-2 text-sm text-green-700">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4" />
                      Тодорхой, ойлгомжтой ярих
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4" />
                      Файлд бүрэн мэдээлэл оруулах
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4" />
                      Асуултыг англиар асуух
                    </li>
                  </ul>
                </div>

                <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                  <h3 className="font-medium text-red-800 mb-2">
                    Хийхгүй зүйлс:
                  </h3>
                  <ul className="space-y-2 text-sm text-red-700">
                    <li className="flex items-center gap-2">
                      <X className="h-4 w-4" />
                      Хэт хурдан ярих
                    </li>
                    <li className="flex items-center gap-2">
                      <X className="h-4 w-4" />
                      Файлын форматыг өөрчлөх
                    </li>
                    <li className="flex items-center gap-2">
                      <X className="h-4 w-4" />
                      Монгол хэл холих
                    </li>
                  </ul>
                </div>
              </div>
            </section>
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
                <AlertCircle className="h-6 w-6 text-purple-600" />
                Анхаарах зүйлс
              </h2>
              <div className="space-y-4 text-gray-600">
                <ul className="list-none pl-6 space-y-2">
                  <li className="flex items-center gap-2">
                    <Settings className="h-4 w-4 text-gray-400" />
                    Микрофоныг зөвшөөрөх хэрэгтэй
                  </li>
                  <li className="flex items-center gap-2">
                    <Volume2 className="h-4 w-4 text-gray-400" />
                    Тод, ойлгомжтой ярих
                  </li>
                  <li className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-gray-400" />
                    Дуу чимээ багатай орчинд ашиглах
                  </li>
                  <li className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-gray-400" />
                    Файл 10MB-с бага байх
                  </li>
                </ul>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
                <HelpCircle className="h-6 w-6 text-purple-600" />
                Түгээмэл асуултууд
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium text-gray-800 flex items-center gap-2">
                    <FileText className="h-4 w-4 text-gray-400" />
                    Үнэ төлбөртэй юу?
                  </h3>
                  <p className="text-gray-600 ml-6">
                    Үгүй, бүрэн үнэгүй үйлчилгээ юм.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 flex items-center gap-2">
                    <Wifi className="h-4 w-4 text-gray-400" />
                    Интернэт холболт хэрэгтэй юу?
                  </h3>
                  <p className="text-gray-600 ml-6">
                    Тийм, speech recognition ажиллахад интернэт холболт
                    шаардлагатай.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 flex items-center gap-2">
                    <Chrome className="h-4 w-4 text-gray-400" />
                    Ямар хөтөч дээр ажиллах вэ?
                  </h3>
                  <p className="text-gray-600 ml-6">
                    Chrome, Firefox, Safari, Edge зэрэг орчин үеийн хөтчүүд дээр
                    ажиллана.эхдээ Chrome дээр хамгийн сайн ажиллана.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
