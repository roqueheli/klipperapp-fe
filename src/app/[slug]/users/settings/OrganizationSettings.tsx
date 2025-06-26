"use client";

import ImageUploader from "@/components/settings/ImageUploader";
import InputField from "@/components/settings/InputField";
import { useOrganization } from "@/contexts/OrganizationContext";
import httpInternalApi from "@/lib/common/http.internal.service";
import { UpateOrganization } from "@/types/organization";
import { useState } from "react";
import toast from "react-hot-toast";

const OrganizationSettings = () => {
  const { data, update } = useOrganization();
  const [form, setForm] = useState({
    name: data?.name ?? "",
    bio: data?.bio ?? "",
    photo_url: data?.photo_url ?? "",
    extra_discount: data?.metadata?.billing_configs?.extra_discount ?? 0,
    organization_percentage:
      data?.metadata?.billing_configs?.organization_percentage ?? 0,
    user_percentage: data?.metadata?.billing_configs?.user_percentage ?? 0,
    logo_url: data?.metadata?.media_configs?.logo_url ?? "",
    favicon: data?.metadata?.media_configs?.favicon ?? "",
  });

  const handleChange = (field: string, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    const payload = {
      id: data?.id,
      name: form.name,
      bio: form.bio,
      metadata: {
        billing_configs: {
          extra_discount: form.extra_discount,
          organization_percentage: form.organization_percentage,
          user_percentage: form.user_percentage,
        },
        media_configs: {
          logo_url: form.logo_url,
          favicon: form.favicon,
        },
        menus: data?.metadata?.menus,
      },
      photo_url: form.photo_url,
    };

    try {
      const updatedOrg = await toast.promise(
        httpInternalApi.httpPostPublic(
          "/organizations",
          "PUT",
          payload
        ) as Promise<UpateOrganization>,
        {
          loading: "Actualizando organization...",
          success: "Organization actualizada exitosamente.",
          error: "Error al actualizar la organization.",
        }
      );

      update(updatedOrg.profile);
    } catch (error) {
      console.error("Error en la actualización de la organization:", error);
    }
  };

  const isModified = () => {
    if (!data) return false;

    return (
      form.name !== data.name ||
      form.bio !== data.bio ||
      form.photo_url !== data.photo_url ||
      form.extra_discount !== data.metadata?.billing_configs?.extra_discount ||
      form.organization_percentage !==
        data.metadata?.billing_configs?.organization_percentage ||
      form.user_percentage !==
        data.metadata?.billing_configs?.user_percentage ||
      form.logo_url !== data.metadata?.media_configs?.logo_url ||
      form.favicon !== data.metadata?.media_configs?.favicon
    );
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-xl font-bold mb-4 text-[--electric-blue]">
        Información General
      </h1>
      <InputField
        label="Nombre"
        value={form.name}
        onChange={(val) => handleChange("name", String(val))}
        type="text"
      />
      <InputField
        label="Biografía"
        value={form.bio}
        onChange={(val) => handleChange("bio", String(val))}
        textarea
        type="text"
      />

      <h1 className="text-xl font-bold my-4 text-[--electric-blue]">
        Configuración de Facturación
      </h1>
      <InputField
        label="Descuento Extra"
        value={form.extra_discount}
        onChange={(val) => handleChange("extra_discount", Number(val))}
        type="number"
      />
      <InputField
        label="Porcentaje Organización"
        value={form.organization_percentage}
        onChange={(val) => handleChange("organization_percentage", Number(val))}
        type="number"
      />
      <InputField
        label="Porcentaje Profesional"
        value={form.user_percentage}
        onChange={(val) => handleChange("user_percentage", Number(val))}
        type="number"
      />

      <h1 className="text-xl font-bold my-4 text-[--electric-blue]">
        Archivos de Marca
      </h1>
      <ImageUploader
        label="Logo"
        initialUrl={form.logo_url}
        onUpload={(url) => handleChange("logo_url", url)}
      />
      <ImageUploader
        label="Favicon"
        initialUrl={form.favicon}
        onUpload={(url) => handleChange("favicon", url)}
      />
      <ImageUploader
        label="Foto principal"
        initialUrl={form.photo_url}
        onUpload={(url) => handleChange("photo_url", url)}
      />

      <div className="mt-8 w-full flex justify-end items-center">
        <button
          onClick={handleSubmit}
          disabled={!isModified()}
          className={`py-2 px-4 rounded-xl shadow-lg transition-all font-bold text-white ${
            isModified()
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Guardar cambios
        </button>
      </div>
    </div>
  );
};

export default OrganizationSettings;
