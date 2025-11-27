import { useEffect, useState } from "react";
import { fetchFormTemplate, fetchProcessRecord } from "./api";
import { LOCAL_FORM_CONFIGS } from "./formConfigs";

export default function useProcessForm(pcbSerial, stageId) {

  const [form, setForm] = useState(null);
  const [savedData, setSavedData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);

      // Attempt API config
      try {
        const serverForm = await fetchFormTemplate(stageId);
        setForm(serverForm);
      } catch {
        setForm(LOCAL_FORM_CONFIGS[stageId] || null);
      }

      // Attempt data fetch
      try {
        const record = await fetchProcessRecord(pcbSerial, stageId);
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
