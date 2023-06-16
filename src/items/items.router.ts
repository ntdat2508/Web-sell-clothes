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
import { Order } from '../entity/order';
import { title } from 'process';
import multer from 'multer';
import path, { join } from 'path';
import expressEjsLayouts from 'express-ejs-layouts';
const unidecode = require('unidecode');
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
const repositoryOrd = AppDataSource.getRepository(Order)
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
  

//forwebsite
//home
itemsRouter.get('/', async (req: Request, res: Response) => {
    try {
        const products = await repositoryPrd.manager.find(Product, {
            relations: ['Category'],
          });
        res.render('Website/home', { list:products ,layout:'layouts/layoutHome' });
    
    } catch (e: any) {
        res.status(500).send(e.message);
    }
});

itemsRouter.get('/categories/:category', async (req: Request, res: Response) => {
    try {
        const categoryName:string = req.params.category.toLowerCase().replace(/[^\w]/g, "_"); //laygiatri duong dan + chuyenthanh chu thuong
        const products = await repositoryPrd.manager.find(Product, {
            relations: ['Category'],  where: { 
                Category: { subname:categoryName }
            } 
        });
        const categories = await repositoryCat.find();
        const Category = await repositoryCat.findOne({
            where:{
                subname:categoryName
            }
        });
        res.render(`Website/categories/${categoryName}`, { list:products ,categories:categories,Category:Category,layout:'./layouts/layoutcategory' });
    } catch (e: any) {
        res.status(500).send(e.message);
    }
});

//product_detail_get
itemsRouter.get('/product_detail_wbs/:id', async (req: Request, res: Response) => {
    const id: number = parseInt(req.params.id, 10);
    try {
       const item = await repositoryPrd.manager.findOne(Product,{where:{id:id},
            relations: ['Category'],
          });
          const items = await repositoryPrd.manager.find(Product,{
            relations: ['Category'], where:{
                Category:{name:item.Category.name}
            }
          });

        res.render('Website/product_detail_wbs', { item: item,items:items, layout: 'layouts/layoutHome'});
    } catch (e: any) {
        res.status(500).send(e.message);
    }
});

//gio hàng
itemsRouter.get('/cart', async (req: Request, res: Response) => {
    try {
        res.render('Website/shopping_cart', { layout: 'layouts/layoutHome'});
    } catch (e: any) {
        res.status(500).send(e.message);
    }
});












//forwebsite


//get product
itemsRouter.get('/admin', async (req: Request, res: Response) => {
    try {
        const products = await repositoryPrd.manager.find(Product, {
            relations: ['Category'],
          });
        res.render('Products_admin/admin', { list: products, title: 'Danh sách sản phẩm', layout:'layouts/layout' });
    
    } catch (e: any) {
        res.status(500).send(e.message);
    }
});

//add product
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
        name: (req.body.name).toUpperCase(),
        description: req.body.description,
        quantity:req.body.quantity,
        price: req.body.price,
        image: req.file.filename,
        Category: { id: category.id },
    })

    .execute()
        return res.redirect('/admin');
    } catch (e) {
        return res.status(500).send(e.message);
    }
});

//edit product
itemsRouter.post('/edit/:id',upload.single('image'), async (req: Request, res: Response) => {
    const id: number = parseInt(req.params.id, 10);
    const categoryId:number = parseInt(req.body.category, 10)
    try {
        const category = await repositoryCat.findOneOrFail({ where: { id: categoryId } });
        const item = await repositoryPrd.findOneOrFail({where:{id:id}});
        const updatedItem = await AppDataSource
        .createQueryBuilder()
        .update(Product)
        .set({ 
            name: req.body.name,
            description: req.body.description,
            Category: { id: category.id },
            quantity:req.body.quantity,
            price: req.body.price,
            image: req.file ? req.file.filename : item.image
        })
        .where('id = :id',{id:id}).execute();
        return res.redirect('/admin');
    } catch (e) {
        return res.status(500).send(e.message);
    }
});



//get product_detail
itemsRouter.get('/prd_detail/:id', async (req: Request, res: Response) => {
    const id: number = parseInt(req.params.id, 10);
    try {
       const item = await repositoryPrd.manager.findOne(Product,{where:{id:id},
            relations: ['Category'],
          });

        res.render('Products_admin/prd_detail', { item: item, layout: 'layouts/layout'});
    } catch (e: any) {
        res.status(500).send(e.message);
    }
});



