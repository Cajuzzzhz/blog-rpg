// Caminho do arquivo: src/components/LoginButton.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function LoginButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const[userName, setUserName] = useState("");
  const router = useRouter();
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isRPGAdmin = localStorage.getItem("isRPGAdmin");
    const storedUserName = localStorage.getItem("RPGAdminName");
    setIsLoggedIn(!!isRPGAdmin);
    setUserName(storedUserName || "");
  },[]);

  useEffect(() => {
    if (isOpen) {
      const isRPGAdmin = localStorage.getItem("isRPGAdmin");
      const storedUserName = localStorage.getItem("RPGAdminName");
      setIsLoggedIn(!!isRPGAdmin);
      setUserName(storedUserName || "");
    }
  }, [isOpen]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);
 const verificarLogin = () => {
    const isRPGAdmin = localStorage.getItem("isRPGAdmin");
    const storedUserName = localStorage.getItem("RPGAdminName");
    setIsLoggedIn(!!isRPGAdmin);
    setUserName(storedUserName || "");
  };

  // Roda ao carregar a página e fica escutando o aviso do login
  useEffect(() => {
    verificarLogin(); // Checa ao entrar no site

    // Começa a ouvir o nosso sinal customizado "auth-change"
    window.addEventListener("auth-change", verificarLogin);

    return () => {
      window.removeEventListener("auth-change", verificarLogin);
    };
  },[]);

  // Mantemos a verificação ao abrir o modal por garantia
  useEffect(() => {
    if (isOpen) {
      verificarLogin();
    }
  }, [isOpen]);

  const handleLogout = () => {
    localStorage.removeItem("isRPGAdmin");
    localStorage.removeItem("RPGAdminName");
    setIsLoggedIn(false);
    setUserName("");
    setIsOpen(false);
    window.location.reload();
  };

  return (
    <div className="relative" ref={modalRef}>
      {/* Botão do Ícone */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-sm border border-gray-700 bg-[#2d2d2d] hover:bg-gray-700 transition-all flex items-center justify-center cursor-pointer shadow-sm text-gray-400"
      >
        {isLoggedIn ? (
          <img
            src="/avatar.png"
            alt="Avatar"
            className="w-5 h-5 rounded-sm object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        )}
      </button>

      {/* Modal Flutuante */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-72 p-6 z-50 bg-[#2d2d2d] border border-gray-700 shadow-lg rounded-sm animate-in fade-in slide-in-from-top-2 duration-200">
          {isLoggedIn ? (
            // CONTEÚDO QUANDO LOGADO
            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <img
                  src="/avatar.png"
                  alt="Avatar"
                  className="w-16 h-16 rounded-sm border border-gray-700 object-cover bg-gray-700"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/placeholder-avatar.png";
                  }}
                />
              </div>

              <h3 className="text-lg font-bold text-gray-100 mb-4 uppercase tracking-wide">
                {userName}
              </h3>

              <button
                onClick={() => {
                  setIsOpen(false);
                  router.push("/admin");
                }}
                className="w-full py-2.5 mb-2 bg-[#ff5252] hover:bg-[#ff6b6b] text-white font-bold rounded-sm uppercase tracking-widest text-xs transition-colors border-none cursor-pointer"
              >
                Painel de Publicação
              </button>

              <button
                onClick={handleLogout}
                className="w-full py-2.5 bg-gray-700 hover:bg-gray-600 text-gray-300 font-bold rounded-sm uppercase tracking-widest text-xs transition-colors border border-gray-600 cursor-pointer"
              >
                Desconectar
              </button>
            </div>
          ) : (
            // CONTEÚDO QUANDO NÃO LOGADO
            <div className="text-left">
              <h3 className="text-sm font-bold text-gray-100 mb-1">
                Você não está logado.
              </h3>
              <p className="text-gray-400 text-xs mb-5">
                Deseja realizar o login para acessar o painel?
              </p>

              <div className="flex flex-col gap-2">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    router.push("/admin/login");
                  }}
                  className="w-full py-2.5 bg-[#ff5252] hover:bg-[#ff6b6b] text-white font-bold rounded-sm uppercase tracking-widest text-xs transition-colors border-none cursor-pointer"
                >
                  Fazer Login
                </button>
                
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-full py-2.5 bg-transparent hover:bg-gray-700 text-gray-400 hover:text-gray-300 font-bold rounded-sm uppercase tracking-widest text-xs transition-colors border border-gray-700 cursor-pointer"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}

          {/* Triângulo Escuro */}
          <div className="absolute -top-1.5 right-3 w-3 h-3 bg-[#2d2d2d] border-l border-t border-gray-700 rotate-45"></div>
        </div>
      )}
    </div>
  );
}