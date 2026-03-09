// import db from "./models/index.js";
// import { authRoutes } from "./routes/auth.routes.js";
// import { tutorialRoutes } from "./routes/tutorial.routes.js";
// import json2csv from "json2csv";
// import path from "path";
// import makeCsvWriteStream from "csv-write-stream";
// import express from "express";
// import bodyParser from "body-parser";
// import cors from "cors";
// import fs from "fs";
// import { UserRouter } from "./routes/MrotUsers.js";
// import Pdf from "pdf-parse";
// import { FireFormRouter } from "./routes/FireFormRoutes.js";
// import {MrotCriticalMaintRouter} from "./routes/MrotCriticalMaintRoutes.js"
// import {MrotVideoRouter} from "./routes/MrotVideoRoutes.js"
// import { MrotSparesManagementRouter } from "./routes/MrotSapresManagemnetRoutes.js";
// import { OperationRouter } from "./routes/OperationRoute.js";
// import { MrotAnnotationRouter } from "./routes/MrotAnnotationRoutes.js";
// import {AlignmentRecordLogInfoRouter} from "./routes/AlignmentRecordLogInfoRouter.js"
// import { MrotPdfRouter } from "./routes/MrotPdfRoutes.js";
// import { AlignmentDynamicFineSensorInforRouter } from "./routes/AlignmentDynamicFineSensorInforRouter.js";
// import { AlignmentDynamicFinewrtTMXRouter } from "./routes/AlignmentDynamicFinewrtTMXInfoRouter.js";
// import { AlignmentStaticCoarsewrtSIRPInfoRouter } from "./routes/AlignmentStaticCoarsewrtSIRPInfoRouter.js";
// import { AlignmentStaticCoarseTiltMeasurementRouter } from "./routes/AlignmentStaticCoarseTiltMeasurementRouter.js";
// import { PcbDataRouter } from "./routes/PcbDataRoutes.js";
// import {DefFlowDataRouter} from "./routes/DefFlowDataRouter.js";
// import { fileURLToPath } from 'url';

// const __dirname = path.resolve();
// const __dirname1 = path.dirname(fileURLToPath(import.meta.url));
// const UPLOADS_DIR = path.join(__dirname, "uploads");

// console.log("**********************WELCOME to NODEJS SERVER*****************************\n");

// const Role = db.role;
// const app = express();
// const PORT = process.env.PORT || 8082;

// var corsOptions = {
//   origin:[ 
//     "http://localhost:3000",
//     "http://127.0.0.1:3000",
//     "http://127.0.0.1:5000",
//     "http://192.168.0.150:3000",
//     "http://192.168.0.20:3000",
//     "http://192.168.0.150:8082",
//     "http://192.168.0.151:3000",
//     "http://172.195.121.91:3000",
//     "http://localhost:5000",
//     "http://172.195.121.91:8082",
//     "http://172.195.121.150:3000",
//     "http://192.168.0.20:5000",],
//   optionsSuccessStatus: 200 
// };

// app.set('view engine','ejs');

// app.get("/profile",(req,res)=>{
//   const user={
//     name:'Ajay Kumar Singh', city:'Bangalore', designation:'Manager',
//     skills:['Python','C++','C','React.js','Node.js','Android']
//   }
//   res.render('localServer/profile',{user})
// })

// app.use(cors(corsOptions));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// app.use("/", FireFormRouter);
// authRoutes(app);
// UserRouter(app);
// MrotCriticalMaintRouter(app);
// MrotVideoRouter(app);
// MrotSparesManagementRouter(app);
// OperationRouter(app);
// MrotAnnotationRouter(app)
// AlignmentRecordLogInfoRouter(app);
// MrotPdfRouter(app);
// AlignmentDynamicFineSensorInforRouter(app);
// AlignmentDynamicFinewrtTMXRouter(app)
// AlignmentStaticCoarsewrtSIRPInfoRouter(app)
// AlignmentStaticCoarseTiltMeasurementRouter(app)
// PcbDataRouter(app)
// DefFlowDataRouter(app)

// app.use(express.static(UPLOADS_DIR));

// db.sequelize.sync().then(() => {
//   console.log("DB connected");
// }).catch((err)=>{
//   console.log("DB not Connected")
// })

// const WATCH_PATH = path.join(__dirname1, 'incoming-files');
// if (!fs.existsSync(WATCH_PATH)) fs.mkdirSync(WATCH_PATH);

// // Format: { "serial": { "fileName": "...", "machine": "..." } }
// let detectedFiles = {};

