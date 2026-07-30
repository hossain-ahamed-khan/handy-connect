import ProfessionalDetails from "@/components/professionals/ProfessionalDetails";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ProfessionalDetailPage({ params }: Props) {
  const { id } = await params;
  const professionalId = Number(id);

  if (Number.isNaN(professionalId)) {
    return (
      <div className="p-6 text-red-500 text-sm font-semibold">
        Invalid professional id.
      </div>
    );
  }

  return (
    <div className="p-6">
      <ProfessionalDetails id={professionalId} />
    </div>
  );
}
