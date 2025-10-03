import { useGetharakatGetQuery } from "@/services/api";
import { Cog, Settings2, ShieldCheck, TrainFront } from "lucide-react";
import { Loader2 } from "lucide-react";
import CountUp from "react-countup";
import Loading from "./loading/loading";

export default function FirstDashboard() {
  const { data: harakatTarkibi, isLoading: harakatLoad } =
    useGetharakatGetQuery();

  if (harakatLoad) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <Loading />
      </div>
    );
  }

  const nosozlikFilter = harakatTarkibi?.results?.filter((item) => {
    return item.holati == "Nosozlikda";
  });
  const sozlikFilter = harakatTarkibi?.results?.filter((item) => {
    return item.holati == "Soz_holatda";
  });
  const texnik = harakatTarkibi?.results?.filter((item) => {
    return item.holati == "Texnik_korikda";
  });

  console.log(sozlikFilter);

  return (
    <div className="w-full">
      {/* Harakat tarkiblari */}
      <div className="w-full">
        <h1 className="text-4xl pb-5 font-bold w-full text-start">Dashboard</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {/* Stat Card */}
        <div className="bg-white rounded-2xl shadow-md p-5 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-medium text-gray-500">
                Barcha harakat tarkibi soni
              </h2>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                <CountUp end={harakatTarkibi?.count} duration={5} />
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <TrainFront className="w-7 h-7 text-blue-600" />
            </div>
          </div>
        </div>
        {/* nosoz */}
        <div className="bg-white rounded-2xl shadow-md p-5 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-medium text-gray-500">Nosozlikda</h2>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                <CountUp end={nosozlikFilter?.length} duration={5} />
              </p>
            </div>
            <div className="bg-red-100 p-3 rounded-full">
              <Settings2 className="w-7 h-7 text-red-600" />
            </div>
          </div>
        </div>
        {/* soz */}
        <div className="bg-white rounded-2xl shadow-md p-5 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-medium text-gray-500">Soz holatda</h2>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                <CountUp end={sozlikFilter?.length} duration={5} />
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <ShieldCheck className="w-7 h-7 text-green-600" />
            </div>
          </div>
        </div>
        {/* texnik */}
        <div className="bg-white rounded-2xl shadow-md p-5 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-medium text-gray-500">
                Texnik korikda
              </h2>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                <CountUp end={texnik?.length} duration={5} />
              </p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <Cog className="w-7 h-7 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
