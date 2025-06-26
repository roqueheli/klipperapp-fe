interface MoneyFieldProps {
  label: string;
  value: number;
}

const MoneyField = ({ label, value }: MoneyFieldProps) => {
  return (
    <div>
      <label className="font-semibold block mb-1">{label}</label>
      <input
        type="text"
        readOnly
        className="w-full bg-gray-100 dark:bg-gray-700 rounded px-3 py-2"
        value={value.toLocaleString("es-CL", {
          style: "currency",
          currency: "CLP",
        })}
      />
    </div>
  );
};

export default MoneyField;
