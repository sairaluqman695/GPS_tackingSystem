//oracledb

// const express = require("express");
// const bodyParser = require("body-parser");
// const oracledb = require("oracledb");
// const path = require("path");

// const app = express();
// const PORT = 3000;

// app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "views"));

// // ✅ PROPER BODY PARSER MIDDLEWARE
// app.use(bodyParser.json({ 
//     limit: '10mb',
//     verify: (req, res, buf) => {
//         req.rawBody = buf;
//     }
// }));
// app.use(bodyParser.urlencoded({ 
//     extended: true,
//     limit: '10mb'
// }));

// // ✅ CORS ENABLE KARO
// app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Origin', '*');
//     res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
//     res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
//     if (req.method === 'OPTIONS') {
//         return res.sendStatus(200);
//     }
//     next();
// });

// const dbConfig = {
//     user: "PROD_RFID",
//     password: "oracle",
//     connectString: "192.168.1.29:1521/RFD"
// };

// // 📍 Test connection
// app.get("/api/testdb", async (req, res) => {
//     let connection;
//     try {
//         connection = await oracledb.getConnection(dbConfig);
//         const result = await connection.execute("SELECT sysdate FROM dual");
//         res.json({ message: "✅ Connected!", serverTime: result.rows[0][0] });
//     } catch (err) {
//         console.error("DB Error:", err);
//         res.status(500).json({ error: err.message });
//     } finally {
//         if (connection) await connection.close();
//     }
// });

// // 🏠 Homepage - Device selection
// app.get("/", async (req, res) => {
//     let connection;
//     try {
//         connection = await oracledb.getConnection(dbConfig);
        
//         // All active devices get karo
//         const devicesResult = await connection.execute(
//             `SELECT device_mac, device_name, vehicle_number 
//              FROM gps_devices 
//              WHERE is_active = 'YES' 
//              ORDER BY device_name`
//         );

//         let devices = [];
//         if (devicesResult.rows.length > 0) {
//             devices = devicesResult.rows.map(row => ({
//                 device_mac: row[0],
//                 device_name: row[1],
//                 vehicle_number: row[2]
//             }));
//         }

//         // Default device ka latest location
//         let gpsData = null;
//         const defaultDevice = devices.length > 0 ? devices[0].device_mac : null;
        
//         if (defaultDevice) {
//             const gpsResult = await connection.execute(
//                 `SELECT latitude, longitude, log_date 
//                  FROM gps_tracking 
//                  WHERE device_mac = :mac 
//                  ORDER BY log_date DESC FETCH FIRST 1 ROWS ONLY`,
//                 { mac: defaultDevice }
//             );

//             if (gpsResult.rows.length > 0) {
//                 const [latitude, longitude, log_date] = gpsResult.rows[0];
//                 gpsData = {
//                     latitude: Number(latitude),
//                     longitude: Number(longitude),
//                     device_mac: defaultDevice
//                 };
//             }
//         }

//         res.render("map", { 
//             gpsData, 
//             devices,
//             selectedDevice: defaultDevice 
//         });

//     } catch (err) {
//         console.error("DB Error:", err);
//         res.status(500).send("Error loading map");
//     } finally {
//         if (connection) await connection.close();
//     }
// });

// app.post("/api/gps", async (req, res) => {
//     console.log("📨 Received request body:", req.body);
    
//     const { latitude, longitude, device_mac, speed, direction } = req.body;
    
//     if (!latitude || !longitude || !device_mac) {
//         return res.status(400).json({ 
//             error: "Latitude, Longitude & Device MAC required"
//         });
//     }

//     let connection;
//     try {
//         connection = await oracledb.getConnection(dbConfig);

//         // ✅ FIXED: Better device check with error handling
//         let deviceExists = false;
//         try {
//             const deviceCheck = await connection.execute(
//                 `SELECT device_id FROM gps_devices WHERE device_mac = :mac`,
//                 { mac: device_mac }
//             );
//             deviceExists = deviceCheck.rows.length > 0;
//         } catch (err) {
//             console.log("⚠️  Device check error, assuming new device:", err.message);
//             deviceExists = false;
//         }

//         // ✅ FIXED: Only register if device doesn't exist
//         if (!deviceExists) {
//             console.log(`\n🎯 NEW DEVICE DETECTED: ${device_mac}`);
//             console.log("=====================================");
            
//             const readline = require('readline').createInterface({
//                 input: process.stdin,
//                 output: process.stdout
//             });

//             const question = (query) => new Promise((resolve) => {
//                 readline.question(query, resolve);
//             });

