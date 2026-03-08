import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AlertTriangle } from "lucide-react";

const AdminErrorLogs = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("error_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);
      setLogs(data ?? []);
      setLoading(false);
    };
    fetch();
  }, []);

  const typeColor = (t: string) => {
    if (t === "payment") return "bg-destructive/20 text-destructive";
    if (t === "api") return "bg-accent/20 text-accent-foreground";
    return "bg-muted text-muted-foreground";
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-display font-bold text-foreground">Error Logs</h2>
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : logs.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <AlertTriangle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No errors logged</p>
        </div>
      ) : (
        <div className="space-y-2">
          {logs.map((log) => (
            <div key={log.id} className="glass-card p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${typeColor(log.error_type)}`}>
                      {log.error_type}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(log.created_at).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  <p className="text-sm text-foreground font-medium">{log.message}</p>
                  {log.details && <p className="text-xs text-muted-foreground mt-1 font-mono break-all">{log.details}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminErrorLogs;
