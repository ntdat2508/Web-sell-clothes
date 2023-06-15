/**
 * Required External Modules and Interfaces
 */
import express from 'express';
import { Request, Response } from 'express';
import * as ItemService from './items.service';
import { BaseItem, Item } from './item.interface';
import { AppDataSource } from '../data-source';
import { Product } from '../entity/product';
import { Category } from '../entity/category';
import { title } from 'process';
import multer from 'multer';
import path, { join } from 'path';
import expressEjsLayouts from 'express-ejs-layouts';
/**
 * Router Definition
 */
AppDataSource.initialize()
    .then(() => {
        console.log('Connected!');
    })
    .catch((error) => console.log('Loi' + error));

export const itemsRouter = express.Router();
const repositoryPrd = AppDataSource.getRepository(Product);
const repositoryCat = AppDataSource.getRepository(Category);

/**
 * Controller Definitions
 */

//multer

var storage = multer.diskStorage({
    destination:  path.resolve(__dirname, '../public/img/product'),
    filename: function(req,file,cb){
      return cb(null,`${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
  })
  var upload = multer({
    storage:storage
  })
//product
// POST items
itemsRouter.get('/', async (req: Request, res: Response) => {
  
    try {
        const products = await AppDataSource.createQueryBuilder(Product, 'product')
        .leftJoinAndSelect(Category, "category", "product.categoryID = category.id")
        .printSql()
        .getMany();
        res.render('admin', { list: products, title: 'Danh sách sản phẩm', layout:'layouts/layout' });
    
    } catch (e: any) {
        res.status(500).send(e.message);
    }
});

// // POST items
itemsRouter.post('/add',upload.single('image') ,async (req: Request, res: Response) => {
    const categoryId:number = parseInt(req.body.category, 10)
    try {
        const category = await repositoryCat.findOneOrFail({ where: { id: categoryId } });
        // Lấy danh mục từ database bằng ID được chọn trong form
        const addItem = await AppDataSource
    .createQueryBuilder()
    .insert()
    .into(Product)
    .values({
        name: req.body.name,
        description: req.body.description,
        quantity:req.body.quantity,
        price: req.body.price,
        image: req.file.filename,
        Category: { id: category.id }
    })

    .execute()
        return res.redirect('/');
    } catch (e) {
        return res.status(500).send(e.message);
    }
});

// POST items: edit
itemsRouter.post('/edit/:id',upload.single('image'), async (req: Request, res: Response) => {
    const id: number = parseInt(req.params.id, 10);

    try {
        const updatedItem = await AppDataSource
        .createQueryBuilder()
        .update(Product)
        .set({ 
            name: req.body.name,
            description: req.body.description,
            category: req.body.category,
            quantity:req.body.quantity,
            price: req.body.price,
            image: req.file.filename
        })
        .where('id = :id',{id:id}).execute();
        return res.redirect('/');
    } catch (e) {
        return res.status(500).send(e.message);
    }
});



// GET items/:id
itemsRouter.get('/prd_detail/:id', async (req: Request, res: Response) => {
    const id: number = parseInt(req.params.id, 10);
    try {
        const item = await repositoryPrd.findOne({ where: { id: id } });

        res.render('prd_detail', { item: item, layout: 'layouts/layout' });
    } catch (e: any) {
        res.status(500).send(e.message);
    }
});



// DELETE items/:id
itemsRouter.get('/delete/:id', async (req: Request, res: Response) => {
    try {
      const id: number = parseInt(req.params.id, 10);
      const item = await repositoryPrd.findOne({ 
        where: { id: id }  })
        // Kiểm tra xem sản phẩm có tồn tại hay không
      await repositoryPrd.delete(id);
      // Hiển thị trang xác nhận xóa sản phẩm
      
        // Giảm ID của các bản ghi khác đi 1
        await repositoryPrd.createQueryBuilder()
            .update(item)
            .set({ id: () => "id - 1" })
            .where("id > :id", { id: id })
            .execute();
            const count = await repositoryPrd.count();
            if (count === 0) {
              await repositoryPrd.query("ALTER table product AUTO_INCREMENT = 1");
            }
       res.redirect('/');
   } catch (e) {
      res.status(500).send(e.message);
    }
  });

// GET items/:id
itemsRouter.get('/add_product', async (req: Request, res: Response) => {
    const id: number = parseInt(req.params.id, 10);
    try {
        const categories= await repositoryCat.find();
        
        res.render('add_product',{ categories:categories,layout:'layouts/crud' });
    } catch (e: any) {
        res.status(500).send(e.message);
    }
});

// GET items/:id
itemsRouter.get('/edit_product/:id', async (req: Request, res: Response) => {
    const id: number = parseInt(req.params.id, 10);
    try {
        let item = await repositoryPrd.findOne({ where: { id: id } });

        res.render('edit_product', { item: item, layout: 'layouts/crud' });
    } catch (e: any) {
        res.status(500).send(e.message);
    }
});




//category
