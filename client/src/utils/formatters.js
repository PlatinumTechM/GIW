// Shared field formatting utility for forms
// Used in Register, Profile, and other forms

export const formatFieldValue = (name, value) => {
  switch (name) {
    case "name":
    case "company":
      // Allow single spaces between words, remove extra spaces, trim start
      return value.replace(/\s+/g, " ").trimStart();

    case "phone":
      // Only allow numbers (0-9)
      return value.replace(/[^0-9]/g, "");

    case "gst":
      // Always uppercase, remove spaces
      return value.replace(/\s/g, "").toUpperCase();

    case "address":
      // Trim start, allow single spaces between words/lines
      return value.replace(/\s+/g, " ").trimStart();

    case "password":
    case "confirmPassword":
      // Trim whitespace from password fields
      return value.trim();

    default:
      return value;
  }
};

export default formatFieldValue;
