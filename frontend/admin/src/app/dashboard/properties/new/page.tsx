"use client";

import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { PropertyForm } from "@/components/properties/property-form";
import { createProperty } from "@/lib/properties";
import type { PropertyFormValues } from "@/types/property";

export default function NewPropertyPage() {
  const router = useRouter();

  async function handleSubmit(values: PropertyFormValues) {
    const property = await createProperty(values);
    router.push(`/dashboard/properties/${property.id}`);
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-text sm:text-3xl">
          Ajouter un bien
        </h1>
        <p className="mt-1 text-sm text-text-muted">
          Renseignez les informations du nouveau bien immobilier.
        </p>
      </div>

      <Card className="w-full max-w-3xl">
        <PropertyForm submitLabel="Créer le bien" onSubmit={handleSubmit} />
      </Card>
    </div>
  );
}
