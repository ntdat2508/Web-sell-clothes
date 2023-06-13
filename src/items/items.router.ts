/**
 * Required External Modules and Interfaces
 */
import express from 'express';
import { Request, Response } from 'express';
import * as ItemService from './items.service';
import { BaseItem, Item } from './item.interface';
import { AppDataSource } from '../data-source';
import { Product } from '../entity/product';
import { title } from 'process';
/**
 * Router Definition
 */
AppDataSource.initialize()
    .then(() => {
        console.log('Connected!');
    })
    .catch((error) => console.log('Loi' + error));

export const itemsRouter = express.Router();
const repository = AppDataSource.getRepository(Product);

/**
 * Controller Definitions
 */

// GET items
itemsRouter.get('/admin', async (req: Request, res: Response) => {
    res.render('dashboard_addprd');
});
itemsRouter.get('/', async (req: Request, res: Response) => {
    try {
        // eslint-disable-next-line prefer-const
        let it = await repository.find();
        console.log(it);

        // const allPhotos = await items.find()
        res.render('admin', { list: it, title: 'Danh sách sản phẩm' });
        // res.status(200).send(items);
    } catch (e: any) {
        res.status(500).send(e.message);
    }
});

// POST items
itemsRouter.post('/add', async (req: Request, res: Response) => {
    try {
        const item: Product = req.body;
        const newItem = await repository.save(item);

        // res.status(201).json(newItem);
        return res.redirect('/');
    } catch (e) {
        return res.status(500).send(e.message);
    }
});

// POST items: edit
itemsRouter.post('/edit/:id', async (req: Request, res: Response) => {
    const id: number = parseInt(req.params.id, 10);

    try {
        // eslint-disable-next-line prefer-const
        let item: Product = { id: id, ...req.body };

        await repository.save(item);
        return res.redirect('/');
    } catch (e) {
        return res.status(500).send(e.message);
    }
});

// PUT items/:id
// itemsRouter.put("/edit/:id", async (req: Request, res: Response) => {
//     const id: number = parseInt(req.params.id, 10);

//     try {
//       const itemUpdate: Item = req.body;

//       const existingItem: Item = await ItemService.find(id);

//       if (existingItem) {
//         const updatedItem = await ItemService.update(id, itemUpdate);
//         // return res.status(200).json(updatedItem);
//         return res.redirect("/");
//       }

//       const newItem = await ItemService.create(itemUpdate);

//       // res.status(201).json(newItem);
//       return res.redirect("/");
//     } catch (e) {
//       return res.status(500).send(e.message);
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
itemsRouter.get('/add_product', async (req: Request, res: Response) => {
    const id: number = parseInt(req.params.id, 10);
    try {
        // if(!isNaN(id)) {
        // const item = await repository.find({where:{id:id}});
        //   if (item) {
        //     return res.status(200).send(item);
        //   }
        // }
        // if (req.params.id ! == "add") {
        res.render('add_product');
        // }
        // else if (req.params.id ! == "edit") {
        //   res.render("items/edit");
        // }
    } catch (e: any) {
        res.status(500).send(e.message);
    }
});

// GET items/:id
itemsRouter.get('/edit_product/:id', async (req: Request, res: Response) => {
    const id: number = parseInt(req.params.id, 10);
    try {
        // if(!isNaN(id)) {
        const item = await repository.find({ where: { id: id } });

        res.render('edit_product', { item: item });
    } catch (e: any) {
        res.status(500).send(e.message);
    }
});
