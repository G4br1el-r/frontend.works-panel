import type { EmployeerScheduleResponseType } from "@/@type/works-panel/employeer/get-employeer-schedule.type";
import { GetAllEmployeerService } from "@/app/services/works-panel/employeer/get-all-employeer.service";
import { GetEmployeerScheduleService } from "@/app/services/works-panel/employeer/get-employeer-schedule.service";
import { FadeIn } from "@/components/motion/fade-in";
import { EmptyState } from "@/components/shared/empty-state";
import { TitleSection } from "@/components/shared/title-section";
import { CreateEmployeerDialog } from "@/components/works-panel/employeers/create-employeer-dialog";
import { EmployeersTable } from "@/components/works-panel/employeers/employeers-table";

export const dynamic = "force-dynamic";

export default async function Employeer() {
  const employeers = await GetAllEmployeerService();
  const isEmptyEmployeers = employeers.length === 0;

  /**
   * Agendas buscadas em paralelo no servidor: a coluna mostra o número direto e
   * o detalhe abre sem espera. Evita a tabela disparar uma requisição por linha.
   */
  const scheduleEntries = await Promise.all(
    employeers.map(async (employeer) => {
      const schedule = await GetEmployeerScheduleService(employeer.id).catch(
        () => null,
      );
      return [employeer.id, schedule] as const;
    }),
  );

  const schedules = Object.fromEntries(
    scheduleEntries.filter(
      (entry): entry is [number, EmployeerScheduleResponseType] =>
        entry[1] !== null,
    ),
  );

  return (
    <main className="flex w-full flex-col gap-6">
      <FadeIn
        direction="up"
        distance={12}
        onMount
        className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <TitleSection
          title="Funcionários"
          subtitle="Acompanhe os colaboradores ativos e organize sua equipe em um só lugar."
        />
        <CreateEmployeerDialog />
      </FadeIn>

      {isEmptyEmployeers ? (
        <EmptyState
          icon="hardHat"
          title="Nenhum funcionário cadastrado"
          subtitle="Cadastre a equipe para acompanhar quem está em cada obra."
        />
      ) : (
        <EmployeersTable employeers={employeers} schedules={schedules} />
      )}
    </main>
  );
}
