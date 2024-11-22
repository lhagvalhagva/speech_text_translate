import Footer from "../components/Footer";
import {
  Info,
  Code,
  Mail,
  Github,
  Globe,
  Server,
  Palette,
  Database,
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-8">
            <Info className="inline-block mr-2 h-8 w-8" />
            Тухай
          </h1>

          <div className="space-y-8 bg-white p-8 rounded-lg shadow-sm">
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
                <Globe className="h-6 w-6 text-purple-600" />
                Бидний тухай
              </h2>
              <p className="text-gray-600 ml-8">
                Speech to Text нь монгол хэл дээрх яриаг текст болгох үнэгүй
                онлайн програм юм. Бид монгол хэлний боловсруулалтыг хялбар,
                хүртээмжтэй болгох зорилготой ажилладаг.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
                <Code className="h-6 w-6 text-purple-600" />
                Технологи
              </h2>
              <div className="space-y-4 text-gray-600">
                <ul className="list-none pl-8 space-y-2">
                  <li className="flex items-center gap-2">
                    <Server className="h-4 w-4 text-gray-400" />
                    Web Speech API - Яриа таних
                  </li>
                  <li className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-gray-400" />
                    Next.js - Web framework
                  </li>
                  <li className="flex items-center gap-2">
                    <Palette className="h-4 w-4 text-gray-400" />
                    TailwindCSS - Загвар
                  </li>
                  <li className="flex items-center gap-2">
                    <Database className="h-4 w-4 text-gray-400" />
                    Firebase - Authentication & Database
                  </li>
                </ul>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
                <Mail className="h-6 w-6 text-purple-600" />
                Холбоо барих
              </h2>
              <div className="space-y-4 text-gray-600 ml-8">
                <p>
                  Санал хүсэлт, алдаа доголдол, хамтран ажиллах талаар доорх
                  хаягаар холбогдоно уу:
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <a
                    href="mailto:lhagvabatulzii@gmail.com"
                    className="text-blue-600 hover:underline"
                  >
                    lhagvabatulzii@gmail.com
                  </a>
                </p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
                <Github className="h-6 w-6 text-purple-600" />
                Нээлттэй эх
              </h2>
              <div className="space-y-4 text-gray-600 ml-8">
                <p>
                  Энэхүү төсөл нь нээлттэй эх бөгөөд GitHub дээр байршсан. Та
                  хувь нэмрээ оруулах боломжтой:
                </p>
                <p className="flex items-center gap-2">
                  <Github className="h-4 w-4 text-gray-400" />
                  <a
                    href="https://github.com/lhagva0430/speech-to-text"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    GitHub Repository
                  </a>
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
