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
  Mic,
  Bot,
  Users,
  Star,
} from "lucide-react";

export default function AboutPage() {
  const features = [
    {
      icon: <Mic className="h-8 w-8 text-purple-500" />,
      title: "Яриа таних",
      description:
        "Англи хэл дээрх яриаг бодит хугацаанд текст болгох боломжтой",
    },
    {
      icon: <Bot className="h-8 w-8 text-blue-500" />,
      title: "AI Туслах",
      description: "Таны асуултанд хиймэл оюун ухаан ашиглан хариулт өгнө",
    },
    {
      icon: <Users className="h-8 w-8 text-green-500" />,
      title: "Хэрэглэгчийн систем",
      description: "Өөрийн файл, түүхийг хадгалах боломжтой",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow bg-gradient-to-b from-gray-50 to-white py-12">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Speech to Text AI
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Англи хэл дээрх яриаг текст болгох болон AI туслахтай харилцах
              боломжийг олгох дэвшилтэт платформ
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* Main Content */}
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            {/* Technology Stack */}
            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2 mb-6">
                <Code className="h-6 w-6 text-purple-600" />
                Ашигласан технологиуд
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                    <Server className="h-5 w-5 text-purple-500" />
                    <div>
                      <h3 className="font-medium text-gray-800">
                        Web Speech API
                      </h3>
                      <p className="text-sm text-gray-600">
                        Яриа таних үндсэн технологи
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                    <Globe className="h-5 w-5 text-blue-500" />
                    <div>
                      <h3 className="font-medium text-gray-800">Next.js</h3>
                      <p className="text-sm text-gray-600">React Framework</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                    <Database className="h-5 w-5 text-green-500" />
                    <div>
                      <h3 className="font-medium text-gray-800">Firebase</h3>
                      <p className="text-sm text-gray-600">
                        Authentication & Database
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                    <Bot className="h-5 w-5 text-red-500" />
                    <div>
                      <h3 className="font-medium text-gray-800">Gemini AI</h3>
                      <p className="text-sm text-gray-600">AI туслах систем</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Contact & Links */}
            <section className="grid md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2 mb-4">
                  <Mail className="h-6 w-6 text-purple-600" />
                  Холбоо барих
                </h2>
                <div className="space-y-3">
                  <p className="text-gray-600">
                    Санал хүсэлт, алдаа доголдол, хамтран ажиллах талаар доорх
                    хаягаар холбогдоно уу:
                  </p>
                  <a
                    href="mailto:lhagvabatulzii@gmail.com"
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    <Mail className="h-4 w-4" />
                    lhagvabatulzii@gmail.com
                  </a>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2 mb-4">
                  <Github className="h-6 w-6 text-purple-600" />
                  Нээлттэй эх
                </h2>
                <div className="space-y-3">
                  <p className="text-gray-600">
                    Энэхүү төсөл нь нээлттэй эх бөгөөд GitHub дээр байршсан. Та
                    хувь нэмрээ оруулах боломжтой:
                  </p>
                  <a
                    href="https://github.com/lhagva0430/speech-to-text"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    <Github className="h-4 w-4" />
                    GitHub Repository
                  </a>
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
