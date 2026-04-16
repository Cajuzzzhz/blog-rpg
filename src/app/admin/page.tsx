// Caminho do arquivo: src/app/admin/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function AdminDashboard() {
  const router = useRouter();
  const [autorizado, setAutorizado] = useState(false);

  // Estados do Formulário
  const [title, setTitle] = useState("");
  const[tag, setTag] = useState("");
  const [postDate, setPostDate] = useState(""); 
  const[content, setContent] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState<{ tipo: "sucesso" | "erro", texto: string } | null>(null);

  useEffect(() => {
    const isRPGAdmin = localStorage.getItem("isRPGAdmin");
    if (!isRPGAdmin) {
      router.push("/admin/login");
    } else {
      setAutorizado(true);
    }
  }, [router]);

  const handlePublicar = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMensagem(null);

    const autor = localStorage.getItem("RPGAdminName") || "Admin";

    const { error } = await supabase
      .from("posts")
      .insert([{ title, tag, post_date: postDate, content, author: autor, excerpt: "" }]);

    if (error) {
      console.error(error);
      setMensagem({ tipo: "erro", texto: "Falha ao publicar a atualização." });
    } else {
      setMensagem({ tipo: "sucesso", texto: "Publicação adicionada com sucesso!" });
      setTitle("");
      setTag("");
      setPostDate("");
      setContent("");
    }
    setLoading(false);
  };

  if (!autorizado) return null;

  return (
    <div className="py-6">
      <div className="bg-white border border-gray-200 p-8 shadow-sm rounded-sm">
        <div className="flex justify-between items-center mb-8 border-b border-gray-200 pb-4">
          <h2 className="font-playfair text-3xl text-gray-800 font-bold tracking-tight">
            Painel de Publicação
          </h2>
          
          {/* Novo Botão de Voltar */}
          <Link 
            href="/"
            className="text-xs text-gray-500 hover:text-[#c9302c] uppercase font-bold tracking-wider transition-colors"
          >
            « Voltar ao Início
          </Link>
        </div>

        {mensagem && (
          <div className={`mb-6 p-4 rounded-sm text-sm border ${
            mensagem.tipo === "sucesso" 
              ? "bg-green-50 border-green-200 text-green-700" 
              : "bg-red-50 border-red-200 text-red-700"
          }`}>
            {mensagem.texto}
          </div>
        )}

        <form onSubmit={handlePublicar} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-gray-600 text-xs mb-2 font-bold uppercase tracking-wide">Título</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-white border border-gray-300 text-gray-800 px-3 py-2 rounded-sm focus:outline-none focus:border-[#c9302c]"
              />
            </div>
            <div>
              <label className="block text-gray-600 text-xs mb-2 font-bold uppercase tracking-wide">Data da Postagem</label>
              <input
                type="text"
                value={postDate}
                onChange={(e) => setPostDate(e.target.value)}
                className="w-full bg-white border border-gray-300 text-gray-800 px-3 py-2 rounded-sm focus:outline-none focus:border-[#c9302c]"
                required
                placeholder="Ex: 14 de Outubro de 2016, 15:30"
              />
            </div>
            <div>
              <label className="block text-gray-600 text-xs mb-2 font-bold uppercase tracking-wide">Tag</label>
              <input
                type="text"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                className="w-full bg-white border border-gray-300 text-gray-800 px-3 py-2 rounded-sm focus:outline-none focus:border-[#c9302c]"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-600 text-xs mb-2 font-bold uppercase tracking-wide">Conteúdo</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full bg-white border border-gray-300 text-gray-800 px-3 py-2 rounded-sm focus:outline-none focus:border-[#c9302c] h-64 resize-y"
              required
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="bg-[#c9302c] hover:bg-[#a02622] text-white font-bold py-3 px-6 rounded-sm uppercase tracking-wider text-sm transition-colors"
            >
              {loading ? "Publicando..." : "Publicar agora"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}