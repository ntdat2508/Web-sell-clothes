/**
 * Required External Modules and Interfaces
 */
import express from 'express';
import { Request, Response } from 'express';
import * as ItemService from './items.service';
import { BaseItem, Item } from './item.interface';
import { AppDataSource } from '../data-source';
import { Product } from '../entity/product';
<<<<<<< Updated upstream
=======
import { Category } from '../entity/category';
import { Orders } from '../entity/orders';
import { order_products_product } from '../entity/orders_products_product';
import { User } from '../entity/user';
import { title } from 'process';
import multer from 'multer';
import moment from 'moment-timezone';
import path, { join } from 'path';
import expressEjsLayouts from 'express-ejs-layouts';
import unidecode from 'unidecode';
import bcrypt from 'bcrypt';
import { isArray } from 'util';
import { type } from 'os';
import { And, Between, Like } from 'typeorm';
import { count } from 'console';

const unidecode = require('unidecode');
>>>>>>> Stashed changes
/**
 * Router Definition
 */
AppDataSource.initialize()
    .then(() => {
        console.log('Connected!');
    })
    .catch((error) => console.log('Lỗi' + error));

export const itemsRouter = express.Router();
<<<<<<< Updated upstream
const repository = AppDataSource.getRepository(Product);
=======
const repositoryPrd = AppDataSource.getRepository(Product);
const repositoryCat = AppDataSource.getRepository(Category);
const repositoryOrd = AppDataSource.getRepository(Orders);
const repositoryUser = AppDataSource.getRepository(User);
const repositoryOrd_detail = AppDataSource.getRepository(order_products_product);

//multer

var storage = multer.diskStorage({
    destination: path.resolve(__dirname, '../public/img/product'),
    filename: function (req, file, cb) {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
    },
});
var upload = multer({
    storage: storage,
});
>>>>>>> Stashed changes

/**
 * Controller Definitions
 */

// GET items
itemsRouter.get('/', async (req: Request, res: Response) => {
    try {
<<<<<<< Updated upstream
        // const items: Item[] = await ItemService.findAll();
        // console.log("a");
        // console.log("b");
        // eslint-disable-next-line prefer-const
        let it = await repository.find();
        console.log(it);

        // const allPhotos = await items.find()
        res.render('items/ds', { list: it, title: 'Danh sách sản phẩm' });
        // res.status(200).send(items);
=======
        const products = await repositoryPrd.manager.find(Product, {
            relations: ['Category'],
        });
        res.render('Website/home', { list: products, layout: 'layouts/layoutHome' });
    } catch (e: any) {
        res.status(500).send(e.message);
    }
});

itemsRouter.get('/categories/:category', async (req: Request, res: Response) => {
    try {
        let minprice = req.query.filterPricemin;
        let maxprice = req.query.filterPricemax;
        let min = 0;
        let max = 2000000000;
        if (typeof minprice === 'string' && typeof maxprice === 'string') {
            min = parseFloat(minprice);
            max = parseFloat(maxprice);
        }
        const sapxep = req.query.sort;
        const categoryName: string = req.params.category.toLowerCase().replace(/[^\w]/g, '_'); //laygiatri duong dan + chuyenthanh chu thuong
        const products = await repositoryPrd.manager.find(Product, {
            relations: ['Category'],
            where: {
                Category: { subname: categoryName },
                price: Between(min, max),
            },
            order:
                sapxep === 'a_z'
                    ? { name: 'ASC' }
                    : sapxep === 'z_a'
                    ? { name: 'DESC' }
                    : sapxep === 'thap_cao'
                    ? { price: 'ASC' }
                    : { price: 'DESC' },
        });
        const categories = await repositoryCat.find();
        const Category = await repositoryCat.findOne({
            where: {
                subname: categoryName,
            },
        });
        res.render(`Website/categories/${categoryName}`, {
            list: products,
            categories: categories,
            Category: Category,
            layout: './layouts/layoutcategory',
        });
        res.render(`Website/categories/${categoryName}`, {
            list: products,
            categories: categories,
            Category: Category,
            sapxep: sapxep,
            layout: './layouts/layoutcategory',
        });
    } catch (e: any) {
        res.status(500).send(e.message);
    }
});

