// app/api/challenges/[id]/posts/select/route.js

import { connectToDB } from '@mongodb/database';
import Post from '@models/Post';

export async function GET(req) {
    
    const url = new URL(req.url, `http://${req.headers.host}`);
    const id = url.pathname.split('/')[3]; // Assurez-vous que l'index correspond à la position de l'ID dans l'URL.

    await connectToDB();

    try {
        const posts = await Post.find({ challengeId: id }).populate('author', 'name');
        return new Response(JSON.stringify(posts), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Erreur lors de la récupération des posts.' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}