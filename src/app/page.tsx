/* Server page delegating to composed TimeConverterPage component. */
export const dynamic = "force-dynamic";

import TimeConverterPage from "./components/TimeConverterPage";

export default function Page() {
  return <TimeConverterPage />;
}
