import { useTheme } from "@/components/ThemeProvider";

interface MoneyFieldProps {
  label: string;
  value: number;
}

const MoneyField = ({ label, value }: MoneyFieldProps) => {
  const { theme } = useTheme();

  return (
    <div>
      <label className="font-semibold block mb-1">{label}</label>
      <input
        type="text"
        readOnly
        className={`w-full ${theme === 'dark' ? "bg-gray-700" : "bg-gray-100"} rounded px-3 py-2`}
        value={value.toLocaleString("es-CL", {
          style: "currency",
          currency: "CLP",
        })}
      />
    </div>
  );
};

export default MoneyField;
