import { GetAllMeasureService } from "@/app/services/works-panel/measure/get-all-measure.service";
import { FadeIn } from "@/components/motion/fade-in";
import { EmptyState } from "@/components/shared/empty-state";
import { TitleSection } from "@/components/shared/title-section";
import { CreateMeasureDialog } from "@/components/works-panel/measure/create-measure-dialog";
import { MeasuresTable } from "@/components/works-panel/measure/measures-table";

export default async function Measure() {
  const measures = await GetAllMeasureService();
  const isEmptyMeasures = measures.length === 0;

  return (
    <main className="flex w-full flex-col gap-6">
      <FadeIn
        direction="up"
        distance={12}
        onMount
        className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <TitleSection
          title="Medidas"
          subtitle="Padronize as unidades usadas nos seus serviços e materiais para manter os orçamentos consistentes."
        />
        <CreateMeasureDialog />
      </FadeIn>
      {isEmptyMeasures ? (
        <EmptyState
          icon="ruler"
          title="Nenhuma medida cadastrada"
          subtitle="Cadastre as medidas para usar como unidade nos serviços e materiais."
        />
      ) : (
        <MeasuresTable measures={measures} />
      )}
    </main>
  );
}
