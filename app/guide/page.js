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
              </div>
            </section>
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
                <FileText className="h-6 w-6 text-purple-600" />
                Файлын формат
              </h2>
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <h3 className="font-medium text-blue-800 mb-2">
                    Файл бүтэц:
                  </h3>
                  <ul className="space-y-2 text-sm text-blue-700">
                    <li className="flex items-start gap-2">
                      <span className="font-mono bg-blue-100 px-1 rounded">
                        [ ]
                      </span>
                      <span>Асуултыг [ ] хаалтад бичнэ</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-mono bg-blue-100 px-1 rounded">
                        {}
                      </span>
                      <span>Хариултыг {} хаалтад бичнэ</span>
                    </li>
                  </ul>

                  <div className="mt-4 p-3 bg-white rounded border border-blue-100">
                    <p className="text-gray-600 text-sm font-medium mb-2">
                      Жишээ:
                    </p>
                    <pre className="text-xs text-gray-600 whitespace-pre-wrap">
                      [What's your name?]
                      {`{Hello, my name is Name. I chose this name because my parents were inspired by its meaning}`}
                      [Why do you want to participate in Work and Travel?]
                      {`{I want to participate because...}`}
                    </pre>
                  </div>

                  <div className="mt-4 space-y-2">
                    <h4 className="font-medium text-blue-800">
                      Анхаарах зүйлс:
                    </h4>
                    <ul className="list-disc pl-5 text-sm text-blue-700 space-y-1">
                      <li>Асуулт бүрийг [ ] хаалтад бичих</li>
                      <li>Хариулт бүрийг {} хаалтад бичих</li>
                      <li>Асуулт, хариулт хоорондоо шинэ мөрөнд бичих</li>
                      <li>Зөвхөн .txt эсвэл .docx файл оруулах</li>
                      <li>Файлын хэмжээ 5MB-с бага байх</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                  <h4 className="font-medium text-yellow-800 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    Чухал
                  </h4>
                  <ul className="mt-2 space-y-2 text-sm text-yellow-700">
                    <li>• Файлын формат буруу байвал системд хүлээн авахгүй</li>
                    <li>• Асуулт, хариулт хоорондын холбоо алдагдахгүй байх</li>
                    <li>• Хаалтуудыг [] {} зөв хэрэглэх</li>
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
