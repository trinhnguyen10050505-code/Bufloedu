export interface UploadItem {
  id: string;
  ownerId: string;
  ownerRole: "student" | "teacher";
  fileName: string;
  fileType: "pdf" | "docx" | "video";
  fileUrl: string;
  processedStatus: "pending" | "processing" | "done" | "failed";
}