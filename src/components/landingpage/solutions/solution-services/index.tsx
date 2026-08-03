import { ServiceItem } from "@/components/landingpage/solutions/solution-services/service-item";
import { FadeIn } from "@/components/motion/fade-in";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
import { NOTCHED_CARD_CLIP_PATH } from "@/utils/constants";

interface SolutionServicesProps {
  servicos: string[];
  solutionLabel: string;
}

export function SolutionServices({
  servicos,
  solutionLabel,
}: SolutionServicesProps) {
  return (
    <div>
      <FadeIn
        direction="up"
        distance={16}
        duration={0.5}
        className="mt-10 flex items-center gap-2 text-[0.7rem] font-semibold tracking-[0.15em] text-brand sm:mt-12 sm:text-xs sm:tracking-[0.2em] md:tracking-[0.25em]"
      >
        <span
          className="animate-brand-dot size-1.5 shrink-0 rounded-full bg-brand motion-reduce:animate-none"
          aria-hidden="true"
        />
        ADICIONE OS SERVIÇOS DESEJADOS
      </FadeIn>

      <Stagger
        as="ul"
        staggerDelay={0.12}
        className="mt-6 grid grid-cols-1 gap-3 sm:mt-8 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3"
      >
        {servicos.map((servico) => (
          <StaggerItem
            key={servico}
            as="li"
            direction="up"
            distance={16}
            duration={0.35}
          >
            <div
              className="group relative flex items-center gap-3 overflow-hidden border border-brand/20 bg-black/50 p-4 backdrop-blur-md transition-all duration-500 ease-out hover:border-brand/60 hover:bg-black/70 sm:gap-4 sm:p-5 md:p-6"
              style={{ clipPath: NOTCHED_CARD_CLIP_PATH }}
            >
              <ServiceItem servico={servico} solutionLabel={solutionLabel} />
            </div>
          </StaggerItem>
        ))}
      </Stagger>
    </div>
  );
}
