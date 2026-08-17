"use client";
import React, { useState } from "react";
import { Activity, ShieldAlert, Calendar, CheckCircle2, TrendingDown, TrendingUp } from "lucide-react";

const PROTOCOLS = {
  standard: {
    name: "Standard Care Protocol",
    color: "#f59e0b",
    bg: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    desc: "Conventional symptom monitoring & routine bi-weekly follow-ups.",
    trajectory: [
      { day: 0, score: 65, lower: 60, upper: 70 },
      { day: 30, score: 68, lower: 62, upper: 74 },
      { day: 60, score: 72, lower: 65, upper: 79 },
      { day: 90, score: 76, lower: 68, upper: 84 },
      { day: 120, score: 79, lower: 71, upper: 87 },
      { day: 150, score: 83, lower: 74, upper: 91 },
      { day: 180, score: 86, lower: 77, upper: 95 },
    ],
  },
  protocol_a: {
    name: "Protocol A (Targeted Therapy)",
    color: "#10b981",
    bg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    desc: "AI-optimized dosage regimen + daily Continuous Glucose Monitoring (CGM).",
    trajectory: [
      { day: 0, score: 65, lower: 61, upper: 69 },
      { day: 30, score: 58, lower: 54, upper: 62 },
      { day: 60, score: 49, lower: 44, upper: 54 },
      { day: 90, score: 41, lower: 36, upper: 46 },
      { day: 120, score: 35, lower: 30, upper: 40 },
      { day: 150, score: 30, lower: 25, upper: 35 },
      { day: 180, score: 26, lower: 21, upper: 31 },
    ],
  },
  protocol_b: {
    name: "Protocol B (Combo Therapy)",
    color: "#3b82f6",
    bg: "bg-blue-500/10 text-blue-400 border-blue-500/30",
    desc: "Dual agent administration + lifestyle digital twin intervention.",
    trajectory: [
      { day: 0, score: 65, lower: 60, upper: 70 },
      { day: 30, score: 60, lower: 55, upper: 65 },
      { day: 60, score: 53, lower: 47, upper: 59 },
      { day: 90, score: 48, lower: 42, upper: 54 },
      { day: 120, score: 44, lower: 38, upper: 50 },
      { day: 150, score: 41, lower: 35, upper: 47 },
      { day: 180, score: 38, lower: 31, upper: 45 },
    ],
  },
};

