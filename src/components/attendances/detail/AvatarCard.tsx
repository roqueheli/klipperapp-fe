interface AvatarCardProps {
  name?: string;
  email?: string;
  phone?: string;
}

const AvatarCard = ({ name, email, phone }: AvatarCardProps) => (
  <div className="flex items-center gap-5">
    <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gray-500/10 text-xl font-bold">
      {name?.charAt(0).toUpperCase() || "?"}
    </div>
    <div className="text-sm space-y-1">
      <p className="font-medium">{name || "Sin nombre"}</p>
      {email && <p>{email}</p>}
      {phone && <p>{phone}</p>}
    </div>
  </div>
);

export default AvatarCard;
