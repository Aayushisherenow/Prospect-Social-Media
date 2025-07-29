import { User } from "../models/user.model.js";
import { Post } from "../models/post.model.js";
import asyncHandler from "../utils/asyncHandler.js";



const Search = asyncHandler(async (req, res) => {
  const { query } = req.params;

  if (!query) {
    return res.status(400).json({ message: "Search query is required." });
  }

  let postResults = [];
  let userResults = [];

  try {
 
      
      const matchingAuthors = await User.find({
        username: { $regex: query, $options: "i" },
      }).select("_id");

      const authorIds = matchingAuthors.map((user) => user._id);

      
    [userResults, postResults] = await Promise.all([
      User.find({
        $or: [
          { username: { $regex: query, $options: "i" } },
          { email: { $regex: query, $options: "i" } },
        ],
      }).select("-password -__v"),
      Post.find({
        $or: [
          { tags: { $elemMatch: { $regex: query, $options: "i" } } },
          // { content: { $regex: query, $options: "i" } },
          { author: { $in: authorIds } },
        ],
      })
        .populate("author", "username coverImage")
        .select("-__v"),
    ]);



    if( userResults.length === 0 && postResults.length === 0) {
      return res.status(204).json({ message: "No results found." });
    }


  res.status(200).json({
    users: userResults,
    posts: postResults,
  });
}
catch (error) {
    console.error("Error during search:", error);
    res.status(500).json({ message: "An error occurred while searching." });
  }
}
);


export { Search }
