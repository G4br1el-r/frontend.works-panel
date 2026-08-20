import { GetAllCustomerService } from "@/app/services/works-panel/customer/get-all-customer.service";
import { GetAllEmployeerService } from "@/app/services/works-panel/employeer/get-all-employeer.service";
import { GetAllMaterialService } from "@/app/services/works-panel/material/get-all-material.service";
import { GetAllOrderService } from "@/app/services/works-panel/order/get-all-order.service";
import { GetBudgetService } from "@/app/services/works-panel/order/get-budget.service";
import { GetAllSegmentService } from "@/app/services/works-panel/segment/get-all-segment.service";
import { FadeIn } from "@/components/motion/fade-in";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
import { AttendanceForm } from "@/components/works-panel/new-order/attendance-form";
import { CustomerForm } from "@/components/works-panel/new-order/customer-form";
import { EmployeerForm } from "@/components/works-panel/new-order/employeer-form";
import { FinalizeForm } from "@/components/works-panel/new-order/finalize-form";
import { HeaderForm } from "@/components/works-panel/new-order/header-form";
import { HydrateFromBudget } from "@/components/works-panel/new-order/hydrate-from-budget";
import { HydrateFromOrder } from "@/components/works-panel/new-order/hydrate-from-order";
import { MaterialForm } from "@/components/works-panel/new-order/material-form";
import { PaymentForm } from "@/components/works-panel/new-order/payment-form";
import { PricingForm } from "@/components/works-panel/new-order/pricing-form";
import { ResetOrderForm } from "@/components/works-panel/new-order/reset-order-form";
import { ScheduleForm } from "@/components/works-panel/new-order/schedule-form";
import { ServiceForm } from "@/components/works-panel/new-order/service-form";
import { enrichSegmentsMaterials } from "@/lib/utils/enrich-segments-materials";

interface NewOrderPageProps {
  searchParams: Promise<{
    pedido?: string;
    editar?: string;
    duplicar?: string;
  }>;
}

function toId(value?: string) {
  if (!value) return null;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
}

export default async function NewOrderPage({
  searchParams,
}: NewOrderPageProps) {
  const { pedido, editar, duplicar } = await searchParams;
  const sourceOrderId = toId(pedido);
  const editingBudgetId = toId(editar);
  const duplicatingBudgetId = toId(duplicar);
  const budgetIdToLoad = editingBudgetId ?? duplicatingBudgetId;

  const [customers, segments, materials, employeers] = await Promise.all([
    GetAllCustomerService(),
    GetAllSegmentService({ active: true }),
    GetAllMaterialService(),
    GetAllEmployeerService(),
  ]);

  const enrichedSegments = enrichSegmentsMaterials(segments, materials);

  // Serviços de todos os segmentos: o pedido do site traz só os ids.
  const serviceItemCatalog = enrichedSegments.flatMap(
    (segment) =>
      segment.serviceItems?.map((serviceItem) => ({
        ...serviceItem,
        segment,
      })) ?? [],
  );

  // A listagem traz `items` achatado; o GET /order/:id agrupa por segmento.
  const sourceOrder = sourceOrderId
    ? ((await GetAllOrderService().catch(() => [])).find(
        (order) => order.id === sourceOrderId,
      ) ?? null)
    : null;

  const budgetToLoad = budgetIdToLoad
    ? await GetBudgetService(budgetIdToLoad).catch(() => null)
    : null;

  return (
    <main className="flex w-full min-w-0 flex-col gap-4 pb-10 sm:gap-6">
      {/* Precede as hidratações: limpa o que sobrou do orçamento anterior. */}
      <ResetOrderForm
        formKey={`${sourceOrderId ?? ""}-${editingBudgetId ?? ""}-${duplicatingBudgetId ?? ""}`}
      />

      {sourceOrder && (
        <HydrateFromOrder order={sourceOrder} catalog={serviceItemCatalog} />
      )}

      {budgetToLoad && (
        <HydrateFromBudget
          budget={budgetToLoad}
          catalog={serviceItemCatalog}
          keepId={editingBudgetId !== null}
        />
      )}

      <FadeIn
        direction="up"
        distance={12}
        onMount
        className="flex w-full min-w-0 items-start gap-3"
      >
        <HeaderForm />
      </FadeIn>

      <Stagger
        className="flex w-full min-w-0 flex-col gap-4 sm:gap-6"
        staggerDelay={0.08}
      >
        <StaggerItem className="min-w-0">
          <CustomerForm customers={customers} />
        </StaggerItem>
        <StaggerItem className="min-w-0">
          <ScheduleForm />
        </StaggerItem>
        <StaggerItem className="min-w-0">
          <AttendanceForm />
        </StaggerItem>
        <StaggerItem className="min-w-0">
          <ServiceForm segments={enrichedSegments} />
        </StaggerItem>
        <StaggerItem className="min-w-0">
          <MaterialForm materials={materials} />
        </StaggerItem>
        <StaggerItem className="min-w-0">
          <EmployeerForm employeers={employeers} />
        </StaggerItem>
        <StaggerItem className="min-w-0">
          <PricingForm />
        </StaggerItem>
        <StaggerItem className="min-w-0">
          <PaymentForm />
        </StaggerItem>
        <StaggerItem className="min-w-0">
          <FinalizeForm />
        </StaggerItem>
      </Stagger>
    </main>
  );
}
