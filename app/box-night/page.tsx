import BoxNightClient from "./BoxNightClient";
import { getBoxNightTasks } from "@/app/actions/box-night";

export const dynamic = "force-dynamic";

export default async function BoxNightPage() {
  const tasks = await getBoxNightTasks();
  return <BoxNightClient initialTasks={tasks} />;
}
