
import Category from "../models/category";
import AppError from "../utils/AppError";
import catchASync from "../utils/catchASync";
import mongoose from 'mongoose';

// @route       POST /api/categories
// @purpose     Add product cateogry
// @access      Admin
export const addCategory = catchASync(async (req, res) => {

    const { name, description } = req.body; 

    if (!name) throw new AppError(400, 'name is required'); 
    if (!description) throw new AppError(400, 'description is required'); 


    const newCategory = await Category.create({
        name, description
    })
  

    return res.json({
    status: "success",
      category: newCategory, 
    message: 'category added'
  });
});



// @route       GET /api/categories
// @purpose     Get all categories 
// @access      Public 
export const getAllCategories =  catchASync(async (req, res) => {
  const { page = 1, limit = 99999 } = req.query;
  const skip = limit * (page - 1);

  if (!page)
    throw new AppError(400, "invalid page query. Page must me a number");
  if (!limit)
    throw new AppError(400, "invalid limit query. Limit must me a number");


  const categories = await Category.find().skip(skip).limit(limit).lean();
    
  return res.json({
      status: "success",
      message: "successfully retrieved all category data",
      page,
      limit,
      results: categories.length,
      categories
    });

}) 


// @route       PATCH /api/categories/:id
// @purpose     Update category
// @access      Admin
export const updateCategory = catchASync(async (req, res) => {
  const { name, description} = req.body; 
  const id = req.query?.id; 

  if (!mongoose.Types.ObjectId.isValid(id)) throw new AppError(400, 'not a valid id');

  const category = await Category.findByIdAndUpdate(id, { $set: { name, description } }, { new: true, runValidators: true });

  if (category === null) throw new AppError(404, "no such category");
  
  return res.json({
    status: "success",
    message: "category updated successfully",
    category,
  });
});
 
// @route       DELETE /api/categories/:id
// @purpose     Delete category
// @access      Admin
export const deleteCategory = catchASync(async (req, res) => {

  const id = req.query?.id; 
  if (!mongoose.Types.ObjectId.isValid(id)) throw new AppError(400, 'not a valid id');

  const category = await Category.findByIdAndDelete(id);

  if (category === null) throw new AppError(404, "no such category");
  
  return res.json({
    status: "success",
    message: "category deleted",
    category,
  });
});
 
