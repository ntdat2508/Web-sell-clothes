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
import { order_products_product } from '../entity/order_products_product';
import { Cart } from '../entity/Cart';
import { title } from 'process';
import multer from 'multer';
import { Relation } from 'typeorm';
import path, { join } from 'path';
import expressEjsLayouts from 'express-ejs-layouts';
import { isArray } from 'util';
import { type } from 'os';
import { And, Between, Like } from 'typeorm';
import { count } from 'console';
import { User } from '../entity/User';
import bcrypt from 'bcrypt';
import moment from 'moment-timezone';
import { AuthenticatedRequest } from './items.interface';
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
const repositoryOrd = AppDataSource.getRepository(Order);
const repositoryOrd_detail = AppDataSource.getRepository(order_products_product);
const repositoryUser = AppDataSource.getRepository(User);
const repositoryCart = AppDataSource.getRepository(Cart);
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
          
        res.render('Website/home', { list:products,layout:'layouts/layoutHome' });
    
    } catch (e: any) {
        res.status(500).send(e.message);
    }
});

//lọc sản phẩm cate
itemsRouter.get('/categories/:category', async (req: Request, res: Response) => {
    try { 
        let minprice=req.query.filterPricemin;
        let maxprice=req.query.filterPricemax;
        let min=0;
        let max= 2000000000;
        if (typeof minprice === "string" && typeof maxprice === "string") {
             min = parseFloat(minprice);
             max= parseFloat(maxprice);
        }
        const sapxep = req.query.sort;
        const categoryName:string = req.params.category.toLowerCase().replace(/[^\w]/g, "_"); //laygiatri duong dan + chuyenthanh chu thuong
        const products = await repositoryPrd.manager.find(Product, {
            relations: ['Category'],  where: { 
            Category: { subname:categoryName },
            price: Between(min, max)
            },
            order: sapxep === "a_z" ? { name: "ASC" } : sapxep === "z_a" ? { name: "DESC" } : sapxep === "thap_cao" ? { price: "ASC" } : { price: "DESC" }
           
        });
        const categories = await repositoryCat.find();
        const Category = await repositoryCat.findOne({
            where:{
                subname:categoryName
            }
        });
        res.render(`Website/categories/${categoryName}`, { list:products ,categories:categories,Category:Category,sapxep:sapxep,layout:'./layouts/layoutcategory' });
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


//search page

itemsRouter.get('/search_page', async (req: Request, res: Response) => {
    try {
        const keyword= req.query.search;
        
        const products = await repositoryPrd.manager.find(Product, {
            relations: ['Category'],where:{
                name:Like(`%${keyword}%`),
                description:Like(`%${keyword}%`),
            }
          });
        res.render('Website/search_page', { list:products ,layout:'layouts/layoutHome' });
    
    } catch (e: any) {
        res.status(500).send(e.message);
    }
});



//mua hàng
itemsRouter.get('/create_order/:id', async (req: Request, res: Response) => {
    const id: number = parseInt(req.params.id, 10);
    try {
          const item = await repositoryPrd.manager.findOne(Product,{
            relations: ['Category'], where:{
               id:id
            }
          });
        res.render('Website/create_order_user', { item:item, layout: 'layouts/layoutHome'});
    } catch (e: any) {
        res.status(500).send(e.message);
    }
});

//page cam on
//gio hàng
itemsRouter.get('/dearcustomer/:id', async (req: Request, res: Response) => {
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
        res.render('Website/ThankCustom', { item: item,items:items,layout: 'layouts/layoutHome'});
    } catch (e: any) {
        res.status(500).send(e.message);
    }
});





//dangnhap dangki

itemsRouter.get('/login', async (req: Request, res: Response) => {
    try {
        res.render('Website/Login/login', { layout: 'layouts/layoutHome' });
    } catch (e: any) {
        res.status(500).send(e.message);
    }
});

itemsRouter.post('/admin', async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;
        // Lấy thông tin user từ bảng user
        const user = await repositoryUser.manager.findOne(User, {
            where: { username },
        });
        if (!user) {
            // Người dùng không tồn tại
            return res.send('Tên đăng nhập hoặc mật khẩu không đúng');
        }
        // Kiểm tra mật khẩu
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            // Sai mật khẩu
            return res.send('Tên đăng nhập hoặc mật khẩu không đúng');
        }
        // Kiểm tra role của người dùng
        if (user.role === 'admin') {
            // Nếu role là admin, chuyển hướng đến trang quản trị
            const products = await repositoryPrd.manager.find(Product, {
                relations: ['Category'],
            });
            // res.render('Products_admin/admin', {
            //     list: products,
            //     title: 'Danh sách sản phẩm',
            //     layout: 'layouts/layout',
            // });
            res.redirect('/admin');
        } else {
            const products = await repositoryPrd.manager.find(Product, {
                relations: ['Category'],
            });
            // Nếu role là user, chuyển hướng đến trang chính
            res.redirect('/');
        }
    } catch (e: any) {
        res.status(500).send(e.message);
    }
});

