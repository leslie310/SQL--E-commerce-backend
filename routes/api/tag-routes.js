const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', (req, res) => {
  Tag.findAll(({
    include: [{model: Product}]
  })).then(data=>{
    res.json(data)
  }).catch(err=>{
    res.status(500).json({msg: "zoinks!", err})
  })
});

router.get('/:id', async (req, res) => {
  try { 
    const tagData = await Tag.findByPk(req.params.id, {
      include: [{model:Product}]
    });
  if (!tagData) {
    res.status(404).json({msg: "No product with this ID!"});
    return;
  }
  res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/",async (req,res)=>{
  try{
      const newTag = await Tag.create({
          tag_name:req.body.tag_name,
      })
      res.status(201).json(newTag)
  }catch(err){
      console.log(err)
      res.status(500).json({msg:"Internal server error",err})
  }
})

router.put("/:id",(req,res)=>{
  Tag.update({
    tag_name:req.body.tag_name
  },
      {
      where:{
          id:req.params.id
      }
      }).then(tag=>{
          if(!tag[0]){
              return res.status(404).json({msg:"No such tag or no change made!"})
          }
      res.json(tag)
  }).catch(err=>{
      res.status(500).json({msg:"Internal server error",err})
  })
})

router.delete('/:id', (req, res) => {
  Tag.destroy({
    where:{
      id:req.params.id
    }
  }).then(tag=>{
    if(!tag){
      return res.status(404).json({msg:"No such tag"})
    }
    res.json(tag)
  }).catch(err=>{
    res.status(500).json({msg:"Internal server error",err})
  })
});

module.exports = router;