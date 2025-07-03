// components/CryptoChart.tsx
'use client';

import { createChart, ColorType, IChartApi, BaselineSeries, MouseEventParams } from 'lightweight-charts';
import React, { useEffect, useRef, useState } from 'react';

interface CryptoChartProps {
  coinId: string;
  chartColor: string;
  coinName: string;
  coinIconUrl: string;
}

interface TooltipData {
  time: string;
  price: string;
  visible: boolean;
  x: number;
  y: number;
}

export const CryptoChart: React.FC<CryptoChartProps> = ({ coinId, chartColor, coinName, coinIconUrl }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const [currentPrice, setCurrentPrice] = useState<string | null>(null);
  const [priceChange, setPriceChange] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [tooltip, setTooltip] = useState<TooltipData>({
    time: '',
    price: '',
    visible: false,
    x: 0,
    y: 0
  });

  useEffect(() => {
    if (!chartContainerRef.current) {
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch 1 day data with hourly granularity for full day price
        const response = await fetch(`https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=1`);
        const data = await response.json();
        
        const chartData = data.prices.map(([timestamp, price]: [number, number]) => ({
          time: Math.floor(timestamp / 1000),
          value: price,
        }));

        if (chartData.length > 0) {
            const latestPrice = chartData[chartData.length - 1].value;
            const openingPrice = chartData[0].value; // Fixed: use first price, not chartData.value
            const change = ((latestPrice - openingPrice) / openingPrice) * 100;
            
            setCurrentPrice(latestPrice.toLocaleString('en-US', { 
              style: 'currency', 
              currency: 'USD',
              minimumFractionDigits: 4,
              maximumFractionDigits: 4
            }));
            setPriceChange(change);

            // Calculate dynamic baseline
            const prices = chartData.map((d : {value: number}) => d.value);
            const minPrice = Math.min(...prices);
            const maxPrice = Math.max(...prices);
            const baselinePrice = (minPrice + maxPrice) / 2;

            // Determine chart color based on price change (green for up, red for down)
            const isPositive = change >= 0;
            const dynamicColor = isPositive ? '#10b981' : '#ef4444'; // Green or Red

            if (!chartRef.current) {
              const chart = createChart(chartContainerRef.current!, {
                  width: chartContainerRef.current!.clientWidth,
                  height: 200,
                  layout: {
                      background: { type: ColorType.Solid, color: 'transparent' },
                      textColor: 'rgba(255, 255, 255, 0.9)',
                  },
                  grid: { vertLines: { visible: false }, horzLines: { visible: false } },
                  rightPriceScale: { visible: false },
                  timeScale: { visible: false },
                  crosshair: { mode: 0 }
              });
              chartRef.current = chart;
              
              const baselineSeries = chart.addSeries(BaselineSeries, { 
                baseValue: { type: 'price', price: baselinePrice },
                topLineColor: dynamicColor, 
                topFillColor1: `${dynamicColor}40`,
                topFillColor2: `${dynamicColor}10`,
                bottomLineColor: dynamicColor, 
                bottomFillColor1: `${dynamicColor}10`, 
                bottomFillColor2: `${dynamicColor}40` 
              });
              baselineSeries.setData(chartData);
              chart.timeScale().fitContent();

              chart.subscribeCrosshairMove((param: MouseEventParams) => {
                if (!param.time || !param.point) {
                  setTooltip(prev => ({ ...prev, visible: false }));
                  return;
                }

                const data = param.seriesData.get(baselineSeries);
                if (data && 'value' in data) {
                  const price = data.value as number;
                  const time = new Date((param.time as number) * 1000);
                  
                  setTooltip({
                    time: time.toLocaleTimeString('en-US', { 
                      hour: 'numeric', 
                      minute: '2-digit',
                      hour12: true 
                    }),
                    price: price.toLocaleString('en-US', { 
                      style: 'currency', 
                      currency: 'USD',
                      minimumFractionDigits: 4,
                      maximumFractionDigits: 4
                    }),
                    visible: true,
                    x: param.point.x,
                    y: param.point.y
                  });
                }
              });
            }
        }
      } catch (error) {
        console.error("Failed to fetch chart data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    const resizeObserver = new ResizeObserver(entries => {
        for (const entry of entries) {
            if (entry.target === chartContainerRef.current && chartRef.current) {
                chartRef.current.applyOptions({ width: entry.contentRect.width });
            }
        }
    });

    resizeObserver.observe(chartContainerRef.current);

    return () => {
      resizeObserver.disconnect();
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }
    };
  }, [coinId, chartColor]);

  return (
    <div className="bg-gray-800/50 border border-gray-700 p-4 rounded-xl flex flex-col relative">
        <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
                <img 
                  src={coinIconUrl} 
                  alt={coinName} 
                  className="w-8 h-8"
                  onError={(e) => {
                    // Fallback for broken images
                    e.currentTarget.src = `https://via.placeholder.com/32x32/6b7280/ffffff?text=${coinName.charAt(0)}`;
                  }}
                />
                <span className="font-bold text-lg">{coinName}</span>
            </div>
            {priceChange !== null && (
                <span className={`text-sm font-semibold ${priceChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}%
                </span>
            )}
        </div>
        <div className="font-mono text-3xl font-semibold mb-2 h-9">
            {loading ? <div className="animate-pulse bg-gray-700 h-8 w-40 rounded-md"></div> : currentPrice}
        </div>
        <div ref={chartContainerRef} className="w-full h-[200px] relative" />
        
        {/* Hover Tooltip */}
        {tooltip.visible && (
          <div 
            className="absolute z-10 bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 pointer-events-none"
            style={{
              left: `${tooltip.x + 10}px`,
              top: `${tooltip.y - 60}px`,
              transform: tooltip.x > 200 ? 'translateX(-100%)' : 'none'
            }}
          >
            <div className="flex items-center gap-2 text-white">
              <div className={`w-2 h-2 rounded-full ${priceChange !== null && priceChange >= 0 ? 'bg-green-400' : 'bg-red-400'}`}></div>
              <span className="text-sm font-medium">{tooltip.time}</span>
            </div>
            <div className="text-lg font-bold text-white mt-1">
              {tooltip.price}
            </div>
          </div>
        )}
    </div>
  );
};
