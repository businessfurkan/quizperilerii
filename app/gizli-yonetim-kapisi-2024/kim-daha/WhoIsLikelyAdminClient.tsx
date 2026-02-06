"use client";

import { useState } from "react";
import { WhoIsLikelyQuestion } from "@prisma/client";
import { createWhoIsLikelyQuestion, updateWhoIsLikelyQuestion, deleteWhoIsLikelyQuestion } from "@/app/actions/who-is-likely";
import { Plus, Trash2, Edit2, Save, Users } from "lucide-react";

export default function WhoIsLikelyAdminClient({ questions }: { questions: WhoIsLikelyQuestion[] }) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    text: ""
  });

  const resetForm = () => {
    setFormData({
      text: ""
    });
    setEditingId(null);
  };

  const handleEdit = (q: WhoIsLikelyQuestion) => {
    setEditingId(q.id);
    setFormData({
      text: q.text
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      await updateWhoIsLikelyQuestion(editingId, formData);
    } else {
      await createWhoIsLikelyQuestion(formData);
    }
    resetForm();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Bu soruyu silmek istediğine emin misin?")) {
      await deleteWhoIsLikelyQuestion(id);
    }
  };

  return (
    <div className="space-y-8">
      {/* Form Section */}
      <div className="bg-white rounded-2xl p-6 border-4 border-[#2a0d59] shadow-[8px_8px_0px_0px_rgba(42,13,89,1)]">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-purple-100 rounded-lg border-2 border-[#2a0d59]">
            <Users className="w-6 h-6 text-purple-600" />
          </div>
          <h2 className="text-xl font-black text-[#2a0d59]">
            {editingId ? "Soruyu Düzenle" : "Yeni Soru Ekle"}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-[#2a0d59] mb-1">Soru Metni</label>
            <input
              type="text"
              required
              value={formData.text}
              onChange={(e) => setFormData({ ...formData, text: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 border-2 border-[#2a0d59]/20 rounded-xl focus:outline-none focus:border-[#2a0d59] transition-colors"
              placeholder="Örn: Kim daha kıskanç?"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-3 rounded-xl font-bold text-[#2a0d59] hover:bg-slate-100 transition-colors"
              >
                İptal
              </button>
            )}
            <button
              type="submit"
              className="px-6 py-3 bg-[#2a0d59] text-white rounded-xl font-bold hover:bg-[#172554] transition-all flex items-center gap-2 shadow-[4px_4px_0px_0px_rgba(42,13,89,0.5)] active:shadow-none active:translate-x-1 active:translate-y-1"
            >
              {editingId ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              {editingId ? "Kaydet" : "Ekle"}
            </button>
          </div>
        </form>
      </div>

      {/* List Section */}
      <div className="space-y-4">
        <h3 className="text-xl font-black text-[#2a0d59] px-2">Mevcut Sorular ({questions.length})</h3>
        {questions.map((q, idx) => (
          <div key={q.id} className="bg-white border-2 border-[#2a0d59]/20 rounded-xl p-4 flex items-center justify-between group hover:border-[#2a0d59] transition-colors">
            <div className="flex items-center gap-4">
              <span className="w-8 h-8 flex items-center justify-center bg-[#2a0d59]/10 rounded-lg text-[#2a0d59] font-black">
                {idx + 1}
              </span>
              <p className="font-bold text-[#2a0d59] text-lg">{q.text}</p>
            </div>
            
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => handleEdit(q)}
                className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
              >
                <Edit2 className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleDelete(q.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
