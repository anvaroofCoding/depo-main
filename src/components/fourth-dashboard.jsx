import { useGetStatisQuery } from "@/services/api";

export default function FourthDashboard() {
  const { data, isLoading } = useGetStatisQuery();

  if (isLoading) {
    return <div></div>;
  }

  console.log(data.last_10_nosozlik);

  return <div>fourth-dashboard</div>;
}
