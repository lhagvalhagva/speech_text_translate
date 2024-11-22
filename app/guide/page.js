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
                <p className="flex items-center gap-2">
                  <FileSearch className="h-4 w-4 text-blue-500" />
                  3. Хэрэв файлтай харьцуулах бол:
                </p>
                <ul className="list-none pl-6 space-y-2">
                  <li className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-gray-400" />
                    Файл оруулах товчийг дарж .docx эсвэл .txt файл оруулна
                  </li>
                  <li className="flex items-center gap-2">
                    <Brackets className="h-4 w-4 text-gray-400" />
                    Яриандаа [] хаалт ашиглан хайх үгсээ тэмдэглэнэ
                  </li>
                </ul>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <p className="font-medium text-gray-700">Жишээ:</p>
                  <p>
                    "Энэ{" "}
                    <span className="bg-purple-100 text-purple-800 px-1 rounded font-medium">
                      [алим]
                    </span>{" "}
                    бол
                    <span className="text-blue-600 font-medium">
                      {" {улаан} "}
                    </span>{" "}
                    өнгөтэй
                    <span className="bg-purple-100 text-purple-800 px-1 rounded font-medium">
                      [жимс]
                    </span>{" "}
                    юм."
                  </p>
                  <ul className="text-sm text-gray-600 mt-2">
                    <li>• [алим], [жимс] - хайх үгс</li>
                    <li>• {"{улаан}"} - тэмдэглэл</li>
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
                    ажиллана.Гэхдээ Chrome дээр хамгийн сайн ажиллана.
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
