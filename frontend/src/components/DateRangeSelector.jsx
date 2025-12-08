import React, { useState, useRef, useEffect } from "react";
import { FiCalendar, FiX } from "react-icons/fi";

/**
 * Modern Date Range Selector Component
 * Props:
 *  - dateFrom: string (YYYY-MM-DD format)
 *  - dateTo: string (YYYY-MM-DD format)
 *  - onChange: function(dateFrom, dateTo)
 */
export default function DateRangeSelector({ dateFrom = "", dateTo = "", onChange }) {
  const [localFrom, setLocalFrom] = useState(dateFrom);
  const [localTo, setLocalTo] = useState(dateTo);
  const [showPresets, setShowPresets] = useState(false);
  const ref = useRef();

  useEffect(() => {
    setLocalFrom(dateFrom);
    setLocalTo(dateTo);
  }, [dateFrom, dateTo]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setShowPresets(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleFromChange = (e) => {
    const newFrom = e.target.value;
    setLocalFrom(newFrom);
    onChange(newFrom, localTo);
  };

  const handleToChange = (e) => {
    const newTo = e.target.value;
    setLocalTo(newTo);
    onChange(localFrom, newTo);
  };

  // Preset date ranges
  const applyPreset = (days) => {
    const today = new Date();
    const from = new Date(today);
    from.setDate(from.getDate() - days);
    
    const fromStr = from.toISOString().split('T')[0];
    const toStr = today.toISOString().split('T')[0];
    
    setLocalFrom(fromStr);
    setLocalTo(toStr);
    onChange(fromStr, toStr);
    setShowPresets(false);
  };

  const clearDates = () => {
    setLocalFrom("");
    setLocalTo("");
    onChange("", "");
  };

  const formatDateDisplay = (date) => {
    if (!date) return "Select date";
    return new Date(date).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div ref={ref} className="date-range-selector">
      <div className="date-range-container">
        {/* FROM DATE */}
        <div className="date-input-group">
          <label className="date-input-label">From</label>
          <div className="date-input-wrapper">
            <FiCalendar className="date-input-icon" />
            <input
              type="date"
              className="date-input-field"
              value={localFrom}
              onChange={handleFromChange}
            />
          </div>
          <span className="date-display">{formatDateDisplay(localFrom)}</span>
        </div>

        {/* DIVIDER */}
        <div className="date-range-divider">→</div>

        {/* TO DATE */}
        <div className="date-input-group">
          <label className="date-input-label">To</label>
          <div className="date-input-wrapper">
            <FiCalendar className="date-input-icon" />
            <input
              type="date"
              className="date-input-field"
              value={localTo}
              onChange={handleToChange}
            />
          </div>
          <span className="date-display">{formatDateDisplay(localTo)}</span>
        </div>

        {/* CLEAR BUTTON */}
        {(localFrom || localTo) && (
          <button 
            className="date-clear-btn"
            onClick={clearDates}
            title="Clear dates"
          >
            <FiX />
          </button>
        )}
      </div>

      {/* PRESET DATES */}
      <div className="date-presets">
        <button 
          className="preset-toggle-btn"
          onClick={() => setShowPresets(!showPresets)}
        >
          Quick select
        </button>
        
        {showPresets && (
          <div className="preset-menu">
            <button className="preset-btn" onClick={() => applyPreset(7)}>
              Last 7 days
            </button>
            <button className="preset-btn" onClick={() => applyPreset(30)}>
              Last 30 days
            </button>
            <button className="preset-btn" onClick={() => applyPreset(90)}>
              Last 90 days
            </button>
            <button className="preset-btn" onClick={() => applyPreset(365)}>
              Last year
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
