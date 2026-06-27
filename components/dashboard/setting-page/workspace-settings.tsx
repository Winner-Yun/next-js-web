"use client";

import { useState } from "react";

export function WorkspaceSettings() {
  const [showMemberWorkspaces, setShowMemberWorkspaces] = useState(true);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h3 className="text-lg font-medium text-foreground">Workspace</h3>
        <p className="text-sm text-muted-foreground">
          Manage your team visibility and WorkSmart organization details.
        </p>
      </div>

      <div className="w-full h-px bg-muted/60" />

      <div className="flex items-center justify-between max-w-xl p-4 border border-muted/60 rounded-xl">
        <div className="space-y-0.5 pr-4">
          <label className="text-sm font-semibold text-foreground">
            Show Shared Workspaces
          </label>
          <p className="text-sm text-muted-foreground">
            Display workspaces in your directory where you are a member but not
            the owner.
          </p>
        </div>

        {/* Tailwind Toggle Switch */}
        <label className="relative inline-flex items-center cursor-pointer shrink-0">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={showMemberWorkspaces}
            onChange={() => setShowMemberWorkspaces(!showMemberWorkspaces)}
          />
          <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand"></div>
        </label>
      </div>
    </div>
  );
}
