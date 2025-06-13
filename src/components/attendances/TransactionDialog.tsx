import { Attendance } from "@/types/attendance";

export const TransactionDialog = ({
  attendance,
  onClose,
}: {
  attendance: Attendance;
  onClose: () => void;
}) => (
  <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
    <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg w-[90%] max-w-lg">
      <h2 className="text-2xl font-bold mb-4">💳 Detalle de la Transacción</h2>
      <p><strong>Cliente:</strong> {attendance.profile?.name}</p>
      <p><strong>Servicio:</strong> {attendance.service?.name}</p>
      <p><strong>Profesional:</strong> {attendance.attended_by_user?.name || "No asignado"}</p>
      <p><strong>Estado:</strong> {attendance.status}</p>
      <p><strong>Fecha:</strong> {new Date(attendance.created_at).toLocaleString()}</p>
      <p><strong>Precio:</strong> ${parseInt(attendance.service?.price || "0").toLocaleString()}</p>

      <div className="mt-6 flex justify-end gap-4">
        <button onClick={onClose} className="btn">Cancelar</button>
        <button className="btn btn-success">Pagar</button>
      </div>
    </div>
  </div>
);
