import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "@/lib/firebase";

export async function uploadFile(file: File, folder: string) {
  const safeName = file.name.replace(/\s+/g, "-");
  const fileRef = ref(storage, `${folder}/${Date.now()}-${safeName}`);

  await uploadBytes(fileRef, file);

  const downloadURL = await getDownloadURL(fileRef);

  return {
    downloadURL,
    storagePath: fileRef.fullPath,
    fileName: file.name,
    mimeType: file.type || "application/octet-stream",
    sizeBytes: file.size,
  };
}