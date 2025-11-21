import React, { useState } from "react";
import * as XLSX from "xlsx";
import {
  Box,
  Typography,
  Button,
  Paper,
  TextField,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Checkbox,
  Grid,
  IconButton,
  Container,
  Stack,
} from "@mui/material";

import StorageIcon from "@mui/icons-material/Storage";
import PlayForWorkIcon from "@mui/icons-material/PlayForWork";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";

const PCB_SERIAL_KEY_FALLBACK = "serial number";
const STATUS_KEY = "Status";
const STATUS_NOT_YET_ASSIGNED = "Not Yet Created";
const STATUS_ASSIGNED = "Created";

const normalizeSerialValue = (val) =>
  val ? String(val).trim().toLowerCase() : "";

const detectSerialKeyFromKeys = (keys = []) => {
  if (!keys.length) return PCB_SERIAL_KEY_FALLBACK;

  const fallbackLower = PCB_SERIAL_KEY_FALLBACK.toLowerCase();

  for (const k of keys) {
    if (k.trim().toLowerCase() === fallbackLower) return k;
  }
  for (const k of keys) {
    if (/serial/i.test(k)) return k;
  }
  return keys.find((k) => k !== "id") || PCB_SERIAL_KEY_FALLBACK;
};

const readFile = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const workbook = XLSX.read(new Uint8Array(e.target.result), {
          type: "array",
        });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const rawJson = XLSX.utils.sheet_to_json(worksheet);

        if (!rawJson.length) return resolve([]);

        const normalizedJson = rawJson.map((row, idx) => {
          const newRow = { id: `row-${Date.now()}-${idx}` };
          for (const key in row) {
            const trimmedKey = key.trim();
            newRow[trimmedKey] = row[key];
          }
          return newRow;
        });

        resolve(normalizedJson);
      } catch (err) {
        reject(err);
      }
    };

    reader.onerror = (err) => reject(err);
    reader.readAsArrayBuffer(file);
  });

