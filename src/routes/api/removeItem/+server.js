import { db } from '$lib/services/firebase';
import { doc, deleteDoc } from 'firebase/firestore';

export const POST = async ({ request }) => {
	const { itemId } = await request.json();

	try {
		// Delete the document by its ID
		const docRef = doc(db, 'pantry', itemId);
		await deleteDoc(docRef);

		return new Response(JSON.stringify({ success: true }), { status: 200 });
	} catch (error) {
		console.error('Error removing item from Firestore:', error);
		return new Response(JSON.stringify({ success: false }), { status: 500 });
	}
};
