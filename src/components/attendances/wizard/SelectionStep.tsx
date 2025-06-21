import { Profile } from "@/types/profile";
import { ServiceResponse } from "@/types/service";
import { UserResponse } from "@/types/user";
import Image from "next/image";
import React from "react";

interface SelectionStepProps {
  profile?: Profile;
  users?: UserResponse;
  services?: ServiceResponse;
  selectedUserId: number | null;
  selectedServiceId: number | null;
  onUserSelect: (userId: number) => void;
  onServiceSelect: (serviceId: number) => void;
  onBack: () => void;
  onFinish: () => void;
}

const SelectionStep: React.FC<SelectionStepProps> = ({
  profile,
  users,
  services,
  selectedUserId,
  selectedServiceId,
  onUserSelect,
  onServiceSelect,
  onBack,
  onFinish,
}) => {
  return (
    <div>
      <div className="p-3 w-full flex justify-between items-center">
        {profile?.name && (
          <p className="w-full mt-3 text-left mb-4 text-xl font-semibold text-blue-700 dark:text-blue-400">
            Hola, <span className="text-white">{profile?.name}</span>
          </p>
        )}
        <div className="w-full flex justify-end max-w-sm mx-auto">
          <button
            onClick={onBack}
            className="mr-4 bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 font-semibold px-6 py-3 rounded-md shadow-sm transition"
          >
            Volver
          </button>
          <button
            disabled={selectedUserId === null}
            onClick={onFinish}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 rounded-md shadow-sm transition"
          >
            Finalizar
          </button>
        </div>
      </div>

      <h2 className="ml-2 text-xl font-extrabold mb-4 text-left text-blue-600 dark:text-blue-400 drop-shadow-sm">
        Selecciona un profesional
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6">
        {users?.users.map((user) => (
          <div
            key={user.id}
            onClick={() => onUserSelect(user.id)}
            className={`cursor-pointer border rounded-lg p-5 flex flex-col items-center gap-3 shadow-sm transition 
              ${
                selectedUserId === user.id
                  ? "border-blue-600 shadow-blue-300 dark:shadow-blue-700"
                  : "border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500"
              }`}
            tabIndex={0}
            role="button"
            aria-pressed={selectedUserId === user.id}
          >
            <div className="flex w-full justify-center items-center relative w-20 h-30 mb-4">
              <Image
                src={user.photo_url || "https://instagram.fscl38-1.fna.fbcdn.net/v/t51.2885-15/72779367_1162328503937413_1372969658332728921_n.jpg?stp=dst-jpg_e35_tt6&efg=eyJ2ZW5jb2RlX3RhZyI6IkNBUk9VU0VMX0lURU0uaW1hZ2VfdXJsZ2VuLjE0NDB4OTYxLnNkci5mMjg4NS5kZWZhdWx0X2ltYWdlIn0&_nc_ht=instagram.fscl38-1.fna.fbcdn.net&_nc_cat=101&_nc_oc=Q6cZ2QGqsf8D2uoR4Hhc3fQmiT_UPgRhTc3e-z2LnwJUwI6kZj4I3Jg7ZOu6O4TPVP2cn_4kY_wxxqep5ywMjUpoFVV1&_nc_ohc=iwGxY0ntePAQ7kNvwH-LH4V&_nc_gid=hOXug_uAvaELCDV45wE3TA&edm=APoiHPcBAAAA&ccb=7-5&ig_cache_key=MjE4MTM1NzI5MDExNDg1NDczMA%3D%3D.3-ccb7-5&oh=00_AfNln6KkJVhygGRM6hJx1m-3iWyEjudKFvaV6Rxg4HtOlg&oe=6858C667&_nc_sid=22de04"}
                alt={user.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="rounded-md object-cover shadow"
              />
            </div>
            <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              {user.name}
            </div>
            {user.premium && (
              <div className="text-yellow-400 font-semibold">⭐ Premium</div>
            )}
          </div>
        ))}

        <div
          onClick={() => onUserSelect(0)}
          className={`flex justify-center items-center cursor-pointer border rounded-lg p-5 shadow-sm transition text-sm font-semibold
            ${
              selectedUserId === 0
                ? "border-blue-600 shadow-blue-300 dark:shadow-blue-700"
                : "border-blue-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500"
            }`}
          tabIndex={0}
          role="button"
          aria-pressed={selectedUserId === 0}
        >
          Próximo disponible
        </div>
      </div>

      <h2 className="ml-2 mt-8 text-xl font-extrabold mb-4 text-left text-blue-600 dark:text-blue-400 drop-shadow-sm">
        {`Selecciona un servicio (Opcional)`}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6">
        {services?.services.map((service) => (
          <div
            key={service.id}
            onClick={() => onServiceSelect(service.id)}
            className={`cursor-pointer border rounded-lg p-6 shadow-sm transition 
              ${
                selectedServiceId === service.id
                  ? "border-blue-600 shadow-blue-300 dark:shadow-blue-700"
                  : "border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500"
              }`}
            tabIndex={0}
            role="button"
            aria-pressed={selectedServiceId === service.id}
          >
            <div className="flex w-full justify-center items-center relative w-20 h-30 mb-4">
              <Image
                src={service.photo_url || "https://instagram.fscl9-2.fna.fbcdn.net/v/t51.2885-15/78923615_160450271974390_8616624621741485529_n.jpg?stp=dst-jpg_e35_tt6&efg=eyJ2ZW5jb2RlX3RhZyI6IkNBUk9VU0VMX0lURU0uaW1hZ2VfdXJsZ2VuLjE0NDB4MTgwMC5zZHIuZjI4ODUuZGVmYXVsdF9pbWFnZSJ9&_nc_ht=instagram.fscl9-2.fna.fbcdn.net&_nc_cat=110&_nc_oc=Q6cZ2QEWb-Ewn6WEpeItUvu7VU4aXefM0cplGoDu2oEyPscZ4Egbqjm_Xqt0aZO-EVqGhOLuyY94BbCi9bAMA1gip0pe&_nc_ohc=C4cz_pbHQvcQ7kNvwE02SsV&_nc_gid=wKi62QKXsKpk1rl0MMbmng&edm=APoiHPcBAAAA&ccb=7-5&ig_cache_key=MjIwODk3NjgzNjI3MTAzNjgzNQ%3D%3D.3-ccb7-5&oh=00_AfOSC-PJhIloq--wMff7wUTNeTkaebx8f9G4kIM6AR6EPw&oe=68561EAE&_nc_sid=22de04"}
                alt={service.name}
                fill
                className="rounded-md object-cover shadow"
              />
            </div>
            <h3 className="text-sm font-semibold mb-2 text-gray-900 dark:text-gray-100">
              {service.name}
            </h3>
            <p className="mt-3 font-bold text-blue-700 dark:text-blue-400">
              {Number(service.price).toLocaleString("es-CL", {
                style: "currency",
                currency: "CLP",
              })}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SelectionStep;
