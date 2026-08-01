import Image from "next/image";
import Link from "next/link";
import { SITE_HEADER_LOGO } from "@/utils/constants";

export function HeaderLogo() {
  return (
    <Link href="#inicio" aria-label="Ir para o início" className="relative block size-11 shrink-0 sm:size-13">
      <Image src={SITE_HEADER_LOGO} alt="Guilherme Goulart" fill priority sizes="52px" className="object-contain" />
    </Link>
  );
}
