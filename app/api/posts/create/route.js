// app/api/post/create/route.js
import { getServerSession } from "next-auth";
import cloudinary from "cloudinary";
import { connectToDB } from "@/mongodb/database";
import Post from "@/models/Post";
import User from "@/models/User";
import { NextResponse } from "next/server";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
  try {
    // Connect to the database
    await connectToDB();

    // Get the user's session
    const session = await getServerSession(req);
    if (!session || !session.user) {
      return NextResponse.json({ message: "Utilisateur non authentifié." }, { status: 401 });
    }

    // Verify if the user exists in the database
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ message: "Utilisateur non trouvé." }, { status: 404 });
    }

    // Retrieve form data
    const data = await req.formData();
    const { title, content, challengeId } = Object.fromEntries(data.entries());
    const photo = data.get('photo');

    // Validate required fields
    if (!title || !content || !challengeId) {
      return NextResponse.json({ message: "Tous les champs requis doivent être remplis." }, { status: 400 });
    }

    // Handle the photo upload
    let photoUrl = "/assets/No_Image_Available.jpg";
    if (photo && typeof photo.size === "number" && photo.size > 0) {
      try {
        const arrayBuffer = await photo.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        if (!Buffer.isBuffer(buffer)) {
          throw new Error("Conversion en Buffer a échoué.");
        }

        console.log('Photo Buffer Length:', buffer.length);

        // Upload the photo using Cloudinary
        const uploadResult = await cloudinary.v2.uploader.upload(`data:image/jpeg;base64,${buffer.toString('base64')}`, {
          folder: "post_photos"
        });

        if (uploadResult?.secure_url) {
          photoUrl = uploadResult.secure_url;
        } else {
          throw new Error("Échec de l'upload de la photo.");
        }
      } catch (uploadError) {
        console.error("Erreur lors de l'upload de la photo:", uploadError);
        return NextResponse.json({ message: "Erreur lors de l'upload de la photo." }, { status: 500 });
      }
    }

    // Create a new post
    const newPost = new Post({
      title,
      content,
      author: user._id,
      photoUrl,
      challengeId,
    });

    await newPost.save();
    console.log("Nouveau post créé :", newPost);
    return NextResponse.json({ message: "Post créé avec succès." }, { status: 201 });
  } catch (error) {
    console.error("Erreur lors de la création du post:", error);
    return NextResponse.json({ error: error.message || "Erreur interne du serveur." }, { status: 500 });
  }
}
