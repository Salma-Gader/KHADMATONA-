"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "@/components/ui/table";
import { PropertyStatusBadge } from "@/components/properties/status-badge";
import { ApiError } from "@/lib/api";
import { deleteProperty, listProperties } from "@/lib/properties";
import {
  PROPERTY_TYPE_LABELS,
  type Pagination as PaginationData,
  type Property,
} from "@/types/property";

const currencyFormatter = new Intl.NumberFormat("fr-FR", {
  maximumFractionDigits: 0,
});

export default function PropertiesListPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      setIsLoading(true);
      setError(null);

      try {
        const result = await listProperties({ page, search });
        if (cancelled) return;
        setProperties(result.properties);
        setPagination(result.pagination);
      } catch (caught) {
        if (cancelled) return;
        setError(
          caught instanceof ApiError
            ? caught.message
            : "Une erreur est survenue.",
        );
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    run();

    return () => {
      cancelled = true;
    };
  }, [page, search]);

  function handleSearchSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  }

  async function handleDelete(property: Property) {
    if (!confirm(`Supprimer le bien "${property.title}" ?`)) return;

    setDeletingId(property.id);
    try {
      await deleteProperty(property.id);
      setProperties((current) => current.filter((p) => p.id !== property.id));
    } catch (caught) {
      setError(
        caught instanceof ApiError
          ? caught.message
          : "La suppression a échoué.",
      );
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="min-w-0">
          <h1 className="font-display text-2xl font-semibold text-text sm:text-3xl">
            Biens immobiliers
          </h1>
          <p className="mt-1 text-sm text-text-muted">
            Gérez la liste des biens immobiliers.
          </p>
        </div>
        <Link href="/dashboard/properties/new" className="w-full sm:w-auto">
          <Button className="w-full sm:w-auto">Ajouter un bien</Button>
        </Link>
      </div>

      <form
        onSubmit={handleSearchSubmit}
        className="flex w-full max-w-sm items-center gap-2"
      >
        <input
          type="search"
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
          placeholder="Rechercher par titre ou ville…"
          className="w-full min-w-0 rounded-sm border-[1.5px] border-border-strong bg-surface px-3.5 py-2.5 text-[0.95rem] text-text focus-visible:border-gold-primary"
        />
        <Button type="submit" variant="secondary" className="shrink-0">
          Rechercher
        </Button>
      </form>

      {error && <Alert tone="error">{error}</Alert>}

      {isLoading ? (
        <p className="text-sm text-text-muted">Chargement…</p>
      ) : properties.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border-strong bg-surface-muted p-8 text-center sm:p-12">
          <h3 className="font-display text-xl font-semibold text-text">
            Aucun bien trouvé
          </h3>
          <p className="mt-2 text-sm text-text-muted">
            {search
              ? "Essayez une autre recherche."
              : "Commencez par ajouter un bien."}
          </p>
        </div>
      ) : (
        <>
          <Table>
            <TableHead>
              <TableHeaderCell>Titre</TableHeaderCell>
              <TableHeaderCell>Type</TableHeaderCell>
              <TableHeaderCell>Ville</TableHeaderCell>
              <TableHeaderCell>Statut</TableHeaderCell>
              <TableHeaderCell className="text-right">Prix</TableHeaderCell>
              <TableHeaderCell className="text-right">Actions</TableHeaderCell>
            </TableHead>
            <TableBody>
              {properties.map((property) => (
                <TableRow key={property.id}>
                  <TableCell className="font-semibold">
                    {property.title}
                  </TableCell>
                  <TableCell>{PROPERTY_TYPE_LABELS[property.type]}</TableCell>
                  <TableCell>{property.city}</TableCell>
                  <TableCell>
                    <PropertyStatusBadge status={property.status} />
                  </TableCell>
                  <TableCell className="text-right font-mono tabular-nums">
                    {currencyFormatter.format(property.price)} MAD
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-3 text-[0.82rem] font-semibold">
                      <Link
                        href={`/dashboard/properties/${property.id}`}
                        className="text-gold-primary hover:underline"
                      >
                        Voir
                      </Link>
                      <Link
                        href={`/dashboard/properties/${property.id}/edit`}
                        className="text-gold-primary hover:underline"
                      >
                        Modifier
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(property)}
                        disabled={deletingId === property.id}
                        className="text-error hover:underline disabled:opacity-50"
                      >
                        {deletingId === property.id
                          ? "Suppression…"
                          : "Supprimer"}
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {pagination && (
            <Pagination pagination={pagination} onPageChange={setPage} />
          )}
        </>
      )}
    </div>
  );
}
