const mongoose = require('mongoose')
const crypto = require('crypto')
const dns = require('dns')

const connectDB = async () => {
  try {
    // If Node is configured to use a localhost DNS server (common with adblock/VPN tools),
    // SRV lookups for mongodb+srv:// can fail with ECONNREFUSED.
    // Falling back to public resolvers keeps the app working without changing system settings.
    try {
      const servers = dns.getServers()
      if (servers.length === 1 && servers[0] === '127.0.0.1') {
        dns.setServers(['1.1.1.1', '8.8.8.8'])
      }
    } catch (_) {
      // Ignore DNS override failures; mongoose will surface the real connection error.
    }

    mongoose.connect(process.env.MONGO_URI)
    console.log(`MongoDB connected: ${conn.connection.host}`)
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`)
    process.exit(1)
  }
}

module.exports = connectDB