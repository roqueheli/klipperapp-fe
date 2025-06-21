"use client";

import InputField from "@/components/settings/InputField";
import { useOrganization } from "@/contexts/OrganizationContext";
import { useState } from "react";

const ConfigurationSettings = () => {
  const { data } = useOrganization();
  const [form, setForm] = useState({
    name: data?.name ?? "",
    bio: data?.bio ?? "",
    extra_discount: data?.metadata?.billing_configs?.extra_discount ?? 0,
    organization_percentage:
      data?.metadata?.billing_configs?.organization_percentage ?? 0,
    user_percentage: data?.metadata?.billing_configs?.user_percentage ?? 0,
    logo_url: "" as string | File,
    favicon: "" as string | File,
  });

  const handleChange = (field: string, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("bio", form.bio);
    formData.append("extra_discount", String(form.extra_discount));
    formData.append(
      "organization_percentage",
      String(form.organization_percentage)
    );
    formData.append("user_percentage", String(form.user_percentage));

    if (form.logo_url instanceof File) {
      formData.append("logo", form.logo_url);
    }
    if (form.favicon instanceof File) {
      formData.append("favicon", form.favicon);
    }
    console.log("Enviando cambios:", form);
    // Aquí iría el POST/PUT al backend.
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1>Información General</h1>
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

      <h1>Configuración de Facturación</h1>
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

      <h1>Archivos de Marca</h1>
      <InputField
        label="Logo (archivo)"
        onChange={(val) => handleChange("logo_url", String(val))}
        type="file"
        accept="image/png, image/jpeg, image/jpg"
      />

      <InputField
        label="Favicon (archivo)"
        onChange={(val) => handleChange("favicon", String(val))}
        type="file"
        accept="image/png, image/jpeg, image/jpg"
      />

      <div className="mt-8 w-full flex justify-end items-center">
        <button
          onClick={handleSubmit}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-all"
        >
          Guardar cambios
        </button>
      </div>
    </div>
  );
};

export default ConfigurationSettings;