// /** * 1. RECURSIVE INITIAL SCAN: 
//  * This finds files in all sub-folders (Machine_A, Machine_B, etc.)
//  */
// const initialScan = (directory) => {
//     const items = fs.readdirSync(directory);
//     items.forEach(item => {
//         const fullPath = path.join(directory, item);
//         if (fs.statSync(fullPath).isDirectory()) {
//             initialScan(fullPath); // Recursive call
//         } else {
//             const match = item.match(/\d+/);
//             if (match) {
//                 const serial = match[0];
//                 const machineName = path.basename(directory);
//                 detectedFiles[serial] = { fileName: item, machine: machineName };
//             }
//         }
//     });
// };

// initialScan(WATCH_PATH);
// console.log("Initial scan complete. Current mapping:", detectedFiles);

// /** * 2. RECURSIVE LIVE WATCHER: 
//  */
// fs.watch(WATCH_PATH, { recursive: true }, (eventType, filename) => {
//     if (filename && eventType === 'rename') {
//         const fullPath = path.join(WATCH_PATH, filename);
        
//         if (fs.existsSync(fullPath)) {
//             // Check if it's a file (not the folder itself being created)
//             if (!fs.statSync(fullPath).isDirectory()) {
//                 const match = path.basename(filename).match(/\d+/); 
//                 if (match) {
//                     const serial = match[0];
//                     const machineName = path.dirname(filename);
//                     detectedFiles[serial] = { fileName: path.basename(filename), machine: machineName };
//                     console.log(`Updated Serial ${serial} from machine ${machineName}`);
//                 }
//             }
//         } else {
//             // Handle file deletion
//             for (const serial in detectedFiles) {
//                 if (detectedFiles[serial].fileName === path.basename(filename)) {
//                     delete detectedFiles[serial];
//                 }
//             }
//         }
//     }
// });

// app.get("/checkServer", (req, res) => {
//   res.json({ message: "Server is Running!", time: new Date() });
// });

// app.get("/", (req, res) => {
//   res.json({ message: "Server is Running!", time: new Date() });
// });

// app.get('/check-file/:serial', (req, res) => {
//   const serial = req.params.serial;
//   console.log("serial: ",serial)
//   if (detectedFiles[serial]) {
//     console.log("true")
//       res.json({ found: true, details: detectedFiles[serial] });
//   } else {
//     console.log("false")
//       res.json({ found: false });
//   }
// });

