import { Attendance } from "@/types/attendance";
import { Expenses } from "@/types/expenses";

interface ExpensesDetailsSectionProps {
  title: string;
  expenses: Expenses[];
  renderItem: (exp: Expenses) => React.ReactNode;
  emptyText: string;
}

export default function ExpensesDetailsSection({
  title,
  expenses,
  renderItem,
  emptyText,
}: ExpensesDetailsSectionProps) {
  return (
    <div>
      <h4 className="font-semibold text-base mb-2">{title}</h4>
      {expenses.length > 0 ? (
        <ul className="ml-4">
          {expenses.map((exp) => renderItem(exp))}
        </ul>
      ) : (
        <p className="italic text-gray-500">{emptyText}</p>
      )}
    </div>
  );
}