//Signup
interface SignupFormErrors {
    username?: string;
    email?: string;
    password?: string;
    'password-confirmation'?: string;
}

function validateSignupForm(body: any): SignupFormErrors {
    const errors: SignupFormErrors = {};

    if (!body.username || body.username.trim().length < 3) {
        errors.username = 'Username phải dài hơn 3 ký tự';
    }

    if (!body.email || !/^\S+@\S+\.\S+$/.test(body.email)) {
        errors.email = 'Email không hợp lệ';
    }

    if (!body.password || body.password.trim().length < 3) {
        errors.password = 'Mật khẩu phải dài hơn 3 ký tự';
    }

    if (body.password !== body['password-confirmation']) {
        errors['password-confirmation'] = 'Mật khẩu không khớp';
    }

    return errors;
}

itemsRouter.get('/signup', async (req: Request, res: Response) => {
    try {
        res.render('Website/Login/signup', { layout: 'layouts/layoutHome' });
    } catch (e: any) {
        res.status(500).send(e.message);
    }
});

itemsRouter.post('/signup', async (req: Request, res: Response) => {
    const errors = validateSignupForm(req.body);

    if (Object.keys(errors).length > 0) {
        res.send({ errors });
    }
    try {
        let salt = bcrypt.genSaltSync(10);
        let pass_mahoa = bcrypt.hashSync(req.body.password, salt);
        const addItem = await AppDataSource.createQueryBuilder()
            .insert()
            .into(User)
            .values({
                username: req.body.username,
                email: req.body.email,
                password: pass_mahoa,
            })

            .execute();
        return res.redirect('login');
    } catch (e: any) {
        res.status(500).send(e.message);
    }
});




//thêm giỏ hàng

itemsRouter.post('/add-to-cart', async (req: AuthenticatedRequest, res: Response) => {
    try {
        const productId = req.body.productId;
        const userId = req.user ? req.user.id : null;

        // Tìm giỏ hàng của người dùng
        const cart = await repositoryCart.findOne({ where: { user: { id: userId }, product: { id: productId } } });
        if (!cart) {
            // Nếu không tìm thấy giỏ hàng, tạo một bản ghi mới
            const product = await repositoryPrd.findOneOrFail({
                where: { id: productId },
            });
            const user = await repositoryUser.findOneOrFail({ where: { id: userId } });
            const cartItems = await repositoryCart.createQueryBuilder().insert().into(Cart).values({
                quantity: 1,
                productName: product.name,
                productPrice: product.price,
                productImage: product.image,
                userId: user.id,
                productId: product.id,
            });
        } else {
            // Nếu sản phẩm đã tồn tại trong giỏ hàng, tăng số lượng sản phẩm
            cart.quantity += 1;
            await repositoryCart.save(cart);
        }

        // Chuyển hướng người dùng đến trang giỏ hàng
        res.redirect('/shopping_cart');
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Đã có lỗi xảy ra' });
    }
});

//get shopping cart
itemsRouter.get('/shopping_cart', async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user ? req.user.id : null;
        const cartItems = await repositoryCart.find({ where: { user: { id: userId } } });
        res.render('Website/shopping_cart', { cartItems: cartItems, layout: 'layouts/layoutHome' });
    } catch (e: any) {
        res.status(500).send(e.message);
    }
});

