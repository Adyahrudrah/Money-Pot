// useSmsFetcher.ts
import { useCallback, useEffect, useState } from "react";
import SmsAndroid from "react-native-get-sms-android";
import requestSmsPermission from "../services/requestPermission";
import { SmsMessage } from "../types/type";

// Define the shape of the data the hook returns
interface UseSmsFetcherResult {
  messages: SmsMessage[];
  loading: boolean;
  error: string | null;
  refetchSms: () => Promise<void>;
}

const useSmsFetcher = (): UseSmsFetcherResult => {
  const [messages, setMessages] = useState<SmsMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadAllSms = useCallback(async () => {
    setError(null);
    const hasPermission = await requestSmsPermission();
    if (!hasPermission) {
      setError("SMS permission denied.");
      return;
    }
    setLoading(true);
    const filter = {
      box: "inbox",
      indexFrom: 0,
    };

    SmsAndroid.list(
      JSON.stringify(filter),
      (err: any) => {
        setLoading(false);
        const errorMessage = `Failed to retrieve SMS: ${err?.message || "Unknown error"}`;
        console.error(errorMessage);
        setError(errorMessage);
      },
      async (count: number, smsList: string) => {
        try {
          const parsed: SmsMessage[] = JSON.parse(smsList);
          parsed.sort((a, b) => b.date - a.date);
          setMessages(parsed);
        } catch (parseErr) {
          const errorMessage = `Failed to parse SMS list: ${parseErr}`;
          console.error(errorMessage);
          setError(errorMessage);
        }
        setLoading(false);
      }
    );
  }, []);

  useEffect(() => {
    loadAllSms();
  }, [loadAllSms]);

  return { messages, loading, error, refetchSms: loadAllSms };
};

export default useSmsFetcher;
