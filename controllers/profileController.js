import multer from "multer";
import supabase from "../supabaseClient.js";
import User from "../models/User.js";
import path from "path";

const upload = multer({ storage: multer.memoryStorage() });
export const uploadAvatarMiddleware = upload.single("avatar");

export const uploadAvatar = async (req, res) => {
  try {
    const { userId } = req.params;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    const ext = path.extname(file.originalname) || ".png";
    const filePath = `${userId}/${userId}-profile${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: true,
      });

    if (uploadError) {
      return res
        .status(500)
        .json({ error: `Upload Error: ${uploadError.message}` });
    }

    await User.findByIdAndUpdate(userId, { avatar: filePath });
    res.json({ success: true, avatar: filePath });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

export const getAvatarUrl = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user || !user.avatar) {
      return res.status(404).json({ error: "Avatar not found" });
    }

    const { data, error } = await supabase.storage
      .from("avatars")
      .createSignedUrl(user.avatar, 60 * 60);
    if (error)
      return res
        .status(500)
        .json({ error: `Signed URL Error:${error.message}` });
    return res.json({ avatarUrl: data.SignedUrl });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

export const updateUser = async (req, res) => {
  const { userId } = req.params;
  const { username, email, avatar } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { username, email, avatar },
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
