// const express = require("express");
// const bodyParser = require("body-parser");
// const oracledb = require("oracledb");

// const app = express();
// const PORT = 3000;
// const path = require("path");
// app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "views"));

// // Middleware
// app.use(bodyParser.json());

// // Oracle DB Config (use your details)
// const dbConfig = {
//   user: "PROD_RFID",
//   password: "oracle",
//   connectString: "192.168.1.29:1521/RFD"
// };

// // Test connection endpoint
// app.get("/api/testdb", async (req, res) => {
//   let connection;
//   try {
//     connection = await oracledb.getConnection(dbConfig);
//     const result = await connection.execute("SELECT sysdate FROM dual");
//     res.json({ message: "✅ Connected!", serverTime: result.rows[0][0] });
//   } catch (err) {
//     console.error("DB Error:", err);
//     res.status(500).json({ error: err.message });
//   } finally {
//     if (connection) await connection.close();
//   }
// });

// // app.get("/", (req, res) => {
// //   res.send("🚀 GPS Tracking Server is running!");
// // });

// // Serve Google Map with latest GPS data
// app.get("/", async (req, res) => {
//   let connection;
//   try {
//     connection = await oracledb.getConnection(dbConfig);
//     const result = await connection.execute(
//       `SELECT latitude, longitude, log_date 
//        FROM vehicle_tracking 
//        ORDER BY id DESC FETCH FIRST 1 ROWS ONLY`
//     );

//     let gpsData = null;
//     if (result.rows.length > 0) {
//       const [latitude, longitude, log_date] = result.rows[0];
//       gpsData = { latitude, longitude, log_date };
//     }

//     res.render("map", { gpsData });
//   } catch (err) {
//     console.error("DB Fetch Error:", err);
//     res.status(500).send("Error loading map");
//   } finally {
//     if (connection) await connection.close();
//   }
// });

// // Insert GPS data
// app.post("/api/gps", async (req, res) => {
//   const { latitude, longitude } = req.body;

//   if (!latitude || !longitude) {
//     return res.status(400).json({ error: "Latitude & Longitude required" });
//   }

//   let connection;
//   try {
//     connection = await oracledb.getConnection(dbConfig);

//     await connection.execute(
//       `INSERT INTO vehicle_tracking (latitude, longitude) VALUES (:lat, :lng)`,
//       { lat: latitude, lng: longitude },
//       { autoCommit: true }
//     );

//     res.json({ message: "GPS data inserted successfully" });
//   } catch (err) {
//     console.error("DB Insert Error:", err);
//     res.status(500).json({ error: "Database insert failed" });
//   } finally {
//     if (connection) await connection.close();
//   }
// });

// // Fetch latest location
// app.get("/api/latest", async (req, res) => {
//   let connection;
//   try {
//     connection = await oracledb.getConnection(dbConfig);
//     const result = await connection.execute(
//       `SELECT latitude, longitude, log_date 
//        FROM vehicle_tracking 
//        ORDER BY id DESC FETCH FIRST 1 ROWS ONLY`
//     );

//     if (result.rows.length > 0) {
//       const [latitude, longitude, log_date] = result.rows[0];
//       res.json({ latitude, longitude, log_date });
//     } else {
//       res.json({ message: "No data found" });
//     }
//   } catch (err) {
//     console.error("DB Fetch Error:", err);
//     res.status(500).json({ error: "Database fetch failed" });
//   } finally {
//     if (connection) await connection.close();
//   }
// });

// // Start server
// app.listen(PORT, () => {
//   console.log(`🚀 Server running on http://localhost:${PORT}`);
// });






// const express = require("express");
// const bodyParser = require("body-parser");
// const oracledb = require("oracledb");
// const path = require("path");

// const app = express();
// const PORT = 3000;

// app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "views"));

// // Middleware
// app.use(bodyParser.json());

// // Oracle DB Config (replace with your details)
// const dbConfig = {
//   user: "PROD_RFID",
//   password: "oracle",
//   connectString: "192.168.1.29:1521/RFD"
// };

// // Test connection endpoint
// app.get("/api/testdb", async (req, res) => {
//   let connection;
//   try {
//     connection = await oracledb.getConnection(dbConfig);
//     const result = await connection.execute("SELECT sysdate FROM dual");
//     res.json({ message: "✅ Connected!", serverTime: result.rows[0][0] });
//   } catch (err) {
//     console.error("DB Error:", err);
//     res.status(500).json({ error: err.message });
//   } finally {
//     if (connection) await connection.close();
//   }
// });

