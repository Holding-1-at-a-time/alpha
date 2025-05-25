/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 24/05/2025 - 17:16:50
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 24/05/2025
    * - Author          : rrome
    * - Modification    : 
**/


export function getTenantFromRequest(request: NextRequest): string | null {
  const tenantFromCookie = request.cookies.get("tenantId")?.value
  if (tenantFromCookie) {
    return tenantFromCookie
  }

  const hostname = request.headers.get("host") || ""
  const parts = hostname.split(".")

  if (parts.length > 2) {
    const subdomain = parts[0]
    if (subdomain !== "www") {
      return subdomain
    }
  }

  const pathParts = request.nextUrl.pathname.split("/")
  if (pathParts.length > 1 && pathParts[1]) {
    return pathParts[1]
  }

  return null
}