//item get delete cart
itemsRouter.get('/delete_cart/:id', async (req: Request, res: Response) => {
    try {
        const id: number = parseInt(req.params.id);
        const cart = await repositoryCart.findOne({
            where: { id: id },
        });
        // Kiểm tra xem sản phẩm có tồn tại hay không
        await repositoryCart.delete(id);
        // Hiển thị trang xác nhận xóa sản phẩm

        // Giảm ID của các bản ghi khác đi 1
        await repositoryCart
            .createQueryBuilder()
            .update(cart)
            .set({ id: () => 'id - 1' })
            .where('id > :id', { id: id })
            .execute();
        const count = await repositoryCart.count();
        if (count === 0) {
            await repositoryCart.query('ALTER table category AUTO_INCREMENT = 1');
        }
        res.redirect('Website/home');
    } catch (e) {
        return res.status(500).send(e.message);
    }
});

//end cart


//forwebsite


//get product
itemsRouter.get('/admin', async (req: Request, res: Response) => {
    try {
        const products = await repositoryPrd.manager.find(Product, {
            relations: ['Category'],
          });
        const dem=0;
        res.render('Products_admin/admin', { list: products, title: 'Danh sách sản phẩm',dem:dem, layout:'layouts/layout' });
    
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
            const count = await repositoryPrd.count();
            if (count === 0) {
              await repositoryPrd.query("ALTER table product AUTO_INCREMENT = 0");
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

//taodon
itemsRouter.post('/add_ord/:id', async (req: Request, res: Response) => {
    const prdid: number = parseInt(req.params.id, 10);
    try {
        const productt = await repositoryPrd.findOne({
            where:{
                id: prdid
            }
        })
        var madon:string=((req.body.costumer).slice(0,2)+(req.body.phone).toString().slice(-4)+unidecode((req.body.address)).slice(-2)).toUpperCase()
        const sum:number=productt.price * req.body.quantity_oder;
        const addItem = await AppDataSource.createQueryBuilder()
            .insert()
            .into(Order)
            .values({
                name: madon,
                status: "Chưa xác nhận",
                costumer: req.body.costumer,
                address: req.body.address,
                phone: req.body.phone,
                sumtotal :sum,
            })
            .execute();
            const orderId = addItem.identifiers[0].id;
            const addOrderDetail = await AppDataSource.createQueryBuilder()
            .insert()
            .into(order_products_product)
            .values({
                orderId:orderId,
                productId:prdid,
                name_prd:productt.name,
                price: productt.price,
                quantity: req.body.quantity_oder,
                total :  productt.price * req.body.quantity_oder
            })
            .execute();
            // console.log("req.body: ", req.body);
            // console.log("Order_detail: ", Order_detail);
           
            // console.log("addItem: ", addItem);
            // console.log("addOrderDetail: ", addOrderDetail);
            // console.log("addOrderDetail: ", addItem);
        
            return res.redirect(`/dearcustomer/${prdid}`);
   
     
    } catch (e) {
        console.log(e)
        return res.status(500).send("Lỗi khi thêm dữ liệu vào cơ sở dữ liệu");
    }
});

//POST items: edit
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
        const updatedItem = await queryRunner.manager.update(Order, id, { status: 'Xác nhận' });

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
    const orderId: number = parseInt(req.params.id, 10);
    try {
        const item = await repositoryOrd_detail.manager.findOne(order_products_product, {
            relations: ['product', 'order'],
            where: {
                order: { id: orderId },
            },
        });

        res.render('Orders_admin/ord_detail', { item: item, layout: 'layouts/crud' });
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
        res.status(500).send(e.message);
    }
});

// DELETE items/:id
itemsRouter.get('/delete_ord/:id', async (req: Request, res: Response) => {
    const id: number = parseInt(req.params.id, 10);
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
        // Xóa bản ghi trong bảng order_products_product liên quan đến đơn hàng
        await queryRunner.manager.delete(order_products_product, { orderId: id });

        // Xóa đơn hàng
        await queryRunner.manager.delete(Order, id);
        await queryRunner.commitTransaction();
        res.redirect('/order_admin');
    } catch (e) {
        await queryRunner.rollbackTransaction();
        res.status(500).send(e.message);
    } finally {
        await queryRunner.release();
    }
});







