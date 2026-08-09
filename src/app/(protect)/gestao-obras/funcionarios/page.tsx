import { GetAllEmployeerService } from "@/app/services/works-panel/employeer/get-all-employeer.service";
import { FadeIn } from "@/components/motion/fade-in";
import { TitleSection } from "@/components/shared/title-section";
import { CreateEmployeerDialog } from "@/components/works-panel/employeers/create-employeer-dialog";
import { EmployeersTable } from "@/components/works-panel/employeers/employeers-table";
import { EmptyEmployeers } from "@/components/works-panel/employeers/empty-employeers";

export default async function Employeer() {
  const employeers = await GetAllEmployeerService();
  const isEmptyEmployeers = employeers.length === 0;

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
        <EmptyEmployeers />
      ) : (
        <EmployeersTable employeers={employeers} />
      )}
    </main>
  );
}
