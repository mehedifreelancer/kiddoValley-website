// app/(public)/worksheets/worksheet.types.ts

export interface WorksheetItem {
  id: number;
  title: string;
  filePath: string; // relative path: "uploads/worksheets/..."
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
