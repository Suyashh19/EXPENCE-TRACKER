import React, { useEffect } from "react";

export const Charts = () => {
  useEffect(() => {
    google.charts.load("current", { packages: ["corechart"] });
    google.charts.setOnLoadCallback(drawChart);

    function drawChart() {
      const data = google.visualization.arrayToDataTable([
        ["Country", "Mhl"],
        ["Italy", 54.8],
        ["France", 48.6],
        ["Spain", 44.4],
        ["USA", 23.9],
        ["Argentina", 14.5],
      ]);

      const options = {
        title: "World Wide Wine Production",
        is3D: true,
        backgroundColor: "transparent",
        legend: {
          position: "bottom",
          textStyle: { fontSize: 12 },
        },
        chartArea: {
          width: "90%",
          height: "80%",
        },
      };

      const chart = new google.visualization.PieChart(
        document.getElementById("myChart")
      );
      chart.draw(data, options);
    }

    // 🔥 redraw on resize (RESPONSIVE FIX)
    window.addEventListener("resize", drawChart);

    return () => {
      window.removeEventListener("resize", drawChart);
    };
  }, []);

  return (
    <div
      id="myChart"
      className="
        w-full
        max-w-xl
        mx-auto
        h-[260px]
        sm:h-[320px]
        md:h-[420px]
      "
    />
  );
};
