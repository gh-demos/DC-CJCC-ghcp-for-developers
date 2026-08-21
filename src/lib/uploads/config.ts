const defaultMaximumFileBytes = 10 * 1024 * 1024;
const defaultMaximumBatchBytes = 50 * 1024 * 1024;
const uploadTokenLifetimeMs = 10 * 60 * 1000;

function getPositiveInteger(value: string | undefined, fallback: number) {
  const parsed = Number(value);
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : fallback;
}

export const uploadConfig = {
  maximumFileBytes: getPositiveInteger(
    process.env.MAX_UPLOAD_FILE_BYTES,
    defaultMaximumFileBytes,
  ),
  maximumBatchBytes: getPositiveInteger(
    process.env.MAX_UPLOAD_BATCH_BYTES,
    defaultMaximumBatchBytes,
  ),
  tokenLifetimeMs: uploadTokenLifetimeMs,
};