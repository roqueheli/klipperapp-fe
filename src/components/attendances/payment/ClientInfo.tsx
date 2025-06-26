import { Attendance } from "@/types/attendance";

interface ClientInfoProps {
  attendance: Attendance;
}

const ClientInfo = ({ attendance }: ClientInfoProps) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
    <div>
      <h5 className="text-lg font-medium mb-2">Cliente:</h5>
      <p>
        <strong>Nombre:</strong> {attendance.profile.name}
      </p>
      <p>
        <strong>Email:</strong> {attendance.profile.email}
      </p>
      <p>
        <strong>Teléfono:</strong> {attendance.profile.phone_number}
      </p>
      <p>
        <strong>Código de atención:</strong> {attendance.id}
      </p>
    </div>
    <div>
      <h5 className="text-lg font-medium mb-2">Atendido por:</h5>
      <p>
        <strong>Nombre:</strong> {attendance.attended_by_user.name}
      </p>
      <p>
        <strong>Email:</strong> {attendance.attended_by_user.email}
      </p>
      <p>
        <strong>Teléfono:</strong>{" "}
        {attendance.attended_by_user.phone_number || "No disponible"}
      </p>
    </div>
  </div>
);

export default ClientInfo;
