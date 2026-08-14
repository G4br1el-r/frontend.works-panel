import { GetAllSegmentService } from "@/app/services/works-panel/segment/get-all-segment.service";
import { FadeIn } from "@/components/motion/fade-in";
import { EmptyState } from "@/components/shared/empty-state";
import { TitleSection } from "@/components/shared/title-section";
import { CreateSegmentDialog } from "@/components/works-panel/segment/create-segment-dialog";
import { SegmentsTable } from "@/components/works-panel/segment/segments-table";

export default async function Segment() {
  const segments = await GetAllSegmentService();
  const isEmptySegments = segments.length === 0;

  return (
    <main className="flex w-full flex-col gap-6">
      <FadeIn
        direction="up"
        distance={12}
        onMount
        className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <TitleSection
          title="Segmentos"
          subtitle="Estruture as frentes de serviço da sua obra e mantenha cada especialidade sob controle, do orçamento à entrega."
        />
        <CreateSegmentDialog />
      </FadeIn>
      {isEmptySegments ? (
        <EmptyState
          icon="layers"
          title="Nenhum segmento cadastrado"
          subtitle="Cadastre os segmentos para organizar as frentes de serviço da sua obra."
        />
      ) : (
        <SegmentsTable segments={segments} />
      )}
    </main>
  );
}
