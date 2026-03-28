import { useState } from "react";

export default function SeverityCalculator() {
  const [frequency, setFrequency] = useState("");
  const [impact, setImpact] = useState("");
  const [persistence, setPersistence] = useState("");

  const toNumber = (val) => (val === "" ? 0 : Number(val));

  const score = toNumber(frequency) * toNumber(impact) * toNumber(persistence);

  const getCategory = (s) => {
    if (!s) return "—";
    if (s >= 18) return "🔴 CRITICAL";
    if (s >= 9) return "🟠 MAJOR";
    if (s >= 3) return "🟡 MINOR";
    return "⚪ Negligible";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-md">
        <h1 className="text-xl font-semibold mb-4">UX Severity Calculator</h1>

        <div className="space-y-4">
          <Input label="Frequency" value={frequency} setValue={setFrequency} />
          <Input label="Impact" value={impact} setValue={setImpact} />
          <Input label="Persistence" value={persistence} setValue={setPersistence} />
        </div>

        <div className="mt-6 p-4 bg-gray-100 rounded-xl">
          <p className="text-sm text-gray-500">Score</p>
          <p className="text-2xl font-bold">{score || "—"}</p>

          <p className="text-sm text-gray-500 mt-2">Category</p>
          <p className="text-lg font-semibold">{getCategory(score)}</p>
        </div>
      </div>
    </div>
  );
}

function Input({ label, value, setValue }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input
        type="number"
        min="0"
        max="3"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-black"
        placeholder="0–3"
      />
    </div>
  );
}
