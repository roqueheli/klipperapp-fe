import MoneyField from "@/components/attendances/payment/MoneyField";
import { useTheme } from "@/components/ThemeProvider";

interface TransactionSummaryProps {
  discount: number;
  total: number;
  finalTotal: number;
  amountPaid: number;
  paymentType: string;
  onDiscountChange: (value: number) => void;
  onPaymentTypeChange: (value: string) => void;
  date: string;
}

const TransactionSummary = ({
  discount,
  total,
  finalTotal,
  amountPaid,
  paymentType,
  onDiscountChange,
  onPaymentTypeChange,
  date,
}: TransactionSummaryProps) => {
  const { theme } = useTheme();

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div>
          <label className="font-semibold block mb-1">Descuento</label>
          <input
            type="number"
            min={0}
            max={total}
            value={discount}
            onChange={(e) => onDiscountChange(Number(e.target.value))}
            className={`${ theme === 'dark' ? "border-gray-600 bg-gray-700" : "border-gray-300 bg-gray-100"} w-full border rounded px-3 py-2`}
          />
        </div>
        <MoneyField label="Monto Total" value={total} />
        <div>
          <label className="font-semibold block mb-1">Fecha</label>
          <input
            type="text"
            readOnly
            className={`${theme === 'dark' ? "bg-gray-700" : "bg-gray-100"} w-full rounded px-3 py-2`}
            value={date}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div>
          <label className="font-semibold block mb-1">Tipo de Pago</label>
          <select
            value={paymentType}
            onChange={(e) => onPaymentTypeChange(e.target.value)}
            className={`${theme === 'dark' ? "bg-gray-700 border-gray-600 " : "bg-gray-100 border-gray-300"} w-full border rounded px-3 py-2`}
          >
            <option>Efectivo</option>
            <option>Transferencia</option>
            <option>Punto de venta</option>
          </select>
        </div>
        <MoneyField label="Total Final" value={finalTotal} />
        <MoneyField label="Monto Pagado" value={amountPaid} />
      </div>
    </>
  );
};

export default TransactionSummary;
