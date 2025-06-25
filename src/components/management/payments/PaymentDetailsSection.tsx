import { Attendance } from "@/types/attendance";

interface PaymentDetailsSectionProps {
  title: string;
  attendances: Attendance[];
  renderItem: (att: Attendance) => React.ReactNode;
  emptyText: string;
}

export default function PaymentDetailsSection({
  title,
  attendances,
  renderItem,
  emptyText,
}: PaymentDetailsSectionProps) {
  return (
    <div>
      <h4 className="font-semibold text-base mb-2">{title}</h4>
      {attendances.length > 0 ? (
        <ul className="ml-4">
          {attendances.map((att) => renderItem(att))}
        </ul>
      ) : (
        <p className="italic text-gray-500">{emptyText}</p>
      )}
    </div>
  );
}
