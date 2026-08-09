"use client";

import Link from "next/link";
import { FadeIn } from "@/components/motion/fade-in";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
import { InputComponent } from "@/components/shared/input-component";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  return (
    <FadeIn
      as="main"
      direction="up"
      distance={20}
      duration={0.5}
      onMount
      className="flex w-full max-w-sm flex-col gap-6 rounded-lg border border-panel-border bg-panel-surface p-6 shadow-sm sm:p-8"
    >
      <Stagger
        as="div"
        onMount
        staggerDelay={0.08}
        delay={0.15}
        className="flex flex-col gap-6"
      >
        <StaggerItem className="flex flex-col gap-1 text-center">
          <h1 className="font-display text-xl text-panel-surface-foreground">
            Entrar
          </h1>
          <p className="text-sm text-panel-muted-foreground">
            Acesse sua conta para continuar.
          </p>
        </StaggerItem>

        <StaggerItem as="form" className="flex flex-col gap-4">
          <InputComponent.root>
            <InputComponent.label
              label="E-mail"
              htmlFor="email"
              classNameLabel="text-sm font-medium text-panel-surface-foreground"
            />
            <InputComponent.wrapper
              iconName="mail"
              classNameWrapper="h-11 rounded-lg border border-panel-border bg-panel-page/60 focus-within:border-panel-accent focus-within:ring-2 focus-within:ring-panel-accent/20"
              classNameIcon="text-panel-muted-foreground"
            >
              <InputComponent.inputBase
                id="email"
                type="email"
                placeHolder="voce@exemplo.com"
                className="bg-transparent text-base text-panel-surface-foreground placeholder:text-panel-muted-foreground sm:text-sm"
              />
            </InputComponent.wrapper>
          </InputComponent.root>

          <InputComponent.root>
            <div className="flex w-full items-center justify-between">
              <InputComponent.label
                label="Senha"
                htmlFor="password"
                classNameLabel="text-sm font-medium text-panel-surface-foreground"
              />
              <Link
                href="#"
                className="text-xs font-medium text-panel-accent hover:underline"
              >
                Esqueceu a senha?
              </Link>
            </div>
            <InputComponent.wrapper
              iconName="lock"
              isPassword
              showPassword={false}
              classNameWrapper="h-11 rounded-lg border border-panel-border bg-panel-page/60 focus-within:border-panel-accent focus-within:ring-2 focus-within:ring-panel-accent/20"
              classNameIcon="text-panel-muted-foreground"
            >
              <InputComponent.password
                id="password"
                showPassword={false}
                placeHolder="••••••••"
                className="bg-transparent text-base text-panel-surface-foreground placeholder:text-panel-muted-foreground sm:text-sm"
              />
            </InputComponent.wrapper>
          </InputComponent.root>

          <Button asChild className="mt-2 h-11 w-full">
            <Link href="/gestao-obras/funcionarios">Entrar</Link>
          </Button>
        </StaggerItem>
      </Stagger>
    </FadeIn>
  );
}
