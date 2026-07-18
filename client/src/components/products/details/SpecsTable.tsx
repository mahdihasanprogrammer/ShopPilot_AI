"use client";

interface SpecsTableProps {
  category: string;
}

export default function SpecsTable({ category }: SpecsTableProps) {
  // Generate beautiful custom mock specs depending on the category of the product
  const getSpecs = () => {
    switch (category.toLowerCase()) {
      case "electronics":
        return [
          { key: "Warranty", value: "1 Year International" },
          { key: "Power Input", value: "USB-C Fast Charging" },
          { key: "Material", value: "Anodized Aluminum & ABS" },
          { key: "Connectivity", value: "Bluetooth 5.2 / 2.4GHz Wireless" },
        ];
      case "fitness":
        return [
          { key: "Water Resistance", value: "IPX7 Rating" },
          { key: "Battery Life", value: "Up to 30 Hours" },
          { key: "Sensor Type", value: "Optical Heart Rate & Accel" },
          { key: "Warranty", value: "6 Months Limited" },
        ];
      case "home-decor":
        return [
          { key: "Dimensions", value: "12 x 8 x 6 inches" },
          { key: "Weight", value: "1.4 lbs" },
          { key: "Light Source", value: "Stepless Dimming warm LED" },
          { key: "Body Material", value: "Solid Birch Wood & Steel" },
        ];
      case "fashion":
        return [
          { key: "Material", value: "100% Breathable Cotton & Nylon" },
          { key: "Fit", value: "Relaxed Fit / True to Size" },
          { key: "Care Instructions", value: "Machine Washable, Cold Water" },
          { key: "Origin", value: "Imported" },
        ];
      default:
        return [
          { key: "Certification", value: "SGS / CE Approved" },
          { key: "Condition", value: "100% Brand New" },
          { key: "Package Includes", value: "Main Product & User Guide" },
          { key: "Shipping Weight", value: "0.8 lbs" },
        ];
    }
  };

  const specs = getSpecs();

  return (
    <div className="rounded-2xl border border-bg-secondary bg-background overflow-hidden shadow-sm">
      <div className="bg-bg-secondary/40 px-4 py-3 border-b border-bg-secondary">
        <h3 className="text-xs font-bold text-text-neutral uppercase tracking-wider">
          Specifications Table
        </h3>
      </div>
      <table className="w-full text-xs text-left">
        <tbody>
          {specs.map((s, idx) => (
            <tr
              key={idx}
              className={`${
                idx % 2 === 0 ? "bg-background" : "bg-bg-secondary/20"
              } border-b border-bg-secondary last:border-b-0`}
            >
              <td className="px-4 py-3 font-semibold text-text-neutral/60 w-1/3 border-r border-bg-secondary/50">
                {s.key}
              </td>
              <td className="px-4 py-3 text-text-neutral font-medium">
                {s.value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
