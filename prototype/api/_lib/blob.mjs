// Restricts private Vercel Blob operations to exact server-generated paths and short-lived signed URLs.
import {
  BlobNotFoundError,
  del as vercelDelete,
  head as vercelHead,
  issueSignedToken as vercelIssueSignedToken,
  presignUrl as vercelPresignUrl,
} from "@vercel/blob";

const defaultSdk = { BlobNotFoundError, del: vercelDelete, head: vercelHead, issueSignedToken: vercelIssueSignedToken, presignUrl: vercelPresignUrl };

export function createBlobAdapter({ credentials = {}, fetchImpl = fetch, sdk = defaultSdk } = {}) {
  return {
    async signUpload(item, validUntil) {
      const signedToken = await sdk.issueSignedToken({
        ...credentials,
        pathname: item.pathname,
        operations: ["put"],
        validUntil,
        allowedContentTypes: [item.mime],
        maximumSizeInBytes: item.bytes,
      });
      const { presignedUrl } = await sdk.presignUrl(signedToken, {
        operation: "put",
        pathname: item.pathname,
        access: "private",
        validUntil,
        allowedContentTypes: [item.mime],
        maximumSizeInBytes: item.bytes,
        addRandomSuffix: false,
        allowOverwrite: false,
        cacheControlMaxAge: 31_536_000,
      });
      return { slot: item.slot, pathname: item.pathname, url: presignedUrl, headers: { "Content-Type": item.mime } };
    },

    async inspect(item, validUntil) {
      let metadata;
      try {
        metadata = await sdk.head(item.pathname, credentials);
      } catch (error) {
        if (error instanceof sdk.BlobNotFoundError) return null;
        throw error;
      }
      const signedToken = await sdk.issueSignedToken({
        ...credentials,
        pathname: item.pathname,
        operations: ["get"],
        validUntil,
      });
      const { presignedUrl } = await sdk.presignUrl(signedToken, {
        operation: "get",
        pathname: item.pathname,
        access: "private",
        validUntil,
        useCache: false,
      });
      const response = await fetchImpl(presignedUrl, { headers: { Range: "bytes=0-31" } });
      if (!response.ok) throw new Error("Unable to inspect uploaded media.");
      return {
        pathname: metadata.pathname,
        mime: metadata.contentType,
        bytes: metadata.size,
        etag: metadata.etag,
        prefix: new Uint8Array(await response.arrayBuffer()).slice(0, 32),
      };
    },

    async signRead(item, validUntil) {
      const signedToken = await sdk.issueSignedToken({
        ...credentials,
        pathname: item.pathname,
        operations: ["get"],
        validUntil,
      });
      const { presignedUrl } = await sdk.presignUrl(signedToken, {
        operation: "get",
        pathname: item.pathname,
        access: "private",
        validUntil,
      });
      return presignedUrl;
    },

    async deletePaths(pathnames) {
      if (pathnames.length > 0) await sdk.del(pathnames, credentials);
    },
  };
}