//             try {
//                 const deviceName = await question("📝 Enter Device Name: ");
//                 const vehicleNumber = await question("🚗 Enter Vehicle Number: ");
//                 const driverName = await question("👨‍💼 Enter Driver Name: ");

//                 // ✅ FIXED: Try-catch for device registration
//                 try {
//                     await connection.execute(
//                         `INSERT INTO gps_devices (device_mac, device_name, vehicle_number, driver_name) 
//                          VALUES (:mac, :name, :vehicle, :driver)`,
//                         {
//                             mac: device_mac,
//                             name: deviceName || `Device-${device_mac.replace(/:/g, '').slice(-6)}`,
//                             vehicle: vehicleNumber || `Vehicle-${device_mac.replace(/:/g, '').slice(-6)}`,
//                             driver: driverName || 'Not Assigned'
//                         },
//                         { autoCommit: true }
//                     );
//                     console.log(`✅ New device registered successfully!`);
//                 } catch (insertErr) {
//                     if (insertErr.errorNum === 1) {
//                         console.log("ℹ️  Device already exists in database, continuing...");
//                     } else {
//                         throw insertErr;
//                     }
//                 }
                
//             } finally {
//                 readline.close();
//             }
//         } else {
//             console.log(`📍 Existing device: ${device_mac}`);
//         }

//         await connection.execute(
//             `INSERT INTO gps_tracking (device_mac, latitude, longitude, speed, direction) 
//              VALUES (:mac, :lat, :lng, :spd, :dir)`,
//             { 
//                 mac: device_mac,
//                 lat: Number(latitude).toFixed(6),
//                 lng: Number(longitude).toFixed(6),
//                 spd: speed || '0',
//                 dir: direction || '0'
//             },
//             { autoCommit: true }
//         );

//         console.log(`📍 GPS data inserted for device: ${device_mac}`);
        
//         res.json({ 
//             message: "GPS data inserted successfully",
//             device_mac: device_mac
//         });

//     } catch (err) {
//         console.error("❌ DB Insert Error:", err);
//         res.status(500).json({ error: "Database insert failed: " + err.message });
//     } finally {
//         if (connection) await connection.close();
//     }
// });

// app.get("/api/latest", async (req, res) => {
//     const { device_mac } = req.query;
    
//     if (!device_mac) {
//         return res.status(400).json({ error: "Device MAC required" });
//     }

//     let connection;
//     try {
//         connection = await oracledb.getConnection(dbConfig);
//         const result = await connection.execute(
//             `SELECT latitude, longitude, log_date, speed, direction
//              FROM gps_tracking 
//              WHERE device_mac = :mac 
//              ORDER BY log_date DESC FETCH FIRST 1 ROWS ONLY`,
//             { mac: device_mac }
//         );

//         if (result.rows.length > 0) {
//             const [latitude, longitude, log_date, speed, direction] = result.rows[0];
//             res.json({
//                 latitude: Number(latitude),
//                 longitude: Number(longitude),
//                 log_date,
//                 speed: speed || '0',
//                 direction: direction || '0',
//                 device_mac: device_mac
//             });
//         } else {
//             res.json({ message: "No data found for this device" });
//         }
//     } catch (err) {
//         console.error("DB Fetch Error:", err);
//         res.status(500).json({ error: "Database fetch failed" });
//     } finally {
//         if (connection) await connection.close();
//     }
// });

// app.get("/api/devices", async (req, res) => {
//     let connection;
//     try {
//         connection = await oracledb.getConnection(dbConfig);
//         const result = await connection.execute(
//             `SELECT device_mac, device_name, vehicle_number, driver_name
//              FROM gps_devices 
//              WHERE is_active = 'YES' 
//              ORDER BY device_name`
//         );

//         const devices = result.rows.map(row => ({
//             device_mac: row[0],
//             device_name: row[1],
//             vehicle_number: row[2],
//             driver_name: row[3]
//         }));

//         res.json(devices);
//     } catch (err) {
//         console.error("DB Error:", err);
//         res.status(500).json({ error: err.message });
//     } finally {
//         if (connection) await connection.close();
//     }
// });

// // 📊 Device History
// app.get("/api/history/:device_mac", async (req, res) => {
//     const { device_mac } = req.params;
    
//     let connection;
//     try {
//         connection = await oracledb.getConnection(dbConfig);
//         const result = await connection.execute(
//             `SELECT latitude, longitude, log_date, speed, direction
//              FROM gps_tracking 
//              WHERE device_mac = :mac 
//              ORDER BY log_date DESC`,
//             { mac: device_mac }
//         );

