import { Attendance } from "@/types/attendance";

interface ClientInfoProps {
  attendance: Attendance;
}

const ClientInfo = ({ attendance }: ClientInfoProps) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
    <div className="flex items-center">
      <h5 className="text-lg font-medium mr-2">Cliente:</h5>
      <h3 className="text-xl font-bold">{attendance.profile.name}</h3>
      {/* <p>
        <strong>Código de atención:</strong> {attendance.id}
      </p> */}
    </div>
    <div className="flex items-center">
      <h5 className="text-lg font-medium mr-2">Atendido por:</h5>
      <h3 className="text-xl font-bold">
        {attendance.attended_by_user.name}
      </h3>
    </div>
  </div>
);

export default ClientInfo;