//product_detail_get
itemsRouter.get('/product_detail_wbs/:id', async (req: Request, res: Response) => {
    const id: number = parseInt(req.params.id, 10);
    try {
        const item = await repositoryPrd.manager.findOne(Product, { where: { id: id }, relations: ['Category'] });
        const items = await repositoryPrd.manager.find(Product, {
            relations: ['Category'],
            where: {
                Category: { name: item.Category.name },
            },
        });

        res.render('Website/product_detail_wbs', { item: item, items: items, layout: 'layouts/layoutHome' });
    } catch (e: any) {
        res.status(500).send(e.message);
    }
});

//gio hàng
itemsRouter.get('/cart', async (req: Request, res: Response) => {
    try {
        res.render('Website/shopping_cart', { layout: 'layouts/layoutHome' });
    } catch (e: any) {
        res.status(500).send(e.message);
    }
});

//search page

itemsRouter.get('/search_page', async (req: Request, res: Response) => {
    try {
        const keyword = req.query.search;

        const products = await repositoryPrd.manager.find(Product, {
            relations: ['Category'],
            where: {
                name: Like(`%${keyword}%`),
                description: Like(`%${keyword}%`),
            },
        });
        res.render('Website/search_page', { list: products, layout: 'layouts/layoutHome' });
    } catch (e: any) {
        res.status(500).send(e.message);
    }
});

//mua hàng
itemsRouter.get('/create_order/:id', async (req: Request, res: Response) => {
    const id: number = parseInt(req.params.id, 10);
    try {
        const item = await repositoryPrd.manager.findOne(Product, { where: { id: id }, relations: ['Category'] });
        const items = await repositoryPrd.manager.find(Product, {
            relations: ['Category'],
            where: {
                Category: { name: item.Category.name },
            },
        });

        res.render('Website/create_order_user', { item: item, items: items, layout: 'layouts/layoutHome' });
    } catch (e: any) {
        res.status(500).send(e.message);
    }
});

//mua hàng

//forwebsite

//get product
itemsRouter.get('/admin', async (req: Request, res: Response) => {
    try {
        const products = await repositoryPrd.manager.find(Product, {
            relations: ['Category'],
        });
        const dem = 0;
        res.render('Products_admin/admin', {
            list: products,
            title: 'Danh sách sản phẩm',
            dem: dem,
            layout: 'layouts/layout',
        });
    } catch (e: any) {
        res.status(500).send(e.message);
    }
});

//add product
itemsRouter.post('/add', upload.single('image'), async (req: Request, res: Response) => {
    const categoryId: number = parseInt(req.body.category, 10);
    try {
        const category = await repositoryCat.findOneOrFail({ where: { id: categoryId } });
        // Lấy danh mục từ database bằng ID được chọn trong form
        const addItem = await AppDataSource.createQueryBuilder()
            .insert()
            .into(Product)
            .values({
                name: req.body.name.toUpperCase(),
                description: req.body.description,
                quantity: req.body.quantity,
                price: req.body.price,
                image: req.file.filename,
                Category: { id: category.id },
            })

            .execute();
        return res.redirect('/admin');
    } catch (e) {
        return res.status(500).send(e.message);
    }
});

//edit product
itemsRouter.post('/edit/:id', upload.single('image'), async (req: Request, res: Response) => {
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
        return res.redirect('/admin');
    } catch (e) {
        return res.status(500).send(e.message);
    }
});

//get product_detail
itemsRouter.get('/prd_detail/:id', async (req: Request, res: Response) => {
    const id: number = parseInt(req.params.id, 10);
    try {
        const item = await repositoryPrd.manager.findOne(Product, { where: { id: id }, relations: ['Category'] });

        res.render('Products_admin/prd_detail', { item: item, layout: 'layouts/layout' });
    } catch (e: any) {
        res.status(500).send(e.message);
    }
});

