import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { LogOut, User, Mail, Heart } from "lucide-react";
import { Card } from "@/components/ui/card";

interface DashboardUser {
  id: string;
  username: string;
  email: string;
}

export default function Dashboard() {
  const [, navigate] = useLocation();
  const userStr = typeof window !== "undefined" ? localStorage.getItem("user") : null;
  const user: DashboardUser | null = userStr ? JSON.parse(userStr) : null;

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  if (!user) {
    navigate("/");
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <div className="p-8">
          <div className="mb-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Bem-vindo!
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Você está autenticado no sistema
            </p>
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-slate-800 rounded-lg">
              <User className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-sm text-gray-600 dark:text-gray-400">Nome</p>
                <p className="font-medium text-gray-900 dark:text-white truncate">
                  {user.username}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-slate-800 rounded-lg">
              <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                <p className="font-medium text-gray-900 dark:text-white truncate">
                  {user.email}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-slate-800 rounded-lg">
              <Heart className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Status</p>
                <p className="font-medium text-green-600 dark:text-green-400">
                  Logado com sucesso
                </p>
              </div>
            </div>
          </div>

          <Button
            onClick={handleLogout}
            className="w-full gap-2"
            variant="outline"
            data-testid="button-logout"
          >
            <LogOut className="w-4 h-4" />
            Sair da conta
          </Button>

          <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
            ID do usuário: {user.id.slice(0, 8)}...
          </p>
        </div>
      </Card>
    </div>
  );
}
