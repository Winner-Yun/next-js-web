import { WorkspaceProvider } from "@/provider/workspace-provider"; // Update with your actual import path

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;  
}) {
  return <WorkspaceProvider>{children}</WorkspaceProvider>;
}
