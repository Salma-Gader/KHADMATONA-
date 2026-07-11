"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/lib/auth-context";

export default function DashboardOverviewPage() {
  const { user } = useAuth();

  if (!user) return null;

  const firstName = user.name.split(" ")[0];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-text">
          Welcome back, {firstName}
        </h1>
        <p className="mt-1 text-sm text-text-muted">
          Here&apos;s your account and what&apos;s coming next.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <Card>
          <p className="mb-4 text-[0.7rem] font-bold tracking-wide text-text-muted uppercase">
            Your account
          </p>
          <dl className="flex flex-col gap-3 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-text-muted">Name</dt>
              <dd className="font-semibold text-text">{user.name}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-text-muted">Email</dt>
              <dd className="font-semibold text-text">{user.email}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-text-muted">Roles</dt>
              <dd className="flex gap-1.5">
                {user.roles && user.roles.length > 0 ? (
                  user.roles.map((role) => (
                    <Badge key={role} tone="gold">
                      {role}
                    </Badge>
                  ))
                ) : (
                  <span className="text-text-muted">No role assigned</span>
                )}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-text-muted">Member since</dt>
              <dd className="font-mono text-text">
                {new Date(user.created_at).toLocaleDateString("en-GB", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </dd>
            </div>
          </dl>
        </Card>

        <Card>
          <p className="mb-4 text-[0.7rem] font-bold tracking-wide text-text-muted uppercase">
            What&apos;s next
          </p>
          <p className="text-sm text-text-muted">
            Properties, Users and Settings will appear in the sidebar once
            their backend modules ship. This overview will then surface real
            portfolio metrics instead of account details.
          </p>
        </Card>
      </div>
    </div>
  );
}
