export const DRAFT_DB_NAME = "AsesiDraftDB";
export const DRAFT_STORE_NAME = "draftFiles";

export const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DRAFT_DB_NAME, 1);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (e) => {
      const db = (e.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(DRAFT_STORE_NAME)) {
        db.createObjectStore(DRAFT_STORE_NAME);
      }
    };
  });
};

export const saveDraftFiles = async (key: string, data: Record<string, unknown>) => {
  try {
    const db = await initDB();
    return new Promise<void>((resolve, reject) => {
      const tx = db.transaction(DRAFT_STORE_NAME, "readwrite");
      const store = tx.objectStore(DRAFT_STORE_NAME);

      const fileData: Record<string, unknown> = {};
      Object.keys(data).forEach((k) => {
        const val = data[k];
        if (val instanceof File) {
          fileData[k] = val;
        } else if (Array.isArray(val) && val.length > 0 && val[0] instanceof File) {
          fileData[k] = val;
        }
      });

      if (Object.keys(fileData).length > 0) {
        const request = store.put(fileData, key);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      } else {
        // If there are no files, we can just delete the key to save space
        const request = store.delete(key);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      }
    });
  } catch (error) {
    console.error("Failed to save draft files to IndexedDB:", error);
  }
};

export const loadDraftFiles = async (key: string): Promise<Record<string, unknown> | null> => {
  try {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(DRAFT_STORE_NAME, "readonly");
      const store = tx.objectStore(DRAFT_STORE_NAME);
      const request = store.get(key);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error("Failed to load draft files from IndexedDB:", error);
    return null;
  }
};

export const deleteDraftFiles = async (key: string) => {
  try {
    const db = await initDB();
    return new Promise<void>((resolve, reject) => {
      const tx = db.transaction(DRAFT_STORE_NAME, "readwrite");
      const store = tx.objectStore(DRAFT_STORE_NAME);
      const request = store.delete(key);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error("Failed to delete draft files from IndexedDB:", error);
  }
};
