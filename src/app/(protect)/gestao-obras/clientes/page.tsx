import { GetAllCustomerService } from "@/app/services/works-panel/customer/get-all-customer.service";
import { FadeIn } from "@/components/motion/fade-in";
import { EmptyState } from "@/components/shared/empty-state";
import { TitleSection } from "@/components/shared/title-section";
import { CreateCustomerDialog } from "@/components/works-panel/customers/create-customer-dialog";
import { CustomersTable } from "@/components/works-panel/customers/customers-table";

export default async function Customer() {
  const customers = await GetAllCustomerService();
  const isEmptyCustomers = customers.length === 0;

  return (
    <main className="flex w-full flex-col gap-6">
      <FadeIn
        direction="up"
        distance={12}
        onMount
        className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <TitleSection title="Clientes" subtitle="Acompanhe os clientes cadastrados e seus dados de contato." />
        <CreateCustomerDialog />
      </FadeIn>

      {isEmptyCustomers ? (
        <EmptyState
          icon="user"
          title="Nenhum cliente cadastrado"
          subtitle="Os clientes aparecem aqui assim que se identificam no site para solicitar um orçamento."
        />
      ) : (
        <CustomersTable customers={customers} />
      )}
    </main>
  );
}