//         const history = result.rows.map(row => ({
//             latitude: Number(row[0]),
//             longitude: Number(row[1]),
//             log_date: row[2],
//             speed: row[3],
//             direction: row[4]
//         }));

//         res.json(history);
//     } catch (err) {
//         console.error("DB Error:", err);
//         res.status(500).json({ error: err.message });
//     } finally {
//         if (connection) await connection.close();
//     }
// });

// // 🚀 Start server
// app.listen(PORT, () => {
//     console.log(`🚀 Server running on http://localhost:${PORT}`);
//     console.log(`✅ Database structure is perfect!`);
// });






//postgress// server.js
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const { Pool } = require("pg");

const app = express();
const PORT = process.env.PORT || 3000;

// -------------------- PostgreSQL Setup --------------------
const pool = new Pool({
  connectionString: process.env.DB_URL || process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// -------------------- Express Setup --------------------
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Body parser
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));

// CORS middleware
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

// -------------------- Routes --------------------

// Test database connection
app.get("/api/testdb", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ message: "✅ Connected to PostgreSQL!", serverTime: result.rows[0].now });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Insert GPS data + auto-register device
app.post("/api/gps", async (req, res) => {
  const { latitude, longitude, device_mac, speed, direction } = req.body;
  if (!latitude || !longitude || !device_mac)
    return res.status(400).json({ error: "Latitude, Longitude & Device MAC required" });

  try {
    const deviceCheck = await pool.query(
      `SELECT device_id FROM gps_devices WHERE device_mac=$1`,
      [device_mac]
    );

    if (deviceCheck.rows.length === 0) {
      await pool.query(
        `INSERT INTO gps_devices (device_mac, device_name, vehicle_number, driver_name, is_active)
         VALUES ($1, $2, $3, $4, 'YES')`,
        [device_mac, `Device-${device_mac.slice(-6)}`, `Vehicle-${device_mac.slice(-6)}`, "Not Assigned"]
      );
      console.log(`✅ New device registered: ${device_mac}`);
    }

    await pool.query(
      `INSERT INTO gps_tracking (device_mac, latitude, longitude, speed, direction)
       VALUES ($1, $2, $3, $4, $5)`,
      [device_mac, latitude, longitude, speed || "0", direction || "0"]
    );

    res.json({ message: "GPS data inserted successfully", device_mac });
  } catch (err) {
    console.error("❌ DB Insert Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Get latest location for a device
app.get("/api/latest", async (req, res) => {
  const { device_mac } = req.query;
  if (!device_mac) return res.status(400).json({ error: "Device MAC required" });

  try {
    const result = await pool.query(
      `SELECT latitude, longitude, log_date, speed, direction
       FROM gps_tracking WHERE device_mac=$1 ORDER BY log_date DESC LIMIT 1`,
      [device_mac]
    );

    res.json(result.rows.length > 0 ? result.rows[0] : { message: "No data found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get device history
app.get("/api/history/:device_mac", async (req, res) => {
  const { device_mac } = req.params;

  try {
    const result = await pool.query(
      `SELECT latitude, longitude, log_date, speed, direction
       FROM gps_tracking WHERE device_mac=$1 ORDER BY log_date DESC`,
      [device_mac]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// List all active devices
app.get("/api/devices", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT device_mac, device_name, vehicle_number, driver_name 
       FROM gps_devices WHERE is_active='YES' ORDER BY device_name`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------- Homepage --------------------
app.get("/", async (req, res) => {
  try {
    const devicesResult = await pool.query(
      `SELECT device_mac, device_name, vehicle_number FROM gps_devices WHERE is_active='YES' ORDER BY device_name`
    );

    const devices = devicesResult.rows;
    let gpsData = null;
    const defaultDevice = devices.length > 0 ? devices[0].device_mac : null;

    if (defaultDevice) {
      const gpsResult = await pool.query(
        `SELECT latitude, longitude, log_date FROM gps_tracking WHERE device_mac=$1 ORDER BY log_date DESC LIMIT 1`,
        [defaultDevice]
      );

      if (gpsResult.rows.length > 0) {
        const { latitude, longitude, log_date } = gpsResult.rows[0];
        gpsData = { latitude, longitude, log_date, device_mac: defaultDevice };
      }
    }

    res.render("map", { gpsData, devices, selectedDevice: defaultDevice });
  } catch (err) {
    console.error("DB Error:", err);
    res.status(500).send("Error loading map");
  }
});

// -------------------- Start Server --------------------
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`✅ Connected to PostgreSQL successfully!`);
});






//some modification in postgress code
// server.js (full)
// const express = require("express");
// const bodyParser = require("body-parser");
// const path = require("path");
// const { Pool } = require("pg");

// const app = express();
// const PORT = process.env.PORT || 3000;

// // -------------------- PostgreSQL Setup --------------------
// const pool = new Pool({
//   connectionString: process.env.DB_URL || process.env.DATABASE_URL,
//   ssl: { rejectUnauthorized: false },
// });

// // -------------------- Express Setup --------------------
// app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "views"));
// app.use(bodyParser.json({ limit: "10mb" }));
// app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));
// app.use(express.static(path.join(__dirname, "public"))); // if you have static assets

// // CORS middleware
// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept, Authorization"
//   );
//   res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
//   if (req.method === "OPTIONS") return res.sendStatus(200);
//   next();
// });

// // -------------------- Routes --------------------
// // Test DB
// app.get("/api/testdb", async (req, res) => {
//   try {
//     const result = await pool.query("SELECT NOW()");
//     res.json({ message: "✅ Connected to PostgreSQL!", serverTime: result.rows[0].now });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// /*
//   POST /api/gps
//   Behavior:
//   - Always insert a gps_tracking row (we keep tracking data).
//   - If device exists in gps_devices -> fine.
//   - If device does NOT exist:
//       * Upsert into gps_pending (insert or update last_seen + count) -- do NOT auto-insert into gps_devices.
//       * If device is in pending and rejected_until in future -> ignore (do not re-add pending).
// */
// app.post("/api/gps", async (req, res) => {
//   const { latitude, longitude, device_mac, speed, direction } = req.body;
//   if (!latitude || !longitude || !device_mac)
//     return res.status(400).json({ error: "Latitude, Longitude & Device MAC required" });

//   try {
//     // insert tracking row (always)
//     await pool.query(
//       `INSERT INTO gps_tracking (device_mac, latitude, longitude, speed, direction)
//        VALUES ($1, $2, $3, $4, $5)`,
//       [device_mac, latitude, longitude, speed || "0", direction || "0"]
//     );

//     // check if device already registered
//     const deviceCheck = await pool.query(
//       `SELECT device_id FROM gps_devices WHERE device_mac=$1`,
//       [device_mac]
//     );

//     if (deviceCheck.rows.length > 0) {
//       // device already registered
//       return res.json({ message: "GPS data inserted (device already registered)", device_mac });
//     }

//     // device not registered -> upsert pending
//     // if rejected_until in future, skip (do not re-add)
//     const pendingRow = await pool.query(
//       `SELECT id, rejected_until FROM gps_pending WHERE device_mac=$1`,
//       [device_mac]
//     );

//     const now = new Date();
//     if (pendingRow.rows.length === 0) {
//       // insert new pending
//       await pool.query(
//         `INSERT INTO gps_pending (device_mac, first_seen, last_seen, seen_count)
//          VALUES ($1, NOW(), NOW(), 1)`,
//         [device_mac]
//       );
//       console.log(`🟡 New pending device added: ${device_mac}`);
//       return res.json({ message: "GPS data inserted; device pending approval", device_mac });
//     } else {
//       const pr = pendingRow.rows[0];
//       if (pr.rejected_until && new Date(pr.rejected_until) > now) {
//         // device is rejected for a time window; don't update pending
//         console.log(`⚠️ Pending device ${device_mac} currently rejected until ${pr.rejected_until}`);
//         return res.json({ message: "GPS data inserted; device pending but currently rejected", device_mac });
//       }
//       // update pending row (last_seen + seen_count)
//       await pool.query(
//         `UPDATE gps_pending SET last_seen = NOW(), seen_count = seen_count + 1 WHERE device_mac = $1`,
//         [device_mac]
//       );
//       console.log(`🟡 Pending device updated: ${device_mac}`);
//       return res.json({ message: "GPS data inserted; device pending approval (updated)", device_mac });
//     }
//   } catch (err) {
//     console.error("❌ DB Insert Error:", err);
//     res.status(500).json({ error: err.message });
//   }
// });

// // Get pending devices (frontend will poll this)
// app.get("/api/pending", async (req, res) => {
//   try {
//     const result = await pool.query(
//       `SELECT device_mac, first_seen, last_seen, seen_count, rejected_until
//        FROM gps_pending
//        ORDER BY last_seen DESC`
//     );
//     res.json(result.rows);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Approve pending device (insert into gps_devices)
// app.post("/api/pending/approve", async (req, res) => {
//   const { device_mac, device_name, vehicle_number, driver_name } = req.body;
//   if (!device_mac) return res.status(400).json({ error: "device_mac required" });

//   try {
//     // If device already exists, just remove pending and return success (idempotent)
//     const existing = await pool.query(`SELECT device_id FROM gps_devices WHERE device_mac=$1`, [device_mac]);
//     if (existing.rows.length > 0) {
//       // ensure pending removed
//       await pool.query(`DELETE FROM gps_pending WHERE device_mac=$1`, [device_mac]);
//       return res.json({ message: "Device already registered; pending removed" });
//     }

//     // Insert into gps_devices
//     await pool.query(
//       `INSERT INTO gps_devices (device_mac, device_name, vehicle_number, driver_name, is_active, created_date)
//        VALUES ($1, $2, $3, $4, 'YES', NOW())`,
//       [device_mac, device_name || `Device-${device_mac.slice(-6)}`, vehicle_number || `Vehicle-${device_mac.slice(-6)}`, driver_name || "Not Assigned"]
//     );

//     // Remove pending
//     await pool.query(`DELETE FROM gps_pending WHERE device_mac=$1`, [device_mac]);
//     console.log(`✅ Device approved and registered: ${device_mac}`);
//     res.json({ message: "Device approved and registered", device_mac });
//   } catch (err) {
//     console.error("❌ Approve Error:", err);
//     res.status(500).json({ error: err.message });
//   }
// });

// // Reject pending device (hide for 30 minutes)
// app.post("/api/pending/reject", async (req, res) => {
//   const { device_mac, minutes = 30 } = req.body;
//   if (!device_mac) return res.status(400).json({ error: "device_mac required" });

//   try {
//     // set rejected_until = now + interval 'minutes'
//     await pool.query(
//       `UPDATE gps_pending SET rejected_until = NOW() + ($1 || ' minutes')::interval WHERE device_mac = $2`,
//       [minutes, device_mac]
//     );
//     console.log(`⛔ Device rejected: ${device_mac} for ${minutes} minutes`);
//     res.json({ message: "Device rejected temporarily", device_mac, minutes });
//   } catch (err) {
//     console.error("❌ Reject Error:", err);
//     res.status(500).json({ error: err.message });
//   }
// });

// // -------------------- API endpoints which you already had --------------------
// app.get("/api/latest", async (req, res) => {
//   const { device_mac } = req.query;
//   if (!device_mac) return res.status(400).json({ error: "Device MAC required" });

//   try {
//     const result = await pool.query(
//       `SELECT latitude, longitude, log_date, speed, direction
//        FROM gps_tracking WHERE device_mac=$1 ORDER BY log_date DESC LIMIT 1`,
//       [device_mac]
//     );

//     res.json(result.rows.length > 0 ? result.rows[0] : { message: "No data found" });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// app.get("/api/history/:device_mac", async (req, res) => {
//   const { device_mac } = req.params;
//   try {
//     const result = await pool.query(
//       `SELECT latitude, longitude, log_date, speed, direction
//        FROM gps_tracking WHERE device_mac=$1 ORDER BY log_date ASC`, // keep ASC for path order
//       [device_mac]
//     );
//     res.json(result.rows);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// app.get("/api/devices", async (req, res) => {
//   try {
//     const result = await pool.query(
//       `SELECT device_mac, device_name, vehicle_number, driver_name 
//        FROM gps_devices WHERE is_active='YES' ORDER BY device_name`
//     );
//     res.json(result.rows);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Homepage - render map
// app.get("/", async (req, res) => {
//   try {
//     const devicesResult = await pool.query(
//       `SELECT device_mac, device_name, vehicle_number FROM gps_devices WHERE is_active='YES' ORDER BY device_name`
//     );

//     const devices = devicesResult.rows;
//     let gpsData = null;
//     const defaultDevice = devices.length > 0 ? devices[0].device_mac : null;

//     if (defaultDevice) {
//       const gpsResult = await pool.query(
//         `SELECT latitude, longitude, log_date FROM gps_tracking WHERE device_mac=$1 ORDER BY log_date DESC LIMIT 1`,
//         [defaultDevice]
//       );

//       if (gpsResult.rows.length > 0) {
//         const { latitude, longitude, log_date } = gpsResult.rows[0];
//         gpsData = { latitude, longitude, log_date, device_mac: defaultDevice };
//       }
//     }

//     res.render("map", { gpsData, devices, selectedDevice: defaultDevice });
//   } catch (err) {
//     console.error("DB Error:", err);
//     res.status(500).send("Error loading map");
//   }
// });

// // Start server
// app.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
//   console.log(`✅ Connected to PostgreSQL successfully!`);
// });
