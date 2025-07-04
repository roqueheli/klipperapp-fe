import Image from "next/image";

interface AvatarCardProps {
  name?: string;
  email?: string;
  phone?: string;
  photo_url?: string;
}

const AvatarCard = ({ name, email, phone, photo_url }: AvatarCardProps) => (
  <div className="flex items-center gap-5">
    <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gray-500/10 text-xl font-bold">
      {photo_url ? (
        <Image
          src={photo_url}
          alt={name || "Sin nombre"}
          className="rounded-full h-16 w-16"
          width={64}
          height={64}
        />
      ) : (
        <span className="text-4xl">{name?.charAt(0).toUpperCase() || "?"}</span>
      )}
    </div>
    <div className="text-sm space-y-1">
      <p className="font-medium">{name || "Sin nombre"}</p>
      {email && <p>{email}</p>}
      {phone && <p>{phone}</p>}
    </div>
  </div>
);

export default AvatarCard;
