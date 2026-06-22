import prisma from "./prisma"

export async function sendOrderNotification(order: any, messageText: string, invoicePdfUrl?: string) {
  const evolutionUrl = process.env.EVOLUTION_API_URL
  const instanceName = process.env.EVOLUTION_INSTANCE_NAME
  const apikey = process.env.EVOLUTION_API_KEY
  
  const phone = order.phone || order.customer?.phone || ''
  if (!phone) return

  const cleanPhone = phone.replace(/[^0-9]/g, '')
  const formattedPhone = cleanPhone.startsWith('880') ? cleanPhone : (cleanPhone.startsWith('0') ? '88' + cleanPhone : '880' + cleanPhone)

  let sentViaWhatsApp = false
  let errorMsg = null

  if (evolutionUrl && instanceName && apikey) {
    try {
      const checkRes = await fetch(`${evolutionUrl}/chat/whatsappNumbers/${instanceName}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "apikey": apikey },
        body: JSON.stringify({ numbers: [formattedPhone] })
      })

      if (checkRes.ok) {
        const checkData = await checkRes.json()
        const exists = checkData[0]?.exists || false

        if (exists) {
          const remoteJid = checkData[0].jid

          if (invoicePdfUrl) {
            await fetch(`${evolutionUrl}/message/sendMedia/${instanceName}`, {
              method: "POST",
              headers: { "Content-Type": "application/json", "apikey": apikey },
              body: JSON.stringify({
                number: remoteJid,
                options: { delay: 1200, presence: "composing" },
                mediaMessage: {
                  mediatype: "document",
                  caption: messageText,
                  media: invoicePdfUrl,
                  fileName: `Invoice_Order_${order.bondhumartId || order.id}.pdf`
                }
              })
            })
          } else {
            await fetch(`${evolutionUrl}/message/sendText/${instanceName}`, {
              method: "POST",
              headers: { "Content-Type": "application/json", "apikey": apikey },
              body: JSON.stringify({
                number: remoteJid,
                options: { delay: 1200, presence: "composing" },
                textMessage: { text: messageText }
              })
            })
          }

          sentViaWhatsApp = true
        } else {
          errorMsg = 'No WhatsApp account found for this number.'
        }
      } else {
        errorMsg = `API Error: ${checkRes.status}`
      }
    } catch (error: any) {
      errorMsg = error.message
      console.error("Evolution API Check/Send Error:", error)
    }
  } else {
    errorMsg = 'Evolution API not configured in .env'
  }

  if (sentViaWhatsApp) {
    await prisma.messageLog.create({
      data: {
        phone: formattedPhone,
        type: 'WhatsApp',
        status: 'success',
        content: messageText,
      }
    })
  } else {
    // Log WhatsApp failure
    await prisma.messageLog.create({
      data: {
        phone: formattedPhone,
        type: 'WhatsApp',
        status: 'failed',
        content: messageText,
        error: errorMsg || 'Unknown error'
      }
    })

    // Try SMS Fallback
    await sendFallbackSMS(formattedPhone, messageText)
  }
}

async function sendFallbackSMS(phone: string, text: string) {
  const smsApiUrl = process.env.SMS_API_URL
  const smsApiKey = process.env.SMS_API_KEY
  const smsSenderId = process.env.SMS_SENDER_ID

  if (!smsApiUrl || !smsApiKey) {
    await prisma.messageLog.create({
      data: {
        phone,
        type: 'SMS',
        status: 'failed',
        content: text,
        error: 'SMS Gateway not configured'
      }
    })
    return
  }

  try {
    const res = await fetch(smsApiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: smsApiKey,
        senderid: smsSenderId,
        number: phone,
        message: text
      })
    })

    if (res.ok) {
      await prisma.messageLog.create({
        data: {
          phone,
          type: 'SMS',
          status: 'success',
          content: text
        }
      })
    } else {
      await prisma.messageLog.create({
        data: {
          phone,
          type: 'SMS',
          status: 'failed',
          content: text,
          error: `SMS Gateway returned ${res.status}`
        }
      })
    }
  } catch (err: any) {
    await prisma.messageLog.create({
      data: {
        phone,
        type: 'SMS',
        status: 'failed',
        content: text,
        error: err.message || 'Network error'
      }
    })
  }
}
