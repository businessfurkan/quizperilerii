import { getBoxNightTasks } from "@/app/actions/box-night";
import BoxNightAdminClient from "./BoxNightAdminClient";
import { Box as BoxIcon } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function BoxNightAdminPage() {
  const tasks = await getBoxNightTasks();

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-[#2a0d59] rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <BoxIcon className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-[#2a0d59]">Box Night Yönetimi</h1>
          <p className="text-[#2a0d59]/70 font-medium">Oyun içi ceza ve görevleri buradan yönetebilirsiniz.</p>
        </div>
      </div>

      <BoxNightAdminClient initialTasks={tasks} />
    </div>
  );
}
