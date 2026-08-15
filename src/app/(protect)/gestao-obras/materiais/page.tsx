import { GetAllMaterialService } from "@/app/services/works-panel/material/get-all-material.service";
import { GetAllMeasureService } from "@/app/services/works-panel/measure/get-all-measure.service";
import { FadeIn } from "@/components/motion/fade-in";
import { EmptyState } from "@/components/shared/empty-state";
import { TitleSection } from "@/components/shared/title-section";
import { CreateMaterialDialog } from "@/components/works-panel/material/create-material-dialog";
import { MaterialsTable } from "@/components/works-panel/material/materials-table";

export default async function Material() {
  const [materials, measures] = await Promise.all([
    GetAllMaterialService(),
    GetAllMeasureService(),
  ]);
  const isEmptyMaterials = materials.length === 0;

  return (
    <main className="flex w-full flex-col gap-6">
      <FadeIn
        direction="up"
        distance={12}
        onMount
        className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <TitleSection
          title="Materiais"
          subtitle="Centralize os insumos da sua obra com preço de referência para agilizar cada orçamento."
        />
        <CreateMaterialDialog measures={measures} />
      </FadeIn>
      {isEmptyMaterials ? (
        <EmptyState
          icon="package"
          title="Nenhum material cadastrado"
          subtitle="Cadastre os materiais que você usa nas obras para reaproveitar nos orçamentos."
        />
      ) : (
        <MaterialsTable materials={materials} measures={measures} />
      )}
    </main>
  );
}
