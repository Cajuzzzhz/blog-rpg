// Caminho do arquivo: src/app/admin/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import BackButton from "@/components/BackButton";

export default function LoginAdmin() {
  const USUARIO_CORRETO = "Não se esqueçam de mim"; // Pode mudar para o que quiser
  const SENHA_CORRETA = "SENHATESTE"; // Pode mudar para o que quiser
  // =================================

  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (usuario === USUARIO_CORRETO && password === SENHA_CORRETA) {
      localStorage.setItem("isRPGAdmin", "true");
      localStorage.setItem("RPGAdminName", usuario); 
      window.dispatchEvent(new Event("auth-change"));
      
      router.push("/admin");
    } else {
      setError("Credenciais inválidas.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] mt-6">
      <div className="w-full max-w-sm">
        
        {/* Botão de Voltar */}
        <div className="mb-4">
          <BackButton />
        </div>
        
        {/* Caixa de Login (Estilo Flat 2016) */}
        <div className="bg-white border border-gray-200 p-8 shadow-sm rounded-sm">
          <h2 className="font-playfair text-2xl text-gray-800 mb-6 text-center font-bold">
            Login
          </h2>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-gray-600 text-xs mb-1 font-bold uppercase tracking-wide">
                Usuário
              </label>
              <input
                type="text"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                className="w-full bg-white border border-gray-300 text-gray-800 px-3 py-2 rounded-sm focus:outline-none focus:border-[#c9302c]"
                required
              />
            </div>

            <div>
              <label className="block text-gray-600 text-xs mb-1 font-bold uppercase tracking-wide">
                Senha
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white border border-gray-300 text-gray-800 px-3 py-2 rounded-sm focus:outline-none focus:border-[#c9302c]"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#c9302c] hover:bg-[#a02622] text-white font-bold py-3 rounded-sm tracking-wider uppercase text-sm mt-2 transition-colors"
            >
              Entrar
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}