//delete product
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
       res.redirect('/admin');
   } catch (e) {
      res.status(500).send(e.message);
    }
  });

// GET items/:id
itemsRouter.get('/add_product', async (req: Request, res: Response) => {
    const id: number = parseInt(req.params.id, 10);
    try {
        const categories= await repositoryCat.find();
        
        res.render('Products_admin/add_product',{ categories:categories,layout:'layouts/crud' });
    } catch (e: any) {
        res.status(500).send(e.message);
    }
});

// GET items/:id
itemsRouter.get('/edit_product/:id', async (req: Request, res: Response) => {
    const id: number = parseInt(req.params.id, 10);
    try {
        // let item = await repositoryPrd.findOne({ where: { id: id } });
        const categories= await repositoryCat.find();
        const item = await repositoryPrd.manager.findOne(Product,{where:{id:id},
            relations: ['Category'],
          });

        res.render('Products_admin/edit_product', { item: item,categories:categories, layout: 'layouts/crud' });
    } catch (e: any) {
        res.status(500).send(e.message);
    }
});




//category
//category
var storagecat = multer.diskStorage({
    destination:  path.resolve(__dirname, '../public/img/category'),
    filename: function(req,file,cb){
      return cb(null,`${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
  })
  var uploadcat = multer({
    storage:storagecat
  })
  
  //get category
  itemsRouter.get('/category_admin', async (req: Request, res: Response) => {

    try {
        const cate = await repositoryCat.manager.find(Category)
        // const allPhotos = await items.find()
        res.render('Categories_admin/category', { list: cate, title: 'Danh sách danh mục', layout:'layouts/layout' });

} catch (e: any) {
    res.status(500).send(e.message);
}
});

//post category
itemsRouter.post('/add_cate', uploadcat.single('image') ,async (req: Request, res: Response) => {
    try {
        // Lấy giá trị của trường 'name' từ request body
    const categoryName = req.body.name;

// Chuyển đổi toàn bộ ký tự trong tên danh mục thành chữ in hoa
    const categoryUpperCase = categoryName.toUpperCase();

// Lưu tên danh mục vào cơ sở dữ liệu
    const addCate = await AppDataSource
    .createQueryBuilder()
    .insert()
    .into(Category)
    .values({
    name: categoryUpperCase,
    image: req.file.filename,
    subname: unidecode((req.body.name).toLowerCase().replace(/\s+/g, "_"))
  })
  .execute();
        return res.redirect('/category_admin');
    } catch (e) {
        return res.status(500).send(e.message);
    }
});

//post edit category
itemsRouter.post('/edit_cate/:id',uploadcat.single('image'), async (req: Request, res: Response) => {
    const id: number = parseInt(req.params.id, 10);

    try {
        const item = await repositoryCat.findOneOrFail({where:{id:id}});
        const updatedCate = await AppDataSource
        .createQueryBuilder()
        .update(Category)
        .set({ 
            name: (req.body.name).toUpperCase(),
            image: req.file ? req.file.filename : item.image,
            subname: unidecode((req.body.name).toLowerCase().replace(/\s+/g, "_"))
        })
        .where('id = :id',{id:id}).execute();
        return res.redirect('/category_admin');
    } catch (e) {
        return res.status(500).send(e.message);
    }
});

// get category
itemsRouter.get('/delete_cate/:id', async (req: Request, res: Response) => {
    try {
      const id: number = parseInt(req.params.id, 10);
      const cate = await repositoryCat.findOne({ 
        where: { id: id }  })
        // Kiểm tra xem sản phẩm có tồn tại hay không
      await repositoryCat.delete(id);
      // Hiển thị trang xác nhận xóa sản phẩm
      
        // Giảm ID của các bản ghi khác đi 1
        await repositoryCat.createQueryBuilder()
            .update(cate)
            .set({ id: () => "id - 1" })
            .where("id > :id", { id: id })
            .execute();
            const count = await repositoryCat.count();
            if (count === 0) {
              await repositoryPrd.query("ALTER table category AUTO_INCREMENT = 1");
            }
       res.redirect('/category_admin');
   } catch (e) {
      res.status(500).send(e.message);
    }
  });

  //get add category
  itemsRouter.get('/add_category', async (req: Request, res: Response) => {
    const id: number = parseInt(req.params.id, 10);
    try {
        const categories= await repositoryCat.find();
            res.render('Categories_admin/add_category',{ cates:categories,layout:'layouts/crud' });
    } catch (e: any) {
        res.status(500).send(e.message);
    }
});

//get edit catorory
itemsRouter.get('/edit_category/:id', async (req: Request, res: Response) => {
    const id: number = parseInt(req.params.id, 10);
    try {
        // if(!isNaN(id)) {
        const cate = await repositoryCat.findOne({ where: { id: id } });

        res.render('Categories_admin/edit_category', { cate: cate,layout: 'layouts/crud'  });
    } catch (e: any) {
        res.status(500).send(e.message);
    }
});
//cart









// Đơn hàng
// GET items
itemsRouter.get('/order_admin', async (req: Request, res: Response) => {
    try {
        const orders = await repositoryOrd.find({
            relations: {
                Products: true,
            },
        });
        res.render('Orders_admin/order', { list: orders, title: 'Danh sách đơn hàng', layout: 'layouts/layout' });
    } catch (e: any) {
        res.status(500).send(e.message);
    }
});

// // POST items
itemsRouter.post('/add_ord', async (req: Request, res: Response) => {
    try {
        const addItem = await AppDataSource.createQueryBuilder()
            .insert()
            .into(Order)
            .values({
                name: req.body.name,
                status: req.body.status,
                costumer: req.body.costumer,
                address: req.body.address,
                phone: req.body.phone,
                date: req.body.date,
            })
            .execute();
        return res.redirect('/order_admin');
    } catch (e) {
        return res.status(500).send(e.message);
    }
});

// POST items: edit
itemsRouter.post('/edit_ord/:id', async (req: Request, res: Response) => {
    const id: number = parseInt(req.params.id, 10);
    const categoryId: number = parseInt(req.body.category, 10);
    try {
        const category = await repositoryCat.findOneOrFail({ where: { id: categoryId } });
        const item = await repositoryPrd.findOneOrFail({ where: { id: id } });
        const updatedItem = await AppDataSource.createQueryBuilder()
            .update(Product)
            .set({
                name: req.body.name,
                description: req.body.description,
                Category: { id: category.id },
                quantity: req.body.quantity,
                price: req.body.price,
                image: req.file ? req.file.filename : item.image,
            })
            .where('id = :id', { id: id })
            .execute();
        return res.redirect('/order_admin');
    } catch (e) {
        return res.status(500).send(e.message);
    }
});

// GET items/:id //detail
itemsRouter.get('/prd_detail/:id', async (req: Request, res: Response) => {
    const id: number = parseInt(req.params.id, 10);
    try {
        const item = await repositoryPrd.manager.findOne(Product, { where: { id: id }, relations: ['Category'] });

        res.render('prd_detail', { item: item, layout: 'layouts/layout' });
    } catch (e: any) {
        res.status(500).send(e.message);
    }
});

// DELETE items/:id
itemsRouter.get('/delete_ord/:id', async (req: Request, res: Response) => {
    try {
        const id: number = parseInt(req.params.id, 10);
        const item = await repositoryOrd.findOne({
            where: { id: id },
        });
        // Kiểm tra xem sản phẩm có tồn tại hay không
        await repositoryOrd.delete(id);
        // Hiển thị trang xác nhận xóa sản phẩm

        // Giảm ID của các bản ghi khác đi 1
        await repositoryOrd
            .createQueryBuilder()
            .update(item)
            .set({ id: () => 'id - 1' })
            .where('id > :id', { id: id })
            .execute();
        const count = await repositoryOrd.count();
        if (count === 0) {
            await repositoryOrd.query('ALTER table order AUTO_INCREMENT = 1');
        }
        res.redirect('/order_admin');
    } catch (e) {
        res.status(500).send(e.message);
    }
});

// GET add order
itemsRouter.get('/add_order', async (req: Request, res: Response) => {
    const id: number = parseInt(req.params.id, 10);
    try {
        const orders = await repositoryOrd.find();
        res.render('Orders_admin/add_order', { layout: 'layouts/crud' });
    } catch (e: any) {
        res.status(500).send(e.message);
    }
});

// GET edit order
itemsRouter.get('/edit_order/:id', async (req: Request, res: Response) => {
    const id: number = parseInt(req.params.id, 10);
    try {
        const item = await repositoryOrd.findOne({ where: { id: id } });
        let statuss: string[] = ["Đang chuẩn bị", "Đang xử lý","Đang giao","Đã huỷ"];
        res.render('Orders_admin/edit_order', { item: item, statuss:statuss ,layout: 'layouts/crud' });
    } catch (e: any) {
        res.status(500).send(e.message);
    }
});
