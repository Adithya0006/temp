import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { fetchFormTemplate, fetchProcessRecord } from "./api";
import { LOCAL_FORM_CONFIGS } from "./formConfigs";

export default function useProcessForm(pcbSerial, stageId) {

  const [form, setForm] = useState(null);
  const [savedData, setSavedData] = useState(null);
  const [loading, setLoading] = useState(true);
  const configDetails = useSelector(state => state.MROTDataSavingReducer.configDetails);
  useEffect(() => {
    async function load() {
      setLoading(true);

      // Attempt API config
      try {
        const serverForm = await fetchFormTemplate(stageId,configDetails);
        setForm(serverForm);
      } catch {
        setForm(LOCAL_FORM_CONFIGS[stageId] || null);
        console.log("STAGE ID: ",stageId)
      }

      // Attempt data fetch
      try {
        const record = await fetchProcessRecord(pcbSerial, stageId,configDetails);
        console.log("record in use form: ",record)
        setSavedData(record);
      } catch {
        setSavedData(null);
      }

      setLoading(false);
    }

    load();
  }, [pcbSerial, stageId]);

  return { form, savedData, loading };
}