export default function DigitalTwinSimulator() {
  const [activeProtocol, setActiveProtocol] = useState("protocol_a");
  const [selectedDay, setSelectedDay] = useState(90);

  const currentProto = PROTOCOLS[activeProtocol];
  const dayPoint = currentProto.trajectory.find((p) => p.day === selectedDay) || currentProto.trajectory[3];

  return (
    <div className="bg-[#1e293b] p-6 rounded-2xl border border-slate-800 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="text-emerald-400" size={22} />
            <h3 className="text-xl font-bold text-white">Digital Twin Health Trajectory Simulator</h3>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Simulate 6-month (180-day) patient disease trajectory curves under alternative treatment protocols.
          </p>
        </div>

        {/* Protocol Selector Buttons */}
        <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-xl border border-slate-800">
          {Object.keys(PROTOCOLS).map((key) => (
            <button
              key={key}
              onClick={() => setActiveProtocol(key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeProtocol === key
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {key === "standard" ? "Standard" : key === "protocol_a" ? "Protocol A" : "Protocol B"}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Trajectory Graph Visualization */}
        <div className="lg:col-span-8 space-y-5 bg-slate-900/50 p-6 rounded-xl border border-slate-800">
          <div className="flex justify-between items-center text-sm">
            <span className="font-semibold text-slate-300 flex items-center gap-2">
              <Calendar size={16} className="text-blue-400" /> 180-Day Projection Curve (95% CI Band)
            </span>
            <span className={`text-xs font-bold px-3 py-1 rounded-full border ${currentProto.bg}`}>
              {currentProto.name}
            </span>
          </div>

          {/* SVG Line Chart with Shaded 95% Confidence Interval Band */}
          <div className="relative h-60 w-full flex items-end pt-6 pb-6 px-2">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 700 200">
              {/* Grid Lines */}
              <line x1="0" y1="0" x2="700" y2="0" stroke="#334155" strokeDasharray="4 4" />
              <line x1="0" y1="66" x2="700" y2="66" stroke="#334155" strokeDasharray="4 4" />
              <line x1="0" y1="133" x2="700" y2="133" stroke="#334155" strokeDasharray="4 4" />
              <line x1="0" y1="200" x2="700" y2="200" stroke="#334155" />

              {/* CI Confidence Band Area */}
              <polygon
                points={currentProto.trajectory
                  .map((p, i) => `${(i / 6) * 700},${200 - p.upper * 2}`)
                  .concat(
                    currentProto.trajectory
                      .slice()
                      .reverse()
                      .map((p, i) => `${((6 - i) / 6) * 700},${200 - p.lower * 2}`)
                  )
                  .join(" ")}
                fill={currentProto.color}
                fillOpacity="0.15"
              />

              {/* Main Trajectory Line */}
              <polyline
                fill="none"
                stroke={currentProto.color}
                strokeWidth="3.5"
                points={currentProto.trajectory
                  .map((p, i) => `${(i / 6) * 700},${200 - p.score * 2}`)
                  .join(" ")}
              />

              {/* Point Markers */}
              {currentProto.trajectory.map((p, i) => {
                const cx = (i / 6) * 700;
                const cy = 200 - p.score * 2;
                const isSelected = p.day === selectedDay;
                return (
                  <g key={p.day} className="cursor-pointer" onClick={() => setSelectedDay(p.day)}>
                    <circle
                      cx={cx}
                      cy={cy}
                      r={isSelected ? "7" : "4.5"}
                      fill={isSelected ? "#ffffff" : currentProto.color}
                      stroke={currentProto.color}
                      strokeWidth="2"
                    />
                    <text
                      x={cx}
                      y={cy - 12}
                      fill="#94a3b8"
                      fontSize="11"
                      textAnchor="middle"
                      fontFamily="monospace"
                    >
                      {p.score}%
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Time Scrubber Slider */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <div className="flex justify-between text-xs font-mono text-slate-400">
              <span>Day 0</span>
              <span>Day 30</span>
              <span>Day 60</span>
              <span className="text-blue-400 font-bold">Day 90</span>
              <span>Day 120</span>
              <span>Day 150</span>
              <span>Day 180</span>
            </div>
            <input
              type="range"
              min="0"
              max="180"
              step="30"
              value={selectedDay}
              onChange={(e) => setSelectedDay(Number(e.target.value))}
              className="w-full accent-blue-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* Selected Timeline Card */}
        <div className="lg:col-span-4 bg-slate-900/80 p-6 rounded-xl border border-slate-800 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              <Calendar size={15} className="text-blue-400" /> Timeline Inspection (Day {selectedDay})
            </div>
            <div className="bg-slate-800/80 p-4 rounded-xl space-y-2 border border-slate-700">
              <div className="text-xs text-slate-400">Predicted Health Score</div>
              <div className="text-3xl font-extrabold font-mono text-white flex items-center gap-2">
                {dayPoint.score}%
                {dayPoint.score < 50 ? (
                  <TrendingDown className="text-emerald-400" size={24} />
                ) : (
                  <TrendingUp className="text-amber-400" size={24} />
                )}
              </div>
              <div className="text-xs font-mono text-slate-400">
                95% CI: <span className="text-slate-200">[{dayPoint.lower}% – {dayPoint.upper}%]</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
              Protocol Details
            </div>
            <p className="text-xs text-slate-300 leading-relaxed bg-slate-800/40 p-3 rounded-lg border border-slate-800">
              {currentProto.desc}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
