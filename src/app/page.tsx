// Caminho do arquivo: src/app/page.tsx
"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function Home() {
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const[loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    setLoading(true);
    // Continuamos ordenando pela data REAL de criação, assim o post mais novo fica no topo
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erro ao buscar as publicações:", error);
    } else {
      setPosts(data ||[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    const isRPGAdmin = localStorage.getItem("isRPGAdmin");
    setIsLoggedIn(!!isRPGAdmin);
    fetchPosts();
  },[]);

  const handleDeletePost = async (postId: number) => {
    if (!confirm("Tem certeza que deseja excluir esta publicação?")) {
      return;
    }
    const { error } = await supabase.from("posts").delete().eq("id", postId);
    if (!error) {
      setPosts(posts.filter((p) => p.id !== postId));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <p className="text-gray-400 font-inter">Carregando publicações...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 mt-2">
      <div className="border-b border-gray-700 pb-2 mb-6">
        <h2 className="font-inter text-xl text-[#ff5252] font-bold uppercase tracking-wide">
          Posts
        </h2>
      </div>

      <div className="grid gap-8">
        {!posts || posts.length === 0 ? (
          <div className="py-16 text-center bg-[#2d2d2d] border border-gray-700 rounded-sm">
            <p className="text-gray-400 italic">
              Nenhuma publicação encontrada no momento.
            </p>
          </div>
        ) : (
          posts.map((post: any) => (
            <article
              key={post.id}
              className="bg-[#2d2d2d] border border-gray-700 rounded-sm p-6 shadow-sm hover:shadow-md transition-shadow duration-200 relative"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 pb-4 border-b border-gray-700 gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src="/avatar.png"
                    alt="Avatar"
                    className="w-10 h-10 rounded-sm object-cover border border-gray-700 bg-gray-700"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                  <div>
                    <span className="block text-[#ff5252] font-bold text-sm uppercase tracking-wide">
                      {post.author || "Admin"}
                    </span>
                    <time className="block text-xs text-gray-400 mt-0.5">
                      {/* Puxa a data falsa escrita pela mestre. Se o post for antigo e não tiver, avisa que a data é desconhecida */}
                      {post.post_date || "???"}
                    </time>
                  </div>
                </div>
                <span className="text-xs font-semibold text-gray-300 bg-gray-700 px-2 py-1 rounded-sm border border-gray-600 uppercase tracking-wider self-start sm:self-center">
                  {post.tag}
                </span>
              </div>

              {post.title && (
                <h3 className="font-playfair text-2xl font-bold text-gray-100 mb-3">
                  {post.title}
                </h3>
              )}

              <div className="text-gray-300 leading-relaxed text-sm md:text-base whitespace-pre-wrap">
                {post.content}
              </div>

              {isLoggedIn && (
                <div className="mt-4 pt-4 border-t border-gray-700 flex justify-end">
                  <button
                    onClick={() => handleDeletePost(post.id)}
                    className="text-xs text-gray-400 hover:text-[#ff5252] font-medium hover:underline transition-colors\"
                  >
                    Excluir publicação
                  </button>
                </div>
              )}
            </article>
          ))
        )}
      </div>
    </div>
  );
}