// // Serve Google Map with latest GPS data
// app.get("/", async (req, res) => {
//   let connection;
//   try {
//     connection = await oracledb.getConnection(dbConfig);
//     const result = await connection.execute(
//       `SELECT latitude, longitude, log_date 
//        FROM vehicle_tracking 
//        ORDER BY id DESC FETCH FIRST 1 ROWS ONLY`
//     );

//     let gpsData = null;
//     if (result.rows.length > 0) {
//       const [latitude, longitude] = result.rows[0];
//       gpsData = {
//         latitude: Number(latitude),
//         longitude: Number(longitude)
//       };
//     }

//     res.render("map", { gpsData });
//   } catch (err) {
//     console.error("DB Fetch Error:", err);
//     res.status(500).send("Error loading map");
//   } finally {
//     if (connection) await connection.close();
//   }
// });

// // Insert GPS data
// app.post("/api/gps", async (req, res) => {
//   const { latitude, longitude } = req.body;
//   if (!latitude || !longitude) {
//     return res.status(400).json({ error: "Latitude & Longitude required" });
//   }

//   let connection;
//   try {
//     connection = await oracledb.getConnection(dbConfig);
//     await connection.execute(
//       `INSERT INTO vehicle_tracking (latitude, longitude) VALUES (:lat, :lng)`,
//       { lat: Number(latitude), lng: Number(longitude) },
//       { autoCommit: true }
//     );
//     res.json({ message: "GPS data inserted successfully" });
//   } catch (err) {
//     console.error("DB Insert Error:", err);
//     res.status(500).json({ error: "Database insert failed" });
//   } finally {
//     if (connection) await connection.close();
//   }
// });

// // Fetch latest location
// app.get("/api/latest", async (req, res) => {
//   let connection;
//   try {
//     connection = await oracledb.getConnection(dbConfig);
//     const result = await connection.execute(
//       `SELECT latitude, longitude, log_date 
//        FROM vehicle_tracking 
//        ORDER BY id DESC FETCH FIRST 1 ROWS ONLY`
//     );

//     if (result.rows.length > 0) {
//       const [latitude, longitude, log_date] = result.rows[0];
//       res.json({
//         latitude: Number(latitude),
//         longitude: Number(longitude),
//         log_date
//       });
//     } else {
//       res.json({ message: "No data found" });
//     }
//   } catch (err) {
//     console.error("DB Fetch Error:", err);
//     res.status(500).json({ error: "Database fetch failed" });
//   } finally {
//     if (connection) await connection.close();
//   }
// });

// // Start server
// app.listen(PORT, () => {
//   console.log(`🚀 Server running on http://localhost:${PORT}`);
// });








// const express = require("express");
// const bodyParser = require("body-parser");
// const oracledb = require("oracledb");
// const path = require("path");

// const app = express();
// const PORT = 3000;

// app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "views"));
// app.use(bodyParser.json());

// const dbConfig = {
//   user: "PROD_RFID",
//   password: "oracle",
//   connectString: "192.168.1.29:1521/RFD"
// };

// // 📍 Test connection
// app.get("/api/testdb", async (req, res) => {
//   let connection;
//   try {
//     connection = await oracledb.getConnection(dbConfig);
//     const result = await connection.execute("SELECT sysdate FROM dual");
//     res.json({ message: "✅ Connected!", serverTime: result.rows[0][0] });
//   } catch (err) {
//     console.error("DB Error:", err);
//     res.status(500).json({ error: err.message });
//   } finally {
//     if (connection) await connection.close();
//   }
// });

// // 🏠 Homepage - Device selection
// app.get("/", async (req, res) => {
//   let connection;
//   try {
//     connection = await oracledb.getConnection(dbConfig);
    
//     // All active devices get karo
//     const devicesResult = await connection.execute(
//       `SELECT device_mac, device_name, vehicle_number 
//        FROM gps_devices 
//        WHERE is_active = 'YES' 
//        ORDER BY device_name`
//     );

//     let devices = [];
//     if (devicesResult.rows.length > 0) {
//       devices = devicesResult.rows.map(row => ({
//         device_mac: row[0],
//         device_name: row[1],
//         vehicle_number: row[2]
//       }));
//     }

//     // Default device ka latest location
//     let gpsData = null;
//     const defaultDevice = devices.length > 0 ? devices[0].device_mac : null;
    
//     if (defaultDevice) {
//       const gpsResult = await connection.execute(
//         `SELECT latitude, longitude, log_date 
//          FROM gps_tracking 
//          WHERE device_mac = :mac 
//          ORDER BY log_date DESC FETCH FIRST 1 ROWS ONLY`,
//         { mac: defaultDevice }
//       );

