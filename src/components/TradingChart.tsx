import React, { useRef, useEffect, useState, useMemo } from 'react';
import { Candle } from '../types/exchange';

interface TradingChartProps {
  candles: Candle[];
  symbol: string;
  pricePrecision: number;
  timeframe: string;
  onTimeframeChange: (tf: string) => void;
  onPriceClick?: (price: number) => void;
}

export const TradingChart: React.FC<TradingChartProps> = ({
  candles,
  symbol,
  pricePrecision,
  timeframe,
  onTimeframeChange,
  onPriceClick,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [chartType, setChartType] = useState<'candles' | 'line' | 'area'>('candles');
  const [showMA7, setShowMA7] = useState<boolean>(true);
  const [showMA25, setShowMA25] = useState<boolean>(true);
  const [showVolume, setShowVolume] = useState<boolean>(true);

  // Hover crosshair state
  const [hoveredCandle, setHoveredCandle] = useState<{
    candle: Candle;
    x: number;
    y: number;
    ma7?: number;
    ma25?: number;
    priceAtCursor: number;
  } | null>(null);

  // Calculate Moving Averages
  const ma7Values = useMemo(() => {
    return candles.map((_, idx, arr) => {
      if (idx < 6) return null;
      const slice = arr.slice(idx - 6, idx + 1);
      const avg = slice.reduce((sum, c) => sum + c.close, 0) / 7;
      return avg;
    });
  }, [candles]);

  const ma25Values = useMemo(() => {
    return candles.map((_, idx, arr) => {
      if (idx < 24) return null;
      const slice = arr.slice(idx - 24, idx + 1);
      const avg = slice.reduce((sum, c) => sum + c.close, 0) / 25;
      return avg;
    });
  }, [candles]);

  // Canvas drawing loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || candles.length === 0) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high DPI displays
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;

    // Layout partitions:
    // Top 72% for Price / Candles, Bottom 28% for Volume
    const rightPadding = 65; // Price axis width
    const bottomPadding = 24; // Time axis height
    const chartWidth = width - rightPadding;
    const totalPlotHeight = height - bottomPadding;
    const pricePlotHeight = showVolume ? totalPlotHeight * 0.74 : totalPlotHeight;
    const volumePlotTop = pricePlotHeight + 8;
    const volumePlotHeight = totalPlotHeight - volumePlotTop;

    // Clear background
    ctx.fillStyle = '#0B1020';
    ctx.fillRect(0, 0, width, height);

    // Compute Min & Max prices
    let minPrice = Infinity;
    let maxPrice = -Infinity;
    let maxVolume = 0;

    candles.forEach((c) => {
      if (c.low < minPrice) minPrice = c.low;
      if (c.high > maxPrice) maxPrice = c.high;
      if (c.volume > maxVolume) maxVolume = c.volume;
    });

    if (minPrice === maxPrice) {
      minPrice -= minPrice * 0.01;
      maxPrice += maxPrice * 0.01;
    }

    // Add 2% padding top/bottom to price scale
    const pricePadding = (maxPrice - minPrice) * 0.04;
    const paddedMin = minPrice - pricePadding;
    const paddedMax = maxPrice + pricePadding;
    const priceRange = paddedMax - paddedMin || 1;

    // Coordinate mapping helpers
    const getY = (price: number) => {
      const normalized = (price - paddedMin) / priceRange;
      return pricePlotHeight - normalized * pricePlotHeight;
    };

    const count = candles.length;
    const candleWidth = Math.max(3, (chartWidth / count) * 0.72);
    const stepX = chartWidth / count;

    // Draw horizontal grid lines and price labels
    const gridRows = 6;
    ctx.strokeStyle = '#1E293B';
    ctx.lineWidth = 1;
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.fillStyle = '#64748B';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';

    for (let i = 0; i <= gridRows; i++) {
      const y = (pricePlotHeight / gridRows) * i;
      const price = paddedMax - (priceRange / gridRows) * i;

      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(chartWidth, y);
      ctx.stroke();

      // Price text on right axis
      ctx.fillText(price.toFixed(pricePrecision), chartWidth + 6, y);
    }

    // Draw vertical grid lines and time labels
    const timeCols = 6;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    for (let i = 0; i <= timeCols; i++) {
      const idx = Math.floor((count - 1) * (i / timeCols));
      const x = idx * stepX + stepX / 2;
      const candle = candles[idx];

      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, totalPlotHeight);
      ctx.stroke();

      if (candle) {
        const d = new Date(candle.time);
        const timeStr = `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
        ctx.fillText(timeStr, x, totalPlotHeight + 6);
      }
    }

    // Draw Volume Bars
    if (showVolume && maxVolume > 0) {
      candles.forEach((c, idx) => {
        const isUp = c.close >= c.open;
        const x = idx * stepX + (stepX - candleWidth) / 2;
        const barHeight = (c.volume / maxVolume) * volumePlotHeight;
        const y = totalPlotHeight - barHeight;

        ctx.fillStyle = isUp ? 'rgba(16, 185, 129, 0.25)' : 'rgba(239, 68, 68, 0.25)';
        ctx.fillRect(x, y, candleWidth, barHeight);
      });
    }

    // Draw Candlesticks or Area / Line
    if (chartType === 'candles') {
      candles.forEach((c, idx) => {
        const isUp = c.close >= c.open;
        const x = idx * stepX + (stepX - candleWidth) / 2;
        const centerX = x + candleWidth / 2;

        const openY = getY(c.open);
        const closeY = getY(c.close);
        const highY = getY(c.high);
        const lowY = getY(c.low);

        const candleTop = Math.min(openY, closeY);
        const candleHeight = Math.max(1.5, Math.abs(closeY - openY));

        ctx.strokeStyle = isUp ? '#10B981' : '#EF4444';
        ctx.fillStyle = isUp ? '#10B981' : '#EF4444';

        // Wick
        ctx.beginPath();
        ctx.lineWidth = 1.2;
        ctx.moveTo(centerX, highY);
        ctx.lineTo(centerX, lowY);
        ctx.stroke();

        // Body
        ctx.fillRect(x, candleTop, candleWidth, candleHeight);
      });
    } else {
      // Line or Area
      ctx.beginPath();
      candles.forEach((c, idx) => {
        const x = idx * stepX + stepX / 2;
        const y = getY(c.close);
        if (idx === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });

      if (chartType === 'area') {
        const lastX = (count - 1) * stepX + stepX / 2;
        ctx.lineTo(lastX, pricePlotHeight);
        ctx.lineTo(stepX / 2, pricePlotHeight);
        ctx.closePath();

        const gradient = ctx.createLinearGradient(0, 0, 0, pricePlotHeight);
        gradient.addColorStop(0, 'rgba(59, 130, 246, 0.35)');
        gradient.addColorStop(1, 'rgba(59, 130, 246, 0.01)');
        ctx.fillStyle = gradient;
        ctx.fill();

        // Top line stroke
        ctx.beginPath();
        candles.forEach((c, idx) => {
          const x = idx * stepX + stepX / 2;
          const y = getY(c.close);
          if (idx === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.strokeStyle = '#3B82F6';
        ctx.lineWidth = 2;
        ctx.stroke();
      } else {
        ctx.strokeStyle = '#3B82F6';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    }

    // Draw MA7 line
    if (showMA7) {
      ctx.beginPath();
      ctx.strokeStyle = '#F59E0B'; // Amber
      ctx.lineWidth = 1.4;
      let started = false;

      ma7Values.forEach((val, idx) => {
        if (val !== null) {
          const x = idx * stepX + stepX / 2;
          const y = getY(val);
          if (!started) {
            ctx.moveTo(x, y);
            started = true;
          } else {
            ctx.lineTo(x, y);
          }
        }
      });
      ctx.stroke();
    }

    // Draw MA25 line
    if (showMA25) {
      ctx.beginPath();
      ctx.strokeStyle = '#06B6D4'; // Cyan
      ctx.lineWidth = 1.4;
      let started = false;

      ma25Values.forEach((val, idx) => {
        if (val !== null) {
          const x = idx * stepX + stepX / 2;
          const y = getY(val);
          if (!started) {
            ctx.moveTo(x, y);
            started = true;
          } else {
            ctx.lineTo(x, y);
          }
        }
      });
      ctx.stroke();
    }

    // Draw Current Last Price marker on right axis
    if (candles.length > 0) {
      const last = candles[candles.length - 1];
      const y = getY(last.close);
      const isUp = last.close >= last.open;

      ctx.fillStyle = isUp ? '#10B981' : '#EF4444';
      ctx.fillRect(chartWidth + 1, y - 9, rightPadding - 2, 18);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 10px "JetBrains Mono", monospace';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(last.close.toFixed(pricePrecision), chartWidth + 5, y);

      // Horizontal dashed line across chart
      ctx.strokeStyle = isUp ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)';
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(chartWidth, y);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Draw Hover Crosshair
    if (hoveredCandle) {
      ctx.strokeStyle = '#94A3B8';
      ctx.lineWidth = 0.8;
      ctx.setLineDash([4, 4]);

      // Vertical line
      ctx.beginPath();
      ctx.moveTo(hoveredCandle.x, 0);
      ctx.lineTo(hoveredCandle.x, totalPlotHeight);
      ctx.stroke();

      // Horizontal line
      ctx.beginPath();
      ctx.moveTo(0, hoveredCandle.y);
      ctx.lineTo(chartWidth, hoveredCandle.y);
      ctx.stroke();
      ctx.setLineDash([]);

      // Floating price tag on right axis
      ctx.fillStyle = '#1E293B';
      ctx.fillRect(chartWidth + 1, hoveredCandle.y - 9, rightPadding - 2, 18);
      ctx.fillStyle = '#F8FAFC';
      ctx.fillText(hoveredCandle.priceAtCursor.toFixed(pricePrecision), chartWidth + 5, hoveredCandle.y);
    }
  }, [
    candles,
    chartType,
    showMA7,
    showMA25,
    showVolume,
    hoveredCandle,
    ma7Values,
    ma25Values,
    pricePrecision,
  ]);

  // Mouse move handler for crosshair & tooltip
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || candles.length === 0) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const rightPadding = 65;
    const chartWidth = rect.width - rightPadding;
    if (mouseX < 0 || mouseX > chartWidth || mouseY < 0 || mouseY > rect.height) {
      setHoveredCandle(null);
      return;
    }

    const stepX = chartWidth / candles.length;
    const candleIdx = Math.min(candles.length - 1, Math.max(0, Math.floor(mouseX / stepX)));
    const candle = candles[candleIdx];

    // Compute price at cursor
    let minPrice = Infinity;
    let maxPrice = -Infinity;
    candles.forEach((c) => {
      if (c.low < minPrice) minPrice = c.low;
      if (c.high > maxPrice) maxPrice = c.high;
    });
    const pricePadding = (maxPrice - minPrice) * 0.04;
    const paddedMin = minPrice - pricePadding;
    const paddedMax = maxPrice + pricePadding;
    const pricePlotHeight = showVolume ? (rect.height - 24) * 0.74 : rect.height - 24;

    const normalizedY = (pricePlotHeight - mouseY) / pricePlotHeight;
    const priceAtCursor = paddedMin + normalizedY * (paddedMax - paddedMin);

    const candleX = candleIdx * stepX + stepX / 2;

    setHoveredCandle({
      candle,
      x: candleX,
      y: mouseY,
      ma7: ma7Values[candleIdx] ?? undefined,
      ma25: ma25Values[candleIdx] ?? undefined,
      priceAtCursor,
    });
  };

  const handleMouseLeave = () => {
    setHoveredCandle(null);
  };

  const handleCanvasClick = () => {
    if (hoveredCandle && onPriceClick) {
      onPriceClick(hoveredCandle.candle.close);
    }
  };

  const activeCandle = hoveredCandle ? hoveredCandle.candle : candles[candles.length - 1];
  const activeMA7 = hoveredCandle?.ma7 ?? ma7Values[ma7Values.length - 1];
  const activeMA25 = hoveredCandle?.ma25 ?? ma25Values[ma25Values.length - 1];

  return (
    <div ref={containerRef} className="flex h-full flex-col bg-[#0B1020] text-slate-200">
      {/* Chart Toolbar */}
      <div className="flex flex-wrap items-center justify-between border-b border-slate-800 bg-[#0E1528] px-3 py-2 text-xs">
        {/* Left: Timeframe selectors (Segmented controls) */}
        <div className="flex items-center gap-1">
          <span className="text-[11px] font-medium text-slate-400 mr-1 hidden sm:inline">Time:</span>
          {['1m', '5m', '15m', '1h', '4h', '1D'].map((tf) => (
            <button
              key={tf}
              onClick={() => onTimeframeChange(tf)}
              className={`px-2 py-1 text-xs font-mono font-medium rounded transition-colors ${
                timeframe === tf
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>

        {/* Center: Chart type toggles */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setChartType('candles')}
            className={`px-2 py-1 text-xs rounded transition-colors ${
              chartType === 'candles' ? 'bg-slate-800 text-cyan-400 font-medium' : 'text-slate-400 hover:text-white'
            }`}
          >
            Candles
          </button>
          <button
            onClick={() => setChartType('line')}
            className={`px-2 py-1 text-xs rounded transition-colors ${
              chartType === 'line' ? 'bg-slate-800 text-cyan-400 font-medium' : 'text-slate-400 hover:text-white'
            }`}
          >
            Line
          </button>
          <button
            onClick={() => setChartType('area')}
            className={`px-2 py-1 text-xs rounded transition-colors ${
              chartType === 'area' ? 'bg-slate-800 text-cyan-400 font-medium' : 'text-slate-400 hover:text-white'
            }`}
          >
            Area
          </button>
        </div>

        {/* Right: Indicators toggles */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowMA7(!showMA7)}
            className={`text-[11px] font-mono px-1.5 py-0.5 rounded border ${
              showMA7
                ? 'border-amber-500/50 bg-amber-950/40 text-amber-400'
                : 'border-slate-800 text-slate-500'
            }`}
          >
            MA(7)
          </button>
          <button
            onClick={() => setShowMA25(!showMA25)}
            className={`text-[11px] font-mono px-1.5 py-0.5 rounded border ${
              showMA25
                ? 'border-cyan-500/50 bg-cyan-950/40 text-cyan-400'
                : 'border-slate-800 text-slate-500'
            }`}
          >
            MA(25)
          </button>
          <button
            onClick={() => setShowVolume(!showVolume)}
            className={`text-[11px] font-mono px-1.5 py-0.5 rounded border ${
              showVolume
                ? 'border-slate-700 bg-slate-800 text-slate-200'
                : 'border-slate-800 text-slate-500'
            }`}
          >
            VOL
          </button>
        </div>
      </div>

      {/* Floating HUD info bar showing current OHLCV */}
      {activeCandle && (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-b border-slate-800/40 bg-[#0B1020] px-3 py-1.5 text-[11px] font-mono">
          <span className="text-slate-400">
            {new Date(activeCandle.time).toLocaleString([], {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
          <div>
            <span className="text-slate-500">O: </span>
            <span className="text-slate-200 tabular-nums">{activeCandle.open.toFixed(pricePrecision)}</span>
          </div>
          <div>
            <span className="text-slate-500">H: </span>
            <span className="text-emerald-400 tabular-nums">{activeCandle.high.toFixed(pricePrecision)}</span>
          </div>
          <div>
            <span className="text-slate-500">L: </span>
            <span className="text-rose-400 tabular-nums">{activeCandle.low.toFixed(pricePrecision)}</span>
          </div>
          <div>
            <span className="text-slate-500">C: </span>
            <span
              className={`tabular-nums font-semibold ${
                activeCandle.close >= activeCandle.open ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {activeCandle.close.toFixed(pricePrecision)}
            </span>
          </div>
          <div>
            <span className="text-slate-500">Vol: </span>
            <span className="text-slate-300 tabular-nums">{activeCandle.volume.toFixed(2)}</span>
          </div>
          {showMA7 && activeMA7 && (
            <div className="hidden sm:inline">
              <span className="text-amber-500">MA7: </span>
              <span className="text-amber-400 tabular-nums">{activeMA7.toFixed(pricePrecision)}</span>
            </div>
          )}
          {showMA25 && activeMA25 && (
            <div className="hidden sm:inline">
              <span className="text-cyan-500">MA25: </span>
              <span className="text-cyan-400 tabular-nums">{activeMA25.toFixed(pricePrecision)}</span>
            </div>
          )}
        </div>
      )}

      {/* Canvas chart area */}
      <div className="relative flex-1 min-h-[340px]">
        <canvas
          ref={canvasRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onClick={handleCanvasClick}
          className="h-full w-full cursor-crosshair"
        />
      </div>
    </div>
  );
};