// app.post('/check-batch-files', (req, res) => {
//   const { serials } = req.body;
//   const results = {};
//   serials.forEach(s => {
//       results[s] = !!detectedFiles[s];
//   });
//   res.json(results);
// });

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}.`);
// });










































import db from "./models/index.js";
import { authRoutes } from "./routes/auth.routes.js";
import { tutorialRoutes } from "./routes/tutorial.routes.js";
import json2csv from "json2csv";
import path from "path";
import makeCsvWriteStream from "csv-write-stream";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import fs from "fs";
import { UserRouter } from "./routes/MrotUsers.js";
import Pdf from "pdf-parse";
import { FireFormRouter } from "./routes/FireFormRoutes.js";
import {MrotCriticalMaintRouter} from "./routes/MrotCriticalMaintRoutes.js"
import {MrotVideoRouter} from "./routes/MrotVideoRoutes.js"
import { MrotSparesManagementRouter } from "./routes/MrotSapresManagemnetRoutes.js";
import { OperationRouter } from "./routes/OperationRoute.js";
import { MrotAnnotationRouter } from "./routes/MrotAnnotationRoutes.js";
import {AlignmentRecordLogInfoRouter} from "./routes/AlignmentRecordLogInfoRouter.js"
import { MrotPdfRouter } from "./routes/MrotPdfRoutes.js";
import { AlignmentDynamicFineSensorInforRouter } from "./routes/AlignmentDynamicFineSensorInforRouter.js";
import { AlignmentDynamicFinewrtTMXRouter } from "./routes/AlignmentDynamicFinewrtTMXInfoRouter.js";
import { AlignmentStaticCoarsewrtSIRPInfoRouter } from "./routes/AlignmentStaticCoarsewrtSIRPInfoRouter.js";
import { AlignmentStaticCoarseTiltMeasurementRouter } from "./routes/AlignmentStaticCoarseTiltMeasurementRouter.js";
import { PcbDataRouter } from "./routes/PcbDataRoutes.js";
import {DefFlowDataRouter} from "./routes/DefFlowDataRouter.js";
import { fileURLToPath } from 'url';

const __dirname = path.resolve();
const __dirname1 = path.dirname(fileURLToPath(import.meta.url));
const UPLOADS_DIR = path.join(__dirname, "uploads");

console.log("**********************WELCOME to NODEJS SERVER*****************************\n");

const Role = db.role;
const app = express();
const PORT = process.env.PORT || 8082;

var corsOptions = {
  origin:[ 
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5000",
    "http://192.168.0.150:3000",
    "http://192.168.0.20:3000",
    "http://192.168.0.150:8082",
    "http://192.168.0.151:3000",
    "http://172.195.121.91:3000",
    "http://localhost:5000",
    "http://172.195.121.91:8082",
    "http://172.195.121.150:3000",
    "http://192.168.0.20:5000",],
  optionsSuccessStatus: 200 
};

app.set('view engine','ejs');

app.get("/profile",(req,res)=>{
  const user={
    name:'Ajay Kumar Singh', city:'Bangalore', designation:'Manager',
    skills:['Python','C++','C','React.js','Node.js','Android']
  }
  res.render('localServer/profile',{user})
})

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/", FireFormRouter);
authRoutes(app);
UserRouter(app);
MrotCriticalMaintRouter(app);
MrotVideoRouter(app);
MrotSparesManagementRouter(app);
OperationRouter(app);
MrotAnnotationRouter(app)
AlignmentRecordLogInfoRouter(app);
MrotPdfRouter(app);
AlignmentDynamicFineSensorInforRouter(app);
AlignmentDynamicFinewrtTMXRouter(app)
AlignmentStaticCoarsewrtSIRPInfoRouter(app)
AlignmentStaticCoarseTiltMeasurementRouter(app)
PcbDataRouter(app)
DefFlowDataRouter(app)

app.use(express.static(UPLOADS_DIR));

db.sequelize.sync().then(() => {
  console.log("DB connected");
}).catch((err)=>{
  console.log("DB not Connected")
})

const WATCH_PATH = path.join( 'D:\\Files');
if (!fs.existsSync(WATCH_PATH)) fs.mkdirSync(WATCH_PATH);

// NEW STRUCTURE: { "Machine_A": { "123": "123.pdf" }, "Machine_B": { "123": "123.html" } }
let detectedFiles = {}; 

/** * 1. RECURSIVE INITIAL SCAN: 
 * Maps files by MachineID -> SerialNumber
 */
const initialScan = (directory) => {
    const items = fs.readdirSync(directory);
    items.forEach(item => {
        const fullPath = path.join(directory, item);
        if (fs.statSync(fullPath).isDirectory()) {
            initialScan(fullPath); 
        } else {
            const match = item.match(/\d+/);
            if (match) {
                const serial = match[0];
                const machineName = path.basename(directory);
                
                // Initialize machine object if it doesn't exist
                if (!detectedFiles[machineName]) detectedFiles[machineName] = {};
                detectedFiles[machineName][serial] = item;
            }
        }
    });
};

initialScan(WATCH_PATH);
console.log("Initial scan complete. Current mapping by Machine ID:", detectedFiles);

/** * 2. RECURSIVE LIVE WATCHER: 
 */
 fs.watch(WATCH_PATH, { recursive: true }, (eventType, filename) => {
  if (filename && eventType === 'rename') {
      const fullPath = path.join(WATCH_PATH, filename);
      
      if (fs.existsSync(fullPath)) {
          if (!fs.statSync(fullPath).isDirectory()) {
              const match = path.basename(filename).match(/\d+/); 
              if (match) {
                  const serial = match[0];
                  const machineName = path.dirname(filename); // Extracts the machine folder name
                  
                  if (!detectedFiles[machineName]) detectedFiles[machineName] = {};
                  detectedFiles[machineName][serial] = path.basename(filename);
                  console.log(`Updated Serial ${serial} in folder ${machineName}`);
              }
          }
      } else {
          // Cleanup on deletion
          const deletedFileName = path.basename(filename);
          const machineName = path.dirname(filename);
          if (detectedFiles[machineName]) {
              for (const serial in detectedFiles[machineName]) {
                  if (detectedFiles[machineName][serial] === deletedFileName) {
                      delete detectedFiles[machineName][serial];
                  }
              }
          }
      }
  }
});

app.get("/checkServer", (req, res) => {
  res.json({ message: "Server is Running!", time: new Date() });
});

app.get("/", (req, res) => {
  res.json({ message: "Server is Running!", time: new Date() });
});

app.get('/check-file/:machine_id/:serial', (req, res) => {
  const { machine_id, serial } = req.params;
  console.log("serial: ",serial)
  if (detectedFiles[machine_id] && detectedFiles[machine_id][serial]) {
      res.json({ found: true, fileName: detectedFiles[machine_id][serial] });
  } else {
      res.json({ found: false });
  }
});

app.post('/check-batch-files/:machine_id', (req, res) => {
  const { machine_id } = req.params;
  const { serials } = req.body;
  const results = {};
  serials.forEach(s => {
      results[s] = !!(detectedFiles[machine_id] && detectedFiles[machine_id][s]);
  });
  res.json(results);
});

app.get("/machine-file/:machine_id/:filename", (req, res) => {

  const { machine_id, filename } = req.params;

  const filePath = path.join(WATCH_PATH, machine_id, filename);

  if (fs.existsSync(filePath)) {
      return res.sendFile(filePath);
  }

  return res.status(404).json({ found:false });
});



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
