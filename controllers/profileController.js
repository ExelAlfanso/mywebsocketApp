import multer from "multer";
import supabase from "../supabaseClient.js";
import User from "../models/User.js";

const upload = multer({ storage: multer.memoryStorage() });
export const uploadAvatarMiddleware = upload.single("avatar");

export const uploadAvatar = async (req, res) => {
  try {
    const { userId } = req.params;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    const fileName = `${userId}/${Date.now()}-${file.originalname}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
      });

    if (uploadError) {
      return res
        .status(500)
        .json({ error: `Upload Error: ${uploadError.message}` });
    }
    const { data } = supabase.storage.from("avatars").getPublicUrl(fileName);
    const publicUrl = data.publicUrl;

    await User.findByIdAndUpdate(userId, { avatar: publicUrl });
    res.json({ success: true, avatarUrl: publicUrl });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

export const updateUser = async (req, res) => {
  const { userId } = req.params;
  const { username, email } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { username, email },
      { new: true, runValidators: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.status(200).json({ message: "Sucessfully updated user!" });
  } catch (err) {
    console.error("Update error: ", err);
    res.status(500).json({ error: "Something went wrong" });
  }
};
