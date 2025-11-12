"use client";

import { useRouter, useSearchParams } from "next/navigation";

interface PaginationProps {
  page: number;
  totalPages: number;
}

const Pagination = ({ page, totalPages }: PaginationProps) => {
  const router = useRouter();
  const params = useSearchParams();

  const goToPage = (newPage: number) => {
    const newParams = new URLSearchParams(params);
    newParams.set("page", String(newPage));
    router.push(`?${newParams.toString()}`);
  };

  return (
    <div className="flex justify-center gap-1 mt-3 mb-5">
      <button
        onClick={() => goToPage(page - 1)}
        disabled={page === 1}
        className="px-3 py-1 rounded text-gray-400 font-medium transition-colors duration-150 bg-transparent hover:text-primary disabled:opacity-50 disabled:pointer-events-none"
      >
        ← Prev
      </button>
      <span className="px-3 py-1 rounded text-primary font-bold">{page}</span>
      <button
        onClick={() => goToPage(page + 1)}
        disabled={page === totalPages}
        className="px-3 py-1 rounded text-gray-400 font-medium transition-colors duration-150 bg-transparent hover:text-primary disabled:opacity-50 disabled:pointer-events-none"
      >
        Next →
      </button>
    </div>
  );
};

export default Pagination;
