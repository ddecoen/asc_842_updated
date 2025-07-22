import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy
} from 'firebase/firestore';
import { db } from './firebase';
import { Lease } from './types';

const LEASES_COLLECTION = 'leases';

// Create a new lease
export async function createLease(lease: Omit<Lease, 'id' | 'createdAt'>): Promise<string> {
  try {
    const leaseData = {
      ...lease,
      createdAt: new Date().toISOString()
    };
    
    const docRef = await addDoc(collection(db, LEASES_COLLECTION), leaseData);
    return docRef.id;
  } catch (error) {
    console.error('Error creating lease:', error);
    throw new Error('Failed to create lease');
  }
}

// Get all leases
export async function getLeases(): Promise<Lease[]> {
  try {
    const q = query(collection(db, LEASES_COLLECTION), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const leases: Lease[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      leases.push({
        id: doc.id,
        ...data
      } as Lease);
    });
    
    return leases;
  } catch (error) {
    console.error('Error getting leases:', error);
    throw new Error('Failed to fetch leases');
  }
}

// Get a single lease by ID
export async function getLease(id: string): Promise<Lease | null> {
  try {
    const docRef = doc(db, LEASES_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data
      } as Lease;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting lease:', error);
    throw new Error('Failed to fetch lease');
  }
}

// Update a lease
export async function updateLease(id: string, updates: Partial<Lease>): Promise<void> {
  try {
    const docRef = doc(db, LEASES_COLLECTION, id);
    await updateDoc(docRef, updates);
  } catch (error) {
    console.error('Error updating lease:', error);
    throw new Error('Failed to update lease');
  }
}

// Delete a lease
export async function deleteLease(id: string): Promise<void> {
  try {
    const docRef = doc(db, LEASES_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting lease:', error);
    throw new Error('Failed to delete lease');
  }
}

// Migration function to move data from localStorage to Firestore
export async function migrateFromLocalStorage(): Promise<void> {
  try {
    // Check if there's data in localStorage
    const localData = localStorage.getItem('leases');
    if (!localData) {
      console.log('No local data to migrate');
      return;
    }
    
    const leases: Lease[] = JSON.parse(localData);
    console.log(`Migrating ${leases.length} leases from localStorage to Firestore`);
    
    // Upload each lease to Firestore
    for (const lease of leases) {
      const { id: _id, ...leaseData } = lease; // Remove the old ID
      await createLease(leaseData);
    }
    
    // Clear localStorage after successful migration
    localStorage.removeItem('leases');
    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Error during migration:', error);
    throw new Error('Failed to migrate data from localStorage');
  }
}
