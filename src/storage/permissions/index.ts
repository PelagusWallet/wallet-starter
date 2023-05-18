import { sendToBackground } from "@plasmohq/messaging"
import { Storage } from "@plasmohq/storage"
import { SecureStorage } from "@plasmohq/storage/secure"

const storage = new Storage({ area: "local" })

/**
 * Approved domain object
 */
export class ApprovedDomain {
  url: string
  approvedMethods: PermissionedMethod[]
  date: Date
}

/**
 *  Permissioned method object
 */
export class PermissionedMethod {
  method: string
  type: string
}

export async function approveDomainPermissions(
  url: string,
  requestedMethods: string[]
) {
  await storage.set("approved_domains", [])
  const approvedDomains = await storage.get<ApprovedDomain[]>(
    "approved_domains"
  )
  if (approvedDomains === undefined) {
    await storage.set("approved_domains", [
      { url, approvedMethods: [], date: new Date() }
    ])
    return
  }

  let domain = approvedDomains.find((domain) => domain.url === url)
  if (domain === undefined) {
    domain = { url, approvedMethods: [], date: new Date() }
    approvedDomains.push(domain)
  }

  // Accounts should always be requested when approving a domain
  if (!requestedMethods.includes("quai_requestAccounts")) {
    requestedMethods.push("quai_requestAccounts")
  }

  // Add requested methods that are not already in approved methods
  let approvedMethods = domain.approvedMethods.map((method) => method.method)
  for (let i = 0; i < requestedMethods.length; i++) {
    if (!approvedMethods.includes(requestedMethods[i])) {
      domain.approvedMethods.push({
        method: requestedMethods[i],
        type: "read"
      })
    }
  }

  await storage.set("approved_domains", approvedDomains)
}

export async function checkPermissions(url: string, requestedMethod: string) {
  const approvedDomains = await storage.get<ApprovedDomain[]>(
    "approved_domains"
  )
  if (approvedDomains === undefined) {
    return false
  }
  const approvedDomain = approvedDomains.find((domain) => domain.url === url)
  if (approvedDomain === undefined) {
    return false
  }
  const approvedMethod = approvedDomain.approvedMethods.find(
    (method) => method.method === requestedMethod
  )
  if (approvedMethod === undefined) {
    return false
  }
  return true
}

export async function revokePermissions(url: string) {
  const approvedDomains = await storage.get<ApprovedDomain[]>(
    "approved_domains"
  )
  if (approvedDomains === undefined) {
    return
  }
  const approvedDomainIndex = approvedDomains.findIndex(
    (domain) => domain.url === url
  )
  if (approvedDomainIndex === -1) {
    return
  }
  approvedDomains.splice(approvedDomainIndex, 1)
  await storage.set("approved_domains", approvedDomains)
}
