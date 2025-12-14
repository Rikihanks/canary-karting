import { db } from './firebase';
import { collection, onSnapshot, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';

const COLLECTION_NAME = 'funcionalidades';

// Subscribe to real-time updates
export const subscribeToConfig = (callback) => {
    const q = query(collection(db, COLLECTION_NAME));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const config = {};
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            // Map document format { feature: "teams", enabled: true } to { teams: true }
            if (data.feature) {
                config[data.feature] = data.enabled;
            }
        });
        callback(config);
    }, (error) => {
        console.error("Error listening to config changes: ", error);
    });

    return unsubscribe;
};

// Toggle a feature on/off
export const toggleFeature = async (featureName, isEnabled) => {
    try {
        // First find the document with this feature name
        const q = query(collection(db, COLLECTION_NAME), where("feature", "==", featureName));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            console.error(`Feature ${featureName} not found in Firestore`);
            throw new Error(`Feature ${featureName} not found`);
        }

        // Assuming feature names are unique, take the first match
        const docRef = querySnapshot.docs[0].ref;
        await updateDoc(docRef, {
            enabled: isEnabled
        });

        return { success: true };
    } catch (error) {
        console.error("Error updating feature:", error);
        throw error;
    }
};
