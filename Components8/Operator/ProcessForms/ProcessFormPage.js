import { Container, CircularProgress } from "@mui/material";
import useProcessForm from "./useProcessForm";
import ProcessForm from "./ProcessForm";
import { saveProcessRecord } from "./api";

export default function ProcessFormPage({ pcbSerial, stageId, operator, onSaveComplete }){

  const { form, savedData, loading } = useProcessForm(pcbSerial, stageId);

  if (loading) return <CircularProgress />;
  if (!form) return <p>No Form Template Found</p>;

  const handleSave = async (formValues) => {

  const payload = {
    pcb_serial_number: pcbSerial,
    stage_id: stageId,
    stage_name: form.stage_name,

    operator_id: operator?.staffNumber || "",
    operator_name: operator?.name || "",

    start_datetime: savedData?.start_datetime || new Date().toLocaleString(),
    end_datetime: new Date().toLocaleString(),
    status: "Completed",

    process_data: {
      ...formValues,
      operator_name: operator?.name || "",
      operator_id: operator?.staffNumber || ""
    }
  };

  console.clear();
  console.log("===== PROCESS FORM DATA =====");
  console.table(payload.process_data);
  console.log("FULL PAYLOAD:", payload);
  console.log("=============================");

  alert("Check console → Form data logged!");
  if (typeof onSaveComplete === "function") {
    onSaveComplete();
  }
};


  return (
    <Container maxWidth="md" sx={{ mt: 3 }}>
      <ProcessForm
        form={form}
        savedData={savedData}
        onSubmit={handleSave}
      />
    </Container>
  );
}
