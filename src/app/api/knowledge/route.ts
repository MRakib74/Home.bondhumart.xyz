import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

const DATA_FILE = path.join(process.cwd(), "ai-rule.json")

export async function GET() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, "utf-8")
      return NextResponse.json({ rule: data })
    }
    return NextResponse.json({ rule: "" })
  } catch (error) {
    console.error("Error reading AI rule:", error)
    return NextResponse.json({ rule: "" })
  }
}

export async function POST(req: Request) {
  try {
    const { rule } = await req.json()
    fs.writeFileSync(DATA_FILE, rule || "", "utf-8")
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error saving AI rule:", error)
    return NextResponse.json({ error: "Failed to save rule" }, { status: 500 })
  }
}
