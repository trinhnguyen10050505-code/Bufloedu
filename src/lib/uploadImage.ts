import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "@/lib/firebase";

export async function uploadLessonImage(file: File, lessonId: string) {
  const safeFileName = file.name.replace(/\s+/g, "-");
  const imageRef = ref(
    storage,
    `lesson-images/${lessonId}/${Date.now()}-${safeFileName}`
  );

  await uploadBytes(imageRef, file);

  return await getDownloadURL(imageRef);
}