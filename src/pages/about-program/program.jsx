import DowloandsButton from "@/components/dowlaond";
import Card from "@/components/scrollAboutProgram";
import { Image } from "antd";
import {
  Archive,
  Award,
  Building,
  Code,
  Code2,
  LogIn,
  LucideLayoutDashboard,
  MapIcon,
  SearchCheckIcon,
  Smartphone,
  Sparkles,
  Star,
  Users,
} from "lucide-react";

export default function Program() {
  const developers = [
    {
      name: "Mirhusanov Mirhokim Mirxasilovich",
      role: "Project Author",
      avatar: "/4.jpg",
      contribution: "Loyiha muallifi",
    },
    {
      name: "Toshpo'lotov Feruz G'olib o'g'li",
      role: "Project manager",
      avatar: "/xizmat.png",
      contribution:
        "Dasturning funksionalligi, texnik shartlari va uning belgilangan vaqtda ishlab chiqilishini boshqaruvi",
    },
    {
      name: "Anvarov Islomjon Toxir o'g'li",
      role: "Frontend developer",
      avatar: "/Islom.JPG",
      contribution:
        "Dasturning foydalanuvchiga maksimal qulaylik beruvchi dizayni va Frontend arxitekturasi || UI/UX || React || RTK Query || Tailwindcss",
    },
    {
      name: "Savriyev Sunnat Sobir o'g'li",
      role: "Backend developer",
      avatar: "/sunnatchik.jpg",
      contribution:
        "Dasturning funksionalligi, bazaviy ma'lumotlarning sinxron ishlashi logikasi va Backend texnologiyalari || Ma'lumotlar bazasi ||APIlar boshqaruvi",
    },
  ];

  // hello world

  const appPages = [
    {
      title: "Dashboard  ",
      description: "Bu sahifada deponing barcha statistikasi yuritiladi",
      icon: LucideLayoutDashboard,
      image: "/about/dash.png",
      features: [
        "Harakat tarkiblari holatini ko'rish",
        "Umumiy harakat tarkiblari holati",
        "Ehtiyot qismlar holatini ko'rish",
      ],
    },
    {
      title: "Deponi ro'yxatga olish",
      description: "Bu sahifada siz deponi ro'yxatga olishingiz mumkin",
      icon: MapIcon,
      image: "/about/depo.png",
      features: [
        "Tez va qulayligi",
        "Depo formlarni to'ldirishingiz mumkin",
        "Dashboard bilan batamon hamkorlikda ulangan sahifa",
      ],
    },
    {
      title: "Harakat tarkibini ro'yxatga olish",
      description:
        "Bu sahifa orqali harakat tarkiblarini boshqarishingiz mumkin",
      icon: Building,
      image: "/about/harakat.png",
      features: [
        "Harakat tarkibini excel va pdf variantda saqlashingiz mumkin",
        "Harakat tarkibini ro'yxatga olishingiz mumkin",
        "Harakat tarkibini qidirishingiz va filterlashingiz mumkin",
      ],
    },
    {
      title: "Ehtiyot qismlarni ro'yxatga olish",
      description: "Bu sahifa orqali ehtiyot qismlarni boshqarishingiz mumkin",
      icon: Sparkles,
      image: "/about/eh.png",
      features: [
        "Ehtiyot qismlarni birligi, nomi qaysi depoga tegishli ekanini to'ldiringiz mumkin",
        "Uni tahrirlashingiz, qidirishingiz filterlashingiz mumkin",
        "Ehtiyot qismlarni sonini qo'shishingiz mumkin va u arxivlanadi",
      ],
    },
    {
      title: "Ta'mir turini ro'yxatga olish",
      description: "Bu sahifada ta'mir turi boshqariladi",
      icon: Archive,
      image: "/about/tamir.png",
      features: [
        "Excel va PDF ko'rinishida saqlash",
        "Ta'mir turini formini to'ldirish",
        "Ta'mir turini filterlash mumkin",
      ],
    },
    {
      title: "Harakat tarkiblari haqida",
      description:
        "Bu sahifada haraka tarkiblari haqida batafsil ma'lumotlarni ko'rishingiz mumkin",
      icon: SearchCheckIcon,
      image: "/about/archive.png",
      features: [
        "Texnik ko'rik va nosozliklarni ko'rish mumkin",
        "Arxivlarni ko'rish mumkin",
        "Excel va pdf holatida saqlashingiz mumkin",
      ],
    },
    {
      title: "Texnik ko'rik jurnali",
      description: "Bu sahifada nosozlik va texnik ko'riklar boshqaradi",
      icon: LogIn,
      image: "/about/texnik.png",
      features: [
        "Texnik ko'rik va nosozliklarni qo'shishingiz mumkin",
        "Ularni osongina nazorat qilishingiz mumkin",
        "Excel va pdf formatlarni saqlashingiz mumkin",
      ],
    },
  ];

  return (
    <div className="min-h-screen ">
      {/* Hero Section with National Elements */}
      <div className="relative bg-gradient-to-r from-black via-black/80 to-black/90 rounded-3xl border border-slate-200/20 p-12 mb-12 mx-4 mt-4 overflow-hidden">
        <div
          className="absolute inset-0 
             bg-[url('/naqshtitle.png')] 
             bg-repeat 
             bg-center 
             bg-[length:400px_400px] 
             opacity-20 
             pointer-events-none
             z-0"
        ></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-indigo-600/10"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-white/10 to-blue-300/20 rounded-full blur-3xl"></div>

        <div className="relative z-10 text-center">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
              <Code className="w-8 h-8 text-white" />
            </div>
            <h1 className="font-bold text-5xl text-white">
              Depo.tm1.uz dasturi haqida
            </h1>
          </div>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
            Ushbu dastur Toshkent metropolitenining depolaridagi texnik ko'rik
            va nosozliklarni nazorat qilish uchun qo'llaniladi.
          </p>
        </div>
      </div>

      {/* Development Team Section - Apple Style */}
      <div className=" mx-auto px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <Users className="w-8 h-8 text-blue-600" />
            <h2 className="text-4xl font-bold text-gray-900">
              Dastur yaratuvchilari
            </h2>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {developers.map((dev, index) => (
            <div key={index} className="group">
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-500 hover:-translate-y-2 h-85">
                <div className="text-center">
                  <div className="relative mb-6">
                    <img
                      src={dev.avatar || "/placeholder.svg"}
                      alt={dev.name}
                      className="w-25 h-30 rounded-full mx-auto border-4 border-blue-100 group-hover:border-blue-300 transition-colors"
                    />
                    <div className="absolute -bottom-2 -right-2 bg-blue-600 rounded-full p-2">
                      <Award className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {dev.name}
                  </h3>
                  <p className="text-blue-600 font-medium mb-3">{dev.role}</p>
                  <p className="text-gray-600 text-[11px] leading-relaxed">
                    {dev.contribution}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="py-20">
        <div className="pb-10 text-center flex justify-center items-center gap-3">
          <Code2 className="w-8 h-8 text-blue-600" />
          <h2 className="text-4xl font-bold text-gray-900">
            Dasturni ishlab chiqishda quyidagi zamonaviy texnologiyalardan
            foydalanilgan.
          </h2>
        </div>
        <Card />
      </div>

      {/* App Pages Section */}
      <div className="mx-auto px-6 mb-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <Smartphone className="w-8 h-8 text-blue-600" />
            <h2 className="text-4xl font-bold text-gray-900">
              Dastur funksionalligi haqida
            </h2>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Har bir sahifa o'ziga xos funksiyalarga va qulay interfeysga ega
          </p>
        </div>

        <div className="space-y-12">
          {appPages.map((page, index) => (
            <div
              key={index}
              className={`flex flex-col lg:flex-row items-center gap-12 ${
                index % 2 === 1 ? "lg:flex-row-reverse" : ""
              }`}
            >
              <div className="flex-1">
                <div className="">
                  <Image
                    src={page.image || "/placeholder.svg"}
                    alt={page.title}
                    className="w-full h-64 object-cover rounded-2xl hover:rounded-2xl overflow-hidden"
                  />
                </div>
              </div>

              <div className="flex-1">
                <div className="inline-flex items-center gap-3 mb-4">
                  <div className="p-3 bg-blue-100 rounded-2xl">
                    <page.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900">
                    {page.title}
                  </h3>
                </div>

                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  {page.description}
                </p>

                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-500" />
                    Asosiy imkoniyatlar:
                  </h4>
                  <ul className="space-y-2">
                    {page.features.map((feature, featureIndex) => (
                      <li
                        key={featureIndex}
                        className="flex items-center gap-3 text-gray-600"
                      >
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full flex justify-center py-10">
        <DowloandsButton />
      </div>

      {/* Footer with National Pride */}
      {/* <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-t-3xl mx-4 p-8">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 mb-4">
            <Heart className="w-6 h-6 text-red-400" />
            <p className="text-white text-lg">
              O'zbekiston bilan faxrlanib yaratildi
            </p>
            <Heart className="w-6 h-6 text-red-400" />
          </div>
          <p className="text-blue-100">
            Milliy qadriyatlar va zamonaviy texnologiyalarning uyg'unligi
          </p>
        </div>
      </div> */}
    </div>
  );
}
