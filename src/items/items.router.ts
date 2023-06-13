/**
 * Required External Modules and Interfaces
 */
import express from 'express';
import { Request, Response } from 'express';
import * as ItemService from './items.service';
import { BaseItem, Item } from './item.interface';
import { AppDataSource } from '../data-source';
import { Product } from '../entity/product';
/**
 * Router Definition
 */
AppDataSource.initialize()
    .then(() => {
        console.log('Connected!');
    })
    .catch((error) => console.log('Lỗi' + error));

export const itemsRouter = express.Router();
const repository = AppDataSource.getRepository(Product);

/**
 * Controller Definitions
 */

// GET items
itemsRouter.get('/', async (req: Request, res: Response) => {
    try {
        // const items: Item[] = await ItemService.findAll();
        // console.log("a");
        // console.log("b");
        // eslint-disable-next-line prefer-const
        let it = await repository.find();
        console.log(it);

        // const allPhotos = await items.find()
        res.render('items/ds', { list: it, title: 'Danh sách sản phẩm' });
        // res.status(200).send(items);
    } catch (e: any) {
        res.status(500).send(e.message);
    }
});

// POST items
itemsRouter.post('/', async (req: Request, res: Response) => {
    try {
        const item: Product = req.body;

        const newItem = await repository.save(item);

        res.status(201).json(newItem);
    } catch (e) {
        res.status(500).send(e.message);
    }
});

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
        res.status(500).send(e.message);
    }
});
