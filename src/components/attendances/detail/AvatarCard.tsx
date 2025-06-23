interface AvatarCardProps {
  name?: string;
  email?: string;
  phone?: string;
}

const AvatarCard = ({ name, email, phone }: AvatarCardProps) => (
  <div className="flex items-center gap-5">
    <div className="w-16 h-16 flex items-center justify-center rounded-full bg-white/10 text-[--accent-pink] text-xl font-bold">
      {name?.charAt(0).toUpperCase() || "?"}
    </div>
    <div className="text-sm text-white/90 space-y-1">
      <p className="font-medium">{name || "Sin nombre"}</p>
      {email && <p className="text-white/60">{email}</p>}
      {phone && <p className="text-white/60">{phone}</p>}
    </div>
  </div>
);

export default AvatarCard;
