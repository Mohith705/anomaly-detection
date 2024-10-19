"use client";

import Head from 'next/head';
import { useState } from 'react';
import Script from 'next/script';
import JsonDisplay from '@/components/JsonDisplay';
import DataStream from '@/components/DataStreamDisplay';

export default function Home() {
  const [data, setData] = useState([]);
  const [analysis, setAnalysis] = useState({});
  const [plotLoaded, setPlotLoaded] = useState(false);
  const [buttonText, setButtonText] = useState("Click to Generate Data");

  const fetchData = async () => {
    const response = await fetch('http://localhost:8000/simulate');
    const jsonData = await response.json();
    setData(jsonData.data);  // Assuming the response has a data attribute
    return jsonData.data;
  };

  const detectAnomalies = async (data) => {
    const response = await fetch('http://localhost:8000/detect', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data })
    });
    const result = await response.json();
    setAnalysis(result);
  };

  const handleGenerateAndDetect = async () => {
    if (data.length === 0) {  // If data hasn't been generated yet
      const generatedData = await fetchData();
      setButtonText("Click to See Anomalies");
    } else {  // If data has been generated, proceed to detect anomalies
      await detectAnomalies(data);
      if (window.Plotly && data.length > 0) {
        plotData();
      }
    }
  };

  const plotData = () => {
    const trace1 = {
      x: data.map((_, index) => index), // Create an array of indices
      y: data,
      mode: 'lines',
      name: 'Data'
    };

    const trace2 = {
      x: analysis.anomalies ? analysis.anomalies.map(a => a[0]) : [],
      y: analysis.anomalies ? analysis.anomalies.map(a => a[1]) : [],
      mode: 'markers',
      marker: { color: 'red', size: 12 },
      name: 'Anomalies'
    };

    const layout = { title: 'Real-time Anomaly Detection' };
    window.Plotly.newPlot('chart', [trace1, trace2], layout);
  };

  return (
    <div className="max-h-screen flex flex-col overflow-y-auto p-[20px]">
      <h1 className='w-full text-center text-xl mb-[20px] font-bold font-[family-name:var(--font-geist-mono)]'>Anomaly Detection in Continuous Data Stream</h1>
      <Script src="https://cdn.plot.ly/plotly-latest.min.js" onLoad={() => setPlotLoaded(true)} />
      <div className='w-full h-full flex flex-col items-center justify-center text-center gap-[20px]'>
        <div className="p-4 space-y-4 overflow-y-auto">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleGenerateAndDetect}>
            {buttonText}
          </button>
        </div>
        <div className='w-full grid cols-1 md:grid-cols-2 gap-[20px]'>
          <div className='grid grid-rows-1'>
            <h2 className="text-white text-lg font-[family-name:var(--font-geist-mono)] text-center">Data Stream</h2>
            <div className=' overflow-y-auto max-h-[300px] text-left'>
              <DataStream data={data} />
            </div>
          </div>
          <div className=' '>
            <h2 className="text-white text-lg font-[family-name:var(--font-geist-mono)]">Analysis of Data Stream</h2>
            <div className=' text-left max-h-[300px] overflow-y-auto '>
              <JsonDisplay data={analysis} />
            </div>
          </div>
        </div>
      </div>
      <div className="p-4">
        <div id="chart" className="w-full h-[500px] bg-white rounded-lg shadow-lg"></div>
      </div>
    </div>
  );
}
