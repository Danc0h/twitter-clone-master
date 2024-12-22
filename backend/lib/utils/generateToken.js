import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (userId, res) => {
  try {
    // Log the user ID and environment for debugging
    console.log("Generating token for User ID:", userId);
    console.log("Environment:", process.env.NODE_ENV);

    // Generate the token
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: "15d",
    });
    console.log("Generated Token:", token);

    // Set the cookie with the token
    res.cookie("jwt", token, {
      maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days in milliseconds
      httpOnly: true, // Secure against XSS attacks
      sameSite: "strict", // Prevent CSRF attacks
      secure: process.env.NODE_ENV !== "development", // Secure flag for non-development
    });
    console.log("JWT Cookie set successfully");
  } catch (error) {
    // Log any errors for debugging
    console.error("Error in generateTokenAndSetCookie:", error.message);
  }
};
