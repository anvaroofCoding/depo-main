import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store";
import { Toaster } from "sonner";

// 🔹 Sahifalar (Pages)
import App from "@/App";
import Program from "@/pages/about-program/program";
import LoginForm from "@/pages/Auth/login";
import Dashboard from "@/pages/dashboard/dashboard";
import DepTable from "@/pages/royxatga-olish/deponi-royxatlas/deponi-royxatlash";
import Ehtiyotqismlari from "@/pages/royxatga-olish/ehtiyot-qismlari/ehtiyot-qismlari";
import Harakattarkibi from "@/pages/royxatga-olish/harakat-tarkibi/harakat-tarkibi";
import TamirlashTuri from "@/pages/royxatga-olish/ta'mirlash-turi/tamirlash-turi";
import NosozAdd from "@/pages/texnik-korik-jurnali/nosozAdd/nosozAdd";
import TexnikAdd from "@/pages/texnik-korik-jurnali/texnikAdd/TexnikAdd";
import TexnikAddDetails from "@/pages/texnik-korik-jurnali/texnikAdd/texnikAddDetails";
import EhtiyotDetail from "@/pages/royxatga-olish/ehtiyot-qismlari/depoDetail";
import KunlikYurish from "@/pages/royxatga-olish/harakat-tarkibi/harakat-tarkibi-detail";
import ServiceTypeAdd from "@/pages/royxatga-olish/nosozlik-add-turi/ServiceTypeAdd";
import NosozDetails from "@/pages/texnik-korik-jurnali/nosozAdd/nosozDetails";
import Depos from "@/pages/depos/depos"; // 🔹 Dinamik depo sahifasi

// 🔹 RTK Query hook (depolar ro‘yxatini olish)
import { useGetDepQuery } from "@/services/api";
import HarakatTarkibiHaqida from "./pages/depos/harakat-tarkibi-haqida/aboutHarakatTarkibi";
import TexnikKoriks from "./pages/depos/harakat-tarkibi-haqida/texnik-koriks/texnik-korik";
import Nosozliks from "./pages/depos/harakat-tarkibi-haqida/nosozliks/nosozliks";
import Calendars from "./pages/jadval/calendar";
import TexnikJadval from "./pages/texnik-jadval/texnik_jadval";
import AllTexnikKoriklar from "./pages/allTexnik/allTexniks";
import Notifications from "./pages/notiofications/notiofication";
import Mashrut from "./pages/royxatga-olish/mashrut/mashrut";
import JadvalIstory from "./pages/jadval-istory/Jadval-istoriy";

// 🔹 Dinamik Router komponenti
function DynamicRouter() {
  const { data: dataDepo, isLoading, isError } = useGetDepQuery();

  // 🔸 Yuklanish payti
  if (isLoading) {
    return <></>;
  }

  // 🔸 Xatolik holati
  if (isError) {
    return (
      <div className="w-full h-screen flex items-center justify-center text-red-600">
        Xatolik yuz berdi, serverdan depo ma'lumotlari olinmadi!
      </div>
    );
  }

  // 🔸 Depolar asosida dinamik yo‘llarni yaratish
  const depoRoutes =
    dataDepo?.results?.map((item) => {
      const cleanPath = item.depo_nomi
        ?.toLowerCase()
        ?.replace(/\s+/g, "-") // bo‘sh joylarni "-"
        ?.replace(/[^\w-]/g, ""); // belgilarni tozalash

      return {
        // Masalan: /depo-chilonzor/:id
        path: `/depo-${cleanPath}/:id`,
        element: <Depos />, // ID ni useParams orqali oladi
      };
    }) || [];

  // 🔹 Asosiy Router tuzilmasi
  const router = createBrowserRouter([
    {
      path: "/",
      element: <App />,
      children: [
        { path: "/", element: <Dashboard /> },
        { path: "/dastur-haqida", element: <Program /> },
        { path: "/deponi-royxatga-olish", element: <DepTable /> },
        {
          path: "/ehtiyot-qismlarini-royxatga-olish",
          element: <Ehtiyotqismlari />,
        },
        {
          path: "/harakat-tarkibini-royxatga-olish",
          element: <Harakattarkibi />,
        },
        { path: "/tamirlash-turi-royxatga-olish", element: <TamirlashTuri /> },
        { path: "/texnik-ko'rik-qoshish", element: <TexnikAdd /> },
        { path: "/nosozliklar-qoshish", element: <NosozAdd /> },
        {
          path: "/texnik-ko'rik-qoshish/texnik-korik-details/:ide/",
          element: <TexnikAddDetails />,
        },
        {
          path: "/ehtiyot-qismlarini-royxatga-olish/details/:id",
          element: <EhtiyotDetail />,
        },
        {
          path: "/harakat-tarkibini-royxatga-olish/KunlikYurish/:id",
          element: <KunlikYurish />,
        },
        { path: "/service-type-add", element: <ServiceTypeAdd /> },
        { path: "/defective-details/:defective_id", element: <NosozDetails /> },
        {
          path: "/harakat-tarkibi-haqida/:id/",
          element: <HarakatTarkibiHaqida />,
        },
        {
          path: "/harakat-tarkibi-haqida/:id/:sub_id",
          element: <TexnikKoriks />,
        },
        {
          path: "/nosozliklar-data/:id",
          element: <Nosozliks />,
        },
        {
          path: "/Kalendar",
          element: <Calendars />,
        },
        {
          path: "/Texnik-Jadval",
          element: <TexnikJadval />,
        },
        {
          path: "/hozirgi-texnik-ko'riklar",
          element: <AllTexnikKoriklar />,
        },
        {
          path: "/hozirgi-nosozliklar",
          element: <AllTexnikKoriklar />,
        },
        {
          path: "/Notifications",
          element: <Notifications />,
        },
        {
          path: "/mashrutlarni-ro'yxatga-olish",
          element: <Mashrut />,
        },
        {
          path: "/jadvallar-tarixi",
          element: <JadvalIstory />,
        },

        // 🔹 Backenddan kelgan depo sahifalari (dinamik)
        ...depoRoutes,
      ],
    },
    { path: "/login", element: <LoginForm /> },
  ]);

  // 🔹 RouterProvider
  return <RouterProvider router={router} />;
}

// 🔹 Root render (barchasi shu faylda)
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <Toaster richColors position="bottom-center" />
      <DynamicRouter />
    </Provider>
  </StrictMode>
);
