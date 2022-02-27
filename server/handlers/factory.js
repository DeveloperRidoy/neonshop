import catchASync from "../utils/catchASync";


export const deleteAllDocs = (model) => catchASync(async (req, res, next) => {


    await model.deleteMany();

    return res.json({
      status: "success",
      message: `all ${model.collection.collectionName} deleted`,
    });

})