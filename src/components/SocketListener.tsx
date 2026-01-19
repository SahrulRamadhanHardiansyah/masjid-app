"use client";

import { useEffect } from "react";
import { io } from "socket.io-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function SocketListener() {
  const router = useRouter();

  useEffect(() => {
    // Connect to the standalone Socket.IO server
    const socket = io("http://localhost:3001", {
      transports: ["websocket"], // Use websocket transport for better performance
      reconnectionAttempts: 5,
    });

    socket.on("connect", () => {
      console.log("Connected to Socket Server");
    });

    // --- Listen for Agenda Updates ---
    socket.on("agenda-update", (data: any) => {
      console.log("Agenda Update Received:", data);
      
      const message = data.message || "Data agenda diperbarui";
      
      toast.success("Info Agenda", {
        description: message,
      });

      // Refresh data di halaman Next.js (Server Components re-render)
      router.refresh();
    });

    // --- Listen for Finance Updates ---
    socket.on("finance-update", (data: any) => {
      console.log("Finance Update Received:", data);
      
      const message = data.message || "Data keuangan diperbarui";
      const type = data.type || "info";

      if (type === "expense") {
        toast.warning("Laporan Pengeluaran", { description: message });
      } else {
        toast.success("Laporan Pemasukan", { description: message });
      }

      router.refresh();
    });

    return () => {
      socket.disconnect();
    };
  }, [router]);

  return null; // Component ini tidak merender UI apa pun langsung
}