//delete product
itemsRouter.get('/delete/:id', async (req: Request, res: Response) => {
    try {
        const id: number = parseInt(req.params.id, 10);
        const item = await repositoryPrd.findOne({
            where: { id: id },
        });
        // Kiểm tra xem sản phẩm có tồn tại hay không
        await repositoryPrd.delete(id);
        // Hiển thị trang xác nhận xóa sản phẩm

        // Giảm ID của các bản ghi khác đi 1
        const count = await repositoryPrd.count();
        if (count === 0) {
            await repositoryPrd.query('ALTER table product AUTO_INCREMENT = 0');
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
        const categories = await repositoryCat.find();

        res.render('Products_admin/add_product', { categories: categories, layout: 'layouts/crud' });
    } catch (e: any) {
        res.status(500).send(e.message);
    }
});

// GET items/:id
itemsRouter.get('/edit_product/:id', async (req: Request, res: Response) => {
    const id: number = parseInt(req.params.id, 10);
    try {
        // let item = await repositoryPrd.findOne({ where: { id: id } });
        const categories = await repositoryCat.find();
        const item = await repositoryPrd.manager.findOne(Product, { where: { id: id }, relations: ['Category'] });

        res.render('Products_admin/edit_product', { item: item, categories: categories, layout: 'layouts/crud' });
    } catch (e: any) {
        res.status(500).send(e.message);
    }
});

//category
//category
var storagecat = multer.diskStorage({
    destination: path.resolve(__dirname, '../public/img/category'),
    filename: function (req, file, cb) {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
    },
});
var uploadcat = multer({
    storage: storagecat,
});

//get category
itemsRouter.get('/category_admin', async (req: Request, res: Response) => {
    try {
        const cate = await repositoryCat.manager.find(Category);
        // const allPhotos = await items.find()
        res.render('Categories_admin/category', { list: cate, title: 'Danh sách danh mục', layout: 'layouts/layout' });
    } catch (e: any) {
        res.status(500).send(e.message);
    }
});

//post category
itemsRouter.post('/add_cate', uploadcat.single('image'), async (req: Request, res: Response) => {
    try {
        // Lấy giá trị của trường 'name' từ request body
        const categoryName = req.body.name;

        // Chuyển đổi toàn bộ ký tự trong tên danh mục thành chữ in hoa
        const categoryUpperCase = categoryName.toUpperCase();

        // Lưu tên danh mục vào cơ sở dữ liệu
        const addCate = await AppDataSource.createQueryBuilder()
            .insert()
            .into(Category)
            .values({
                name: categoryUpperCase,
                image: req.file.filename,
                subname: unidecode(req.body.name.toLowerCase().replace(/\s+/g, '_')),
            })
            .execute();
        return res.redirect('/category_admin');
    } catch (e) {
        return res.status(500).send(e.message);
    }
});

//post edit category
itemsRouter.post('/edit_cate/:id', uploadcat.single('image'), async (req: Request, res: Response) => {
    const id: number = parseInt(req.params.id, 10);

    try {
        const item = await repositoryCat.findOneOrFail({ where: { id: id } });
        const updatedCate = await AppDataSource.createQueryBuilder()
            .update(Category)
            .set({
                name: req.body.name.toUpperCase(),
                image: req.file ? req.file.filename : item.image,
                subname: unidecode(req.body.name.toLowerCase().replace(/\s+/g, '_')),
            })
            .where('id = :id', { id: id })
            .execute();
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
            where: { id: id },
        });
        // Kiểm tra xem sản phẩm có tồn tại hay không
        await repositoryCat.delete(id);
        // Hiển thị trang xác nhận xóa sản phẩm

        // Giảm ID của các bản ghi khác đi 1
        await repositoryCat
            .createQueryBuilder()
            .update(cate)
            .set({ id: () => 'id - 1' })
            .where('id > :id', { id: id })
            .execute();
        const count = await repositoryCat.count();
        if (count === 0) {
            await repositoryPrd.query('ALTER table category AUTO_INCREMENT = 1');
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
        const categories = await repositoryCat.find();
        res.render('Categories_admin/add_category', { cates: categories, layout: 'layouts/crud' });
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

        res.render('Categories_admin/edit_category', { cate: cate, layout: 'layouts/crud' });
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
itemsRouter.post('/add_ord/:id', async (req: Request, res: Response) => {
    const prdid: number = parseInt(req.params.id, 10);
    try {
        const Order_detail = await repositoryOrd_detail.manager.findOne(order_products_product, {
            relations: ['product', 'order'],
            where: {
                product: { id: prdid },
            },
        });
        const productt = await repositoryPrd.findOne({
            where: {
                id: prdid,
            },
        });
        var madon: string = (
            req.body.costumer.slice(0, 2) +
            req.body.phone.toString().slice(-4) +
            req.body.address.slice(-2)
        ).toUpperCase();
        const sum: number = productt.price * req.body.quantity_oder;
        const addItem = await AppDataSource.createQueryBuilder()
            .insert()
            .into(Orders)
            .values({
                name: madon,
                status: 'Chưa xác nhận',
                costumer: req.body.costumer,
                address: req.body.address,
                phone: req.body.phone,
                sumtotal: sum,
            })
            .execute();
        const orderId = addItem.identifiers[0].id;
        const addOrderDetail = await AppDataSource.createQueryBuilder()
            .insert()
            .into(order_products_product)
            .values({
                orderId: orderId,
                productId: prdid,
                name_prd: Order_detail.product.name,
                price: Order_detail.product.price,
                quantity: req.body.quantity_oder,
                total: Order_detail.product.price * req.body.quantity_oder,
            })
            .execute();
        // console.log("req.body: ", req.body);
        // console.log("Order_detail: ", Order_detail);

        // console.log("addItem: ", addItem);
        // console.log("addOrderDetail: ", addOrderDetail);
        // console.log("addOrderDetail: ", addOrderDetail);

        return res.redirect('/');
    } catch (e) {
        return res.status(500).send('Lỗi khi thêm dữ liệu vào cơ sở dữ liệu');
    }
});

// POST items: edit
itemsRouter.post('/edit_ord/:id', async (req: Request, res: Response) => {
    const id: number = parseInt(req.params.id, 10);
    try {
        // const item = await repositoryOrd.findOneOrFail({ where: { id: id } });
        const updatedItem = await AppDataSource.createQueryBuilder()
            .update(Orders)
            .set({
                name: req.body.name,
                status: req.body.status,
                costumer: req.body.costumer,
                address: req.body.address,
                phone: req.body.phone,
                date: req.body.date,
            })
            .where('id = :id', { id: id })
            .execute();
        return res.redirect('/admin');
    } catch (e) {
        return res.status(500).send(e.message);
    }
});

//get product_detail
itemsRouter.get('/prd_detail/:id', async (req: Request, res: Response) => {
    const id: number = parseInt(req.params.id, 10);
    try {
        const item = await repositoryPrd.manager.findOne(Product, { where: { id: id }, relations: ['Category'] });

        res.render('Products_admin/prd_detail', { item: item, layout: 'layouts/layout' });
    } catch (e: any) {
        res.status(500).send(e.message);
    }
});

//delete product
itemsRouter.get('/delete/:id', async (req: Request, res: Response) => {
    try {
        const id: number = parseInt(req.params.id, 10);
        const item = await repositoryPrd.findOne({
            where: { id: id },
        });
        // Kiểm tra xem sản phẩm có tồn tại hay không
        await repositoryPrd.delete(id);
        // Hiển thị trang xác nhận xóa sản phẩm

        // Giảm ID của các bản ghi khác đi 1
        await repositoryPrd
            .createQueryBuilder()
            .update(item)
            .set({ id: () => 'id - 1' })
            .where('id > :id', { id: id })
            .execute();
        const count = await repositoryPrd.count();
        if (count === 0) {
            await repositoryPrd.query('ALTER table product AUTO_INCREMENT = 1');
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
        const categories = await repositoryCat.find();

        res.render('Products_admin/add_product', { categories: categories, layout: 'layouts/crud' });
    } catch (e: any) {
        res.status(500).send(e.message);
    }
});

// GET items/:id
itemsRouter.get('/edit_product/:id', async (req: Request, res: Response) => {
    const id: number = parseInt(req.params.id, 10);
    try {
        // let item = await repositoryPrd.findOne({ where: { id: id } });
        const categories = await repositoryCat.find();
        const item = await repositoryPrd.manager.findOne(Product, { where: { id: id }, relations: ['Category'] });

        res.render('Products_admin/edit_product', { item: item, categories: categories, layout: 'layouts/crud' });
    } catch (e: any) {
        res.status(500).send(e.message);
    }
});

//category
//category
var storagecat = multer.diskStorage({
    destination: path.resolve(__dirname, '../public/img/category'),
    filename: function (req, file, cb) {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
    },
});
var uploadcat = multer({
    storage: storagecat,
});

//get category
itemsRouter.get('/category_admin', async (req: Request, res: Response) => {
    try {
        const cate = await repositoryCat.manager.find(Category);
        // const allPhotos = await items.find()
        res.render('Categories_admin/category', { list: cate, title: 'Danh sách danh mục', layout: 'layouts/layout' });
    } catch (e: any) {
        res.status(500).send(e.message);
    }
});

//post category
itemsRouter.post('/add_cate', uploadcat.single('image'), async (req: Request, res: Response) => {
    try {
        // Lấy giá trị của trường 'name' từ request body
        const categoryName = req.body.name;

        // Chuyển đổi toàn bộ ký tự trong tên danh mục thành chữ in hoa
        const categoryUpperCase = categoryName.toUpperCase();

        // Lưu tên danh mục vào cơ sở dữ liệu
        const addCate = await AppDataSource.createQueryBuilder()
            .insert()
            .into(Category)
            .values({
                name: categoryUpperCase,
                image: req.file.filename,
                subname: unidecode(req.body.name.toLowerCase().replace(/\s+/g, '_')),
            })
            .execute();
        return res.redirect('/category_admin');
    } catch (e) {
        return res.status(500).send(e.message);
    }
});

//post edit category
itemsRouter.post('/edit_cate/:id', uploadcat.single('image'), async (req: Request, res: Response) => {
    const id: number = parseInt(req.params.id, 10);

    try {
        const item = await repositoryCat.findOneOrFail({ where: { id: id } });
        const updatedCate = await AppDataSource.createQueryBuilder()
            .update(Category)
            .set({
                name: req.body.name.toUpperCase(),
                image: req.file ? req.file.filename : item.image,
                subname: unidecode(req.body.name.toLowerCase().replace(/\s+/g, '_')),
            })
            .where('id = :id', { id: id })
            .execute();
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
            where: { id: id },
        });
        // Kiểm tra xem sản phẩm có tồn tại hay không
        await repositoryCat.delete(id);
        // Hiển thị trang xác nhận xóa sản phẩm

        // Giảm ID của các bản ghi khác đi 1
        await repositoryCat
            .createQueryBuilder()
            .update(cate)
            .set({ id: () => 'id - 1' })
            .where('id > :id', { id: id })
            .execute();
        const count = await repositoryCat.count();
        if (count === 0) {
            await repositoryPrd.query('ALTER table category AUTO_INCREMENT = 1');
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
        const categories = await repositoryCat.find();
        res.render('Categories_admin/add_category', { cates: categories, layout: 'layouts/crud' });
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

        res.render('Categories_admin/edit_category', { cate: cate, layout: 'layouts/crud' });
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
>>>>>>> Stashed changes
    } catch (e: any) {
        res.status(500).send(e.message);
    }
});

// POST items
itemsRouter.post('/', async (req: Request, res: Response) => {
    try {
        const item: Product = req.body;

        const newItem = await repository.save(item);

<<<<<<< Updated upstream
        res.status(201).json(newItem);
=======
        return res.redirect('/');
    } catch (e) {
        console.log('Error: ', e);
        return res.status(500).send('Lỗi khi thêm dữ liệu vào cơ sở dữ liệu');
    }
});

// POST items: edit
itemsRouter.post('/edit_ord/:id', async (req: Request, res: Response) => {
    const id: number = parseInt(req.params.id, 10);
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
        // Lấy đối tượng đơn hàng cần xác nhận
        const order = await repositoryOrd.findOneOrFail({ where: { id: id } });

        // Lấy danh sách sản phẩm trong đơn hàng
        const productsInOrder = await queryRunner.manager.find(order_products_product, { where: { orderId: id } });

        // Cập nhật số lượng sản phẩm và trừ đi số lượng sản phẩm trong bảng Product tương ứng
        for (const product of productsInOrder) {
            const productToUpdate = await repositoryPrd.findOneOrFail({ where: { id: product.productId } });
            const quantityToUpdate = productToUpdate.quantity - product.quantity;
            await repositoryPrd.update(product.productId, { quantity: quantityToUpdate });
        }

        // Cập nhật trạng thái đơn hàng
        const updatedItem = await queryRunner.manager.update(Orders, id, { status: 'Xác nhận' });

        await queryRunner.commitTransaction();
        return res.redirect('/order_admin');
    } catch (e) {
        await queryRunner.rollbackTransaction();
        return res.status(500).send(e.message);
    } finally {
        await queryRunner.release();
    }
});

// GET items/:id //detail
itemsRouter.get('/ord_detail/:id', async (req: Request, res: Response) => {
    const prdid: number = parseInt(req.params.id, 10);
    try {
        const item = await repositoryOrd_detail.manager.findOne(order_products_product, {
            relations: ['product', 'order'],
            where: {
                product: { id: prdid },
            },
            // select: ['name_prd', 'quantity', 'price', 'total'],
        });

        res.render('Orders_admin/ord_detail', { item: item, layout: 'layouts/crud' });
    } catch (e: any) {
        res.status(500).send(e.message);
    }
});

//DELETE items/:id
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
            await repositoryOrd.query('ALTER table orders AUTO_INCREMENT = 1');
        }
        res.redirect('/order_admin');
>>>>>>> Stashed changes
    } catch (e) {
        res.status(500).send(e.message);
    }
});

