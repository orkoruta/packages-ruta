export interface ApiResponse<T> {
  data: T;
  pagination?: PaginationInfo;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface IdempotencyHeaders {
  'X-Idempotency-Key': string;
  'X-Request-Id'?: string;
}

export interface UploadPresignedUrlInput {
  purpose: 'PRODUCT_IMAGE' | 'DELIVERY_EVIDENCE' | 'COLLECTION_EVIDENCE' | 'RETURN_EVIDENCE' | 'LOGO';
  filename: string;
  content_type: string;
  related_entity_type: 'order' | 'product' | 'client' | 'refund' | 'return';
  related_entity_id: number;
}

export interface UploadPresignedUrlResponse {
  upload_url: string;
  public_url: string;
  expires_at: string;
}
