export type AlertRecord = {
  id: string; 
  workspace_id: string;
  user_id: string;
  title?: string;
  message?: string;
  type?: string;
  is_read: boolean; 
  created_at?: string; 
};

export const fetcher = async (url: string) => {
  const token = localStorage.getItem("accessToken");
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) throw new Error("Failed to fetch notification logs");
  return res.json();
};
