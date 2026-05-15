import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "./firebase";

export async function getAssignmentsByClass(classCode: string) {
  const q = query(
    collection(db, "assignments"),
    where("classCode", "==", classCode)
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}