import React, { useEffect } from "react";

export const Charts = () => {
  useEffect(()=>{
    google.charts.load('current', { 'packages': ['corechart'] });
    google.charts.setOnLoadCallback(drawChart);

    function drawChart() {

      // Set Data
      const data = google.visualization.arrayToDataTable([
        ['Contry', 'Mhl'],
        ['Italy', 54.8],
        ['France', 48.6],
        ['Spain', 44.4],
        ['USA', 23.9],
        ['Argentina', 14.5]
      ]);

      // Set Options
      const options = {
        title: 'World Wide Wine Production',
        is3D: true
      };

      // Draw
      const chart = new google.visualization.PieChart(document.getElementById('myChart'));
      chart.draw(data, options);

    }
  },[])
  return (
    <div id="myChart" style="width:100%; max-width:600px; height:500px;"></div>
  )
}
// const Charts = () => {
//   return (
//     <div className="w-full h-full flex flex-col justify-end gap-2 pb-4 px-4">
//       <div className="flex items-end justify-between h-48 gap-2">
//         {/* Mock Bars to simulate a chart */}
//         {[40, 70, 45, 90, 65, 80, 50, 95, 60, 75, 40, 85].map((height, i) => (
//           <div key={i} className="flex-1 flex flex-col items-center gap-2">
//             <div
//               style={{ height: `${height}%` }}
//               className="w-full max-w-[12px] rounded-full bg-gradient-to-t from-blue-600/40 to-blue-400 shadow-[0_0_15px_rgba(37,99,235,0.3)] transition-all hover:scale-110"
//             ></div>
//             <span className="text-[10px] font-bold text-slate-300">M{i+1}</span>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Charts;