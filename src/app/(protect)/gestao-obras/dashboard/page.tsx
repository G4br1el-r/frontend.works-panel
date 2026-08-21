import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { GetAllCustomerService } from "@/app/services/works-panel/customer/get-all-customer.service";
import { GetDashboardService } from "@/app/services/works-panel/dashboard/get-dashboard.service";
import { FadeIn } from "@/components/motion/fade-in";
import { TitleSection } from "@/components/shared/title-section";
import { DashboardFilters } from "@/components/works-panel/dashboard/dashboard-filters";
import { DashboardKpis } from "@/components/works-panel/dashboard/dashboard-kpis";
import { DashboardOverview } from "@/components/works-panel/dashboard/dashboard-overview";
import { OccupationCard } from "@/components/works-panel/dashboard/occupation-card";
import { RevenueChart } from "@/components/works-panel/dashboard/revenue-chart";
import { StatusChart } from "@/components/works-panel/dashboard/status-chart";
import { TopRanking } from "@/components/works-panel/dashboard/top-ranking";
import {
  UpcomingInstallments,
  UpcomingWorks,
} from "@/components/works-panel/dashboard/upcoming-lists";
import { cn } from "@/lib/utils/cn";
import { toRevenueSeries, toStatusSlices } from "@/lib/utils/dashboard";

export const dynamic = "force-dynamic";

interface DashboardPageProps {
  searchParams: Promise<{
    from?: string;
    to?: string;
    customerIds?: string;
  }>;
}

/** Aceita só o que o backend valida — param estranho lá derruba com 400. */
function parseCustomerIds(raw: string | undefined): number[] {
  if (!raw) return [];

  return raw
    .split(",")
    .map((value) => Number(value.trim()))
    .filter((value) => Number.isInteger(value) && value > 0);
}

function Panel({
  title,
  hint,
  children,
  className,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "flex min-w-0 flex-col gap-4 rounded-xl border border-panel-border bg-panel-surface p-4 sm:p-5",
        className,
      )}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <h2 className="font-medium text-[11px] text-panel-muted-foreground uppercase tracking-wider">
          {title}
        </h2>
        {hint && (
          <span className="text-panel-muted-foreground text-xs">{hint}</span>
        )}
      </div>
      {children}
    </section>
  );
}

export default async function Dashboard({ searchParams }: DashboardPageProps) {
  const params = await searchParams;
  const customerIds = parseCustomerIds(params.customerIds);
  // Sem período na URL, o dashboard mostra todo o histórico.
  const range = { from: params.from ?? null, to: params.to ?? null };

  const [data, customers] = await Promise.all([
    GetDashboardService({ range, customerIds }),
    GetAllCustomerService(),
  ]);

  /**
   * Sem filtro de data o backend mede a ocupação do mês corrente, não do
   * histórico — diferente dos outros blocos. O rótulo deixa isso explícito.
   */
  const occupationHint =
    range.from || range.to
      ? "No período filtrado"
      : format(new Date(), "'Em' MMMM", { locale: ptBR });

  const statusSlices = toStatusSlices(data.statusBreakdown);
  const revenueSeries = toRevenueSeries(data.revenueSeries);

  return (
    <main className="flex w-full min-w-0 flex-col gap-6">
      <FadeIn
        direction="up"
        distance={12}
        onMount
        className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <TitleSection
          title="Dashboard"
          subtitle="Visão consolidada do período: o que foi orçado, o que fechou e o que está agendado."
        />
        <DashboardFilters
          customers={customers.map((customer) => ({
            id: customer.id,
            name: customer.name,
          }))}
          from={range.from}
          to={range.to}
          customerIds={customerIds}
        />
      </FadeIn>

      <DashboardOverview overview={data.overview} />

      <DashboardKpis kpis={data.kpis} />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Panel
          title="Receita por mês"
          hint="Em atraso já está contido em a receber"
          className="xl:col-span-2"
        >
          <RevenueChart series={revenueSeries} />
        </Panel>

        <Panel title="Orçamentos por situação">
          {statusSlices.length > 0 ? (
            <StatusChart slices={statusSlices} />
          ) : (
            <p className="rounded-lg border border-panel-border border-dashed bg-panel-page/40 p-4 text-center text-panel-muted-foreground text-sm">
              Nenhum orçamento no período.
            </p>
          )}
        </Panel>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
        <Panel title="Serviços mais vendidos">
          <TopRanking
            items={data.topServices}
            countLabel={(count) => `${count} vendidos`}
            emptyMessage="Nenhum serviço no período."
          />
        </Panel>

        <Panel title="Segmentos mais rentáveis">
          <TopRanking
            items={data.topSegments}
            countLabel={(count) => `${count} vendidos`}
            emptyMessage="Nenhum segmento no período."
          />
        </Panel>

        <Panel title="Clientes por receita">
          <TopRanking
            items={data.topCustomers}
            countLabel={(count) =>
              count === 1 ? "1 orçamento" : `${count} orçamentos`
            }
            emptyMessage="Nenhum cliente no período."
          />
        </Panel>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Panel title="Ocupação da agenda" hint={occupationHint}>
          <OccupationCard occupation={data.occupation} />
        </Panel>

        <Panel title="Próximos vencimentos" hint="A partir de hoje">
          <UpcomingInstallments installments={data.upcomingInstallments} />
        </Panel>

        <Panel title="Próximas obras" hint="A partir de hoje">
          <UpcomingWorks works={data.upcomingWorks} />
        </Panel>
      </div>
    </main>
  );
}
