import { useParams } from "react-router-dom";

export function useSessionIdParam() {
  return (useParams() as { sessionId: string }).sessionId;
}