<<<<<<< Updated upstream
// PUT items/:id
// itemsRouter.put("/:id", async (req: Request, res: Response) => {
//     const id: number = parseInt(req.params.id, 10);

//     try {
//       const itemUpdate: Item = req.body;

//       const existingItem: Item = await ItemService.find(id);

//       if (existingItem) {
//         const updatedItem = await ItemService.update(id, itemUpdate);
//         return res.status(200).json(updatedItem);
//       }

//       const newItem = await ItemService.create(itemUpdate);

//       res.status(201).json(newItem);
//     } catch (e) {
//       res.status(500).send(e.message);
//     }
//   });

// DELETE items/:id
itemsRouter.delete('/:id', async (req: Request, res: Response) => {
    try {
        const id: number = parseInt(req.params.id, 10);
        await repository.delete(id);

        res.sendStatus(204);
    } catch (e) {
        res.status(500).send(e.message);
    }
});

// GET items/:id
itemsRouter.get('/:id', async (req: Request, res: Response) => {
    const id: number = parseInt(req.params.id, 10);

    try {
        const item = await repository.find({ where: { id: id } });

        if (item) {
            return res.status(200).send(item);
        }

        res.status(404).send('item not found');
    } catch (e) {
=======
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
        let statuss: string[] = ['Chưa xác nhận', 'Xác nhận'];
        let localdate = moment.utc(item.date).local().format('YYYY-MM-DD');
        res.render('Orders_admin/edit_order', { localdate, item: item, statuss: statuss, layout: 'layouts/crud' });
    } catch (e: any) {
>>>>>>> Stashed changes
        res.status(500).send(e.message);
    }
});