//       if (gpsResult.rows.length > 0) {
//         const [latitude, longitude, log_date] = gpsResult.rows[0];
//         gpsData = {
//           latitude: Number(latitude),
//           longitude: Number(longitude),
//           device_mac: defaultDevice
//         };
//       }
//     }

//     res.render("map", { 
//       gpsData, 
//       devices,
//       selectedDevice: defaultDevice 
//     });

//   } catch (err) {
//     console.error("DB Error:", err);
//     res.status(500).send("Error loading map");
//   } finally {
//     if (connection) await connection.close();
//   }
// });

// // 📍 GPS Data Receive - Multiple Devices Support
// app.post("/api/gps", async (req, res) => {
//   const { latitude, longitude, device_mac, speed, direction } = req.body;
  
//   if (!latitude || !longitude || !device_mac) {
//     return res.status(400).json({ 
//       error: "Latitude, Longitude & Device MAC required" 
//     });
//   }

//   let connection;
//   try {
//     connection = await oracledb.getConnection(dbConfig);

//     // Pehle check karo device registered hai ya nahi
//     const deviceCheck = await connection.execute(
//       `SELECT COUNT(*) FROM gps_devices WHERE device_mac = :mac`,
//       { mac: device_mac }
//     );

//     // Agar device registered nahi hai toh auto-register karo
//     if (deviceCheck.rows[0][0] === 0) {
//       await connection.execute(
//         `INSERT INTO gps_devices (device_mac, device_name, vehicle_number) 
//          VALUES (:mac, :name, :vehicle)`,
//         {
//           mac: device_mac,
//           name: `Device-${device_mac.slice(-6)}`,
//           vehicle: `Vehicle-${device_mac.slice(-6)}`
//         },
//         { autoCommit: true }
//       );
//       console.log(`✅ New device registered: ${device_mac}`);
//     }

//     // GPS data insert karo - NEW TABLE NAME
//     await connection.execute(
//       `INSERT INTO gps_tracking (device_mac, latitude, longitude, speed, direction) 
//        VALUES (:mac, :lat, :lng, :spd, :dir)`,
//       { 
//         mac: device_mac,
//         lat: Number(latitude).toFixed(6),
//         lng: Number(longitude).toFixed(6),
//         spd: speed || '0',
//         dir: direction || '0'
//       },
//       { autoCommit: true }
//     );

//     res.json({ 
//       message: "GPS data inserted successfully",
//       device_mac: device_mac
//     });

//   } catch (err) {
//     console.error("DB Insert Error:", err);
//     res.status(500).json({ error: "Database insert failed" });
//   } finally {
//     if (connection) await connection.close();
//   }
// });

// // 📍 Latest Location - Specific Device ke liye
// app.get("/api/latest", async (req, res) => {
//   const { device_mac } = req.query;
  
//   if (!device_mac) {
//     return res.status(400).json({ error: "Device MAC required" });
//   }

//   let connection;
//   try {
//     connection = await oracledb.getConnection(dbConfig);
//     const result = await connection.execute(
//       `SELECT latitude, longitude, log_date, speed, direction
//        FROM gps_tracking 
//        WHERE device_mac = :mac 
//        ORDER BY log_date DESC FETCH FIRST 1 ROWS ONLY`,
//       { mac: device_mac }
//     );

//     if (result.rows.length > 0) {
//       const [latitude, longitude, log_date, speed, direction] = result.rows[0];
//       res.json({
//         latitude: Number(latitude),
//         longitude: Number(longitude),
//         log_date,
//         speed: speed || '0',
//         direction: direction || '0',
//         device_mac: device_mac
//       });
//     } else {
//       res.json({ message: "No data found for this device" });
//     }
//   } catch (err) {
//     console.error("DB Fetch Error:", err);
//     res.status(500).json({ error: "Database fetch failed" });
//   } finally {
//     if (connection) await connection.close();
//   }
// });

// // 📱 All Active Devices List
// app.get("/api/devices", async (req, res) => {
//   let connection;
//   try {
//     connection = await oracledb.getConnection(dbConfig);
//     const result = await connection.execute(
//       `SELECT device_mac, device_name, vehicle_number, driver_name
//        FROM gps_devices 
//        WHERE is_active = 'YES' 
//        ORDER BY device_name`
//     );

//     const devices = result.rows.map(row => ({
//       device_mac: row[0],
//       device_name: row[1],
//       vehicle_number: row[2],
//       driver_name: row[3]
//     }));

