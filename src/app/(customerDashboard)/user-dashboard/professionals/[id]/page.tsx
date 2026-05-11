import ProfessionalDetails from "@/components/professionals/ProfessionalDetails";

interface Props {
  params: { id: string };
}

export default function ProfessionalDetailPage({ params }: Props) {
  const professionalId = Number(params.id);

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
