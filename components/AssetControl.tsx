
import React from 'react';
import { AssetType } from '../types';
import { ASSET_LABELS } from '../constants';
import { Lock, TrendingUp, TrendingDown } from 'lucide-react';

interface AssetControlProps {
  type: AssetType;
  currentValue: number;
  delta: number;
  maxMove: number; // For Selling: The Fixed Limit (e.g., 25 Cr). For Buying: Ignored.
  maxBuyLimit: number; // Max allowed buy based on Cash available
  totalCashStart: number; // The total cash at start of round, for stable slider scaling
  onDeltaChange: (type: AssetType, delta: number) => void;
}

export const AssetControl: React.FC<AssetControlProps> = ({
  type,
  currentValue,
  delta,
  maxMove,
  maxBuyLimit,
  totalCashStart,
  onDeltaChange
}) => {
  if (type === AssetType.CASH) return null;

  // BUYING: Limited ONLY by available Cash.
  // maxBuyLimit passed from App is the total positive delta allowed for this asset given the cash.
  const effectiveMaxBuy = Math.max(0, maxBuyLimit);
  
  // SELLING: Limited by Regulatory Limit (maxMove) OR Current Holdings (whichever is lower)
  const effectiveMaxSell = Math.min(currentValue, maxMove);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newDelta = parseFloat(e.target.value);
    
    // Auto-Lock: Clamp Selling to effectiveMaxSell
    if (newDelta < 0 && Math.abs(newDelta) > effectiveMaxSell) {
      newDelta = -effectiveMaxSell;
    }
    
    // Auto-Lock: Clamp Buying to Cash Limit
    if (newDelta > 0) {
        if (newDelta > effectiveMaxBuy) {
            newDelta = effectiveMaxBuy;
        }
    }
    
    onDeltaChange(type, newDelta);
  };

  const projectedValue = currentValue + delta;
  const isBuying = delta > 0;
  const isSelling = delta < 0;
  
  // Buying is maxed out if we hit cash limit (tolerance for float)
  const isBuyMaxed = delta > 0 && Math.abs(delta - effectiveMaxBuy) < 0.01;

  // Selling is maxed out if we hit regulatory limit or holdings limit
  const isSellMaxed = delta < 0 && Math.abs(Math.abs(delta) - effectiveMaxSell) < 0.01;

  // Slider Range Calculation
  // Use totalCashStart to keep the scale constant during interaction, preventing jumping.
  const sliderRange = Math.max(totalCashStart, maxMove, 50); 
  
  // Inline style for the striped pattern (blocked zone)
  const blockedPatternStyle = {
    backgroundImage: 'repeating-linear-gradient(45deg, #fee2e2, #fee2e2 10px, #fecaca 10px, #fecaca 20px)'
  };

  // Valid Range Visual Calculation
  // Slider goes from -sliderRange (0% width) to +sliderRange (100% width)
  // Center is 50%
  // 1 unit = 50 / sliderRange percent
  
  const leftValidPct = 50 - (effectiveMaxSell / sliderRange * 50);
  const rightValidPct = 50 + (effectiveMaxBuy / sliderRange * 50);

  return (
    <div className="mb-5 last:mb-0">
      <div className="flex justify-between items-center mb-1">
        <div className="flex items-center gap-2">
          <span className="font-bold text-md">{ASSET_LABELS[type]}</span>
        </div>
        <div className="text-right">
          <span className="block font-mono font-bold text-lg">₹{projectedValue.toFixed(2)} Cr</span>
          <span className={`text-xs font-bold ${isBuying ? 'text-green-600' : isSelling ? 'text-red-600' : 'text-gray-400'}`}>
             {delta !== 0 ? (delta > 0 ? `+ ${delta.toFixed(2)}` : `- ${Math.abs(delta).toFixed(2)}`) : 'No Change'}
          </span>
        </div>
      </div>

      <div className="relative h-12 flex items-center group">
        {/* Slider Track Background */}
        <div className="absolute w-full h-3 bg-gray-200 border-2 border-black rounded-full overflow-hidden">
           {/* Center Marker */}
           <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-black z-10"></div>
           
           {/* Left Blocked Zone (Selling Limit) */}
           <div 
             className="absolute top-0 bottom-0 z-0 opacity-80" 
             style={{
               ...blockedPatternStyle,
               left: 0,
               width: `${leftValidPct}%`
             }}
           />

           {/* Right Blocked Zone (Buying Limit) */}
           <div 
             className="absolute top-0 bottom-0 z-0 opacity-80" 
             style={{
               ...blockedPatternStyle,
               left: `${rightValidPct}%`,
               right: 0
             }}
           />
        </div>

        <input
          type="range"
          min={-sliderRange}
          max={sliderRange}
          step={0.01}
          value={delta}
          onChange={handleSliderChange}
          className="w-full absolute z-20 opacity-0 cursor-pointer h-full"
        />

        {/* Visual Slider Bar */}
        <div 
            className={`absolute h-3 transition-all duration-75 pointer-events-none ${delta > 0 ? 'bg-[#16A34A]' : 'bg-[#DC2626]'}`}
            style={{
                left: delta < 0 ? `calc(50% - ${Math.abs((delta/sliderRange)*50)}%)` : '50%',
                width: `${Math.abs((delta/sliderRange)*50)}%`
            }}
        />
        
        {/* Thumb */}
        <div 
            className={`absolute h-7 w-7 bg-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center transition-all duration-75 pointer-events-none z-30 ${isBuyMaxed || isSellMaxed ? 'ring-2 ring-red-500' : ''}`}
            style={{
                left: `calc(50% + ${(delta/sliderRange)*50}% - 14px)`
            }}
        >
            {delta === 0 && <div className="w-2 h-2 bg-black rounded-full" />}
            {delta > 0 && <TrendingUp size={16} className="text-green-600" />}
            {delta < 0 && <TrendingDown size={16} className="text-red-600" />}
        </div>
      </div>
      
      <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
        <span className="flex items-center gap-1">
          <Lock size={10}/> Max Sell: ₹{effectiveMaxSell.toFixed(2)} Cr
        </span>
        <span className="flex items-center gap-1 text-right">
           {isBuyMaxed ? <span className="text-red-600">Cash Limit Hit</span> : `Cash Avail: ₹${effectiveMaxBuy.toFixed(2)} Cr`} 
        </span>
      </div>
    </div>
  );
};
