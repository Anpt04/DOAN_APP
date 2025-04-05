import { db, auth } from "./firebaseConfig";

export const addTransactionToCloud = async (transaction) => {
  const user = auth.currentUser;
  if (!user) return;

  await db.collection("transactions").add({
    userId: user.uid,
    ...transaction,
    createdAt: new Date(),
  });
};