export default function AdminDashboard({
  onLogout,
  addInActionPCBs,
  deleteInActionPCB,

  // ⭐ NEW GLOBAL PROPS FROM App.js
  masterList,
  setMasterList,
  inActionList,
  setInActionList
}) {
  // LOCAL STATE ONLY FOR UI
  const [view, setView] = useState("home");
  const [fileName, setFileName] = useState(null);

  const [pcbSerialKey, setPcbSerialKey] = useState(PCB_SERIAL_KEY_FALLBACK);
  const [uploadedPreviewData, setUploadedPreviewData] = useState(null);
  const [previewColumns, setPreviewColumns] = useState([]);
  const [selectedIds, setSelectedIds] = useState(new Set());

  // --------------------------------------------
  // FILE UPLOAD
  // --------------------------------------------
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);

    try {
      const data = await readFile(file);
      if (!data.length) return alert("Uploaded file contains no rows");

      const columns = Object.keys(data[0]).filter((k) => k !== "id");
      if (!columns.includes(STATUS_KEY)) columns.push(STATUS_KEY);

      const discoveredKey = detectSerialKeyFromKeys(columns);
      setPcbSerialKey(discoveredKey);

      const normalized = data.map((r) => ({
        ...r,
        [STATUS_KEY]: r[STATUS_KEY] || STATUS_NOT_YET_ASSIGNED,
      }));

      setPreviewColumns(columns);
      setUploadedPreviewData(normalized);
      setView("preview");
    } catch (err) {
      console.error(err);
      alert("Error reading file. Ensure valid CSV/Excel.");
    }
  };

  const handleAddRow = () => {
    const newRow = { id: `row-${Date.now()}-new` };
    previewColumns.forEach((c) => (newRow[c] = ""));
    newRow[STATUS_KEY] = STATUS_NOT_YET_ASSIGNED;
    setUploadedPreviewData((prev) => [...prev, newRow]);
  };

  const handleUpdatePreviewCell = (rowId, colKey, val) => {
    setUploadedPreviewData((prev) =>
      prev.map((r) => (r.id === rowId ? { ...r, [colKey]: val } : r))
    );
  };

  const handleDeletePreviewRow = (id) => {
    if (!window.confirm("Delete this row?")) return;
    setUploadedPreviewData((prev) => prev.filter((r) => r.id !== id));
  };

  // --------------------------------------------
  // SAVE TO MASTER LIST
  // --------------------------------------------
  const handleSaveToMasterList = () => {
    if (!uploadedPreviewData?.length)
      return alert("No preview data to save.");

    if (!window.confirm("Save preview rows to Master List?")) return;

    const incoming = uploadedPreviewData.map((r) => ({
      ...r,
      [STATUS_KEY]: STATUS_NOT_YET_ASSIGNED,
    }));

    const discovered = detectSerialKeyFromKeys(previewColumns);
    setPcbSerialKey(discovered);

    if (!masterList.length) {
      setMasterList(incoming);
    } else {
      const existingSerials = new Set(
        masterList.map((r) => normalizeSerialValue(r[discovered]))
      );

      const uniqueNew = incoming.filter((r) => {
        const serial = normalizeSerialValue(r[discovered]);
        return serial && !existingSerials.has(serial);
      });

      setMasterList((prev) => [...prev, ...uniqueNew]);

      if (incoming.length !== uniqueNew.length) {
        alert(
          `${uniqueNew.length} saved. ${incoming.length - uniqueNew.length} duplicate(s) skipped.`
        );
      }
    }

    setUploadedPreviewData(null);
    setPreviewColumns([]);
    setView("home");
    alert("Saved to Master List.");
  };

  // --------------------------------------------
  // MASTER LIST → ASSIGN ROWS
  // --------------------------------------------
  const handleMasterCheckbox = (id) => {
    const row = masterList.find((r) => r.id === id);
    if (row?.[STATUS_KEY] === STATUS_ASSIGNED) return;

    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleMarkSelectedAssigned = () => {
    if (!selectedIds.size) return alert("Select rows to assign.");

    if (!window.confirm(`Assign ${selectedIds.size} rows and send to In-Action?`))
      return;

    const itemsToMove = [];
    const updatedMaster = masterList.map((item) => {
      if (selectedIds.has(item.id) && item[STATUS_KEY] !== STATUS_ASSIGNED) {
        itemsToMove.push(item);
        return { ...item, [STATUS_KEY]: STATUS_ASSIGNED };
      }
      return item;
    });

    if (!itemsToMove.length) return alert("No unassigned rows selected.");

    setMasterList(updatedMaster);

    const outgoing = itemsToMove.map((item) => ({
      ...item,
      [STATUS_KEY]: "Incomplete",
      _pcb_key_id: pcbSerialKey,
      isWorkAssigned: false,
      linkedOperations: item.linkedOperations || [],
    }));

    // ⭐ update global inAction list
    setInActionList((prev) => [...prev, ...outgoing]);

    addInActionPCBs(itemsToMove, pcbSerialKey);

    setSelectedIds(new Set());
    setView("inaction");
    alert("Moved to In-Action.");
  };

  // --------------------------------------------
  // MOVE BACK TO MASTER FROM IN-ACTION
  // --------------------------------------------
  const handleMoveBackToMaster = (rowId) => {
    const row = inActionList.find((r) => r.id === rowId);
    if (!row) return;

    const keyUsed =
      pcbSerialKey || detectSerialKeyFromKeys(Object.keys(row));

    const serialRaw =
      row[keyUsed] ??
      row[PCB_SERIAL_KEY_FALLBACK] ??
      row["SNo"] ??
      "";

    const serialNormalized = normalizeSerialValue(serialRaw);

    if (!serialNormalized)
      return alert("Cannot detect serial number.");

    if (!window.confirm(`Move PCB ${serialRaw} back to Master List?`))
      return;

    setMasterList((prev) =>
      prev.map((item) => {
        const itemKey =
          pcbSerialKey || detectSerialKeyFromKeys(Object.keys(item));
        const itemSerial = normalizeSerialValue(item[itemKey]);
        if (itemSerial === serialNormalized) {
          return { ...item, [STATUS_KEY]: STATUS_NOT_YET_ASSIGNED };
        }
        return item;
      })
    );

    setInActionList((prev) =>
      prev.filter((p) => {
        const pKey =
          pcbSerialKey || detectSerialKeyFromKeys(Object.keys(p));
        return normalizeSerialValue(p[pKey]) !== serialNormalized;
      })
    );

    deleteInActionPCB(serialRaw);
    alert(`Moved ${serialRaw} back to Master List.`);
  };

  // ----------------------
  // UI SECTIONS (moderate polish)
  // ----------------------

  const HomeCards = () => (
    <Container maxWidth="lg" sx={{ mt: 4}}>
      <Typography variant="h5" sx={{ mb: 3 }} style={{textAlign:"center"}}>
        Admin Home
      </Typography>

      <Grid
  container
  spacing={3}
  justifyContent="center"
  alignItems="center"
>
        {[
          {
            title: "Master List",
            icon: <StorageIcon sx={{ fontSize: 44, color: "primary.main" }} />,
            body: "View List of Projects",
            view: "master",
          },
          {
            title: "In-Action",
            icon: (
              <PlayForWorkIcon
                sx={{ fontSize: 44, color: "success.main" }}
              />
            ),
            body: "List of Active Pcbs",
            view: "inaction",
          },
          {
            title: "Create Project",
            icon: (
              <UploadFileIcon
                sx={{ fontSize: 44, color: "warning.main" }}
              />
            ),
            body: "Defining New project",
            view: "create",
          },
          {
            title: "Profile Creation",
            icon: (
              <PersonAddIcon
                sx={{ fontSize: 44, color: "secondary.main" }}
              />
            ),
            // body: "Coming soon",
            view: "profile",
          },
        ].map((card, i) => (
          <Grid item xs={12} md={3} lg={3} key={i}>
            <Paper
  elevation={6}
  onClick={() => setView(card.view)}
  sx={{
    p: 3,
    cursor: "pointer",
    textAlign: "center",
    borderRadius: 3,

    // ✅ This makes all cards equal size:
    width: "100%",        // take full width of grid cell
    height: "200px",      // fixed height (change as you like)
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",

    background: "linear-gradient(180deg, #ffffffcc, #ffffffee)",
    boxShadow: "0 4px 18px rgba(0,0,0,0.12)",
    transition: "0.25s",

    "&:hover": {
      transform: "translateY(-5px)",
      boxShadow: "0 8px 22px rgba(0,0,0,0.18)",
    },
  }}
>

              {card.icon}
              <Typography variant="h6" sx={{ mt: 1 }}>
                {card.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {card.body}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );

  const MasterView = () => {
    const cols =
      masterList.length > 0
        ? Object.keys(masterList[0]).filter((k) => k !== "id")
        : [];

    return (
      <Container maxWidth="xl" sx={{ mt: 4 }}>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
          <IconButton onClick={() => setView("home")}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6">Master List</Typography>
        </Stack>

        {!masterList.length ? (
          <Paper sx={{ p: 3 }}>
            <Typography>No master records. Upload a file first.</Typography>
          </Paper>
        ) : (
          <Paper sx={{ borderRadius: 2 }}>
            <TableContainer sx={{ maxHeight: "65vh" }}>
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: "grey.100" }}>
                    <TableCell padding="checkbox">Select</TableCell>
                    {cols.map((c) => (
                      <TableCell key={c}>{c}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {masterList.map((row) => {
                    const isAssigned = row[STATUS_KEY] === STATUS_ASSIGNED;

                    return (
                      <TableRow
                        key={row.id}
                        sx={{
                          bgcolor: isAssigned ? "#f0fff0" : "white",
                        }}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={
                              isAssigned || selectedIds.has(row.id)
                            }
                            onChange={() =>
                              handleMasterCheckbox(row.id)
                            }
                            disabled={isAssigned}
                          />
                        </TableCell>

                        {cols.map((c) => (
                          <TableCell key={`${row.id}-${c}`}>
                            {c === STATUS_KEY ? (
                              <Typography
                                sx={{
                                  fontWeight: "bold",
                                  color: isAssigned
                                    ? "success.main"
                                    : "warning.dark",
                                }}
                              >
                                {row[c]}
                              </Typography>
                            ) : (
                              row[c]
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>

            <Box
              sx={{
                p: 2,
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <Button
                variant="contained"
                disabled={!selectedIds.size}
                onClick={handleMarkSelectedAssigned}
              >
                Assign & Move to In-Action ({selectedIds.size})
              </Button>
            </Box>
          </Paper>
        )}
      </Container>
    );
  };

  const InActionView = () => {
    const key =
      inActionList?.[0]?._pcb_key_id || pcbSerialKey;

    const baseCols =
      inActionList.length > 0
        ? Object.keys(inActionList[0]).filter(
            (k) =>
              ![
                "id",
                "linkedOperations",
                "isWorkAssigned",
                "_pcb_key_id",
              ].includes(k)
          )
        : [];

    return (
      <Container maxWidth="xl" sx={{ mt: 4 }}>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
          <IconButton onClick={() => setView("home")}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6">
            In-Action PCBs ({inActionList.length})
          </Typography>
        </Stack>

        {!inActionList.length ? (
          <Paper sx={{ p: 3 }}>
            <Typography>No PCBs in In-Action.</Typography>
          </Paper>
        ) : (
          <Paper sx={{ borderRadius: 2 }}>
            <TableContainer sx={{ maxHeight: "65vh" }}>
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: "grey.100" }}>
                    {baseCols.map((c) => (
                      <TableCell key={c}>{c}</TableCell>
                    ))}
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {inActionList.map((row) => (
                    <TableRow key={row.id}>
                      {baseCols.map((c) => (
                        <TableCell key={`${row.id}-${c}`}>
                          {c === key ? (
                            <Typography sx={{ fontWeight: 600 }}>
                              {row[c]}
                            </Typography>
                          ) : (
                            row[c]
                          )}
                        </TableCell>
                      ))}

                      <TableCell>
                        {/* <Button
                          startIcon={<EditIcon />}
                          size="small"
                          onClick={() =>
                            alert(
                              "Supervisor editing happens in Supervisor Panel."
                            )
                          }
                        >
                          Edit
                        </Button> */}

                        <Button
                          startIcon={<DeleteIcon />}
                          size="small"
                          color="error"
                          onClick={() =>
                            handleMoveBackToMaster(row.id)
                          }
                        >
                          Move Back
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}
      </Container>
    );
  };

  const CreateProjectView = () => (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
        <IconButton onClick={() => setView("home")}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6">Create Project</Typography>
      </Stack>

      <Paper sx={{ p: 3 }}>
        <Typography variant="body2" sx={{ mb: 2 }}>
          Upload a CSV/Excel file to generate project rows.
        </Typography>

        <input
          id="upload-file"
          type="file"
          accept=".csv, .xlsx, .xls"
          onChange={handleFileUpload}
          style={{ display: "none" }}
        />

        <Button
          variant="contained"
          component="label"
          htmlFor="upload-file"
          startIcon={<UploadFileIcon />}
        >
          Choose File
        </Button>

        {fileName && (
          <Typography variant="body2" sx={{ mt: 2 }}>
            Selected File: <strong>{fileName}</strong>
          </Typography>
        )}
      </Paper>
    </Container>
  );

  const PreviewView = () => (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
        <IconButton onClick={() => setView("create")}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6">Preview & Edit</Typography>
      </Stack>

      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <Button startIcon={<AddIcon />} variant="contained" onClick={handleAddRow}>
            Add Row
          </Button>

          <Button
            color="error"
            variant="outlined"
            onClick={() => {
              if (window.confirm("Cancel upload?")) {
                setUploadedPreviewData(null);
                setPreviewColumns([]);
                setView("home");
              }
            }}
          >
            Cancel
          </Button>
        </Box>

        <TableContainer component={Paper} sx={{ maxHeight: "55vh" }}>
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                {previewColumns.map((c) => (
                  <TableCell key={c} sx={{ fontWeight: 600 }}>
                    {c}
                  </TableCell>
                ))}
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {uploadedPreviewData.map((row) => (
                <TableRow key={row.id}>
                  {previewColumns.map((c) => (
                    <TableCell key={`${row.id}-${c}`} sx={{ p: 0.5 }}>
                      <TextField
                        size="small"
                        fullWidth
                        disabled={c === STATUS_KEY}
                        value={row[c] || ""}
                        onChange={(e) =>
                          handleUpdatePreviewCell(
                            row.id,
                            c,
                            e.target.value
                          )
                        }
                      />
                    </TableCell>
                  ))}

                  <TableCell>
                    <IconButton
                      color="error"
                      onClick={() => handleDeletePreviewRow(row.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ textAlign: "center", mt: 2 }}>
          <Button variant="contained" size="large" onClick={handleSaveToMasterList}>
            Save to Master List
          </Button>
        </Box>
      </Paper>
    </Container>
  );

  const ProfileView = () => (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
        <IconButton onClick={() => setView("home")}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6">Profile Creation </Typography>
      </Stack>

      <Paper sx={{ p: 3 }}>
        <Typography variant="body2">
          This area can be used for future profile creation.
        </Typography>
      </Paper>
    </Container>
  );

 return (
    <Box
  sx={{
    minHeight: "100vh",
    background: "linear-gradient(135deg, #e3f2fd, #bbdefb)",
    // p: 2,
  }}
>
      <Box
  sx={{
    p: 2,
    background: "linear-gradient(90deg, #1976d2, #42a5f5)",
    color: "white",
    boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
  }}
>
        <Container
          maxWidth="xl"
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6">Admin Dashboard</Typography>

          <Stack direction="row" spacing={1}>
            <Button onClick={() => setView("home")}>Home</Button>
            <Button variant="outlined" onClick={onLogout}>
              Logout
            </Button>
          </Stack>
        </Container>
      </Box>

      {view === "home" && <HomeCards />}
      {view === "master" && <MasterView />}
      {view === "inaction" && <InActionView />}
      {view === "create" && <CreateProjectView />}
      {view === "preview" && uploadedPreviewData && <PreviewView />}
      {view === "profile" && <ProfileView />}
    </Box>
  );
}