import { GetAllMaterialService } from "@/app/services/works-panel/material/get-all-material.service";
import { GetAllMeasureService } from "@/app/services/works-panel/measure/get-all-measure.service";
import { GetAllSegmentService } from "@/app/services/works-panel/segment/get-all-segment.service";
import { GetAllServiceItemService } from "@/app/services/works-panel/service-item/get-all-service-item.service";
import { FadeIn } from "@/components/motion/fade-in";
import { EmptyState } from "@/components/shared/empty-state";
import { TitleSection } from "@/components/shared/title-section";
import { CreateServiceItemDialog } from "@/components/works-panel/service-item/create-service-item-dialog";
import { ServiceItemsTable } from "@/components/works-panel/service-item/service-items-table";

export default async function ServiceItem() {
  const [serviceItems, measures, segments, materials] = await Promise.all([
    GetAllServiceItemService(),
    GetAllMeasureService(),
    GetAllSegmentService(),
    GetAllMaterialService(),
  ]);
  const isEmptyServiceItems = serviceItems.length === 0;

  return (
    <main className="flex w-full flex-col gap-6">
      <FadeIn
        direction="up"
        distance={12}
        onMount
        className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <TitleSection
          title="Serviços"
          subtitle="Monte o catálogo de serviços da sua obra com preço, medida e os materiais que cada execução consome."
        />
        <CreateServiceItemDialog
          measures={measures}
          segments={segments}
          materials={materials}
        />
      </FadeIn>
      {isEmptyServiceItems ? (
        <EmptyState
          icon="wrench"
          title="Nenhum serviço cadastrado"
          subtitle="Cadastre os serviços que você executa para reaproveitar nos orçamentos."
        />
      ) : (
        <ServiceItemsTable
          serviceItems={serviceItems}
          measures={measures}
          segments={segments}
          materials={materials}
        />
      )}
    </main>
  );
}
