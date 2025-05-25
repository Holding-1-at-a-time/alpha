/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 24/05/2025 - 18:15:52
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 24/05/2025
    * - Author          : rrome
    * - Modification    : 
**/
// app/providers/ClientProviders.tsx
"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@/components/theme-provider";
import { TenantProvider } from "@/lib/tenantContext";
import { AuthProvider } from "@/app/providers/AuthProvider";

export function ClientProviders({
  children,
  tenantId,
}: {
  children: React.ReactNode;
  tenantId: string;
}) {
  return (
    <SessionProvider>
      <AuthProvider>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <TenantProvider tenantId={tenantId}>
            {children}
          </TenantProvider>
        </ThemeProvider>
      </AuthProvider>
    </SessionProvider>
  );
}