//     res.json(devices);
//   } catch (err) {
//     console.error("DB Error:", err);
//     res.status(500).json({ error: err.message });
//   } finally {
//     if (connection) await connection.close();
//   }
// });

// // 📊 Device History
// app.get("/api/history/:device_mac", async (req, res) => {
//   const { device_mac } = req.params;
  
//   let connection;
//   try {
//     connection = await oracledb.getConnection(dbConfig);
//     const result = await connection.execute(
//       `SELECT latitude, longitude, log_date, speed, direction
//        FROM gps_tracking 
//        WHERE device_mac = :mac 
//        ORDER BY log_date DESC`,
//       { mac: device_mac }
//     );

//     const history = result.rows.map(row => ({
//       latitude: Number(row[0]),
//       longitude: Number(row[1]),
//       log_date: row[2],
//       speed: row[3],
//       direction: row[4]
//     }));

//     res.json(history);
//   } catch (err) {
//     console.error("DB Error:", err);
//     res.status(500).json({ error: err.message });
//   } finally {
//     if (connection) await connection.close();
//   }
// });

// // 🚀 Start server
// app.listen(PORT, () => {
//   console.log(`🚀 Server running on http://localhost:${PORT}`);
// });














// const express = require("express");
// const bodyParser = require("body-parser");
// const oracledb = require("oracledb");
// const path = require("path");

// const app = express();
// const PORT = 3000;

// app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "views"));

// // ✅ PROPER BODY PARSER MIDDLEWARE - YEH ADD KARO
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

// // 📍 GPS Data Receive - WITH BETTER ERROR HANDLING
// app.post("/api/gps", async (req, res) => {
//     console.log("📨 Received request body:", req.body);
    
//     // ✅ BETTER ERROR HANDLING
//     if (!req.body || Object.keys(req.body).length === 0) {
//         console.error("❌ Empty request body received");
//         return res.status(400).json({ 
//             error: "Request body is empty or invalid",
//             received: req.body 
//         });
//     }
    
//     const { latitude, longitude, device_mac, speed, direction } = req.body;
    
//     console.log("📊 Parsed data:", { latitude, longitude, device_mac, speed, direction });
    
//     if (!latitude || !longitude || !device_mac) {
//         return res.status(400).json({ 
//             error: "Latitude, Longitude & Device MAC required",
//             received: { latitude, longitude, device_mac }
//         });
//     }

//     let connection;
//     try {
//         connection = await oracledb.getConnection(dbConfig);

//         // Pehle check karo device registered hai ya nahi
//         const deviceCheck = await connection.execute(
//             `SELECT COUNT(*) FROM gps_devices WHERE device_mac = :mac`,
//             { mac: device_mac }
//         );

//         // Agar device registered nahi hai toh auto-register karo
//         if (deviceCheck.rows[0][0] === 0) {
//             await connection.execute(
//                 `INSERT INTO gps_devices (device_mac, device_name, vehicle_number) 
//                  VALUES (:mac, :name, :vehicle)`,
//                 {
//                     mac: device_mac,
//                     name: `Device-${device_mac.slice(-6)}`,
//                     vehicle: `Vehicle-${device_mac.slice(-6)}`
//                 },
//                 { autoCommit: true }
//             );
//             console.log(`✅ New device registered: ${device_mac}`);
//         }

//         // GPS data insert karo
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

//         console.log(`✅ GPS data inserted for device: ${device_mac}`);
        
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

// // 📍 Latest Location - Specific Device ke liye
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

// // 📱 All Active Devices List
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
//     console.log(`✅ Body Parser configured properly`);
// });














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


//postgress

const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const { Pool } = require("pg");

const app = express();
const PORT = process.env.PORT || 3000;

// Database connection using Render environment variable
const pool = new Pool({
  connectionString: process.env.DB_URL || process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));

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

// Test DB
app.get("/api/testdb", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ message: "✅ Connected to PostgreSQL!", serverTime: result.rows[0].now });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Insert GPS + auto-register device
app.post("/api/gps", async (req, res) => {
  const { latitude, longitude, device_mac, speed, direction } = req.body;
  if (!latitude || !longitude || !device_mac) return res.status(400).json({ error: "Latitude, Longitude & Device MAC required" });

  try {
    // Check device
    const deviceCheck = await pool.query(`SELECT device_id FROM gps_devices WHERE device_mac=$1`, [device_mac]);
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

// Get latest location
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

// Device history
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

// List devices
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

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`✅ Connected to PostgreSQL successfully!`);
});
