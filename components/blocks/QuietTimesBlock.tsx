import { HorusRestaurantEnchanted } from 'contexts/auth';
import React from 'react';
import { QuietTimesProvider } from './QuietTimesSelector/QuietTimesContext';

interface Props {
  restaurantData: HorusRestaurantEnchanted;
}

export default function QuietTimesBlock(props: Props) {
  return (
    <QuietTimesProvider>
      {/* <QuietTimesBlockInner {...props} /> */}
      <></>
    </QuietTimesProvider>
  );
}

// function QuietTimesBlockInner(props: Props) {
//   const { restaurantData } = props;
//   const [quietTimesSelectorOpen, setQuietTimesSelectorOpen] = useState(false);

//   const { data: quietTimes } = useSWR<WeekQuietTimes>(
//     `${LocalEndpoint.GET_QUIET_TIMES}?restaurantId=${restaurantData.details.id}`,
//     {
//       refreshInterval: 30000,
//       refreshWhenHidden: true,
//       initialData: restaurantData.metrics?.quietTimes,
//     },
//   );

//   return (
//     <>
//       <QuietTimesSelector
//         restaurantId={restaurantData.details.id}
//         show={quietTimesSelectorOpen}
//         close={() => setQuietTimesSelectorOpen(false)}
//       />

//       <BlockTemplate
//         title="Quiet Times"
//         theme="alt-1"
//         icon={EditOutlined}
//         onIconClick={() => setQuietTimesSelectorOpen(true)}
//       >
//         <div className="flex flex-col">
//           {quietTimes ? (
//             Object.entries(quietTimes).map(([key, day]) => {
//               return day.active ? (
//                 <div
//                   key={key}
//                   className="flex justify-between py-2 text-base text-alt"
//                 >
//                   <div className="font-medium">
//                     {TIME.DAYS_OF_THE_WEEK[key]}
//                   </div>
//                   <div className="">
//                     {minsIntoHumanTime(day.range[0])}
//                     <div className="inline px-1 font-mono">→</div>
//                     {minsIntoHumanTime(day.range[1])}
//                   </div>
//                 </div>
//               ) : null;
//             })
//           ) : (
//             <div className="flex items-center justify-center h-20">
//               No quiet times set.
//             </div>
//           )}
//         </div>
//       </BlockTemplate>
//     </>
//   );
// }
