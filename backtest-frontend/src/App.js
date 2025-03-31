import React, { useState } from 'react';

function App() {
  const [monthlyInvestment, setMonthlyInvestment] = useState(10000);
  const [years, setYears] = useState(10);
  const [ticker, setTicker] = useState("QLD");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3000/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ monthly_investment: monthlyInvestment, years, ticker })
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("エラー:", error);
    }
    setLoading(false);
  }
  
  return (
    <div style={{ padding: "20px" }}>
      <h1>積立シミュレーション</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>毎月の投資額（円）:</label>
          <input 
            type="number" 
            value={monthlyInvestment} 
            onChange={(e) => setMonthlyInvestment(e.target.value)} 
          />
        </div>
        <div>
          <label>投資期間（年）:</label>
          <input 
            type="number" 
            value={years} 
            onChange={(e) => setYears(e.target.value)} 
          />
        </div>
        <div>
          <label>インデックスティッカー:</label>
          <input 
            type="text" 
            value={ticker} 
            onChange={(e) => setTicker(e.target.value)} 
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "計算中..." : "シミュレーション開始"}
        </button>
      </form>
      {result && (
        <div>
          <h2>シミュレーション結果</h2>
          {result.error ? (
            <p>エラー: {result.error}</p>
          ) : (
            <ul>
              <li>投資総額: {result.total_invested} 円</li>
              <li>保有単位数: {result.total_units}</li>
              <li>最終資産価値: {result.final_value} 円</li>
              <li>ティッカー: {result.ticker}</li>
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default App;

// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;
