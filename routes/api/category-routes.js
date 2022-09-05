const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

// find all categories be sure to include its associated products
router.get('/', (req, res) => {
  Category.findAll({
    include:[{model: Product}]
  }).then(data=>{
    res.json(data)
  }).catch(err=>{
    res.status(500).json({msg: "zoinks!", err})
  })
});

router.get('/:id', async (req, res) => {
  try { 
    const categoryData = await Category.findByPk(req.params.id,{
      include: [{model:Product}]
    });
  if (!categoryData) {
    res.status(404).json({msg: "No category with this ID!"});
    return;
  }
  res.status(200).json(categoryData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/",async (req,res)=>{
  try{
      const newCategory = await Category.create({
          category_name:req.body.category_name,
      })
      res.status(201).json(newCategory)
  }catch(err){
      console.log(err)
      res.status(500).json({msg:"Internal server error",err})
  }
})

router.put("/:id",(req,res)=>{
  Category.update({
    category_name:req.body.category_name
  },
      {
      where:{
          id:req.params.id
      }
      }).then(category=>{
          if(!category[0]){
              return res.status(404).json({msg:"No such category or no change made!"})
          }
      res.json(category)
  }).catch(err=>{
      res.status(500).json({msg:"Internal server error",err})
  })
})

router.delete('/:id', (req, res) => {
  Category.destroy({
    where:{
      id:req.params.id
    }
  }).then(category=>{
    if(!category){
      return res.status(404).json({msg:"No such category"})
    }
    res.json(category)
  }).catch(err=>{
    res.status(500).json({msg:"Internal server error",err})
  })
    res.json(200).json({msg:"Category was removed"})
});

module.exports = router;