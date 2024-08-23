import React from "react";
import DailySalesChart from "./components/DailySalesChart";
import QuarterlySalesChart from "./components/QuarterlySalesChart";
import YearlySalesChart from "./components/YearlySalesChart";
import MonthlySalesChart from "./components/MonthlySalesChart";
import MonthlyGrowthRateChart from "./components/MonthlyGrowthRateChart";
import NewCustomersChart from "./components/NewCustomersChart";
import RepeatCustomersChart from "./components/RepeatCustomersChart";
import CustomerLifetimeValueChart from "./components/CustomerLifetimeValueChart";

function App() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        padding: "20px",
        boxSizing: "border-box",
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
        Sales Dashboard
      </h1>
      <div style={{ width: "100%", maxWidth: "1200px", padding: "0 20px" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-between",
            gap: "20px",
            marginBottom: "20px",
          }}
        >
          <div
            style={{
              flex: "1 1 100%",
              maxWidth: "600px",
              marginBottom: "50px",
            }}
          >
            <QuarterlySalesChart />
          </div>
          <div
            style={{
              flex: "1 1 100%",
              maxWidth: "600px",
              marginBottom: "-400px",
            }}
          >
            <YearlySalesChart />
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-between",
            gap: "20px",
            marginBottom: "20px",
          }}
        >
          <div
            style={{
              flex: "1 1 100%",
              maxWidth: "1000px",
              marginBottom: "20px",
            }}
          >
            <DailySalesChart />
          </div>
          <div
            style={{
              flex: "1 1 100%",
              maxWidth: "1000px",
              marginBottom: "20px",
            }}
          >
            <MonthlySalesChart />
          </div>
          <div
            style={{
              flex: "1 1 100%",
              maxWidth: "1000px",
              marginBottom: "20px",
            }}
          >
            <MonthlyGrowthRateChart />
          </div>
          <div
            style={{
              flex: "1 1 100%",
              maxWidth: "1000px",
              marginBottom: "80px",
            }}
          >
            <NewCustomersChart />
          </div>
          <div
            style={{
              flex: "1 1 100%",
              maxWidth: "1000px",
              marginBottom: "20px",
            }}
          >
            <RepeatCustomersChart />
          </div>
          <div
            style={{
              flex: "1 1 100%",
              maxWidth: "1000px",
              marginBottom: "20px",
            }}
          >
            <CustomerLifetimeValueChart />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
