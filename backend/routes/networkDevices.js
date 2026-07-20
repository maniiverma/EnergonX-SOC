import express from "express"
import { exec } from "child_process"

const router = express.Router()

router.get("/scan", (req, res) => {

exec("sudo arp-scan --localnet", (err, stdout) => {

if (err) {
return res.json({ error: err.message })
}

const lines = stdout.split("\n")
const devices = []

lines.forEach(line => {

const parts = line.trim().split(/\s+/)

if (parts.length >= 3 && parts[0].includes(".")) {

devices.push({
ip: parts[0],
mac: parts[1],
vendor: parts.slice(2).join(" ")
})

}

})

res.json(devices)

})

})

export default router
