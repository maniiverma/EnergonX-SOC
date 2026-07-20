import fs from "fs"
import path from "path"

const vendorFile = path.resolve("backend/data/mac-vendors.txt")

let vendorDB = {}

export const loadVendors = () => {
  const data = fs.readFileSync(vendorFile, "utf8")
  const lines = data.split("\n")

  lines.forEach(line => {
    const parts = line.split("\t")
    if (parts.length >= 2) {
      const prefix = parts[0].toUpperCase()
      const vendor = parts[1]
      vendorDB[prefix] = vendor
    }
  })
}

export const getVendor = (mac) => {
  const prefix = mac.toUpperCase().substring(0,8)
  return vendorDB[prefix] || "Unknown"
}
