import { db } from '$lib/services/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

export const POST = async ({ request }) => {
	try {
		const { itemId } = await request.json();
		const docRef = doc(db, 'pantry', itemId);
		const docSnap = await getDoc(docRef);
		if (docSnap.exists()) {
			const increment = docSnap.data().count + 1;
			await updateDoc(docRef, { count: increment });
		}
		return new Response(JSON.stringify({ success: true }), { status: 200 });
	} catch (error) {
		console.error('Error incrementing item in Firestore:', error);
		return new Response(JSON.stringify({ success: false }), { status: 500 });
	}
};
