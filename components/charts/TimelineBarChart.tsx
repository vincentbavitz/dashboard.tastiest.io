import BarChart from './BarChart';

export default function TimelineBarChart() {
  const covers = 0;

  return (
    <div className="px-2 py-4 bg-white rounded-xl">
      <h4 className="px-4 text-xl text-primary">
        {covers} <span className="text-sm">covers</span>
      </h4>

      <div className="relative w-full aspect-w-16 aspect-h-7">
        <BarChart />
      </div>
    </div>
  );
}
