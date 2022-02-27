import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"], 
      unique: true
    }, 
    slug: String,
    description: {
      type: String,
      required: [true, "description is required"],
    }
  },
  { timestamps: true }
);

CategorySchema.pre("save", function (next) {
  this.slug = slugify(this.name);
  next();
});

// function to slugify a name
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\-\-+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, ""); // Trim - from end of text
}


const Category = mongoose.models.Category || mongoose.model("Category", CategorySchema);

export default Category; 
